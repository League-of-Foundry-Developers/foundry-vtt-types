import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { WorldCollection } from "#client/documents/abstract/_module.d.mts";
import type { Sound } from "#client/audio/_module.d.mts";

/**
 * The singleton collection of Scene documents which exist within the active World.
 * This Collection is accessible within the Game object as {@linkcode foundry.Game.scenes | game.scenes}.
 *
 * @see {@linkcode foundry.documents.Scene}: The Scene document
 * @see {@linkcode foundry.applications.sidebar.tabs.SceneDirectory}: The SceneDirectory sidebar directory
 */
declare class Scenes extends WorldCollection<"Scene"> {
  static override documentName: "Scene";

  /** @privateRemarks Fake type override */
  static override get instance(): Scenes.Implementation;

  /**
   * Return a reference to the Scene which is currently active
   */
  get active(): Scene.Stored | undefined;

  /**
   * Return the current Scene target.
   * This is the viewed scene if the canvas is active, otherwise it is the currently active scene.
   */
  get current(): Scene.Stored | undefined;

  /**
   * Return a reference to the Scene which is currently viewed
   */
  get viewed(): Scene.Stored | undefined;

  /**
   * Handle pre-loading the art assets for a Scene
   *
   * @param sceneId - The Scene id to begin loading
   * @param push    - Trigger other connected clients to also pre-load Scene resources (default: `false`)
   * @remarks Returns the `game.socket` instance if `push` is true, otherwise returns an array of awaited returns of
   * {@linkcode foundry.audio.AudioHelper.preloadSound} and {@linkcode foundry.canvas.TextureLoader.loadSceneTextures}.
   */
  preload<Push extends boolean | undefined = false>(sceneId: string, push?: Push): Promise<Scenes.PreloadReturn<Push>>;

  static _activateSocketListeners(socket: io.Socket): void;

  override fromCompendium<Options extends WorldCollection.FromCompendiumOptions | undefined = undefined>(
    document: Scene.Implementation | Scene.CreateData,
    options?: Options,
  ): WorldCollection.FromCompendiumReturnType<"Scene", Options>;

  /** @deprecated Foundry made this method truly private in v13. This warning will be removed in v14. */
  protected static _pullToScene(sceneId: never): never;

  static #Scenes: true;
}

declare namespace Scenes {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Scenes.Implementation} instead. This will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Scenes.ImplementationClass} instead. This will be removed in v15.
   */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyScenes {}
    interface AnyConstructor extends Identity<typeof AnyScenes> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"Scene"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"Scene"> {}

  type PreloadReturn<Push extends boolean | undefined> = true extends Push ? io.Socket : Array<Sound | undefined>;

  /** @deprecated Replaced by {@linkcode Scenes.ImplementationClass}. Will be removed in v15. */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Replaced by {@linkcode Scenes.Implementation}. Will be removed in v15. */
  type Configured = Implementation;
}

declare abstract class AnyScenes extends Scenes {
  constructor(...args: never);
}

export default Scenes;
