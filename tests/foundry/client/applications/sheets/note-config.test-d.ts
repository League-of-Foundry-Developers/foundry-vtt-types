import { expectTypeOf } from "vitest";

import NoteConfig = foundry.applications.sheets.NoteConfig;
import PlaceableConfig = foundry.applications.sheets.PlaceableConfig;

declare const doc: NoteDocument.Implementation;
const noteConfig = new NoteConfig({ document: doc });

expectTypeOf(noteConfig.document).toEqualTypeOf<NoteDocument.Implementation>();
expectTypeOf(noteConfig.title).toBeString();

expectTypeOf(NoteConfig.DEFAULT_OPTIONS).toEqualTypeOf<PlaceableConfig.DefaultOptions>();

declare const context: NoteConfig.RenderContext;
expectTypeOf(context.author).toBeString();
expectTypeOf(context.entries).toEqualTypeOf<NoteConfig.JournalEntryChoice[]>();
expectTypeOf(context.entry).toEqualTypeOf<JournalEntry.Implementation | null>();
expectTypeOf(context.pages).toEqualTypeOf<Record<string, string>>();
expectTypeOf(context.global).toBeBoolean();
expectTypeOf(context.icon).toEqualTypeOf<NoteConfig.IconContext>();
expectTypeOf(context.icon.field).toEqualTypeOf<foundry.data.fields.StringField>();
expectTypeOf(context.textAnchors).toEqualTypeOf<Record<CONST.TEXT_ANCHOR_POINTS, string>>();
