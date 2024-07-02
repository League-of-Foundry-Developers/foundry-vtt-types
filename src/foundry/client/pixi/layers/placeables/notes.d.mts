export {};

declare global {
  /**
   * The Notes Layer which contains Note canvas objects
   */
  class NotesLayer extends PlaceablesLayer<"Note"> {
    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): Canvas["notes"];

    /**
     * @defaultValue
     * ```
     * foundry.utils.mergeObject(super.layerOptions, {
     *  name: "notes",
     *  canDragCreate: false,
     *  sortActiveTop: true, // TODO this needs to be removed
     *  zIndex: 200
     * })
     * ```
     * @remarks The TODO is foundry internal
     */
    static override get layerOptions(): NotesLayer.LayerOptions;

    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    override options: NotesLayer.LayerOptions;

    static override documentName: "Note";

    /**
     * The named core setting which tracks the toggled visibility state of map notes
     */
    static TOGGLE_SETTING: "notesDisplayToggle";

    override get hookName(): string;

    override _deactivate(): void;

    /**
     * Register game settings used by the NotesLayer
     */
    static registerSettings(): void;

    /**
     * Visually indicate in the Scene Controls that there are visible map notes present in the Scene.
     */
    hintMapNotes(): void;

    /**
     * Pan to a given note on the layer.
     * @param note    - The note to pan to.
     * @param options - Options which modify the pan operation.
     * @returns A Promise which resolves once the pan animation has concluded.
     */
    panToNote(
      note: Note,
      options?: {
        /**
         * The resulting zoom level.
         * @defaultValue `1.5`
         */
        scale: number;

        /**
         * The speed of the pan animation in milliseconds.
         * @defaultValue `250`
         */
        duration: number;
      },
    ): Promise<void>;

    protected override _onClickLeft(event: PIXI.FederatedEvent): void;

    /**
     * Handle JournalEntry document drop data
     */
    protected _onDropData(event: DragEvent, data: NotesLayer.DropData): Promise<false | void>;
  }

  namespace NotesLayer {
    interface LayerOptions extends PlaceablesLayer.LayerOptions<"Note"> {
      name: "notes";
      canDragCreate: false;
      sortActiveTop: true;
      zIndex: 60;
    }

    interface DropData<DocType extends "JournalEntry" | "JournalEntryPage" = "JournalEntry" | "JournalEntryPage">
      extends Canvas.DropPosition {
      type: DocType;
      uuid: string;
      anchor: DocType extends "JournalEntryPage" ? { name: string } : undefined;
    }
  }
}
