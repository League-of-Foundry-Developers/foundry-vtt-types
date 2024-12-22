import type { IntentionalPartial, InexactPartial, NullishProps } from "../../../../../utils/index.d.mts";
import type { AmbientSoundEffect } from "../../../../common/documents/_types.d.mts";

declare global {
  /**
   * This Canvas Layer provides a container for AmbientSound objects.
   */
  class SoundsLayer<
    DrawOptions extends SoundsLayer.DrawOptions = SoundsLayer.DrawOptions,
    TearDownOptions extends SoundsLayer.TearDownOptions = SoundsLayer.TearDownOptions,
  > extends PlaceablesLayer<"AmbientSound", DrawOptions, TearDownOptions> {
    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
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
    sources: foundry.utils.Collection<foundry.canvas.sources.PointSoundSource>;

    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    override options: SoundsLayer.LayerOptions;

    /**
     * @defaultValue
     * ```
     * foundry.utils.mergeObject(super.layerOptions, {
     *  name: "sounds",
     *  zIndex: 900
     * })
     * ```
     * */

    static override get layerOptions(): SoundsLayer.LayerOptions;

    static override documentName: "AmbientSound";

    override get hookName(): string;

    override _draw(options?: DrawOptions): Promise<void>;

    override _tearDown(options?: TearDownOptions): Promise<void>;

    override _activate(): void;

    /**
     * Initialize all AmbientSound sources which are present on this layer
     */
    initializeSources(): void;

    /**
     * Update all AmbientSound effects in the layer by toggling their playback status.
     * Sync audio for the positions of tokens which are capable of hearing.
     * @param options - Additional options forwarded to AmbientSound synchronization
     *                  (defaultValue: `{}`)
     */
    refresh(
      options?: NullishProps<{
        /**
         * A duration in milliseconds to fade volume transition
         */
        fade: number;
      }>,
    ): number | void;

    /**
     * Preview ambient audio for a given mouse cursor position
     * @param position - The cursor position to preview
     */
    previewSound(position: Canvas.Point): void;

    /**
     * Terminate playback of all ambient audio sources
     */
    stopAll(): void;

    /**
     * Get an array of listener positions for Tokens which are able to hear environmental sound.
     */
    getListenerPositions(): Canvas.Point[];

    /**
     * Sync the playing state and volume of all AmbientSound objects based on the position of listener points
     * @param listeners - Locations of listeners which have the capability to hear
     * @param options   - Additional options forwarded to AmbientSound synchronization
     *                    (defaultValue: `{}`)
     */
    protected _syncPositions(
      listeners: Canvas.Point[],
      options?: NullishProps<{
        /**
         * A duration in milliseconds to fade volume transition
         */
        fade: number;
      }>,
    ): void;

    /**
     * Configure playback by assigning the muffled state and final playback volume for the sound.
     * This method should mutate the config object by assigning the volume and muffled properties.
     * @param config - A playback configuration object
     */
    protected _configurePlayback(config: SoundsLayer.AmbientSoundPlaybackConfig): void;

    /**
     * Actions to take when the darkness level of the Scene is changed
     * @param  event - The darkness-changing event
     */
    protected _onDarknessChange(event: PIXI.FederatedEvent): void;

    /**
     * Play a one-shot Sound originating from a predefined point on the canvas.
     * The sound plays locally for the current client only.
     * To play a sound for all connected clients use SoundsLayer#emitAtPosition.
     * @param src     - The sound source path to play
     * @param origin  - The canvas coordinates from which the sound originates
     * @param radius  - The radius of effect in distance units
     * @param options - Additional options which configure playback
     * @returns  A Promise which resolves to the played Sound, or null
     *
     * @example Play the sound of a trap springing
     * ```js
     * const src = "modules/my-module/sounds/spring-trap.ogg";
     * const origin = {x: 5200, y: 3700};  // The origin point for the sound
     * const radius = 30;                  // Audible in a 30-foot radius
     * await canvas.sounds.playAtPosition(src, origin, radius);
     * ```
     *
     * @example A Token casts a spell
     * ```js
     * const src = "modules/my-module/sounds/spells-sprite.ogg";
     * const origin = token.center;         // The origin point for the sound
     * const radius = 60;                   // Audible in a 60-foot radius
     * await canvas.sounds.playAtPosition(src, origin, radius, {
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
      src: string,
      origin: Canvas.Point,
      radius: number,
      /** @remarks Can't be NullishProps because a default for `volume` is provided only for `undefined` with `{ volume=1 }`, which must be numeric */
      options?: InexactPartial<SoundsLayer.PlayAtPositionOptions>,
    ): Promise<foundry.audio.Sound | null>;

    /**
     * Emit playback to other connected clients to occur at a specified position.
     * @param args - Arguments passed to SoundsLayer#playAtPosition
     * @returns  A Promise which resolves once playback for the initiating client has completed
     */
    emitAtPosition(...args: Parameters<this["playAtPosition"]>): ReturnType<this["playAtPosition"]>;

    /**
     * Handle mouse cursor movements which may cause ambient audio previews to occur
     */
    protected _onMouseMove(): void;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftDrop(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftCancel(event: PointerEvent): void;

    /**
     * Handle PlaylistSound document drop data.
     * @param event - The drag drop event
     * @param data  - The dropped transfer data.
     */
    protected _onDropData(
      event: DragEvent,
      data: SoundsLayer.DropData,
    ): Promise<ReturnType<PlaceablesLayer<"AmbientSound">["_createPreview"]> | false>;
  }

  namespace SoundsLayer {
    type AnyConstructor = typeof AnySoundsLayer;

    interface DrawOptions extends PlaceablesLayer.DrawOptions {}

    interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}

    interface LayerOptions extends PlaceablesLayer.LayerOptions<"AmbientSound"> {
      name: "sounds";
      zIndex: 900;
    }

    interface DropData extends Canvas.DropPosition {
      type: "PlaylistSound";
      uuid: string;
    }

    interface PlayAtPositionOptions {
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
      baseEffect: AmbientSoundEffect;

      /** A muffled sound effect to apply to playback, a sound may only be muffled if it is not constrained by walls */
      muffledEffect: AmbientSoundEffect;

      /**
       * Additional data passed to the SoundSource constructor
       * @remarks IntentionalPartial because this is spread into an object with existing keys
       */
      sourceData: IntentionalPartial<PointSourceData>;

      /** Additional options passed to Sound#play */
      playbackOptions: foundry.audio.Sound.PlaybackOptions;
    }

    interface AmbientSoundPlaybackConfig {
      /**
       * The Sound node which should be controlled for playback
       */
      sound: foundry.audio.Sound;

      /**
       * The SoundSource which defines the area of effect for the sound
       */
      source: foundry.canvas.sources.PointSoundSource;

      /**
       * An AmbientSound object responsible for the sound, or undefined
       */
      object: AmbientSound | undefined;

      /**
       * The coordinates of the closest listener or undefined if there is none
       */
      listener: Canvas.Point | undefined;

      /**
       * The minimum distance between a listener and the AmbientSound origin
       */
      distance: number;

      /**
       * Is the closest listener muffled
       */
      muffled: boolean;

      /**
       * Is playback constrained or muffled by walls?
       */
      walls: boolean;

      /**
       * The final volume at which the Sound should be played
       */
      volume: number;
    }
  }
}

/**
 * @privateRemarks This is the only place in v12 (and v13 as of 332) where this v11 type is still used
 */
interface PointSourceData {
  x: number;
  y: number;
  elevation: number;
  z: number | null;
  radius: number;
  externalRadius: number;
  rotation: number;
  angle: number;
  walls: boolean;
  disabled: boolean;
}

declare abstract class AnySoundsLayer extends SoundsLayer {
  constructor(arg0: never, ...args: never[]);
}
