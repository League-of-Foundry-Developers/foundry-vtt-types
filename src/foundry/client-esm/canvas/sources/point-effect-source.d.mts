import type { Mixin } from "../../../../types/utils.d.mts";
import type BaseEffectSource from "./base-effect-source.d.mts";

declare class PointEffectSource {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * @defaultValue
   * ```js
   * {
   * ...super.defaultData,
   * radius: 0,
   * externalRadius: 0,
   * rotation: 0,
   * angle: 360,
   * walls: true
   * }
   * ```
   */
  static defaultData: PointEffectSourceMixin.PointEffectSourceData;

  /**
   * A convenience reference to the radius of the source.
   */
  get radius(): number;

  _initialize(data: Partial<PointEffectSourceMixin.PointEffectSourceData>): void;

  _initializeSoftEdges(): void;

  /**
   * Configure the parameters of the polygon that is generated for this source.
   */
  protected _getPolygonConfiguration(): PointSourcePolygonConfig;

  _createShapes(): void;

  _drawMesh(layerId: string): PIXI.Mesh | null;

  _updateGeometry(): void;

  /**
   * @deprecated since v11, until v13
   * @remarks `"The setter PointEffectSource#radius is deprecated. The radius should not be set anywhere except in PointEffectSource#_initialize."`
   */
  set radius(radius);

  /**
   * @deprecated since v11, until v13
   * @remarks `"PointEffectSource#los is deprecated in favor of PointEffectSource#shape."`
   * @privateRemarks Actual definition is get/set
   */
  los: PointSourcePolygon;
}

/**
 * TODO - documentation required about what a PointEffectSource is.
 * @privateRemarks the TODO is from foundry, update this class whenever the comments are done
 */
declare function PointEffectSourceMixin<BaseClass extends typeof BaseEffectSource<any, any>>(
  Base: BaseClass,
): Mixin<typeof PointEffectSource, BaseClass>;

declare namespace PointEffectSourceMixin {
  interface PointEffectSourceData extends BaseEffectSource.BaseEffectSourceData {
    /**
     * The radius of the source
     */
    radius: number;
    /**
     * A secondary radius used for limited angles
     */
    externalRadius: number;
    /**
     * The angle of rotation for this point source
     */
    rotation: number;
    /**
     * The angle of emission for this point source
     */
    angle: number;
    /**
     * Whether or not the source is constrained by walls
     */
    walls: boolean;
  }
}

export default PointEffectSourceMixin;
