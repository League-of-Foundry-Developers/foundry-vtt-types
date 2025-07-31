import type { FixedInstanceType, HandleEmptyObject, Identity, InexactPartial } from "#utils";
import type { CanvasGroupMixin } from "#client/canvas/groups/_module.d.mts";
import type { GlobalLightSource } from "#client/canvas/sources/_module.d.mts";
// Hooks only used for links
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AllHooks } from "#client/hooks.mjs";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasGroupConfig {
      EnvironmentCanvasGroup: EnvironmentCanvasGroup.Implementation;
    }
  }
}

/**
 * A container group which contains the primary canvas group and the effects canvas group.
 */
declare class EnvironmentCanvasGroup<
  DrawOptions extends EnvironmentCanvasGroup.DrawOptions = EnvironmentCanvasGroup.DrawOptions,
  TearDownOptions extends EnvironmentCanvasGroup.TearDownOptions = EnvironmentCanvasGroup.TearDownOptions,
> extends CanvasGroupMixin<typeof PIXI.Container, "environment">(PIXI.Container)<DrawOptions, TearDownOptions> {
  // static override groupName is handled by the CanvasGroupMixin type

  /** @defaultValue `"static"` */
  override eventMode: PIXI.EventMode;

  /**
   * The global light source attached to the environment
   * @remarks This is `defineProperty`'d at construction with `configurable: false, enumerable: true, writable: false`
   *
   * Is {@linkcode GlobalLightSource.initialize | initialized} as part of {@linkcode initialize | GlobalLightSource#initialize}
   */
  readonly globalLightSource: GlobalLightSource.Implementation;

  /**
   * Should this group tear down its non-layer children?
   * @defaultValue `false`
   */
  static override tearDownChildren: boolean;

  /**
   * Colors exposed by the manager.
   * @remarks Properties here are only `undefined` prior to {@linkcode EnvironmentCanvasGroup.initialize | initialization}
   */
  colors: EnvironmentCanvasGroup.Colors;

  /**
   * Weights used by the manager to compute colors.
   * @remarks Properties here are only `undefined` prior to {@linkcode EnvironmentCanvasGroup.initialize | initialization}
   */
  weights: EnvironmentCanvasGroup.Weights;

  /**
   * Get the darkness level of this scene.
   * @remarks Only `undefined` prior to initialization
   */
  get darknessLevel(): number | undefined;

  protected override _draw(options: HandleEmptyObject<DrawOptions>): Promise<void>;

  /**
   * Initialize the scene environment options.
   * @remarks Fires two hooks ({@linkcode AllHooks.configureCanvasEnvironment | configureCanvasEnvironment},
   * {@linkcode AllHooks.initializeCanvasEnvironment | initializeCanvasEnvironment}) and dispatches a
   * {@linkcode Canvas.Event.DarknessChange | DarknessChange} PIXI event.
   */
  initialize(config?: EnvironmentCanvasGroup.Config): void;

  /**
   * @deprecated "`EnvironmentCanvasGroup#darknessPenalty` is deprecated without replacement. The darkness penalty is no longer applied on light and vision sources." (since v12, will be removed in v14)
   */
  get darknessPenalty(): 0;

  #EnvironmentCanvasGroup: true;
}

declare namespace EnvironmentCanvasGroup {
  interface Any extends AnyEnvironmentCanvasGroup {}
  interface AnyConstructor extends Identity<typeof AnyEnvironmentCanvasGroup> {}

  interface ImplementationClass extends Identity<typeof CONFIG.Canvas.groups.environment.groupClass> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

  interface TearDownOptions extends CanvasGroupMixin.TearDownOptions {}

  /** @privateRemarks Properties sorted in order of initialization */
  interface Colors {
    /**
     * @remarks Only `undefined` prior to {@linkcode EnvironmentCanvasGroup.initialize | initialization}.
     *
     * Once initialized, the default value is {@linkcode CONFIG.Canvas.darknessColor}`?? EnvironmentCanvasGroup.#fallbackColors.darknessColor`.
     * Inexplicably, Foundry provides different values for these, so were you to `delete CONFIG.Canvas.darknessColor` for whatever reason, the
     * default would be `0x242448` instead of `0x303030`.
     */
    ambientDarkness: Color | undefined;

    /**
     * @remarks Only `undefined` prior to {@linkcode EnvironmentCanvasGroup.initialize | initialization}.
     *
     * Once initialized, the default value if the current scene has token vision enabled is {@linkcode CONFIG.Canvas.daylightColor}
     * `?? EnvironmentCanvasGroup.#fallbackColors.daylightColor`, both of which are `0xEEEEE`. If token vision is disabled, then
     * the default is `0xFFFFFF`
     *
     */
    ambientDaylight: Color | undefined;

    /**
     * @remarks Only `undefined` prior to {@linkcode EnvironmentCanvasGroup.initialize | initialization}.
     *
     * Once initialized, the default value  is {@linkcode CONFIG.Canvas.brightestColor}` ?? EnvironmentCanvasGroup.#fallbackColors.daylightColor`,
     * both of which are `0xFFFFFF`.
     */
    ambientBrightest: Color | undefined;

    /**
     * @remarks Only `undefined` prior to {@linkcode EnvironmentCanvasGroup.initialize | initialization}.
     *
     * Computed by {@linkcode Color.mix | mixing} {@linkcode ambientDarkness} with {@linkcode ambientDaylight} using a
     * weight of `1.0 - `{@linkcode EnvironmentCanvasGroup.darknessLevel | darknessLevel}
     */
    background: Color | undefined;

    /**
     * @remarks Only `undefined` prior to {@linkcode EnvironmentCanvasGroup.initialize | initialization}.
     *
     * Computed by {@linkcode Color.mix | mixing} {@linkcode ambientDarkness} with {@linkcode background} using a
     * weight of {@linkcode EnvironmentCanvasGroup.Weights.dark | weights.dark}
     */
    darkness: Color | undefined;

    /**
     * @remarks Only `undefined` prior to {@linkcode EnvironmentCanvasGroup.initialize | initialization}.
     *
     * Computed by {@linkcode Color.mix | mixing} {@linkcode darkness} with {@linkcode background} using a
     * weight of {@linkcode EnvironmentCanvasGroup.Weights.halfdark | weights.halfdark}
     */
    halfdark: Color | undefined;

    /**
     * @remarks Only `undefined` prior to {@linkcode EnvironmentCanvasGroup.initialize | initialization}.
     *
     * Computed by {@linkcode Color.mix | mixing} {@linkcode background} with {@linkcode ambientBrightest} using a
     * weight of {@linkcode EnvironmentCanvasGroup.Weights.bright | weights.bright}
     */
    bright: Color | undefined;

    /**
     * @remarks Only `undefined` prior to {@linkcode EnvironmentCanvasGroup.initialize | initialization}.
     *
     * Computed by {@linkcode Color.mix | mixing} {@linkcode background} with {@linkcode bright} using a
     * weight of {@linkcode EnvironmentCanvasGroup.Weights.dim | weights.dim}
     */
    dim: Color | undefined;

    /**
     * @remarks Only `undefined` prior to {@linkcode EnvironmentCanvasGroup.initialize | initialization}.
     *
     * Computed by {@linkcode Color.multiply | multiplying} {@linkcode background} by {@linkcode Config.fogUnexploredColor | fogUnexploredColor}
     * `?? `{@linkcode Scene.FogColorData.unexplored | canvas.scene.fog.colors.unexplored}` ?? `{@linkcode CONFIG.Canvas.unexploredColor}
     * `?? EnvironmentCanvasGroup.#fallbackColors.fogUnexplored` (that last being `0x000000`)
     */
    fogUnexplored: Color | undefined;

    /**
     * @remarks Only `undefined` prior to {@linkcode EnvironmentCanvasGroup.initialize | initialization}.
     *
     * Computed by {@linkcode Color.multiply | multiplying} {@linkcode background} by {@linkcode Config.fogExploredColor | fogExploredColor}
     * `?? `{@linkcode Scene.FogColorData.explored | canvas.scene.fog.colors.explored}` ?? `{@linkcode CONFIG.Canvas.exploredColor}
     * `?? EnvironmentCanvasGroup.#fallbackColors.fogExplored` (that last being `0x000000`)
     */
    fogExplored: Color | undefined;

    /**
     * @remarks Only `undefined` prior to {@linkcode EnvironmentCanvasGroup.initialize | initialization}.
     *
     * Once initialized, the default is {@linkcode Config.backgroundColor | backgroundColor}` ?? `{@linkcode Scene.backgroundColor | canvas.scene.backgroundColor}
     * `?? EnvironmentCanvasGroup.#fallbackColors.backgroundColor` (that last being `0x999999`, matching the field's `initial`)
     */
    sceneBackground: Color | undefined;

    /**
     * @remarks Not set to `undefined` at construction, unlike the other properties. Only exists after {@linkcode EnvironmentCanvasGroup.initialize | initialization}.
     *
     * Computed by {@linkcode Color.multiply | multiplying} {@linkcode sceneBackground} by {@linkcode background}
     */
    rendererBackground?: Color | undefined;
  }

  interface Weights {
    /**
     * @remarks Only `undefined` prior to {@linkcode EnvironmentCanvasGroup.initialize | initialization}.
     *
     * Once initialized, the default is {@linkcode CONFIG.Canvas.lightLevels.dark}`?? 0`, mostly. The `??` left operand is the entire `CONFIG.Canvas.lightLevels` object,
     * and the default is by `Object.assign`.
     */
    dark: number | undefined;

    /**
     * @remarks Only `undefined` prior to {@linkcode EnvironmentCanvasGroup.initialize | initialization}.
     *
     * Once initialized, the default is {@linkcode CONFIG.Canvas.lightLevels.halfdark}`?? 0.5`, mostly. The `??` left operand is the entire `CONFIG.Canvas.lightLevels` object,
     * and the default is by `Object.assign`.
     */
    halfdark: number | undefined;

    /**
     * @remarks Only `undefined` prior to {@linkcode EnvironmentCanvasGroup.initialize | initialization}.
     *
     * Once initialized, the default is {@linkcode CONFIG.Canvas.lightLevels.halfdark}`?? 0.25`, mostly. The `??` left operand is the entire `CONFIG.Canvas.lightLevels` object,
     * and the default is by `Object.assign`.
     */
    dim: number | undefined;

    /**
     * @remarks Only `undefined` prior to {@linkcode EnvironmentCanvasGroup.initialize | initialization}.
     *
     * Once initialized, the default is {@linkcode CONFIG.Canvas.lightLevels.halfdark}`?? 1`, mostly. The `??` left operand is the entire `CONFIG.Canvas.lightLevels` object,
     * and the default is by `Object.assign`.
     */
    bright: number | undefined;
  }

  /** @internal */
  type _Config = InexactPartial<{
    /** The background canvas color */
    backgroundColor: Color.Source;

    /** The brightest ambient color */
    brightestColor: Color.Source;

    /** The color of darkness */
    darknessColor: Color.Source;

    /** The ambient daylight color */
    daylightColor: Color.Source;

    /** The color applied to explored areas */
    fogExploredColor: Color.Source;

    /** The color applied to unexplored areas */
    fogUnexploredColor: Color.Source;

    /**
     * The scene environment data
     * @defaultValue `{}`
     * @remarks Default applied during destructuring assignment inside {@linkcode EnvironmentCanvasGroup.initialize | #initialize}
     */
    environment: InexactPartial<Scene.EnvironmentData>;

    /**
     * @deprecated "`config.darknessLevel` parameter into {@linkcode EnvironmentCanvasGroup.initialize | EnvironmentCanvasGroup#initialize} is deprecated.
     * You should pass the darkness level into {@linkcode this.environment | config.environment.darknessLevel}" (since v12 until v14)
     */
    darknessLevel: number;
  }>;

  interface Config extends _Config {}

  /** @deprecated Use {@linkcode EnvironmentCanvasGroup.Config} instead */
  interface InitializeOptions extends Config {}
}

export default EnvironmentCanvasGroup;

declare abstract class AnyEnvironmentCanvasGroup extends EnvironmentCanvasGroup {
  constructor(...args: never);
}
