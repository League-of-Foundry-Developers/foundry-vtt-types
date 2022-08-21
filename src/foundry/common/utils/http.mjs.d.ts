/**
 * A wrapper method around `fetch` that attaches an AbortController signal to the `fetch` call for clean timeouts
 * @see https://www.npmjs.com/package/node-fetch#request-cancellation-with-abortsignal
 * @param url            - The URL to make the Request to
 * @param data           - The data of the Request
 *                         (defalt: `{}`)
 * @param timeoutOptions - (default: `{}`)
 * @throws {@link HttpError}
 */
export function fetchWithTimeout(
  url: string,
  data?: RequestInit | undefined,
  { timeoutMs, onTimeout }?: TimeoutOptions | undefined
): Promise<Response>;

/**
 * A small wrapper that automatically asks for JSON with a Timeout
 * @param url            - The URL to make the Request to
 * @param data           - The data of the Request
 *                         (defalt: `{}`)
 * @param timeoutOptions - (default: `{}`)
 */
export function fetchJsonWithTimeout(
  url: string,
  data?: RequestInit | undefined,
  { timeoutMs, onTimeout }?: TimeoutOptions | undefined
): Promise<unknown>;

/**
 * Represents an HTTP Error when a non-OK response is returned by Fetch
 */
export class HttpError extends Error {
  constructor(statusText: string, code: number, displayMessage?: string | undefined);

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
