import type { StoredDocument } from "../../../../types/utils.d.mts";

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
    get active(): StoredDocument<Scene.ConfiguredInstance> | undefined;

    /**
     * Return the current Scene target.
     * This is the viewed scene if the canvas is active, otherwise it is the currently active scene.
     */
    get current(): StoredDocument<Scene.ConfiguredInstance> | undefined;

    /**
     * Return a reference to the Scene which is currently viewed
     */
    get viewed(): StoredDocument<Scene.ConfiguredInstance> | undefined;

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

    override fromCompendium(
      document: Scene | foundry.documents.BaseScene.ConstructorData,
      options?: WorldCollection.FromCompendiumOptions | undefined,
    ): Omit<Scene.ConfiguredInstance, "_id" | "folder">;
  }
}
