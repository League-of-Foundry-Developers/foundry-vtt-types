import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import type { FixedInstanceType } from "fvtt-types/utils";

declare global {
  namespace Note {
    type ConfiguredClass = ConfiguredObjectClassOrDefault<typeof Note>;
    type ConfiguredInstance = FixedInstanceType<ConfiguredClass>;

    interface RENDER_FLAGS extends PlaceableObject.RENDER_FLAGS {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<this>;

      /** @defaultValue `{ propagate: ["refreshState", "refreshPosition", "refreshTooltip", "refreshElevation"]; alias: true }` */
      refresh: RenderFlag<this>;

      /** @defaultValue `{ propagate: ["refreshVisibility"] }` */
      refreshState: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshVisibility: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshPosition: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshTooltip: RenderFlag<this>;

      /** @defaultValue `{ propagate: ["refreshVisibility"] }` */
      refreshElevation: RenderFlag<this>;

      /**
       * @defaultValue `{ propagate: ["refreshTooltip"]; deprecated: { since: 12; until: 14 }; alias: true }`
       * @deprecated since v12
       */
      refreshText: RenderFlag<this>;
    }

    interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}
  }

  /**
   * A Note is an implementation of PlaceableObject which represents an annotated location within the Scene.
   * Each Note links to a JournalEntry document and represents its location on the map.
   * @see {@link NoteDocument}
   * @see {@link NotesLayer}
   */
  class Note extends PlaceableObject<NoteDocument.ConfiguredInstance> {
    static override embeddedName: "Note";

    static override RENDER_FLAGS: Note.RENDER_FLAGS;

    override get bounds(): PIXI.Rectangle;

    /**
     * The associated JournalEntry which is described by this note
     */
    get entry(): JournalEntry.ConfiguredInstance;

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

    protected override _applyRenderFlags(flags: Note.RenderFlags): void;

    /**
     * Refresh the visibility.
     */
    protected _refreshVisibility(): void;

    /**
     * @privateRemarks _onUpdate is overridden but with no signature changes.
     * For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    protected override _canHover(user: User.ConfiguredInstance): true;

    protected override _canView(user: User.ConfiguredInstance): boolean;

    protected override _onHoverIn(event: PIXI.FederatedEvent, options?: PlaceableObject.HoverInOptions): false | void;

    protected override _onClickLeft2(event: PIXI.FederatedEvent): void;
  }
}
