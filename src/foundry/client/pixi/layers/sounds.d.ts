/**
 * This Canvas Layer provides a container for AmbientSound objects.
 * @see {@link AmbientSound}
 */
declare class SoundsLayer extends PlaceablesLayer<"AmbientSound", SoundsLayer.LayerOptions> {
  /**
   * Track whether to actively preview ambient sounds with mouse cursor movements
   * @defaultValue `false`
   */
  livePreview: boolean;

  /**
   * A mapping of ambient audio sources which are active within the rendered Scene
   * @defaultValue `new foundry.utils.Collection()`
   */
  sources: foundry.utils.Collection<SoundSource>;

  /**
   * @remarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["sounds"];

  /**
   * @defaultValue
   * ```
   * foundry.utils.mergeObject(super.layerOptions, {
   *  name: "sounds",
   *  zIndex: 300
   * })
   * ```
   * */

  static override get layerOptions(): SoundsLayer.LayerOptions;

  static override documentName: "AmbientSound";

  override tearDown(): Promise<this>;

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
  refresh(options?: { fade?: number }): number | void;

  /**
   * Preview ambient audio for a given mouse cursor position
   * @param position - The cursor position to preview
   */
  previewSound(position: Point): void;

  /**
   * Terminate playback of all ambient audio sources
   */
  stopAll(): void;

  /**
   * Sync the playing state and volume of all AmbientSound objects based on the position of listener points
   * @param listeners - Locations of listeners which have the capability to hear
   * @param options   - Additional options forwarded to AmbientSound synchronization
   *                    (defaultValue: `{}`)
   */
  protected _syncPositions(listeners: Point[], options?: { fade?: number }): void;

  /**
   * Define the easing function used to map radial distance to volume.
   * Uses cosine easing which graduates from volume 1 at distance 0 to volume 0 at distance 1
   * @returns The target volume level
   */
  protected _getEasingVolume(distance: number, radius: number): number;

  /**
   * Actions to take when the darkness level of the Scene is changed
   * @param darkness - The new darkness level
   * @param prior    - The prior darkness level
   */
  protected _onDarknessChange(darkness: number, prior: number): void;

  /**
   * Handle mouse cursor movements which may cause ambient audio previews to occur
   * @param event - The initiating mouse move interaction event
   */
  protected _onMouseMove(event: PIXI.InteractionEvent): void;

  protected override _onDragLeftStart(event: PIXI.InteractionEvent): ReturnType<AmbientSound["draw"]>;

  protected override _onDragLeftMove(event: PIXI.InteractionEvent): void;

  protected override _onDragLeftDrop(event: PIXI.InteractionEvent): void;

  protected override _onDragLeftCancel(event: PointerEvent): void;

  /**
   * Handle PlaylistSound document drop data.
   * @param event - The drag drop event
   * @param data  - The dropped transfer data.
   */
  protected _onDropData(event: DragEvent, data: unknown): Promise<void>;
}

declare namespace SoundsLayer {
  interface LayerOptions extends PlaceablesLayer.LayerOptions<"AmbientSound"> {
    name: "sounds";
    zIndex: 300;
  }
}
