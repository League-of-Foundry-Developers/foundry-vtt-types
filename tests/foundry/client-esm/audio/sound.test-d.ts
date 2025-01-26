import { expectTypeOf } from "vitest";

const sound = new Sound("a/path/to/some/sound/file.ogg");

expectTypeOf(sound).toEqualTypeOf<Sound>();
expectTypeOf(sound.id).toEqualTypeOf<number>();
expectTypeOf(sound.src).toEqualTypeOf<string>();
expectTypeOf(sound.container).toEqualTypeOf<AudioContainer>();
expectTypeOf(sound.startTime).toEqualTypeOf<number | undefined>();
expectTypeOf(sound.pausedTime).toEqualTypeOf<number | undefined>();
expectTypeOf(sound.events).toEqualTypeOf<Sound.EventCallbacks>();
expectTypeOf(sound.loading).toEqualTypeOf<Promise<void> | undefined>();
expectTypeOf(sound.context).toEqualTypeOf<AudioContext>();
expectTypeOf(sound.node).toEqualTypeOf<AudioBufferSourceNode | MediaElementAudioSourceNode | undefined>();
expectTypeOf(sound.gain).toEqualTypeOf<AudioParam | undefined>();
expectTypeOf(sound.currentTime).toEqualTypeOf<number | undefined>();
expectTypeOf(sound.duration).toEqualTypeOf<number | undefined>();
expectTypeOf(sound.loaded).toEqualTypeOf<boolean>();
expectTypeOf(sound.failed).toEqualTypeOf<boolean>();
expectTypeOf(sound.playing).toEqualTypeOf<boolean>();
expectTypeOf(sound.loop).toEqualTypeOf<boolean>();
expectTypeOf(sound.volume).toEqualTypeOf<number | undefined>();
expectTypeOf(sound.fade(0)).toEqualTypeOf<Promise<void>>();
expectTypeOf(sound.fade(0, { duration: 42, from: 0.5, type: "exponential" })).toEqualTypeOf<Promise<void>>();
expectTypeOf(sound.load()).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(
  sound.load({ autoplay: true, autoplayOptions: { loop: true, offset: 2, volume: 0.7, fade: 3 } }),
).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(sound.play()).toEqualTypeOf<void>();
expectTypeOf(sound.play({ loop: true, offset: 2, volume: 0.7, fade: 3 })).toEqualTypeOf<void>();
expectTypeOf(sound.pause()).toEqualTypeOf<void>();
expectTypeOf(sound.stop()).toEqualTypeOf<void>();

declare const soundCallback: (sound: Sound) => void;

expectTypeOf(sound.schedule(soundCallback, 42)).toEqualTypeOf<Promise<void>>();
expectTypeOf(sound.emit("pause")).toEqualTypeOf<void>();
expectTypeOf(sound.off("end", 42)).toEqualTypeOf<void>();
expectTypeOf(sound.off("start", soundCallback)).toEqualTypeOf<void>();
expectTypeOf(sound.on("stop", soundCallback)).toEqualTypeOf<number>();
