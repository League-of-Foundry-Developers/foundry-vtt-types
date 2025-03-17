import type { Mixin, IntentionalPartial, FixedInstanceType, RequiredProps } from "fvtt-types/utils";
import type BaseEffectSource from "./base-effect-source.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class PointEffectSource {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultData,
   *   radius: 0,
   *   externalRadius: 0,
   *   rotation: 0,
   *   angle: 360,
   *   walls: true
   * }
   * ```
   * @remarks This type is only accurate for classes extending `PointEffectSourceMixin(BaseEffectSource)`.
   * Other subclasses must override.
   */
  static defaultData: PointEffectSourceMixin.MixedSourceData;

  /**
   * @defaultValue `CONFIG.Canvas.polygonBackends[this.constructor.sourceType].create(origin, config)`
   * @privateRemarks This is not in Foundry's code, but the mixin class loses access to the type parameter that would
   * otherwise be here, and per the default above this is always a {@link PointSourcePolygon | `PointSourcePolygon`} subclass, always
   * {@link ClockwiseSweepPolygon | `ClockwiseSweepPolygon`} in core
   */
  shape: PointSourcePolygon;

  /**
   * A convenience reference to the radius of the source.
   */
  get radius(): number;

  protected _initialize(data: IntentionalPartial<PointEffectSourceMixin.MixedSourceData>): void;

  protected _initializeSoftEdges(): void;

  /**
   * Configure the parameters of the polygon that is generated for this source.
   */
  protected _getPolygonConfiguration(): PointEffectSourceMixin.PolygonConfig;

  protected _createShapes(): void;

  protected _drawMesh(layerId: string): PointSourceMesh | null;

  protected _updateGeometry(): void;

  /**
   * @deprecated since v11, until v13
   * @remarks `"The setter PointEffectSource#radius is deprecated. The radius should not be set anywhere except in PointEffectSource#_initialize."`
   */
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  set radius(radius);

  /**
   * @deprecated since v11, until v13
   * @remarks `"PointEffectSource#los is deprecated in favor of PointEffectSource#shape."`
   * @privateRemarks Actually implemented as getter/setter for deprecation warning purposes, but this causes inheritance problems with  {@link foundry.canvas.sources.PointVisionSource#los | `PointVisionSource`}
   */
  los: this["shape"];
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

  /** @remarks This mixin guarantees certain keys in the return type beyond the base required `type` */
  interface PolygonConfig
    extends RequiredProps<PointSourcePolygon.Config, "radius" | "externalRadius" | "angle" | "rotation" | "source"> {}

  interface SourceData {
    /**
     * The radius of the source
     * @defaultValue `0`
     */
    radius: number;

    /**
     * A secondary radius used for limited angles
     * @defaultValue `0`
     */
    externalRadius: number;

    /**
     * The angle of rotation for this point source
     * @defaultValue `0`
     */
    rotation: number;

    /**
     * The angle of emission for this point source
     * @defaultValue `360`
     */
    angle: number;

    /**
     * Whether or not the source is constrained by walls
     * @defaultValue `true`
     */
    walls: boolean;
  }
}

export default PointEffectSourceMixin;
