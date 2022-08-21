import { EditorState, AllSelection, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser, DOMSerializer } from "prosemirror-model";
import ProseMirrorInputRules from "./input-rules.mjs";
import { keymap } from "prosemirror-keymap";
import ProseMirrorKeyMaps from "./keymaps.mjs";
import ProseMirrorMenu from "./menu.mjs";
import "./extensions";
import * as collab from "prosemirror-collab";
import { Step } from "prosemirror-transform";
import { parseHTMLString, serializeHTMLString } from "./util.mjs";
import { schema as defaultSchema } from "./schema.mjs";
import ProseMirrorImagePlugin from "./image-plugin.mjs";
import ProseMirrorDirtyPlugin from "./dirty-plugin.mjs";
import ProseMirrorContentLinkPlugin from "./content-link-plugin.mjs";

declare const dom: {
  parser: DOMParser;
  serializer: DOMSerializer;
  parseString: typeof parseHTMLString;
  serializeString: typeof serializeHTMLString;
};

declare const defaultPlugins: Record<
  "inputRules" | "keyMaps" | "images" | "menu" | "isDirty" | "baseKeyMap" | "dropCursor" | "gapCursor" | "history",
  Plugin
>;

export * as commands from "prosemirror-commands";
export * as transform from "prosemirror-transform";
export * as list from "prosemirror-schema-list";

export {
  EditorState,
  EditorView,
  Schema,
  DOMParser,
  DOMSerializer,
  defaultSchema,
  dom,
  defaultPlugins,
  collab,
  Step,
  AllSelection,
  ProseMirrorMenu,
  ProseMirrorDirtyPlugin,
  ProseMirrorContentLinkPlugin,
  ProseMirrorInputRules,
  ProseMirrorKeyMaps,
  ProseMirrorImagePlugin,
  keymap
};
