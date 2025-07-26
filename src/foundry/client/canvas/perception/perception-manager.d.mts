import type { InexactPartial, InterfaceToObject } from "#utils";
import type { RenderFlagsMixin, RenderFlags, RenderFlag } from "#client/canvas/interaction/_module.d.mts";

/**
 * A helper class which manages the refresh workflow for perception layers on the canvas.
 * This controls the logic which batches multiple requested updates to minimize the amount of work required.
 * A singleton instance is available as {@link Canvas.perception | `Canvas#perception`}.
 */
declare class PerceptionManager extends RenderFlagsMixin() {
  static override RENDER_FLAGS: InterfaceToObject<PerceptionManager.RENDER_FLAGS>;

  /** @defaultValue `"PERCEPTION"`*/
  static override RENDER_FLAG_PRIORITY: RenderFlags.Priority;

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
   * @deprecated "`PerceptionManager#refresh` is deprecated in favor of assigning granular \"refresh flags\"" (since v12, until v14)
   */
  refresh(): void;

  static #PerceptionManager: true;
}

declare namespace PerceptionManager {
  interface Any extends AnyPerceptionManager {}
  type AnyConstructor = typeof AnyPerceptionManager;

  type PassableFlags = InexactPartial<RenderFlags>;

  type RenderFlags = RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS>;

  interface RENDER_FLAGS {
    /**
     * Recompute intersections between all registered edges. See {@linkcode foundry.canvas.geometry.edges.CanvasEdges.refresh | CanvasEdges#refresh}.
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
     * Re-initialize the entire vision modes. See {@linkcode foundry.canvas.groups.CanvasVisibility.initializeVisionMode | CanvasVisibility#initializeVisionMode}.
     * @defaultValue `{ propagate: ["refreshVisionSources", "refreshLighting", "refreshPrimary"] }`
     */
    initializeVisionModes: RenderFlag<this, "initializeVisionModes">;

    /**
     * Re-initialize the entire vision configuration. See {@linkcode foundry.canvas.groups.CanvasVisibility.initializeSources | CanvasVisibility#initializeSources}.
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
     * Refresh the contents of the {@linkcode foundry.canvas.groups.PrimaryCanvasGroup | PrimaryCanvasGroup} mesh
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
     * Re-initialize the entire ambient sound configuration. See {@linkcode foundry.canvas.layers.SoundsLayer.initializeSources | SoundsLayer#initializeSources}.
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
     * @defaultValue `{ propagate: ["refreshOcclusion"], alias: true }`
     * @deprecated "The `refreshTiles` flag is deprecated in favor of `refreshOcclusion`" (since v12, until v14)
     */
    refreshTiles: RenderFlag<this, "refreshTiles">;

    /**
     * @defaultValue `{ propagate: ["initializeLighting", "initializeVision"], alias: true }`
     * @deprecated "The `identifyInteriorWalls` flag is now obsolete and has no replacement." (since v12, until v14)
     */
    identifyInteriorWalls: RenderFlag<this, "identifyInteriorWalls">;

    /**
     * @defaultValue `{ propagate: ["refreshLightSources"] }`
     * @deprecated "The `initializeDarknessSources` flag is now obsolete. `initializeLightSources` flag must be used instead." (since v13, until v15)
     */
    initializeDarknessSources: RenderFlag<this, "initializeDarknessSources">;
  }
}

export default PerceptionManager;

declare abstract class AnyPerceptionManager extends PerceptionManager {
  constructor(...args: never);
}
