/**
 * A helper class to provide common functionality for working with HTML5 audio and Howler instances
 * A singleton instance of this class is available as `game.audio`
 *
 * Audio playback in Foundry VTT is managed by Howler.js (https://howlerjs.com/). Several methods and
 * attributes in this API return :class:`Howl` instances. See the Howler documentation for details
 * and example usage of the Howl API.
 */
declare class AudioHelper {
  constructor ()

  /**
   * The set of Howl instances which have been created for different audio paths
   * @defaultValue `{}`
   */
  sounds: Record<string, AudioHelper.Sound>

  /**
   * A user gesture must be registered before audio can be played.
   * This Array contains the Howl instances which are requested for playback prior to a gesture.
   * Once a gesture is observed, we begin playing all elements of this Array.
   * @defaultValue `[]`
   */
  pending: Howl[]

  /**
   * A flag for whether video playback is currently locked by awaiting a user gesture
   * @defaultValue `false`
   */
  locked: boolean

  /**
   * Audio Context singleton used for analysing audio levels of each stream
   * Only created if necessary to listen to audio streams.
   * @defaultValue `null`
   */
  _audioContext: AudioContext | null

  /**
   * Map of all streams that we listen to for determining the decibel levels.
   * Used for analyzing audio levels of each stream.
   *
   * @internal
   */
  _analyserStreams: Record<string, AudioHelper.AnalyserStream>

  /**
   * Interval ID as returned by setInterval for analysing the volume of streams
   * When set to 0, means no timer is set.
   * @internal
   * @defaultValue `0`
   */
  _analyserInterval: number

  /**
   * Fast Fourrier Transform Array.
   * Used for analysing the decibel level of streams. The array is allocated only once
   * then filled by the analyser repeatedly. We only generate it when we need to listen to
   * a stream's level, so we initialize it to null.
   * @internal
   * @defaultValue `null`
   */
  _fftArray: Float32Array[] | null

  /**
   * The Native interval for the AudioHelper to analyse audio levels from streams
   * Any interval passed to startLevelReports() would need to be a multiple of this value.
   * Defaults to 50ms.
   * @defaultValue `50`
   */
  levelAnalyserNativeInterval: number

  /* -------------------------------------------- */

  /**
   * Register client-level settings for global volume overrides
   */
  static registerSettings (): void

  /* -------------------------------------------- */

  /**
   * Create a Howl instance for a given audio source URL
   * @param preload  - (default: `false`)
   * @param autoplay - (default: `false`)
   * @param html5    - (default: `false`)
   * @param volume   - (default: `0.0`)
   * @param loop     - (default: `false`)
   */
  create ({ src, preload, autoplay, html5, volume, loop }?: {
    src: string
    preload?: boolean
    autoplay?: boolean
    html5?: boolean
    volume?: number
    loop?: boolean
  }): Howl

  /* -------------------------------------------- */

  /**
   * Test whether a source file has a supported audio extension type
   * @param src - A requested audio source path
   * @returns Does the filename end with a valid audio extension?
   */
  static hasAudioExtension (src: string): boolean

  /* -------------------------------------------- */

  /**
   * Play a single audio effect by it's source path and Howl ID
   */
  play (src: string, id: number): void

  /* -------------------------------------------- */

  /**
   * Register an event listener to await the first mousemove gesture and begin
   * playback once observed
   */
  awaitFirstGesture (): void

  /* -------------------------------------------- */

  /**
   * Handle the first observed user gesture
   * @param event - The mouse-move event which enables playback
   */
  _onFirstGesture (event: Event): void

  /* -------------------------------------------- */

  preload (data: any): void

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers               */
  /* -------------------------------------------- */

  /**
   * Open socket listeners which transact ChatMessage data
   * @internal
   */
  static socketListeners (socket: any): void

  /* -------------------------------------------- */

  /**
   * Play a one-off sound effect which is not part of a Playlist
   *
   * @param data     - An object configuring the audio data to play
   * @param src      - The audio source file path, either a public URL or a local path relative to the public directory
   *                   (default: `null`)
   * @param volume   - The volume level at which to play the audio, between 0 and 1
   *                   (default: `1.0`)
   * @param autoplay - Begin playback of the audio effect immediately once it is loaded.
   *                   (default: `true`)
   * @param loop     - Loop the audio effect and continue playing it until it is manually stopped.
   *                   (default: `false`)
   * @param push     - Push the audio sound effect to other connected clients?
   *                   (default: `false`)
   *
   * @returns A Howl instance which controls audio playback.
   *
   * @example
   * ```typescript
   * // Play the sound of a locked door for all players
   * AudioHelper.play({src: "sounds/lock.wav", volume: 0.8, autoplay: true, loop: false}, true);
   * ```
   */
  static play (
    data: {
      /**
       * The audio source file path, either a public URL or a local path relative to the public directory
       * @defaultValue `null`
       */
      src: string

      /**
       * The volume level at which to play the audio, between 0 and 1
       * @defaultValue `1.0`
       */
      volume: number

      /**
       * Begin playback of the audio effect immediately once it is loaded.
       * @defaultValue `true`
       */
      autoplay: boolean

      /**
       * Push the audio sound effect to other connected clients?
       * @defaultValue `false`
       */
      loop: boolean
    },
    push: boolean
  ): Howl

  /* -------------------------------------------- */

  /**
   * Create a Howl object and load it to be ready for later playback
   * @param data - The audio data to preload
   */
  static preload (data: object): void

  /* -------------------------------------------- */

  /**
   * Returns the volume value based on a range input volume control's position.
   * This is using an exponential approximation of the logarithmic nature of audio level perception
   * @param value - Value between [0, 1] of the range input
   * @param order - the exponent of the curve
   *                (default: `1.5`)
   */
  static inputToVolume (control: number | string, order?: number): number

  /* -------------------------------------------- */

  /**
   * Counterpart to inputToVolume()
   * Returns the input range value based on a volume
   * @param volume - Value between [0, 1] of the volume level
   * @param order - the exponent of the curve
   *                (default: `1.5`)
   */
  static volumeToInput (volume: number, order?: number): number

  /* -------------------------------------------- */
  /*  Audio Stream Analysis                       */
  /* -------------------------------------------- */

  /**
   * Returns a singleton AudioContext if one can be created.
   * An audio context may not be available due to limited resources or browser compatibility
   * in which case null will be returned
   *
   * @returns A singleton AudioContext or null if one is not available
   */
  getAudioContext (): AudioContext | null

  /* -------------------------------------------- */

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
   *                    Refer to AudioAnalyser API docs.
   *                    (default: `0.1`)
   * @returns Returns whether or not listening to the stream was successful
   */
  startLevelReports (
    id: string,
    stream: MediaStream,
    callback: (maxDecibel: number, fftArray: Float32Array) => void,
    interval?: number,
    smoothing?: number
  ): boolean

  /* -------------------------------------------- */

  /**
   * Stop sending audio level reports
   * This stops listening to a stream and stops sending reports.
   * If we aren't listening to any more streams, cancel the global analyser timer.
   * @param id - The id of the reports that passed to startLevelReports.
   */
  stopLevelReports (id: string): void

  /* -------------------------------------------- */

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
  _ensureAnalyserTimer (): void

  /* -------------------------------------------- */

  /**
   * Cancel the global analyser timer
   * If the timer is running and has become unnecessary, stops it.
   * @internal
   */
  _cancelAnalyserTimer (): void

  /* -------------------------------------------- */

  /**
   * Capture audio level for all speakers and emit a webrtcVolumes custom event with all the volume levels
   * detected since the last emit.
   * The event's detail is in the form of `{userId: decibelLevel}`
   * @internal
   */
  _emitVolumes (): void
}

declare namespace AudioHelper {
  interface AnalyserStream {
    stream: MediaStream
    analyser: AnalyserNode
    interval: number
    callback: (maxDecibel: number) => void

    /**
     * Used as a counter of 50ms increments in case the interval is more than 50
     * @defaultValue `0`
     */
    _lastEmit: number
  }

  interface Sound {
    howl: Howl
    loaded: boolean
    ids: []
  }
}
