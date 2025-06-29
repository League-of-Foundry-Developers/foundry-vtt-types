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
import type { NodeSpec } from "prosemirror-model";

expectTypeOf(details).toEqualTypeOf<NodeSpec>();

expectTypeOf(summary).toEqualTypeOf<NodeSpec>();

expectTypeOf(summaryBlock).toEqualTypeOf<NodeSpec>();

expectTypeOf(dl).toEqualTypeOf<NodeSpec>();

expectTypeOf(dt).toEqualTypeOf<NodeSpec>();

expectTypeOf(dd).toEqualTypeOf<NodeSpec>();

expectTypeOf(fieldset).toEqualTypeOf<NodeSpec>();

expectTypeOf(legend).toEqualTypeOf<NodeSpec>();

expectTypeOf(picture).toEqualTypeOf<NodeSpec>();

expectTypeOf(audio).toEqualTypeOf<NodeSpec>();

expectTypeOf(video).toEqualTypeOf<NodeSpec>();

expectTypeOf(track).toEqualTypeOf<NodeSpec>();

expectTypeOf(source).toEqualTypeOf<NodeSpec>();

expectTypeOf(object).toEqualTypeOf<NodeSpec>();

expectTypeOf(figure).toEqualTypeOf<NodeSpec>();

expectTypeOf(figcaption).toEqualTypeOf<NodeSpec>();

expectTypeOf(small).toEqualTypeOf<NodeSpec>();

expectTypeOf(ruby).toEqualTypeOf<NodeSpec>();

expectTypeOf(rp).toEqualTypeOf<NodeSpec>();

expectTypeOf(rt).toEqualTypeOf<NodeSpec>();

expectTypeOf(iframe).toEqualTypeOf<NodeSpec>();
