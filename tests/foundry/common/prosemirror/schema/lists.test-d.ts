import { expectTypeOf } from "vitest";
import { ol, ul, li, liText } from "#common/prosemirror/schema/lists.mjs";
import type { NodeSpec } from "prosemirror-model";

expectTypeOf(ol).toEqualTypeOf<NodeSpec>();

expectTypeOf(ul).toEqualTypeOf<NodeSpec>();

expectTypeOf(li).toEqualTypeOf<NodeSpec>();

expectTypeOf(liText).toEqualTypeOf<NodeSpec>();
