/* eslint-disable import/extensions */
import type { Node } from "prosemirror-model";
import { expectTypeOf } from "vitest";
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
  table: Record<string, unknown>;
  table_cell: Record<string, unknown>;
  table_header: Record<string, unknown>;
  table_row: Record<string, unknown>;
}>();

expectTypeOf(tableComplex).toEqualTypeOf<{
  content: string;
  isolating: boolean;
  group: string;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(colgroup).toEqualTypeOf<{
  content: string;
  isolating: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(col).toEqualTypeOf<{
  tableRole: string;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string];
}>();

expectTypeOf(thead).toEqualTypeOf<{
  content: string;
  isolating: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(tbody).toEqualTypeOf<{
  content: string;
  isolating: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(tfoot).toEqualTypeOf<{
  content: string;
  isolating: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(caption).toEqualTypeOf<{
  content: string;
  isolating: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(captionBlock).toEqualTypeOf<{
  content: string;
  isolating: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(tableRowComplex).toEqualTypeOf<{
  content: string;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(tableCellComplex).toEqualTypeOf<{
  content: string;
  attrs: Record<string, unknown>;
  managed: Record<string, string[]>;
  isolating: boolean;
  parseDOM: Record<string, unknown>;
  toDOM: (node: Node) => [string, unknown, number];
}>();

expectTypeOf(tableCellComplexBlock).toEqualTypeOf<{
  content: string;
  attrs: Record<string, unknown>;
  managed: Record<string, string[]>;
  isolating: boolean;
  parseDOM: Record<string, unknown>;
  toDOM: (node: Node) => [string, unknown, number];
}>();

expectTypeOf(tableHeaderComplex).toEqualTypeOf<{
  content: string;
  attrs: Record<string, unknown>;
  managed: Record<string, string[]>;
  isolating: boolean;
  parseDOM: Record<string, unknown>;
  toDOM: (node: Node) => [string, unknown, number];
}>();

expectTypeOf(tableHeaderComplexBlock).toEqualTypeOf<{
  content: string;
  attrs: Record<string, unknown>;
  managed: Record<string, string[]>;
  isolating: boolean;
  parseDOM: Record<string, unknown>;
  toDOM: (node: Node) => [string, unknown, number];
}>();
