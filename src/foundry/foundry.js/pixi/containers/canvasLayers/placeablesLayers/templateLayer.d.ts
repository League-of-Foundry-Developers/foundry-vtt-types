/**
 * This Canvas Layer provides a container for MeasuredTemplate objects.
 * @see {@link MeasuredTemplate}
 */
declare class TemplateLayer extends PlaceablesLayer<'MeasuredTemplate', TemplateLayer.LayerOptions> {
  /**
   * @remarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): TemplateLayer;

  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.layerOptions, {
   *   name: "templates",
   *   canDragCreate: true,
   *   rotatableObjects: true,
   *   sortActiveTop: true,
   *   zIndex: 50
   * })
   * ```
   */
  static get layerOptions(): TemplateLayer.LayerOptions;

  /** @override */
  static documentName: 'MeasuredTemplate';

  /** @override */
  activate(): this;

  /** @override */
  deactivate(): this;

  /**
   * Register game settings used by the TemplatesLayer
   */
  static registerSettings(): void;

  /** @override */
  protected _onDragLeftStart(event: PIXI.InteractionEvent): Promise<MeasuredTemplate>;

  /** @override */
  protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

  /**
   * @override
   */
  protected _onMouseWheel(event: WheelEvent): void | ReturnType<MeasuredTemplate['rotate']>;
}

declare namespace TemplateLayer {
  interface LayerOptions extends PlaceablesLayer.LayerOptions<'MeasuredTemplate'> {
    name: 'templates';
    canDragCreate: true;
    rotatableObjects: true;
    sortActiveTop: true;
    zIndex: 50;
  }
}
