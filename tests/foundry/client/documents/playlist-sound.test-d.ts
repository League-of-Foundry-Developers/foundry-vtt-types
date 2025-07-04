import { expectTypeOf } from "vitest";

// @ts-expect-error - requires name.
new PlaylistSound.implementation();

// @ts-expect-error - requires name.
new PlaylistSound.implementation({});

const sound = new PlaylistSound.implementation({ name: "my sound" });

expectTypeOf(sound.sound).toEqualTypeOf<foundry.audio.Sound | null | undefined>();
expectTypeOf(sound.debounceVolume).toEqualTypeOf<(volume: number) => void>();
expectTypeOf(sound.fadeDuration).toEqualTypeOf<number>();
expectTypeOf(sound.context).toEqualTypeOf<AudioContext | undefined>();
expectTypeOf(sound.sync()).toEqualTypeOf<void>();
expectTypeOf(sound.load()).toEqualTypeOf<Promise<void>>();
expectTypeOf(sound.toAnchor()).toEqualTypeOf<HTMLAnchorElement>();

expectTypeOf(PlaylistSound.VOLUME_DEBOUNCE_MS).toEqualTypeOf<number>();
