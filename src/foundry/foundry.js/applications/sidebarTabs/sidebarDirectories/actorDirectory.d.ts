/**
 * The sidebar directory which organizes and displays world-level Actor documents.
 */
declare class ActorDirectory extends SidebarDirectory<'Actor'> {
  constructor(...args: ConstructorParameters<typeof SidebarDirectory>);

  /** @override */
  static documentName: 'Actor';

  /** @override */
  protected _canDragStart(selector: string): boolean;

  /**  @override */
  protected _onDragStart(event: DragEvent): void;

  /** @override */
  protected _canDragDrop(selector: string): boolean;

  /** @override */
  protected _onClickEntityName(event: JQuery.ClickEvent): Promise<void>;

  /** @override */
  protected _getEntryContextOptions(): ContextMenuEntry[];
}
