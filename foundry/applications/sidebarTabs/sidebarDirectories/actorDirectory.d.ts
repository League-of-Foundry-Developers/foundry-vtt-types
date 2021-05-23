/**
 * A directory list of Actor entities in the Sidebar
 * @see {@link Actor}
 */
declare class ActorDirectory extends SidebarDirectory {
  /**
   * @override
   * @see {@link Game.actors}
   */
  static get collection(): Game['actors'];

  /**
   * @override
   */
  static get entity(): 'Actor';

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): ActorDirectory.Data;

  /**
   * @param selector - (unused)
   * @override
   */
  protected _canDragDrop(selector: string | null): boolean;

  /**
   * @param selector - (unused)
   * @override
   */
  protected _canDragStart(selector: string | null): boolean;

  /**
   * @override
   */
  protected _getEntryContextOptions(): ContextMenu.Item[];

  /**
   * @override
   */
  protected _onClickEntityName(event: JQuery.ClickEvent): Promise<void>;

  /**
   * @override
   */
  protected _onDragStart(event: DragEvent): false | void;
}

declare namespace ActorDirectory {
  interface Data extends SidebarDirectory.Data {
    /**
     * @defaultValue `'templates/sidebar/actor-partial.html'`
     */
    entityPartial: string;

    /**
     * @defaultValue `'templates/sidebar/folder-partial.html'`
     */
    folderPartial: string;
  }
}
