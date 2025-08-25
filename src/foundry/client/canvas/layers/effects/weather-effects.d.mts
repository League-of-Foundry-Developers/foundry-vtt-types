import type { AnyObject, FixedInstanceType, Identity, InexactPartial } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { AbstractWeatherShader, WeatherShaderEffect } from "#client/canvas/rendering/shaders/_module.d.mts";
import type { WeatherOcclusionMaskFilter } from "#client/canvas/rendering/filters/_module.d.mts";
import type {
  FullCanvasObjectMixin,
  ParticleEffect,
  AutumnLeavesWeatherEffect,
} from "#client/canvas/containers/_module.d.mts";
import type { CanvasLayer } from "../_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasLayerConfig {
      WeatherEffects: WeatherEffects.Implementation;
    }
  }
}

/**
 * A CanvasLayer for displaying visual effects like weather, transitions, flashes, or more
 */
declare class WeatherEffects extends FullCanvasObjectMixin(CanvasLayer) {
  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior, due to `layerOptions.name` being `"effects"`
   */
  static override get instance(): Canvas["effects"];

  /** @defaultValue `true` */
  override sortableChildren: boolean;

  /** @defaultValue `"none"` */
  override eventMode: PIXI.EventMode;

  /**
   * The container in which effects are added.
   * @remarks Only `undefined` prior to first draw
   */
  weatherEffects: PIXI.Container | undefined;

  /**
   * The container in which suppression meshed are added.
   * @remarks Only `undefined` prior to first draw
   */
  suppression: PIXI.Container | undefined;

  /** @remarks Real override to workaround {@linkcode WeatherEffects#name} being `"FullCanvasObject"` */
  override get hookName(): string;

  /**
   * @defaultValue `foundry.utils.mergeObject(super.layerOptions, { name: "effects" })`
   */
  static override get layerOptions(): WeatherEffects.LayerOptions;

  /** @privateRemarks Types-only override to sync with static `layerOptions` */
  override options: WeatherEffects.LayerOptions;

  /**
   * Array of weather effects linked to this weather container.
   */
  effects: Map<string, Array<ParticleEffect | WeatherShaderEffect>>;

  /**
   * A default configuration of the terrain mask that is automatically applied to any shader-based weather effects.
   * This configuration is automatically passed to WeatherShaderEffect#configureTerrainMask upon construction.
   *
   * @privateRemarks In practice this is always `undefined`, as it is not initialized to a value and never gets set anywhere in core in v12.331
   */
  terrainMaskConfig: WeatherEffects.MaskConfiguration | undefined;

  /**
   * A default configuration of the terrain mask that is automatically applied to any shader-based weather effects.
   * This configuration is automatically passed to WeatherShaderEffect#configureTerrainMask upon construction.
   *
   * @privateRemarks In practice this is always `undefined`, as it is not initialized to a value and never gets set anywhere in core in v12.331.
   * Passed as `this.occlusionMaskConfig || { enabled: true }` where it is used.
   */
  occlusionMaskConfig: WeatherEffects.MaskConfiguration | undefined;

  /**
   * The inverse occlusion mask filter bound to this container.
   */
  occlusionFilter: WeatherOcclusionMaskFilter;

  /**
   * The elevation of this object.
   * @defaultValue `Infinity`
   * @remarks
   * @throws If `NaN` is passed to the setter
   */
  get elevation(): number;

  set elevation(value);

  /**
   * A key which resolves ties amongst objects at the same elevation of different layers.
   * @defaultValue {@linkcode foundry.canvas.groups.PrimaryCanvasGroup.SORT_LAYERS.WEATHER | PrimaryCanvasGroup.SORT_LAYERS.WEATHER}
   * @remarks
   * @throws If `NaN` is passed to the setter
   */
  get sortLayer(): number;

  set sortLayer(value);

  /**
   * A key which resolves ties amongst objects at the same elevation within the same layer.
   * @defaultValue `0`
   * @remarks
   * @throws If `NaN` is passed to the setter
   */
  get sort(): number;

  set sort(value);

  /**
   * A key which resolves ties amongst objects at the same elevation within the same layer and same sort.
   * @remarks
   * @throws If `NaN` is passed to the setter
   */
  get zIndex(): number;

  set zIndex(value);

  protected override _draw(options: AnyObject): Promise<void>;

  protected override _tearDown(options: AnyObject): Promise<void>;

  /**
   * Initialize the weather container from a weather config object.
   * @param weatherEffectsConfig - Weather config object (or null/undefined to clear the container).
   */
  initializeEffects(weatherEffectsConfig?: WeatherEffects.AmbienceConfiguration | null): void;

  /**
   * Clear the weather container.
   * @remarks Just calls {@linkcode WeatherEffects.initializeEffects | #initializeEffects(null)}
   */
  clearEffects(): void;

  /**
   * Set the occlusion uniforms for this weather shader.
   * @param context - The shader context
   * @param config  - Occlusion masking options
   */
  static configureOcclusionMask(context: PIXI.Shader, config?: WeatherEffects.MaskConfiguration): void;

  /**
   * Set the terrain uniforms for this weather shader.
   * @param context - The shader context
   * @param config  - Terrain masking options
   */
  static configureTerrainMask(context: PIXI.Shader, config?: WeatherEffects.MaskConfiguration): void;

  #WeatherEffects: true;
}

declare namespace WeatherEffects {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyWeatherEffects {}
    interface AnyConstructor extends Identity<typeof AnyWeatherEffects> {}
  }

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["layers"]["weather"]["layerClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface LayerOptions extends CanvasLayer.LayerOptions {
    /** @remarks This causes {@linkcode WeatherEffect.instance} to be the {@linkcode foundry.canvas.groups.EffectsCanvasGroup.Implementation} */
    name: "effects";
  }

  /**
   * @internal
   * @privateRemarks If {@linkcode WeatherEffects.occlusionMaskConfig | WeatherEffects#occlusionMaskConfig} or
   * {@linkcode WeatherEFfects.terrainMaskConfig | #terrainMaskConfig} were *ever* set, i.e, if this interface
   * was ever used for a 'stored' type, it would have a base interface with no optionality/nullishness applied.
   */
  type _MaskConfiguration = InexactPartial<{
    /**
     * Enable or disable this mask.
     * @defaultValue `false`
     */
    enabled: boolean;

    /**
     * If the mask should be reversed.
     * @defaultValue `false`
     */
    reverse: boolean;

    /**
     * An RGBA array of channel weights applied to the mask texture.
     * @defaultValue `[0, 0, 1, 0]`
     */
    channelWeights: Color.RGBAColorVector;

    /**
     * A texture which defines the mask region.
     * @remarks If not provided, the shader being modified will have its `uniforms.useTerrain` or `.useOcclusion` set `false`
     */
    texture: PIXI.Texture | PIXI.RenderTexture;
  }>;

  interface MaskConfiguration extends _MaskConfiguration {}

  /** @internal */
  type _BlendMode = InexactPartial<{
    /**
     * @defaultValue {@linkcode PIXI.BLEND_MODES.NORMAL}
     * @remarks The blend mode applied to the `WeatherEffects#occlusionFilter`
     */
    blendMode: PIXI.BLEND_MODES;
  }>;

  interface AmbienceFilterConfiguration extends _AmbienceConfiguration {
    /**
     * Enable a layer-wide occlusion filter unless it is explicitly disabled by the effect configuration
     * @remarks The above should for clarity say `ambience configuration` instead of `effect configuration`;
     * Individual effects of this ambience can enable occlusion on themselves if this is set false, but
     * cannot disable layer-wide occlusion if this is `true`
     *
     * @privateRemarks Checked for `!== false`, so allowing nullish values that get handled as `true` would be confusing
     */
    enabled: boolean;
  }

  /** @internal */
  type _CommonEffectConfiguration = InexactPartial<{
    /**
     * @defaultValue {@linkcode CONST.CANVAS_PERFORMANCE_MODES.LOW}
     * @remarks The minimum required performance level to render this effect
     */
    performanceLevel: CONST.CANVAS_PERFORMANCE_MODES;

    /**
     * @defaultValue The index of this effect in its array
     * @remarks Applied to the constructed `effectClass`. None of the effects in core ambience definitions provide one.
     */
    zIndex: number;

    /**
     * @defaultValue {@linkcode PIXI.BLEND_MODES.NORMAL}
     * @remarks Applied to the constructed `effectClass`
     */
    blendMode: PIXI.BLEND_MODES;
  }>;

  interface ParticleEffectConfiguration extends _CommonEffectConfiguration {
    id: string;

    /** @remarks `typeof` because it's instantiated via `new` in `WeatherEffects##constructEffects` */
    effectClass: typeof ParticleEffect;

    /**
     * @remarks Despite the corresponding {@linkcode ParticleEffect | ParticleEffect#constructor} parameter being `={}`, construction will
     * throw if this isn't a non-empty object.
     */
    config: PIXI.particles.EmitterConfigV3;
  }

  interface SpecificallyAutumnLeavesConfiguration {
    id: string;

    /** @remarks `typeof` because it's instantiated via `new` in `WeatherEffects##constructEffects` */
    effectClass: typeof AutumnLeavesWeatherEffect;

    /**
     * @remarks {@linkcode AutumnLeavesWeatherEffect} overrides {@linkcode ParticleEffect.getParticleEmitters | ParticleEffect#getParticleEmitters}
     * -- the method that would throw when passed an empty config -- to not take any parameters and always use {@linkcode AutumnLeavesWeatherEffect.LEAF_CONFIG}
     * instead, making it the exception to {@linkcode ParticleEffect} configs to provide a valid {@linkcode PIXI.particles.EmitterConfigV3}
     */
    config?: never;
  }

  interface WeatherShaderEffectConfiguration extends _CommonEffectConfiguration {
    id: string;

    /** @remarks `typeof` because it's instantiated via `new` in `WeatherEffects##constructEffects` */
    effectClass: typeof WeatherShaderEffect;

    shaderClass: AbstractWeatherShader.AnyConstructor;

    config?: WeatherShaderEffect.Configuration | undefined;
  }

  type EffectConfiguration =
    | SpecificallyAutumnLeavesConfiguration
    | ParticleEffectConfiguration
    | WeatherShaderEffectConfiguration;

  /** @internal */
  type _AmbienceConfiguration = InexactPartial<{
    filter: AmbienceFilterConfiguration;
  }>;

  interface AmbienceConfiguration extends _AmbienceConfiguration {
    /** @remarks Should match the key for this ambience in the parent object {@linkcode CONFIG.weatherEffects} */
    id: string;

    /** @remarks A localization key to display in the Configure Scene sheet */
    label: string;

    /** @remarks One or more effect definitions */
    effects: EffectConfiguration[];
  }
}

export default WeatherEffects;

declare abstract class AnyWeatherEffects extends WeatherEffects {
  constructor(...args: never);
}
