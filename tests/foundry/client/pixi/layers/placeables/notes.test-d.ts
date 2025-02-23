import { expectTypeOf } from "vitest";

expectTypeOf(NotesLayer.documentName).toEqualTypeOf<"Note">();
expectTypeOf(NotesLayer.instance).toEqualTypeOf<NotesLayer | undefined>();
expectTypeOf(NotesLayer.layerOptions).toEqualTypeOf<NotesLayer.LayerOptions>();
expectTypeOf(NotesLayer.layerOptions.name).toEqualTypeOf<"notes">();
expectTypeOf(NotesLayer.layerOptions.objectClass).toEqualTypeOf<typeof Note>();
expectTypeOf(NotesLayer.TOGGLE_SETTING).toEqualTypeOf<"notesDisplayToggle">();
expectTypeOf(NotesLayer.registerSettings()).toBeVoid();

const layer = new NotesLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<typeof Note>();
expectTypeOf(layer.options).toEqualTypeOf<NotesLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"notes">();

expectTypeOf(layer.hookName).toEqualTypeOf<"NotesLayer">();
expectTypeOf(layer.interactiveChildren).toBeBoolean();

expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(layer.hintMapNotes()).toBeVoid();

declare const someNote: Note.ConfiguredInstance;
expectTypeOf(layer.panToNote(someNote)).toEqualTypeOf<Promise<void>>();
expectTypeOf(
  layer.panToNote(someNote, {
    duration: 2000,
    scale: 2,
  }),
).toEqualTypeOf<Promise<void>>();
expectTypeOf(
  layer.panToNote(someNote, {
    duration: undefined,
    scale: null,
  }),
).toEqualTypeOf<Promise<void>>();

declare const someEvent: PIXI.FederatedEvent;
declare const someDragEvent: DragEvent;
expectTypeOf(layer["_onClickLeft"](someEvent)).toEqualTypeOf<Promise<Note.ConfiguredInstance | void>>();

expectTypeOf(
  layer["_onDropData"](someDragEvent, {
    anchor: { name: "foo " },
    type: "JournalEntryPage",
    uuid: "someUUID",
    x: 50,
    y: 50,
  }),
).toEqualTypeOf<Promise<false | Note.ConfiguredInstance>>();
expectTypeOf(
  layer["_onDropData"](someDragEvent, {
    type: "JournalEntry",
    uuid: "someUUID",
    x: 50,
    y: 50,
  }),
).toEqualTypeOf<Promise<false | Note.ConfiguredInstance>>();
