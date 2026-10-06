#!/usr/bin/env node
// =============================================================================
// escanear-secretos.mjs — Playbook de prototipos
// -----------------------------------------------------------------------------
// Un solo escáner para tres momentos:
//   --hook        Hook PreToolUse de Claude Code (lee JSON por stdin).
//                 Bloquea (exit 2) git commit/push con secretos o con --no-verify.
//   --staged      Hook pre-commit de git (.githooks/pre-commit). Exit 1 si hay secretos.
//   --todo        Repo completo (versionados + nuevos no ignorados). Para /pre-deploy.
//   --ruta <dir>  Una carpeta concreta, p. ej. dist/ después del build. Para /pre-deploy.
//   --instalar    Activa .githooks como carpeta de hooks de git (desde "prepare"). Nunca falla.
//
// Falsos positivos: agrega el texto  escaneo:permitir  en un comentario de esa línea.
// Términos sensibles propios (nombres reales de clientes, etc.): un término por línea
// en .playbook-sensibles.txt en la raíz del repo (está en .gitignore).
//
// Sin dependencias. Compatible con Node 16.14+ / 18+ (Windows, macOS, Linux).
// Nunca imprime el valor de un secreto: solo archivo, línea y tipo.
// =============================================================================

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// ---------- Reglas -----------------------------------------------------------

// Secretos: bloquean.
const REGLAS_SECRETO = [
  { id: "llave-privada", re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP |ENCRYPTED )?PRIVATE KEY-----/ },
  { id: "aws-access-key", re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/ },
  { id: "github-token", re: /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{22,})/ },
  { id: "anthropic-key", re: /\bsk-ant-[A-Za-z0-9_-]{20,}/ },
  { id: "openai-key", re: /\bsk-(?:proj-|svcacct-)?(?!ant-)[A-Za-z0-9_-]{32,}/ },
  { id: "stripe-live-key", re: /\b[rs]k_live_[0-9a-zA-Z]{20,}/ },
  { id: "google-api-key", re: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { id: "slack-token", re: /\bxox[abprs]-[0-9A-Za-z-]{10,}/ },
  { id: "netlify-token", re: /\bnfp_[A-Za-z0-9]{30,}/ },
  { id: "jwt", re: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/ },
  { id: "url-con-credenciales", re: /\b[a-z][a-z0-9+.-]*:\/\/[^\s/:@'"`]+:[^\s/@'"`]+@[^\s'"`]+/i },
  {
    id: "asignacion-sospechosa",
    re: /(?:api[_-]?key|secret|token|password|passwd|pwd|contrase(?:ñ|n)a|clave)["']?\s*[:=]\s*["'`]([^"'`\s]{20,})["'`]/i,
    validar: (m) => pareceReal(m[1]),
  },
];

// Datos que parecen reales: advierten, no bloquean.
const RFC_GENERICOS = new Set(["XAXX010101000", "XEXX010101000"]);
const TLD_RESERVADOS = /\.(example|test|invalid|localhost)$/i;
const DOMINIOS_RESERVADOS = /(^|\.)example\.(com|org|net)$/i;

const REGLAS_ADVERTENCIA = [
  {
    id: "rfc-posible",
    re: /\b[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}\b/g,
    validar: (m) => !RFC_GENERICOS.has(m[0]),
  },
  { id: "curp-posible", re: /\b[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d\b/g },
  {
    id: "email-no-ficticio",
    re: /\b[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/g,
    validar: (m) => !(TLD_RESERVADOS.test(m[1]) || DOMINIOS_RESERVADOS.test(m[1])),
  },
];

const PERMITIR = "escaneo:permitir";
const EXT_BINARIAS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico", ".bmp", ".tiff", ".psd", ".fig",
  ".pdf", ".zip", ".gz", ".tgz", ".rar", ".7z", ".woff", ".woff2", ".ttf", ".otf", ".eot",
  ".mp4", ".webm", ".mov", ".mp3", ".wav", ".ogg", ".glb", ".stl", ".3mf", ".exe", ".dll",
]);
const IGNORAR_NOMBRES = new Set(["package-lock.json", "yarn.lock", "pnpm-lock.yaml", ".playbook-sensibles.txt"]);
const IGNORAR_CARPETAS = ["node_modules/", ".git/", ".angular/", ".netlify/"];
const TAMANO_MAX = 2 * 1024 * 1024;

// ---------- Utilidades -------------------------------------------------------

function pareceReal(valor) {
  if (/^(x+|\*+|\.+|0+)$/i.test(valor)) return false;
  if (/(tu_|your|changeme|cambiar|ejemplo|example|placeholder|dummy|fake|falso|xxxx|sample)/i.test(valor)) return false;
  const letras = /[A-Za-z]/.test(valor);
  const digitos = /\d/.test(valor);
  return letras && digitos && new Set(valor).size >= 10;
}

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

function lista(salida) {
  return salida ? salida.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : [];
}

function esArchivoEnv(rel) {
  const base = path.basename(rel);
  return /^\.env(\..+)?$/.test(base) && !/\.(example|sample|template)$/.test(base);
}

function debeOmitirse(rel) {
  const norm = rel.replace(/\\/g, "/");
  if (IGNORAR_CARPETAS.some((c) => norm.startsWith(c) || norm.includes("/" + c))) return true;
  if (IGNORAR_NOMBRES.has(path.basename(norm))) return true;
  if (EXT_BINARIAS.has(path.extname(norm).toLowerCase())) return true;
  return false;
}

function leerTerminosSensibles(raiz) {
  try {
    return fs
      .readFileSync(path.join(raiz, ".playbook-sensibles.txt"), "utf8")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("#"));
  } catch {
    return [];
  }
}

function escanearTexto(rel, texto, terminos, hallazgos) {
  if (texto.slice(0, 8000).includes("\u0000")) return; // binario
  const lineas = texto.split(/\r?\n/);
  lineas.forEach((linea, i) => {
    if (linea.includes(PERMITIR)) return;
    const n = i + 1;
    for (const regla of REGLAS_SECRETO) {
      const m = linea.match(regla.re);
      if (m && (!regla.validar || regla.validar(m))) {
        hallazgos.secretos.push({ archivo: rel, linea: n, tipo: regla.id });
        break; // una alerta por línea basta
      }
    }
    for (const regla of REGLAS_ADVERTENCIA) {
      regla.re.lastIndex = 0;
      let m;
      while ((m = regla.re.exec(linea)) !== null) {
        if (!regla.validar || regla.validar(m)) {
          hallazgos.advertencias.push({ archivo: rel, linea: n, tipo: regla.id });
          break;
        }
      }
    }
    if (terminos.length) {
      const baja = linea.toLowerCase();
      for (const t of terminos) {
        if (baja.includes(t.toLowerCase())) {
          hallazgos.advertencias.push({ archivo: rel, linea: n, tipo: "termino-sensible" });
          break;
        }
      }
    }
  });
}

function escanearArchivos(raiz, rutasRel, { desdeIndice = false } = {}) {
  const hallazgos = { secretos: [], advertencias: [] };
  const terminos = leerTerminosSensibles(raiz);
  const vistos = new Set();
  for (const rel of rutasRel) {
    if (vistos.has(rel)) continue;
    vistos.add(rel);
    if (esArchivoEnv(rel)) {
      hallazgos.secretos.push({ archivo: rel, linea: 0, tipo: "archivo-env" });
      continue;
    }
    if (debeOmitirse(rel)) continue;
    let texto;
    try {
      if (desdeIndice) {
        texto = execFileSync("git", ["show", ":" + rel], { cwd: raiz, encoding: "utf8", maxBuffer: TAMANO_MAX * 2, stdio: ["ignore", "pipe", "ignore"] });
      } else {
        const abs = path.join(raiz, rel);
        const st = fs.statSync(abs);
        if (!st.isFile() || st.size > TAMANO_MAX) continue;
        texto = fs.readFileSync(abs, "utf8");
      }
    } catch {
      continue;
    }
    escanearTexto(rel, texto, terminos, hallazgos);
  }
  return hallazgos;
}

function recorrerCarpeta(raizCarpeta) {
  const salida = [];
  const pila = [raizCarpeta];
  while (pila.length) {
    const actual = pila.pop();
    let entradas = [];
    try {
      entradas = fs.readdirSync(actual, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entradas) {
      const abs = path.join(actual, e.name);
      if (e.isDirectory()) {
        if (e.name === "node_modules" || e.name === ".git") continue;
        pila.push(abs);
      } else if (e.isFile()) {
        salida.push(path.relative(raizCarpeta, abs));
      }
    }
  }
  return salida;
}

function formatear(h) {
  const linea = (x) => `  - ${x.archivo}${x.linea ? ":" + x.linea : ""} → ${x.tipo}`;
  let txt = "";
  if (h.secretos.length) {
    txt += `❌ Posibles secretos (${h.secretos.length}):\n${h.secretos.map(linea).join("\n")}\n`;
  }
  if (h.advertencias.length) {
    const muestra = h.advertencias.slice(0, 40);
    txt += `⚠️  Datos que parecen reales (${h.advertencias.length}) — confirma que sean sintéticos:\n${muestra.map(linea).join("\n")}\n`;
    if (h.advertencias.length > muestra.length) txt += `  … y ${h.advertencias.length - muestra.length} más\n`;
  }
  if (!txt) txt = "✅ Sin secretos ni datos sospechosos.\n";
  return txt;
}

const AYUDA_BLOQUEO = [
  "Qué hacer:",
  "  1. Si es un secreto real: quítalo del código y guárdalo como variable de entorno (Netlify → Environment variables).",
  "     Si ya se subió alguna vez, ROTA ese secreto (genera uno nuevo); borrarlo del código no basta.",
  "  2. Si es un archivo .env: agrégalo a .gitignore y sácalo del staging (git rm --cached <archivo>).",
  "  3. Si es un falso positivo: agrega el comentario 'escaneo:permitir' en esa línea.",
  "  Nunca uses --no-verify ni cambies core.hooksPath para saltarte esta revisión.",
].join("\n");

async function leerStdin() {
  if (process.stdin.isTTY) return "";
  const partes = [];
  for await (const p of process.stdin) partes.push(p);
  return Buffer.concat(partes).toString("utf8");
}

// ---------- Modos ------------------------------------------------------------

async function modoHook() {
  let entrada;
  try {
    entrada = JSON.parse(await leerStdin());
  } catch {
    process.exit(0); // nunca romper el flujo por un JSON inesperado
  }
  if (!entrada || entrada.tool_name !== "Bash") process.exit(0);
  const cmd = String(entrada.tool_input?.command ?? "");
  const esCommit = /\bgit\b[^\n;&|]*\bcommit\b/.test(cmd);
  const esPush = /\bgit\b[^\n;&|]*\bpush\b/.test(cmd);
  if (!esCommit && !esPush) process.exit(0);

  if (/--no-verify\b/.test(cmd) || /core\.hooksPath/i.test(cmd)) {
    process.stderr.write(
      "⛔ Playbook: bloqueado. El comando intenta saltarse la revisión de secretos (--no-verify o core.hooksPath).\n" +
        "Haz el commit normal; si el escaneo marca algo, corrígelo en lugar de saltarlo.\n"
    );
    process.exit(2);
  }

  const cwd = entrada.cwd || process.cwd();
  let raiz;
  try {
    raiz = git(["rev-parse", "--show-toplevel"], cwd);
  } catch {
    process.exit(0); // no es un repo git
  }

  let archivos = [];
  if (esCommit) {
    archivos = [
      ...lista(git(["diff", "--cached", "--name-only", "--diff-filter=ACMR"], raiz)),
      ...lista(git(["diff", "--name-only", "--diff-filter=ACMR"], raiz)),
      ...lista(git(["ls-files", "--others", "--exclude-standard"], raiz)),
    ];
  }
  if (esPush) {
    try {
      archivos.push(...lista(git(["diff", "--name-only", "--diff-filter=ACMR", "@{u}...HEAD"], raiz)));
    } catch {
      archivos.push(...lista(git(["ls-files"], raiz))); // primer push: revisa todo lo versionado
    }
  }

  const h = escanearArchivos(raiz, archivos);
  if (h.secretos.length) {
    process.stderr.write(
      `⛔ Playbook: ${esPush ? "push" : "commit"} bloqueado.\n` +
        formatear({ secretos: h.secretos, advertencias: [] }) +
        AYUDA_BLOQUEO +
        "\n"
    );
    process.exit(2);
  }
  process.exit(0);
}

function modoStaged() {
  let raiz;
  try {
    raiz = git(["rev-parse", "--show-toplevel"], process.cwd());
  } catch {
    process.exit(0);
  }
  const archivos = lista(git(["diff", "--cached", "--name-only", "--diff-filter=ACMR"], raiz));
  const h = escanearArchivos(raiz, archivos, { desdeIndice: true });
  if (h.secretos.length) {
    process.stderr.write("⛔ Playbook (pre-commit): commit bloqueado.\n" + formatear(h) + AYUDA_BLOQUEO + "\n");
    process.exit(1);
  }
  if (h.advertencias.length) process.stdout.write(formatear(h));
  process.exit(0);
}

function modoTodo() {
  let raiz;
  try {
    raiz = git(["rev-parse", "--show-toplevel"], process.cwd());
  } catch {
    raiz = process.cwd();
  }
  let archivos;
  try {
    archivos = [...lista(git(["ls-files"], raiz)), ...lista(git(["ls-files", "--others", "--exclude-standard"], raiz))];
  } catch {
    archivos = recorrerCarpeta(raiz);
  }
  const h = escanearArchivos(raiz, archivos);
  process.stdout.write("Escaneo del repositorio\n" + formatear(h));
  process.exit(h.secretos.length ? 1 : 0);
}

function modoRuta(dir) {
  const abs = path.resolve(dir || ".");
  if (!fs.existsSync(abs)) {
    process.stderr.write(`No existe la carpeta: ${abs}\n`);
    process.exit(1);
  }
  const h = escanearArchivos(abs, recorrerCarpeta(abs));
  process.stdout.write(`Escaneo de ${dir}\n` + formatear(h));
  process.exit(h.secretos.length ? 1 : 0);
}

function modoInstalar() {
  try {
    git(["rev-parse", "--git-dir"], process.cwd());
    execFileSync("git", ["config", "core.hooksPath", ".githooks"], { stdio: "ignore" });
    try {
      fs.chmodSync(path.join(".githooks", "pre-commit"), 0o755);
    } catch {
      /* Windows o archivo ausente: no pasa nada */
    }
  } catch {
    /* sin git (p. ej. algunos entornos de build): no hacer nada */
  }
  process.exit(0);
}

// ---------- Entrada ----------------------------------------------------------

const args = process.argv.slice(2);
if (args.includes("--hook")) await modoHook();
else if (args.includes("--staged")) modoStaged();
else if (args.includes("--todo")) modoTodo();
else if (args.includes("--ruta")) modoRuta(args[args.indexOf("--ruta") + 1]);
else if (args.includes("--instalar")) modoInstalar();
else {
  process.stdout.write("Uso: node escanear-secretos.mjs --hook | --staged | --todo | --ruta <carpeta> | --instalar\n");
  process.exit(0);
}
