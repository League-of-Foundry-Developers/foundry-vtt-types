import { expectTypeOf } from "vitest";
import { UnboundTransform } from "#client/canvas/geometry/_module.mjs";

expectTypeOf(UnboundTransform.IDENTITY).toEqualTypeOf<UnboundTransform>();
