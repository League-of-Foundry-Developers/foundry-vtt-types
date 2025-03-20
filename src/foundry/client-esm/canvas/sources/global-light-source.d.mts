import type { FixedInstanceType, Identity } from "fvtt-types/utils";
import type BaseLightSource from "./base-light-source.d.mts";
import type RenderedEffectSource from "./rendered-effect-source.d.mts";

/**
 * A specialized subclass of the BaseLightSource which is used to render global light source linked to the scene.
 */
declare class GlobalLightSource<
  SourceData extends GlobalLightSource.SourceData = GlobalLightSource.SourceData,
  SourceShape extends PIXI.Polygon = PIXI.Polygon,
  RenderingLayers extends Record<string, RenderedEffectSource.SourceLayer> = RenderedEffectSource.Layers,
> extends BaseLightSource<SourceData, SourceShape, RenderingLayers> {
  /** @defaultValue `"GlobalLight"` */
  static override sourceType: string;

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
   */
  static override defaultData: GlobalLightSource.SourceData;

  /** @privateRemarks This class implements `#_createShapes`, so it's shape property will 'never' be undefined (after initialization) */
  shape: SourceShape;

  /**
   * Name of this global light source.
   * @defaultValue `this.constructor.sourceType` (`"GlobalLight"`)
   */
  name: string;

  /**
   * A custom polygon placeholder.
   * @defaultValue `null`
   * @remarks This is not set anywhere in Foundry code, so will always be null barring system/module/user action
   */
  customPolygon: PIXI.Polygon | number[] | null;

  protected override _createShapes(): void;

  protected override _initializeSoftEdges(): void;

  protected override _updateGeometry(): void;

  protected override _updateCommonUniforms(shader: AbstractBaseShader): void;
}

declare namespace GlobalLightSource {
  interface Any extends AnyGlobalLightSource {}
  interface AnyConstructor extends Identity<typeof AnyGlobalLightSource> {}

  /**
   * @privateRemarks `attenuation`, `priority`, and `elevation` exist in the parent interface,
   * but are here for defaultValue overrides
   */
  interface SourceData extends BaseLightSource.SourceData {
    /** @privateRemarks Type override only, the global light is not going to use a `darknessShader` */
    animation: RenderedEffectSource.StoredLightAnimationConfig;

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

    /** @defaultValue `-Infinity` */
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

  type ConfiguredClass = CONFIG["Canvas"]["globalLightSourceClass"];
  type ConfiguredInstance = FixedInstanceType<ConfiguredClass>;
}

declare abstract class AnyGlobalLightSource extends GlobalLightSource {
  constructor(arg0: never, ...args: never[]);
}

export default GlobalLightSource;
