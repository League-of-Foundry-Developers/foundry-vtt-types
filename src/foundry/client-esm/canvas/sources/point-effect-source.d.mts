import type { Mixin, IntentionalPartial, FixedInstanceType } from "fvtt-types/utils";
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
   * @privateRemarks This will only be accurate for classes extending `PointEffectSourceMixin(BaseEffectSource)`.
   * Other subclasses must override this.
   */
  static defaultData: PointEffectSourceMixin.MixedSourceData;

  /** @privateRemarks This is not in Foundry's code, but the mixin class loses access to the type parameter that would otherwise be here */
  shape: PointSourcePolygon;

  /**
   * A convenience reference to the radius of the source.
   */
  get radius(): number;

  _initialize(data: IntentionalPartial<PointEffectSourceMixin.MixedSourceData>): void;

  _initializeSoftEdges(): void;

  /**
   * Configure the parameters of the polygon that is generated for this source.
   */
  protected _getPolygonConfiguration(): PointSourcePolygon.Config;

  _createShapes(): void;

  _drawMesh(layerId: string): PIXI.Mesh | null;

  _updateGeometry(): void;

  /**
   * @deprecated since v11, until v13
   * @remarks `"The setter PointEffectSource#radius is deprecated. The radius should not be set anywhere except in PointEffectSource#_initialize."`
   */
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
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
declare function PointEffectSourceMixin<BaseClass extends PointEffectSourceMixin.BaseClass>(
  Base: BaseClass,
): Mixin<typeof PointEffectSource, BaseClass>;

declare namespace PointEffectSourceMixin {
  type AnyMixedConstructor = ReturnType<typeof PointEffectSourceMixin<BaseClass>>;
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = BaseEffectSource.AnyConstructor;

  type MixedSourceData = SourceData & BaseEffectSource.SourceData;

  interface SourceData {
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
