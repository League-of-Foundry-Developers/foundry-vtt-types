import { expectTypeOf, test } from "vitest";
import { ol, ul, li } from "../../../../../src/foundry/common/prosemirror/schema/lists.mts";
import type { NodeSpec } from "prosemirror-model";

test("foundry/common/prosemirror/schema/lists", () => {
  expectTypeOf(ol).toEqualTypeOf<NodeSpec>();

  expectTypeOf(ul).toEqualTypeOf<NodeSpec>();

  expectTypeOf(li).toEqualTypeOf<NodeSpec>();
});
