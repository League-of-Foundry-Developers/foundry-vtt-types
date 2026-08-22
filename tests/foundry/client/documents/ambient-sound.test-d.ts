import { expectTypeOf } from "vitest";

const sound = new AmbientSoundDocument.implementation();
expectTypeOf(sound).toEqualTypeOf<AmbientSoundDocument.Implementation>();

declare const someSound: AmbientSoundDocument.Stored;

expectTypeOf(someSound.name).toEqualTypeOf<string | undefined>();
expectTypeOf(someSound.levels).toEqualTypeOf<Set<string>>();
expectTypeOf(someSound.locked).toBeBoolean();
expectTypeOf(someSound.prepareDerivedData()).toEqualTypeOf<void>();
