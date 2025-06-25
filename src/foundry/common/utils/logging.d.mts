import type { InexactPartial } from "#utils";
import type { COMPATIBILITY_MODES } from "../constants.d.mts";

/**
 * Log a compatibility warning which is filtered based on the client's defined compatibility settings.
 * @param message - The original warning or error message
 * @param options - Additional options which customize logging (default: `{}`)
 * @throws An Error if the mode is ERROR
 */
export declare function logCompatibilityWarning(message: string, options?: LogCompatibilityWarningOptions): void;

/** @internal */
type _LogCompatibilityWarningOptions = InexactPartial<{
  /**
   * A logging level in COMPATIBILITY_MODES which overrides the configured default
   * @remarks Defaults to {@linkcode CONFIG.compatibility.mode} if `CONFIG.compatibility` exists,
   * falls back to {@linkcode COMPATIBILITY_MODES.WARNING} otherwise
   */
  mode: COMPATIBILITY_MODES;

  /**
   * A version identifier since which a change was made
   */
  since: number | string;

  /**
   * A version identifier until which a change remains supported
   */
  until: number | string;

  /**
   * Additional details to append to the logged message
   */
  details: string;

  /**
   * Include the message stack trace
   * @defaultValue `true`
   */
  stack: boolean;

  /**
   * Log this message only once?
   * @defaultValue `false`
   */
  once: boolean;
}>;

export interface LogCompatibilityWarningOptions extends _LogCompatibilityWarningOptions {}
