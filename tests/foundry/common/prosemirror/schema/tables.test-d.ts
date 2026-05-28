import type { NodeSpec } from "prosemirror-model";
import { expectTypeOf } from "vitest";

// Import necessary as this is otherwise inaccessible.
import { builtInTableNodes } from "../../../../../src/foundry/common/prosemirror/schema/tables.mts";

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
