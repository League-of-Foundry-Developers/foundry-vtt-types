import { expectTypeOf } from "vitest";
import Sound = foundry.audio.Sound;
import AudioHelper = foundry.audio.AudioHelper;

const path = "a/path/to/some/sound/file.ogg";

expectTypeOf(AudioHelper.levelAnalyserNativeInterval).toBeNumber();
expectTypeOf(AudioHelper.THRESHOLD_CACHE_SIZE_BYTES).toBeNumber();
expectTypeOf(AudioHelper.hasAudioExtension(path)).toBeBoolean();
expectTypeOf(AudioHelper.getDefaultSoundName(path)).toBeString();
expectTypeOf(AudioHelper.registerSettings()).toBeVoid();

declare const socket: io.Socket;
expectTypeOf(AudioHelper._activateSocketListeners(socket)).toEqualTypeOf<void>();

const playData = {
  src: path,
  autoplay: false,
  channel: "music",
  loop: true,
  volume: 0.5,
} as const;
const playDataNullish = {
  src: path,
  // autoplay is `false` or omitted
  // channel cannot be nullish because mergeObject
  loop: null,
  volume: null,
} as const;

// @ts-expect-error Must pass a `PlayData` with a `src` prop
AudioHelper.play();
expectTypeOf(AudioHelper.play({ src: path })).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(AudioHelper.play(playData)).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(AudioHelper.play(playDataNullish)).toEqualTypeOf<Promise<Sound>>();

expectTypeOf(AudioHelper.play(playData, true)).toEqualTypeOf<Promise<Sound>>();
// all falsey values for `socketOptions` are equivalent
expectTypeOf(AudioHelper.play(playData, null)).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(AudioHelper.play(playData, {})).toEqualTypeOf<Promise<Sound>>();
// @ts-expect-error If provided, `recipients` can't be nullish
expectTypeOf(AudioHelper.play(playData, { recipients: undefined })).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(AudioHelper.play(playData, { recipients: ["XXXXXSomeIDXXXXX", "UUUUUSomeIDUUUUU"] })).toEqualTypeOf<
  Promise<Sound>
>();

expectTypeOf(AudioHelper.preloadSound(path)).toEqualTypeOf<Promise<Sound>>();

expectTypeOf(AudioHelper.inputToVolume(0.873)).toEqualTypeOf<number>();
// a valid call that returns NaN, to be avoided:
expectTypeOf(AudioHelper.inputToVolume("")).toEqualTypeOf<number>();
expectTypeOf(AudioHelper.inputToVolume("0.42")).toEqualTypeOf<number>();
expectTypeOf(AudioHelper.inputToVolume(0.873, 1.7)).toEqualTypeOf<number>();

expectTypeOf(AudioHelper.volumeToInput(0.215)).toEqualTypeOf<number>();
expectTypeOf(AudioHelper.volumeToInput(0.215, 1.2)).toEqualTypeOf<number>();

const helper = new AudioHelper();

expectTypeOf(helper.sounds).toEqualTypeOf<Map<string, WeakRef<Sound>>>();
expectTypeOf(helper.playing).toEqualTypeOf<Map<number, Sound>>();
expectTypeOf(helper.pending).toEqualTypeOf<(() => void)[]>();
expectTypeOf(helper.unlock).toEqualTypeOf<Promise<void>>();
expectTypeOf(helper.locked).toEqualTypeOf<boolean>();
expectTypeOf(helper.music).toEqualTypeOf<AudioContext | undefined>();
expectTypeOf(helper.environment).toEqualTypeOf<AudioContext | undefined>();
expectTypeOf(helper.interface).toEqualTypeOf<AudioContext | undefined>();
expectTypeOf(helper.context).toEqualTypeOf<AudioContext | undefined>();
expectTypeOf(helper.buffers).toEqualTypeOf<foundry.audio.AudioBufferCache>();

declare const context: AudioContext;
declare const autoplayOptions: Sound.PlaybackOptions; // full testing of this is in Sound's file
// @ts-expect-error Must pass a `PlaybackOptions` with a `src` prop
expectTypeOf(helper.create()).toEqualTypeOf<Sound>();
expectTypeOf(helper.create({ src: path })).toEqualTypeOf<Sound>();
expectTypeOf(
  helper.create({ src: path, context, autoplay: true, preload: false, singleton: true, autoplayOptions }),
).toEqualTypeOf<Sound>();
expectTypeOf(
  helper.create({
    src: path,
    context: null,
    autoplay: null,
    preload: null,
    singleton: null,
    autoplayOptions: undefined,
  }),
).toEqualTypeOf<Sound>();

// this is just the options for `Sound.play`, plus `context`
const playOptions = { context, ...autoplayOptions };
expectTypeOf(helper.play(path)).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(helper.play(path, {})).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(helper.play(path, playOptions)).toEqualTypeOf<Promise<Sound>>();

expectTypeOf(helper.awaitFirstGesture()).toEqualTypeOf<Promise<void>>();
expectTypeOf(helper.preload(path)).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(helper.getAnalyzerContext()).toEqualTypeOf<AudioContext>();

declare const mediaStream: MediaStream;
declare const levelReportingCallback: (maxDecibel: number, fftArray: Float32Array) => void;
expectTypeOf(helper.startLevelReports("foo", mediaStream, levelReportingCallback)).toEqualTypeOf<boolean>();
expectTypeOf(helper.startLevelReports("foo", mediaStream, levelReportingCallback, 25)).toEqualTypeOf<boolean>();
expectTypeOf(helper.startLevelReports("foo", mediaStream, levelReportingCallback, 25, 0.2)).toEqualTypeOf<boolean>();
expectTypeOf(helper.stopLevelReports("foo")).toBeVoid();

declare const event: Event;
declare const resolveCB: () => void;
expectTypeOf(helper["_onFirstGesture"](event, resolveCB)).toBeVoid();

expectTypeOf(helper.debug("a debug message")).toEqualTypeOf<void>();

// deprecated since v12, until v14
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(helper.getCache("bar")).toEqualTypeOf<AudioBuffer | undefined>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(helper.updateCache("baz", true)).toBeVoid();
declare const buffer: AudioBuffer;
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(helper.setCache("fizz", buffer)).toBeVoid();
