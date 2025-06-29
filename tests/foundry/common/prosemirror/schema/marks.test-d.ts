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
import type { MarkSpec } from "prosemirror-model";

expectTypeOf(em).toEqualTypeOf<MarkSpec>();

expectTypeOf(strong).toEqualTypeOf<MarkSpec>();

expectTypeOf(code).toEqualTypeOf<MarkSpec>();

expectTypeOf(underline).toEqualTypeOf<MarkSpec>();

expectTypeOf(strikethrough).toEqualTypeOf<MarkSpec>();

expectTypeOf(superscript).toEqualTypeOf<MarkSpec>();

expectTypeOf(subscript).toEqualTypeOf<MarkSpec>();

expectTypeOf(span).toEqualTypeOf<MarkSpec>();

expectTypeOf(font).toEqualTypeOf<MarkSpec>();
