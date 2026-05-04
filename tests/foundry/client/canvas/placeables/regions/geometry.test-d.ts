import { expectTypeOf } from "vitest";

import RegionGeometry = foundry.canvas.placeables.regions.RegionGeometry;
import Region = foundry.canvas.placeables.Region;

declare const someRegion: Region.Implementation;
const myRG = new RegionGeometry(someRegion);

expectTypeOf(myRG.region).toEqualTypeOf<Region.Implementation>();
expectTypeOf(myRG["_clearBuffers"]()).toBeVoid();
expectTypeOf(myRG["_updateBuffers"]()).toBeVoid();
