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
} from "#common/prosemirror/schema/other.mjs";
import type { RequiredProps } from "#utils";
import type { NodeSpec } from "prosemirror-model";

expectTypeOf(details).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "group" | "defining" | "parseDOM" | "toDOM">>();

expectTypeOf(summary).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "defining" | "parseDOM" | "toDOM">>();

expectTypeOf(summaryBlock).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "defining" | "parseDOM" | "toDOM">>();

expectTypeOf(dl).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "group" | "defining" | "parseDOM" | "toDOM">>();

expectTypeOf(dt).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "defining" | "parseDOM" | "toDOM">>();

expectTypeOf(dd).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "defining" | "parseDOM" | "toDOM">>();

expectTypeOf(fieldset).toEqualTypeOf<
  RequiredProps<NodeSpec, "content" | "group" | "defining" | "parseDOM" | "toDOM">
>();

expectTypeOf(legend).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "defining" | "parseDOM" | "toDOM">>();

expectTypeOf(picture).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "group" | "defining" | "parseDOM" | "toDOM">>();

expectTypeOf(audio).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "group" | "parseDOM" | "toDOM">>();

expectTypeOf(video).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "group" | "parseDOM" | "toDOM">>();

expectTypeOf(track).toEqualTypeOf<RequiredProps<NodeSpec, "parseDOM" | "toDOM">>();

expectTypeOf(source).toEqualTypeOf<RequiredProps<NodeSpec, "parseDOM" | "toDOM">>();

expectTypeOf(object).toEqualTypeOf<RequiredProps<NodeSpec, "inline" | "group" | "parseDOM" | "toDOM">>();

expectTypeOf(figure).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "group" | "defining" | "parseDOM" | "toDOM">>();

expectTypeOf(figcaption).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "defining" | "parseDOM" | "toDOM">>();

expectTypeOf(small).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "group" | "defining" | "parseDOM" | "toDOM">>();

expectTypeOf(ruby).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "group" | "defining" | "parseDOM" | "toDOM">>();

expectTypeOf(rp).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "parseDOM" | "toDOM">>();

expectTypeOf(rt).toEqualTypeOf<RequiredProps<NodeSpec, "content" | "parseDOM" | "toDOM">>();

expectTypeOf(iframe).toEqualTypeOf<
  RequiredProps<NodeSpec, "attrs" | "managed" | "group" | "defining" | "parseDOM" | "toDOM">
>();
