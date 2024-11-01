import type Sound from "./sound.d.mts";
import type AudioBufferCache from "./cache.d.mts";
import type { InexactPartial } from "../../../types/utils.d.mts";

/**
 * A helper class to provide common functionality for working with the Web Audio API.
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
 * A singleton instance of this class is available as game#audio.
 * @see Game#audio
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
  sounds: Map<string, Sound>;

  /**
   * Get a map of the Sound objects which are currently playing.
   */
  playing: Map<number, Sound>;

  /**
   * A user gesture must be registered before audio can be played.
   * This Array contains the Sound instances which are requested for playback prior to a gesture.
   * Once a gesture is observed, we begin playing all elements of this Array.
   * @see Sound
   * @defaultValue `[]`
   */
  pending: (() => void)[];

  /**
   * A Promise which resolves once the game audio API is unlocked and ready to use.
   */
  unlock: ReturnType<this["awaitFirstGesture"]>;

  /**
   * A flag for whether video playback is currently locked by awaiting a user gesture
   * @defaultValue `true`
   */
  locked: boolean;

  /**
   * A singleton audio context used for playback of music
   */
  music: AudioContext;

  /**
   * A singleton audio context used for playback of environmental audio.
   */
  environment: AudioContext;

  /**
   * A singleton audio context used for playback of interface sounds and effects.
   */
  interface: AudioContext;

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
  play(
    src: string,
    options?: Sound.PlaybackOptions & InexactPartial<{
      /** A specific AudioContext within which to play */
      context: AudioContext;
    }>,
  ): Promise<Sound>;

  /**
   * Register an event listener to await the first mousemove gesture and begin playback once observed
   * @returns The unlocked audio context
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
  static play(
    data: AudioHelper.PlayData,
    socketOptions?:
      | boolean
      | {
          /** An array of user IDs to push audio playback to. All users by default. */
          recipients: string[];
        },
  ): Promise<Sound>;

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
   * @param order - The exponent of the curve
   *                (default: `1.5`)
   */
  static inputToVolume(value: number | string, order?: number): number;

  /**
   * Counterpart to inputToVolume()
   * Returns the input range value based on a volume
   * @param volume - Value between [0, 1] of the volume level
   * @param order  - The exponent of the curve
   */
  static volumeToInput(volume: number, order?: number): number;

  /**
   * Returns a singleton AudioContext if one can be created.
   * An audio context may not be available due to limited resources or browser compatibility
   * in which case null will be returned
   *
   * @returns A singleton AudioContext or null if one is not available
   */
  getAnalyzerContext(): AudioContext | null;

  /**
   * Registers a stream for periodic reports of audio levels.
   * Once added, the callback will be called with the maximum decibel level of
   * the audio tracks in that stream since the last time the event was fired.
   * The interval needs to be a multiple of `AudioHelper.levelAnalyserNativeInterval` which defaults at 50ms
   *
   * @param id        - An id to assign to this report. Can be used to stop reports
   * @param stream    - The MediaStream instance to report activity on.
   * @param callback  - The callback function to call with the decibel level.
   * @param interval  - The interval at which to produce reports.
   *                    (default: `50`)
   * @param smoothing - The smoothingTimeConstant to set on the audio analyser.
   *                    (default: `0.1`)
   * @returns Returns whether listening to the stream was successful
   */
  startLevelReports(
    id: string,
    stream: MediaStream,
    callback: (maxDecibel: number, fftArray: Float32Array) => void,
    interval?: number,
    smoothing?: number,
  ): boolean | undefined;

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
   */
  getCache(src: string): AudioBuffer | undefined;

  /**
   * @deprecated since v12, will be removed in v14
   */
  updateCache(src: string, playing: boolean): void;

  /**
   * @deprecated since v12, will be removed in v14
   */
  setCache(src: string, buffer: AudioBuffer): void;
}

declare namespace AudioHelper {
  interface SoundCreationOptions {
    /**
     * The source URL for the audio file
     */
    src: string;

    /**
     * A specific AudioContext to attach the sound to
     */
    context: AudioContext;

    /**
     * Reuse an existing Sound for this source?
     * @defaultValue `true`
     */
    singleton?: boolean;

    /**
     * Begin loading the audio immediately?
     * @defaultValue `false`
     */
    preload?: boolean;

    /**
     * Begin playing the audio as soon as it is ready?
     * @defaultValue `false`
     */
    autoplay?: boolean;

    /**
     * Additional options passed to the play method if autoplay is true
     * @defaultValue `{}`
     */
    autoplayOptions?: Sound.PlaybackOptions;
  }

  interface PlayData {
    /**
     * The audio source file path, either a public URL or a local path relative to the public directory
     */
    src: string;

    /** An audio channel in CONST.AUDIO_CHANNELS where the sound should play */
    channel?: keyof typeof CONST.AUDIO_CHANNELS;

    /**
     * The volume level at which to play the audio, between 0 and 1.
     * @defaultValue `1.0`
     */
    volume?: number;

    /**
     * Begin playback of the audio effect immediately once it is loaded.
     * @deprecated You are using the autoplay option of AudioHelper.play which is no longer supported in 0.8.0
     */
    autoplay?: boolean;

    /**
     * Loop the audio effect and continue playing it until it is manually stopped.
     * @defaultValue `false`
     */
    loop?: boolean;
  }
}

export default AudioHelper;
