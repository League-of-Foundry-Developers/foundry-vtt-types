/* eslint-disable import/extensions */
import type { Node } from "prosemirror-model";
import { expectTypeOf } from "vitest";
import {
  paragraph,
  blockquote,
  hr,
  heading,
  pre,
  br,
} from "../../../../../src/foundry/common/prosemirror/schema/core.mjs";

expectTypeOf(paragraph).toEqualTypeOf<{
  attrs: Record<string, unknown>;
  managed: Record<string, unknown>;
  content: string;
  group: string;
  parseDOM: Record<string, unknown>[];
  toDOM: (node: Node) => [string, Record<string, string>, number] | [string, number];
}>();

expectTypeOf(blockquote).toEqualTypeOf<{
  content: string;
  group: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(hr).toEqualTypeOf<{
  group: string;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string];
}>();

expectTypeOf(heading).toEqualTypeOf<{
  attrs: Record<string, unknown>;
  content: string;
  group: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: (node: Node) => [string, number];
}>();

expectTypeOf(pre).toEqualTypeOf<{
  content: string;
  marks: string;
  group: string;
  code: boolean;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, [string, number]];
}>();

expectTypeOf(br).toEqualTypeOf<{
  inline: boolean;
  group: string;
  selectable: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string];
}>();
