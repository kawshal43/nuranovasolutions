import { execFileSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { dirname, join } from "node:path";

const isWindows = process.platform === "win32";
const args = new Set(process.argv.slice(2));
const backendOnly = args.has("--backend-only");
const checkOnly = args.has("--check");
const npmCommand = isWindows ? "npm.cmd" : "npm";
const mavenWrapper = isWindows ? "mvnw.cmd" : "./mvnw";
const rootDir = process.cwd();
const backendDir = join(rootDir, "backend");
const preferredBackendPort = Number(process.env.BACKEND_PORT ?? 8080);

function isValidJavaHome(candidate) {
  if (!candidate || !existsSync(candidate)) {
    return false;
  }

  const javacName = isWindows ? "javac.exe" : "javac";
  return existsSync(join(candidate, "bin", javacName));
}

function detectJavaHome() {
  if (isValidJavaHome(process.env.JAVA_HOME)) {
    return process.env.JAVA_HOME;
  }

  try {
    const locator = isWindows ? "where.exe" : "which";
    const javaPath = execFileSync(locator, ["java"], { encoding: "utf8" })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean);

    if (javaPath) {
      const home = dirname(dirname(javaPath));
      if (isValidJavaHome(home)) {
        return home;
      }
    }
  } catch {
  }

  if (isWindows) {
    const commonHomes = [
      "C:\\Program Files\\Java\\jdk-17",
      "C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.12.7-hotspot",
      "C:\\Program Files\\Microsoft\\jdk-17.0.12.7-hotspot",
    ];

    return commonHomes.find((candidate) => isValidJavaHome(candidate)) ?? null;
  }

  return null;
}

function prefixStream(stream, target, label) {
  let buffer = "";

  stream.on("data", (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.length) {
        target.write(`[${label}] ${line}\n`);
      }
    }
  });

  stream.on("end", () => {
    if (buffer.length) {
      target.write(`[${label}] ${buffer}\n`);
    }
  });
}

process.stdout.on("error", (error) => {
  if (error.code === "EPIPE") {
    process.exit(0);
  }
});

process.stderr.on("error", (error) => {
  if (error.code === "EPIPE") {
    process.exit(0);
  }
});

function killChild(child) {
  if (!child || child.exitCode !== null) {
    return;
  }

  if (isWindows) {
    spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore" });
    return;
  }

  child.kill("SIGTERM");
}

function startProcess({ label, command, commandArgs, cwd, env }) {
  const child = spawn(command, commandArgs, {
    cwd,
    env,
    stdio: ["inherit", "pipe", "pipe"],
    shell: isWindows,
  });

  prefixStream(child.stdout, process.stdout, label);
  prefixStream(child.stderr, process.stderr, label);
  return child;
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = createServer();

    server.once("error", () => {
      resolve(false);
    });

    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port, "127.0.0.1");
  });
}

async function findAvailablePort(startPort, maxAttempts = 25) {
  for (let port = startPort; port < startPort + maxAttempts; port += 1) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }

  return null;
}

const javaHome = detectJavaHome();
const backendPort = await findAvailablePort(preferredBackendPort);
const backendEnv = {
  ...process.env,
  ...(javaHome ? { JAVA_HOME: javaHome } : {}),
  ...(backendPort ? { SERVER_PORT: String(backendPort) } : {}),
};
const frontendEnv = {
  ...process.env,
  ...(backendPort ? { VITE_API_BASE_URL: `http://localhost:${backendPort}` } : {}),
};

if (checkOnly) {
  process.stdout.write(`Frontend command: ${npmCommand} run dev\n`);
  process.stdout.write(`Backend command: ${mavenWrapper} spring-boot:run\n`);
  process.stdout.write(`Backend cwd: ${backendDir}\n`);
  process.stdout.write(`JAVA_HOME: ${backendEnv.JAVA_HOME ?? "not-set"}\n`);
  process.stdout.write(`Backend port: ${backendPort ?? "unavailable"}\n`);
  process.stdout.write(`Frontend API base: ${frontendEnv.VITE_API_BASE_URL ?? "not-set"}\n`);
  process.exit(0);
}

if (!existsSync(backendDir)) {
  process.stderr.write("Backend directory was not found.\n");
  process.exit(1);
}

if (!backendEnv.JAVA_HOME) {
  process.stderr.write("JAVA_HOME could not be detected. Please set JAVA_HOME before running the backend.\n");
  process.exit(1);
}

if (!backendPort) {
  process.stderr.write("No open backend port was available in the checked range.\n");
  process.exit(1);
}

const children = [];

process.stdout.write(`Using JAVA_HOME: ${backendEnv.JAVA_HOME}\n`);
process.stdout.write(`Using backend port: ${backendPort}\n`);

if (!backendOnly) {
  process.stdout.write("Starting frontend dev server...\n");
  children.push(
    startProcess({
      label: "frontend",
      command: npmCommand,
      commandArgs: ["run", "dev"],
      cwd: rootDir,
      env: frontendEnv,
    })
  );
}

process.stdout.write("Starting backend dev server...\n");
children.push(
  startProcess({
    label: "backend",
    command: mavenWrapper,
    commandArgs: ["spring-boot:run"],
    cwd: backendDir,
    env: backendEnv,
  })
);

let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  for (const child of children) {
    killChild(child);
  }

  setTimeout(() => {
    process.exit(code);
  }, 250);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

for (const child of children) {
  child.on("exit", (code) => {
    shutdown(code ?? 0);
  });
}
