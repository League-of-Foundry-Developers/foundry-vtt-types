/**
 * The collection of Scene entities
 */
declare class Scenes extends EntityCollection<Scene> {
  /** @override */
  static socketListeners(socket: SocketIOClient.Socket): void;

  /**
   * Handle requests pulling the current User to a specific Scene
   */
  protected static _pullToScene(sceneId: string): void;

  /**
   * Augment the standard modifyDocument listener to flush fog exploration
   */
  protected static _resetFog(response: { scene: Scene; reset: boolean }): Promise<Canvas>;

  /**
   * Return a reference to the Scene which is currently active
   */
  get active(): Scene;

  /** @override */
  get entity(): string;

  /**
   * Return a reference to the Scene which is currently viewed
   */
  get viewed(): Scene;

  /** @override */
  fromCompendium(data: Scene.Data): Scene.Data;

  /**
   * Handle pre-loading the art assets for a Scene
   * @param sceneId - The Scene id to begin loading
   * @param push    - Trigger other connected clients to also pre-load Scene resources
   */
  preload(sceneId: string, push?: boolean): Promise<void>;
}
