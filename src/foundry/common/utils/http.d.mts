/**
 * A wrapper method around `fetch` that attaches an AbortController signal to the `fetch` call for clean timeouts
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal#aborting_a_fetch_with_timeout_or_explicit_abort}
 * @param url            - The URL to make the Request to
 * @param data           - The data of the Request
 *                         (defalt: `{}`)
 * @param timeoutOptions - (default: `{}`)
 * @throws {@linkcode HttpError}
 */
export declare function fetchWithTimeout(
  url: string,
  data?: RequestInit,
  { timeoutMs, onTimeout }?: TimeoutOptions,
): Promise<Response>;

/**
 * A small wrapper that automatically asks for JSON with a Timeout
 * @param url            - The URL to make the Request to
 * @param data           - The data of the Request
 *                         (defalt: `{}`)
 * @param timeoutOptions - (default: `{}`)
 */
export declare function fetchJsonWithTimeout(
  url: string,
  data?: RequestInit,
  { timeoutMs, onTimeout }?: TimeoutOptions,
): Promise<unknown>;

/**
 * Represents an HTTP Error when a non-OK response is returned by Fetch
 */
export declare class HttpError extends Error {
  constructor(statusText: string, code: number, displayMessage?: string);

  code: number;

  displayMessage: string;
}

interface TimeoutOptions {
  /**
   * How long to wait for a Response before cleanly aborting. If null, no timeout is applied
   * @defaultValue `30000`
   */
  timeoutMs?: number | undefined | null;

  /**
   * A method to invoke if and when the timeout is reached
   * @defaultValue `() => {}`
   */
  onTimeout?: (() => void) | undefined;
}
