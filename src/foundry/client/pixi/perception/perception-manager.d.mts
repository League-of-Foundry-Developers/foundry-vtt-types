export {};

declare global {
  interface PerceptionManagerFlags {
    /**
     * Re-initialize the entire lighting configuration. An aggregate behavior
     * which does no work directly but propagates to set several other flags.
     */
    initializeLighting: boolean;

    /** Re-initialize the entire vision configuration. See {@link CanvasVisibility#initializeSources}. */
    initializeVision: boolean;

    /** Re-initialize the entire vision modes. See {@link CanvasVisibility#initializeVisionMode}. */
    initializeVisionModes: boolean;

    /** Re-initialize the entire ambient sound configuration. See {@link SoundsLayer#initializeSources}. */
    initializeSounds: boolean;

    /** Recompute intersections between all registered edges. See {@link CanvasEdges#refresh}. */
    refreshEdges: boolean;

    /** Refresh the rendered appearance of lighting */
    refreshLighting: boolean;

    /** Update the configuration of light sources */
    refreshLightSources: boolean;

    /** Refresh occlusion */
    refreshOcclusion: boolean;

    /** Refresh the contents of the PrimaryCanvasGroup mesh */
    refreshPrimary: boolean;

    /** Refresh the audio state of ambient sounds */
    refreshSounds: boolean;

    /** Refresh the rendered appearance of vision */
    refreshVision: boolean;

    /** Update the configuration of vision sources */
    refreshVisionSources: boolean;

    /** Apply a fade duration to sound refresh workflow */
    soundFadeDuration: boolean;
  }

  /**
   * A helper class which manages the refresh workflow for perception layers on the canvas.
   * This controls the logic which batches multiple requested updates to minimize the amount of work required.
   * A singleton instance is available as {@link Canvas#perception}.
   */
  class PerceptionManager extends RenderFlagsMixin(Object) {
    static RENDER_FLAGS: {
      /** @defaultValue `{}` */
      refreshEdges: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{propagate: ["refreshLighting", "refreshVision"]}` */
      initializeLighting: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{propagate: ["refreshLighting", "refreshVision", "refreshEdges"]}` */
      initializeDarknessSources: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{propagate: ["refreshLighting", "refreshVision"]}` */
      initializeLightSources: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{propagate: ["refreshLightSources"]}` */
      refreshLighting: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{}` */
      refreshLightSources: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{propagate: ["refreshVisionSources", "refreshLighting", "refreshPrimary"]}` */
      initializeVisionModes: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{propagate: ["refreshVision", "refreshTiles", "refreshLighting", "refreshLightSources", "refreshPrimary"]}` */
      initializeVision: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{propagate: ["refreshVisionSources", "refreshOcclusionMask"]}` */
      refreshVision: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{}` */
      refreshVisionSources: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{}` */
      refreshPrimary: RenderFlag<PerceptionManagerFlags>;

      /** `{propagate: ["refreshOcclusionStates", "refreshOcclusionMask"]}` */
      refreshOcclusion: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{}` */
      refreshOcclusionStates: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{}` */
      refreshOcclusionMask: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{ propagate: ["refreshSounds"] }` */
      initializeSounds: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{}` */
      refreshSounds: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{}` */
      soundFadeDuration: RenderFlag<PerceptionManagerFlags>;

      /** @deprecated since v12, will be removed in v14 */
      refreshTiles: RenderFlag<PerceptionManagerFlags>;

      /** @deprecated since v12, will be removed in v14 */
      identifyInteriorWalls: RenderFlag<PerceptionManagerFlags>;

      /** @deprecated since v12, will be removed in v14 */
      forceUpdateFog: RenderFlag<PerceptionManagerFlags>;
    };

    static RENDER_FLAG_PRIORITY: "PERCEPTION";

    applyRenderFlags(): void;

    /**
     * Update perception manager flags which configure which behaviors occur on the next frame render.
     * @param flags - Flag values (true) to assign where the keys belong to PerceptionManager.FLAGS
     */
    update(flags: Partial<PerceptionManagerFlags>): void;

    /**
     * A helper function to perform an immediate initialization plus incremental refresh.
     */
    initialize(): ReturnType<this["update"]>;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks `"PerceptionManager#refresh is deprecated in favor of assigning granular "refresh flags"`
     */
    refresh(): ReturnType<this["update"]>;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks forceUpdateFog flag is now obsolete and has no replacement. The fog is now always updated when the visibility is refreshed
     */
    static forceUpdateFog(): void;
  }

  namespace PerceptionManager {
    /** @deprecated Old flag structure */
    interface Options {
      lighting: {
        initialize: boolean;
        refresh: boolean;
      };
      sight: {
        initialize: boolean;
        refresh: boolean;
        skipUpdateFog: boolean;
        forceUpdateFog: boolean;
      };
      sounds: {
        initialize: boolean;
        refresh: boolean;
        fade: boolean;
      };
      foreground: {
        refresh: boolean;
      };
    }
  }
}
