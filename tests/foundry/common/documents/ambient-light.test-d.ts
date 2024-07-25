import { expectTypeOf } from "vitest";

expectTypeOf(new foundry.documents.BaseAmbientLight()).toEqualTypeOf<foundry.documents.BaseAmbientLight>();
expectTypeOf(new foundry.documents.BaseAmbientLight({})).toEqualTypeOf<foundry.documents.BaseAmbientLight>();

const myLight = new foundry.documents.BaseAmbientLight();
expectTypeOf(myLight.config).toEqualTypeOf<foundry.data.LightData>();
expectTypeOf(myLight.config.angle).toEqualTypeOf<number>();
