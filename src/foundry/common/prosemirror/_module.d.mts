// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

import { EditorState, AllSelection, TextSelection, Plugin, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMSerializer } from "prosemirror-model";
import ProseMirrorInputRules from "./input-rules.mjs";
import { keymap } from "prosemirror-keymap";
// this is used in defaultPlugins, below, as `baseKeyMap: keymap(baseKeymap)`, but is irrelevant to the types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { baseKeymap } from "prosemirror-commands";
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
import { columnResizing, tableEditing } from "prosemirror-tables";
import DOMParser from "./dom-parser.mjs";
import ProseMirrorPasteTransformer from "./paste-transformer.mjs";

declare const dom: {
  parser: DOMParser;
  serializer: DOMSerializer;
  parseString: typeof parseHTMLString;
  serializeString: typeof serializeHTMLString;
};

declare const defaultPlugins: {
  inputRules: ReturnType<typeof ProseMirrorInputRules.build>;
  keyMaps: ReturnType<typeof ProseMirrorKeyMaps.build>;
  menu: ReturnType<typeof ProseMirrorMenu.build>;
  isDirty: ReturnType<typeof ProseMirrorDirtyPlugin.build>;
  clickHandler: ReturnType<typeof ProseMirrorClickHandler.build>;
  pasteTransformer: ReturnType<typeof ProseMirrorPasteTransformer.build>;
  baseKeyMap: ReturnType<typeof keymap>;
  dropCursor: ReturnType<typeof dropCursor>;
  gapCursor: ReturnType<typeof gapCursor>;
  history: ReturnType<typeof history>;
  columnResizing: ReturnType<typeof columnResizing>;
  tables: ReturnType<typeof tableEditing>;
};

export * as commands from "prosemirror-commands";
export * as transform from "prosemirror-transform";
export * as list from "prosemirror-schema-list";
export * as tables from "prosemirror-tables";
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
  defaultPlugins,
  defaultSchema,
  dom,
  keymap,
};
