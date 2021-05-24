/**
 * This Canvas Layer provides a container for MeasuredTemplate objects.
 * @see {@link MeasuredTemplate}
 */
declare class TemplateLayer extends PlaceablesLayer<MeasuredTemplate> {
  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.layerOptions, {
   *   canDragCreate: true,
   *   canDelete: true,
   *   rotatableObjects: true,
   *   objectClass: MeasuredTemplate,
   *   sheetClass: MeasuredTemplateConfig,
   *   sortActiveTop: true,
   *   zIndex: 50
   * })
   * ```
   */
  static get layerOptions(): PlaceablesLayer.LayerOptions;

  /** @override */
  activate(): this;

  /** @override */
  deactivate(): this;

  /**
   * Register game settings used by the TemplatesLayer
   */
  static registerSettings(): void;

  /** @override */
  protected _onDragLeftStart(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

  /**
   * @override
   * @remarks Returns `Promise<MeasuredTemplate> | undefined`
   */
  protected _onMouseWheel(event: WheelEvent): any;
}
