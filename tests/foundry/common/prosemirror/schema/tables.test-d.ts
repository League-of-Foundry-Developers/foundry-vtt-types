/* eslint-disable import-x/extensions */
import type { NodeSpec } from "prosemirror-model";
import { expectTypeOf } from "vitest";
import type { RequiredProps } from "#utils";
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
} from "../../../../../src/foundry/common/prosemirror/schema/tables.mjs";

expectTypeOf(builtInTableNodes).toEqualTypeOf<{
  table: NodeSpec;
  table_cell: NodeSpec;
  table_header: NodeSpec;
  table_row: NodeSpec;
}>();

expectTypeOf(tableComplex).toEqualTypeOf<
  RequiredProps<NodeSpec, "content" | "isolating" | "group" | "parseDOM" | "toDOM">
>();

expectTypeOf(colgroup).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "isolating" | "parseDOM" | "toDOM">>();

expectTypeOf(col).toEqualTypeOf<RequiredProps<NodeSpec, "tableRole" | "parseDOM" | "toDOM">>();

expectTypeOf(thead).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "isolating" | "parseDOM" | "toDOM">>();

expectTypeOf(tbody).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "isolating" | "parseDOM" | "toDOM">>();

expectTypeOf(tfoot).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "isolating" | "parseDOM" | "toDOM">>();

expectTypeOf(caption).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "isolating" | "parseDOM" | "toDOM">>();

expectTypeOf(captionBlock).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "isolating" | "parseDOM" | "toDOM">>();

expectTypeOf(tableRowComplex).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "parseDOM" | "toDOM">>();

expectTypeOf(tableCellComplex).toEqualTypeOf<
  RequiredProps<NodeSpec, "content" | "attrs" | "managed" | "isolating" | "parseDOM" | "toDOM">
>();

expectTypeOf(tableCellComplexBlock).toEqualTypeOf<
  RequiredProps<NodeSpec, "content" | "attrs" | "managed" | "isolating" | "parseDOM" | "toDOM">
>();

expectTypeOf(tableHeaderComplex).toEqualTypeOf<
  RequiredProps<NodeSpec, "content" | "attrs" | "managed" | "isolating" | "parseDOM" | "toDOM">
>();

expectTypeOf(tableHeaderComplexBlock).toEqualTypeOf<
  RequiredProps<NodeSpec, "content" | "attrs" | "managed" | "isolating" | "parseDOM" | "toDOM">
>();
