import { expectTypeOf, test } from "vitest";

declare const someSound: AmbientSoundDocument.Stored;

test("foundry/client/documents/ambient-sound", () => {
  const sound = new AmbientSoundDocument.implementation();
  expectTypeOf(sound).toEqualTypeOf<AmbientSoundDocument.Implementation>();

  expectTypeOf(someSound.name).toEqualTypeOf<string | undefined>();
  expectTypeOf(someSound.levels).toEqualTypeOf<Set<string>>();
  expectTypeOf(someSound.locked).toBeBoolean();
  expectTypeOf(someSound.prepareDerivedData()).toEqualTypeOf<void>();
});
