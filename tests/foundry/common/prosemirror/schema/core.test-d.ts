import { expectTypeOf, test } from "vitest";
import {
  paragraph,
  blockquote,
  hr,
  heading,
  pre,
  br,
  icon,
} from "../../../../../src/foundry/common/prosemirror/schema/core.mts";
import type { NodeSpec } from "prosemirror-model";

test("foundry/common/prosemirror/schema/core", () => {
  expectTypeOf(paragraph).toEqualTypeOf<NodeSpec>();

  expectTypeOf(blockquote).toEqualTypeOf<NodeSpec>();

  expectTypeOf(hr).toEqualTypeOf<NodeSpec>();

  expectTypeOf(heading).toEqualTypeOf<NodeSpec>();

  expectTypeOf(pre).toEqualTypeOf<NodeSpec>();

  expectTypeOf(br).toEqualTypeOf<NodeSpec>();

  expectTypeOf(icon).toEqualTypeOf<NodeSpec>();
});
