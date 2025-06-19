import { expectTypeOf } from "vitest";
import {
  em,
  strong,
  code,
  underline,
  strikethrough,
  superscript,
  subscript,
  span,
  font,
} from "#common/prosemirror/schema/marks.mjs";
import type { RequiredProps } from "#utils";
import type { MarkSpec } from "prosemirror-model";

expectTypeOf(em).toEqualTypeOf<RequiredProps<MarkSpec, "parseDOM" | "toDOM">>();

expectTypeOf(strong).toEqualTypeOf<RequiredProps<MarkSpec, "parseDOM" | "toDOM">>();

expectTypeOf(code).toEqualTypeOf<RequiredProps<MarkSpec, "parseDOM" | "toDOM">>();

expectTypeOf(underline).toEqualTypeOf<RequiredProps<MarkSpec, "parseDOM" | "toDOM">>();

expectTypeOf(strikethrough).toEqualTypeOf<RequiredProps<MarkSpec, "parseDOM" | "toDOM">>();

expectTypeOf(superscript).toEqualTypeOf<RequiredProps<MarkSpec, "parseDOM" | "toDOM">>();

expectTypeOf(subscript).toEqualTypeOf<RequiredProps<MarkSpec, "parseDOM" | "toDOM">>();

expectTypeOf(span).toEqualTypeOf<RequiredProps<MarkSpec, "parseDOM" | "toDOM">>();

expectTypeOf(font).toEqualTypeOf<RequiredProps<MarkSpec, "parseDOM" | "toDOM">>();
