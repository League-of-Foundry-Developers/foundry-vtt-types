import type { NullishProps } from "../../../../utils/index.d.mts";

declare global {
  /**
   * A helper class which manages the refresh workflow for perception layers on the canvas.
   * This controls the logic which batches multiple requested updates to minimize the amount of work required.
   * A singleton instance is available as {@link Canvas#perception}.
   */
  class PerceptionManager extends RenderFlagsMixin(Object) {
    static RENDER_FLAGS: PerceptionManager.RENDER_FLAGS;

    static RENDER_FLAG_PRIORITY: "PERCEPTION";

    applyRenderFlags(): void;

    /**
     * Update perception manager flags which configure which behaviors occur on the next frame render.
     * @param flags - Flag values (true) to assign where the keys belong to PerceptionManager.FLAGS
     */
    update(flags: PerceptionManager.PassableFlags): void;

    /**
     * A helper function to perform an immediate initialization plus incremental refresh.
     */
    initialize(): void;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks "PerceptionManager#refresh is deprecated in favor of assigning granular \"refresh flags\""
     */
    refresh(): void;
  }

  namespace PerceptionManager {
    interface Any extends AnyPerceptionManager {}
    type AnyConstructor = typeof AnyPerceptionManager;

    type PassableFlags = NullishProps<RenderFlags>;

    type RenderFlags = RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS>;

    interface RENDER_FLAGS extends RenderFlagsMixin.RENDER_FLAGS {
      /**
       * Recompute intersections between all registered edges. See {@link CanvasEdges#refresh}.
       * @defaultValue `{}`
       */
      refreshEdges: RenderFlag<PerceptionManager.RenderFlags>;

      /**
       * Re-initialize the entire lighting configuration. An aggregate behavior
       * which does no work directly but propagates to set several other flags.
       * @defaultValue `{ propagate: ["initializeDarknessSources", "initializeLightSources"] }`
       */
      initializeLighting: RenderFlag<PerceptionManager.RenderFlags>;

      /** @defaultValue `{ propagate: ["refreshLighting", "refreshVision", "refreshEdges"] }` */
      initializeDarknessSources: RenderFlag<PerceptionManager.RenderFlags>;

      /** @defaultValue `{ propagate: ["refreshLighting", "refreshVision"] }` */
      initializeLightSources: RenderFlag<PerceptionManager.RenderFlags>;

      /**
       * Refresh the rendered appearance of lighting
       * @defaultValue `{ propagate: ["refreshLightSources"] }`
       */
      refreshLighting: RenderFlag<PerceptionManager.RenderFlags>;

      /**
       * Update the configuration of light sources
       * @defaultValue `{}`
       */
      refreshLightSources: RenderFlag<PerceptionManager.RenderFlags>;

      /**
       * Re-initialize the entire vision modes. See {@link CanvasVisibility#initializeVisionMode}.
       * @defaultValue `{ propagate: ["refreshVisionSources", "refreshLighting", "refreshPrimary"] }`
       */
      initializeVisionModes: RenderFlag<PerceptionManager.RenderFlags>;

      /**
       * Re-initialize the entire vision configuration. See {@link CanvasVisibility#initializeSources}.
       * @defaultValue `{ propagate: ["initializeVisionModes", "refreshVision"] }`
       */
      initializeVision: RenderFlag<PerceptionManager.RenderFlags>;

      /**
       * Refresh the rendered appearance of vision
       * @defaultValue `{ propagate: ["refreshVisionSources", "refreshOcclusionMask"] }`
       */
      refreshVision: RenderFlag<PerceptionManager.RenderFlags>;

      /**
       * Update the configuration of vision sources
       * @defaultValue `{}`
       */
      refreshVisionSources: RenderFlag<PerceptionManager.RenderFlags>;

      /**
       * Refresh the contents of the PrimaryCanvasGroup mesh
       * @defaultValue `{}`
       */
      refreshPrimary: RenderFlag<PerceptionManager.RenderFlags>;

      /**
       * Refresh occlusion
       * @defaultValue `{propagate: ["refreshOcclusionStates", "refreshOcclusionMask"] }`
       */
      refreshOcclusion: RenderFlag<PerceptionManager.RenderFlags>;

      /** @defaultValue `{}` */
      refreshOcclusionStates: RenderFlag<PerceptionManager.RenderFlags>;

      /** @defaultValue `{}` */
      refreshOcclusionMask: RenderFlag<PerceptionManager.RenderFlags>;

      /**
       * Re-initialize the entire ambient sound configuration. See {@link SoundsLayer#initializeSources}.
       * @defaultValue `{ propagate: ["refreshSounds"] }`
       */
      initializeSounds: RenderFlag<PerceptionManager.RenderFlags>;

      /**
       * Refresh the audio state of ambient sounds
       * @defaultValue `{}`
       */
      refreshSounds: RenderFlag<PerceptionManager.RenderFlags>;

      /**
       * Apply a fade duration to sound refresh workflow
       * @defaultValue `{}`
       */
      soundFadeDuration: RenderFlag<PerceptionManager.RenderFlags>;

      /**
       * @defaultValue `{ propagate: ["refreshOcclusion"] }`
       * @deprecated since v12, will be removed in v14
       */
      refreshTiles: RenderFlag<PerceptionManager.RenderFlags>;

      /**
       * @defaultValue `{ propagate: ["initializeLighting", "initializeVision"] }`
       * @deprecated since v12, will be removed in v14
       */
      identifyInteriorWalls: RenderFlag<PerceptionManager.RenderFlags>;

      /**
       * @defaultValue `{ propagate: ["refreshVision"] }`
       * @deprecated since v11, will be removed in v13
       * @remarks In v12 the flag remains, but the static method it would have triggered was removed prematurely (was listed as until v13 in v11)
       */
      forceUpdateFog: RenderFlag<PerceptionManager.RenderFlags>;
    }
  }
}

declare abstract class AnyPerceptionManager extends PerceptionManager {
  constructor(arg0: never, ...args: never[]);
}
