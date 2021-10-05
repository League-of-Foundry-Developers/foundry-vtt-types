import type { ConfiguredDocumentClass, ConfiguredDocumentClassForName } from '../../../../../types/helperTypes';
import { HoverInOptions } from '../placeableObject';

declare global {
  /**
   * A Note is an implementation of PlaceableObject which represents an annotated location within the Scene.
   * Each Note links to a JournalEntry entity and represents it's location on the map.
   */
  class Note extends PlaceableObject<InstanceType<ConfiguredDocumentClass<typeof NoteDocument>>> {
    /** @override */
    static get embeddedName(): 'Note';

    /**
     * The associated JournalEntry which is described by this note
     */
    get entry(): InstanceType<ConfiguredDocumentClassForName<'JournalEntry'>>;

    /**
     * The text label used to annotate this Note
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
    protected _onUpdate(changed: DeepPartial<foundry.data.NoteData['_source']>): void;

    /** @override */
    protected _canHover(user: InstanceType<ConfiguredDocumentClassForName<'User'>>): true;

    /** @override */
    protected _canView(user: InstanceType<ConfiguredDocumentClassForName<'User'>>): boolean;

    /** @override */
    protected _onHoverIn(event: PIXI.InteractionEvent, options?: HoverInOptions): false | void;

    /** @override */
    protected _onHoverOut(event: PIXI.InteractionEvent): false | void;

    /** @override */
    protected _onClickLeft2(event: PIXI.InteractionEvent): void;
  }
}
