import type {
  Mixin,
  IntentionalPartial,
  FixedInstanceType,
  RequiredProps,
  AnyObject,
  InexactPartial,
  Override,
} from "#utils";
import type BaseEffectSource from "./base-effect-source.d.mts";
import type { PointSourcePolygon } from "#client/canvas/geometry/_module.d.mts";
import type { PointSourceMesh } from "#client/canvas/containers/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";

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
   * @remarks `...super.defaultData` will depend on the mixed class; See {@linkcode foundry.canvas.sources.BaseLightSource.defaultData | BaseLightSource.defaultData},
   * {@linkcode foundry.canvas.sources.RenderedEffectSource.defaultData | RenderedEffectSource.defaultData}, or {@linkcode BaseEffectSource.defaultData}
   */
  static defaultData: PointEffectSourceMixin.MixedSourceData;

  /**
   * @defaultValue `CONFIG.Canvas.polygonBackends[this.constructor.sourceType].create(origin, config)`
   * @remarks `undefined` prior to initialization
   * @privateRemarks This is not in Foundry's code, but the mixin class loses access to the type parameter that would
   * otherwise be here, and per the default above this is always a {@linkcode PointSourcePolygon} subclass, always
   * {@linkcode foundry.canvas.geometry.ClockwiseSweepPolygon | ClockwiseSweepPolygon} in core
   */
  shape: PointSourcePolygon.Any | undefined;

  /**
   * The Edge instances added by this source.
   * @defaultValue `[]`
   */
  edges: foundry.canvas.geometry.edges.Edge[];

  /**
   * Whether this Point Effect source can create edges or not.
   * Overriding classes can define dynamic behavior if needed.
   * Default to false so that typical point sources do not create edges.
   */
  get requiresEdges(): boolean;

  /**
   * A convenience reference to the radius of the source.
   */
  get radius(): number;

  /**
   * The (elevated) origin of this point effect source.
   */
  get origin(): Canvas.ElevatedPoint;

  /**
   * The priority of this point effect source.
   */
  get priority(): number;

  // TODO: Flatten<IntentionalPartial<SourceData>>
  protected _configure(changes: AnyObject): void;

  /**
   * @privateRemarks Fake override to account for losing the ability to return `this` in {@linkcode sources.BaseEffectSource.initialize | BaseEffectSource} and
   * still have Initialized overrides.
   */
  initialize(
    data?: InexactPartial<PointEffectSourceMixin.MixedSourceData>,
    options?: BaseEffectSource.InitializeOptions,
  ): PointEffectSourceMixin.Initialized;

  protected _initialize(data: IntentionalPartial<PointEffectSourceMixin.MixedSourceData>): void;

  protected _initializeSoftEdges(): void;

  /**
   * Configure the parameters of the polygon that is generated for this source.
   */
  protected _getPolygonConfiguration(): PointEffectSourceMixin.PolygonConfig;

  protected _createShapes(): void;

  protected _destroy(): void;

  protected _drawMesh(layerId: string): PointSourceMesh | null;

  protected _updateGeometry(): void;

  /**
   * Create the Edge instances that correspond to this source.
   */
  protected _createEdges(): void;

  /**
   * Remove edges from the active Edges collection.
   */
  protected _deleteEdges(): void;

  #PointEffectSource: true;
}

/**
 * Provides a common framework for effect sources that emanate from a central point and extend within a specific radius.
 * This mixin can be used to manage any effect with a point-based origin, such as light, darkness, or other effects.
 * @param BaseSource - The base source class to extend
 */
declare function PointEffectSourceMixin<BaseClass extends PointEffectSourceMixin.BaseClass>(
  BaseSource: BaseClass,
): Mixin<typeof PointEffectSource, BaseClass>;

declare namespace PointEffectSourceMixin {
  interface AnyMixedConstructor extends ReturnType<typeof PointEffectSourceMixin<BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = BaseEffectSource.AnyConstructor;

  type Initialized = Override<
    PointEffectSourceMixin.AnyMixed,
    {
      /**
       * The geometric shape of the effect source which is generated later.
       * @remarks This is the initialized type, the shape has been generated if you're accessing this
       */
      shape: PointSourcePolygon.Any;
    }
  >;

  interface MixedSourceData extends SourceData, BaseEffectSource.SourceData {}

  /** @remarks This mixin guarantees certain keys in the return type beyond the base required `type` */

  interface PolygonConfig
    extends RequiredProps<
      PointSourcePolygon.Config,
      // TODO(esheyw): remove the following once canvas.geometry is done
      // @ts-expect-error edgeOptions is not implemented yet
      "radius" | "edgeOptions" | "externalRadius" | "angle" | "rotation" | "priority" | "source"
    > {}

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

    /**
     * Strength of this source to beat or not negative/positive sources
     * @defaultValue `0`
     */
    priority: number;
  }
}

export default PointEffectSourceMixin;
