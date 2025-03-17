import type { DisplayObject } from "pixi.js";

declare global {
  /**
   * A fog of war management class which is the singleton canvas.fog instance.
   */
  class FogManager {
    /**
     * The FogExploration document which applies to this canvas view
     * @defaultValue `null`
     */
    exploration: FogExploration | null;

    /**
     * Track whether we have pending fog updates which have not yet been saved to the database
     * @defaultValue `false`
     */
    _updated: boolean;

    /**
     * Texture extractor
     */
    get extractor(): TextureExtractor;

    /**
     * Define the number of fog refresh needed before the fog texture is extracted and pushed to the server.
     */
    static COMMIT_THRESHOLD: 70;

    /**
     * The exploration SpriteMesh which holds the fog exploration texture.
     */
    get sprite(): SpriteMesh;

    /**
     * The configured options used for the saved fog-of-war texture.
     */
    get textureConfiguration(): CanvasVisibility.TextureConfiguration;

    /**
     * Does the currently viewed Scene support Token field of vision?
     */
    get tokenVision(): boolean;

    /**
     * Does the currently viewed Scene support fog of war exploration?
     */
    get fogExploration(): boolean;

    /**
     * Create the exploration display object with or without a provided texture.
     */
    protected _createExplorationObject(tex?: PIXI.Texture | PIXI.RenderTexture): DisplayObject;

    /**
     * Initialize fog of war - resetting it when switching scenes or re-drawing the canvas
     */
    initialize(): Promise<void>;

    /**
     * Clear the fog and reinitialize properties (commit and save in non reset mode)
     */
    clear(): Promise<void>;

    /**
     * Once a new Fog of War location is explored, composite the explored container with the current staging sprite.
     * Once the number of refresh is \> to the commit threshold, save the fog texture to the database.
     */
    commit(): void;

    /**
     * Load existing fog of war data from local storage and populate the initial exploration sprite
     */
    load(): Promise<PIXI.Texture | void>;

    /**
     * Dispatch a request to reset the fog of war exploration status for all users within this Scene.
     * Once the server has deleted existing FogExploration documents, the _onReset handler will re-draw the canvas.
     */
    reset(): Promise<void>;

    /**
     * Request a fog of war save operation.
     * Note: if a save operation is pending, we're waiting for its conclusion.
     */
    save(): Promise<void>;

    /**
     * Extract fog data as a base64 string
     */
    protected _extractBase64(): Promise<string>;

    /**
     * Prepare the data that will be used to update the FogExploration document.
     * @param base64Image - The extracted base64 image data
     * @returns Exploration data to update
     */
    protected _prepareFogUpdateData(base64Image: string): foundry.documents.BaseFogExploration.UpdateData;

    /**
     * If fog of war data is reset from the server, deactivate the current fog and initialize the exploration.
     * @internal
     */
    _handleReset(): Promise<void>;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks pending is deprecated and redirected to the exploration container
     */
    get pending(): CanvasVisibility["explored"];

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks revealed is deprecated and redirected to the exploration container
     */
    get revealed(): CanvasVisibility["explored"];

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks update is obsolete and always returns true. The fog exploration does not record position anymore.
     */
    update(source: any, force: boolean): true;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks resolution is deprecated and redirected to CanvasVisibility#textureConfiguration
     */
    get resolution(): CanvasVisibility["textureConfiguration"];
  }

  namespace FogManager {
    type Any = AnyFogManager;
    type AnyConstructor = typeof AnyFogManager;
  }
}

declare abstract class AnyFogManager extends FogManager {
  constructor(arg0: never, ...args: never[]);
}
