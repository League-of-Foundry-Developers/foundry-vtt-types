import { expectTypeOf } from "vitest";

const doc = new TileDocument();
expectTypeOf(doc.layer).toEqualTypeOf<ForegroundLayer | BackgroundLayer>();
