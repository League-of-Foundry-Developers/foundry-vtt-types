import { ConfiguredDocumentClass } from '../../../../../types/helperTypes';
import { BaseScene } from '../../../../common/documents.mjs';

declare global {
  /**
   * The singleton collection of Scene documents which exist within the active World.
   * This Collection is accessible within the Game object as game.scenes.
   *
   * @see {@link Scene} The Scene entity
   * @see {@link SceneDirectory} The SceneDirectory sidebar directory
   */
  class Scenes extends WorldCollection<typeof foundry.documents.BaseScene, 'Scenes'> {
    /** @override */
    static documentName: 'Scene';

    /**
     * Return a reference to the Scene which is currently active
     */
    get active(): Scene | undefined;

    /**
     * Return the current Scene target.
     * This is the viewed scene if the canvas is active, otherwise it is the currently active scene.
     */
    get current(): Scene | undefined;

    /**
     * Return a reference to the Scene which is currently viewed
     */
    get viewed(): Scene | undefined;

    /**
     * Handle pre-loading the art assets for a Scene
     *
     * @param sceneId - The Scene id to begin loading
     * @param push    - Trigger other connected clients to also pre-load Scene resources
     *                  (default: `false`)
     */
    preload(sceneId: string, push?: boolean): SocketIOClient.Socket | Promise<unknown[]>;
    // TODO: This can be typed better

    /** @remarks This is not marked as protected because it is used in `Game.activateSocketListeners` */
    static _activateSocketListeners(socket: SocketIOClient.Socket): void;

    /**
     * Augment the standard modifyDocument listener to flush fog exploration
     */
    protected static _resetFog(response: { scene: Scene; reset: boolean }): Promise<Canvas | undefined> | undefined;

    /**
     * Handle requests pulling the current User to a specific Scene
     */
    protected static _pullToScene(sceneId: string): void;

    /** @override */
    fromCompendium(
      document:
        | InstanceType<ConfiguredDocumentClass<typeof BaseScene>>
        | InstanceType<ConfiguredDocumentClass<typeof BaseScene>>['data']['_source']
    ): Omit<InstanceType<ConfiguredDocumentClass<typeof BaseScene>>['data']['_source'], '_id' | 'folder'>;
  }
}
