import { expectTypeOf, test } from "vitest";

import ProseMirrorPasteTransformer = foundry.prosemirror.ProseMirrorPasteTransformer;

declare const schema: foundry.prosemirror.Schema;

test("foundry/common/prosemirror/paste-transformer", () => {
  new ProseMirrorPasteTransformer(schema);

  expectTypeOf(ProseMirrorPasteTransformer.build(schema)).toEqualTypeOf<foundry.prosemirror.Plugin>();
  // options is unused
  expectTypeOf(ProseMirrorPasteTransformer.build(schema, {})).toEqualTypeOf<foundry.prosemirror.Plugin>();
});
