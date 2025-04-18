import { expectTypeOf } from "vitest";
import type Sound from "../../../../../src/foundry/client-esm/audio/sound.d.mts";

declare const doc: AmbientSoundDocument;

expectTypeOf(AmbientSound.embeddedName).toEqualTypeOf<"AmbientSound">();

// @ts-expect-error - An AmbientSound requires an AmbientSoundDocument.
new AmbientSound();

const sound = new AmbientSound(doc);
expectTypeOf(sound.sound).toEqualTypeOf<Sound | null>();
expectTypeOf(sound.isAudible).toEqualTypeOf<boolean>();
expectTypeOf(sound.radius).toEqualTypeOf<number>();
expectTypeOf(sound.sync(true, 10)).toEqualTypeOf<void>();
expectTypeOf(sound.sync(true, 10, {})).toEqualTypeOf<void>();
expectTypeOf(sound.sync(true, 10, { fade: 250 })).toEqualTypeOf<void>();
expectTypeOf(sound.clear()).toEqualTypeOf<AmbientSound>();
expectTypeOf(sound.draw()).toEqualTypeOf<Promise<AmbientSound>>();
expectTypeOf(sound.refresh()).toEqualTypeOf<AmbientSound>();
expectTypeOf(sound.refreshControl()).toEqualTypeOf<void>();
expectTypeOf(sound.updateSource()).toEqualTypeOf<void>();
