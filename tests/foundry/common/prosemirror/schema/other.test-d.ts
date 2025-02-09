/* eslint-disable import-x/extensions */
import { expectTypeOf } from "vitest";
import {
  details,
  summary,
  summaryBlock,
  dl,
  dt,
  dd,
  fieldset,
  legend,
  picture,
  audio,
  video,
  track,
  source,
  object,
  figure,
  figcaption,
  small,
  ruby,
  rp,
  rt,
  iframe,
} from "../../../../../src/foundry/common/prosemirror/schema/other.mjs";

expectTypeOf(details).toEqualTypeOf<{
  content: string;
  group: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(summary).toEqualTypeOf<{
  content: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(summaryBlock).toEqualTypeOf<{
  content: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(dl).toEqualTypeOf<{
  content: string;
  group: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(dt).toEqualTypeOf<{
  content: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(dd).toEqualTypeOf<{
  content: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(fieldset).toEqualTypeOf<{
  content: string;
  group: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(legend).toEqualTypeOf<{
  content: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(picture).toEqualTypeOf<{
  content: string;
  group: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(audio).toEqualTypeOf<{
  content: string;
  group: string;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(video).toEqualTypeOf<{
  content: string;
  group: string;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(track).toEqualTypeOf<{
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string];
}>();

expectTypeOf(source).toEqualTypeOf<{
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string];
}>();

expectTypeOf(object).toEqualTypeOf<{
  inline: boolean;
  group: string;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string];
}>();

expectTypeOf(figure).toEqualTypeOf<{
  content: string;
  group: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(figcaption).toEqualTypeOf<{
  content: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(small).toEqualTypeOf<{
  content: string;
  group: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(ruby).toEqualTypeOf<{
  content: string;
  group: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(rp).toEqualTypeOf<{
  content: string;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(rt).toEqualTypeOf<{
  content: string;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, number];
}>();

expectTypeOf(iframe).toEqualTypeOf<{
  attrs: Record<string, unknown>;
  managed: Record<string, unknown>;
  group: string;
  defining: boolean;
  parseDOM: Record<string, unknown>[];
  toDOM: () => [string, unknown];
}>();
