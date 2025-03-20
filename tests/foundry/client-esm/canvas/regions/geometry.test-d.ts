import { expectTypeOf } from "vitest";

declare const someRegion: Region.Object;
const myRG = new foundry.canvas.regions.RegionGeometry(someRegion);

expectTypeOf(myRG.region).toEqualTypeOf<Region.Object>();
expectTypeOf(myRG["_clearBuffers"]()).toBeVoid();
expectTypeOf(myRG["_updateBuffers"]()).toBeVoid();
