import { expectTypeOf } from "vitest";

expectTypeOf(Note.embeddedName).toEqualTypeOf<"Note">();
expectTypeOf(Note.RENDER_FLAGS.redraw.propagate).toEqualTypeOf<
  | Array<
      | "refresh"
      | "refreshState"
      | "refreshVisibility"
      | "refreshPosition"
      | "refreshTooltip"
      | "refreshElevation"
      | "refreshText"
    >
  | undefined
>();

declare const doc: NoteDocument.Stored;
const note = new CONFIG.Note.objectClass(doc);

expectTypeOf(note.controlIcon).toEqualTypeOf<ControlIcon | null>();
expectTypeOf(note.tooltip).toEqualTypeOf<PreciseText | undefined>();
expectTypeOf(note.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(note.entry).toEqualTypeOf<JournalEntry.Stored | undefined>();
expectTypeOf(note.page).toEqualTypeOf<JournalEntryPage.Stored | undefined>();
expectTypeOf(note.isVisible).toBeBoolean();

// @ts-expect-error _draw always gets passed a value
expectTypeOf(note["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(note["_draw"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(note["_drawControlIcon"]()).toEqualTypeOf<ControlIcon>();
expectTypeOf(note["_drawTooltip"]()).toEqualTypeOf<PIXI.Text>();
expectTypeOf(note["_refreshTooltip"]()).toBeVoid();
expectTypeOf(note["_getTextStyle"]()).toEqualTypeOf<PIXI.TextStyle>();

expectTypeOf(note.clear()).toEqualTypeOf<Note.Object>();

// @ts-expect-error an object must be passed
expectTypeOf(note["_applyRenderFlags"]()).toBeVoid();
expectTypeOf(note["_applyRenderFlags"]({})).toBeVoid();
// all falsey values have no effect
expectTypeOf(note["_applyRenderFlags"]({ refreshElevation: null, refreshPosition: undefined })).toBeVoid();
expectTypeOf(
  note["_applyRenderFlags"]({
    redraw: true,
    refresh: true,
    refreshState: true,
    refreshVisibility: true,
    refreshPosition: true,
    refreshTooltip: true,
    refreshElevation: true,
    refreshText: true,
  }),
).toBeVoid();

expectTypeOf(note["_refreshVisibility"]()).toBeVoid();
expectTypeOf(note["_refreshState"]()).toBeVoid();
expectTypeOf(note["_refreshPosition"]()).toBeVoid();
expectTypeOf(note["_refreshElevation"]()).toBeVoid();

expectTypeOf(
  note["_onCreate"](doc.toObject(), { modifiedTime: 7, render: true, renderSheet: false }, "XXXXXSomeIDXXXXX"),
).toBeVoid();

expectTypeOf(
  note["_onUpdate"](
    // partial source data
    { elevation: 20, entryId: "YYYYYSomeIDYYYYY", fontSize: 60, flags: { core: { sheetLock: true } } },
    { modifiedTime: 7, render: true, diff: true, recursive: true },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(note["_onDelete"]({ modifiedTime: 7, render: true }, "XXXXXSomeIDXXXXX")).toBeVoid();

declare const someUser: User.Implementation;
declare const someEvent: PIXI.FederatedEvent;
expectTypeOf(note["_canHover"](someUser)).toBeBoolean();
expectTypeOf(note["_canView"](someUser)).toBeBoolean();
expectTypeOf(note["_canConfigure"](someUser)).toBeBoolean();
expectTypeOf(note["_onHoverIn"](someEvent)).toBeVoid();
expectTypeOf(note["_onClickLeft2"](someEvent)).toBeVoid();
expectTypeOf(note["_prepareDragLeftDropUpdates"](someEvent)).toEqualTypeOf<PlaceableObject.DragLeftDropUpdate[]>();

// deprecated since v12, until v14
expectTypeOf(note.text).toEqualTypeOf<string>();
expectTypeOf(note.size).toEqualTypeOf<number>();
