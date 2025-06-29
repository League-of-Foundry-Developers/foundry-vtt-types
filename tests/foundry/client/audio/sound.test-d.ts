import { expectTypeOf } from "vitest";
import type { AmbientSound } from "#client/canvas/placeables/_module.d.mts";
import Sound = foundry.audio.Sound;

expectTypeOf(Sound.STATES).toExtend<Readonly<Record<keyof Sound.States, Sound.STATES>>>();
expectTypeOf(Sound.STATES.STOPPING).toEqualTypeOf<Sound.States["STOPPING"]>();
expectTypeOf(Sound.MAX_BUFFER_DURATION).toBeNumber();
expectTypeOf(Sound.emittedEvents).toEqualTypeOf<string[]>();

const path = "a/path/to/some/sound/file.ogg";
declare const context: AudioContext;

// @ts-expect-error A sound requires a `src` path
new Sound();
let sound = new Sound(path);
sound = new Sound(path, {});
sound = new Sound(path, { context, forceBuffer: true });
sound = new Sound(path, { context: null, forceBuffer: null });

expectTypeOf(sound.id).toEqualTypeOf<number>();
expectTypeOf(sound.src).toEqualTypeOf<string>();

expectTypeOf(sound.context).toEqualTypeOf<AudioContext | undefined>();
expectTypeOf(sound.sourceNode).toEqualTypeOf<AudioBufferSourceNode | MediaElementAudioSourceNode | undefined>();
expectTypeOf(sound.gainNode).toEqualTypeOf<GainNode | undefined>();
expectTypeOf(sound.buffer).toEqualTypeOf<AudioBuffer | null>();
expectTypeOf(sound.element).toEqualTypeOf<HTMLAudioElement | null>();

expectTypeOf(sound["_state"]).toEqualTypeOf<Sound.STATES>();
expectTypeOf(sound.loaded).toEqualTypeOf<boolean>();
expectTypeOf(sound.failed).toEqualTypeOf<boolean>();
expectTypeOf(sound.playing).toEqualTypeOf<boolean>();
expectTypeOf(sound.isBuffer).toEqualTypeOf<boolean>();

expectTypeOf(sound.gain).toEqualTypeOf<AudioParam | undefined>();
expectTypeOf(sound.destination).toEqualTypeOf<AudioNode | undefined>();
expectTypeOf(sound.effects).toEqualTypeOf<AudioNode[]>();

expectTypeOf(sound.volume).toEqualTypeOf<number | undefined>();
sound.volume = 0.6; // setter
// @ts-expect-error setter only takes numbers despite the getter type
sound.volume = undefined;

expectTypeOf(sound.startTime).toEqualTypeOf<number | undefined>();
expectTypeOf(sound.pausedTime).toEqualTypeOf<number | undefined>();
expectTypeOf(sound.duration).toEqualTypeOf<number | undefined>();
expectTypeOf(sound.currentTime).toEqualTypeOf<number | undefined>();

expectTypeOf(sound.loop).toEqualTypeOf<boolean>();
sound.loop = true;

expectTypeOf(sound._manager).toEqualTypeOf<AmbientSound.Implementation | null>();

const callback = (sound: Sound) => {
  console.log(sound);
};
const playbackOptions = {
  delay: 250,
  duration: 2,
  fade: 100,
  loop: true,
  loopStart: 270,
  loopEnd: 2270,
  offset: 0,
  onended: callback,
  volume: 0.9,
};
const playbackOptionsNull = {
  delay: null,
  duration: null,
  fade: null,
  loop: null,
  loopStart: null,
  loopEnd: null,
  offset: null,
  onended: null,
  volume: null,
};
const playbackOptionsUndefined = {
  delay: undefined,
  duration: undefined,
  fade: undefined,
  loop: undefined,
  loopStart: undefined,
  loopEnd: undefined,
  offset: undefined,
  onended: undefined,
  volume: undefined,
};

expectTypeOf(sound.load()).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(sound.load({})).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(sound.load({ autoplay: true, autoplayOptions: playbackOptions })).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(sound.load({ autoplay: true, autoplayOptions: playbackOptionsNull })).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(sound.load({ autoplay: true, autoplayOptions: playbackOptionsUndefined })).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(sound.load({ autoplay: null, autoplayOptions: undefined })).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(sound["_load"]()).toEqualTypeOf<Promise<void>>();

expectTypeOf(sound.play()).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(sound.play({})).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(sound.play(playbackOptions)).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(sound.play(playbackOptionsNull)).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(sound.play(playbackOptionsUndefined)).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(sound["_play"]()).toBeVoid();

expectTypeOf(sound.pause()).toEqualTypeOf<void>();
expectTypeOf(sound["_pause"]()).toBeVoid();

expectTypeOf(sound.stop()).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(sound.stop({})).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(sound.stop(playbackOptions)).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(sound.stop(playbackOptionsNull)).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(sound.stop(playbackOptionsUndefined)).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(sound["_stop"]()).toBeVoid();

expectTypeOf(sound.fade(1)).toEqualTypeOf<Promise<void>>();
expectTypeOf(sound.fade(1, {})).toEqualTypeOf<Promise<void>>();
expectTypeOf(sound.fade(1, { duration: 2000, from: 0.2, type: "exponential" })).toEqualTypeOf<Promise<void>>();
expectTypeOf(sound.fade(1, { duration: undefined, from: null, type: undefined })).toEqualTypeOf<Promise<void>>();

expectTypeOf(sound.wait(1)).toEqualTypeOf<Promise<void>>();

expectTypeOf(sound.schedule(callback, 42)).toEqualTypeOf<Promise<void>>();
expectTypeOf(sound.schedule(() => 3, 3)).toEqualTypeOf<Promise<number>>();
expectTypeOf(sound.schedule(() => "a", 3)).toEqualTypeOf<Promise<string>>();
expectTypeOf(sound.schedule(async () => "a", 3)).toEqualTypeOf<Promise<string>>();
expectTypeOf(sound.applyEffects()).toEqualTypeOf<void>();

expectTypeOf(sound["_createNodes"]()).toBeVoid();
expectTypeOf(sound["_connectPipeline"]()).toBeVoid();
expectTypeOf(sound["_disconnectPipeline"]()).toBeVoid();

// deprecated since v12, until v14
expectTypeOf(Sound.STATES).toEqualTypeOf<typeof Sound.STATES>();

expectTypeOf(sound["_state"]).toEqualTypeOf<Sound.STATES>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(sound.container).toEqualTypeOf<typeof sound>();
expectTypeOf(sound.sourceNode).toEqualTypeOf<typeof sound.sourceNode>();

const eventCallback = (e: Event) => console.log(e);
expectTypeOf(sound.addEventListener("eventName", eventCallback)).toBeVoid();
expectTypeOf(sound.addEventListener("eventName", eventCallback, {})).toBeVoid();
expectTypeOf(sound.addEventListener("eventName", eventCallback, { once: true })).toBeVoid();
expectTypeOf(sound.addEventListener("eventName", eventCallback, { once: undefined })).toBeVoid();

expectTypeOf(sound.removeEventListener("eventName", eventCallback)).toBeVoid();
expectTypeOf(sound.dispatchEvent(new Event("eventName"))).toBeBoolean();
