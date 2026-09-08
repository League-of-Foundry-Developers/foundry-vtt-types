import type { AnyMutableObject, FixedInstanceType, HandleEmptyObject, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type PlaceablesLayer from "./base/placeables-layer.d.mts";
import type ShapeLayerMixin from "./mixins/shapes.d.mts";
import type { AmbientLight } from "#client/canvas/placeables/_module.d.mts";
import type { SceneControls } from "#client/applications/ui/_module.d.mts";
import type { AmbientLightPalette } from "#client/applications/sheets/palette/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      LightingLayer: LightingLayer.Implementation;
    }
  }
}

/** @privateRemarks Defers the effects-group circular base-expression resolution. */
declare const LightingLayerBase: ShapeLayerMixin.Mix<typeof PlaceablesLayer>;

/**
 * The Lighting Layer which ambient light sources as part of the CanvasEffectsGroup.
 */
declare class LightingLayer extends LightingLayerBase<"AmbientLight"> {
  // fake type override
  static get instance(): Canvas["lighting"];

  static override documentName: "AmbientLight";

  static override paletteClass: typeof AmbientLightPalette;

  /**
   * @defaultValue
   * ```js
   * foundry.utils.mergeObject(super.layerOptions, {
   *  name: "lighting",
   *  controllableObjects: true,
   *  rotatableObjects: true,
   *  zIndex: 900
   * })
   * ```
   */
  static override get layerOptions(): LightingLayer.LayerOptions;

  // fake type override
  override options: LightingLayer.LayerOptions;

  override get hookName(): "LightingLayer";

  // fake type override
  override draw(options?: HandleEmptyObject<LightingLayer.DrawOptions>): Promise<this>;

  protected override _draw(options: HandleEmptyObject<LightingLayer.DrawOptions>): Promise<void>;

  // fake type override
  override tearDown(options?: LightingLayer.TearDownOptions): Promise<this>;

  protected override _tearDown(options: LightingLayer.TearDownOptions): Promise<void>;

  /**
   * Refresh the fields of all the ambient lights on this scene.
   */
  refreshFields(): void;

  protected override _activate(): void;

  static override prepareSceneControls(): SceneControls.Control;

  protected override _createDragShapeData(event: Canvas.Event.Pointer): AnyMutableObject;

  protected override _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected override _updateMouseWheelPreview(): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  /**
   * Actions to take when the darkness level of the Scene is changed
   * @param event - An event
   * @internal
   */
  _onDarknessChange(event: Canvas.Event.DarknessChange): void;

  #LightingLayer: true;
}

declare namespace LightingLayer {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Implementation} instead. This type will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode ImplementationClass} instead. This type will be removed in v15.
   */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyLightingLayer {}
    interface AnyConstructor extends Identity<typeof AnyLightingLayer> {}
  }

  interface ImplementationClass extends Identity<typeof CONFIG.Canvas.layers.lighting.layerClass> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface LayerOptions extends ShapeLayerMixin.LayerOptions<AmbientLight.ImplementationClass> {
    name: "lighting";
    controllableObjects: true;
    rotatableObjects: true;

    /** @defaultValue `900` */
    zIndex: number;
  }

  interface DrawOptions extends PlaceablesLayer.DrawOptions {}

  interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}
}

export default LightingLayer;

declare abstract class AnyLightingLayer extends LightingLayer {
  constructor(...args: never);
}
