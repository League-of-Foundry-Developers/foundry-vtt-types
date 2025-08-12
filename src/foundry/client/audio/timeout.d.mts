import type { Identity, InexactPartial } from "#utils";

/**
 * A special error class used for cancellation.
 * @privateRemarks Yes this is a straight up empty class extension by Foundry used exclusively internally
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class AudioTimeoutCancellation extends Error {}

/**
 * A framework for scheduled audio events with more precise and synchronized timing than using window.setTimeout.
 * This approach creates an empty audio buffer of the desired duration played using the shared game audio context.
 * The onended event of the AudioBufferSourceNode provides a very precise way to synchronize audio events.
 * For audio timing, this is preferable because it avoids numerous issues with window.setTimeout.
 *
 * @example Using a callback function
 * ```js
 * function playForDuration(sound, duration) {
 *   sound.play();
 *   const wait = new AudioTimeout(duration, {callback: () => sound.stop()})
 * }
 * ```
 *
 * @example Using an awaited Promise
 * ```js
 * async function playForDuration(sound, duration) {
 *   sound.play();
 *   const timeout = new AudioTimeout(delay);
 *   await timeout.complete;
 *   sound.stop();
 * }
 * ```
 *
 * @example Using the wait helper
 * ```js
 * async function playForDuration(sound, duration) {
 *   sound.play();
 *   await AudioTimeout.wait(duration);
 *   sound.stop();
 * }
 * ```
 */
declare class AudioTimeout<CallbackReturn = undefined> {
  /**
   * Create an AudioTimeout by providing a delay and callback.
   * @param delayMS - A desired delay timing in milliseconds
   * @param options - Additional options which modify timeout behavior
   */
  // options: not null (destructured)
  constructor(delayMS: number, options?: AudioTimeout.ConstructorOptions<CallbackReturn>);

  /**
   * Is the timeout complete?
   * This can be used to await the completion of the AudioTimeout if necessary.
   * The Promise resolves to the returned value of the provided callback function.
   */
  complete: Promise<CallbackReturn> | undefined;

  /**
   * Is this audio timeout cancelled?
   */
  get cancelled(): boolean;

  /**
   * Cancel an AudioTimeout by ending it early, rejecting its completion promise, and skipping any callback function.
   */
  cancel(): void;

  /**
   * End the timeout, either on schedule or prematurely. Executing any callback function
   */
  end(): void;

  /**
   * Schedule a task according to some audio timeout.
   * @param delayMS - A desired delay timing in milliseconds
   * @param options - Additional options which modify timeout behavior
   * @returns A promise which resolves as a returned value of the callback or void
   */
  static wait<CallbackReturn = undefined>(
    delayMS: number,
    options?: AudioTimeout.ConstructorOptions<CallbackReturn>,
  ): Promise<CallbackReturn>;

  #AudioTimeout: true;
}

declare namespace AudioTimeout {
  interface Any extends AnyAudioTimeout {}
  interface AnyConstructor extends Identity<typeof AnyAudioTimeout> {}

  /** @internal */
  type _ConstructorOptions<Return = undefined> = InexactPartial<{
    /** @defaultValue `game.audio.music` */
    context: AudioContext;

    callback: () => Return;
  }>;

  interface ConstructorOptions<Return = undefined> extends _ConstructorOptions<Return> {}
}

export default AudioTimeout;

declare abstract class AnyAudioTimeout extends AudioTimeout<unknown> {
  constructor(...args: never);
}
