// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.

import { EditorState, AllSelection, TextSelection, Plugin, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMSerializer } from "prosemirror-model";
import ProseMirrorInputRules from "./input-rules.mjs";
import { keymap } from "prosemirror-keymap";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { history } from "prosemirror-history";
import ProseMirrorKeyMaps from "./keymaps.mjs";
import ProseMirrorMenu from "./menu.mjs";
import ProseMirrorDropDown from "./dropdown.mjs";
import "./extensions.mjs";
import * as collab from "prosemirror-collab";
import { Step } from "prosemirror-transform";
import { parseHTMLString, serializeHTMLString } from "./util.mjs";
// A const is being imported here. It can't be `import type`.
import { schema as defaultSchema } from "./schema.mjs";
import ProseMirrorPlugin from "./plugin.mjs";
import ProseMirrorImagePlugin from "./image-plugin.mjs";
import ProseMirrorDirtyPlugin from "./dirty-plugin.mjs";
import ProseMirrorContentLinkPlugin from "./content-link-plugin.mjs";
import ProseMirrorHighlightMatchesPlugin from "./highlight-matches-plugin.mjs";
import ProseMirrorClickHandler from "./click-handler.mjs";
import DOMParser from "./dom-parser.mjs";
import ProseMirrorPasteTransformer from "./paste-transformer.mjs";
import DisclosureWidget from "./schema/disclosure.mjs";
import * as chat from "./chat/_module.mjs";

declare const dom: Dom;

interface Dom {
  parser: DOMParser;
  serializer: DOMSerializer;
  parseString: typeof parseHTMLString;
  serializeString: typeof serializeHTMLString;
}

declare const plugins: Plugins;
declare const nodeViews: NodeViews;

interface Plugins {
  ProseMirrorPlugin: typeof ProseMirrorPlugin;
  ProseMirrorContentLinkPlugin: typeof ProseMirrorContentLinkPlugin;
  ProseMirrorHighlightMatchesPlugin: typeof ProseMirrorHighlightMatchesPlugin;
  ProseMirrorDirtyPlugin: typeof ProseMirrorDirtyPlugin;
  ProseMirrorImagePlugin: typeof ProseMirrorImagePlugin;
  ProseMirrorClickHandler: typeof ProseMirrorClickHandler;
  ProseMirrorPasteTransformer: typeof ProseMirrorPasteTransformer;
  ProseMirrorInputRules: typeof ProseMirrorInputRules;
  ProseMirrorKeyMaps: typeof ProseMirrorKeyMaps;
  ProseMirrorMenu: typeof ProseMirrorMenu;
  ProseMirrorDropDown: typeof ProseMirrorDropDown;
  chat: typeof chat;
  dropCursor: typeof dropCursor;
  gapCursor: typeof gapCursor;
  history: typeof history;
  keymap: typeof keymap;
}

interface NodeViews {
  details: typeof DisclosureWidget.view;
  [nodeName: string]: unknown;
}

export * as commands from "prosemirror-commands";
export * as transform from "prosemirror-transform";
export * as list from "prosemirror-schema-list";
export * as tables from "@massifrg/prosemirror-tables-sections";
export * as input from "prosemirror-inputrules";
export * as state from "prosemirror-state";

export * as types from "./_types.mjs";

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
  ProseMirrorPasteTransformer,
  ProseMirrorInputRules,
  ProseMirrorKeyMaps,
  ProseMirrorMenu,
  ProseMirrorDropDown,
  collab,
  plugins,
  nodeViews,
  defaultSchema,
  dom,
  keymap,
};
