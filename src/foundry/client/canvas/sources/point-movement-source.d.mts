import type { FixedInstanceType, Identity, InexactPartial, Override } from "#utils";
import type BaseEffectSource from "./base-effect-source.d.mts";
import type PointEffectSourceMixin from "./point-effect-source.d.mts";
import type { PointSourcePolygon } from "#client/canvas/geometry/_module.d.mts";

/**
 * A specialized subclass of the BaseEffectSource which describes a movement-based source.
 */
declare class PointMovementSource<
  SourceData extends PointMovementSource.SourceData = PointMovementSource.SourceData,
  SourceShape extends PointSourcePolygon = PointMovementSource.ImplementationPolygon,
> extends PointEffectSourceMixin(BaseEffectSource)<SourceData, SourceShape> {
  static override sourceType: "move";

  /**
   * @remarks See {@linkcode PointEffectSourceMixin.AnyMixedConstructor.defaultData | PointEffectSourceMixin.defaultData}
   * @privateRemarks Fake override to allow merging to this interface but not its parents
   */
  static override defaultData: PointMovementSource.SourceData;

  /** @privateRemarks Fake override to remove `number[]` */
  override shape: SourceShape | undefined;

  /** @privateRemarks Fake override to specify Initialized return type */
  override initialize(
    data?: InexactPartial<SourceData>,
    options?: BaseEffectSource.InitializeOptions,
  ): PointMovementSource.Initialized<SourceData, SourceShape>;
}

declare namespace PointMovementSource {
  interface Any extends AnyPointMovementSource {}
  interface AnyConstructor extends Identity<typeof AnyPointMovementSource> {}

  type Initialized<
    SourceData extends PointMovementSource.SourceData = PointMovementSource.SourceData,
    SourceShape extends PointSourcePolygon = PointMovementSource.ImplementationPolygon,
  > = Override<
    PointMovementSource<SourceData, SourceShape>,
    {
      /**
       * The geometric shape of the effect source which is generated later.
       * @remarks This is the initialized type, the shape has been generated if you're accessing this
       */
      shape: SourceShape;
    }
  >;

  interface SourceData extends PointEffectSourceMixin.MixedSourceData {}

  // This is the only core Point*Source class that isn't configurable, `Token##getMovementSource`
  // references this class directly, there is no `CONFIG.Canvas.movementSourceClass` or equivalent

  interface ImplementationPolygonClass extends Identity<CONFIG["Canvas"]["polygonBackends"]["move"]> {}
  interface ImplementationPolygon extends FixedInstanceType<ImplementationPolygonClass> {}
}

export default PointMovementSource;

declare abstract class AnyPointMovementSource extends PointMovementSource<
  PointMovementSource.SourceData,
  PointMovementSource.ImplementationPolygon
> {
  constructor(...args: never);
}
