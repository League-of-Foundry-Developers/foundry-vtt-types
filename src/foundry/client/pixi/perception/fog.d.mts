import type EventEmitterMixin from "#common/utils/event-emitter.mjs";
import type { FixedInstanceType, Identity } from "fvtt-types/utils";

declare global {
  /**
   * A fog of war management class which is the singleton canvas.fog instance.
   */
  class FogManager extends EventEmitterMixin() {
    /**
     * The FogExploration document which applies to this canvas view
     * @defaultValue `null`
     */
    exploration: FogExploration.Implementation | null;

    /**
     * Track whether we have pending fog updates which have not yet been saved to the database
     * @defaultValue `false`
     * @remarks Foundry marked `@internal`
     */
    protected _updated: boolean;

    /**
     * Texture extractor
     * @remarks Only `undefined` before first `#initialize()`ation. Set to `null` if `TextureExtractor` creation fails, and will not retry from that state.
     */
    get extractor(): TextureExtractor | undefined | null;

    /**
     * Define the number of fog refresh needed before the fog texture is extracted and pushed to the server.
     * @defaultValue `70`
     */
    static COMMIT_THRESHOLD: number;

    /**
     * The exploration SpriteMesh which holds the fog exploration texture.
     */
    get sprite(): SpriteMesh;

    /**
     * The configured options used for the saved fog-of-war texture.
     * @remarks Only `undefined` prior to the first time the canvas visibility layer is `#draw()`n
     */
    get textureConfiguration(): CanvasVisibility.TextureConfiguration | undefined;

    /**
     * Does the currently viewed Scene support Token field of vision?
     */
    // TODO: make `Scene.Implementation["tokenVision"]` when docsv2 is done
    get tokenVision(): boolean;

    /**
     * Does the currently viewed Scene support fog of war exploration?
     */
    // TODO: make `Scene.Implementation["fog"]["exploration"]` when docsv2 is done
    get fogExploration(): boolean;

    /**
     * Create the exploration display object with or without a provided texture.
     * @privateRemarks Despite Foundry only typing this as returning `DisplayObject` in 12.331, it always returns a `SpriteMesh`
     */
    protected _createExplorationObject(tex?: PIXI.Texture | PIXI.RenderTexture | null): SpriteMesh;

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
    protected _prepareFogUpdateData(base64Image: string): FogExploration.UpdateData;

    /**
     * If fog of war data is reset from the server, deactivate the current fog and initialize the exploration.
     * @remarks Foundry marked `@internal`, called externally in the `fogReset` socket handler
     */
    protected _handleReset(): Promise<void>;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "pending is deprecated and redirected to the exploration container"
     */
    get pending(): CanvasVisibility["explored"];

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "revealed is deprecated and redirected to the exploration container"
     */
    get revealed(): CanvasVisibility["explored"];

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "update is obsolete and always returns true. The fog exploration does not record position anymore."
     *
     * Both parameters are unused
     */
    update(source: any, force?: boolean | null): true;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "resolution is deprecated and redirected to CanvasVisibility#textureConfiguration"
     *
     * Probable Bug Note: Returns the entire `textureConfiguration` object, not just its `resolution` property
     */
    get resolution(): CanvasVisibility["textureConfiguration"];
  }

  namespace FogManager {
    interface Any extends AnyFogManager {}
    interface AnyConstructor extends Identity<typeof AnyFogManager> {}

    type ConfiguredClass = CONFIG["Canvas"]["fogManager"];
    type ConfiguredInstance = FixedInstanceType<ConfiguredClass>;
  }
}

declare abstract class AnyFogManager extends FogManager {
  constructor(...args: never);
}
