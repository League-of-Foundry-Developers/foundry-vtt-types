import type { Brand, InexactPartial, MaybePromise, Identity, IntentionalPartial } from "#utils";
import type EventEmitterMixin from "#common/utils/event-emitter.d.mts";
import type { AmbientSound } from "#client/canvas/placeables/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PointSoundSource } from "#client/canvas/sources/_module.d.mts";
import type { AudioTimeout } from "./_module.d.mts";

declare namespace Sound {
  interface Any extends AnySound {}
  interface AnyConstructor extends Identity<typeof AnySound> {}

  /** @internal */
  type _ConstructorOptions = InexactPartial<{
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
  type _LoadOptions = InexactPartial<{
    /**
     * Automatically begin playback of the sound once loaded
     * @defaultValue `false`
     */
    autoplay: boolean;

    /**
     * Playback options passed to Sound#play, if autoplay
     * @defaultValue `{}`
     */
    autoplayOptions: Sound.PlaybackOptions;
  }>;

  interface LoadOptions extends _LoadOptions {}

  /**
   * Since `Sound##playback` isn't exposed, this interface can *just* be accurate to what's allowable to pass
   * to {@link Sound.play | `Sound#play`} or {@link Sound.stop | `#stop`}, which in reality is what's allowed
   * by `Sound##configurePlayback`
   * @internal
   */
  type _PlaybackOptions = InexactPartial<{
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
     * @remarks The above default is true for initial calls, but the actual default value, if this is passed nullish or omitted, is whatever the current value in `this##playback`
     * is, unless this is part of a {@linkcode foundry.canvas.layers.SoundsLayer.playAtPosition | SoundsLayer#playAtPosition} call, as that method always creates a new sound with
     * no playback history
     */
    loop: boolean;

    /**
     * Seconds of the AudioBuffer when looped playback should start. Only works for AudioBufferSourceNode.
     * @defaultValue `0`
     * @remarks The above default is true for initial calls, but the actual default value, if this is passed nullish or omitted, is whatever the current value in `this##playback`
     * is, unless this is part of a {@linkcode foundry.canvas.layers.SoundsLayer.playAtPosition | SoundsLayer#playAtPosition} call, as that method always creates a new sound with
     * no playback history
     */
    loopStart: number;

    /**
     * Seconds of the Audio buffer when looped playback should restart. Only works for AudioBufferSourceNode.
     * @defaultValue `undefined`
     * @remarks The above default is true for initial calls, but the actual default value, if this is passed nullish or omitted, is whatever the current value in `this##playback`
     * is, unless this is part of a {@linkcode foundry.canvas.layers.SoundsLayer.playAtPosition | SoundsLayer#playAtPosition} call, as that method always creates a new sound with
     * no playback history
     */
    loopEnd: number;

    /**
     * An offset in seconds at which to start playback
     * @defaultValue `0`
     * @remarks The above default is true for initial calls, but the actual default value, if this is passed nullish or omitted, is whatever the current value of `loopStart` in
     * `this##playback` is, unless this is part of a {@linkcode foundry.canvas.layers.SoundsLayer.playAtPosition | SoundsLayer#playAtPosition} call, as that method always creates
     * a new sound with no playback history
     */
    offset: number;

    /**
     * A callback function attached to the source node
     * @defaultValue `null`
     * @remarks The above default is true for initial calls, but the actual default value, if this is passed nullish or omitted, is whatever the current value in `this##playback`
     * is, unless this is part of a {@linkcode foundry.canvas.layers.SoundsLayer.playAtPosition | SoundsLayer#playAtPosition} call, as that method always creates a new sound with
     * no playback history
     */
    onended: ScheduleCallback | null;

    /**
     * The volume at which to play the sound
     * @defaultValue `1.0`
     * @remarks The above default is true for initial calls, but the actual default value, if this is passed nullish or omitted, is whatever the current value in `this##playback`
     * is, unless this is part of a {@linkcode foundry.canvas.layers.SoundsLayer.playAtPosition | SoundsLayer#playAtPosition} call, as that method always creates a new sound with
     * no playback history
     */
    volume: number;
  }>;

  /** @remarks Default values here are what `Sound##configurePlayback` would use if passed an empty object with no prior calls */
  interface PlaybackOptions extends _PlaybackOptions {}

  /** @remarks `volume` is always overwritten in {@linkcode Sound.playAtPosition | Sound#playAtPosition}  */
  interface PlaybackOptionsPositional extends Omit<PlaybackOptions, "volume"> {}

  /** @remarks The keys omitted are generated from other data passed to {@linkcode Sound.playAtPosition | Sound#playAtPosition} */
  interface PartialSourceData
    extends IntentionalPartial<Omit<PointSoundSource.SourceData, "x" | "y" | "elevation" | "radius" | "walls">> {}

  /** @internal */
  type _PlayAtPositionOptions = InexactPartial<{
    /**
     * The maximum volume at which the effect should be played
     * @defaultValue `1.0`
     */
    volume: number;

    /**
     * Should volume be attenuated by distance?
     * @defaultValue `true`
     */
    easing: boolean;

    /**
     * Should the sound be constrained by walls?
     * @defaultValue `true`
     */
    walls: boolean;

    /**
     * Should the sound always be played for GM users regardless of actively controlled tokens?
     * @defaultValue `true`
     */
    gmAlways: boolean;

    /** A base sound effect to apply to playback */
    baseEffect: AmbientSoundDocument.Effect;

    /** A muffled sound effect to apply to playback, a sound may only be muffled if it is not constrained by walls */
    muffledEffect: AmbientSoundDocument.Effect;

    /**
     * Additional data passed to the SoundSource constructor
     */
    sourceData: Sound.PartialSourceData;

    /**
     * Additional options passed to {@linkcode Sound.play | Sound#play}
     */
    playbackOptions: Sound.PlaybackOptionsPositional;
  }>;

  interface PlayAtPositionOptions extends _PlayAtPositionOptions {}

  /** @internal */
  type _FadeOptions = InexactPartial<{
    /**
     * The duration of the fade effect in milliseconds
     * @defaultValue `1000`
     */
    duration: number;

    /**
     * The type of fade easing, "linear" or "exponential"
     * @defaultValue `"linear"`
     */
    type: "linear" | "exponential";

    /**
     * A volume level to start from, the current volume by default
     * @defaultValue `this.gain.value`
     */
    from: number;
  }>;

  interface FadeOptions extends _FadeOptions {}

  type ScheduleCallback = (sound: Sound) => MaybePromise<unknown>;
}

/**
 * A container around an AudioNode which manages sound playback in Foundry Virtual Tabletop.
 * Each Sound is either an AudioBufferSourceNode (for short sources) or a MediaElementAudioSourceNode (for long ones).
 * This class provides an interface around both types which allows standardized control over playback.
 */
declare class Sound extends EventEmitterMixin() {
  /**
   * Construct a Sound by providing the source URL and other options.
   * @param src     - The audio source path, either a relative path or a remote URL
   * @param options - Additional options which configure the Sound
   */
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
   * @defaultValue {@linkcode Sound.STATES.NONE}
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
   * @remarks `undefined` if {@linkcode Sound.gainNode | Sound#gainNode} is.
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
   * @internal
   * @remarks Only ever set *or* read externally by core, so not protected
   */
  _manager: AmbientSound.Implementation | null;

  /**
   * Load the audio source and prepare it for playback, either using an AudioBuffer or a streamed HTMLAudioElement.
   * @param options - Additional options which affect resource loading
   * @returns A Promise which resolves to the Sound once it is loaded
   */
  load(options?: Sound.LoadOptions): Promise<this>;

  /**
   * An inner method which handles loading so that it can be de-duplicated under a single shared Promise resolution.
   * This method is factored out to allow for subclasses to override loading behavior.
   * @returns A Promise which resolves once the sound is loaded
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
   * @deprecated "`Sound#play` now takes an object of playback options instead of positional arguments." (since v12, until v14)
   */
  play(offset: number, onended?: Sound.ScheduleCallback | null): Promise<this>;

  /**
   * Play a one-shot Sound originating from a predefined point on the canvas.
   * The sound plays locally for the current client only.
   * To play a sound for all connected clients use {@linkcode foundry.canvas.layers.SoundsLayer.emitAtPosition | SoundsLayer#emitAtPosition}.
   * A helper which does not depend on a pre-existing Sound instance is available at
   * {@linkcode foundry.canvas.layers.SoundsLayer.playAtPosition | SoundsLayer#playAtPosition}.
   *
   * @param origin  - The canvas coordinates from which the sound originates
   * @param radius  - The radius of effect in distance units
   * @param options - Additional options which configure playback
   * @returns A Promise which resolves to the played Sound, or null
   *
   * Play the sound of a trap springing
   * @example
   * ```js
   * const sound = new Sound("modules/my-module/sounds/spring-trap.ogg", {context: game.audio.environment});
   * await sound.load();
   * const origin = {x: 5200, y: 3700};  // The origin point for the sound
   * const radius = 30;                  // Audible in a 30-foot radius
   * await sound.playAtPosition(origin, radius);
   * ```
   *
   * A Token casts a spell
   * @example
   * ```js
   * const sound = new Sound("modules/my-module/sounds/spells-sprite.ogg", {context: game.audio.environment});
   * const origin = token.center;         // The origin point for the sound
   * const radius = 60;                   // Audible in a 60-foot radius
   * await sound.playAtPosition(origin, radius, {
   *   walls: false,                      // Not constrained by walls with a lowpass muffled effect
   *   muffledEffect: {type: "lowpass", intensity: 6},
   *   sourceData: {
   *     angle: 120,                      // Sound emitted at a limited angle
   *     rotation: 270                    // Configure the direction of sound emission
   *   }
   *   playbackOptions: {
   *     loopStart: 12,                   // Audio sprite timing
   *     loopEnd: 16,
   *     fade: 300,                      // Fade-in 300ms
   *     onended: () => console.log("Do something after the spell sound has played")
   *   }
   * });
   * ```
   */
  playAtPosition(
    origin: Canvas.PossiblyElevatedPoint,
    radius: number,
    options?: Sound.PlayAtPositionOptions,
  ): Promise<this | null>;

  /**
   * Begin playback for the configured pipeline and playback options.
   * This method is factored out so that subclass implementations of Sound can implement alternative behavior.
   */
  protected _play(): void;

  /**
   * Pause playback of the Sound.
   * For {@linkcode AudioBufferSourceNode} this stops playback after recording the current time.
   * Calling {@linkcode Sound.play | Sound#play} will resume playback from the {@linkcode Sound.pauseTime | #pausedTime} unless some other offset is passed.
   * For a {@linkcode MediaElementAudioSourceNode} this simply calls the {@linkcode HTMLAudioElement.pause | HTMLAudioElement#pause} method directly.
   * @remarks
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
   * Cancel one scheduled event created with {@linkcode Sound.schedule | Sound#schedule}.
   * You may pass either the {@linkcode AudioTimeout} returned internally or the Promise returned by `Sound#schedule`.
   * @param handle - The handle to cancel.
   */
  unschedule(handle: AudioTimeout | { timeout: AudioTimeout }): void;

  /**
   * Cancel all events that are still scheduled for this sound.
   */
  unscheduleAll(): void;

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
   * @deprecated "`AudioContainer.LOAD_STATES` is deprecated in favor of {@linkcode Sound.STATES}" (since v12, until v14)
   */
  static get LOAD_STATES(): Sound.States;

  /**
   * @deprecated "`AudioContainer#loadState` is deprecated in favor of {@linkcode Sound._state | Sound#_state}" (since v12, until v14)
   */
  get loadState(): Sound.STATES;

  /**
   * @deprecated "`Sound#container` is deprecated without replacement because the `Sound` and `AudioContainer` classes are now merged" (since v12, until v14)
   */
  get container(): this;

  /**
   * @deprecated "`Sound#node` is renamed {@linkcode Sound.sourceNode | Sound#sourceNode}" (since v12, until v14)
   */
  get node(): this["sourceNode"];

  /**
   * @deprecated "`Sound#on` is deprecated in favor of {@linkcode Sound.addEventListener | Sound#addEventListener}" (since v12, until v14)
   */
  on(eventName: string, fn: EventEmitterMixin.EventListener, options?: EventEmitterMixin.AddListenerOptions): void;

  /**
   * @deprecated "`Sound#off` is deprecated in favor of {@linkcode Sound.removeEventListener | Sound#removeEventListener}" (since v12, until v14)
   */
  off(eventName: string, fn: EventEmitterMixin.EventListener): void;

  /**
   * @deprecated "`Sound#emit` is deprecated in favor of {@linkcode Sound.dispatchEvent | Sound#dispatchEvent}" (since v12, until v14)
   * @remarks This method still takes a string, then creates an `Event` with it and passes that along to `dispatchEvent`
   */
  emit(eventName: string): void;

  #Sound: true;
}

export default Sound;

declare abstract class AnySound extends Sound {
  constructor(...args: never);
}
