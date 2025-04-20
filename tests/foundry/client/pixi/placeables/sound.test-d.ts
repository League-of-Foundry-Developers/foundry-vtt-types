import { expectTypeOf } from "vitest";
import type Sound from "../../../../../src/foundry/client-esm/audio/sound.d.mts";

declare const doc: AmbientSoundDocument.Implementation;

expectTypeOf(AmbientSound.embeddedName).toEqualTypeOf<"AmbientSound">();

// @ts-expect-error - An AmbientSound requires an AmbientSoundDocument.
new CONFIG.AmbientSound.objectClass();

const sound = new CONFIG.AmbientSound.objectClass(doc);
expectTypeOf(sound.sound).toEqualTypeOf<Sound | null>();
expectTypeOf(sound.isAudible).toEqualTypeOf<boolean>();
expectTypeOf(sound.radius).toEqualTypeOf<number>();
expectTypeOf(sound.sync(true, 10)).toEqualTypeOf<void>();
expectTypeOf(sound.sync(true, 10, {})).toEqualTypeOf<void>();
expectTypeOf(sound.sync(true, 10, { fade: 250 })).toEqualTypeOf<void>();
expectTypeOf(sound.clear()).toEqualTypeOf<AmbientSound.Object>();
expectTypeOf(sound.draw()).toEqualTypeOf<Promise<AmbientSound.Object>>();
expectTypeOf(sound.refresh()).toEqualTypeOf<AmbientSound.Object>();
expectTypeOf(sound.refreshControl()).toEqualTypeOf<void>();
expectTypeOf(sound.updateSource()).toEqualTypeOf<void>();
