// TODO: Remove when updating this class!!!
// eslint-disable-next-line
// @ts-nocheck

/**
 * The EntityCollection of Playlist entities.
 */
declare class Playlists extends EntityCollection<Playlist> {
  /** @override */
  get entity(): string;

  /**
   * Return the subset of Playlist entities which are currently playing
   */
  get playing(): Playlist;

  /**
   * Handle changes to a Scene to determine whether to trigger changes to Playlist entities.
   * @param scene   - The Scene entity being updated
   * @param data    - Incremental update data
   * @param options - Update options
   */
  protected _onUpdateScene(scene: Scene, data: Scene.Data, options: Entity.UpdateOptions): void;
}
