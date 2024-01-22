import { expectTypeOf } from "vitest";

const mySoundSource = new SoundSource();

expectTypeOf(mySoundSource.initialize()).toEqualTypeOf<SoundSource>();
