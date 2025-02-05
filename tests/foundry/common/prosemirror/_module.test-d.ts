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

expectTypeOf(foundry.prosemirror).toEqualTypeOf<typeof ProseMirror>();

expectTypeOf(ProseMirror.commands).toEqualTypeOf<typeof commands>();
expectTypeOf(ProseMirror.transform).toEqualTypeOf<typeof transform>();
expectTypeOf(ProseMirror.list).toEqualTypeOf<typeof list>();
expectTypeOf(ProseMirror.tables).toEqualTypeOf<typeof tables>();
expectTypeOf(ProseMirror.input).toEqualTypeOf<typeof input>();
expectTypeOf(ProseMirror.state).toEqualTypeOf<typeof state>();

expectTypeOf(ProseMirror.AllSelection).toEqualTypeOf<typeof state.AllSelection>();
expectTypeOf(ProseMirror.TextSelection).toEqualTypeOf<typeof state.TextSelection>();
expectTypeOf(ProseMirror.DOMParser).toEqualTypeOf<typeof DOMParser>();
expectTypeOf(ProseMirror.DOMSerializer).toEqualTypeOf<typeof DOMSerializer>();
expectTypeOf(ProseMirror.EditorState).toEqualTypeOf<typeof state.EditorState>();
expectTypeOf(ProseMirror.EditorView).toEqualTypeOf<typeof EditorView>();
expectTypeOf(ProseMirror.Schema).toEqualTypeOf<typeof Schema>();
expectTypeOf(ProseMirror.Step).toEqualTypeOf<typeof Step>();
expectTypeOf(ProseMirror.Plugin).toEqualTypeOf<typeof state.Plugin>();
expectTypeOf(ProseMirror.PluginKey).toEqualTypeOf<typeof state.PluginKey>();
expectTypeOf(ProseMirror.ProseMirrorPlugin).toEqualTypeOf<typeof ProseMirrorPlugin>();
expectTypeOf(ProseMirror.ProseMirrorContentLinkPlugin).toEqualTypeOf<typeof ProseMirrorContentLinkPlugin>();
expectTypeOf(ProseMirror.ProseMirrorHighlightMatchesPlugin).toEqualTypeOf<typeof ProseMirrorHighlightMatchesPlugin>();
expectTypeOf(ProseMirror.ProseMirrorDirtyPlugin).toEqualTypeOf<typeof ProseMirrorDirtyPlugin>();
expectTypeOf(ProseMirror.ProseMirrorImagePlugin).toEqualTypeOf<typeof ProseMirrorImagePlugin>();
expectTypeOf(ProseMirror.ProseMirrorClickHandler).toEqualTypeOf<typeof ProseMirrorClickHandler>();
expectTypeOf(ProseMirror.ProseMirrorInputRules).toEqualTypeOf<typeof ProseMirrorInputRules>();
expectTypeOf(ProseMirror.ProseMirrorKeyMaps).toEqualTypeOf<typeof ProseMirrorKeyMaps>();
expectTypeOf(ProseMirror.ProseMirrorMenu).toEqualTypeOf<typeof ProseMirrorMenu>();
expectTypeOf(ProseMirror.collab).toEqualTypeOf<typeof collab>();
expectTypeOf(ProseMirror.defaultPlugins).toEqualTypeOf<
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
expectTypeOf(ProseMirror.defaultSchema).toEqualTypeOf<Schema>();
expectTypeOf(ProseMirror.dom).toEqualTypeOf<{
  parser: DOMParser;
  serializer: DOMSerializer;
  parseString: typeof parseHTMLString;
  serializeString: typeof serializeHTMLString;
}>();
expectTypeOf(ProseMirror.keymap).toEqualTypeOf<typeof keymap>();
