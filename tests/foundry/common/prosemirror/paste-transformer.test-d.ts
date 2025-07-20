import { expectTypeOf } from "vitest";

import ProseMirrorPasteTransformer = foundry.prosemirror.ProseMirrorPasteTransformer;

declare const schema: foundry.prosemirror.Schema;

new ProseMirrorPasteTransformer(schema);

expectTypeOf(ProseMirrorPasteTransformer.build(schema)).toEqualTypeOf<foundry.prosemirror.Plugin>();
// options is unused
expectTypeOf(ProseMirrorPasteTransformer.build(schema, {})).toEqualTypeOf<foundry.prosemirror.Plugin>();
