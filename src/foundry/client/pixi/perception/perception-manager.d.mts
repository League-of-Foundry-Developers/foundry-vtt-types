export {};

declare global {
  /**
   * @deprecated {@link PerceptionManager.Flags | `PerceptionManager.Flags`}
   */
  type PerceptionManagerFlags = PerceptionManager.Flags;

  /**
   * A helper class which manages the refresh workflow for perception layers on the canvas.
   * This controls the logic which batches multiple requested updates to minimize the amount of work required.
   * A singleton instance is available as {@link Canvas.perception | `Canvas#perception`}.
   */
  class PerceptionManager extends RenderFlagsMixin(Object) {
    static RENDER_FLAGS: {
      /** @defaultValue `{}` */
      refreshEdges: RenderFlag<PerceptionManager.Flags>;

      /** @defaultValue `{propagate: ["refreshLighting", "refreshVision"]}` */
      initializeLighting: RenderFlag<PerceptionManager.Flags>;

      /** @defaultValue `{propagate: ["refreshLighting", "refreshVision", "refreshEdges"]}` */
      initializeDarknessSources: RenderFlag<PerceptionManager.Flags>;

      /** @defaultValue `{propagate: ["refreshLighting", "refreshVision"]}` */
      initializeLightSources: RenderFlag<PerceptionManager.Flags>;

      /** @defaultValue `{propagate: ["refreshLightSources"]}` */
      refreshLighting: RenderFlag<PerceptionManager.Flags>;

      /** @defaultValue `{}` */
      refreshLightSources: RenderFlag<PerceptionManager.Flags>;

      /** @defaultValue `{propagate: ["refreshVisionSources", "refreshLighting", "refreshPrimary"]}` */
      initializeVisionModes: RenderFlag<PerceptionManager.Flags>;

      /** @defaultValue `{propagate: ["refreshVision", "refreshTiles", "refreshLighting", "refreshLightSources", "refreshPrimary"]}` */
      initializeVision: RenderFlag<PerceptionManager.Flags>;

      /** @defaultValue `{propagate: ["refreshVisionSources", "refreshOcclusionMask"]}` */
      refreshVision: RenderFlag<PerceptionManager.Flags>;

      /** @defaultValue `{}` */
      refreshVisionSources: RenderFlag<PerceptionManager.Flags>;

      /** @defaultValue `{}` */
      refreshPrimary: RenderFlag<PerceptionManager.Flags>;

      /** `{propagate: ["refreshOcclusionStates", "refreshOcclusionMask"]}` */
      refreshOcclusion: RenderFlag<PerceptionManager.Flags>;

      /** @defaultValue `{}` */
      refreshOcclusionStates: RenderFlag<PerceptionManager.Flags>;

      /** @defaultValue `{}` */
      refreshOcclusionMask: RenderFlag<PerceptionManager.Flags>;

      /** @defaultValue `{ propagate: ["refreshSounds"] }` */
      initializeSounds: RenderFlag<PerceptionManager.Flags>;

      /** @defaultValue `{}` */
      refreshSounds: RenderFlag<PerceptionManager.Flags>;

      /** @defaultValue `{}` */
      soundFadeDuration: RenderFlag<PerceptionManager.Flags>;

      /** @deprecated since v12, will be removed in v14 */
      refreshTiles: RenderFlag<PerceptionManager.Flags>;

      /** @deprecated since v12, will be removed in v14 */
      identifyInteriorWalls: RenderFlag<PerceptionManager.Flags>;

      /** @deprecated since v12, will be removed in v14 */
      forceUpdateFog: RenderFlag<PerceptionManager.Flags>;
    };

    static RENDER_FLAG_PRIORITY: "PERCEPTION";

    applyRenderFlags(): void;

    /**
     * Update perception manager flags which configure which behaviors occur on the next frame render.
     * @param flags - Flag values (true) to assign where the keys belong to PerceptionManager.FLAGS
     */
    update(flags: Partial<PerceptionManager.Flags>): void;

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
    interface Flags {
      /**
       * Re-initialize the entire lighting configuration. An aggregate behavior
       * which does no work directly but propagates to set several other flags.
       */
      initializeLighting: boolean;

      /** Re-initialize the entire vision configuration. See {@link CanvasVisibility.initializeSources | `CanvasVisibility#initializeSources`}. */
      initializeVision: boolean;

      /** Re-initialize the entire vision modes. See {@link CanvasVisibility.initializeVisionMode | `CanvasVisibility#initializeVisionMode`}. */
      initializeVisionModes: boolean;

      /** Re-initialize the entire ambient sound configuration. See {@link SoundsLayer.initializeSources | `SoundsLayer#initializeSources`}. */
      initializeSounds: boolean;

      /** Recompute intersections between all registered edges. See {@link CanvasEdges.refresh | `CanvasEdges#refresh`}. */
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
