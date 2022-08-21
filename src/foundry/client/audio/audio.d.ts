/**
 * A helper class to provide common functionality for working with the Web Audio API.
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
 * A singleton instance of this class is available as game#audio.
 * @see Game#audio
 */
declare class AudioHelper {
  constructor();

  /**
   * The primary Audio Context used to play client-facing sounds.
   * The context is undefined until the user's first gesture is observed.
   * @defaultValue `undefined`
   */
  context: AudioContext | undefined;

  /**
   * The set of AudioBuffer objects which are cached for different audio paths
   */
  buffers: Map<string, { buffer: AudioBuffer; lastAccessed: number; playing: boolean; size: number }>;

  /**
   * The set of singleton Sound instances which are cached for different audio paths
   */
  sounds: Map<string, Sound>;

  /**
   * Get a map of the Sound objects which are currently playing.
   * @remarks It's not actually an `Array` but a `Map`.
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
   * A flag for whether video playback is currently locked by awaiting a user gesture
   * @defaultValue `true`
   */
  locked: boolean;

  /**
   * Audio Context singleton used for analysing audio levels of each stream
   * Only created if necessary to listen to audio streams.
   * @defaultValue `null`
   * @internal
   */
  protected _audioContext: AudioContext | null;

  /**
   * Map of all streams that we listen to for determining the decibel levels.
   * Used for analyzing audio levels of each stream.
   * Format of the object stored is :
   * ```
   * {id:
   *   {
   *     stream: MediaStream,
   *     analyser: AudioAnalyser,
   *     interval: Number,
   *     callback: Function
   *   }
   * }
   * ```
   * @internal
   */
  protected _analyserStreams: Record<string, AudioHelper.AnalyserStream>;

  /**
   * Interval ID as returned by setInterval for analysing the volume of streams
   * When set to 0, means no timer is set.
   * @defaultValue `0`
   * @internal
   */
  protected _analyserInterval: number;

  /**
   * Fast Fourier Transform Array.
   * Used for analysing the decibel level of streams. The array is allocated only once
   * then filled by the analyser repeatedly. We only generate it when we need to listen to
   * a stream's level, so we initialize it to null.
   * @defaultValue `null`
   * @internal
   */
  protected _fftArray: Float32Array | null;

  /**
   * A Promise which resolves once the game audio API is unlocked and ready to use.
   */
  unlock: ReturnType<this["awaitFirstGesture"]>;

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
   * Register client-level settings for global volume overrides
   */
  static registerSettings(): void;

  /**
   * Create a Sound instance for a given audio source URL
   * @param options - Audio creation options
   */
  create(options: AudioHelper.CreateOptions): Sound;

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
   * @param options - Additional options passed to Sound#play
   * @returns The created Sound which is now playing
   */
  play(src: string, options?: Sound.PlayOptions): Promise<Sound>;

  /**
   * Register an event listener to await the first mousemove gesture and begin playback once observed
   * @returns The unlocked audio context
   */
  awaitFirstGesture(): Promise<AudioContext>;

  /**
   * Request that other connected clients begin preloading a certain sound path.
   * @param src - The source file path requested for preload
   * @returns A Promise which resolves once the preload is complete
   */
  preload(src: string): Promise<Sound>;

  /**
   * Retrieve an AudioBuffer from the buffers cache, if it is available
   * @param src - The buffer audio source path
   * @returns The AudioBuffer instance if cached, otherwise undefined
   */
  getCache(src: string): AudioBuffer | undefined;

  /**
   * Update the last accessed time and playing status of a cached buffer.
   * @param src     - The buffer audio source path
   * @param playing - Is the buffer currently playing? (default: `false`)
   */
  updateCache(src: string, playing: boolean): void;

  /**
   * Insert an AudioBuffer into the buffers cache.
   * See https://padenot.github.io/web-audio-perf/#memory-profiling
   * @param src    - The buffer audio source path
   * @param buffer - The AudioBuffer instance
   */
  setCache(src: string, buffer: AudioBuffer): void;

  /**
   * Open socket listeners which transact ChatMessage data
   * @internal
   */
  static _activateSocketListeners(socket: io.Socket): void;

  /**
   * Play a one-off sound effect which is not part of a Playlist
   *
   * @param data - An object configuring the audio data to play
   * @param push - Push the audio sound effect to other connected clients?
   *               (default: `false`)
   *
   * @returns A Sound instance which controls audio playback.
   *
   * @example Play the sound of a locked door for all players
   * ```typescript
   * AudioHelper.play({src: "sounds/lock.wav", volume: 0.8, loop: false}, true);
   * ```
   */
  static play(data: AudioHelper.PlayData, push?: boolean): Promise<Sound>;

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
  getAudioContext(): AudioContext | null;

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
   * @param smoothing - The smoothingTimeConstant to set on the audio analyser. Refer to AudioAnalyser API docs.
   *                    (default: `0.1`)
   * @returns Returns whether or not listening to the stream was successful
   */
  startLevelReports(
    id: string,
    stream: MediaStream,
    callback: (maxDecibel: number, fftArray: Float32Array) => void,
    interval?: number,
    smoothing?: number
  ): boolean | undefined;

  /**
   * Stop sending audio level reports
   * This stops listening to a stream and stops sending reports.
   * If we aren't listening to any more streams, cancel the global analyser timer.
   * @param id - The id of the reports that passed to startLevelReports.
   */
  stopLevelReports(id: string): void;

  /**
   * Ensures the global analyser timer is started
   *
   * We create only one timer that runs every 50ms and only create it if needed, this is meant to optimize things
   * and avoid having multiple timers running if we want to analyse multiple streams at the same time.
   * I don't know if it actually helps much with performance but it's expected that limiting the number of timers
   * running at the same time is good practice and with JS itself, there's a potential for a timer congestion
   * phenomenon if too many are created.
   * @internal
   */
  protected _ensureAnalyserTimer(): void;

  /**
   * Cancel the global analyser timer
   * If the timer is running and has become unnecessary, stops it.
   * @internal
   */
  protected _cancelAnalyserTimer(): void;

  /**
   * Capture audio level for all speakers and emit a webrtcVolumes custom event with all the volume levels
   * detected since the last emit.
   * The event's detail is in the form of `{userId: decibelLevel}`
   * @internal
   */
  protected _emitVolumes(): void;

  /**
   * Handle the first observed user gesture
   * @param event   - The mouse-move event which enables playback
   * @param resolve - The Promise resolution function
   * @internal
   */
  protected _onFirstGesture(event: Event, resolve: () => void): void;

  /**
   * Additional standard callback events that occur whenever a global volume slider is adjusted
   * @param key    - The setting key
   * @param volume - The new volume level
   * @internal
   */
  protected _onChangeGlobalVolume(key: string, volume: number): void;
}

declare namespace AudioHelper {
  interface AnalyserStream {
    stream: MediaStream;
    analyser: AnalyserNode;
    interval: number;
    callback: (maxDecibel: number, fftArray: Float32Array) => void;

    /**
     * Used as a counter of 50ms increments in case the interval is more than 50
     * @defaultValue `0`
     * @internal
     */
    _lastEmit: number;
  }
  interface CreateOptions {
    /**
     * The source URL for the audio file
     */
    src: string;

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
    autoplayOptions?: Sound.PlayOptions;
  }

  interface PlayData {
    /**
     * The audio source file path, either a public URL or a local path relative to the public directory
     */
    src: string;

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
