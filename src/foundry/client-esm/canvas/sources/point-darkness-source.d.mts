import BaseLightSource from "./base-light-source.mts";
import PointEffectSourceMixin from "./point-effect-source.mts";

/**
 * A specialized subclass of the BaseLightSource which renders a source of darkness as a point-based effect.
 */
export default class PointDarknessSource extends PointEffectSourceMixin(BaseLightSource) {
  static override _brightLightingLevel: number;

  static override get _layers(): Record<string, foundry.canvas.sources.RenderedEffectSource.RenderedEffectLayerConfig>;

  /**
   * The optional geometric shape is solely utilized for visual representation regarding darkness sources.
   * Used only when an additional radius is added for visuals.
   */
  protected _visualShape: PointSourcePolygonConfig; // Typed as `SourceShape` parameter

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

  override _configure(changes: Partial<BaseLightSource.LightSourceData>): void;

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
