import type { HandleEmptyObject, Identity, InexactPartial, IntentionalPartial, NullishProps } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { AbstractWeatherShader, WeatherShaderEffect } from "#client/canvas/rendering/shaders/_module.d.mts";
import type { WeatherOcclusionMaskFilter } from "#client/canvas/rendering/filters/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface CanvasLayerConfig {
      // This is commented out because the `hookName` for `WeatherEffects` is currently bugged.
      // See: https://github.com/foundryvtt/foundryvtt/issues/12930
      // WeatherEffects: WeatherEffects.Any;
    }
  }
}

declare global {
  /**
   * A CanvasLayer for displaying visual effects like weather, transitions, flashes, or more
   */
  class WeatherEffects extends FullCanvasObjectMixin(CanvasLayer) {
    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior, due to `layerOptions.name` being `"effects"`
     */
    static get instance(): Canvas["effects"];

    /**
     * @defaultValue `true`
     */
    override sortableChildren: boolean;

    /**
     * @defaultValue `"none"`
     */
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
     * @privateRemarks In practice this is always `undefined`, as it is not initalized to a value and never gets set anywhere in core in v12.331.
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
     * @throws If `NaN` is passed to the setter
     */
    get elevation(): number;

    set elevation(value);

    /**
     * A key which resolves ties amongst objects at the same elevation of different layers.
     * @defaultValue `PrimaryCanvasGroup.SORT_LAYERS.WEATHER`
     * @throws If `NaN` is passed to the setter
     */
    get sortLayer(): number;

    set sortLayer(value);

    /**
     * A key which resolves ties amongst objects at the same elevation within the same layer.
     * @defaultValue `0`
     * @throws If `NaN` is passed to the setter
     */
    get sort(): number;

    set sort(value);

    /**
     * A key which resolves ties amongst objects at the same elevation within the same layer and same sort.
     * @throws If `NaN` is passed to the setter
     */
    get zIndex(): number;

    set zIndex(value);

    protected override _draw(options: HandleEmptyObject<WeatherEffects.DrawOptions>): Promise<void>;

    protected override _tearDown(options: HandleEmptyObject<WeatherEffects.TearDownOptions>): Promise<void>;

    /**
     * Initialize the weather container from a weather config object.
     * @param weatherEffectsConfig - Weather config object (or null/undefined to clear the container).
     */
    initializeEffects(weatherEffectsConfig?: WeatherEffects.AmbienceConfiguration | null): void;

    /**
     * Clear the weather container.
     * @remarks Just calls `initializeEffects(null)`
     */
    clearEffects(): void;

    /**
     * Set the occlusion uniforms for this weather shader.
     * @param context - The shader context
     * @param config  - Occlusion masking options
     */
    static configureOcclusionMask(
      context: PIXI.Shader,
      config?: WeatherEffects.MaskConfiguration, // not:null (destructured)
    ): void;

    /**
     * Set the terrain uniforms for this weather shader.
     * @param context - The shader context
     * @param config  - Terrain masking options
     */
    static configureTerrainMask(
      context: PIXI.Shader,
      config?: WeatherEffects.MaskConfiguration, // not:null (destructured)
    ): void;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks `"The WeatherContainer at canvas.weather.weather is deprecated and combined with the layer itself."`
     */
    get weather(): this;
  }

  namespace WeatherEffects {
    interface Any extends AnyWeatherEffects {}
    interface AnyConstructor extends Identity<typeof AnyWeatherEffects> {}

    interface LayerOptions extends CanvasLayer.LayerOptions {
      /** @remarks This causes `WeatherEffect.instance` to be the `EffectsCanvasGroup` */
      name: "effects";
    }

    interface DrawOptions extends CanvasLayer.DrawOptions {}

    interface TearDownOptions extends CanvasLayer.TearDownOptions {}

    /**
     * @internal
     * @privateRemarks If `WeatherEffects#occlusionMaskConfig` or `#terrainMaskConfig` were *ever* set, i.e
     * if this interface was ever used for more than a parameter type, it would have a base interface with
     * no optionality/nullishness applied. Luckily it's not.
     */
    type _MaskConfiguration = NullishProps<{
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
    }> &
      InexactPartial<{
        /**
         * An RGBA array of channel weights applied to the mask texture.
         * @defaultValue `[0, 0, 1, 0]`
         * @remarks Can't be `null` as it only has a parameter default.
         */
        channelWeights: [r: number, b: number, g: number, a: number];

        /**
         * A texture which defines the mask region.
         * @remarks Can't be `null` because of an `!== undefined` check.
         *
         * If not provided, the shader being modified will have its `uniforms.useTerrain` or `.useOcclusion` set `false`
         */
        texture: PIXI.Texture | PIXI.RenderTexture;
      }>;

    interface MaskConfiguration extends _MaskConfiguration {}

    type AmbienceFilterConfiguration = IntentionalPartial<{
      /**
       * Enable a layer-wide occlusion filter unless it is explicitly disabled by the effect configuration
       * @remarks The above should for clarity say `ambience configuration` instead of `effect configuration`;
       * Individual effects of this ambience can enable occlusion on themselves if this is set false, but
       * cannot disable layer-wide occlusion if this is `true`
       *
       * @privateRemarks Checked for `!== false`, so allowing nullish values that get handled as `true` would be confusing
       */
      enabled: boolean;
    }> &
      NullishProps<{
        /**
         * @defaultValue `PIXI.BLEND_MODES.NORMAL`
         * @remarks The blend mode applied to the `WeatherEffects#occlusionFilter`
         */
        blendMode: PIXI.BLEND_MODES;
      }>;

    /** @internal */
    type _CommonEffectConfiguration = NullishProps<{
      /**
       * @defaultValue `CONST.CANVAS_PERFORMANCE_MODES.LOW`
       * @remarks The minimum required performance level to render this effect
       */
      performanceLevel: CONST.CANVAS_PERFORMANCE_MODES;

      /**
       * @defaultValue The index of this effect in its array
       * @remarks Applied to the constructed `effectClass`. None of the effects in core ambience definitions provide one.
       */
      zIndex: number;

      /**
       * @defaultValue `PIXI.BLEND_MODES.NORMAL`
       * @remarks Applied to the constructed `effectClass`
       */
      blendMode: PIXI.BLEND_MODES;
    }>;

    interface ParticleEffectConfiguration extends _CommonEffectConfiguration {
      id: string;

      effectClass: ParticleEffect.AnyConstructor;

      /**
       * @remarks Despite the corresponding `ParticleEffect#constructor` parameter being `={}`, construction will
       * throw if this isn't a non-empty object, **except** in the case of the only core `extends ParticleEffect`
       * class, {@linkcode AutumnLeavesWeatherEffect}, which overrides the relevant method and always uses its static
       * `LEAF_CONFIG` property instead; accounting for this is the only reason the property is optional
       */
      config: PIXI.particles.EmitterConfigV3;
    }

    interface SpecificallyAutumnLeavesConfiguration {
      id: string;

      effectClass: AutumnLeavesWeatherEffect.AnyConstructor;

      /** @remarks {@linkcode AutumnLeavesWeatherEffect} overrides {@link ParticleEffect.getParticleEmitters | `ParticleEffect#getParticleEmitters`} -- the method that would throw when passed an empty config -- to not take any parameters and always use */
      config?: never;
    }

    interface WeatherShaderEffectConfiguration extends _CommonEffectConfiguration {
      id: string;

      effectClass: WeatherShaderEffect.AnyConstructor;

      shaderClass: AbstractWeatherShader.AnyConstructor;

      /** @remarks Can't be `null` because it gets `Object.entries()`ed with only a parameter default */
      config?: WeatherShaderEffect.Configuration | undefined;
    }

    type EffectConfiguration =
      | SpecificallyAutumnLeavesConfiguration
      | ParticleEffectConfiguration
      | WeatherShaderEffectConfiguration;

    /** @internal */
    type _AmbienceConfiguration = NullishProps<{
      /** @remarks Properties of `filter` are always accessed with optional chaining in v12.331  */
      filter: AmbienceFilterConfiguration;
    }>;

    interface AmbienceConfiguration extends _AmbienceConfiguration {
      /** @remarks Should match the key for this ambience in the parent object (`CONFIG.Canvas.weatherEffects`) */
      id: string;

      /** @remarks A localization key to display in the Configure Scene sheet */
      label: string;

      /** @remarks One or more effect definitions */
      effects: EffectConfiguration[];
    }
  }
}

declare abstract class AnyWeatherEffects extends WeatherEffects {
  constructor(...args: never);
}
