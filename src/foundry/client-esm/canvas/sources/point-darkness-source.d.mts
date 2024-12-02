import type BaseLightSource from "./base-light-source.d.mts";
import type PointEffectSourceMixin from "./point-effect-source.d.mts";
import type RenderedEffectSource from "./rendered-effect-source.d.mts";

type DarknessSourceData = BaseLightSource.LightSourceData & PointEffectSourceMixin.PointEffectSourceData;

// Interface causes errors
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type DarknessLayers = {
  darkness: RenderedEffectSource.RenderedEffectSourceLayer;
};

/**
 * A specialized subclass of the BaseLightSource which renders a source of darkness as a point-based effect.
 */
export default class PointDarknessSource<
  SourceData extends DarknessSourceData = DarknessSourceData,
  SourceShape extends PointSourcePolygon = PointSourcePolygon,
> extends PointEffectSourceMixin(BaseLightSource)<SourceData, SourceShape, DarknessLayers> {
  /** @defaultValue `"darknessSources"` */
  static override effectsCollection: string;

  /** @defaultValue `LIGHTING_LEVELS.HALFDARK` */
  static override _dimLightingLevel: foundry.CONST.LIGHTING_LEVELS;

  /** @defaultValue `LIGHTING_LEVELS.DARKNESS` */
  static override _brightLightingLevel: foundry.CONST.LIGHTING_LEVELS;

  /** @defaultValue `CONFIG.Canvas.darknessAnimations` */
  static get ANIMATIONS(): CONFIG.Canvas.LightSourceAnimationConfig;

  static override get _layers(): Record<string, foundry.canvas.sources.RenderedEffectSource.RenderedEffectLayerConfig>;

  /**
   * The optional geometric shape is solely utilized for visual representation regarding darkness sources.
   * Used only when an additional radius is added for visuals.
   */
  protected _visualShape: SourceShape;

  /**
   * Padding applied on the darkness source shape for visual appearance only.
   * Note: for now, padding is increased radius. It might evolve in a future release.
   */
  protected _padding: number;

  /**
   * The Edge instances added by this darkness source.
   */
  edges: foundry.canvas.edges.Edge[];

  override _createShapes(): void;

  override _configure(changes: Partial<SourceData>): void;

  override _getPolygonConfiguration(): PointSourcePolygonConfig;

  override _drawMesh(layerId: string): PIXI.Mesh | null;

  override _updateGeometry(): void;

  /**
   * Update the uniforms of the shader on the darkness layer.
   */
  _updateDarknessUniforms(): void;

  override _destroy(): void;

  /**
   * A convenience accessor to the darkness layer mesh.
   * @deprecated since v12, until v14
   * @remarks `"BaseLightSource#isDarkness is now obsolete. Use DarknessSource instead."`
   */
  get darkness(): PointSourceMesh;
}
