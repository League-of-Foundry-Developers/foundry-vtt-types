import type { NodeSpec } from "prosemirror-model";
import { expectTypeOf, test } from "vitest";

// Import necessary as this is otherwise inaccessible.
import { builtInTableNodes } from "../../../../../src/foundry/common/prosemirror/schema/tables.mts";

test("foundry/common/prosemirror/schema/tables", () => {
  expectTypeOf(builtInTableNodes).toEqualTypeOf<{
    table: NodeSpec;
    table_caption: NodeSpec;
    table_head: NodeSpec;
    table_body: NodeSpec;
    table_foot: NodeSpec;
    table_row: NodeSpec;
    table_cell: NodeSpec;
    table_header: NodeSpec;
  }>();
});
