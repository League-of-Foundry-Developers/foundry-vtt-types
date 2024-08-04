import { EditorState, AllSelection, TextSelection, Plugin, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMSerializer } from "prosemirror-model";
// eslint-disable-next-line import/no-named-as-default
import type ProseMirrorInputRules from "./input-rules.d.mts";
import { keymap } from "prosemirror-keymap";
// eslint-disable-next-line import/no-named-as-default
import type ProseMirrorKeyMaps from "./keymaps.d.mts";
// eslint-disable-next-line import/no-named-as-default
import type ProseMirrorMenu from "./menu.d.mts";
import "./extensions.d.mts";
import * as collab from "prosemirror-collab";
import { Step } from "prosemirror-transform";
import type { parseHTMLString, serializeHTMLString } from "./util.d.mts";
import type { schema as defaultSchema } from "./schema.d.mts";
import type ProseMirrorPlugin from "./plugin.d.mts";
import type ProseMirrorImagePlugin from "./image-plugin.d.mts";
import type ProseMirrorDirtyPlugin from "./dirty-plugin.d.mts";
import type ProseMirrorContentLinkPlugin from "./content-link-plugin.d.mts";
import type ProseMirrorHighlightMatchesPlugin from "./highlight-matches-plugin.d.mts";
import type ProseMirrorClickHandler from "./click-handler.d.mts";
import type DOMParser from "./dom-parser.d.mts";

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

// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import/extensions */
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
