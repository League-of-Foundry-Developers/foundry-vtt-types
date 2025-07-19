import type { FixedInstanceType, Identity, InexactPartial, Override } from "#utils";
import type BaseLightSource from "./base-light-source.d.mts";
import type RenderedEffectSource from "./rendered-effect-source.d.mts";
import type { AbstractBaseShader } from "#client/canvas/rendering/shaders/_module.d.mts";
import type BaseEffectSource from "./base-effect-source.d.mts";

/**
 * A specialized subclass of the BaseLightSource which is used to render global light source linked to the scene.
 */
declare class GlobalLightSource<
  SourceData extends GlobalLightSource.SourceData = GlobalLightSource.SourceData,
  SourceShape extends PIXI.Polygon = PIXI.Polygon,
  RenderingLayers extends Record<string, RenderedEffectSource.LayerConfig> = BaseLightSource.Layers,
> extends BaseLightSource<SourceData, SourceShape, RenderingLayers> {
  static override sourceType: "GlobalLight";

  /** @defaultValue `"lightSources"` */
  static override effectsCollection: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   ...super.defaultData,
   *   rotation: 0,
   *   angle: 360,
   *   attenuation: 0,
   *   priority: -Infinity,
   *   vision: false,
   *   walls: false,
   *   elevation: Infinity,
   *   darkness: {min: 0, max: 0}
   * }
   * ```
   * @remarks See {@linkcode BaseLightSource.defaultData}
   */
  static override defaultData: GlobalLightSource.SourceData;

  /**
   * Name of this global light source.
   * @defaultValue {@linkcode GlobalLightSource.sourceType | this.constructor.sourceType}
   */
  name: string;

  /**
   * A custom polygon placeholder.
   * @defaultValue `null`
   * @remarks This is not set anywhere in Foundry code, so will always be `null` barring system/module/user action
   */
  customPolygon: PIXI.Polygon | number[] | null;

  /** @privateRemarks Fake override to specify Initialized return type */
  override initialize(
    data?: InexactPartial<SourceData>,
    options?: BaseEffectSource.InitializeOptions,
  ): GlobalLightSource.Initialized<SourceData, SourceShape, RenderingLayers>;

  protected override _createShapes(): void;

  protected override _initializeSoftEdges(): void;

  protected override _updateGeometry(): void;

  protected override _updateCommonUniforms(shader: AbstractBaseShader): void;
}

declare namespace GlobalLightSource {
  interface Any extends AnyGlobalLightSource {}
  interface AnyConstructor extends Identity<typeof AnyGlobalLightSource> {}

  type ImplementationClass = CONFIG["Canvas"]["globalLightSourceClass"];
  type Implementation = FixedInstanceType<ImplementationClass>;

  type Initialized<
    SourceData extends GlobalLightSource.SourceData = GlobalLightSource.SourceData,
    SourceShape extends PIXI.Polygon = PIXI.Polygon,
    RenderingLayers extends Record<string, RenderedEffectSource.LayerConfig> = BaseLightSource.Layers,
  > = Override<
    GlobalLightSource<SourceData, SourceShape, RenderingLayers>,
    {
      /**
       * The geometric shape of the effect source which is generated later.
       * @remarks This is the initialized type, the shape has been generated if you're accessing this
       */
      shape: SourceShape | number[];
    }
  >;

  /**
   * @privateRemarks `attenuation`, `priority`, and `elevation` exist in the parent interface,
   * but are here for defaultValue overrides
   */
  interface SourceData extends BaseLightSource.SourceData {
    /**
     * @defaultValue `0`
     * @remarks Seemingly unused here, since `GlobalLightSource` does not inherit from `PointEffectSourceMixin`
     */
    rotation: number;

    /**
     * @defaultValue `360`
     * @remarks Seemingly unused here, since `GlobalLightSource` does not inherit from `PointEffectSourceMixin`
     */
    angle: number;

    /** @defaultValue `0` */
    attenuation: number;

    /**
     * @defaultValue `-Infinity`
     * @remarks Seemingly unused here, since `GlobalLightSource` does not inherit from `PointEffectSourceMixin`
     */
    priority: number;

    // `vision` override omitted as it doesn't change the default

    /**
     * @defaultValue `false`
     * @remarks Seemingly unused here, since `GlobalLightSource` does not inherit from `PointEffectSourceMixin`
     */
    walls: boolean;

    /** @defaultValue `Infinity` */
    elevation: number;

    /** @remarks Threshold values for what darkness level the global light should be enabled for */
    darkness: {
      /** @defaultValue `0` */
      min: number;

      /** @defaultValue `0` */
      max: number;
    };
  }

  /**
   * @deprecated Replaced by {@linkcode GlobalLightSource.ImplementationClass}.
   */
  type ConfiguredClass = ImplementationClass;

  /**
   * @deprecated Replaced by {@linkcode GlobalLightSource.Implementation}.
   */
  type ConfiguredInstance = Implementation;
}

declare abstract class AnyGlobalLightSource extends GlobalLightSource {
  constructor(...args: never);
}

export default GlobalLightSource;
