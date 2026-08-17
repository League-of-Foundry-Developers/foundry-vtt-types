import type { AnyFunction, Identity } from "#utils";
import type { Level } from "#client/documents/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";

/**
 * A framework for imbuing special scripted behaviors into a single specific Scene.
 * Managed scenes are registered in CONFIG.Canvas.managedScenes.
 *
 * The SceneManager instance is called at various points in the Scene rendering life-cycle.
 *
 * This also provides a framework for registering additional hook events which are required only for the life-cycle of
 * the managed Scene.
 *
 * @example Registering a custom SceneManager
 * ```js
 * // Define a custom SceneManager subclass
 * class MyCustomSceneManager extends SceneManager {
 *   async _onInit() {
 *     console.log(`Initializing managed Scene "${this.scene.name}"`);
 *   }
 *
 *   _getAvailableLevels(defaultLevels) {
 *     // Return a custom subset of levels for this Scene
 *     return new Set([this.scene.levels.get(someLevelId)]);
 *   }
 *
 *   async _onDraw() {
 *     console.log(`Drawing managed Scene "${this.scene.name}"`);
 *   }
 *
 *   async _onReady() {
 *     console.log(`Readying managed Scene "${this.scene.name}"`);
 *   }
 *
 *   async _onTearDown({nextScene}) {
 *     console.log(`Deconstructing "${this.scene.name}", next up: ${nextScene?.name ?? "blank canvas"}`);
 *   }
 *
 *   _registerHooks() {
 *     this.registerHook("updateToken", this.#onUpdateToken.bind(this));
 *   }
 *
 *   #onUpdateToken(document, updateData, options, userId) {
 *     console.log("Updating a token within the managed Scene");
 *   }
 * }
 *
 * // Register MyCustomSceneManager to be used for a specific Scene
 * CONFIG.Canvas.sceneManagers = {
 *   [sceneId]: MyCustomSceneManager
 * }
 * ```
 */
declare class SceneManager {
  /**
   * The SceneManager is constructed by passing a reference to the active Scene document.
   */
  constructor(scene: Scene.Implementation);

  /**
   * The managed Scene.
   */
  get scene(): Scene.Implementation;

  /**
   * Configure which level of the Scene should be initially viewed for a managed Scene.
   * This initial level could be user-specific.
   * This method may be called when the Scene is not viewed.
   */
  protected _determineInitialLevel(): string | void;

  /**
   * Configure which levels of the Scene are available to the current user.
   * This method may be called when the Scene is not viewed.
   * @param defaultLevels - The levels that are available to the current user by default in ascending order.
   * @returns Return a Set of Level documents to override the default token-ownership logic,
   * or return nothing to fall back to the default behavior. The returned Levels must
   * be sorted in ascending order.
   */
  protected _getAvailableLevels(defaultLevels: Set<Level.Implementation>): Set<Level.Implementation> | void;

  /**
   * Additional behaviors to perform when the Canvas is first initialized for the Scene.
   */
  protected _onInit(): Promise<void>;

  /**
   * Load additional texture resources for the Scene/Level.
   * This method may be called when the Scene is not viewed.
   * @param textures          - Destination record to register textures into.
   * @param additionalSources - Additional sources to load.
   * @param level             - The Level to load textures for.
   */
  protected _loadTextures(
    textures: Canvas.SceneTextures,
    additionalSources: string[],
    level: Level.Implementation,
  ): void;

  /**
   * Additional behaviors to perform after core groups and layers are drawn to the canvas.
   */
  protected _onDraw(): Promise<void>;

  /**
   * Additional behaviors to perform after the Canvas is fully initialized for the Scene.
   */
  protected _onReady(): Promise<void>;

  /**
   * Additional behaviors to perform when the Scene is deactivated.
   * @param options - Options which configure how the canvas is deconstructed.
   */
  protected _onTearDown(options: Canvas.TearDownOptions): Promise<void>;

  /**
   * Register additional hook functions are only used while this Scene is active and is automatically deactivated.
   * Hooks should be registered in this function by calling this._registerHook(hookName, handler)
   */
  protected _registerHooks(): void;

  /**
   * Register additional hook functions are only used while this Scene is active and is automatically deactivated.
   */
  registerHook(hookName: string, handler: AnyFunction): void;

  /**
   * Deactivate Hook functions that were added specifically for this Scene.
   */
  protected _deactivateHooks(): void;

  #SceneManager: true;
}

declare namespace SceneManager {
  interface Any extends AnySceneManager {}
  interface AnyConstructor extends Identity<typeof AnySceneManager> {}
}

export default SceneManager;

declare abstract class AnySceneManager extends SceneManager {
  constructor(...args: never);
}
