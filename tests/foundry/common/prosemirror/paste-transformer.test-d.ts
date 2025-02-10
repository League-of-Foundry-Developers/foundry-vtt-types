/* eslint-disable import-x/extensions */
import { expectTypeOf } from "vitest";
import ProseMirrorPasteTransformer from "../../../../src/foundry/common/prosemirror/paste-transformer.mjs";
import { Slice } from "prosemirror-model";
import type { EditorView } from "prosemirror-view";

declare const schema: foundry.prosemirror.Schema;

const pasteTransformer = new ProseMirrorPasteTransformer(schema);

declare const slice: Slice;
declare const view: EditorView;
expectTypeOf(pasteTransformer._onPaste(slice, view)).toEqualTypeOf<Slice>();

expectTypeOf(ProseMirrorPasteTransformer.build(schema, {})).toEqualTypeOf<foundry.prosemirror.Plugin>();
