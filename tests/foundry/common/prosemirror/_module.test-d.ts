import { expectTypeOf } from "vitest";
import type { Schema, DOMParser, DOMSerializer } from "prosemirror-model";
import type { Step } from "prosemirror-transform";
import type { EditorView } from "prosemirror-view";
import { keymap } from "prosemirror-keymap";
import * as collab from "prosemirror-collab";
import * as commands from "prosemirror-commands";
import * as input from "prosemirror-inputrules";
import * as tables from "prosemirror-tables";
import * as state from "prosemirror-state";
import * as transform from "prosemirror-transform";
import * as list from "prosemirror-schema-list";
import { nodes, marks } from "#common/prosemirror/schema.mjs";

// Import necessary as this is otherwise inaccessible.
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import type { parseHTMLString, serializeHTMLString } from "../../../../src/foundry/common/prosemirror/util.d.mts";

expectTypeOf(foundry.prosemirror.commands).toEqualTypeOf<typeof commands>();
expectTypeOf(foundry.prosemirror.transform).toEqualTypeOf<typeof transform>();
expectTypeOf(foundry.prosemirror.list).toEqualTypeOf<typeof list>();
expectTypeOf(foundry.prosemirror.tables).toEqualTypeOf<typeof tables>();
expectTypeOf(foundry.prosemirror.input).toEqualTypeOf<typeof input>();
expectTypeOf(foundry.prosemirror.state).toEqualTypeOf<typeof state>();

expectTypeOf(foundry.prosemirror.AllSelection).toEqualTypeOf<typeof state.AllSelection>();
expectTypeOf(foundry.prosemirror.TextSelection).toEqualTypeOf<typeof state.TextSelection>();
expectTypeOf(foundry.prosemirror.DOMParser).toEqualTypeOf<typeof DOMParser>();
expectTypeOf(foundry.prosemirror.DOMSerializer).toEqualTypeOf<typeof DOMSerializer>();
expectTypeOf(foundry.prosemirror.EditorState).toEqualTypeOf<typeof state.EditorState>();
expectTypeOf(foundry.prosemirror.EditorView).toEqualTypeOf<typeof EditorView>();
expectTypeOf(foundry.prosemirror.Schema).toEqualTypeOf<typeof Schema>();
expectTypeOf(foundry.prosemirror.Step).toEqualTypeOf<typeof Step>();
expectTypeOf(foundry.prosemirror.Plugin).toEqualTypeOf<typeof state.Plugin>();
expectTypeOf(foundry.prosemirror.PluginKey).toEqualTypeOf<typeof state.PluginKey>();
expectTypeOf(foundry.prosemirror.collab).toEqualTypeOf<typeof collab>();
expectTypeOf(foundry.prosemirror.defaultPlugins).toEqualTypeOf<
  Record<
    | "inputRules"
    | "keyMaps"
    | "menu"
    | "isDirty"
    | "clickHandler"
    | "pasteTransformer"
    | "baseKeyMap"
    | "dropCursor"
    | "gapCursor"
    | "history"
    | "columnResizing"
    | "tables",
    state.Plugin
  >
>();

expectTypeOf(foundry.prosemirror.defaultSchema).toEqualTypeOf<Schema<keyof typeof nodes, keyof typeof marks>>();
expectTypeOf(foundry.prosemirror.dom).toEqualTypeOf<{
  parser: DOMParser;
  serializer: DOMSerializer;
  parseString: typeof parseHTMLString;
  serializeString: typeof serializeHTMLString;
}>();
expectTypeOf(foundry.prosemirror.keymap).toEqualTypeOf<typeof keymap>();
