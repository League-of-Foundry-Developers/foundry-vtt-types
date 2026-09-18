import { expectTypeOf, test } from "vitest";
import type { NodeSpec } from "prosemirror-model";
import { selection } from "../../../../../src/foundry/common/prosemirror/schema/inserts.mts";

test("foundry/common/prosemirror/schema/inserts", () => {
  expectTypeOf(selection).toEqualTypeOf<NodeSpec>();
});
