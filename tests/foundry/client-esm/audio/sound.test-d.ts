import { expectTypeOf } from "vitest";
import type { ValueOf } from "../../../../src/utils/index.d.mts";

const sound = new foundry.audio.Sound("a/path/to/some/sound/file.ogg");

expectTypeOf(sound.id).toEqualTypeOf<number>();
expectTypeOf(sound.src).toEqualTypeOf<string>();
expectTypeOf(sound.context).toEqualTypeOf<AudioContext>();
expectTypeOf(sound.sourceNode).toEqualTypeOf<AudioBufferSourceNode | MediaElementAudioSourceNode>();
expectTypeOf(sound.gainNode).toEqualTypeOf<GainNode>();
expectTypeOf(sound.buffer).toEqualTypeOf<AudioBuffer | null>();
expectTypeOf(sound.element).toEqualTypeOf<HTMLAudioElement | null>();
expectTypeOf(sound._state).toEqualTypeOf<ValueOf<typeof foundry.audio.Sound.STATES>>();
expectTypeOf(sound.loaded).toEqualTypeOf<boolean>();
expectTypeOf(sound.failed).toEqualTypeOf<boolean>();
expectTypeOf(sound.playing).toEqualTypeOf<boolean>();
expectTypeOf(sound.isBuffer).toEqualTypeOf<boolean>();
expectTypeOf(sound.gain).toEqualTypeOf<AudioParam>();
expectTypeOf(sound.destination).toEqualTypeOf<AudioNode>();
expectTypeOf(sound.effects).toEqualTypeOf<AudioNode[]>();
expectTypeOf(sound.volume).toEqualTypeOf<number>();
expectTypeOf(sound.startTime).toEqualTypeOf<number>();
expectTypeOf(sound.pausedTime).toEqualTypeOf<number>();
expectTypeOf(sound.duration).toEqualTypeOf<number>();
expectTypeOf(sound.currentTime).toEqualTypeOf<number>();
expectTypeOf(sound.loop).toEqualTypeOf<boolean>();
expectTypeOf(sound.load()).toEqualTypeOf<Promise<foundry.audio.Sound>>();
expectTypeOf(
  sound.load({ autoplay: true, autoplayOptions: { loop: true, offset: 2, volume: 0.7, fade: 3 } }),
).toEqualTypeOf<Promise<foundry.audio.Sound>>();
expectTypeOf(sound.play()).toEqualTypeOf<Promise<foundry.audio.Sound>>();
expectTypeOf(sound.play({ loop: true, offset: 2, volume: 0.7, fade: 3 })).toEqualTypeOf<Promise<foundry.audio.Sound>>();
expectTypeOf(sound.pause()).toEqualTypeOf<void>();
expectTypeOf(sound.stop()).toEqualTypeOf<Promise<foundry.audio.Sound>>();
expectTypeOf(sound.fade(1)).toEqualTypeOf<Promise<void>>();
expectTypeOf(sound.wait(1)).toEqualTypeOf<Promise<void>>();

declare const soundCallback: (sound: foundry.audio.Sound) => void;
expectTypeOf(sound.schedule(soundCallback, 42)).toEqualTypeOf<Promise<void>>();
expectTypeOf(sound.schedule(() => 3, 3)).toEqualTypeOf<Promise<number>>();
expectTypeOf(sound.schedule(() => "a", 3)).toEqualTypeOf<Promise<string>>();
expectTypeOf(sound.schedule(async () => "a", 3)).toEqualTypeOf<Promise<string>>();
expectTypeOf(sound.applyEffects()).toEqualTypeOf<void>();

expectTypeOf(foundry.audio.Sound.STATES).toEqualTypeOf<{
  FAILED: -1;
  NONE: 0;
  LOADING: 1;
  LOADED: 2;
  STARTING: 3;
  PLAYING: 4;
  PAUSED: 5;
  STOPPING: 6;
  STOPPED: 7;
}>();
expectTypeOf(foundry.audio.Sound.MAX_BUFFER_DURATION).toEqualTypeOf<number>();
expectTypeOf(foundry.audio.Sound.emittedEvents).toEqualTypeOf<string[]>();
