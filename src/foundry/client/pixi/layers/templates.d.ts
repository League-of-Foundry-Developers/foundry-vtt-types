/**
 * This Canvas Layer provides a container for MeasuredTemplate objects.
 * @see {@link MeasuredTemplate}
 */
declare class TemplateLayer extends PlaceablesLayer<"MeasuredTemplate", TemplateLayer.LayerOptions> {
  /**
   * @remarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["templates"];

  /**
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
  static override get layerOptions(): TemplateLayer.LayerOptions;

  static override documentName: "MeasuredTemplate";

  override activate(): this;

  override deactivate(): this;

  /**
   * Register game settings used by the TemplatesLayer
   */
  static registerSettings(): void;

  protected override _onDragLeftStart(event: PIXI.InteractionEvent): Promise<MeasuredTemplate>;

  protected override _onDragLeftMove(event: PIXI.InteractionEvent): void;

  protected override _onMouseWheel(event: WheelEvent): void | ReturnType<MeasuredTemplate["rotate"]>;
}

declare namespace TemplateLayer {
  interface LayerOptions extends PlaceablesLayer.LayerOptions<"MeasuredTemplate"> {
    name: "templates";
    canDragCreate: true;
    rotatableObjects: true;
    sortActiveTop: true;
    zIndex: 50;
  }
}
