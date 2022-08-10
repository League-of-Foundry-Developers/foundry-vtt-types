import { EditorState, AllSelection, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model';
import ProseMirrorInputRules from './input-rules';
import ProseMirrorKeyMaps from './keymaps';
import ProseMirrorMenu from './menu';
import './extensions';
import * as collab from 'prosemirror-collab';
import { Step } from 'prosemirror-transform';
import { parseHTMLString, serializeHTMLString } from './util';
import { schema as defaultSchema } from './schema';
import ProseMirrorImagePlugin from './image-plugin';
import ProseMirrorDirtyPlugin from './dirty-plugin';
import ProseMirrorContentLinkPlugin from './content-link-plugin';

declare const dom: {
  parser: DOMParser;
  serializer: DOMSerializer;
  parseString: typeof parseHTMLString;
  serializeString: typeof serializeHTMLString;
};

declare const defaultPlugins: Record<
  'inputRules' | 'keyMaps' | 'images' | 'menu' | 'isDirty' | 'baseKeyMap' | 'dropCursor' | 'gapCursor' | 'history',
  Plugin
>;

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
  ProseMirrorImagePlugin
};
