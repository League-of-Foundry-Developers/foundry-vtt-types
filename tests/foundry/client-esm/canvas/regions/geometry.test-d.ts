import { expectTypeOf } from "vitest";

declare const someRegion: Region.ConfiguredInstance;
const myRG = new foundry.canvas.regions.RegionGeometry(someRegion);

expectTypeOf(myRG.region).toEqualTypeOf<Region.ConfiguredInstance>();
expectTypeOf(myRG["_clearBuffers"]()).toBeVoid();
expectTypeOf(myRG["_updateBuffers"]()).toBeVoid();
