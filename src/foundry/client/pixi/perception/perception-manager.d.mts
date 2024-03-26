import type { DeepPartial } from "../../../../types/utils.d.mts";

declare global {
  interface PerceptionManagerFlags {
    /** Re-initialize the entire lighting configuration */
    initializeLighting: boolean;

    /** Refresh the rendered appearance of lighting */
    refreshLighting: boolean;

    /** Update the configuration of light sources */
    refreshLightSources: boolean;

    /** Re-initialize the entire vision configuration */
    initializeVision: boolean;

    /** Update the configuration of vision sources */
    refreshVisionSources: boolean;

    /** Refresh the rendered appearance of vision */
    refreshVision: boolean;

    /** Re-initialize the entire ambient sound configuration */
    initializeSounds: boolean;

    /** Refresh the audio state of ambient sounds */
    refreshSounds: boolean;

    /** Apply a fade duration to sound refresh workflow */
    soundFadeDuration: boolean;

    /** Refresh the visual appearance of tiles */
    refreshTiles: boolean;

    /** Refresh the contents of the PrimaryCanvasGroup mesh */
    refreshPrimary: boolean;
  }

  /**
   * A helper class which manages the refresh workflow for perception layers on the canvas.
   * This controls the logic which batches multiple requested updates to minimize the amount of work required.
   * A singleton instance is available as canvas#perception.
   * @see Canvas#perception
   */
  class PerceptionManager extends RenderFlagsMixin(Object) {
    static RENDER_FLAGS: {
      /** @defaultValue `{ propagate: ["refreshLighting", "refreshVision"] }` */
      initializeLighting: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{ propagate: ["refreshLightSources"] }` */
      refreshLighting: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{}` */
      refreshLightSources: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{}` */
      refreshVisionSources: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{}` */
      refreshPrimary: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{ propagate: ["refreshVision", "refreshTiles", "refreshLighting", "refreshLightSources", "refreshPrimary"] }` */
      initializeVision: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{ propagate: ["refreshVisionSources"] }` */
      refreshVision: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{ propagate: ["refreshSounds"] }` */
      initializeSounds: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{}` */
      refreshSounds: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{ propagate: ["refreshLightSources", "refreshVisionSources"] }` */
      refreshTiles: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{}` */
      soundFadeDuration: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{ propagate: ["initializeLighting", "initializeVision"] }` */
      identifyInteriorWalls: RenderFlag<PerceptionManagerFlags>;

      /** @defaultValue `{ propagate: ["refreshVision"] }` */
      forceUpdateFog: RenderFlag<PerceptionManagerFlags>;
    };

    static RENDER_FLAG_PRIORITY: "PERCEPTION";

    applyRenderFlags(): void;

    /**
     * A shim mapping which supports backwards compatibility for old-style (V9 and before) perception manager flags.
     */
    static COMPATIBILITY_MAPPING: {
      "lighting.initialize": "initializeLighting";
      "lighting.refresh": "refreshLighting";
      "sight.initialize": "initializeVision";
      "sight.refresh": "refreshVision";
      "sounds.initialize": "initializeSounds";
      "sounds.refresh": "refreshSounds";
      "sounds.fade": "soundFadeDuration";
      "foreground.refresh": "refreshTiles";
    };

    /**
     * Update perception manager flags which configure which behaviors occur on the next frame render.
     * @param flags - Flag values (true) to assign where the keys belong to PerceptionManager.FLAGS
     * @param v2    - Opt-in to passing v2 flags, otherwise a backwards compatibility shim will be applied
     *                (default: `true`)
     */
    update(flags: Partial<PerceptionManagerFlags>, v2?: boolean): void;

    /**
     * A helper function to perform an immediate initialization plus incremental refresh.
     */
    initialize(): ReturnType<this["update"]>;

    /**
     * A helper function to perform an incremental refresh only.
     */
    refresh(): ReturnType<this["update"]>;

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks PerceptionManager#cancel is renamed to PerceptionManager#deactivate
     * @remarks PerceptionManager#deactivate does not actually exist as of v11
     */
    cancel(): void;

    /**
     * @deprecated since v10, will be removed in v12
     * @remarks PerceptionManager#schedule is replaced by PerceptionManager#update
     */
    schedule(options?: DeepPartial<PerceptionManager.Options>): void;

    /**
     * @deprecated since v11
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
