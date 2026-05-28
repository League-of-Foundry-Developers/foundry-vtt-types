import { expectTypeOf } from "vitest";
import type { NodeSpec } from "prosemirror-model";
import { selection } from "../../../../../src/foundry/common/prosemirror/schema/inserts.mts";

expectTypeOf(selection).toEqualTypeOf<NodeSpec>();
