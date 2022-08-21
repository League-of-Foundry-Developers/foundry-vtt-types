import { DropData } from "../../data/abstract/client-document";

declare global {
  /**
   * The Notes Layer which contains Note canvas objects
   */
  class NotesLayer extends PlaceablesLayer<"Note", NotesLayer.LayerOptions> {
    /**
     * @remarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): Canvas["notes"];

    /**
     * @defaultValue
     * ```
     * foundry.utils.mergeObject(super.layerOptions, {
     *  name: "notes",
     *  canDragCreate: false,
     *  sortActiveTop: true,
     *  zIndex: 60
     * })
     * ```
     */
    static override get layerOptions(): NotesLayer.LayerOptions;

    static override documentName: "Note";

    /**
     * The named core setting which tracks the toggled visibility state of map notes
     */
    static TOGGLE_SETTING: "notesDisplayToggle";

    override activate(): this;

    override deactivate(): this;

    /**
     * Register game settings used by the NotesLayer
     */
    static registerSettings(): void;

    /** @remarks this method seems to be unused, see https://gitlab.com/foundrynet/foundryvtt/-/issues/7004 */
    protected _onMouseDown(event: PIXI.InteractionEvent): void;

    /**
     * Handle JournalEntry document drop data
     */
    protected _onDropData(event: DragEvent, data: DropData<JournalEntry>): Promise<false | void>;
  }

  namespace NotesLayer {
    interface LayerOptions extends PlaceablesLayer.LayerOptions<"Note"> {
      name: "notes";
      canDragCreate: false;
      sortActiveTop: true;
      zIndex: 60;
    }

    type DropData = {
      type?: "JournalEntry";
    } & Canvas.DropPosition &
      DeepPartial<any>; // TODO: Update this
  }
}
