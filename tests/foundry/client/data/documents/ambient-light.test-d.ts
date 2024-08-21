import { expectTypeOf } from "vitest";

const light = new AmbientLightDocument();
expectTypeOf(light).toEqualTypeOf<AmbientLightDocument>();

expectTypeOf(light.isGlobal).toEqualTypeOf<boolean>();
