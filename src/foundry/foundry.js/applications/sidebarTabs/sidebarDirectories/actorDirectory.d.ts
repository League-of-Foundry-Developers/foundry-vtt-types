// TODO: Remove when updating this class!!!
// eslint-disable-next-line
// @ts-nocheck

/**
 * A directory list of Actor entities in the Sidebar
 * @see {@link Actor}
 */
declare class ActorDirectory extends SidebarDirectory {
  /**
   * @override
   */
  static get entity(): 'Actor';

  /**
   * @override
   * @see {@link Game.actors}
   */
  static get collection(): Game['actors'];

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Partial<SidebarDirectory.Options>): ActorDirectory.Data;

  /**
   * @param selector - (unused)
   * @override
   */
  protected _canDragStart(selector: string | null): boolean;

  /**
   * @override
   */
  protected _onDragStart(event: DragEvent): false | void;

  /**
   * @param selector - (unused)
   * @override
   */
  protected _canDragDrop(selector: string | null): boolean;

  /**
   * @override
   */
  protected _onClickEntityName(event: JQuery.ClickEvent): Promise<void>;

  /**
   * @override
   */
  protected _getEntryContextOptions(): ContextMenuEntry[];
}

declare namespace ActorDirectory {
  interface Data extends SidebarDirectory.Data {
    /**
     * @defaultValue `'templates/sidebar/folder-partial.html'`
     */
    folderPartial: string;

    /**
     * @defaultValue `'templates/sidebar/actor-partial.html'`
     */
    entityPartial: string;
  }
}
