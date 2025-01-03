import type { InexactPartial } from "../../../../utils/index.d.mts";
import type Document from "../../../common/abstract/document.d.mts";

declare global {
  /**
   * The singleton collection of Scene documents which exist within the active World.
   * This Collection is accessible within the Game object as game.scenes.
   *
   * @see {@link Scene} The Scene document
   * @see {@link SceneDirectory} The SceneDirectory sidebar directory
   */
  class Scenes extends WorldCollection<typeof foundry.documents.BaseScene, "Scenes"> {
    static documentName: "Scene";

    /**
     * Return a reference to the Scene which is currently active
     */
    get active(): Document.Stored<Scene.ConfiguredInstance> | undefined;

    /**
     * Return the current Scene target.
     * This is the viewed scene if the canvas is active, otherwise it is the currently active scene.
     */
    get current(): Document.Stored<Scene.ConfiguredInstance> | undefined;

    /**
     * Return a reference to the Scene which is currently viewed
     */
    get viewed(): Document.Stored<Scene.ConfiguredInstance> | undefined;

    /**
     * Handle pre-loading the art assets for a Scene
     *
     * @param sceneId - The Scene id to begin loading
     * @param push    - Trigger other connected clients to also pre-load Scene resources
     *                  (default: `false`)
     */
    preload(sceneId: string, push?: boolean): io.Socket | Promise<unknown[]>;

    /** @remarks This is not marked as protected because it is used in {@link Game#activateSocketListeners} */
    static _activateSocketListeners(socket: io.Socket): void;

    /**
     * Handle requests pulling the current User to a specific Scene
     */
    protected static _pullToScene(sceneId: string): void;

    override fromCompendium<
      FolderOpt extends boolean = false,
      SortOpt extends boolean = true,
      OwnershipOpt extends boolean = false,
      IdOpt extends boolean = false,
      StateOpt extends boolean = false,
    >(
      document: Scene.ConfiguredInstance | foundry.documents.BaseScene.ConstructorData,
      options?: InexactPartial<
        WorldCollection.FromCompendiumOptions<FolderOpt, SortOpt, OwnershipOpt, IdOpt, StateOpt>
      >,
    ): Omit<
      Scene["_source"],
      | ClientDocument.OmitProperty<FolderOpt, "folder">
      | ClientDocument.OmitProperty<SortOpt, "sort" | "navigation" | "navOrder">
      | ClientDocument.OmitProperty<OwnershipOpt, "ownership">
      | (IdOpt extends false ? "_id" : never)
      | ClientDocument.OmitProperty<StateOpt, "active">
    >;
  }

  namespace Scenes {
    type Any = AnyScenes;
    type AnyConstructor = typeof AnyScenes;
  }
}

declare abstract class AnyScenes extends Scenes {
  constructor(arg0: never, ...args: never[]);
}
