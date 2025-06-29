/* eslint-disable import-x/extensions */
import { expectTypeOf } from "vitest";
import ProseMirrorPasteTransformer from "../../../../src/foundry/common/prosemirror/paste-transformer.mjs";

declare const schema: foundry.prosemirror.Schema;

new ProseMirrorPasteTransformer(schema);

expectTypeOf(ProseMirrorPasteTransformer.build(schema)).toEqualTypeOf<foundry.prosemirror.Plugin>();
// options is unused
expectTypeOf(ProseMirrorPasteTransformer.build(schema, {})).toEqualTypeOf<foundry.prosemirror.Plugin>();
