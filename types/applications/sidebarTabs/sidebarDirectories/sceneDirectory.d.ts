/**
 * A directory listing of active game scenes
 */
declare class SceneDirectory extends SidebarDirectory {
  /**
   * @override
   */
  static get entity(): string;

  /**
   * @override
   */
  static get collection(): Scenes;

  /**
   * @override
   * @remarks This is never called.
   */
  protected _onCreate(event: MouseEvent): Promise<Scene>;

  /**
   * @override
   */
  protected _getEntryContextOptions(): ContextMenu.Item[];
}
