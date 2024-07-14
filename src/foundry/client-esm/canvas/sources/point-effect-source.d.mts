import type { Mixin } from "../../../../types/utils.d.mts";
import type BaseEffectSource from "./base-effect-source.d.mts";
import type BaseLightSource from "./base-light-source.d.mts";
import type RenderedEffectSource from "./rendered-effect-source.d.mts";

declare class PointEffectSource {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * @defaultValue
   * ```js
   * ...super.defaultData,
   * radius: 0,
   * externalRadius: 0,
   * rotation: 0,
   * angle: 360,
   * walls: true
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

type PointEffectSourceMixin_BaseEffectSource_Static = typeof PointEffectSource & typeof BaseEffectSource;

export interface PointEffectSourceMixin_BaseEffectSource_Interface
  extends PointEffectSourceMixin_BaseEffectSource_Static {
  new <
    SourceData extends BaseEffectSource.BaseEffectSourceData & PointEffectSourceMixin.PointEffectSourceData,
    SourceShape extends PointSourcePolygon,
  >(): PointEffectSource & BaseEffectSource<SourceData, SourceShape>;
}

type PointEffectSourceMixin_RenderedEffectSource_Static = typeof PointEffectSource & typeof RenderedEffectSource;

export interface PointEffectSourceMixin_RenderedEffectSource_Interface
  extends PointEffectSourceMixin_RenderedEffectSource_Static {
  new <
    SourceData extends RenderedEffectSource.RenderedEffectSourceData & PointEffectSourceMixin.PointEffectSourceData,
    SourceShape extends PointSourcePolygon,
    RenderingLayers extends Record<
      string,
      RenderedEffectSource.RenderedEffectSourceLayer
    > = RenderedEffectSource.Layers,
  >(): PointEffectSource & RenderedEffectSource<SourceData, SourceShape, RenderingLayers>;
}

type PointEffectSourceMixin_BaseLightSource_Static = typeof PointEffectSource & typeof BaseLightSource;

export interface PointEffectSourceMixin_BaseLightSource_Interface
  extends PointEffectSourceMixin_BaseLightSource_Static {
  new <
    SourceData extends BaseLightSource.LightSourceData & PointEffectSourceMixin.PointEffectSourceData,
    SourceShape extends PointSourcePolygon,
    RenderingLayers extends Record<
      string,
      RenderedEffectSource.RenderedEffectSourceLayer
    > = RenderedEffectSource.Layers,
  >(): PointEffectSource & BaseLightSource<SourceData, SourceShape, RenderingLayers>;
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
