import type { InexactPartial } from "fvtt-types/utils";

declare global {
  /**
   * The Notes Layer which contains Note canvas objects
   */
  class NotesLayer<
    DrawOptions extends NotesLayer.DrawOptions = NotesLayer.DrawOptions,
    TearDownOptions extends PlaceablesLayer.TearDownOptions = PlaceablesLayer.TearDownOptions,
  > extends PlaceablesLayer<"Note", DrawOptions, TearDownOptions> {
    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): Canvas["notes"];

    /**
     * @defaultValue
     * ```
     * foundry.utils.mergeObject(super.layerOptions, {
     *  name: "notes",
     *  zIndex: 800
     * })
     * ```
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

    override interactiveChildren: boolean;

    override _deactivate(): void;

    override _draw(options?: DrawOptions): Promise<void>;

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
      /** @remarks Can't be NullishProps because `duration` is passed to `canvas.animatePan` which only provides a default for `undefined` with `{ duration=250 }`, and must be numeric */
      options?: InexactPartial<{
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
      }>,
    ): Promise<void>;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    protected override _onClickLeft(event: PIXI.FederatedEvent): Promise<Note | void>;

    /**
     * Handle JournalEntry document drop data
     */
    protected _onDropData(event: DragEvent, data: NotesLayer.DropData): Promise<false | Note>;
  }

  namespace NotesLayer {
    type AnyConstructor = typeof AnyNotesLayer;

    interface DrawOptions extends PlaceablesLayer.DrawOptions {}

    interface LayerOptions extends PlaceablesLayer.LayerOptions<"Note"> {
      name: "notes";
      zIndex: 800;
    }

    interface DropData<DocType extends "JournalEntry" | "JournalEntryPage" = "JournalEntry" | "JournalEntryPage">
      extends Canvas.DropPosition {
      type: DocType;
      uuid: string;
      anchor: DocType extends "JournalEntryPage" ? { name: string } : undefined;
    }
  }
}

declare abstract class AnyNotesLayer extends NotesLayer {
  constructor(arg0: never, ...args: never[]);
}
