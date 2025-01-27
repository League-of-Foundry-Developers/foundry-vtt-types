import { expectTypeOf } from "vitest";

// @ts-expect-error - requires name.
new PlaylistSound();

// @ts-expect-error - requires name.
new PlaylistSound({});

const sound = new PlaylistSound({ name: "my sound" });

expectTypeOf(sound.sound).toEqualTypeOf<foundry.audio.Sound | null>();
expectTypeOf(sound.debounceVolume).toEqualTypeOf<(volume: number) => void>();
expectTypeOf(sound.fadeDuration).toEqualTypeOf<number>();
expectTypeOf(sound.context).toEqualTypeOf<AudioContext | undefined>();
expectTypeOf(sound.sync()).toEqualTypeOf<void | Promise<void> | Promise<foundry.audio.Sound>>();
expectTypeOf(sound.load()).toEqualTypeOf<Promise<void>>();
expectTypeOf(sound.toAnchor()).toEqualTypeOf<HTMLAnchorElement>();

expectTypeOf(PlaylistSound.VOLUME_DEBOUNCE_MS).toEqualTypeOf<number>();
