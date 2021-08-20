// TODO: Remove when updating this class!!!
// eslint-disable-next-line
// @ts-nocheck

/**
 * A directory listing of active game scenes
 */
declare class SceneDirectory extends SidebarDirectory {
  /**
   * @override
   */
  static get entity(): 'Scene';

  /**
   * @override
   * @see {@link Game.scenes}
   */
  static get collection(): Game['scenes'];

  /**
   * @override
   * @remarks This is never called.
   */
  protected _onCreate(event: Event): Promise<Scene>;

  /**
   * @override
   */
  protected _getEntryContextOptions(): ContextMenuEntry[];
}
