import { expectTypeOf } from "vitest";

declare const someRegion: Region.Implementation;
const myRG = new foundry.canvas.regions.RegionGeometry(someRegion);

expectTypeOf(myRG.region).toEqualTypeOf<Region.Implementation>();
expectTypeOf(myRG["_clearBuffers"]()).toBeVoid();
expectTypeOf(myRG["_updateBuffers"]()).toBeVoid();
