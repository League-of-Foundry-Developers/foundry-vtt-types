import { expectTypeOf } from "vitest";

import JournalEntryPageProseMirrorSheet = foundry.applications.sheets.journal.JournalEntryPageProseMirrorSheet;
import JournalEntryPageTextSheet = foundry.applications.sheets.journal.JournalEntryPageTextSheet;
import JournalEntryPageSheet = foundry.applications.sheets.journal.JournalEntryPageSheet;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import HTMLProseMirrorElement = foundry.applications.elements.HTMLProseMirrorElement;
import type { DeepPartial } from "fvtt-types/utils";
import type { Plugin } from "prosemirror-state";

declare const sheet: JournalEntryPageProseMirrorSheet;
declare const renderOptions: DeepPartial<JournalEntryPageProseMirrorSheet.RenderOptions>;
declare const pluginsEvent: HTMLProseMirrorElement.PluginsEvent;

expectTypeOf(JournalEntryPageProseMirrorSheet.DEFAULT_OPTIONS).toEqualTypeOf<JournalEntryPageSheet.DefaultOptions>();
expectTypeOf(JournalEntryPageProseMirrorSheet.EDIT_PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(JournalEntryPageProseMirrorSheet.VIEW_PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

// This override genuinely returns `true`, which is why `DocumentSheetV2#_canRender` is `boolean | void` rather
// than `false | void`.
expectTypeOf(sheet["_canRender"](renderOptions)).toEqualTypeOf<boolean>();

// `undefined` in view mode, where there is no `prose-mirror` element to query.
expectTypeOf(sheet["_isEditorDirty"]()).toEqualTypeOf<boolean | undefined>();

expectTypeOf(sheet["_prepareContentContext"]).returns.toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_attachFrameListeners"]()).toEqualTypeOf<void>();
expectTypeOf(sheet._onAutosave("<p>content</p>")).toEqualTypeOf<void>();
expectTypeOf(sheet._onNewSteps()).toEqualTypeOf<void>();

// `ProseMirrorPluginsEvent` is not exported by Foundry, so only its interface is described.
expectTypeOf(sheet["_onConfigurePlugins"](pluginsEvent)).toEqualTypeOf<void>();
expectTypeOf(pluginsEvent.plugins).toEqualTypeOf<Record<string, Plugin>>();

expectTypeOf<JournalEntryPageProseMirrorSheet.TextContext>().toExtend<JournalEntryPageTextSheet.TextContext>();

// Only added in view mode.
expectTypeOf<JournalEntryPageProseMirrorSheet.TextContext["enriched"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<
  JournalEntryPageProseMirrorSheet.RenderContext["text"]
>().toEqualTypeOf<JournalEntryPageProseMirrorSheet.TextContext>();
