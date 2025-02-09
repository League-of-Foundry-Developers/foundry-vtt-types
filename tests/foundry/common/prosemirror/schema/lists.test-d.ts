/* eslint-disable import-x/extensions */
import type { Node } from "prosemirror-model";
import { expectTypeOf } from "vitest";
import { ol, ul, li, liText } from "../../../../../src/foundry/common/prosemirror/schema/lists.mjs";

expectTypeOf(ol).toEqualTypeOf<{
  content: string;
  managed: Record<string, unknown>;
  group: string;
  attrs: Record<string, unknown>;
  parseDOM: Record<string, unknown>[];
  toDOM: (node: Node) => [string, number] | [string, Record<string, unknown>, number];
}>();

expectTypeOf(ul).toEqualTypeOf<{
  content: string;
  group: string;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(li).toEqualTypeOf<{
  content: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(liText).toEqualTypeOf<{
  content: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();
