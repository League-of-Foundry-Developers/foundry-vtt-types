import { createServer } from "vite";
import { type BrowserContext, chromium } from "playwright";
import type { Page } from "@playwright/test";
import dotenv from "dotenv";
import getPort from "get-port";
import urlJoin from "url-join";
import normalizeUrl from "normalize-url";
import * as stackTraceParser from "stacktrace-parser";
// eslint-disable-next-line import-x/extensions
import { createVitest } from "vitest/node";
import type { SerializedConfig } from "vitest";
import os from "node:os";
import net from "node:net";

declare global {
  interface Window {
    /**
     * Only available during browser tests.
     */
    __get_serialized_config__(): Promise<SerializedConfig>;

    /**
     * Only available during browser tests.
     */
    __send_log__(type: string, args: unknown[], stack: string): Promise<void>;

    /**
     * Only available during browser tests.
     */
    __set_done__(): Promise<void>;

    loadFoundry(): void;
  }
}

async function main(): Promise<void> {
  loadEnv();

  const foundryUrl = await getFoundryUrl();
  const foundrySocket = new URL(foundryUrl);
  if (foundrySocket.protocol === "https:") {
    foundrySocket.protocol = "wss:";
  } else {
    foundrySocket.protocol = "ws:";
  }

  const server = await createServer({
    server: {
      port: await getPort(), // Random port for Hyrum's law (also to be less confusing if someone happens to running Vite).
      // cors: {
      //   origin: foundryUrl,
      // },
      proxy: {
        // Has to start with `^` to be understood as a Regex.
        "^(?!/tests|/node_modules)": foundryUrl,
        "/socket.io": {
          target: `${foundrySocket}`,
          ws: true,
        },
      },
    },
    build: {
      sourcemap: "inline",
    },
  });
  await using _1 = asyncDefer(server.close);

  await server.listen();

  if (server.resolvedUrls == null) {
    throw new Error("Vite did not resolve any urls (was server.listen called?)");
  }

  const viteUrl = server.resolvedUrls.local[0] ?? server.resolvedUrls.network[0];
  if (viteUrl == null) {
    throw new Error("Could not get Vite url in server.resolvedUrls");
  }

  const headless = process.env["HEADLESS"] !== "false";

  const args = [];
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

  await using browser = await chromium.launch({ headless, args });

  await using context = await browser.newContext({
    baseURL: viteUrl,
    viewport,
  });

  await using setup = await setupPage(context, viteUrl);
  const page = setup.page;

  await runTests(page);

  await setup.waitForTests.wait();
}

function loadEnv() {
  const { error } = dotenv.config({ path: ".env.local", quiet: true });
  if (error != null) {
    throw error;
  }
}

function asyncDefer(f: () => Promise<void>) {
  return { [Symbol.asyncDispose]: f };
}

const defaultFoundryUrl = "http://localhost:30000";

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

async function setupPage(context: BrowserContext, foundryUrl: string) {
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

    console.dirxml = function (...args) {
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

    console.group = function (...args) {
      const stack = { stack: "" };
      Error.captureStackTrace(stack);
      sendLog("group", args, stack.stack);
      group.call(this, ...args);
    };

    console.groupCollapsed = function (...args) {
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
          (console as any)[messageType](message.text());
        } else if (messageType === "warning") {
          console.warn("[native] " + message.text());
        } else {
          console.log("[native] " + message.text());
        }
      }
    }
  });

  let serializedConfig: SerializedConfig | undefined;
  await page.exposeFunction("__get_serialized_config__", async () => {
    if (serializedConfig) {
      return serializedConfig;
    }

    // This is a waste but it also appears to be the only way.
    const vitest = await createVitest("test", { name: "root" });

    const root = vitest.projects.find((project) => project.name === "root");
    if (!root) {
      await vitest.close();
      throw new Error("Could not find root project!");
    }

    // Weirdly using `asyncDefer` causes it to hang forever.
    await vitest.close();

    serializedConfig = root.serializedConfig;
    return serializedConfig;
  });

  let { promise: waitDone, resolve } = Promise.withResolvers<void>();

  const waitForTests = {
    async wait(): Promise<void> {
      await waitDone;
    },
    reset() {
      const { promise: _waitDone, resolve: _resolve } = Promise.withResolvers<void>();
      waitDone = _waitDone;
      resolve = _resolve;
    },
  };
  await page.exposeFunction("__set_done__", async () => {
    resolve();
  });

  page.on("pageerror", (err: Error) => {
    throw err;
  });

  let expectedClose = false;
  page.on("close", () => {
    if (expectedClose) {
      return;
    }

    throw new Error("Page unexpectedly closed!");
  });

  // No need to log that the page closed with ctrl+c
  process.on("SIGINT", () => {
    expectedClose = true;
  });

  page.on("crash", () => {
    throw new Error("Page crashed!");
  });

  return {
    page,
    waitForTests,
    async [Symbol.asyncDispose]() {
      expectedClose = true;
      await page.close();
    },
  };
}

async function runTests(page: Page) {
  await page.goto("/");

  const pageUrl = new URL(page.url());
  if (!pageUrl.pathname.endsWith("/join")) {
    throw new Error(`Expected to be redirected to /join but got pathname ${pageUrl.pathname}`);
  }

  await page.addInitScript(() => {
    if (!window.location.pathname.endsWith("/game")) {
      return;
    }

    let domLoadedEvent: Event | undefined;
    let loadGame: ((event: Event) => void) | undefined;
    globalThis.addEventListener("FoundryFrameworkLoaded", () => {
      // @ts-expect-error - This absolute path does not normally exist.
      // eslint-disable-next-line import-x/no-unresolved, import-x/no-absolute-path
      void import(/* @vite-ignore */ "/tests/tester.ts");

      const addEventListener = window.addEventListener;
      window.addEventListener = function (
        type: string,
        fn: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
      ) {
        if (type !== "DOMContentLoaded") {
          throw new Error("Expected Foundry to wait for DOMContentLoaded immediately after FoundryFrameworkLoaded.");
        }

        if (typeof fn !== "function") {
          throw new Error("Expected plain callback!");
        }

        addEventListener.call(
          this,
          type,
          (_event) => {
            domLoadedEvent = _event;
            loadGame = fn;
          },
          options,
        );

        window.addEventListener = addEventListener;
      };
    });

    let loaded = false;
    window.loadFoundry = () => {
      if (!loaded && loadGame && domLoadedEvent) {
        loadGame(domLoadedEvent);
        loaded = true;
      }
    };
  });

  await page.selectOption("[name=userid]", "Test User");
  await page.click("[name=join]");
  await page.waitForURL("/game");
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

// A cached value of whether the current environment is WSL
let _isWSL2: boolean | undefined = undefined;

function isWSL2(): boolean {
  if (_isWSL2 != null) {
    return _isWSL2;
  }

  _isWSL2 = os.release().endsWith("-microsoft-standard-WSL2");
  return _isWSL2;
}

await main();
