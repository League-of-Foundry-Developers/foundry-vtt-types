// TODO: Remove when updating this class!!!
// eslint-disable-next-line
// @ts-nocheck

/**
 * The collection of Scene entities
 */
declare class Scenes extends EntityCollection<Scene> {
  /** @override */
  get entity(): string;

  /**
   * Return a reference to the Scene which is currently active
   * @returns
   */
  get active(): Scene;

  /**
   * Return a reference to the Scene which is currently viewed
   * @returns
   */
  get viewed(): Scene;

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers               */
  /* -------------------------------------------- */

  /** @override */
  static socketListeners(socket: io.Socket): void;

  /**
   * Augment the standard modifyDocument listener to flush fog exploration
   */
  protected static _resetFog(response: { scene: Scene; reset: boolean }): Promise<Canvas>;

  /**
   * Handle pre-loading the art assets for a Scene
   * @param sceneId - The Scene id to begin loading
   * @param push    - Trigger other connected clients to also pre-load Scene resources
   */
  preload(sceneId: string, push?: boolean): Promise<void>;

  /**
   * Handle requests pulling the current User to a specific Scene
   */
  protected static _pullToScene(sceneId: string): void;

  /** @override */
  fromCompendium(data: Scene.Data): Scene.Data;
}
