import { EditorState, AllSelection, TextSelection, Plugin, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMSerializer } from "prosemirror-model";
import { keymap } from "prosemirror-keymap";
import "./extensions.d.mts";
import * as collab from "prosemirror-collab";
import type { parseHTMLString, serializeHTMLString } from "./util.d.mts";

// A const is being imported here. It can't be `import type`.
/* eslint-disable import-x/extensions */
import { schema as defaultSchema } from "./schema.mjs";

// and these are classes that are available as properties of ProseMirror
import ProseMirrorPlugin from "./plugin.mjs";
import ProseMirrorImagePlugin from "./image-plugin.mjs";
import ProseMirrorDirtyPlugin from "./dirty-plugin.mjs";
import ProseMirrorContentLinkPlugin from "./content-link-plugin.mjs";
import ProseMirrorHighlightMatchesPlugin from "./highlight-matches-plugin.mjs";
import ProseMirrorClickHandler from "./click-handler.mjs";
import DOMParser from "./dom-parser.mjs";
import ProseMirrorInputRules from "./input-rules.mjs";
import ProseMirrorKeyMaps from "./keymaps.mjs";
import ProseMirrorMenu from "./menu.mjs";
import { Step } from "prosemirror-transform";
/* eslint-enable */

declare const dom: {
  parser: DOMParser;
  serializer: DOMSerializer;
  parseString: typeof parseHTMLString;
  serializeString: typeof serializeHTMLString;
};

declare const defaultPlugins: Record<
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
