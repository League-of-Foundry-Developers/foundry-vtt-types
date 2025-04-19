import { expectTypeOf } from "vitest";

const light = new AmbientLightDocument.implementation();
expectTypeOf(light).toEqualTypeOf<AmbientLightDocument.Implementation>();

expectTypeOf(light.isGlobal).toEqualTypeOf<boolean>();
