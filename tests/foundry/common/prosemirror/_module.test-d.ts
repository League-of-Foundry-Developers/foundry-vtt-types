import { expectTypeOf } from "vitest";
import type { Schema, DOMParser, DOMSerializer } from "prosemirror-model";
import type { Step } from "prosemirror-transform";
import type { EditorView } from "prosemirror-view";
import { keymap } from "prosemirror-keymap";
import type ProseMirrorKeyMaps from "../../../../src/foundry/common/prosemirror/keymaps.d.mts";
import type ProseMirrorInputRules from "../../../../src/foundry/common/prosemirror/input-rules.d.mts";
import type ProseMirrorImagePlugin from "../../../../src/foundry/common/prosemirror/image-plugin.d.mts";
import type ProseMirrorHighlightMatchesPlugin from "../../../../src/foundry/common/prosemirror/highlight-matches-plugin.d.mts";
import type ProseMirrorClickHandler from "../../../../src/foundry/common/prosemirror/click-handler.d.mts";
import type ProseMirrorContentLinkPlugin from "../../../../src/foundry/common/prosemirror/content-link-plugin.d.mts";
import type ProseMirrorDirtyPlugin from "../../../../src/foundry/common/prosemirror/dirty-plugin.d.mts";
import type { parseHTMLString, serializeHTMLString } from "../../../../src/foundry/common/prosemirror/util.d.mts";
import * as collab from "prosemirror-collab";
import * as commands from "prosemirror-commands";
import * as input from "prosemirror-inputrules";
import * as tables from "prosemirror-tables";
import * as state from "prosemirror-state";
import * as transform from "prosemirror-transform";
import * as list from "prosemirror-schema-list";
import type ProseMirrorMenu from "../../../../src/foundry/common/prosemirror/menu.d.mts";
import type ProseMirrorPlugin from "../../../../src/foundry/common/prosemirror/plugin.d.mts";
import { nodes, marks } from "#common/prosemirror/schema.mjs";

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
expectTypeOf(foundry.prosemirror.ProseMirrorPlugin).toEqualTypeOf<typeof ProseMirrorPlugin>();
expectTypeOf(foundry.prosemirror.ProseMirrorContentLinkPlugin).toEqualTypeOf<typeof ProseMirrorContentLinkPlugin>();
expectTypeOf(foundry.prosemirror.ProseMirrorHighlightMatchesPlugin).toEqualTypeOf<
  typeof ProseMirrorHighlightMatchesPlugin
>();
expectTypeOf(foundry.prosemirror.ProseMirrorDirtyPlugin).toEqualTypeOf<typeof ProseMirrorDirtyPlugin>();
expectTypeOf(foundry.prosemirror.ProseMirrorImagePlugin).toEqualTypeOf<typeof ProseMirrorImagePlugin>();
expectTypeOf(foundry.prosemirror.ProseMirrorClickHandler).toEqualTypeOf<typeof ProseMirrorClickHandler>();
expectTypeOf(foundry.prosemirror.ProseMirrorInputRules).toEqualTypeOf<typeof ProseMirrorInputRules>();
expectTypeOf(foundry.prosemirror.ProseMirrorKeyMaps).toEqualTypeOf<typeof ProseMirrorKeyMaps>();
expectTypeOf(foundry.prosemirror.ProseMirrorMenu).toEqualTypeOf<typeof ProseMirrorMenu>();
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
