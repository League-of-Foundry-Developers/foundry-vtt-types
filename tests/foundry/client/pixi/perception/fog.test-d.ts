import { expectTypeOf } from "vitest";

const myFogManager = new FogManager();

expectTypeOf(myFogManager.textureConfiguration).toEqualTypeOf<FogTextureConfiguration>();
