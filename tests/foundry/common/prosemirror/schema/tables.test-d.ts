import type { NodeSpec } from "prosemirror-model";
import { expectTypeOf } from "vitest";

// Import necessary as this is otherwise inaccessible.
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import {
  builtInTableNodes,
  tableComplex,
  colgroup,
  col,
  thead,
  tbody,
  tfoot,
  caption,
  captionBlock,
  tableRowComplex,
  tableCellComplex,
  tableCellComplexBlock,
  tableHeaderComplex,
  tableHeaderComplexBlock,
  // eslint-disable-next-line import-x/extensions
} from "../../../../../src/foundry/common/prosemirror/schema/tables.mjs";

expectTypeOf(builtInTableNodes).toEqualTypeOf<{
  table: NodeSpec;
  table_cell: NodeSpec;
  table_header: NodeSpec;
  table_row: NodeSpec;
}>();

expectTypeOf(tableComplex).toEqualTypeOf<NodeSpec>();

expectTypeOf(colgroup).toEqualTypeOf<NodeSpec>();

expectTypeOf(col).toEqualTypeOf<NodeSpec>();

expectTypeOf(thead).toEqualTypeOf<NodeSpec>();

expectTypeOf(tbody).toEqualTypeOf<NodeSpec>();

expectTypeOf(tfoot).toEqualTypeOf<NodeSpec>();

expectTypeOf(caption).toEqualTypeOf<NodeSpec>();

expectTypeOf(captionBlock).toEqualTypeOf<NodeSpec>();

expectTypeOf(tableRowComplex).toEqualTypeOf<NodeSpec>();

expectTypeOf(tableCellComplex).toEqualTypeOf<NodeSpec>();

expectTypeOf(tableCellComplexBlock).toEqualTypeOf<NodeSpec>();

expectTypeOf(tableHeaderComplex).toEqualTypeOf<NodeSpec>();

expectTypeOf(tableHeaderComplexBlock).toEqualTypeOf<NodeSpec>();
