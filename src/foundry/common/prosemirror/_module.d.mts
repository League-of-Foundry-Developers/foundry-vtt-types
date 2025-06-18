// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

import type { EditorState, AllSelection, TextSelection, Plugin, PluginKey } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import type { Schema, DOMSerializer } from "prosemirror-model";
import type ProseMirrorInputRules from "./input-rules.mjs";
import type { keymap } from "prosemirror-keymap";
// this is used in defaultPlugins, below, as `baseKeyMap: keymap(baseKeymap)`, but is irrelevant to the types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { baseKeymap } from "prosemirror-commands";
import type { dropCursor } from "prosemirror-dropcursor";
import type { gapCursor } from "prosemirror-gapcursor";
import type { history } from "prosemirror-history";
import type ProseMirrorKeyMaps from "./keymaps.mjs";
import type ProseMirrorMenu from "./menu.mjs";
import type ProseMirrorDropDown from "./dropdown.mjs";
import "./extensions.mjs";
import type * as collab from "prosemirror-collab";
import type { Step } from "prosemirror-transform";
import type { parseHTMLString, serializeHTMLString } from "./util.d.mts";
// A const is being imported here. It can't be `import type`.
import { schema as defaultSchema } from "./schema.mjs";
import type ProseMirrorPlugin from "./plugin.mjs";
import type ProseMirrorImagePlugin from "./image-plugin.mjs";
import type ProseMirrorDirtyPlugin from "./dirty-plugin.mjs";
import type ProseMirrorContentLinkPlugin from "./content-link-plugin.mjs";
import type ProseMirrorHighlightMatchesPlugin from "./highlight-matches-plugin.mjs";
import type ProseMirrorClickHandler from "./click-handler.mjs";
import type { columnResizing, tableEditing } from "prosemirror-tables";
import type DOMParser from "./dom-parser.mjs";
import type ProseMirrorPasteTransformer from "./paste-transformer.mjs";

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
