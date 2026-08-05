import { expectTypeOf } from "vitest";

import JournalEntryPageCodeMirrorSheet = foundry.applications.sheets.journal.JournalEntryPageCodeMirrorSheet;
import JournalEntryPageTextSheet = foundry.applications.sheets.journal.JournalEntryPageTextSheet;
import JournalEntryPageSheet = foundry.applications.sheets.journal.JournalEntryPageSheet;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import type { AnyObject } from "fvtt-types/utils";

declare const sheet: JournalEntryPageCodeMirrorSheet;
declare const dragEvent: DragEvent;
declare const eventData: AnyObject;
declare const newElement: HTMLElement;
declare const priorElement: HTMLElement;
declare const state: JournalEntryPageCodeMirrorSheet.PartState;

expectTypeOf(JournalEntryPageCodeMirrorSheet.DEFAULT_OPTIONS).toEqualTypeOf<JournalEntryPageSheet.DefaultOptions>();
expectTypeOf(JournalEntryPageCodeMirrorSheet.VIEW_PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf(sheet["_prepareContentContext"]).returns.toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_preSyncPartState"]("content", newElement, priorElement, state)).toEqualTypeOf<void>();
expectTypeOf(sheet["_syncPartState"]("content", newElement, priorElement, state)).toEqualTypeOf<void>();
expectTypeOf(sheet["_attachFrameListeners"]()).toEqualTypeOf<void>();

// Returns early without a promise when the drop did not land on a `code-mirror` element.
expectTypeOf(sheet["_onDrop"](dragEvent)).toEqualTypeOf<void | Promise<void>>();
expectTypeOf(sheet["_onDropContentLink"](dragEvent, eventData)).toEqualTypeOf<Promise<void>>();

// Unlike the ProseMirror sheet, this one always has an editor to query.
expectTypeOf(sheet["_isEditorDirty"]()).toEqualTypeOf<boolean>();

// The part state is extended with the editor's cursor position; `null` when the part had no `code-mirror` element.
expectTypeOf<JournalEntryPageCodeMirrorSheet.PartState>().toExtend<HandlebarsApplicationMixin.PartState>();
expectTypeOf<JournalEntryPageCodeMirrorSheet.PartState["cursor"]>().toEqualTypeOf<number | null | undefined>();

expectTypeOf<JournalEntryPageCodeMirrorSheet.TextContext>().toExtend<JournalEntryPageTextSheet.TextContext>();
expectTypeOf<JournalEntryPageCodeMirrorSheet.TextContext["enriched"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<
  JournalEntryPageCodeMirrorSheet.RenderContext["text"]
>().toEqualTypeOf<JournalEntryPageCodeMirrorSheet.TextContext>();
