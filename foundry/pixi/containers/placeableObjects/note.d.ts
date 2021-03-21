/**
 * A Note is an implementation of PlaceableObject which represents an annotated location within the Scene.
 * Each Note links to a JournalEntry entity and represents it's location on the map.
 *
 * @example
 * ```typescript
 * Note.create<Note>({
 *   entryId: journalEntry.id,
 *   x: 1000,
 *   y: 1000,
 *   icon: "icons/my-journal-icon.svg",
 *   iconSize: 40,
 *   iconTint: "#00FF000",
 *   text: "A custom label",
 *   fontSize: 48,
 *   textAnchor: CONST.TEXT_ANCHOR_POINTS.CENTER,
 *   textColor: "#00FFFF"
 * });
 * ```
 */
declare class Note extends PlaceableObject<Note.Data> {
  /**
   * The associated JournalEntry which is described by this note
   */
  entry: JournalEntry;

  /** @override */
  static get embeddedName(): 'Note';

  /**
   * @remarks
   * Not implemented for Note
   */
  get bounds(): never;

  /**
   * Return the text label which describes the Note
   * Use a manually specified label with a fallback to the JournalEntry name
   */
  get text(): string;

  /**
   * The Map Note icon size
   */
  get size(): number;

  /** @override */
  draw(): Promise<this>;

  /**
   * Draw the ControlIcon for the Map Note
   */
  protected _drawControlIcon(): ControlIcon;

  /**
   * Draw the map note Tooltip as a Text object
   */
  protected _drawTooltip(): PreciseText;

  /**
   * Define a PIXI TextStyle object which is used for the tooltip displayed for this Note
   */
  protected _getTextStyle(): PIXI.TextStyle;

  /** @override */
  refresh(): this;

  /** @override */
  protected _onUpdate(data: Note.Data): Promise<this>;

  /** @override */
  protected _canHover(user: User): true;

  /** @override */
  protected _canView(user: User): boolean;

  /** @override */
  protected _onHoverIn(event: PIXI.InteractionEvent, options?: { hoverOutOthers: boolean }): boolean | void;

  /** @override */
  protected _onHoverOut(event: PIXI.InteractionEvent): boolean | void;

  /** @override */
  protected _onClickLeft2(event: PIXI.InteractionEvent): void;
}

declare namespace Note {
  interface Data extends PlaceableObject.Data {
    entryId: string;
    fontFamily: string;
    fontSize: number;
    icon: string;
    iconSize: number;
    iconTint: string;
    text: string;
    textAnchor: Const.TextAnchorPoint;
    textColor: string;
    x: number;
    y: number;
  }
}
