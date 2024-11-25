export {};

/**
 * The Lighting Layer which ambient light sources as part of the CanvasEffectsGroup.
 */
declare global {
  class LightingLayer<
    DrawOptions extends LightingLayer.DrawOptions = LightingLayer.DrawOptions,
    TearDownOptions extends LightingLayer.TearDownOptions = LightingLayer.TearDownOptions,
  > extends PlaceablesLayer<"AmbientLight", DrawOptions, TearDownOptions> {
    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): Canvas["lighting"];

    static override documentName: "AmbientLight";

    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    override options: LightingLayer.LayerOptions;

    /**
     * @defaultValue
     * ```
     * foundry.utils.mergeObject(super.layerOptions, {
     *  name: "lighting",
     *  rotatableObjects: true,
     *  zIndex: 900
     * })
     * ```
     */
    static override get layerOptions(): LightingLayer.LayerOptions;

    override get hookName(): string;

    override _draw(options?: DrawOptions): Promise<void>;

    override _tearDown(options?: TearDownOptions): Promise<void>;

    /**
     * Refresh the fields of all the ambient lights on this scene.
     */
    refreshFields(): void;

    override _activate(): void;

    protected override _canDragLeftStart(user: User.ConfiguredInstance, event: PIXI.FederatedEvent): boolean;

    protected override _onDragLeftStart(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftMove(event: PIXI.FederatedEvent): void;

    protected override _onDragLeftCancel(event: PointerEvent): void;

    // @ts-expect-error Foundry is changing the return type here from Promise<PlaceableObject[]> to just Promise<AmbientLight>
    protected _onMouseWheel(event: WheelEvent): ReturnType<AmbientLight.ConfiguredInstance["rotate"]>;

    /**
     * Actions to take when the darkness level of the Scene is changed
     * @param event - An event
     */
    protected _onDarknessChange(event: PIXI.FederatedEvent): void;
  }

  namespace LightingLayer {
    type AnyConstructor = typeof AnyLightingLayer;

    interface DrawOptions extends PlaceablesLayer.DrawOptions {}

    interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}

    interface LayerOptions extends PlaceablesLayer.LayerOptions<"AmbientLight"> {
      name: "lighting";
      rotatableObjects: true;
      zIndex: 900;
    }
  }
}

declare abstract class AnyLightingLayer extends LightingLayer {
  constructor(arg0: never, ...args: never[]);
}
