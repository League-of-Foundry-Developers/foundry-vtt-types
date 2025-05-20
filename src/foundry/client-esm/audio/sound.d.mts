import type { Brand, Identity, InexactPartial, MaybePromise, NullishProps } from "fvtt-types/utils";
import EventEmitterMixin = foundry.utils.EventEmitterMixin;

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
  // options: not null (destructured)
  constructor(src: string, options?: Sound.ConstructorOptions);

  /**
   * The sequence of container loading states.
   */
  static STATES: Sound.States;

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
   * @remarks Set via `Object.defineProperty` during construction, `writable: false, enumerable: true, configurable: false`
   */
  readonly id: number;

  /**
   * The audio source path.
   * Either a relative path served by the running Foundry VTT game server or a remote URL.
   * @remarks Set via `Object.defineProperty` during construction, `writable: false, enumerable: true, configurable: false`
   */
  readonly src: string;

  /**
   * The audio context within which this Sound is played.
   * @remarks Can return `undefined` if no context was passed at construction *and* `game.audio.music` hasn't been initialized yet,
   * which doesn't happen until the first sound is played
   */
  get context(): AudioContext | undefined;

  /**
   * The AudioSourceNode used to control sound playback.
   * @remarks Returns `undefined` if the Sound has either not yet been played or has been stopped
   */
  get sourceNode(): AudioBufferSourceNode | MediaElementAudioSourceNode | undefined;

  /**
   * The GainNode used to control volume for this sound.
   * @remarks Only `undefined` prior to first `play()`
   */
  gainNode: GainNode | undefined;

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
   * @defaultValue `Sound.STATES.NONE`
   */
  protected _state: Sound.STATES;

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
   * @remarks `undefined` if {@link Sound.gainNode | `Sound#gainNode`} is.
   */
  get gain(): AudioParam | undefined;

  /**
   * The AudioNode destination which is the output target for the Sound.
   * @remarks Only `undefined` prior to first `play()`
   */
  destination: AudioNode | undefined;

  /**
   * A pipeline of AudioNode instances to be applied to Sound playback.
   */
  effects: AudioNode[];

  /**
   * The currently playing volume of the sound.
   * Undefined until playback has started for the first time.
   */
  get volume(): number | undefined;

  set volume(value: number);

  /**
   * The time in seconds at which playback was started.
   * @remarks `undefined` if the Sound has either not yet been played or has been stopped
   */
  startTime: number | undefined;

  /**
   * The time in seconds at which playback was paused.
   * @remarks `undefined` until the Sound is paused, and after the Sound is stopped or playback has been resumed
   */
  pausedTime: number | undefined;

  /**
   * The total duration of the audio source in seconds.
   * @remarks `undefined` if the sound isn't loaded yet, or if the sourceNode type is element and also doesn't exist
   */
  get duration(): number | undefined;

  /**
   * The current playback time of the sound.
   * @remarks `undefined` if the Sound has either not yet been played or has been stopped
   */
  get currentTime(): number | undefined;

  /**
   * Is the sound looping?
   */
  get loop(): boolean;

  set loop(value);

  /**
   * An internal reference to some object which is managing this Sound instance.
   * @defaultValue `null`
   * @remarks Foundry marked `@internal`
   *
   * Only ever set *or* read externally by core, so not protected
   *
   * @privateRemarks Foundry types this as `Object|null` but the only place in Core this gets set is in `AmbientSound`, to `this`
   */
  _manager: AmbientSound.Object | null;

  /**
   * Load the audio source and prepare it for playback, either using an AudioBuffer or a streamed HTMLAudioElement.
   * @param options - Additional options which affect resource loading
   * @returns A Promise which resolves to the Sound once it is loaded
   */
  // options: not null (destructured)
  load(options?: Sound.LoadOptions): Promise<this>;

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
   * @deprecated since v12, until v14
   * @remarks "`Sound#play` now takes an object of playback options instead of positional arguments."
   */
  play(offset: number, onended?: Sound.ScheduleCallback | null): Promise<this>;

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
   * @throws If called while the Sound isn't playing
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
  // options: not null (parameter default only, destructured where forwarded)
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
  // options: not null (destructured)
  fade(volume: number, options?: Sound.FadeOptions): Promise<void>;

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
   * @remarks "`AudioContainer.LOAD_STATES` is deprecated in favor of {@link Sound.STATES | `Sound.STATES`}"
   */
  static get LOAD_STATES(): Sound.States;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "`AudioContainer#loadState` is deprecated in favor of {@link Sound._state | `Sound#_state`}"
   */
  get loadState(): Sound.STATES;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "`Sound#container` is deprecated without replacement because the `Sound` and `AudioContainer` classes are now merged"
   */
  get container(): this;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "`Sound#node` is renamed {@link Sound.sourceNode | `Sound#sourceNode`}"
   */
  get node(): this["sourceNode"];

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "`Sound#on` is deprecated in favor of {@link Sound.addEventListener | `Sound#addEventListener`}"
   */
  on(eventName: string, fn: EventEmitterMixin.EventListener, options?: EventEmitterMixin.AddListenerOptions): void;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "`Sound#off` is deprecated in favor of {@link Sound.removeEventListener | `Sound#removeEventListener`}"
   */
  off(eventName: string, fn: EventEmitterMixin.EventListener): void;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "`Sound#emit` is deprecated in favor of {@link Sound.dispatchEvent | `Sound#dispatchEvent`}"
   *
   * This method still takes a string, then creates an `Event` with it and passes that along to `dispatchEvent`
   */
  emit(eventName: string): void;
}

declare namespace Sound {
  interface Any extends AnySound {}
  interface AnyConstructor extends Identity<typeof AnySound> {}

  /** @internal */
  type _ConstructorOptions = NullishProps<{
    /**
     * Force use of an AudioBufferSourceNode even if the audio duration is long
     * @defaultValue `false`
     */
    forceBuffer: boolean;

    /**
     * A non-default audio context within which the sound should play
     * @defaultValue `game.audio.music`
     */
    context: AudioContext;
  }>;

  interface ConstructorOptions extends _ConstructorOptions {}

  type STATES = Brand<number, "Sound.STATES">;

  interface States {
    readonly FAILED: -1 & STATES;
    readonly NONE: 0 & STATES;
    readonly LOADING: 1 & STATES;
    readonly LOADED: 2 & STATES;
    readonly STARTING: 3 & STATES;
    readonly PLAYING: 4 & STATES;
    readonly PAUSED: 5 & STATES;
    readonly STOPPING: 6 & STATES;
    readonly STOPPED: 7 & STATES;
  }

  /** @internal */
  type _LoadOptions = NullishProps<{
    /**
     * Automatically begin playback of the sound once loaded
     * @defaultValue `false`
     */
    autoplay: boolean;
  }> &
    InexactPartial<{
      /**
       * Playback options passed to Sound#play, if autoplay
       * @defaultValue `{}`
       * @remarks Can't be `null` as it only has a parameter default
       */
      autoplayOptions: Sound.PlaybackOptions;
    }>;

  interface LoadOptions extends _LoadOptions {}

  /**
   * @internal
   * Since `Sound##playback` isn't exposed, this interface can *just* be accurate to what's allowable to pass
   * to {@link Sound.play | `Sound#play`} or {@link Sound.stop | `#stop`}, which in reality is what's allowed
   * by `Sound##configurePlayback`
   */
  type _PlaybackOptions = NullishProps<{
    /**
     * A delay in seconds by which to delay playback
     * @defaultValue `0`
     * @remarks Unlike other properties of this interface, the above default is static.
     */
    delay: number;

    /**
     * A limited duration in seconds for which to play
     * @defaultValue `undefined`
     */
    duration: number;

    /**
     * A duration in milliseconds over which to fade in playback
     * @defaultValue `0`
     * @remarks Unlike other properties of this interface, the above default is static.
     */
    fade: number;

    /**
     * Should sound playback loop?
     * @defaultValue `false`
     * @remarks The above default is true for initial calls, but the actual default
     * value, if this is passed nullish or omitted, is whatever the current value is
     */
    loop: boolean;

    /**
     * Seconds of the AudioBuffer when looped playback should start. Only works for AudioBufferSourceNode.
     * @defaultValue `0`
     * @remarks The above default is true for initial calls, but the actual default
     * value, if this is passed nullish or omitted, is whatever the current value is
     */
    loopStart: number;

    /**
     * Seconds of the Audio buffer when looped playback should restart. Only works for AudioBufferSourceNode.
     * @defaultValue `undefined`
     * @remarks The above default is true for initial calls, but the actual default
     * value, if this is passed nullish or omitted, is whatever the current value is
     */
    loopEnd: number;

    /**
     * An offset in seconds at which to start playback
     * @defaultValue `0`
     * @remarks The above default is true for initial calls, but the actual default
     * value, if this is passed nullish or omitted, is whatever the current value of
     * `loopStart` is
     */
    offset: number;

    /**
     * A callback function attached to the source node
     * @defaultValue `null`
     * @remarks The above default is true for initial calls, but the actual default
     * value, if this is passed nullish or omitted, is whatever the current value is
     */
    onended: ScheduleCallback | null;

    /**
     * The volume at which to play the sound
     * @defaultValue `1.0`
     * @remarks The above default is true for initial calls, but the actual default
     * value, if this is passed nullish or omitted, is whatever the current value is
     */
    volume: number;
  }>;

  /** @remarks Default values here are what `Sound##configurePlayback` would use if passed an empty object with no prior calls */
  interface PlaybackOptions extends _PlaybackOptions {}

  /** @internal */
  type _FadeOptions = InexactPartial<{
    /**
     * The duration of the fade effect in milliseconds
     * @defaultValue `1000`
     * @remarks Can't be `null` as it only has a parameter default
     */
    duration: number;

    /**
     * The type of fade easing, "linear" or "exponential"
     * @defaultValue `"linear"`
     * @remarks Can't be `null` as it only has a parameter default
     */
    type: "linear" | "exponential";
  }> &
    NullishProps<{
      /**
       * A volume level to start from, the current volume by default
       * @defaultValue `this.gain.value`
       */
      from: number;
    }>;

  interface FadeOptions extends _FadeOptions {}

  type ScheduleCallback = (sound: Sound) => MaybePromise<unknown>;
}
export default Sound;

declare abstract class AnySound extends Sound {
  constructor(...args: never);
}
