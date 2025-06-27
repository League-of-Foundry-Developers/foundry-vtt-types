import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";

/**
 * The singleton collection of Scene documents which exist within the active World.
 * This Collection is accessible within the Game object as game.scenes.
 *
 * @see {@linkcode Scene} The Scene document
 * @see {@linkcode SceneDirectory} The SceneDirectory sidebar directory
 */
declare class Scenes extends foundry.documents.abstract.WorldCollection<"Scene", "Scenes"> {
  static documentName: "Scene";

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
   * @param push    - Trigger other connected clients to also pre-load Scene resources
   *                  (default: `false`)
   */
  preload(sceneId: string, push?: boolean): io.Socket | Promise<unknown[]>;

  /** @remarks This is not marked as protected because it is used in {@link Game.activateSocketListeners | `Game#activateSocketListeners`} */
  static _activateSocketListeners(socket: io.Socket): void;

  /** @deprecated Foundry made this method truly private in v13 (this warning will be removed in v14) */
  protected static _pullToScene(sceneId: never): never;

  override fromCompendium<Options extends foundry.documents.abstract.WorldCollection.FromCompendiumOptions | undefined>(
    document: Scene.Implementation | Scene.CreateData,
    options?: Options,
  ): foundry.documents.abstract.WorldCollection.FromCompendiumReturnType<"Scene", Options>;
}

declare namespace Scenes {
  interface Any extends AnyScenes {}
  interface AnyConstructor extends Identity<typeof AnyScenes> {}

  interface ConfiguredClass extends Document.ConfiguredCollectionClass<"Scene"> {}
  interface Configured extends Document.ConfiguredCollection<"Scene"> {}
}

declare abstract class AnyScenes extends Scenes {
  constructor(...args: never);
}

export default Scenes;
