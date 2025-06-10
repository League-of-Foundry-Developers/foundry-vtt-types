import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";
import type { FixedInstanceType, HandleEmptyObject } from "#utils";
import type { ControlIcon, PreciseText } from "#client/canvas/containers/_module.mjs";
import { RenderFlagsMixin, RenderFlags } from "#client/canvas/interaction/_module.mjs";
import RenderFlag = RenderFlags.RenderFlag;

declare module "#configuration" {
  namespace Hooks {
    interface PlaceableObjectConfig {
      Note: Note.Implementation;
    }
  }
}

declare global {
  /**
   * A Note is an implementation of PlaceableObject which represents an annotated location within the Scene.
   * Each Note links to a JournalEntry document and represents its location on the map.
   * @see {@linkcode NoteDocument}
   * @see {@linkcode NotesLayer}
   */
  class Note extends PlaceableObject<NoteDocument.Implementation> {
    static override embeddedName: "Note";

    static override RENDER_FLAGS: Note.RENDER_FLAGS;

    // Note: This isn't a "real" override but `renderFlags` is set corresponding to the
    // `RENDER_FLAGS` and so it has to be adjusted here.
    renderFlags: RenderFlags<Note.RENDER_FLAGS>;

    // `controlIcon` is actually defined in the class body here (unlike in super or any of its siblings),
    // but not initialized to a value. Since it's still set `null` at construction, and the Foundry
    // comment here provides no additional info, it's been omitted as there's no change from PlaceableObject

    /**
     * The tooltip.
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw
     */
    tooltip: PreciseText | undefined;

    override get bounds(): PIXI.Rectangle;

    /**
     * The associated JournalEntry which is described by this note
     */
    get entry(): JournalEntry.Stored | undefined;

    /**
     * The specific JournalEntryPage within the associated JournalEntry referenced by this Note.
     */
    get page(): JournalEntryPage.Stored | undefined;

    /**
     * Determine whether the Note is visible to the current user based on their perspective of the Scene.
     * Visibility depends on permission to the underlying journal entry, as well as the perspective of controlled Tokens.
     * If Token Vision is required, the user must have a token with vision over the note to see it.
     */
    get isVisible(): boolean;

    protected override _draw(options: HandleEmptyObject<Note.DrawOptions>): Promise<void>;

    /**
     * Draw the control icon.
     */
    protected _drawControlIcon(): ControlIcon;

    /**
     * Draw the tooltip.
     */
    protected _drawTooltip(): PIXI.Text;

    /**
     * Refresh the tooltip.
     */
    protected _refreshTooltip(): void;

    /**
     * Define a PIXI TextStyle object which is used for the tooltip displayed for this Note
     */
    protected _getTextStyle(): PIXI.TextStyle;

    // fake override; super has to account for misbehaving siblings returning void
    override clear(): this;

    protected override _applyRenderFlags(flags: Note.RenderFlags): void;

    /**
     * Refresh the visibility.
     */
    protected _refreshVisibility(): void;

    /**
     * Refresh the state of the Note. Called the Note enters a different interaction state.
     */
    protected _refreshState(): void;

    /**
     * Refresh the position of the Note. Called with the coordinates change.
     */
    protected _refreshPosition(): void;

    /**
     * Refresh the elevation of the control icon.
     */
    protected _refreshElevation(): void;

    // `_onUpdate` is overridden but with no signature changes.
    // For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.

    /** @remarks Unconditionally returns `true` */
    protected override _canHover(user: User.Implementation): boolean;

    protected override _canView(user: User.Implementation): boolean;

    protected override _canConfigure(user: User.Implementation): boolean;

    // fake override to narrow the type from super, which had to account for this class's misbehaving siblings
    // options: not null (destructured)
    protected override _onHoverIn(event: PIXI.FederatedEvent, options?: PlaceableObject.HoverInOptions): void;

    protected override _onClickLeft2(event: PIXI.FederatedEvent): void;

    // fake override to narrow the type from super, which had to account for this class's misbehaving siblings
    protected override _prepareDragLeftDropUpdates(event: PIXI.FederatedEvent): PlaceableObject.DragLeftDropUpdate[];

    /**
     * The text label used to annotate this Note
     * @deprecated since v12, until v14
     * @remarks "`Note#text` has been deprecated. Use {@link NoteDocument.label | `Note#document#label`} instead."
     */
    get text(): string;

    /**
     * The Map Note icon size
     * @deprecated since v12, until v14
     * @remarks "`Note#size` has been deprecated. Use {@link NoteDocument.iconSize | `Note#document#iconSize`} instead."
     */
    get size(): number;
  }

  namespace Note {
    /**
     * The implementation of the `Note` placeable configured through `CONFIG.Note.objectClass`
     * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
     *
     * Not to be confused with {@linkcode NoteDocument.Implementation}
     * which refers to the implementation for the note document.
     */
    type Implementation = FixedInstanceType<ImplementationClass>;

    /**
     * The implementation of the `Note` placeable configured through `CONFIG.Note.objectClass`
     * in Foundry and {@linkcode PlaceableObjectClassConfig} in fvtt-types.
     *
     * Not to be confused with {@linkcode NoteDocument.ImplementationClass}
     * which refers to the implementation for the note document.
     */
    // eslint-disable-next-line no-restricted-syntax
    type ImplementationClass = ConfiguredObjectClassOrDefault<typeof Note>;

    interface RENDER_FLAGS extends PlaceableObject.RENDER_FLAGS {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<this, "redraw">;

      /** @defaultValue `{ propagate: ["refreshState", "refreshPosition", "refreshTooltip", "refreshElevation"], alias: true }` */
      refresh: RenderFlag<this, "refresh">;

      /** @defaultValue `{ propagate: ["refreshVisibility"] }` */
      refreshState: RenderFlag<this, "refreshState">;

      /** @defaultValue `{}` */
      refreshVisibility: RenderFlag<this, "refreshVisibility">;

      /** @defaultValue `{}` */
      refreshPosition: RenderFlag<this, "refreshPosition">;

      /** @defaultValue `{}` */
      refreshTooltip: RenderFlag<this, "refreshTooltip">;

      /** @defaultValue `{ propagate: ["refreshVisibility"] }` */
      refreshElevation: RenderFlag<this, "refreshElevation">;

      /**
       * @defaultValue `{ propagate: ["refreshTooltip"], deprecated: { since: 12, until: 14 }, alias: true }`
       * @deprecated since v12, until v14
       */
      refreshText: RenderFlag<this, "refreshText">;
    }

    interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

    interface DrawOptions extends PlaceableObject.DrawOptions {}

    interface RefreshOptions extends PlaceableObject.RefreshOptions {}

    interface ControlOptions extends PlaceableObject.ControlOptions {}

    interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}
  }
}
