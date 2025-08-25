import type { AnyObject, FixedInstanceType, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type { MeasuredTemplate } from "#client/canvas/placeables/_module.d.mts";
import type { SceneControls } from "#client/applications/ui/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      TemplateLayer: TemplateLayer.Implementation;
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
   * ```js
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

  protected override _getCopyableObjects(
    options: PlaceablesLayer.GetCopyableObjectsOptions,
  ): MeasuredTemplate.Implementation[];

  protected override _deactivate(): void;

  protected override _draw(options: AnyObject): Promise<void>;

  /**
   * Register game settings used by the TemplatesLayer
   */
  static registerSettings(): void;

  static override prepareSceneControls(): SceneControls.Control;

  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  protected override _onMouseWheel(event: Canvas.Event.Wheel): Promise<MeasuredTemplate.Implementation> | void;
}

declare namespace TemplateLayer {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyTemplateLayer {}
    interface AnyConstructor extends Identity<typeof AnyTemplateLayer> {}
  }

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["layers"]["templates"]["layerClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

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
