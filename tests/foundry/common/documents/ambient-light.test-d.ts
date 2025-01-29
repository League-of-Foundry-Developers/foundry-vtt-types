import { expectTypeOf } from "vitest";

class TestBaseAmbientLight extends foundry.documents.BaseAmbientLight {}

expectTypeOf(new TestBaseAmbientLight()).toEqualTypeOf<foundry.documents.BaseAmbientLight>();
expectTypeOf(new TestBaseAmbientLight({})).toEqualTypeOf<foundry.documents.BaseAmbientLight>();

declare const myLight: foundry.documents.BaseAmbientLight;
expectTypeOf(myLight.config).toEqualTypeOf<foundry.data.LightData>();
expectTypeOf(myLight.config.angle).toEqualTypeOf<number>();
