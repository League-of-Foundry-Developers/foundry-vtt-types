import type { Schema } from 'prosemirror-model';
import type { EditorState } from 'prosemirror-state';
import { expectType } from 'tsd';

expectType<typeof EditorState>(ProseMirror.EditorState);
expectType<typeof Schema>(ProseMirror.Schema);
expectType<Schema>(ProseMirror.defaultSchema);
