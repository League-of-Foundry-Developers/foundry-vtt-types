/**
 * The Sound class is used to control the playback of audio sources using the Web Audio API.
 */
declare class Sound {
  constructor(src: string, options?: { container?: AudioContainer });

  /**
   * The numeric identifier for accessing this node
   */
  id: number;

  /**
   * The audio source path
   */
  src: string;

  /**
   * The AudioContainer which controls playback
   */
  container: AudioContainer;

  /**
   * The time in seconds at which playback was started
   * @defaultValue `undefined`
   */
  startTime: number | undefined;

  /**
   * The time in seconds at which playback was paused
   * @defaultValue `undefined`
   */
  pausedTime: number | undefined;

  /**
   * Registered event callbacks
   * @defaultValue `{stop: {}, start: {}, end: {}, pause: {}, load: {}}`
   */
  events: Sound.EventCallbacks;

  /**
   * The registered event handler id for this Sound.
   * Incremented each time a callback is registered.
   * @defaultValue `1`
   * @internal
   */
  protected _eventHandlerId: number;

  /**
   * If this Sound source is currently in the process of loading, this attribute contains a Promise that will resolve
   * when the loading process completes.
   * @defaultValue `undefined`
   */
  loading: Promise<void> | undefined;

  /**
   * A collection of scheduled events recorded as window timeout IDs
   * @internal
   */
  protected _scheduledEvents: Set<number>;

  /**
   * A global audio node ID used to quickly reference a specific audio node
   * @defaultValue `0`
   * @internal
   */
  protected static _nodeId: number;

  /**
   * A convenience reference to the sound context used by the application
   */
  get context(): AudioContext;

  /**
   * A reference to the audio source node being used by the AudioContainer
   */
  get node(): AudioBufferSourceNode | MediaElementAudioSourceNode | undefined;

  /**
   * A reference to the GainNode parameter which controls volume
   */
  get gain(): AudioParam | undefined;

  /**
   * The current playback time of the sound
   */
  get currentTime(): number | undefined;

  /**
   * The total sound duration, in seconds
   */
  get duration(): number | undefined;

  /**
   * Is the contained audio node loaded and ready for playback?
   */
  get loaded(): boolean;

  /**
   * Did the contained audio node fail to load?
   */
  get failed(): boolean;

  /**
   * Is the audio source currently playing?
   */
  get playing(): boolean;

  /**
   * Is the Sound current looping?
   */
  get loop(): boolean;
  set loop(looping: boolean);

  /**
   * The volume at which the Sound is playing
   */
  get volume(): number | undefined;
  set volume(value: number | undefined);

  /**
   * Fade the volume for this sound between its current level and a desired target volume
   * @param volume  - The desired target volume level between 0 and 1
   * @param options - Additional options that configure the fade operation
   *                  (default: `{}`)
   * @returns A Promise that resolves after the requested fade duration
   */
  fade(volume: number, options?: Sound.FadeOptions): Promise<void>;

  /**
   * Load the audio source, creating an AudioBuffer.
   * Audio loading is idempotent, it can be requested multiple times but only the first load request will be honored.
   * @param options - Additional options which affect resource loading
   *                  (default: `{}`)
   * @returns The Sound once its source audio buffer is loaded
   */
  load(options?: Sound.LoadOptions): Promise<Sound>;

  /**
   * Begin playback for the sound node
   * @param options - Options which configure playback
   *                  (default: `{}`)
   */
  play(options?: Sound.PlayOptions): void;

  /**
   * Pause playback, remembering the playback position in order to resume later.
   */
  pause(): void;

  /**
   * Stop playback, fully resetting the Sound to a non-playing state.
   */
  stop(): void;

  /**
   * Schedule a function to occur at the next occurrence of a specific playbackTime for this Sound.
   * @param fn           - A function that will be called with this Sound as its single argument
   * @param playbackTime - The desired playback time at which the function should be called
   * @returns A Promise which resolves once the scheduled function has been called
   *
   * @example Schedule audio playback changes
   * ```typescript
   * sound.schedule(() => console.log("Do something exactly 30 seconds into the track"), 30);
   * sound.schedule(() => console.log("Do something next time the track loops back to the beginning"), 0);
   * sound.schedule(() => console.log("Do something 5 seconds before the end of the track"), sound.duration - 5);
   * ```
   */
  schedule(fn: Sound.Callback, playbackTime: number): Promise<void>;

  /**
   * Trigger registered callback functions for a specific event name.
   * @param eventName - The event name being emitted
   */
  emit(eventName: Sound.EventName): void;

  /**
   * Deactivate an event handler which was previously registered for a specific event
   * @param eventName - The event name being deactivated
   * @param fn        - The callback ID or callback function being un-registered
   */
  off(eventName: Sound.EventName, fn: number | Sound.Callback): void;

  /**
   * Register an event handler to take actions for a certain Sound event.
   * @param eventName- The event name being deactivated
   * @param fn       - The callback function to trigger when the event occurs
   * @param options  - Additional options that affect callback registration
   *                   (default: `{}`)
   */
  on(eventName: Sound.EventName, fn: Sound.Callback, options?: Sound.OnOptions): number;

  /**
   * Register a new callback function for a certain event. For internal use only.
   * @internal
   */
  protected _registerForEvent(eventName: Sound.EventName, callback: Sound.Callback): number;

  /**
   * Cancel all pending scheduled events.
   * @internal
   */
  protected _clearEvents(): void;

  /**
   * Called when playback concludes naturally
   */
  protected _onEnd(): void;

  /**
   * Called when the audio buffer is first loaded
   */
  protected _onLoad(): void;

  /**
   * Called when playback is paused
   */
  protected _onPause(): void;

  /**
   * Called when the sound begins playing
   */
  protected _onStart(): void;

  /**
   * Called when playback is stopped (prior to naturally reaching the end)
   */
  protected _onStop(): void;
}

declare namespace Sound {
  type Callback = (sound: Sound) => void;

  type EventName = "end" | "pause" | "start" | "stop" | "load";

  type EventCallbacks = Record<EventName, Partial<Record<number, Callback>>>;

  type FadeType = "linear" | "exponential";

  interface FadeOptions {
    /**
     * The duration of the fade effect in milliseconds
     * @defaultValue `1000`
     */
    duration?: number;

    /**
     * A volume level to start from, the current volume by default
     */
    from?: number;

    /**
     * The type of fade easing, "linear" or "exponential"
     * @defaultValue `"linear"`
     */
    type?: FadeType;
  }

  interface LoadOptions {
    /**
     * Automatically begin playback of the audio source once loaded
     * @defaultValue `false`
     */
    autoplay?: boolean;

    /**
     * Additional options passed to the play method when loading is complete
     * @defaultValue `{}`
     */
    autoplayOptions?: PlayOptions;
  }

  interface PlayOptions {
    /**
     * Whether to loop the audio automatically
     * @defaultValue `false`
     */
    loop?: boolean;

    /**
     * A specific offset in seconds at which to begin playback
     */
    offset?: number;

    /**
     * The desired volume at which to begin playback
     */
    volume?: number;

    /**
     * Fade volume changes over a desired duration in milliseconds
     * @defaultValue `0`
     */
    fade?: number;
  }

  interface OnOptions {
    /**
     * Trigger the callback once only and automatically un-register it
     * @defaultValue `false`
     */
    once?: boolean;
  }
}
