import type { InexactPartial, Identity, FixedInstanceType, HandleEmptyObject } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type { AmbientSound } from "#client/canvas/placeables/_module.d.mts";
import type { SceneControls } from "#client/applications/ui/_module.d.mts";
import type { Sound } from "#client/audio/_module.mjs";
import type { PointSoundSource } from "#client/canvas/sources/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      SoundsLayer: SoundsLayer.Implementation;
    }
  }
}

/**
 * This Canvas Layer provides a container for AmbientSound objects.
 */
declare class SoundsLayer extends PlaceablesLayer<"AmbientSound"> {
  /** @remarks There are no args to pass along, but Foundry does just in case. Only exists to register a mousemove handler  */
  constructor(...args: ConstructorParameters<typeof PlaceablesLayer<"AmbientSound">>);

  // Fake type override
  static get instance(): Canvas["sounds"];

  /**
   * Track whether to actively preview ambient sounds with mouse cursor movements
   * @defaultValue `false`
   */
  livePreview: boolean;

  /**
   * A mapping of ambient audio sources which are active within the rendered Scene
   * @defaultValue `new foundry.utils.Collection()`
   */
  // TODO: Make `.InitializedImplementation` once that type exists, or at least `.Implementation` once https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/3455 is solved
  sources: Collection<foundry.canvas.sources.PointSoundSource.Internal.Any>;

  // Fake type override
  override options: SoundsLayer.LayerOptions;

  /**
   * @defaultValue
   * ```js
   * foundry.utils.mergeObject(super.layerOptions, {
   *  name: "sounds",
   *  zIndex: 900
   * })
   * ```
   */

  static override get layerOptions(): SoundsLayer.LayerOptions;

  static override documentName: "AmbientSound";

  override get hookName(): "SoundsLayer";

  // fake type override
  override draw(options?: HandleEmptyObject<SoundsLayer.DrawOptions>): Promise<this>;

  protected override _draw(options: HandleEmptyObject<SoundsLayer.DrawOptions>): Promise<void>;

  // fake type override
  override tearDown(options?: HandleEmptyObject<SoundsLayer.TearDownOptions>): Promise<this>;

  protected override _tearDown(options: HandleEmptyObject<SoundsLayer.TearDownOptions>): Promise<void>;

  protected override _activate(): void;

  /**
   * Initialize all AmbientSound sources which are present on this layer
   */
  initializeSources(): void;

  /**
   * Update all AmbientSound effects in the layer by toggling their playback status.
   * Sync audio for the positions of tokens which are capable of hearing.
   * @param options - Additional options forwarded to AmbientSound synchronization (defaultValue: `{}`)
   * @remarks Probably meant to be treated as always `void`; the `number` return is from an `Array#push` call, not anything meaningful
   */
  refresh(options?: SoundsLayer.RefreshOptions): number | void;

  /**
   * Preview ambient audio for a given position
   * @param position - The position to preview
   */
  previewSound(position: Canvas.PossiblyElevatedPoint): void;

  /**
   * Terminate playback of all ambient audio sources
   */
  stopAll(): void;

  /**
   * Get an array of listener positions for Tokens which are able to hear environmental sound.
   */
  getListenerPositions(): Canvas.ElevatedPoint[];

  /**
   * Sync the playing state and volume of all AmbientSound objects based on the position of listener points
   * @param listeners - Locations of listeners which have the capability to hear
   * @param options   - Additional options forwarded to AmbientSound synchronization (defaultValue: `{}`)
   */
  protected _syncPositions(listeners: Canvas.ElevatedPoint[], options?: SoundsLayer.SyncPositionsOptions): void;

  /**
   * @deprecated "`SoundsLayer#_syncPositions(listener: Point[], options: object)` has been deprecated in favor of
   * `SoundsLayer#_syncPositions(listener: ElevatedPoint[], options: object)`." (since v13, until v15)
   */
  protected _syncPositions(listeners: Canvas.Point[], options?: SoundsLayer.SyncPositionsOptions): void;

  /**
   * Configure playback by assigning the muffled state and final playback volume for the sound.
   * This method should mutate the config object by assigning the volume and muffled properties.
   * @param config - A playback configuration object
   * @internal
   */
  _configurePlayback(config: SoundsLayer.PlaybackConfig): void;

  /**
   * Actions to take when the darkness level of the Scene is changed
   * @param  event - The darkness-changing event
   * @internal
   */
  _onDarknessChange(event: Canvas.Event.DarknessChange): void;

  /**
   * Play a one-shot Sound originating from a predefined point on the canvas.
   * The sound plays locally for the current client only.
   * To play a sound for all connected clients use {@linkcode SoundsLayer.emitAtPosition | SoundsLayer#emitAtPosition}.
   * @param src     - The sound source path to play
   * @param origin  - The canvas coordinates from which the sound originates
   * @param radius  - The radius of effect in distance units
   * @param options - Additional options which configure playback
   * @returns  A Promise which resolves to the played Sound, or null
   *
   * @example
   * Play the sound of a trap springing
   * ```js
   * const src = "modules/my-module/sounds/spring-trap.ogg";
   * const origin = {x: 5200, y: 3700};  // The origin point for the sound
   * const radius = 30;                  // Audible in a 30-foot radius
   * await canvas.sounds.playAtPosition(src, origin, radius);
   * ```
   *
   * @example
   * A Token casts a spell
   * ```js
   * const src = "modules/my-module/sounds/spells-sprite.ogg";
   * const origin = token.center; // The origin point for the sound
   * const radius = 60;           // Audible in a 60-foot radius
   * await canvas.sounds.playAtPosition(src, origin, radius, {
   *   walls: false,              // Not constrained by walls with a lowpass muffled effect
   *   muffledEffect: {type: "lowpass", intensity: 6},
   *   sourceData: {
   *     angle: 120,              // Sound emitted at a limited angle
   *     rotation: 270            // Configure the direction of sound emission
   *   }
   *   playbackOptions: {
   *     loopStart: 12,           // Audio sprite timing
   *     loopEnd: 16,
   *     fade: 300,               // Fade-in 300ms
   *     onended: () => console.log("Do something after the spell sound has played")
   *   }
   * });
   * ```
   * @remarks Creates a new sound in the `environment` context, loads it, then forwards non-`src` args to {@linkcode Sound.playAtPosition | Sound#playAtPosition}
   */
  playAtPosition(
    src: string,
    origin: Canvas.PossiblyElevatedPoint,
    radius: number,
    options?: Sound.PlayAtPositionOptions,
  ): Promise<Sound | null>;

  /**
   * Emit playback to other connected clients to occur at a specified position.
   * @param args - Arguments passed to SoundsLayer#playAtPosition
   * @returns  A Promise which resolves once playback for the initiating client has completed
   */
  emitAtPosition(...args: Parameters<this["playAtPosition"]>): ReturnType<this["playAtPosition"]>;

  static override prepareSceneControls(): SceneControls.Control;

  /**
   * Handle mouse cursor movements which may cause ambient audio previews to occur
   * @internal
   */
  protected _onMouseMove(currentPos: PIXI.Point): void;

  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  /**
   * Handle PlaylistSound document drop data.
   * @param event - The drag drop event
   * @param data  - The dropped transfer data.
   */
  protected _onDropData(event: DragEvent, data: SoundsLayer.DropData): Promise<AmbientSound.Implementation | false>;

  #SoundsLayer: true;
}

declare namespace SoundsLayer {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Implementation} instead. This type will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode ImplementationClass} instead. This type will be removed in v15.
   */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnySoundsLayer {}
    interface AnyConstructor extends Identity<typeof AnySoundsLayer> {}
  }

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["layers"]["sounds"]["layerClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface LayerOptions extends PlaceablesLayer.LayerOptions<AmbientSound.ImplementationClass> {
    name: "sounds";

    /** @defaultValue `900` */
    zIndex: number;
  }

  interface DrawOptions extends PlaceablesLayer.DrawOptions {}

  interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}

  interface DropData extends Canvas.DropPosition {
    type: "PlaylistSound";
    uuid: string;
  }

  /** @internal */
  interface _Fade {
    /**
     * A duration in milliseconds to fade volume transition
     * @defaultValue `250`
     */
    fade: number;
  }

  interface RefreshOptions extends InexactPartial<_Fade> {}

  interface SyncPositionsOptions extends InexactPartial<_Fade> {}

  /** @deprecated This interface is redundant. Use {@linkcode Sound.PlayAtPositionOptions} instead. This type will be removed in v14. */
  type PlayAtPositionOptions = Sound.PlayAtPositionOptions;

  /** @deprecated Use {@linkcode SoundsLayer.PlaybackConfig} instead. This type will be removed in v14. */
  type AmbientSoundPlaybackConfig = PlaybackConfig;

  /**
   * @remarks The only use of this interface in core is {@linkcode SoundsLayer._syncPositions | SoundsLayer#_syncPositions}
   * generating them and passing them to {@linkcode SoundsLayer._configurePlayback | SoundsLayer#_configurePlayback}
   */
  interface PlaybackConfig {
    /**
     * The Sound node which should be controlled for playback
     * @remarks the {@linkcode AmbientSound.sound | #sound} of this config's `object`
     */
    sound: Sound;

    /**
     * The SoundSource which defines the area of effect for the sound
     * @remarks the {@linkcode AmbientSound.source | #source} of this config's `object`
     */
    // TODO: InitializedImplementation
    source: PointSoundSource.Implementation;

    /**
     * An AmbientSound object responsible for the sound, or undefined
     */
    object: AmbientSound.Implementation;

    // Foundry describes a `distance: number` property here in their typedef, but it is neither set not read anywhere as of 13.347

    /**
     * The coordinates of the closest listener or undefined if there is none
     * @remarks Only `undefined` if there are no valid listeners in range of the sound
     *
     * If falsey when passed to {@linkcode SoundsLayer._configurePlayback | SoundsLayer#_configurePlayback}, this config's
     * {@linkcode PlaybackConfig.volume | volume} is set to `0`, and its {@linkcode PlaybackConfig.muffled muffled}
     * to false.
     */
    listener?: Canvas.ElevatedPoint | undefined;

    /**
     * Is the closest listener muffled
     * @remarks Configs passed to {@linkcode SoundsLayer._configurePlayback | SoundsLayer#_configurePlayback} never have this set, it is that
     * method's job to set it.
     *
     * Only set true if:
     * - There is a valid listener and
     * - That listener does not share coordinates with the sound and
     * - The sound is not explicitly constrained by walls and
     * - There is a wall between the listener and the sound     *
     */
    muffled?: boolean | undefined;

    /**
     * Is playback constrained or muffled by walls?
     * @remarks The {@linkcode AmbientSoundDocument.walls | #walls} of this config's `object.document`
     *
     * Only `undefined` if there are no listeners in range of the sound
     */
    walls?: boolean;

    /**
     * The final volume at which the Sound should be played
     */
    volume: number;
  }
}

export default SoundsLayer;

declare abstract class AnySoundsLayer extends SoundsLayer {
  constructor(...args: never);
}
