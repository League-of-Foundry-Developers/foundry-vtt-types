import type { AnyObject, FixedInstanceType, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type { AmbientLight } from "#client/canvas/placeables/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      LightingLayer: LightingLayer.Implementation;
    }
  }
}

/**
 * The Lighting Layer which ambient light sources as part of the CanvasEffectsGroup.
 */
declare class LightingLayer extends PlaceablesLayer<"AmbientLight"> {
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

  override get hookName(): "LightingLayer";

  protected override _draw(options: AnyObject): Promise<void>;

  protected override _tearDown(options: AnyObject): Promise<void>;

  /**
   * Refresh the fields of all the ambient lights on this scene.
   */
  refreshFields(): void;

  protected override _activate(): void;

  protected override _canDragLeftStart(user: User.Implementation, event: Canvas.Event.Pointer): boolean;

  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  // @ts-expect-error Foundry is changing the return type here from Promise<PlaceableObject[]> to just Promise<AmbientLight>
  protected _onMouseWheel(event: Canvas.Event.Wheel): Promise<AmbientLight.Implementation>;

  /**
   * Actions to take when the darkness level of the Scene is changed
   * @param event - An event
   */
  protected _onDarknessChange(event: Canvas.Event.DarknessChange): void;
}

declare namespace LightingLayer {
  interface Any extends AnyLightingLayer {}
  interface AnyConstructor extends Identity<typeof AnyLightingLayer> {}

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["layers"]["lighting"]["layerClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface LayerOptions extends PlaceablesLayer.LayerOptions<AmbientLight.ImplementationClass> {
    name: "lighting";
    rotatableObjects: true;
    zIndex: 900;
  }
}

export default LightingLayer;

declare abstract class AnyLightingLayer extends LightingLayer {
  constructor(...args: never);
}
