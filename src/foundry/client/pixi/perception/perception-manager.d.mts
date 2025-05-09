import type { InterfaceToObject, NullishProps } from "fvtt-types/utils";

declare global {
  /**
   * @deprecated Replaced with {@linkcode PerceptionManager.RenderFlags}
   */
  type PerceptionManagerFlags = PerceptionManager.RenderFlags;

  /**
   * A helper class which manages the refresh workflow for perception layers on the canvas.
   * This controls the logic which batches multiple requested updates to minimize the amount of work required.
   * A singleton instance is available as {@link Canvas.perception | `Canvas#perception`}.
   */
  class PerceptionManager extends RenderFlagsMixin() {
    static RENDER_FLAGS: InterfaceToObject<PerceptionManager.RENDER_FLAGS>;

    static RENDER_FLAG_PRIORITY: "PERCEPTION";

    // Note: This isn't a "real" override but `renderFlags` is set corresponding to the
    // `RENDER_FLAGS` and so it has to be adjusted here.
    renderFlags: RenderFlags<PerceptionManager.RENDER_FLAGS>;

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

    interface RENDER_FLAGS {
      /**
       * Recompute intersections between all registered edges. See {@link CanvasEdges#refresh}.
       * @defaultValue `{}`
       */
      refreshEdges: RenderFlag<this, "refreshEdges">;

      /**
       * Re-initialize the entire lighting configuration. An aggregate behavior
       * which does no work directly but propagates to set several other flags.
       * @defaultValue `{ propagate: ["initializeDarknessSources", "initializeLightSources"] }`
       */
      initializeLighting: RenderFlag<this, "initializeLighting">;

      /** @defaultValue `{ propagate: ["refreshLighting", "refreshVision", "refreshEdges"] }` */
      initializeDarknessSources: RenderFlag<this, "initializeDarknessSources">;

      /** @defaultValue `{ propagate: ["refreshLighting", "refreshVision"] }` */
      initializeLightSources: RenderFlag<this, "initializeLightSources">;

      /**
       * Refresh the rendered appearance of lighting
       * @defaultValue `{ propagate: ["refreshLightSources"] }`
       */
      refreshLighting: RenderFlag<this, "refreshLighting">;

      /**
       * Update the configuration of light sources
       * @defaultValue `{}`
       */
      refreshLightSources: RenderFlag<this, "refreshLightSources">;

      /**
       * Re-initialize the entire vision modes. See {@link CanvasVisibility#initializeVisionMode}.
       * @defaultValue `{ propagate: ["refreshVisionSources", "refreshLighting", "refreshPrimary"] }`
       */
      initializeVisionModes: RenderFlag<this, "initializeVisionModes">;

      /**
       * Re-initialize the entire vision configuration. See {@link CanvasVisibility#initializeSources}.
       * @defaultValue `{ propagate: ["initializeVisionModes", "refreshVision"] }`
       */
      initializeVision: RenderFlag<this, "initializeVision">;

      /**
       * Refresh the rendered appearance of vision
       * @defaultValue `{ propagate: ["refreshVisionSources", "refreshOcclusionMask"] }`
       */
      refreshVision: RenderFlag<this, "refreshVision">;

      /**
       * Update the configuration of vision sources
       * @defaultValue `{}`
       */
      refreshVisionSources: RenderFlag<this, "refreshVisionSources">;

      /**
       * Refresh the contents of the PrimaryCanvasGroup mesh
       * @defaultValue `{}`
       */
      refreshPrimary: RenderFlag<this, "refreshPrimary">;

      /**
       * Refresh occlusion
       * @defaultValue `{propagate: ["refreshOcclusionStates", "refreshOcclusionMask"] }`
       */
      refreshOcclusion: RenderFlag<this, "refreshOcclusion">;

      /** @defaultValue `{}` */
      refreshOcclusionStates: RenderFlag<this, "refreshOcclusionStates">;

      /** @defaultValue `{}` */
      refreshOcclusionMask: RenderFlag<this, "refreshOcclusionMask">;

      /**
       * Re-initialize the entire ambient sound configuration. See {@link SoundsLayer#initializeSources}.
       * @defaultValue `{ propagate: ["refreshSounds"] }`
       */
      initializeSounds: RenderFlag<this, "initializeSounds">;

      /**
       * Refresh the audio state of ambient sounds
       * @defaultValue `{}`
       */
      refreshSounds: RenderFlag<this, "refreshSounds">;

      /**
       * Apply a fade duration to sound refresh workflow
       * @defaultValue `{}`
       */
      soundFadeDuration: RenderFlag<this, "soundFadeDuration">;

      /**
       * @defaultValue `{ propagate: ["refreshOcclusion"] }`
       * @deprecated since v12, will be removed in v14
       */
      refreshTiles: RenderFlag<this, "refreshTiles">;

      /**
       * @defaultValue `{ propagate: ["initializeLighting", "initializeVision"] }`
       * @deprecated since v12, will be removed in v14
       */
      identifyInteriorWalls: RenderFlag<this, "identifyInteriorWalls">;

      /**
       * @defaultValue `{ propagate: ["refreshVision"] }`
       * @deprecated since v11, will be removed in v13
       * @remarks In v12 the flag remains, but the static method it would have triggered was removed prematurely (was listed as until v13 in v11)
       */
      forceUpdateFog: RenderFlag<this, "forceUpdateFog">;
    }
  }
}

declare abstract class AnyPerceptionManager extends PerceptionManager {
  constructor(...args: never);
}
