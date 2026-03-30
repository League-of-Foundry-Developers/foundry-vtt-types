import { expectTypeOf } from "vitest";
import { ol, ul, li, liText } from "../../../../../src/foundry/common/prosemirror/schema/lists.mts";
import type { NodeSpec } from "prosemirror-model";

expectTypeOf(ol).toEqualTypeOf<NodeSpec>();

expectTypeOf(ul).toEqualTypeOf<NodeSpec>();

expectTypeOf(li).toEqualTypeOf<NodeSpec>();

expectTypeOf(liText).toEqualTypeOf<NodeSpec>();
