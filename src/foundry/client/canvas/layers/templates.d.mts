import type { AnyObject, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type { MeasuredTemplate } from "#client/canvas/placeables/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      TemplateLayer: TemplateLayer.Any;
    }
  }
}

/**
 * This Canvas Layer provides a container for MeasuredTemplate objects.
 * @see {@linkcode MeasuredTemplate}
 */
declare class TemplateLayer extends PlaceablesLayer<"MeasuredTemplate"> {
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

  protected override _draw(options: AnyObject): Promise<void>;

  /**
   * Register game settings used by the TemplatesLayer
   */
  static registerSettings(): void;

  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  // @ts-expect-error Foundry is changing the return type here from Promise<PlaceableObject[]> to Promise<MeasuredTemplate>
  protected override _onMouseWheel(event: Canvas.Event.Wheel): Promise<MeasuredTemplate.Implementation> | void;
}

declare namespace TemplateLayer {
  interface Any extends AnyTemplateLayer {}
  interface AnyConstructor extends Identity<typeof AnyTemplateLayer> {}

  interface LayerOptions extends PlaceablesLayer.LayerOptions<MeasuredTemplate.ImplementationClass> {
    name: "templates";
    rotatableObjects: true;
    zIndex: 400;
  }
}

export default TemplateLayer;

declare abstract class AnyTemplateLayer extends TemplateLayer {
  constructor(...args: never);
}
