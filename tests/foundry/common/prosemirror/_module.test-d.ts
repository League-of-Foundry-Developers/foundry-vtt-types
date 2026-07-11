import { expectTypeOf } from "vitest";
import type { Schema, DOMParser, DOMSerializer, NodeSpec, MarkSpec } from "prosemirror-model";
import type { Step } from "prosemirror-transform";
import type { EditorView } from "prosemirror-view";
import { keymap } from "prosemirror-keymap";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { history } from "prosemirror-history";
import * as collab from "prosemirror-collab";
import * as commands from "prosemirror-commands";
import * as input from "prosemirror-inputrules";
import * as tables from "@massifrg/prosemirror-tables-sections";
import * as state from "prosemirror-state";
import * as transform from "prosemirror-transform";
import * as list from "prosemirror-schema-list";
import * as chat from "../../../../src/foundry/common/prosemirror/chat/_module.mts";
import DisclosureWidget from "../../../../src/foundry/common/prosemirror/schema/disclosure.mts";
import type { nodes, marks } from "../../../../src/foundry/common/prosemirror/schema.d.mts";

// Import necessary as this is otherwise inaccessible.
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
expectTypeOf(foundry.prosemirror.plugins).toEqualTypeOf<{
  ProseMirrorPlugin: typeof foundry.prosemirror.ProseMirrorPlugin;
  ProseMirrorContentLinkPlugin: typeof foundry.prosemirror.ProseMirrorContentLinkPlugin;
  ProseMirrorHighlightMatchesPlugin: typeof foundry.prosemirror.ProseMirrorHighlightMatchesPlugin;
  ProseMirrorDirtyPlugin: typeof foundry.prosemirror.ProseMirrorDirtyPlugin;
  ProseMirrorImagePlugin: typeof foundry.prosemirror.ProseMirrorImagePlugin;
  ProseMirrorClickHandler: typeof foundry.prosemirror.ProseMirrorClickHandler;
  ProseMirrorPasteTransformer: typeof foundry.prosemirror.ProseMirrorPasteTransformer;
  ProseMirrorInputRules: typeof foundry.prosemirror.ProseMirrorInputRules;
  ProseMirrorKeyMaps: typeof foundry.prosemirror.ProseMirrorKeyMaps;
  ProseMirrorMenu: typeof foundry.prosemirror.ProseMirrorMenu;
  ProseMirrorDropDown: typeof foundry.prosemirror.ProseMirrorDropDown;
  chat: typeof chat;
  dropCursor: typeof dropCursor;
  gapCursor: typeof gapCursor;
  history: typeof history;
  keymap: typeof keymap;
}>();
expectTypeOf(foundry.prosemirror.nodeViews.details).toEqualTypeOf<typeof DisclosureWidget.view>();

expectTypeOf(foundry.prosemirror.defaultSchema).toEqualTypeOf<Schema<keyof typeof nodes, keyof typeof marks>>();
expectTypeOf(foundry.prosemirror.dom).toEqualTypeOf<{
  parser: DOMParser;
  serializer: DOMSerializer;
  parseString: typeof parseHTMLString;
  serializeString: typeof serializeHTMLString;
}>();
expectTypeOf(foundry.prosemirror.keymap).toEqualTypeOf<typeof keymap>();

expectTypeOf<(typeof nodes)["header"]>().toEqualTypeOf<NodeSpec>();
expectTypeOf<(typeof nodes)["main"]>().toEqualTypeOf<NodeSpec>();
expectTypeOf<(typeof nodes)["section"]>().toEqualTypeOf<NodeSpec>();
expectTypeOf<(typeof nodes)["div"]>().toEqualTypeOf<NodeSpec>();
expectTypeOf<(typeof nodes)["address"]>().toEqualTypeOf<NodeSpec>();
expectTypeOf<(typeof marks)["abbr"]>().toEqualTypeOf<MarkSpec>();
expectTypeOf<(typeof marks)["mark"]>().toEqualTypeOf<MarkSpec>();
expectTypeOf<(typeof marks)["q"]>().toEqualTypeOf<MarkSpec>();
expectTypeOf<(typeof marks)["time"]>().toEqualTypeOf<MarkSpec>();
expectTypeOf<(typeof marks)["ins"]>().toEqualTypeOf<MarkSpec>();
