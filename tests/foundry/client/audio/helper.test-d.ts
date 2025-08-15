import { describe, expectTypeOf, test } from "vitest";

import Sound = foundry.audio.Sound;
import AudioHelper = foundry.audio.AudioHelper;

const path = "a/path/to/some/sound/file.ogg";
declare const socket: io.Socket;
declare const buffer: AudioBuffer;
declare const context: AudioContext;
declare const autoplayOptions: Sound.PlaybackOptions; // full testing of this is in Sound's file
declare const mediaStream: MediaStream;
declare const levelReportingCallback: (maxDecibel: number, fftArray: Float32Array) => void;

const playData = {
  src: path,
  autoplay: false,
  channel: "music",
  loop: true,
  volume: 0.5,
} as const satisfies AudioHelper.PlayData;
const playDataNullish = {
  src: path,
  // autoplay is `false` or omitted
  // channel cannot be nullish because mergeObject
  loop: undefined,
  volume: undefined,
} as const satisfies AudioHelper.PlayData;

// this is just the options for `Sound.play`, plus `context`
const playOptions = { context, ...autoplayOptions };

describe("AudioHelper Tests", () => {
  test("Construction", () => {
    new AudioHelper(); // takes no args
  });

  const helper = new AudioHelper();

  test("Miscellaneous", () => {
    expectTypeOf(AudioHelper.THRESHOLD_CACHE_SIZE_BYTES).toBeNumber();
    expectTypeOf(AudioHelper.registerSettings()).toBeVoid();
    expectTypeOf(AudioHelper._activateSocketListeners(socket)).toEqualTypeOf<void>();
    expectTypeOf(helper.awaitFirstGesture()).toEqualTypeOf<Promise<void>>();

    expectTypeOf(helper.playing).toEqualTypeOf<Map<number, Sound>>();
    expectTypeOf(helper.pending).toEqualTypeOf<(() => void)[]>();
    expectTypeOf(helper.unlock).toEqualTypeOf<Promise<void>>();
    expectTypeOf(helper.locked).toEqualTypeOf<boolean>();
    expectTypeOf(helper.buffers).toEqualTypeOf<foundry.audio.AudioBufferCache>();
  });

  test("Loading and creation", () => {
    expectTypeOf(helper.sounds).toEqualTypeOf<Map<string, WeakRef<Sound>>>();
    expectTypeOf(helper.preload(path)).toEqualTypeOf<Promise<Sound>>();
    expectTypeOf(AudioHelper.preloadSound(path)).toEqualTypeOf<Promise<Sound>>();
    expectTypeOf(AudioHelper.hasAudioExtension(path)).toBeBoolean();
    expectTypeOf(AudioHelper.getDefaultSoundName(path)).toBeString();

    // @ts-expect-error Must pass a `PlaybackOptions` with a `src` prop
    helper.create();

    expectTypeOf(helper.create({ src: path })).toEqualTypeOf<Sound>();
    expectTypeOf(
      helper.create({ src: path, context, autoplay: true, preload: false, singleton: true, autoplayOptions }),
    ).toEqualTypeOf<Sound>();
    expectTypeOf(
      helper.create({
        src: path,
        context: undefined,
        autoplay: undefined,
        preload: undefined,
        singleton: undefined,
        autoplayOptions: undefined,
      }),
    ).toEqualTypeOf<Sound>();
  });

  test("Analysis and reporting", () => {
    expectTypeOf(helper.analyzer).toEqualTypeOf<AudioHelper.AnalysisData>();
    expectTypeOf(helper.analyzer.environment.bands.bass).toBeNumber(); // nothing special about this, random property sample
    expectTypeOf(helper.getAnalyzerContext()).toEqualTypeOf<AudioContext>();
    expectTypeOf(AudioHelper.levelAnalyserNativeInterval).toBeNumber();
    expectTypeOf(helper.debug("a debug message")).toEqualTypeOf<void>();

    expectTypeOf(helper.startLevelReports("foo", mediaStream, levelReportingCallback)).toEqualTypeOf<boolean>();
    expectTypeOf(helper.startLevelReports("foo", mediaStream, levelReportingCallback, 25)).toEqualTypeOf<boolean>();
    expectTypeOf(
      helper.startLevelReports("foo", mediaStream, levelReportingCallback, 25, 0.2),
    ).toEqualTypeOf<boolean>();
    expectTypeOf(helper.stopLevelReports("foo")).toBeVoid();

    expectTypeOf(AudioHelper.ANALYSIS_TIMEOUT_MS).toBeNumber();

    // @ts-expect-error Foo is not a valid context name
    helper.enableAnalyzer("foo");
    expectTypeOf(helper.enableAnalyzer("environment")).toBeVoid();
    expectTypeOf(helper.enableAnalyzer("music", {})).toBeVoid();
    expectTypeOf(helper.enableAnalyzer("interface", { keepAlive: true })).toBeVoid();
    expectTypeOf(helper.enableAnalyzer("environment", { keepAlive: undefined })).toBeVoid();

    expectTypeOf(helper.disableAnalyzer("environment")).toBeVoid();

    // @ts-expect-error bar is not a valid band name
    helper.getBandLevel("environment", "bar");
    expectTypeOf(helper.getBandLevel("environment", "bass")).toBeNumber();
    expectTypeOf(helper.getBandLevel("environment", "treble", {})).toBeNumber();
    expectTypeOf(helper.getBandLevel("environment", "mid", { ignoreVolume: true })).toBeNumber();
    expectTypeOf(helper.getBandLevel("environment", "all", { ignoreVolume: undefined })).toBeNumber();

    expectTypeOf(helper.getMaxBandLevel()).toBeNumber();
    expectTypeOf(helper.getMaxBandLevel("mid")).toBeNumber();
    expectTypeOf(helper.getMaxBandLevel("treble", {})).toBeNumber();
    expectTypeOf(helper.getMaxBandLevel("bass", { ignoreVolume: true })).toBeNumber();
    expectTypeOf(helper.getMaxBandLevel("all", { ignoreVolume: undefined })).toBeNumber();
  });

  test("Contexts", () => {
    expectTypeOf(AudioHelper.AUDIO_CONTEXTS).toEqualTypeOf<ReadonlyArray<"environment" | "music" | "interface">>();
    expectTypeOf(helper.music).toEqualTypeOf<AudioContext | undefined>();
    expectTypeOf(helper.environment).toEqualTypeOf<AudioContext | undefined>();
    expectTypeOf(helper.interface).toEqualTypeOf<AudioContext | undefined>();
    expectTypeOf(helper.context).toEqualTypeOf<AudioContext | undefined>();
  });

  test("Volume", () => {
    expectTypeOf(AudioHelper.inputToVolume(0.873)).toEqualTypeOf<number>();
    // a valid call that returns NaN, to be avoided:
    expectTypeOf(AudioHelper.inputToVolume("")).toEqualTypeOf<number>();
    expectTypeOf(AudioHelper.inputToVolume("0.42")).toEqualTypeOf<number>();
    expectTypeOf(AudioHelper.inputToVolume(0.873, 1.7)).toEqualTypeOf<number>();

    expectTypeOf(AudioHelper.volumeToInput(0.215)).toEqualTypeOf<number>();
    expectTypeOf(AudioHelper.volumeToInput(0.215, 1.2)).toEqualTypeOf<number>();

    expectTypeOf(AudioHelper.volumeToPercentage(0.33)).toBeString();
    expectTypeOf(AudioHelper.volumeToPercentage(0.33, {})).toBeString();
    expectTypeOf(AudioHelper.volumeToPercentage(0.33, { label: true, decimalPlaces: 4 })).toBeString();
    expectTypeOf(AudioHelper.volumeToPercentage(0.33, { label: undefined, decimalPlaces: undefined })).toBeString();

    expectTypeOf(helper.globalMute).toBeBoolean();
    helper.globalMute = true; // Setter
  });

  test("Playback", () => {
    // Static:
    // @ts-expect-error Must pass a `PlayData` with a `src` prop
    AudioHelper.play();
    expectTypeOf(AudioHelper.play({ src: path })).toEqualTypeOf<Promise<Sound | void>>();
    expectTypeOf(AudioHelper.play(playData)).toEqualTypeOf<Promise<Sound | void>>();
    expectTypeOf(AudioHelper.play(playDataNullish)).toEqualTypeOf<Promise<Sound | void>>();

    expectTypeOf(AudioHelper.play(playData, true)).toEqualTypeOf<Promise<Sound | void>>();
    // all falsey values for `socketOptions` are equivalent
    expectTypeOf(AudioHelper.play(playData, undefined)).toEqualTypeOf<Promise<Sound | void>>();
    expectTypeOf(AudioHelper.play(playData, {})).toEqualTypeOf<Promise<Sound | void>>();

    // @ts-expect-error If provided, `recipients` can't be nullish
    AudioHelper.play(playData, { recipients: undefined });

    expectTypeOf(AudioHelper.play(playData, { recipients: ["XXXXXSomeIDXXXXX", "UUUUUSomeIDUUUUU"] })).toEqualTypeOf<
      Promise<Sound | void>
    >();

    // Instance:
    expectTypeOf(helper.play(path)).toEqualTypeOf<Promise<Sound>>();
    expectTypeOf(helper.play(path, {})).toEqualTypeOf<Promise<Sound>>();
    expectTypeOf(helper.play(path, playOptions)).toEqualTypeOf<Promise<Sound>>();
  });

  test("Deprecated", () => {
    // deprecated since v12, until v14
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(helper.getCache("bar")).toEqualTypeOf<AudioBuffer | undefined>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(helper.updateCache("baz", true)).toBeVoid();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(helper.setCache("fizz", buffer)).toBeVoid();
  });
});
