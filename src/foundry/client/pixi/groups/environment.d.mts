import type { InexactPartial } from "../../../../types/utils.d.mts";

export {};

// TODO: Remove when this is typed as part of #2674
type SceneEnvironmentData = unknown;

declare global {
  /**
   * A container group which contains the primary canvas group and the effects canvas group.
   */
  class EnvironmentCanvasGroup extends CanvasGroupMixin(PIXI.Container) {
    /**
     * The global light source attached to the environment
     */
    globalLightSource(): foundry.canvas.sources.GlobalLightSource;

    /**
     * @defaultValue `"environment"`
     */
    static override groupName: string;

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

    override _draw(options: InexactPartial<Record<string, unknown>>): Promise<void>;

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
    interface InitializeConfig {
      /** The background canvas color */
      backgroundColor: ColorSource;
      /** The brightest ambient color */
      brightestColor: ColorSource;
      /** The color of darkness */
      darknessColor: ColorSource;
      /** The ambient daylight color */
      daylightColor: ColorSource;
      /** The color applied to explored areas */
      fogExploredColor: ColorSource;
      /** The color applied to unexplored areas */
      fogUnexploredColor: ColorSource;
      /** The scene environment data */
      environment: SceneEnvironmentData;
    }
  }
}
