import { expectTypeOf } from "vitest";
import { paragraph, blockquote, hr, heading, pre, br } from "#common/prosemirror/schema/core.mjs";
import type { NodeSpec } from "prosemirror-model";

expectTypeOf(paragraph).toEqualTypeOf<NodeSpec>();

expectTypeOf(blockquote).toEqualTypeOf<NodeSpec>();

expectTypeOf(hr).toEqualTypeOf<NodeSpec>();

expectTypeOf(heading).toEqualTypeOf<NodeSpec>();

expectTypeOf(pre).toEqualTypeOf<NodeSpec>();

expectTypeOf(br).toEqualTypeOf<NodeSpec>();
