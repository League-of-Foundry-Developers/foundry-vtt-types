import { type Browser, type BrowserContext, type Page, chromium } from "playwright";
import { type ViteDevServer, createServer } from "vite";
import type { SerializedConfig } from "vitest";
import type { File } from "@vitest/runner";
import {
  type PoolOptions,
  type PoolWorker,
  type WorkerRequest,
  type WorkerResponse,
  // eslint-disable-next-line import-x/extensions
} from "vitest/node";
import dotenv from "dotenv";
import getPort from "get-port";
import pathe from "pathe";
import { EventEmitter } from "node:events";
import os from "node:os";
import net from "node:net";

// This type isn't exported.
type WorkerExecuteContext = Extract<WorkerRequest, { type: "run" }>["context"];

declare global {
  interface Window {
    __foundry_vitest__: {
      setup: (config: SerializedConfig) => void;
      run: (context: WorkerExecuteContext) => Promise<File[]>;
      collect: (context: WorkerExecuteContext) => Promise<File[]>;
    };
  }
}

const defaultFoundryUrl = "http://localhost:30000";

interface BrowserData {
  browser: Browser;
  server: ViteDevServer;
  context: BrowserContext;
}

let browserData: BrowserData | undefined;

async function setupBrowser(): Promise<BrowserData> {
  if (browserData) {
    return browserData;
  }

  loadEnv();

  const foundryUrl = await getFoundryUrl();

  const headless = process.env["HEADLESS"] !== "false";

  const args: string[] = [];
  let viewport: { width: number; height: number } | null;
  if (headless) {
    viewport = {
      width: 1024,
      height: 768,
    };
  } else {
    // Enable hardware acceleration (for performance) and start maximized.
    args.push("--enable-gpu", "--ignore-gpu-blocklist", "--start-maximized");
    viewport = null;
  }

  const browser = await chromium.launch({ headless, args });

  const context = await browser.newContext({
    baseURL: foundryUrl,
    viewport,
  });

  const server = await createServer({
    server: {
      port: await getPort(), // Random port for Hyrum's law (also to be less confusing if someone happens to running Vite).
      cors: {
        origin: foundryUrl,
      },
      hmr: false,
      watch: null,
    },
    build: {
      sourcemap: "inline",
    },
  });

  await server.listen();

  browserData = { browser, server, context };
  return browserData;
}

function loadEnv() {
  const { error } = dotenv.config({ path: ".env.local", quiet: true });
  if (error != null) {
    // dotenv mistypes the error as `dotenv.DotenvError` but fs errors like `ENOENT` can creep in.
    const realError = error as unknown;
    if (realError instanceof Error) {
      if ("code" in realError && realError.code === "ENOENT") {
        return;
      }
    }

    throw error;
  }
}

async function getFoundryUrl(): Promise<string> {
  const foundryUrl = process.env["FOUNDRY_URL"];
  if (foundryUrl != null) {
    const isRunning = await checkFoundryUrl(foundryUrl);
    if (isRunning) {
      console.info(`Using Foundry running at FOUNDRY_URL = ${foundryUrl}.`);
      return foundryUrl;
    }

    let note = "";

    const url = new URL(foundryUrl);
    if (url.hostname === "localhost" && isWSL2()) {
      note =
        " Note that WSL 2 cannot connect to Windows through localhost. If Foundry is running on Windows you must either use $(hostname).local or get the default route under ip config.";
    }

    throw new Error(`Could not connect to Foundry at FOUNDRY_URL ${foundryUrl}. Have you started Foundry?${note}`);
  }

  if (isWSL2()) {
    const hostname = os.hostname();
    const prettyWindowsUrl = `http://$(hostname).local:30000`;
    const windowsUrl = `http://${hostname}.local:30000`;

    const runningOnWindows = await checkFoundryUrl(windowsUrl);
    const runningOnWSL = await checkFoundryUrl(defaultFoundryUrl);

    if (runningOnWindows && runningOnWSL) {
      throw new Error(
        `Foundry is running on both Windows (${prettyWindowsUrl}) and WSL 2 (${defaultFoundryUrl})! Please configure FOUNDRY_URL in .env.local to disambiguate.`,
      );
    }

    if (runningOnWindows) {
      console.info(`Detected Foundry running on Windows at ${prettyWindowsUrl} (${windowsUrl}).`);
      return windowsUrl;
    }

    if (runningOnWSL) {
      console.info(`Detected Foundry running on WSL 2 at ${defaultFoundryUrl}.`);
      return defaultFoundryUrl;
    }

    throw new Error(
      `Foundry does not appear to be running; checked WSL 2 (${defaultFoundryUrl}) and Windows (${prettyWindowsUrl}). If Foundry is running on Windows and is not detected your mDNS setup may be broken. Otherwise please configure FOUNDRY_URL in .env.local if you have Foundry running elsewhere.`,
    );
  }

  const isRunning = await checkFoundryUrl(defaultFoundryUrl);
  if (!isRunning) {
    throw new Error(
      `Foundry does not appear to be running; checked ${defaultFoundryUrl}. Please configure FOUNDRY_URL in .env.local if you have Foundry running elsewhere.`,
    );
  }

  console.info(`Detected Foundry running at ${defaultFoundryUrl}.`);
  return defaultFoundryUrl;
}

async function checkFoundryUrl(foundryUrl: string): Promise<boolean> {
  const url = new URL(foundryUrl);

  let port: number | undefined = url.port !== "" ? Number(url.port) : undefined;

  if (url.protocol === "http:") {
    port ??= 80;
  } else if (url.protocol === "https:") {
    port ??= 443;
  } else {
    throw new Error(`Unexpected protocol ${url.protocol}, only http and https is supported`);
  }

  // Windows can block ICMP from WSL 2 -> Windows so only a tcp level ping works.
  const result = await tcpPing(url.hostname, port);
  return result.isSuccess;
}

// A cached value of whether the current environment is WSL
let _isWSL2: boolean | undefined = undefined;

function isWSL2(): boolean {
  if (_isWSL2 != null) {
    return _isWSL2;
  }

  _isWSL2 = os.release().endsWith("-microsoft-standard-WSL2");
  return _isWSL2;
}

function tcpPing(host: string, port: number, timeout = 3000) {
  return new Promise<{ isSuccess: true } | { isSuccess: false; error: Error }>((resolve) => {
    const socket = new net.Socket();

    socket.setTimeout(timeout);

    socket.connect(port, host, () => {
      socket.end();
      resolve({ isSuccess: true });
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve({ isSuccess: false, error: new Error("Socket timed out") });
    });

    socket.on("error", (err) => {
      socket.destroy();
      resolve({ isSuccess: false, error: err });
    });
  });
}

let isCloseSetup = false;

class CustomBrowserWorker implements PoolWorker {
  name = "custom-browser-worker";
  options: PoolOptions;

  constructor(options: PoolOptions) {
    this.options = options;
  }

  send(request: WorkerRequest): void {
    this.doRequest(request).then((response) => {
      this.events.emit("message", response);
    });
  }

  async doRequest(request: WorkerRequest): Promise<WorkerResponse> {
    const requestType = request.type;
    const { vitest } = this.options.project;

    if (requestType === "start") {
      const viteUrl = this.viteUrl;
      if (viteUrl == null) {
        throw new Error("No Vite URL! This is a bug, please contact LukeAbby.");
      }

      const testerUrl = pathe.join(viteUrl, "/@fs/", import.meta.dirname, "tester.ts");

      const page = this.getPage();
      await page.evaluate(
        async ([testerUrl, config]) => {
          await import(/* @vite-ignore */ testerUrl);

          window.__foundry_vitest__.setup(config);
        },
        [testerUrl, request.context.config] as const,
      );

      return {
        __vitest_worker_response__: true,
        type: "started",
      };
    } else if (requestType === "run") {
      const page = this.getPage();
      const files = await page.evaluate(async (context) => {
        return await window.__foundry_vitest__.run(context);
      }, request.context);

      // @ts-expect-error - Accessing internal method
      // eslint-disable-next-line
      await vitest._testRun.collected(this.options.project, files);

      return {
        __vitest_worker_response__: true,
        type: "testfileFinished",
      };
    } else if (requestType === "collect") {
      const page = this.getPage();
      const files = await page.evaluate(async (context) => {
        return await window.__foundry_vitest__.collect(context);
      }, request.context);

      vitest.state.collectFiles(this.options.project, files);

      return {
        __vitest_worker_response__: true,
        type: "testfileFinished",
      };
    } else if (requestType === "cancel") {
      return {
        __vitest_worker_response__: true,
        type: "stopped",
      };
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    } else if (requestType === "stop") {
      return {
        __vitest_worker_response__: true,
        type: "stopped",
      };
    } else {
      throw unexpectedValue("requestType", requestType);
    }
  }

  events = new EventEmitter();

  on(event: string, callback: (arg: any) => void): void {
    if (event === "error" || event === "exit" || event === "message") {
      this.events.on(event, callback);
    } else {
      throw new Error(
        `Unexpected event ${event}. This is a bug in the browser test runner. Please report to LukeAbby.`,
      );
    }
  }

  off(event: string, callback: (arg: any) => void): void {
    if (event === "error" || event === "exit" || event === "message") {
      this.events.off(event, callback);
    } else {
      throw new Error(`Unexpected event ${event}. This is a bug in the custom test runner. Please report to LukeAbby.`);
    }
  }

  viteUrl: string | undefined;
  page: Page | undefined;
  getPage() {
    if (this.page == null) {
      throw new Error("Could not get the page! This is a bug, please contact LukeAbby.");
    }

    return this.page;
  }

  async start() {
    const browserData = await setupBrowser();

    if (!isCloseSetup) {
      this.options.project.vitest.onClose(async () => {
        await browserData.context.close();
        await browserData.browser.close();
        await browserData.server.close();
      });
      isCloseSetup = true;
    }

    const page = await browserData.context.newPage();

    await page.goto("/");

    const pageUrl = new URL(page.url());
    if (!pageUrl.pathname.endsWith("/join")) {
      throw new Error(`Expected to be redirected to /join but got pathname ${pageUrl.pathname}`);
    }

    await page.selectOption("[name=userid]", "Test User");
    await page.click("[name=join]");
    await page.waitForURL("/game");
    await page.waitForFunction(() => typeof game !== "undefined" && game.ready);

    const { resolvedUrls } = browserData.server;
    if (resolvedUrls == null) {
      throw new Error("Vite did not resolve any urls!");
    }

    const viteUrl = resolvedUrls.local[0] ?? resolvedUrls.network[0];
    if (viteUrl == null) {
      throw new Error("Could not get Vite url");
    }

    this.viteUrl = viteUrl;
    this.page = page;
  }

  async stop() {
    this.getPage().close();
  }

  canReuse() {
    // All workers are fungible and shell off to the same array of browsers.
    // So this worker can always be reused.
    return true;
  }

  deserialize(data: unknown) {
    return data;
  }
}

function unexpectedValue(label: string, value: never): Error {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return new Error(`Unexpected value ${value} for ${label}`);
}

export const customPool = {
  name: "custom-browser-pool",
  createPoolWorker: (options: PoolOptions): PoolWorker => {
    return new CustomBrowserWorker(options);
  },
};
