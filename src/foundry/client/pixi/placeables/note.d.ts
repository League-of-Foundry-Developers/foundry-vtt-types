import type { ConfiguredDocumentClass, ConfiguredDocumentClassForName } from "../../../../types/helperTypes";
import { HoverInOptions } from "../placeable";

declare global {
  /**
   * A Note is an implementation of PlaceableObject which represents an annotated location within the Scene.
   * Each Note links to a JournalEntry document and represents its location on the map.
   */
  class Note extends PlaceableObject<InstanceType<ConfiguredDocumentClass<typeof NoteDocument>>> {
    static override embeddedName: "Note";

    override get bounds(): Rectangle;

    /**
     * The associated JournalEntry which is described by this note
     */
    get entry(): InstanceType<ConfiguredDocumentClassForName<"JournalEntry">>;

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

    override draw(): Promise<this>;

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

    override refresh(): this;

    protected override _onUpdate(changed: DeepPartial<foundry.data.NoteData["_source"]>): void;

    protected override _canHover(user: InstanceType<ConfiguredDocumentClassForName<"User">>): true;

    protected override _canView(user: InstanceType<ConfiguredDocumentClassForName<"User">>): boolean;

    protected override _onHoverIn(event: PIXI.InteractionEvent, options?: HoverInOptions): false | void;

    protected override _onHoverOut(event: PIXI.InteractionEvent): false | void;

    protected override _onClickLeft2(event: PIXI.InteractionEvent): void;
  }
}
