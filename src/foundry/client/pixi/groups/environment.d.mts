import type { HandleEmptyObject, NullishProps } from "../../../../utils/index.d.mts";
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
     */
    readonly globalLightSource: InstanceType<(typeof CONFIG.Canvas)["globalLightSourceClass"]>;

    /**
     * @defaultValue `false`
     */
    static override tearDownChildren: boolean;

    /**
     * Colors exposed by the manager.
     */
    colors: Record<string, Color | undefined>;

    /**
     * Weights used by the manager to compute colors.
     */
    weights: Record<string, number | undefined>;

    /**
     * Get the darkness level of this scene.
     */
    get darknessLevel(): number;

    protected override _draw(options: HandleEmptyObject<DrawOptions>): Promise<void>;

    /**
     * Initialize the scene environment options.
     * @remarks `@fires PIXI.FederatedEvent type: "darknessChange" - event: {environmentData: {darknessLevel, priorDarknessLevel}}`
     * @remarks Can't be NullishProps because a default for `environment` is only provided by `{environment={}}`,
     */
    initialize(config?: EnvironmentCanvasGroup.InitializeOptions): void;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"EnvironmentCanvasGroup#darknessPenalty is deprecated without replacement. The darkness penalty is no longer applied on light and vision sources."`
     */
    get darknessPenalty(): 0;
  }

  namespace EnvironmentCanvasGroup {
    type Any = AnyEnvironmentCanvasGroup;
    type AnyConstructor = typeof AnyEnvironmentCanvasGroup;

    interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

    interface TearDownOptions extends CanvasGroupMixin.TeardownOptions {}

    /**
     * @remarks This is separated like this because `#initalize` won't accept `environment: null` without throwing
     */
    type InitializeOptions = NullishProps<{
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
    }> & {
      /** The scene environment data */
      environment?: NullishProps<SceneEnvironmentData> | undefined;
    };
  }
}

declare abstract class AnyEnvironmentCanvasGroup extends EnvironmentCanvasGroup {
  constructor(arg0: never, ...args: never[]);
}
