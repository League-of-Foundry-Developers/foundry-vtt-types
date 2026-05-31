import { expectTypeOf } from "vitest";
import {
  em,
  strong,
  cite,
  code,
  underline,
  strikethrough,
  superscript,
  subscript,
  span,
  font,
  size,
  color,
} from "../../../../../src/foundry/common/prosemirror/schema/marks.mts";
import type { MarkSpec } from "prosemirror-model";

expectTypeOf(em).toEqualTypeOf<MarkSpec>();

expectTypeOf(strong).toEqualTypeOf<MarkSpec>();

expectTypeOf(cite).toEqualTypeOf<MarkSpec>();

expectTypeOf(code).toEqualTypeOf<MarkSpec>();

expectTypeOf(underline).toEqualTypeOf<MarkSpec>();

expectTypeOf(strikethrough).toEqualTypeOf<MarkSpec>();

expectTypeOf(superscript).toEqualTypeOf<MarkSpec>();

expectTypeOf(subscript).toEqualTypeOf<MarkSpec>();

expectTypeOf(span).toEqualTypeOf<MarkSpec>();

expectTypeOf(font).toEqualTypeOf<MarkSpec>();

expectTypeOf(size).toEqualTypeOf<MarkSpec>();

expectTypeOf(color).toEqualTypeOf<MarkSpec>();
