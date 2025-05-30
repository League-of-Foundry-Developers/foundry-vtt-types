import type { HandleEmptyObject, Identity, InexactPartial, NullishProps } from "#utils";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      NotesLayer: NotesLayer.Any;
    }
  }
}

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

    override get hookName(): "NotesLayer";

    /** @defaultValue `game.settings.get("core", "notesDisplayToggle")` */
    override interactiveChildren: boolean;

    protected override _deactivate(): void;

    protected override _draw(options: HandleEmptyObject<NotesLayer.DrawOptions>): Promise<void>;

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
      note: Note.Implementation,
      options?: NotesLayer.PanToNoteOptions, // not:null (destructured)
    ): Promise<void>;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    protected override _onClickLeft(event: PIXI.FederatedEvent): Promise<Note.Implementation | void>;

    /**
     * Handle JournalEntry document drop data
     */
    protected _onDropData(event: DragEvent, data: NotesLayer.DropData): Promise<false | Note.Implementation>;
  }

  namespace NotesLayer {
    interface Any extends AnyNotesLayer {}
    interface AnyConstructor extends Identity<typeof AnyNotesLayer> {}

    interface DrawOptions extends PlaceablesLayer.DrawOptions {}

    interface LayerOptions extends PlaceablesLayer.LayerOptions<Note.ImplementationClass> {
      name: "notes";
      zIndex: 800;
    }

    /** @internal */
    interface _DropDataCommon {
      uuid: string;
    }

    interface DropDataJournalEntry extends _DropDataCommon, Canvas.DropPosition {
      type: "JournalEntry";
    }

    interface DropDataJournalEntryPage extends _DropDataCommon, Canvas.DropPosition {
      type: "JournalEntryPage";
      anchor: { name: string };
    }

    type DropData = DropDataJournalEntry | DropDataJournalEntryPage;

    /** @internal */
    type _PanToNoteOptions = NullishProps<{
      /**
       * The resulting zoom level.
       * @defaultValue `1.5`
       * @remarks The above is a parameter default only; `null` will be eventually be handled by
       * {@link Canvas#_constrainView}, where it will be replaced with `canvas.stage.scale.x`
       */
      scale: number;
    }> &
      InexactPartial<{
        /**
         * The speed of the pan animation in milliseconds.
         * @defaultValue `250`
         * @remarks Can't be `null` as it only has a parameter default
         */
        duration: number;
      }>;

    interface PanToNoteOptions extends _PanToNoteOptions {}
  }
}

declare abstract class AnyNotesLayer extends NotesLayer {
  constructor(...args: never);
}
