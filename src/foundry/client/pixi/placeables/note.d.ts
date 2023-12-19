import type { ConfiguredDocumentClass, ConfiguredDocumentClassForName } from "../../../../types/helperTypes";

type JournalEntryPage = unknown;

declare global {
  /**
   * A Note is an implementation of PlaceableObject which represents an annotated location within the Scene.
   * Each Note links to a JournalEntry document and represents its location on the map.
   */
  class Note extends PlaceableObject<InstanceType<ConfiguredDocumentClass<typeof NoteDocument>>> {
    static override embeddedName: "Note";

    static override RENDER_FLAGS: {
      /** @defaultValue `{propagate: ["refresh"]}` */
      redraw: RenderFlag<PlaceableObject.PlaceableObjectRenderFlags>;

      /** @defaultValue `{propagate: ["refreshState"], alias: true}` */
      refresh: RenderFlag<PlaceableObject.PlaceableObjectRenderFlags>;

      /** @defaultValue `{}` */
      refreshState: RenderFlag<PlaceableObject.PlaceableObjectRenderFlags>;
    };

    override get bounds(): Rectangle;

    /**
     * The associated JournalEntry which is described by this note
     */
    get entry(): InstanceType<ConfiguredDocumentClassForName<"JournalEntry">>;

    /**
     * The specific JournalEntryPage within the associated JournalEntry referenced by this Note.
     */
    get page(): JournalEntryPage;

    /**
     * The text label used to annotate this Note
     */
    get text(): string;

    /**
     * The Map Note icon size
     */
    get size(): number;

    /**
     * Determine whether the Note is visible to the current user based on their perspective of the Scene.
     * Visibility depends on permission to the underlying journal entry, as well as the perspective of controlled Tokens.
     * If Token Vision is required, the user must have a token with vision over the note to see it.
     */
    get isVisible(): boolean;

    /**
     * @param options - unused
     */
    protected override _draw(options?: Record<string, unknown>): Promise<void>;

    /**
     * Draw the ControlIcon for the Map Note.
     * This method replaces any prior controlIcon with the new one.
     */
    protected _drawControlIcon(): ControlIcon;

    /**
     * Draw the map note Tooltip as a Text object.
     * This method replaces any prior text with the new one.
     */
    protected _drawTooltip(): PIXI.Text;

    /**
     * Define a PIXI TextStyle object which is used for the tooltip displayed for this Note
     */
    protected _getTextStyle(): PIXI.TextStyle;

    protected override _applyRenderFlags(flags: Note.NoteRenderFlags): void;

    /**
     * Refresh the visibility.
     */
    protected _refreshVisibility(): void;

    protected override _onUpdate(changed: DeepPartial<foundry.data.NoteData["_source"]>): void;

    protected override _canHover(user: InstanceType<ConfiguredDocumentClassForName<"User">>): true;

    protected override _canView(user: InstanceType<ConfiguredDocumentClassForName<"User">>): boolean;

    protected override _onHoverIn(event: PIXI.FederatedEvent, options?: PlaceableObject.HoverInOptions): false | void;

    protected override _onClickLeft2(event: PIXI.FederatedEvent): void;
  }

  namespace Note {
    interface NoteRenderFlags extends PlaceableObject.PlaceableObjectRenderFlags {
      refreshPosition: boolean;

      refreshVisibility: boolean;

      refreshText: boolean;
    }
  }
}
