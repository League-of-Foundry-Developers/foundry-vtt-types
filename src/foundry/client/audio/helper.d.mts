import type Sound from "./sound.d.mts";
import type AudioBufferCache from "./cache.d.mts";
import type { Identity, InexactPartial, ValueOf } from "#utils";

/**
 * A helper class to provide common functionality for working with the Web Audio API.
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
 * A singleton instance of this class is available as game#audio.
 * @see {@linkcode Game.audio | Game#audio}
 */
declare class AudioHelper {
  /** @remarks Construction will throw if {@linkcode Game.audio | game.audio} is already instantiated */
  constructor();

  /**
   * Analyzers for each context, plus an internal ticker. Each context key holds data about its {@linkcode AnalyserNode},
   * a {@linkcode Float32Array} for FFT data, and so on.
   * @defaultValue
   * ```js
   * Object.seal({
   *   music: {active: false, node: null, dataArray: null, lastUsed: 0, db: {}, bands: {}},
   *   environment: {active: false, node: null, dataArray: null, lastUsed: 0, db: {}, bands: {}},
   *   interface: {active: false, node: null, dataArray: null, lastUsed: 0, db: {}, bands: {}},
   *   analysisLoopActive: false
   * });
   * ```
   */
  analyzer: AudioHelper.AnalysisData;

  /**
   * An array containing all possible audio context names.
   */
  static AUDIO_CONTEXTS: ReadonlyArray<AudioHelper.ContextName>;

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
   * @remarks Foundry only populates this in one place, {@linkcode SoundsLayer.refresh | SoundsLayer#refresh}
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
   * @remarks Not initialized to a value, set in `AudioHelper##onFirstGesture`. In practice, this is `undefined` until
   * the first audio is played after page load.
   */
  music: AudioContext | undefined;

  /**
   * A singleton audio context used for playback of environmental audio.
   * @remarks Not initialized to a value, set in `AudioHelper##onFirstGesture`. In practice, this is `undefined` until
   * the first audio is played after page load.
   */
  environment: AudioContext | undefined;

  /**
   * A singleton audio context used for playback of interface sounds and effects.
   * @remarks Not initialized to a value, set in `AudioHelper##onFirstGesture`. In practice, this is `undefined` until
   * the first audio is played after page load.
   */
  interface: AudioContext | undefined;

  /**
   * For backwards compatibility, AudioHelper#context refers to the context used for music playback.
   */
  get context(): this["music"];

  /**
   * A global mute which suppresses all 3 audio channels.
   */
  get globalMute(): boolean;

  set globalMute(muted);

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
   * @param data          - An object configuring the audio data to play
   * @param socketOptions - Options which only apply when emitting playback over websocket. As a boolean, emits (true)
   * or does not emit (false) playback to all other clients. As an object, can configure which recipients (an array of
   * User IDs) should receive the event (all clients by default). Default: `false`.
   * @returns A Sound instance which controls audio playback, or nothing if `data.autoplay` is false.
   *
   * @example Play the sound of a locked door for all players
   * ```js
   * AudioHelper.play({src: "sounds/lock.wav", volume: 0.8, loop: false}, true);
   * ```
   */
  static play(data: AudioHelper.PlayData, socketOptions?: boolean | AudioHelper.SocketOptions): Promise<Sound | void>;

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
   * Converts a volume level to a human-readable percentage value.
   * @param volume - Value in the interval [0, 1] of the volume level.
   */
  static volumeToPercentage(volume: number, options?: AudioHelper.VolumeToPercentageOptions): string;

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

  /** @deprecated Made hard private in v13. This warning will be removed in v14. */
  protected _onFirstGesture(event: never, resolve: never): never;

  /**
   * Log a debugging message if the audio debugging flag is enabled.
   * @param message - The message to log
   */
  debug(message: string): void;

  /**
   * A static inactivity threshold for audio analysis, in milliseconds.
   * If no band value is requested for a channel within this duration,
   * the analyzer is disabled to conserve resources (unless the analyzer is enabled with the `keepAlive=true` option)
   * @defaultValue `1000`
   */
  static ANALYSIS_TIMEOUT_MS: number;

  /**
   * Enable the analyzer for a given context (`music`, `environment`, `interface`), attaching an {@linkcode AnalyserNode} to its gain node if not already active.
   */
  enableAnalyzer(contextName: AudioHelper.ContextName, options?: AudioHelper.EnableAnalyzerOptions): void;

  /**
   * Disable the analyzer for a given context, disconnecting the {@linkcode AnalyserNode}.
   */
  disableAnalyzer(contextName: AudioHelper.ContextName): void;

  /**
   * Returns a normalized band value in [0,1].
   * Optionally, we can subtract the actual gainNode (global) volume from the measurement.
   * - Important:
   *   - Local gain applied to {@linkcode foundry.audio.Sound} source can't be ignored.
   *   - If this method needs to activate the analyzer, the latter requires a brief warm-up.
   *     One or two frames may be needed before it produces meaningful values (instead of returning 0).
   * @returns The normalized band value in [0,1].
   */
  getBandLevel(
    contextName: AudioHelper.ContextName,
    bandName: AudioHelper.BandName,
    options?: AudioHelper.GetBandLevelOptions,
  ): number;

  /**
   * Retrieve a single "peak" analyzer value across the three main audio contexts (music, environment, interface).
   * This takes the maximum of the three normalized [0,1] values for a given frequency band.
   * @param band - The frequency band for which to retrieve an analyzer value. (default: `"all"`)
   * @returns A number in the [0,1] range representing the loudest band value among the three contexts.
   */
  getMaxBandLevel(band?: AudioHelper.BandName, options?: AudioHelper.GetMaxBandLevelOptions): number;

  /**
   * @deprecated "`AudioHelper#getCache` is deprecated in favor of {@linkcode AudioBufferCache | AudioHelper#buffers#get}" (since v12, until v14)
   */
  getCache(src: string): AudioBuffer | undefined;

  /**
   * @deprecated "`AudioHelper#updateCache` is deprecated without replacement" (since v12, until v14)
   */
  updateCache(src: string, playing: boolean): void;

  /**
   * @deprecated "`AudioHelper#setCache` is deprecated in favor of {@linkcode AudioBufferCache |`AudioHelper#buffers#set}" (since v12, until v14)
   */
  setCache(src: string, buffer: AudioBuffer): void;

  #AudioHelper: true;
}

declare namespace AudioHelper {
  interface Any extends AnyAudioHelper {}
  interface AnyConstructor extends Identity<typeof AnyAudioHelper> {}

  type AUDIO_MIME_TYPES = ValueOf<typeof CONST.AUDIO_FILE_EXTENSIONS>;

  interface AnalysisDataValueDB {
    /** Average dB in ~20-200 Hz */
    bass: number;

    /** Average dB in ~200-2000 Hz */
    mid: number;

    /** Average dB in ~2000-8000 Hz */
    treble: number;

    /** Average dB in ~20-20000 Hz */
    all: number;
  }

  interface AnalysisDataValueBands {
    /** Normalized amplitude for low frequencies. */
    bass: number;

    /** Normalized amplitude for midrange frequencies. */
    mid: number;

    /** Normalized amplitude for high frequencies. */
    treble: number;

    /** Normalized amplitude for the entire audible range. */
    all: number;
  }

  interface AnalysisDataValue {
    /** Whether the analyzer is currently active. */
    active: boolean;

    /** If true, the analyzer remains active and will not be disabled after inactivity */
    keepAlive: boolean;

    /** The {@linkcode AnalyserNode} for this context, or `null` if inactive. */
    node: AnalyserNode | null;

    /** The FFT frequency data buffer used by the {@linkcode AnalyserNode}. */
    dataArray: Float32Array | null;

    /** Raw average decibel values for each frequency band. */
    db: AnalysisDataValueDB;

    /** Normalized [0,1] values for the same bands. */
    bands: AnalysisDataValueBands;

    /** The timestamp when data was last requested. */
    lastUsed: number;
  }

  interface AnalysisData {
    /** Analysis data for the music context. */
    music: AnalysisDataValue;

    /** Analysis data for the ambient/environment context. */
    environment: AnalysisDataValue;

    /** Analysis data for the interface context. */
    interface: AnalysisDataValue;

    /** Whether the internal RAQ loop is currently running. */
    analysisLoopActive: boolean;
  }

  /** @privateRemarks Foundry has this in a `_types` as a union of literals, but it lines up with `AUDIO_CHANNELS` so is typed thusly */
  type ContextName = keyof typeof CONST.AUDIO_CHANNELS;

  type BandName = keyof AnalysisDataValueBands;

  /** @internal */
  type _SoundCreationOptions = InexactPartial<{
    /**
     * Additional options passed to the play method if autoplay is true
     * @defaultValue `{}`
     */
    autoplayOptions: Sound.PlaybackOptions;

    /**
     * A specific AudioContext to attach the sound to
     * @remarks Has no default, but if it's falsey, the {@linkcode Sound} constructor
     * (where this is forwarded) will use {@linkcode AudioHelper.music | game.audio.music} instead
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
   * {@linkcode AudioHelper#play} pulls `context` out of this object then forwards the rest to {@linkcode Sound.play | Sound#play}
   */
  interface PlayOptions extends Pick<SoundCreationOptions, "context">, Sound.PlaybackOptions {}

  /** @internal */
  type _PlayData = InexactPartial<{
    /**
     * The volume level at which to play the audio, between 0 and 1.
     * @defaultValue `1.0`
     * @privateRemarks Despite the initial default being via `mergeObject`, there's a second `??` default so it's allowed to be nullish
     */
    volume: number;

    /**
     * Loop the audio effect and continue playing it until it is manually stopped.
     * @defaultValue `false`
     * @privateRemarks Despite the default being via `mergeObject`, {@linkcode Sound.PlaybackOptions.loop | Sound.PlaybackOptions["loop"]} can be nullish, therefor so can this
     */
    loop: boolean;
  }>;

  interface PlayData extends _PlayData {
    /**
     * The audio source file path, either a public URL or a local path relative to the public directory
     */
    src: string;

    /**
     * An audio channel in {@linkcode CONST.AUDIO_CHANNELS} where the sound should play
     * @defaultValue `"interface"`
     * @remarks Can't be nullish as the only default is provided by `mergeObject`
     */
    channel?: AudioHelper.ContextName;

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
    autoplay?: false;
  }

  interface SocketOptions {
    /**
     * An array of user IDs to push audio playback to. All users by default.
     * @remarks Nullish values cause errors, but omitting this key (passing an empty object) is the same as passing `true` (all players)
     */
    recipients?: string[];
  }

  /** @internal */
  type _VolumeToPercentageOptions = InexactPartial<{
    /**
     * Prefix the returned tooltip with a localized 'Volume: ' label. This should be used if the returned string is intended for assistive
     * technologies, such as the `aria-value` text attribute.
     * @defaultValue `false`
     */
    label: boolean;

    /**
     * The number of decimal places to round the percentage to.
     * @defaultValue `0`
     */
    decimalPlaces: number;
  }>;

  interface VolumeToPercentageOptions extends _VolumeToPercentageOptions {}

  /** @internal */
  type _EnableAnalyzerOptions = InexactPartial<{
    /**
     * If true, this analyzer will not auto-disable after inactivity.
     * @defaultValue `false`
     */
    keepAlive: boolean;
  }>;

  interface EnableAnalyzerOptions extends _EnableAnalyzerOptions {}

  /** @internal */
  type _GetBandLevelOptions = InexactPartial<{
    /**
     * If true, remove the real-time channel volume from the measurement.
     * @defaultValue `false`
     */
    ignoreVolume: boolean;
  }>;

  interface GetBandLevelOptions extends _GetBandLevelOptions {}

  interface GetMaxBandLevelOptions extends _GetBandLevelOptions {}

  type LevelReportCallback = (maxDecibel: number, fftArray: Float32Array) => void;
}

export default AudioHelper;

declare abstract class AnyAudioHelper extends AudioHelper {
  constructor(...args: never);
}
