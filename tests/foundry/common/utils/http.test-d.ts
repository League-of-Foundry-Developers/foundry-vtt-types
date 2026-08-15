import { expectTypeOf } from "vitest";
import fu = foundry.utils;

const partialRequestInit: RequestInit = {
  // an inexhaustive test of the RequestInit type
  method: "GET",
  keepalive: false,
  body: null,
  mode: "same-origin",
};

expectTypeOf(fu.fetchWithTimeout("/")).toEqualTypeOf<Promise<Response>>();
expectTypeOf(fu.fetchWithTimeout("/", {})).toEqualTypeOf<Promise<Response>>();
expectTypeOf(fu.fetchWithTimeout("/", partialRequestInit)).toEqualTypeOf<Promise<Response>>();
expectTypeOf(fu.fetchWithTimeout("/", partialRequestInit, {})).toEqualTypeOf<Promise<Response>>();
expectTypeOf(
  fu.fetchWithTimeout("/", partialRequestInit, {
    onTimeout: () => console.warn("foo"),
    timeoutMs: 20000,
  }),
).toEqualTypeOf<Promise<Response>>();
expectTypeOf(
  fu.fetchWithTimeout("/", partialRequestInit, {
    onTimeout: undefined,
    timeoutMs: undefined,
    allowStatus: undefined,
  }),
).toEqualTypeOf<Promise<Response>>();
expectTypeOf(fu.fetchWithTimeout("/", partialRequestInit, { allowStatus: [404] })).toEqualTypeOf<Promise<Response>>();

expectTypeOf(fu.fetchJsonWithTimeout("/")).toEqualTypeOf<Promise<unknown>>();
expectTypeOf(fu.fetchJsonWithTimeout("/", {})).toEqualTypeOf<Promise<unknown>>();
expectTypeOf(fu.fetchJsonWithTimeout("/", partialRequestInit)).toEqualTypeOf<Promise<unknown>>();
expectTypeOf(fu.fetchJsonWithTimeout("/", partialRequestInit, {})).toEqualTypeOf<Promise<unknown>>();
expectTypeOf(
  fu.fetchJsonWithTimeout("/", partialRequestInit, {
    onTimeout: () => console.warn("foo"),
    timeoutMs: 20000,
  }),
).toEqualTypeOf<Promise<unknown>>();
expectTypeOf(
  fu.fetchJsonWithTimeout("/", partialRequestInit, {
    onTimeout: undefined,
    timeoutMs: undefined,
  }),
).toEqualTypeOf<Promise<unknown>>();
// `fetchJsonWithTimeout` forwards only `timeoutMs` and `onTimeout`
// @ts-expect-error `allowStatus` is not accepted here
fu.fetchJsonWithTimeout("/", partialRequestInit, { allowStatus: [404] });

// `allowStatus` is the only difference between the two options interfaces
expectTypeOf<fu.FetchWithTimeoutOptions["allowStatus"]>().toEqualTypeOf<number[] | undefined>();
expectTypeOf<keyof fu.FetchJSONWithTimeoutOptions>().toEqualTypeOf<"timeoutMs" | "onTimeout">();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf<fu.TimeoutOptions>().toEqualTypeOf<fu.FetchJSONWithTimeoutOptions>();

expectTypeOf(fu.srcExists("some/path/to/img.png")).toEqualTypeOf<Promise<boolean>>();

const httpError = new fu.HttpError("File Not Found", 404, "boooooooo");
expectTypeOf(httpError.code).toBeNumber();
expectTypeOf(httpError.displayMessage).toBeString();
expectTypeOf(httpError.toString()).toBeString();
