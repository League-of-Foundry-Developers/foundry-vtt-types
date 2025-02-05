import type { AnyObject, InexactPartial, ValueOf } from "fvtt-types/utils";
import type EventEmitterMixin from "../../common/utils/event-emitter.d.mts";

declare namespace Sound {
  interface PlaybackOptions extends _PlaybackOptions {}

  /** @internal */
  type _PlaybackOptions = InexactPartial<{
    /**
     * A delay in seconds by which to delay playback
     * @defaultValue `0`
     */
    delay: number;

    /** A limited duration in seconds for which to play */
    duration: number;

    /**
     * A duration in milliseconds over which to fade in playback
     * @defaultValue `0`
     */
    fade: number;

    /** Should sound playback loop? */
    loop: boolean;

    /** Seconds of the AudioBuffer when looped playback should start. Only works for AudioBufferSourceNode. */
    loopStart: number;

    /** Seconds of the Audio buffer when looped playback should restart. Only works for AudioBufferSourceNode. */
    loopEn: number;

    /** An offset in seconds at which to start playback */
    offset: number;

    /** A callback function attached to the source node */
    onended: ((sound: Sound) => void) | null;

    /** The volume at which to play the sound */
    volume: number;
  }>;

  type ScheduleCallback = (sound: Sound) => unknown;
}

/**
 * A container around an AudioNode which manages sound playback in Foundry Virtual Tabletop.
 * Each Sound is either an AudioBufferSourceNode (for short sources) or a MediaElementAudioSourceNode (for long ones).
 * This class provides an interface around both types which allows standardized control over playback.
 */
declare class Sound extends EventEmitterMixin(Object) {
  /**
   * Construct a Sound by providing the source URL and other options.
   * @param src     - The audio source path, either a relative path or a remote URL
   * @param options - Additional options which configure the Sound
   */
  constructor(
    src: string,
    options?: InexactPartial<{
      /**
       * A non-default audio context within which the sound should play
       */
      context: AudioContext;

      /**
       * Force use of an AudioBufferSourceNode even if the audio duration is long
       */
      forceBuffer: boolean;
    }>,
  );

  /**
   * The sequence of container loading states.
   */
  static readonly STATES: {
    FAILED: -1;
    NONE: 0;
    LOADING: 1;
    LOADED: 2;
    STARTING: 3;
    PLAYING: 4;
    PAUSED: 5;
    STOPPING: 6;
    STOPPED: 7;
  };

  /**
   * The maximum duration, in seconds, for which an AudioBufferSourceNode will be used.
   * Otherwise, a MediaElementAudioSourceNode will be used.
   * @defaultValue `10 * 60;  // 10 Minutes`
   */
  static MAX_BUFFER_DURATION: number;

  /**
   * @defaultValue `["load", "play", "pause", "end", "stop"]`
   */
  static override emittedEvents: string[];

  /**
   * A unique integer identifier for this sound.
   */
  id: number;

  /**
   * The audio source path.
   * Either a relative path served by the running Foundry VTT game server or a remote URL.
   */
  src: string;

  /**
   * The audio context within which this Sound is played.
   */
  get context(): AudioContext;

  /**
   * The AudioSourceNode used to control sound playback.
   */
  get sourceNode(): AudioBufferSourceNode | MediaElementAudioSourceNode;

  /**
   * The GainNode used to control volume for this sound.
   */
  gainNode: GainNode;

  /**
   * An AudioBuffer instance, if this Sound uses an AudioBufferSourceNode for playback.
   */
  buffer: AudioBuffer | null;

  /**
   * An HTMLAudioElement, if this Sound uses a MediaElementAudioSourceNode for playback.
   */
  element: HTMLAudioElement | null;

  /**
   * The life-cycle state of the sound.
   */
  _state: ValueOf<typeof Sound.STATES>;

  /**
   * Has the audio file been loaded either fully or for streaming.
   */
  get loaded(): boolean;

  /**
   * Did the audio file fail to load.
   */
  get failed(): boolean;

  /**
   * Is this sound currently playing?
   */
  get playing(): boolean;

  /**
   * Does this Sound use an AudioBufferSourceNode?
   * Otherwise, the Sound uses a streamed MediaElementAudioSourceNode.
   */
  get isBuffer(): boolean;

  /**
   * A convenience reference to the GainNode gain audio parameter.
   */
  get gain(): AudioParam;

  /**
   * The AudioNode destination which is the output target for the Sound.
   */
  destination: AudioNode;

  /**
   * A pipeline of AudioNode instances to be applied to Sound playback.
   */
  effects: AudioNode[];

  /**
   * The currently playing volume of the sound.
   * Undefined until playback has started for the first time.
   */
  get volume(): number;

  set volume(value);

  /**
   * The time in seconds at which playback was started.
   */
  startTime: number;

  /**
   * The time in seconds at which playback was paused.
   */
  pausedTime: number;

  /**
   * The total duration of the audio source in seconds.
   */
  get duration(): number;

  /**
   * The current playback time of the sound.
   */
  get currentTime(): number;

  /**
   * Is the sound looping?
   */
  get loop(): boolean;

  set loop(value);

  /**
   * An internal reference to some object which is managing this Sound instance.
   */
  protected _manager: AnyObject | null;

  /**
   * Load the audio source and prepare it for playback, either using an AudioBuffer or a streamed HTMLAudioElement.
   * @param options - Additional options which affect resource loading
   * @returns A Promise which resolves to the Sound once it is loaded
   */
  load(
    options?: InexactPartial<{
      /**
       * Automatically begin playback of the sound once loaded
       * @defaultValue `false`
       */
      autoplay: boolean;

      /**
       * Playback options passed to Sound#play, if autoplay
       */
      autoplayOptions: Sound.PlaybackOptions;
    }>,
  ): Promise<this>;

  /**
   * An inner method which handles loading so that it can be de-duplicated under a single shared Promise resolution.
   * This method is factored out to allow for subclasses to override loading behavior.
   * @returns A Promise which resolves once the sound is loaded
   * @throws An error if loading failed for any reason
   */
  protected _load(): Promise<void>;

  /**
   * Begin playback for the Sound.
   * This method is asynchronous because playback may not start until after an initially provided delay.
   * The Promise resolves *before* the fade-in of any configured volume transition.
   * @param options - Options which configure the beginning of sound playback
   * @returns A Promise which resolves once playback has started (excluding fade)
   */
  play(options?: Sound.PlaybackOptions): Promise<this>;

  /**
   * Begin playback for the configured pipeline and playback options.
   * This method is factored out so that subclass implementations of Sound can implement alternative behavior.
   */
  protected _play(): void;

  /**
   * Pause playback of the Sound.
   * For AudioBufferSourceNode this stops playback after recording the current time.
   * Calling Sound#play will resume playback from the pausedTime unless some other offset is passed.
   * For a MediaElementAudioSourceNode this simply calls the HTMLAudioElement#pause method directly.
   */
  pause(): void;

  /**
   * Pause playback of the Sound.
   * This method is factored out so that subclass implementations of Sound can implement alternative behavior.
   */
  protected _pause(): void;

  /**
   * Stop playback for the Sound.
   * This method is asynchronous because playback may not stop until after an initially provided delay.
   * The Promise resolves *after* the fade-out of any configured volume transition.
   * @param options - Options which configure the stopping of sound playback
   * @returns A Promise which resolves once playback is fully stopped (including fade)
   */
  stop(options?: Sound.PlaybackOptions): Promise<this>;

  /**
   * Stop playback of the Sound.
   * This method is factored out so that subclass implementations of Sound can implement alternative behavior.
   */
  protected _stop(): void;

  /**
   * Fade the volume for this sound between its current level and a desired target volume.
   * @param volume  - The desired target volume level between 0 and 1
   * @param options - Additional options that configure the fade operation
   * @returns A Promise that resolves after the requested fade duration
   */
  fade(
    volume: number,
    options?: InexactPartial<{
      /**
       * The duration of the fade effect in milliseconds
       * @defaultValue `1000`
       */
      duration: number;

      /**
       * A volume level to start from, the current volume by default
       */
      from: number;

      /**
       * The type of fade easing, "linear" or "exponential"
       * @defaultValue `"linear"`
       */
      type: "linear" | "exponential";
    }>,
  ): Promise<void>;

  /**
   * Wait a certain scheduled duration within this sound's own AudioContext.
   * @param duration - The duration to wait in milliseconds
   * @returns A promise which resolves after the waited duration
   */
  wait(duration: number): Promise<void>;

  /**
   * Schedule a function to occur at the next occurrence of a specific playbackTime for this Sound.
   * @param fn           - A function that will be called with this Sound as its single argument
   * @param playbackTime - The desired playback time at which the function should be called
   * @returns A Promise which resolves to the returned value of the provided function once it has been evaluated.
   *
   * @example Schedule audio playback changes
   * ```js
   * sound.schedule(() => console.log("Do something exactly 30 seconds into the track"), 30);
   * sound.schedule(() => console.log("Do something next time the track loops back to the beginning"), 0);
   * sound.schedule(() => console.log("Do something 5 seconds before the end of the track"), sound.duration - 5);
   * ```
   */
  schedule<R extends Sound.ScheduleCallback>(fn: R, playbackTime: number): Promise<Awaited<ReturnType<R>>>;

  /**
   * Update the array of effects applied to a Sound instance.
   * Optionally a new array of effects can be assigned. If no effects are passed, the current effects are re-applied.
   * @param effects - An array of AudioNode effects to apply
   */
  applyEffects(effects?: AudioNode[]): void;

  /**
   * Create any AudioNode instances required for playback of this Sound.
   */
  protected _createNodes(): void;

  /**
   * Create the audio pipeline used to play this Sound.
   * The GainNode is reused each time to link volume changes across multiple playbacks.
   * The AudioSourceNode is re-created every time that Sound#play is called.
   */
  protected _connectPipeline(): void;

  /**
   * Disconnect the audio pipeline once playback is stopped.
   * Walk backwards along the Sound##pipeline from the Sound#destination, disconnecting each node.
   */
  protected _disconnectPipeline(): void;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"AudioContainer.LOAD_STATES is deprecated in favor of Sound.STATES"`
   */
  static get LOAD_STATES(): Record<string, number>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"AudioContainer#loadState is deprecated in favor of Sound#_state"`
   */
  get loadState(): number;

  /**
   * @deprecated since v12, will be removed in v14
   */
  get container(): this;

  /**
   * @deprecated since v12, will be removed in v14
   */
  get node(): this["sourceNode"];

  /**
   * @deprecated since v12, will be removed in v14
   */
  on(eventName: unknown, fn: unknown, options?: unknown): number;

  /**
   * @deprecated since v12, will be removed in v14
   */
  off(eventName: unknown, fn: unknown): void;

  /**
   * @deprecated since v12, will be removed in v14
   */
  emit(eventName: unknown): void;
}

export default Sound;
