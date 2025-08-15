import { describe, expectTypeOf, test } from "vitest";

import AmbientSound = foundry.canvas.placeables.AmbientSound;
import Sound = foundry.audio.Sound;
import Canvas = foundry.canvas.Canvas;
import AudioTimeout = foundry.audio.AudioTimeout;

const path = "a/path/to/some/sound/file.ogg";
declare const context: AudioContext;
declare const point: Canvas.Point;
declare const elevatedPoint: Canvas.ElevatedPoint;
declare const timeout: AudioTimeout;
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
} satisfies Sound.PlaybackOptions;

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
} satisfies Sound.PlaybackOptions;

const filledInPlayAtPositionOptions = {
  baseEffect: { type: "reverb", intensity: 3 },
  easing: true,
  gmAlways: false,
  muffledEffect: { type: "lowPass", intensity: 7 },
  playbackOptions,
  sourceData: { angle: 90, rotation: 270 },
  walls: true,
  volume: 2.3,
} satisfies Sound.PlayAtPositionOptions;

const undefinedPlayAtPositionOptions = {
  baseEffect: undefined,
  easing: undefined,
  gmAlways: undefined,
  muffledEffect: undefined,
  playbackOptions: undefined,
  sourceData: undefined,
  walls: undefined,
  volume: undefined,
} satisfies Sound.PlayAtPositionOptions;

describe("Sound Tests", () => {
  test("Construction", () => {
    // @ts-expect-error A sound requires a `src` path
    new Sound();
    new Sound(path);
    new Sound(path, {});
    new Sound(path, { context, forceBuffer: true });
  });

  const sound = new Sound(path, { context, forceBuffer: true });

  test("Miscellaneous", () => {
    expectTypeOf(Sound.MAX_BUFFER_DURATION).toBeNumber();
    expectTypeOf(Sound.emittedEvents).toEqualTypeOf<string[]>();

    expectTypeOf(sound.id).toEqualTypeOf<number>();
    expectTypeOf(sound.src).toEqualTypeOf<string>();

    expectTypeOf(sound._manager).toEqualTypeOf<AmbientSound.Implementation | null>();

    expectTypeOf(sound["_createNodes"]()).toBeVoid();
    expectTypeOf(sound["_connectPipeline"]()).toBeVoid();
    expectTypeOf(sound["_disconnectPipeline"]()).toBeVoid();
  });

  test("State", () => {
    expectTypeOf(Sound.STATES).toExtend<Readonly<Record<keyof Sound.States, Sound.STATES>>>();

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
  });

  test("Playback control", () => {
    expectTypeOf(sound.load()).toEqualTypeOf<Promise<Sound>>();
    expectTypeOf(sound.load({})).toEqualTypeOf<Promise<Sound>>();
    expectTypeOf(sound.load({ autoplay: true, autoplayOptions: playbackOptions })).toEqualTypeOf<Promise<Sound>>();
    expectTypeOf(sound.load({ autoplay: true, autoplayOptions: playbackOptionsUndefined })).toEqualTypeOf<
      Promise<Sound>
    >();
    expectTypeOf(sound.load({ autoplay: undefined, autoplayOptions: undefined })).toEqualTypeOf<Promise<Sound>>();
    expectTypeOf(sound["_load"]()).toEqualTypeOf<Promise<void>>();

    expectTypeOf(sound.play()).toEqualTypeOf<Promise<Sound>>();
    expectTypeOf(sound.play({})).toEqualTypeOf<Promise<Sound>>();
    expectTypeOf(sound.play(playbackOptions)).toEqualTypeOf<Promise<Sound>>();
    expectTypeOf(sound.play(playbackOptionsUndefined)).toEqualTypeOf<Promise<Sound>>();
    expectTypeOf(sound["_play"]()).toBeVoid();

    expectTypeOf(sound.playAtPosition(point, 50)).toEqualTypeOf<Promise<typeof sound | null>>();
    expectTypeOf(sound.playAtPosition(elevatedPoint, 50)).toEqualTypeOf<Promise<typeof sound | null>>();
    expectTypeOf(sound.playAtPosition(elevatedPoint, 50, filledInPlayAtPositionOptions)).toEqualTypeOf<
      Promise<typeof sound | null>
    >();
    expectTypeOf(sound.playAtPosition(elevatedPoint, 50, undefinedPlayAtPositionOptions)).toEqualTypeOf<
      Promise<typeof sound | null>
    >();

    expectTypeOf(sound.pause()).toEqualTypeOf<void>();
    expectTypeOf(sound["_pause"]()).toBeVoid();

    expectTypeOf(sound.stop()).toEqualTypeOf<Promise<Sound>>();
    expectTypeOf(sound.stop({})).toEqualTypeOf<Promise<Sound>>();
    expectTypeOf(sound.stop(playbackOptions)).toEqualTypeOf<Promise<Sound>>();
    expectTypeOf(sound.stop(playbackOptionsUndefined)).toEqualTypeOf<Promise<Sound>>();
    expectTypeOf(sound["_stop"]()).toBeVoid();

    expectTypeOf(sound.fade(1)).toEqualTypeOf<Promise<void>>();
    expectTypeOf(sound.fade(1, {})).toEqualTypeOf<Promise<void>>();
    expectTypeOf(sound.fade(1, { duration: 2000, from: 0.2, type: "exponential" })).toEqualTypeOf<Promise<void>>();
    expectTypeOf(sound.fade(1, { duration: undefined, from: undefined, type: undefined })).toEqualTypeOf<
      Promise<void>
    >();

    expectTypeOf(sound.wait(1)).toEqualTypeOf<Promise<void>>();

    expectTypeOf(sound.schedule(callback, 42)).toEqualTypeOf<Promise<void>>();
    expectTypeOf(sound.schedule(() => 3, 3)).toEqualTypeOf<Promise<number>>();
    expectTypeOf(sound.schedule(() => "a", 3)).toEqualTypeOf<Promise<string>>();
    expectTypeOf(sound.schedule(async () => "a", 3)).toEqualTypeOf<Promise<string>>();

    expectTypeOf(sound.unschedule(timeout)).toBeVoid();
    expectTypeOf(sound.unschedule({ timeout })).toBeVoid();

    expectTypeOf(sound.unscheduleAll()).toBeVoid();

    expectTypeOf(sound.applyEffects()).toEqualTypeOf<void>();
  });

  test("Events", () => {
    const eventCallback = (e: Event) => console.log(e);
    expectTypeOf(sound.addEventListener("eventName", eventCallback)).toBeVoid();
    expectTypeOf(sound.addEventListener("eventName", eventCallback, {})).toBeVoid();
    expectTypeOf(sound.addEventListener("eventName", eventCallback, { once: true })).toBeVoid();
    expectTypeOf(sound.addEventListener("eventName", eventCallback, { once: undefined })).toBeVoid();

    expectTypeOf(sound.removeEventListener("eventName", eventCallback)).toBeVoid();
    expectTypeOf(sound.dispatchEvent(new Event("eventName"))).toBeBoolean();
  });

  test("Deprecated", () => {
    // Deprecated since v12, until v14
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(Sound.LOAD_STATES).toEqualTypeOf<Sound.States>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(sound.loadState).toEqualTypeOf<Sound.STATES>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(sound.container).toEqualTypeOf<Sound>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(sound.node).toEqualTypeOf<Sound["sourceNode"]>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(sound.on("load", (ev) => console.log(ev))).toBeVoid();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(sound.off("load", (ev) => console.log(ev))).toBeVoid();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(sound.emit("load")).toBeVoid();
  });
});
