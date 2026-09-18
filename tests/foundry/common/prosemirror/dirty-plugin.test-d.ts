import { expectTypeOf, test } from "vitest";

declare const schema: foundry.prosemirror.Schema;

test("foundry/common/prosemirror/dirty-plugin", () => {
  // options is unused
  expectTypeOf(
    foundry.prosemirror.ProseMirrorDirtyPlugin.build(schema, {}),
  ).toEqualTypeOf<foundry.prosemirror.Plugin>();
});
