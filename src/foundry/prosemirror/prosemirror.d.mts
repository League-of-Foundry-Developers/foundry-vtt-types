import * as collab from "prosemirror-collab";
import { keymap } from "prosemirror-keymap";
import { DOMParser, DOMSerializer, Schema } from "prosemirror-model";
import type { Plugin } from "prosemirror-state";
import { AllSelection, EditorState } from "prosemirror-state";
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
export * as list from "prosemirror-schema-list";
export * as transform from "prosemirror-transform";

export {
  AllSelection,
  DOMParser,
  DOMSerializer,
  EditorState,
  EditorView,
  ProseMirrorContentLinkPlugin,
  ProseMirrorDirtyPlugin,
  ProseMirrorImagePlugin,
  ProseMirrorInputRules,
  ProseMirrorKeyMaps,
  ProseMirrorMenu,
  Schema,
  Step,
  collab,
  defaultPlugins,
  defaultSchema,
  dom,
  keymap,
};
