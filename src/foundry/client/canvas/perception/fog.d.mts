import type EventEmitterMixin from "#common/utils/event-emitter.mjs";
import type { AnyObject, FixedInstanceType, Identity } from "#utils";
import type { SpriteMesh } from "#client/canvas/containers/_module.mjs";
import type { CanvasVisibility } from "#client/canvas/groups/_module.d.mts";
import type { Canvas, TextureExtractor } from "#client/canvas/_module.d.mts";

/**
 * A fog of war management class which is the singleton {@linkcode Canvas.fog | canvas.fog} instance.
 */
declare class FogManager extends EventEmitterMixin() {
  /**
   * @defaultValue `["explored"]`
   * @remarks Frozen
   */
  static override emittedEvents: readonly string[];

  /**
   * The FogExploration document which applies to this canvas view
   * @defaultValue `null`
   */
  exploration: FogExploration.Implementation | null;

  /**
   * Track whether we have pending fog updates which have not yet been saved to the database
   * @defaultValue `false`
   * @internal
   */
  protected _updated: boolean;

  /**
   * Texture extractor
   * @remarks Only `undefined` before first {@linkcode initialize} call. Set to `null` if {@linkcode TextureExtractor} creation fails, and will not retry from that state.
   */
  get extractor(): TextureExtractor | undefined | null;

  /**
   * The exploration SpriteMesh which holds the fog exploration texture.
   */
  get sprite(): SpriteMesh;

  /**
   * The configured options used for the saved fog-of-war texture.
   * @remarks Only `undefined` prior to the first time the canvas visibility layer is `#draw()`n
   */
  get textureConfiguration(): CanvasVisibility.Implementation["textureConfiguration"];

  /**
   * Does the currently viewed Scene support Token field of vision?
   */
  get tokenVision(): Scene.Implementation["tokenVision"];

  /**
   * Does the currently viewed Scene support fog of war exploration?
   */
  get fogExploration(): boolean;

  /**
   * Does the currently viewed Scene is in shared fog exploration?
   */
  get sharedExploration(): boolean;

  /**
   * Is this position explored?
   * @param position - The position to be tested
   * @returns Is this position explored?
   */
  isPointExplored(position: Canvas.Point): boolean;

  /**
   * Create a valid FogExploration document for the current canvas context.
   * @param data - (default: `{}`)
   */
  protected _createExplorationDocument(data?: FogExploration.CreateData): FogExploration.Implementation;

  /**
   * Create the exploration display object with or without a provided texture.
   * @param tex - Optional exploration texture.
   */
  protected _createExplorationObject(tex?: PIXI.Texture | PIXI.RenderTexture): SpriteMesh;

  /**
   * Initialize fog of war - resetting it when switching scenes or re-drawing the canvas
   */
  initialize(): Promise<void>;

  /**
   * Clear the fog and reinitialize properties (commit and save in non reset mode)
   */
  clear(): Promise<void>;

  /**
   * Destroy this FogManager.
   */
  destroy(): void;

  /**
   * Once a new Fog of War location is explored, composite the explored container with the current staging sprite.
   * Once the number of refresh is \> to the commit threshold, save the fog texture to the database.
   */
  commit(): void;

  /**
   * Load existing fog of war data from local storage and populate the initial exploration sprite.
   */
  load(options?: FogManager.LoadOptions): Promise<PIXI.Texture | void>;

  /**
   * Unionize exploration inputs for initial scene load.
   * Override this method to change union rules or to return additional exploration data (ex: positions).
   * This method must not perform any persistent DB operations.
   */
  protected _unionizeSharedExploration(fogs: FogExploration.Implementation[]): Promise<FogManager.UnionizedExploration>;

  /**
   * Apply shared exploration received from another client.
   * Subclasses may override this method to customize how explored texture and positions are merged locally.
   * @remarks Foundry's implementation returns `positions` unchanged.
   */
  protected _applySharedExploration(explored: string, positions?: AnyObject): Promise<AnyObject | undefined>;

  /**
   * Create a render texture for the exploration sprite if needed.
   */
  protected _createExplorationRenderTexture(): Promise<PIXI.RenderTexture>;

  /**
   * Dispatch a request to reset the fog of war exploration status for all users within this {@linkcode Scene}. Once the server has deleted
   * existing {@linkcode FogExploration} documents, the {@linkcode _handleReset} handler will re-draw the canvas.
   */
  reset(): Promise<void>;

  /**
   * Request a fog of war save operation.
   * Note: if a save operation is pending, we're waiting for its conclusion.
   */
  save(options?: FogManager.SaveOptions): Promise<void>;

  /**
   * Synchronize one user's version of the Fog of War for this scene to other users.
   * Note: This API is experimental and may be removed in later versions *without deprecation*. It is intended for
   * one-time corrections of users' fog explorations, and should not be used for real-time synchronization of fog
   * exploration.
   * @param from - The user whose Fog of War to use as the source of truth.
   * @param to   - A list of users that should have their Fog of War synced. If none are specified then all users will be synced.
   * @returns A promise that resolves when synchronization has been completed.
   */
  sync(from: User.Stored, to?: User.Stored[]): Promise<void>;

  /**
   * The configured options used for fog base64 extraction.
   */
  protected _getBase64ExtractionConfiguration(): FogManager.Base64ExtractionConfiguration;

  /**
   * Extract fog data as a base64 string
   * @remarks Resolves to `undefined` when the extractor's control hash reports no change since the last extraction.
   */
  protected _extractBase64(): Promise<string | undefined>;

  /**
   * Prepare the data that will be used to update the FogExploration document.
   * @param base64Image - The extracted base64 image data
   * @returns Exploration data to update
   */
  protected _prepareFogUpdateData(base64Image: string): FogExploration.UpdateData;

  /**
   * If fog of war data is reset from the server, deactivate the current fog and initialize the exploration.
   * @internal
   * @remarks Called externally in the `fogReset` socket handler
   */
  protected _handleReset(): Promise<void>;

  #FogManager: true;
}

declare namespace FogManager {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyFogManager {}
    interface AnyConstructor extends Identity<typeof AnyFogManager> {}
  }

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["fogManager"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface LoadOptions {
    /**
     * Preserve current fog until the new one is ready.
     * @defaultValue `false`
     */
    preserve?: boolean | undefined;
  }

  interface UnionizedExploration {
    texture: PIXI.RenderTexture;

    /** @remarks Applied with {@linkcode foundry.abstract.DataModel.updateSource | FogExploration#updateSource} when non-empty */
    updateData: FogExploration.UpdateData | null;
  }

  interface SaveOptions {
    /**
     * Broadcast the fog to other clients for local unionization.
     * @defaultValue `false`
     */
    share?: boolean | undefined;
  }

  interface Base64ExtractionConfiguration {
    /** @defaultValue `"image/webp"` */
    type: string;

    /** @defaultValue `0.8` */
    quality: number;
  }

  /**
   * @deprecated Replaced by {@linkcode FogManager.ImplementationClass}.
   */
  type ConfiguredClass = ImplementationClass;

  /**
   * @deprecated Replaced by {@linkcode FogManager.Implementation}.
   */
  type ConfiguredInstance = Implementation;
}

export default FogManager;

declare abstract class AnyFogManager extends FogManager {
  constructor(...args: never);
}
