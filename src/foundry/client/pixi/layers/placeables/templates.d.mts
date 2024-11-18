export {};

/**
 * This Canvas Layer provides a container for MeasuredTemplate objects.
 * @see {@link MeasuredTemplate}
 */
declare global {
  class TemplateLayer<
    DrawOptions extends TemplateLayer.DrawOptions = TemplateLayer.DrawOptions,
    TearDownOptions extends PlaceablesLayer.TearDownOptions = PlaceablesLayer.TearDownOptions,
  > extends PlaceablesLayer<"MeasuredTemplate", DrawOptions, TearDownOptions> {
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
     *   rotatableObjects: true,
     *   zIndex: 400
     * })
     * ```
     */
    static override get layerOptions(): TemplateLayer.LayerOptions;

    static override documentName: "MeasuredTemplate";

    override get hookName(): string;

    override _deactivate(): void;

    override _draw(options?: DrawOptions): Promise<void>;

    /**
     * Register game settings used by the TemplatesLayer
     */
    static registerSettings(): void;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    // @ts-expect-error Foundry is changing the return type here from Promise<PlaceableObject[]> to Promise<MeasuredTemplate>
    protected override _onMouseWheel(
      event: WheelEvent,
    ): ReturnType<MeasuredTemplate.ConfiguredInstance["rotate"]> | void;
  }

  namespace TemplateLayer {
    type AnyConstructor = typeof AnyTemplateLayer;

    interface DrawOptions extends PlaceablesLayer.DrawOptions {}

    interface LayerOptions extends PlaceablesLayer.LayerOptions<"MeasuredTemplate"> {
      name: "templates";
      rotatableObjects: true;
      zIndex: 400;
    }
  }
}

declare abstract class AnyTemplateLayer extends TemplateLayer {
  constructor(arg0: never, ...args: never[]);
}
