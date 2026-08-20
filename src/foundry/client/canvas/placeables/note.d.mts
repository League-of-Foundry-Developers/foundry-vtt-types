import type { FixedInstanceType, HandleEmptyObject } from "#utils";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { RenderFlagsMixin, RenderFlags, RenderFlag } from "#client/canvas/interaction/_module.d.mts";
import type { ControlIcon, PreciseText } from "#client/canvas/containers/_module.mjs";
import type { Canvas } from "#client/canvas/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceableObjectConfig {
      Note: Note.Implementation;
    }
  }
}

/**
 * A Note is an implementation of PlaceableObject which represents an annotated location within the Scene.
 * Each Note links to a JournalEntry document and represents its location on the map.
 * @see {@linkcode foundry.documents.NoteDocument}
 * @see {@linkcode foundry.canvas.layers.NotesLayer}
 */
declare class Note extends PlaceableObject<NoteDocument.Implementation> {
  // fake type override
  static override get implementation(): Note.ImplementationClass;

  static override embeddedName: "Note";

  static override RENDER_FLAGS: Note.RENDER_FLAGS;

  // fake type override
  renderFlags: RenderFlags<Note.RENDER_FLAGS>;

  // `controlIcon` is actually defined in the class body here (unlike in super or any of its siblings, where it only comes
  // from the constructor), but not initialized to a value. Since it's still set `null` at construction, and the Foundry
  // comment here provides no additional info, it's been omitted as there's no change from `PlaceableObject`

  /**
   * The tooltip.
   * @defaultValue `undefined`
   * @remarks Only `undefined` prior to first draw
   */
  tooltip: PreciseText | undefined;

  override get bounds(): PIXI.Rectangle;

  /**
   * The associated JournalEntry which is referenced by this Note
   */
  get entry(): JournalEntry.Stored | undefined;

  /**
   * The specific JournalEntryPage within the associated JournalEntry referenced by this Note.
   */
  get page(): JournalEntryPage.Stored | undefined;

  /**
   * A convenient reference for whether the current User is the author of the Note document.
   */
  get isAuthor(): boolean;

  override get isVisible(): boolean;

  override get isInteractable(): boolean;

  protected override _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

  // fake type override
  override draw(options?: HandleEmptyObject<Note.DrawOptions>): Promise<this>;

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

  protected override _applyRenderFlags(flags: Note.RenderFlags): void;

  protected override _refreshVisibility(): void;

  protected override _refreshState(): void;

  /**
   * Refresh the position of the Note. Called with the coordinates change.
   */
  protected _refreshPosition(): void;

  /**
   * Refresh the size of the Note.
   */
  protected _refreshSize(): void;

  /**
   * Refresh the elevation of the control icon.
   */
  protected _refreshElevation(): void;

  protected override _onUpdate(
    changed: NoteDocument.UpdateData,
    options: NoteDocument.Database.OnUpdateOptions,
    userId: string,
  ): void;

  protected override _canHover(user: User.Implementation): boolean;

  protected override _canView(user: User.Implementation): boolean;

  protected override _onClickLeft2(event: Canvas.Event.Pointer): void;
}

declare namespace Note {
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
  type ImplementationClass = PlaceableObject.ImplementationClassFor<"Note">;

  interface RENDER_FLAGS extends PlaceableObject.RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{ propagate: ["refreshState", "refreshTransform", "refreshTooltip", "refreshElevation"], alias: true }` */
    refresh: RenderFlag<this, "refresh">;

    /** @defaultValue `{ propagate: ["refreshVisibility"] }` */
    refreshState: RenderFlag<this, "refreshState">;

    /** @defaultValue `{}` */
    refreshVisibility: RenderFlag<this, "refreshVisibility">;

    /** @defaultValue `{ propagate: ["refreshPosition", "refreshSize"], alias: true }` */
    refreshTransform: RenderFlag<this, "refreshTransform">;

    /** @defaultValue `{}` */
    refreshPosition: RenderFlag<this, "refreshPosition">;

    /** @defaultValue `{}` */
    refreshSize: RenderFlag<this, "refreshSize">;

    /** @defaultValue `{}` */
    refreshTooltip: RenderFlag<this, "refreshTooltip">;

    /** @defaultValue `{ propagate: ["refreshVisibility"] }` */
    refreshElevation: RenderFlag<this, "refreshElevation">;
  }

  interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

  interface DrawOptions extends PlaceableObject.DrawOptions {}

  interface RefreshOptions extends PlaceableObject.RefreshOptions {}

  interface ControlOptions extends PlaceableObject.ControlOptions {}

  interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}
}

export default Note;
