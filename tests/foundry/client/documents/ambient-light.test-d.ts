import { expectTypeOf, test } from "vitest";

declare const someLight: AmbientLightDocument.Stored;

test("foundry/client/documents/ambient-light", () => {
  const light = new AmbientLightDocument.implementation();
  expectTypeOf(light).toEqualTypeOf<AmbientLightDocument.Implementation>();

  expectTypeOf(light.isGlobal).toEqualTypeOf<boolean>();

  expectTypeOf(someLight.name).toEqualTypeOf<string | undefined>();
  expectTypeOf(someLight.levels).toEqualTypeOf<Set<string>>();
  expectTypeOf(someLight.locked).toBeBoolean();
  expectTypeOf(someLight.prepareDerivedData()).toEqualTypeOf<void>();
});
