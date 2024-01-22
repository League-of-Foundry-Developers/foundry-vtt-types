import { expectTypeOf } from "vitest";

const myLightSource = new LightSource();

expectTypeOf(myLightSource.initialize()).toEqualTypeOf<LightSource>();
