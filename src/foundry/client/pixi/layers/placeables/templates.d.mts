import type { HandleEmptyObject } from "fvtt-types/utils";

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
     *   rotatableObjects: true,
     *   zIndex: 400
     * })
     * ```
     */
    static override get layerOptions(): TemplateLayer.LayerOptions;

    static override documentName: "MeasuredTemplate";

    override get hookName(): "TemplateLayer";

    protected override _deactivate(): void;

    protected override _draw(options: HandleEmptyObject<TemplateLayer.DrawOptions>): Promise<void>;

    /**
     * Register game settings used by the TemplatesLayer
     */
    static registerSettings(): void;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    // @ts-expect-error Foundry is changing the return type here from Promise<PlaceableObject[]> to Promise<MeasuredTemplate>
    protected override _onMouseWheel(event: WheelEvent): Promise<MeasuredTemplate.ConfiguredInstance> | void;
  }

  namespace TemplateLayer {
    interface Any extends AnyTemplateLayer {}
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
