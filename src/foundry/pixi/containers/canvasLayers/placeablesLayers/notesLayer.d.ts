/**
 * The Notes Layer Container
 */
declare class NotesLayer extends PlaceablesLayer<Note> {
  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.layerOptions, {
   *   canDragCreate: false,
   *   objectClass: Note,
   *   sheetClass: NoteConfig,
   *   sortActiveTop: true,
   *   zIndex: 60
   * })
   * ```
   */
  static get layerOptions(): PlaceablesLayer.LayerOptions;

  /** @override */
  activate(): this;

  /** @override */
  deactivate(): this;

  /**
   * Register game settings used by the NotesLayer
   */
  static registerSettings(): void;

  /** @override */
  protected _onMouseDown(event: PIXI.InteractionEvent): void;

  /**
   * Handle JournalEntry entity drop data
   */
  protected _onDropData(
    event: DragEvent,
    data: { id: string; type: 'JournalEntry'; x: number; y: number; pack?: string }
  ): Promise<false | undefined>;

  /**
   * @defaultValue `"notesDisplayToggle"`
   */
  static TOGGLE_SETTING: string;
}

declare namespace NotesLayer {
  type DropData = {
    type?: 'JournalEntry';
  } & Canvas.DropPosition &
    DeepPartial<JournalEntry.Data>;
}
