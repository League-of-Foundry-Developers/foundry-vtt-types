import { expectTypeOf } from "vitest";

const doc = new TileDocument();
// TODO: Fix after document updates
expectTypeOf(doc.layer).toEqualTypeOf<ForegroundLayer | BackgroundLayer>();
