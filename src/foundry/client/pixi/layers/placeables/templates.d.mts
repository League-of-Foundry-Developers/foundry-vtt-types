export {};

/**
 * This Canvas Layer provides a container for MeasuredTemplate objects.
 * @see {@link MeasuredTemplate}
 */
declare global {
  class TemplateLayer extends PlaceablesLayer<"MeasuredTemplate"> {
    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): Canvas["templates"];

    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    override options: TemplateLayer.LayerOptions;

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

    override get hookName(): string;

    override _deactivate(): void;

    /**
     * Register game settings used by the TemplatesLayer
     */
    static registerSettings(): void;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): Promise<MeasuredTemplate>;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onMouseWheel(event: WheelEvent): void | ReturnType<MeasuredTemplate["rotate"]>;
  }

  namespace TemplateLayer {
    interface LayerOptions extends PlaceablesLayer.LayerOptions<"MeasuredTemplate"> {
      name: "templates";
      canDragCreate: true;
      rotatableObjects: true;
      sortActiveTop: true;
      zIndex: 50;
    }
  }
}
