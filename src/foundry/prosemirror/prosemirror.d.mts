import * as collab from "prosemirror-collab";
import { keymap } from "prosemirror-keymap";
import { DOMParser, DOMSerializer, Schema } from "prosemirror-model";
import type { Plugin, PluginKey } from "prosemirror-state";
import { AllSelection, TextSelection, EditorState } from "prosemirror-state";
import { Step } from "prosemirror-transform";
import { EditorView } from "prosemirror-view";
import ProseMirrorContentLinkPlugin from "./content-link-plugin.mts";
import ProseMirrorDirtyPlugin from "./dirty-plugin.mts";
import "./extensions.d.mts";
import ProseMirrorImagePlugin from "./image-plugin.mts";
import ProseMirrorInputRules from "./input-rules.mts";
import ProseMirrorKeyMaps from "./keymaps.mts";
import ProseMirrorMenu from "./menu.mts";
import { schema as defaultSchema } from "./schema.mts";
import type { parseHTMLString, serializeHTMLString } from "./util.d.mts";
import type ProseMirrorPlugin from "./plugin.d.mts";
import type ProseMirrorHighlightMatchesPlugin from "./highlight-matches-plugin.d.mts";
import type ProseMirrorClickHandler from "./click-handler.d.mts";

declare const dom: {
  parser: DOMParser;
  serializer: DOMSerializer;
  parseString: typeof parseHTMLString;
  serializeString: typeof serializeHTMLString;
};

declare const defaultPlugins: Record<
  | "inputRules"
  | "keyMaps"
  | "images"
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
  Plugin
>;

export * as commands from "prosemirror-commands";
export * as transform from "prosemirror-transform";
export * as list from "prosemirror-schema-list";
export * as tables from "prosemirror-tables";
export * as input from "prosemirror-inputrules";
export * as state from "prosemirror-state";

export {
  AllSelection,
  TextSelection,
  DOMParser,
  DOMSerializer,
  EditorState,
  EditorView,
  Schema,
  Step,
  Plugin,
  PluginKey,
  ProseMirrorPlugin,
  ProseMirrorContentLinkPlugin,
  ProseMirrorHighlightMatchesPlugin,
  ProseMirrorDirtyPlugin,
  ProseMirrorImagePlugin,
  ProseMirrorClickHandler,
  ProseMirrorInputRules,
  ProseMirrorKeyMaps,
  ProseMirrorMenu,
  collab,
  defaultPlugins,
  defaultSchema,
  dom,
  keymap,
};
