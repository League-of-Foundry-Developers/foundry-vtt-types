import { expectTypeOf } from "vitest";

const light = new AmbientLightDocument.implementation();
expectTypeOf(light).toEqualTypeOf<AmbientLightDocument.Implementation>();

expectTypeOf(light.isGlobal).toEqualTypeOf<boolean>();

declare const someLight: AmbientLightDocument.Stored;

expectTypeOf(someLight.name).toEqualTypeOf<string | undefined>();
expectTypeOf(someLight.levels).toEqualTypeOf<Set<string>>();
expectTypeOf(someLight.locked).toBeBoolean();
expectTypeOf(someLight.prepareDerivedData()).toEqualTypeOf<void>();
