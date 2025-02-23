import type { IntentionalPartial } from "fvtt-types/utils";
import type BaseLightSource from "./base-light-source.d.mts";
import type PointEffectSourceMixin from "./point-effect-source.d.mts";
import type RenderedEffectSource from "./rendered-effect-source.d.mts";

/**
 * A specialized subclass of the BaseLightSource which renders a source of darkness as a point-based effect.
 */
declare class PointDarknessSource<
  SourceData extends PointDarknessSource.SourceData = PointDarknessSource.SourceData,
  SourceShape extends PointSourcePolygon = PointSourcePolygon,
> extends PointEffectSourceMixin(BaseLightSource)<SourceData, SourceShape, PointDarknessSource.Layers> {
  /** @defaultValue `"darknessSources"` */
  static override effectsCollection: string;

  /** @defaultValue `foundry.CONST.LIGHTING_LEVELS.HALFDARK` */
  static override _dimLightingLevel: foundry.CONST.LIGHTING_LEVELS;

  /** @defaultValue `foundry.CONST.LIGHTING_LEVELS.DARKNESS` */
  static override _brightLightingLevel: foundry.CONST.LIGHTING_LEVELS;

  /** @defaultValue `CONFIG.Canvas.darknessAnimations` */
  static get ANIMATIONS(): typeof CONFIG.Canvas.darknessAnimations;

  static override get _layers(): Record<string, foundry.canvas.sources.RenderedEffectSource.LayerConfig>;

  /** @privateRemarks This is not in Foundry's code, but accounts for the mixin class's static property's inability to be generic */
  static override defaultData: PointDarknessSource.SourceData;

  /**
   * The optional geometric shape is solely utilized for visual representation regarding darkness sources.
   * Used only when an additional radius is added for visuals.
   */
  protected _visualShape: SourceShape | null;

  /**
   * @privateRemarks This is not in foundry's code, but since this class (and its parent) implements `_createShapes`,
   * and we are counting what happens in `initialize` as 'the constructor', this gets to be declared never undefined.
   */
  override shape: SourceShape;

  /**
   * Padding applied on the darkness source shape for visual appearance only.
   * Note: for now, padding is increased radius. It might evolve in a future release.
   * @defaultValue `(CONFIG.Canvas.darknessSourcePaddingMultiplier ?? 0) * canvas.grid.size`
   */
  protected _padding: number;

  /**
   * The Edge instances added by this darkness source.
   */
  edges: foundry.canvas.edges.Edge[];

  /**
   * A convenience accessor to the darkness layer mesh.
   */
  get darkness(): this["layers"]["darkness"]["mesh"];

  override _initialize(data: IntentionalPartial<SourceData>): void;

  protected override _createShapes(): void;

  protected override _configure(changes: IntentionalPartial<SourceData>): void;

  override _getPolygonConfiguration(): PointSourcePolygon.Config;

  protected override _drawMesh(layerId: string): PointSourceMesh | null;

  override _updateGeometry(): void;

  /**
   * Update the uniforms of the shader on the darkness layer.
   */
  _updateDarknessUniforms(): void;

  override _destroy(): void;

  /**
   * @deprecated since v12, until v14
   * @remarks `"BaseLightSource#isDarkness is now obsolete. Use DarknessSource instead."`
   *
   * Always returns `true`
   */
  get isDarkness(): true;
}

declare namespace PointDarknessSource {
  type AnyConstructor = typeof AnyPointDarknessSource;

  type SourceData = BaseLightSource.SourceData & PointEffectSourceMixin.SourceData;

  // Interface would require `RenderingLayers extends ... = InterfaceToObject<Layers>` in every subclass signature
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Layers = {
    darkness: RenderedEffectSource.SourceLayer;
  };
}

declare abstract class AnyPointDarknessSource extends PointDarknessSource {
  constructor(arg0: never, ...args: never[]);
}

export default PointDarknessSource;
