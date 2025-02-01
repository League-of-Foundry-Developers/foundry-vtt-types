import type { FixedInstanceType, HandleEmptyObject, InexactPartial, NullishProps } from "fvtt-types/utils";
import type { SceneEnvironmentData } from "../../../common/documents/_types.d.mts";

declare global {
  /**
   * A container group which contains the primary canvas group and the effects canvas group.
   */
  class EnvironmentCanvasGroup<
    DrawOptions extends EnvironmentCanvasGroup.DrawOptions = EnvironmentCanvasGroup.DrawOptions,
    TearDownOptions extends EnvironmentCanvasGroup.TearDownOptions = EnvironmentCanvasGroup.TearDownOptions,
  > extends CanvasGroupMixin<typeof PIXI.Container, "environment">(PIXI.Container)<DrawOptions, TearDownOptions> {
    /**
     * The global light source attached to the environment
     * @remarks This is `defineProperty`'d as non-writable and non-configurable at construction
     */
    readonly globalLightSource: FixedInstanceType<(typeof CONFIG.Canvas)["globalLightSourceClass"]>;

    /**
     * Should this group tear down its non-layer children?
     * @defaultValue `false`
     */
    static override tearDownChildren: boolean;

    /**
     * Colors exposed by the manager.
     * @remarks Properties here are only `undefined` prior to `#initialize`ation
     */
    colors: EnvironmentCanvasGroup.Colors;

    /**
     * Weights used by the manager to compute colors.
     * @remarks Properties here are only `undefined` prior to `#initialize`ation
     */
    weights: EnvironmentCanvasGroup.Weights;

    /**
     * Get the darkness level of this scene.
     */
    get darknessLevel(): number;

    protected override _draw(options: HandleEmptyObject<DrawOptions>): Promise<void>;

    /**
     * Initialize the scene environment options.
     * @remarks `@fires PIXI.FederatedEvent type: "darknessChange" - event: {environmentData: {darknessLevel, priorDarknessLevel}}`
     */
    initialize(config?: EnvironmentCanvasGroup.InitializeOptions): void;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"EnvironmentCanvasGroup#darknessPenalty is deprecated without replacement. The darkness penalty is no longer applied on light and vision sources."`
     */
    get darknessPenalty(): 0;
  }

  namespace EnvironmentCanvasGroup {
    interface Any extends AnyEnvironmentCanvasGroup {}
    type AnyConstructor = typeof AnyEnvironmentCanvasGroup;

    interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

    interface TearDownOptions extends CanvasGroupMixin.TearDownOptions {}

    type ColorKeys =
      | "darkness"
      | "halfdark"
      | "background"
      | "dim"
      | "bright"
      | "ambientBrightest"
      | "ambientDaylight"
      | "ambientDarkness"
      | "sceneBackground"
      | "fogExplored"
      | "fogUnexplored";

    interface Colors extends Record<EnvironmentCanvasGroup.ColorKeys, Color | undefined> {}

    type WeightKeys = "dark" | "halfdark" | "dim" | "bright";

    interface Weights extends Record<EnvironmentCanvasGroup.WeightKeys, number | undefined> {}

    /** @internal */
    type _InitializeOptions = NullishProps<{
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
       * @deprecated since v12 until v14
       * @remarks "config.darknessLevel parameter into EnvironmentCanvasGroup#initialize is deprecated.
       * You should pass the darkness level into config.environment.darknessLevel"
       * @privateRemarks [sic]
       */
      darknessLevel: number;
    }> &
      InexactPartial<{
        /**
         * The scene environment data
         * @defaultValue `{}`
         * @remarks Can't be `null` as it only has a parameter default and has properties accessed
         */
        environment: NullishProps<SceneEnvironmentData>;
      }>;

    interface InitializeOptions extends _InitializeOptions {}
  }
}

declare abstract class AnyEnvironmentCanvasGroup extends EnvironmentCanvasGroup {
  constructor(arg0: never, ...args: never[]);
}
