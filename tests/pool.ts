import { type Browser, type BrowserContext, type Page, chromium } from "playwright";
import { type ViteDevServer, createServer } from "vite";
import type { SerializedConfig } from "vitest";
import type { File } from "@vitest/runner";
import {
  type PoolOptions,
  type PoolWorker,
  type WorkerRequest,
  type WorkerResponse,
  type Vitest,
  // eslint-disable-next-line import-x/extensions
} from "vitest/node";
import getPort from "get-port";
import pathe from "pathe";
import urlJoin from "url-join";
import normalizeUrl from "normalize-url";
import * as stackTraceParser from "stacktrace-parser";
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
  viteUrl: string;
  browser: Browser;
  server: ViteDevServer;
  context: BrowserContext;
  page: Page;
}

let browserData: BrowserData | undefined;

// This may seem unnecessarily duplicative but `setup` is called effectively in a `Promise.race`.
// This is to allow all racing workers to only get the browser once whereas `browserData` is for sync access.
let _browserData: Promise<BrowserData> | undefined;

async function setupBrowser(vitest: Vitest): Promise<BrowserData | undefined> {
  if (_browserData != null) {
    // Throw away the error so only the first one logs.
    return _browserData.catch(() => undefined);
  }

  _browserData = _setupBrowser(vitest);
  browserData = await _browserData;
  return browserData;
}

// No need to log that the page closed with ctrl+c
let expectedClose = false;

process.on("SIGINT", () => {
  expectedClose = true;
});

async function _setupBrowser(vitest: Vitest): Promise<BrowserData> {
  const foundryUrl = await getFoundryUrl();

  const headless = process.env["HEADLESS"] !== "false";

  // Enable hardware acceleration (for performance).
  const args = ["--enable-gpu", "--ignore-gpu-blocklist"];
  let viewport: { width: number; height: number } | null;
  if (headless) {
    viewport = {
      width: 1024,
      height: 768,
    };
  } else {
    args.push("--start-maximized");
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
  });

  await server.listen();

  const { resolvedUrls } = server;
  if (resolvedUrls == null) {
    throw new Error("Vite did not resolve any urls!");
  }

  const viteUrl = resolvedUrls.local[0] ?? resolvedUrls.network[0];
  if (viteUrl == null) {
    throw new Error("Could not get Vite url");
  }

  const page = await context.newPage();
  const showFoundryLogs = process.env["LOG_FOUNDRY_MJS"] === "true";
  const showNativeWarnings = process.env["LOG_NATIVE_MESSAGES"] === "true";

  await page.addInitScript(() => {
    const {
      assert,
      clear,
      count,
      debug,
      dir,
      dirxml,
      groupEnd,
      error,
      info,
      log,
      profile,
      profileEnd,
      group,
      groupCollapsed,
      table,
      timeEnd,
      trace,
      warn,
    } = console;

    function sendLog(type: string, args: unknown[], stack: string) {
      args = args.map((arg) => {
        if (typeof arg === "function") {
          // Functions would display as "null" rather confusingly.
          return arg.toString();
        } else if (arg instanceof HTMLElement) {
          // Nodes would display as "Ref@node" or the like.
          return arg.outerHTML;
        }

        return arg;
      });

      // @ts-expect-error - Untyped global.
      // eslint-disable-next-line
      window.__send_log__(type, args, stack);
    }

    console.assert = function (...args) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("assert", args, stack.stack);
      assert.call(this, ...args);
    };

    console.clear = function (...args) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("clear", args, stack.stack);
      clear.call(this, ...args);
    };

    console.count = function (...args) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("count", args, stack.stack);
      count.call(this, ...args);
    };

    console.debug = function (...args) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("debug", args, stack.stack);
      debug.call(this, ...args);
    };

    console.dir = function (...args) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("dir", args, stack.stack);
      dir.call(this, ...args);
    };

    console.dirxml = function (...args: unknown[]) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("dirxml", args, stack.stack);
      dirxml.call(this, ...args);
    };

    console.groupEnd = function (...args) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("groupEnd", args, stack.stack);
      groupEnd.call(this, ...args);
    };

    console.error = function (...args) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("error", args, stack.stack);
      error.call(this, ...args);
    };

    console.info = function (...args) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("info", args, stack.stack);
      info.call(this, ...args);
    };

    console.log = function (...args) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("log", args, stack.stack);
      log.call(this, ...args);
    };

    console.profile = function (...args) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("profile", args, stack.stack);
      profile.call(this, ...args);
    };

    console.profileEnd = function (...args) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("profileEnd", args, stack.stack);
      profileEnd.call(this, ...args);
    };

    console.group = function (...args: unknown[]) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("group", args, stack.stack);
      group.call(this, ...args);
    };

    console.groupCollapsed = function (...args: unknown[]) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("groupCollapsed", args, stack.stack);
      groupCollapsed.call(this, ...args);
    };

    console.table = function (...args) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("table", args, stack.stack);
      table.call(this, ...args);
    };

    console.timeEnd = function (...args) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("timeEnd", args, stack.stack);
      timeEnd.call(this, ...args);
    };

    console.trace = function (...args) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("trace", args, stack.stack);
      trace.call(this, ...args);
    };

    console.warn = function (...args) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("warn", args, stack.stack);
      warn.call(this, ...args);
    };
  });

  const foundryMjs = normalizeUrl(urlJoin(foundryUrl, "scripts/foundry.mjs"));

  await page.exposeFunction("__send_log__", (type: string, args: unknown[], stack: string) => {
    const frames = stackTraceParser.parse(stack);
    const callerFile = frames[1]?.file;
    const isFoundryMJS = callerFile === foundryMjs;

    if (isFoundryMJS && !showFoundryLogs) {
      return;
    }

    if (type === "clear") {
      console.log("[Browser cleared log]");
    } else {
      // eslint-disable-next-line
      (console as any)[type](...args);
    }
  });

  page.on("console", (message) => {
    const location = message.location();

    if (location.lineNumber === 0 && location.columnNumber === 0) {
      const messageType = message.type();

      if (messageType === "error") {
        console.error(message.text(), message.location().url);
      } else if (showNativeWarnings) {
        if (messageType in console) {
          // eslint-disable-next-line
          (console as any)[messageType](message.text());
        } else if (messageType === "warning") {
          console.warn("[native] " + message.text());
        } else {
          console.log("[native] " + message.text());
        }
      }
    }
  });

  // TODO: See if we can capture within the context of the test.
  page.on("pageerror", (err: Error) => {
    throw err;
  });

  page.on("close", () => {
    if (expectedClose) {
      return;
    }

    throw new Error("Page unexpectedly closed!");
  });

  page.on("crash", () => {
    throw new Error("Page crashed!");
  });

  vitest.onClose(async () => {
    expectedClose = true;
    await page.close();
    await context.close();
    await browser.close();
    await server.close();
  });

  await page.goto("/");

  const pageUrl = new URL(page.url());
  if (!pageUrl.pathname.endsWith("/join")) {
    throw new Error(`Expected to be redirected to /join but got pathname ${pageUrl.pathname}`);
  }

  await page.selectOption("[name=userid]", "Test User");
  await page.click("[name=join]");
  await page.waitForURL("/game");
  await page.waitForFunction(() => typeof game !== "undefined" && game.ready);

  const throttleCanvas = process.env["THROTTLE_CANVAS"] === "true";
  if (throttleCanvas) {
    // Lower the performance and fps so tests run quicker.
    await page.evaluate(async () => {
      canvas!.app!.ticker.maxFPS = PIXI.Ticker.shared.maxFPS = 0.25;
      canvas!.performance!.fps = 0.25;
      canvas!.performance!.msaa = false;
      canvas!.performance!.smaa = false;
    });
  }

  return { viteUrl, browser, server, context, page };
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

let isSetup = false;

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
      if (isSetup) {
        return {
          __vitest_worker_response__: true,
          type: "started",
        };
      }

      const viteUrl = browserData?.viteUrl;
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

      isSetup = true;

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
  getPage() {
    if (browserData == null) {
      throw new Error("Could not get the page! This is a bug, please contact LukeAbby.");
    }

    return browserData.page;
  }

  async start() {
    if (browserData != null) {
      return;
    }

    try {
      const browserData = await setupBrowser(this.options.project.vitest);
      if (!browserData) {
        return; // Another worker errored, return with no error.
      }
    } catch (e) {
      // Workaround for https://github.com/vitest-dev/vitest/issues/9207
      console.error(e);
      throw e;
    }
  }

  async stop() {}

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
