import type BaseLightSource from "./base-light-source.d.mts";

/**
 * A specialized subclass of the BaseLightSource which is used to render global light source linked to the scene.
 */
export default class GlobalLightSource extends BaseLightSource {
  /** @defaultValue `"GlobalLight"` */
  static override sourceType: string;

  /** @defaultValue `"lightSources"` */
  static override effectsCollection: string;

  /**
   * @defaultValue
   * ```js
   * {
   * ...super.defaultData,
   * rotation: 0,
   * angle: 360,
   * attenuation: 0,
   * priority: -Infinity,
   * vision: false,
   * walls: false,
   * elevation: Infinity,
   * darkness: {min: 0, max: 0}
   * }
   * ```
   */
  static override defaultData: BaseLightSource.BaseLightSourceData;

  /**
   * Name of this global light source.
   * @defaultValue GlobalLightSource.sourceType
   */
  name: string;

  /**
   * A custom polygon placeholder.
   */
  customPolygon: PIXI.Polygon | number[] | null;

  override _createShapes(): void;

  override _initializeSoftEdges(): void;

  override _updateGeometry(): void;
}
