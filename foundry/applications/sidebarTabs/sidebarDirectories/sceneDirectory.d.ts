/**
 * A directory listing of active game scenes
 */
declare class SceneDirectory extends SidebarDirectory {
  /**
   * @override
   * @see {@link Game.scenes}
   */
  static get collection(): Game['scenes'];

  /**
   * @override
   */
  static get entity(): 'Scene';

  /**
   * @override
   */
  protected _getEntryContextOptions(): ContextMenu.Item[];

  /**
   * @override
   * @remarks This is never called.
   */
  protected _onCreate(event: Event): Promise<Scene>;
}
