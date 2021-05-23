/**
 * This Canvas Layer provides a container for AmbientSound objects.
 * @see {@link AmbientSound}
 */
declare class SoundsLayer extends PlaceablesLayer<AmbientSound> {
  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.layerOptions, {
   *   objectClass: AmbientSound,
   *   sheetClass: AmbientSoundConfig,
   *   zIndex: 200
   * })
   * ```
   * */
  static get layerOptions(): PlaceablesLayer.LayerOptions;

  constructor();

  /**
   * A debounced refresh function for the sounds layer
   */
  refresh: (...args: Parameters<this['update']>) => void;

  /**
   * A status flag for whether the layer initialization workflow has succeeded
   * @defaultValue `false`
   */
  protected _initialized: boolean;

  /**
   * Initialize the field of "view" for all AmbientSound effects in the layer
   */
  initialize(): void;

  /**
   * Terminate playback of all ambient audio sources
   */
  stopAll(): void;

  /** @override */
  tearDown(): Promise<void>;

  /**
   * Update all AmbientSound effects in the layer by toggling their playback status
   */
  update(playOptions?: { fade?: boolean }): void;

  /** @override */
  protected _onDragLeftCancel(event: PointerEvent): void;

  /** @override */
  protected _onDragLeftDrop(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftStart(event: PIXI.InteractionEvent): void;
}
