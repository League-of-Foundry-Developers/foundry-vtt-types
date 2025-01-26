import type { InexactPartial } from "fvtt-types/utils";

// TODO: Remove when this is typed as part of #2674
type SceneEnvironmentData = unknown;

declare global {
  /**
   * A container group which contains the primary canvas group and the effects canvas group.
   */
  class EnvironmentCanvasGroup extends CanvasGroupMixin<typeof PIXI.Container, "environment">(PIXI.Container) {
    /**
     * The global light source attached to the environment
     */
    globalLightSource(): foundry.canvas.sources.GlobalLightSource;

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

    protected override _draw(options: CanvasGroupMixin.DrawOptions): Promise<void>;

    /**
     * Initialize the scene environment options.
     * @remarks `@fires PIXI.FederatedEvent type: "darknessChange" - event: {environmentData: {darknessLevel, priorDarknessLevel}}`
     */
    initialize(config: InexactPartial<EnvironmentCanvasGroup.InitializeConfig>): void;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"EnvironmentCanvasGroup#darknessPenalty is deprecated without replacement. The darkness penalty is no longer applied on light and vision sources."`
     */
    get darknessPenalty(): 0;
  }

  namespace EnvironmentCanvasGroup {
    type Any = AnyEnvironmentCanvasGroup;
    type AnyConstructor = typeof AnyEnvironmentCanvasGroup;

    interface InitializeConfig {
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

      /** The scene environment data */
      environment: SceneEnvironmentData;
    }
  }
}

declare abstract class AnyEnvironmentCanvasGroup extends EnvironmentCanvasGroup {
  constructor(arg0: never, ...args: never[]);
}
