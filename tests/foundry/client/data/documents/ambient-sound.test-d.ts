import { expectTypeOf } from "vitest";

const sound = new AmbientSoundDocument();
expectTypeOf(sound).toEqualTypeOf<AmbientSoundDocument>();
