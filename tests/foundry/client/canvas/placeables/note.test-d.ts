import { expectTypeOf } from "vitest";

import ControlIcon = foundry.canvas.containers.ControlIcon;
import Note = foundry.canvas.placeables.Note;
import PreciseText = foundry.canvas.containers.PreciseText;

expectTypeOf(Note.implementation).toEqualTypeOf<Note.ImplementationClass>();
expectTypeOf(Note.embeddedName).toEqualTypeOf<"Note">();
expectTypeOf(Note.RENDER_FLAGS.redraw.propagate).toEqualTypeOf<
  | Array<
      | "refresh"
      | "refreshState"
      | "refreshVisibility"
      | "refreshTransform"
      | "refreshPosition"
      | "refreshSize"
      | "refreshTooltip"
      | "refreshElevation"
    >
  | undefined
>();

declare const doc: NoteDocument.Stored;
declare const scene: Scene.Stored;
const note = new CONFIG.Note.objectClass(doc);

expectTypeOf(note.controlIcon).toEqualTypeOf<ControlIcon | null>();
expectTypeOf(note.tooltip).toEqualTypeOf<PreciseText | undefined>();
expectTypeOf(note.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(note.entry).toEqualTypeOf<JournalEntry.Stored | undefined>();
expectTypeOf(note.page).toEqualTypeOf<JournalEntryPage.Stored | undefined>();
expectTypeOf(note.isAuthor).toBeBoolean();
expectTypeOf(note.isVisible).toBeBoolean();
expectTypeOf(note.isInteractable).toBeBoolean();
expectTypeOf(note["_overlapsSelection"](new PIXI.Rectangle())).toBeBoolean();

// @ts-expect-error _draw always gets passed a value
expectTypeOf(note["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(note["_draw"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(note["_drawControlIcon"]()).toEqualTypeOf<ControlIcon>();
expectTypeOf(note["_drawTooltip"]()).toEqualTypeOf<PIXI.Text>();
expectTypeOf(note["_refreshTooltip"]()).toBeVoid();
expectTypeOf(note["_getTextStyle"]()).toEqualTypeOf<PIXI.TextStyle>();

// @ts-expect-error an object must be passed
expectTypeOf(note["_applyRenderFlags"]()).toBeVoid();
expectTypeOf(note["_applyRenderFlags"]({})).toBeVoid();
// all falsey values have no effect
expectTypeOf(note["_applyRenderFlags"]({ refreshElevation: false, refreshPosition: undefined })).toBeVoid();
expectTypeOf(
  note["_applyRenderFlags"]({
    redraw: true,
    refresh: true,
    refreshState: true,
    refreshVisibility: true,
    refreshTransform: true,
    refreshPosition: true,
    refreshSize: true,
    refreshTooltip: true,
    refreshElevation: true,
  }),
).toBeVoid();

expectTypeOf(note["_refreshVisibility"]()).toBeVoid();
expectTypeOf(note["_refreshState"]()).toBeVoid();
expectTypeOf(note["_refreshPosition"]()).toBeVoid();
expectTypeOf(note["_refreshSize"]()).toBeVoid();
expectTypeOf(note["_refreshElevation"]()).toBeVoid();

expectTypeOf(
  note["_onCreate"](
    doc.toObject(),
    { action: "create", parent: scene, modifiedTime: 7, render: true, renderSheet: false },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(
  note["_onUpdate"](
    // partial source data
    { elevation: 20, entryId: "YYYYYSomeIDYYYYY", fontSize: 60, flags: { core: { sheetLock: true } } },
    { action: "update", parent: scene, modifiedTime: 7, render: true, diff: true, recursive: true },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(
  note["_onDelete"]({ action: "delete", parent: scene, modifiedTime: 7, render: true }, "XXXXXSomeIDXXXXX"),
).toBeVoid();

// TODO: _onUpdate test after document test helpers are done

declare const someUser: User.Implementation;
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
expectTypeOf(note["_canHover"](someUser)).toBeBoolean();
expectTypeOf(note["_canView"](someUser)).toBeBoolean();
expectTypeOf(note["_canConfigure"](someUser)).toBeBoolean();
expectTypeOf(note["_onClickLeft2"](pointerEvent)).toBeVoid();
