import type Sound from "./sound.d.mts";
import type AudioBufferCache from "./cache.d.mts";
import type { Identity, InexactPartial, IntentionalPartial, NullishProps, ValueOf } from "#utils";

/**
 * A helper class to provide common functionality for working with the Web Audio API.
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
 * A singleton instance of this class is available as game#audio.
 * @see {@link Game.audio | `Game#audio`}
 */
declare class AudioHelper {
  constructor();

  /**
   * The Native interval for the AudioHelper to analyse audio levels from streams
   * Any interval passed to startLevelReports() would need to be a multiple of this value.
   * @defaultValue `50`
   */
  static levelAnalyserNativeInterval: number;

  /**
   * The cache size threshold after which audio buffers will be expired from the cache to make more room.
   * 1 gigabyte, by default.
   * @defaultValue `Math.pow(1024, 3)`
   */
  static THRESHOLD_CACHE_SIZE_BYTES: number;

  /**
   * The set of singleton Sound instances which are cached for different audio paths
   */
  sounds: Map<string, WeakRef<Sound>>;

  /**
   * Get a map of the Sound objects which are currently playing.
   */
  playing: Map<number, Sound>;

  /**
   * A user gesture must be registered before audio can be played.
   * This Array contains the Sound instances which are requested for playback prior to a gesture.
   * Once a gesture is observed, we begin playing all elements of this Array.
   * @see {@linkcode Sound}
   * @defaultValue `[]`
   * @remarks Foundry only populates this in one place, {@link SoundsLayer.refresh | `SoundsLayer#refresh`}
   */
  pending: (() => void)[];

  /**
   * A Promise which resolves once the game audio API is unlocked and ready to use.
   * @privateRemarks Not initialized to a value, but set during construction to `this.awaitFirstGesture()`
   */
  unlock: Promise<void>;

  /**
   * A flag for whether video playback is currently locked by awaiting a user gesture
   * @defaultValue `true`
   */
  locked: boolean;

  /**
   * A singleton audio context used for playback of music
   * @remarks Not initialized to a value, set in {@link AudioHelper._onFirstGesture | `AudioHelper#_onFirstGesture`};
   * In practice, `undefined` until the first audio is played after page load
   */
  music: AudioContext | undefined;

  /**
   * A singleton audio context used for playback of environmental audio.
   * @remarks Not initialized to a value, set in {@link AudioHelper._onFirstGesture | `AudioHelper#_onFirstGesture`};
   * In practice, `undefined` until the first audio is played after page load
   */
  environment: AudioContext | undefined;

  /**
   * A singleton audio context used for playback of interface sounds and effects.
   * @remarks Not initialized to a value, set in {@link AudioHelper._onFirstGesture | `AudioHelper#_onFirstGesture`};
   * In practice, `undefined` until the first audio is played after page load
   */
  interface: AudioContext | undefined;

  /**
   * For backwards compatibility, AudioHelper#context refers to the context used for music playback.
   */
  get context(): AudioContext | undefined;

  /**
   * A singleton cache used for audio buffers.
   */
  buffers: AudioBufferCache;

  /**
   * Create a Sound instance for a given audio source URL
   * @param options - Sound creation options
   * @remarks `options` has no `={}`, an object with a valid `src` string must be passed
   */
  create(options: AudioHelper.SoundCreationOptions): Sound;

  /**
   * Test whether a source file has a supported audio extension type
   * @param src - A requested audio source path
   * @returns Does the filename end with a valid audio extension?
   */
  static hasAudioExtension(src: string): boolean;

  /**
   * Given an input file path, determine a default name for the sound based on the filename
   * @param src - An input file path
   * @returns A default sound name for the path
   */
  static getDefaultSoundName(src: string): string;

  /**
   * Play a single Sound by providing its source.
   * @param src     - The file path to the audio source being played
   * @param options - Additional options which configure playback
   * @returns The created Sound which is now playing
   */
  // options: not null (destructured)
  play(src: string, options?: AudioHelper.PlayOptions): Promise<Sound>;

  /**
   * Register an event listener to await the first mousemove gesture and begin playback once observed
   * @returns The unlocked audio context
   * @remarks Actually returns a `Promise<void>` that resolves when the audio context is unlocked
   */
  awaitFirstGesture(): Promise<void>;

  /**
   * Request that other connected clients begin preloading a certain sound path.
   * @param src - The source file path requested for preload
   * @returns A Promise which resolves once the preload is complete
   */
  preload(src: string): Promise<Sound>;

  /**
   * Register client-level settings for global volume overrides
   */
  static registerSettings(): void;

  /**
   * Open socket listeners which transact ChatMessage data
   * @internal
   */
  static _activateSocketListeners(socket: io.Socket): void;

  /**
   * Play a one-off sound effect which is not part of a Playlist
   *
   * @param data - An object configuring the audio data to play
   * @param socketOptions - Options which only apply when emitting playback over websocket.
   *                        As a boolean, emits (true) or does not emit (false) playback to all other clients
   *                        As an object, can configure which recipients should receive the event.
   * @returns A Sound instance which controls audio playback.
   *
   * @example Play the sound of a locked door for all players
   * ```typescript
   * AudioHelper.play({src: "sounds/lock.wav", volume: 0.8, loop: false}, true);
   * ```
   */
  static play(data: AudioHelper.PlayData, socketOptions?: boolean | AudioHelper.SocketOptions | null): Promise<Sound>;

  /**
   * Begin loading the sound for a provided source URL adding its
   * @param src - The audio source path to preload
   * @returns The created and loaded Sound ready for playback
   */
  static preloadSound(src: string): Promise<Sound>;

  /**
   * Returns the volume value based on a range input volume control's position.
   * This is using an exponential approximation of the logarithmic nature of audio level perception
   * @param value - Value between [0, 1] of the range input
   * @param order - The exponent of the curve (default: `1.5`)
   * @remarks String `value`s will be `parseFloat`ed, so an empty string produces `NaN`
   */
  static inputToVolume(value: number | string, order?: number): number;

  /**
   * Counterpart to inputToVolume()
   * Returns the input range value based on a volume
   * @param volume - Value between [0, 1] of the volume level
   * @param order  - The exponent of the curve (default: `1.5`)
   */
  static volumeToInput(volume: number, order?: number): number;

  /**
   * Returns a singleton AudioContext if one can be created.
   * An audio context may not be available due to limited resources or browser compatibility
   * in which case null will be returned
   *
   * @returns A singleton AudioContext or null if one is not available
   * @remarks Despite Foundry's description of the return, always returns an `AudioContext`, freshly
   * created if `AudioHelper.#analyzerContext` has not previously been initialized
   */
  getAnalyzerContext(): AudioContext;

  /**
   * Registers a stream for periodic reports of audio levels.
   * Once added, the callback will be called with the maximum decibel level of
   * the audio tracks in that stream since the last time the event was fired.
   * The interval needs to be a multiple of `AudioHelper.levelAnalyserNativeInterval` which defaults at 50ms
   *
   * @param id        - An id to assign to this report. Can be used to stop reports
   * @param stream    - The MediaStream instance to report activity on.
   * @param callback  - The callback function to call with the decibel level.
   * @param interval  - The interval at which to produce reports. (default: `50`)
   * @param smoothing - The smoothingTimeConstant to set on the audio analyser. (default: `0.1`)
   * @returns Returns whether listening to the stream was successful
   */
  // interval, smoothing: not null (parameter default only)
  startLevelReports(
    id: string,
    stream: MediaStream,
    callback: AudioHelper.LevelReportCallback,
    interval?: number,
    smoothing?: number,
  ): boolean;

  /**
   * Stop sending audio level reports
   * This stops listening to a stream and stops sending reports.
   * If we aren't listening to any more streams, cancel the global analyser timer.
   * @param id - The id of the reports that passed to startLevelReports.
   */
  stopLevelReports(id: string): void;

  /**
   * Handle the first observed user gesture
   * @param event   - The mouse-move event which enables playback
   * @param resolve - The Promise resolution function
   * @internal
   */
  protected _onFirstGesture(event: Event, resolve: () => void): void;

  /**
   * Log a debugging message if the audio debugging flag is enabled.
   * @param message - The message to log
   */
  debug(message: string): void;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "`AudioHelper#getCache` is deprecated in favor of {@link AudioBufferCache | `AudioHelper#buffers#get`}"
   */
  getCache(src: string): AudioBuffer | undefined;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "`AudioHelper#updateCache` is deprecated without replacement"
   */
  updateCache(src: string, playing: boolean): void;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "`AudioHelper#setCache` is deprecated in favor of {@link AudioBufferCache | `AudioHelper#buffers#set`}"
   */
  setCache(src: string, buffer: AudioBuffer): void;
}

declare namespace AudioHelper {
  interface Any extends AnyAudioHelper {}
  interface AnyConstructor extends Identity<typeof AnyAudioHelper> {}

  type AUDIO_MIME_TYPES = ValueOf<typeof CONST.AUDIO_FILE_EXTENSIONS>;

  /** @internal */
  type _SoundCreationOptions = InexactPartial<{
    /**
     * Additional options passed to the play method if autoplay is true
     * @defaultValue `{}`
     * @remarks Can't be `null` as it only has a parameter default
     */
    autoplayOptions: Sound.PlaybackOptions;
  }> &
    NullishProps<{
      /**
       * A specific AudioContext to attach the sound to
       * @remarks Has no default, but if it's falsey, the {@linkcode Sound} constructor
       * (where this is forwarded) will use {@link AudioHelper.music | `game.audio.music`} instead
       */
      context: AudioContext;

      /**
       * Reuse an existing Sound for this source?
       * @defaultValue `true`
       */
      singleton: boolean;

      /**
       * Begin loading the audio immediately?
       * @defaultValue `false`
       */
      preload: boolean;

      /**
       * Begin playing the audio as soon as it is ready?
       * @defaultValue `false`
       */
      autoplay: boolean;
    }>;

  interface SoundCreationOptions extends _SoundCreationOptions {
    /** The source URL for the audio file */
    src: string;
  }

  /**
   * {@linkcode AudioHelper#play} pulls `context` out of this object then forwards the rest to {@link Sound.play | `Sound#play`}
   */
  interface PlayOptions extends Pick<SoundCreationOptions, "context">, Sound.PlaybackOptions {}

  /** @internal */
  type _PlayData = IntentionalPartial<{
    /**
     * An audio channel in CONST.AUDIO_CHANNELS where the sound should play
     * @defaultValue `"interface"`
     * @remarks Can't be nullish as the only default is provided by `mergeObject`
     */
    channel: keyof typeof CONST.AUDIO_CHANNELS;

    /**
     * Begin playback of the audio effect immediately once it is loaded.
     * @remarks Can't be nullish as it has no default and is checked for `=== false`
     * @privateRemarks This formerly (some time before v11) had a deprecation warning associated with it:
     *
     * "You are using the autoplay option of AudioHelper.play which is no longer supported in 0.8.0"
     *
     * In v11+, it's simply checked for an early return with `=== false`, with a comment that doesn't indicate a deprecation period:
     *
     * "// Backwards compatibility, if autoplay was passed as false take no further action"
     */
    autoplay: false;
  }> &
    NullishProps<{
      /**
       * The volume level at which to play the audio, between 0 and 1.
       * @defaultValue `1.0`
       * @privateRemarks Despite the initial default being via `mergeObject`, there's a second `??` default so it's allowed to be nullish
       */
      volume: number;

      /**
       * Loop the audio effect and continue playing it until it is manually stopped.
       * @defaultValue `false`
       * @privateRemarks Despite the default being via `mergeObject`, {@link Sound.PlaybackOptions.loop | `Sound.PlaybackOptions["loop"]`} can be nullish, therefor so can this
       */
      loop: boolean;
    }>;

  interface PlayData extends _PlayData {
    /**
     * The audio source file path, either a public URL or a local path relative to the public directory
     */
    src: string;
  }

  interface SocketOptions {
    /**
     * An array of user IDs to push audio playback to. All users by default.
     * @remarks Nullish values cause errors, but omitting this key (passing an empty object) is the same as passing `true` (all players)
     */
    recipients?: string[];
  }

  type LevelReportCallback = (maxDecibel: number, fftArray: Float32Array) => void;
}

export default AudioHelper;

declare abstract class AnyAudioHelper extends AudioHelper {
  constructor(...args: never);
}
