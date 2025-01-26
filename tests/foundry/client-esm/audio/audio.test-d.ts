import { expectTypeOf } from "vitest";

const audioHelper = new AudioHelper();
expectTypeOf(audioHelper).toEqualTypeOf<AudioHelper>();
expectTypeOf(audioHelper.context).toEqualTypeOf<AudioContext | undefined>();
expectTypeOf(audioHelper.buffers).toEqualTypeOf<
  Map<string, { buffer: AudioBuffer; lastAccessed: number; playing: boolean; size: number }>
>();
expectTypeOf(audioHelper.sounds).toEqualTypeOf<Map<string, Sound>>();
expectTypeOf(audioHelper.playing).toEqualTypeOf<Map<number, Sound>>();
expectTypeOf(audioHelper.pending).toEqualTypeOf<(() => void)[]>();
expectTypeOf(audioHelper.locked).toEqualTypeOf<boolean>();
expectTypeOf(AudioHelper.levelAnalyserNativeInterval).toEqualTypeOf<number>();
expectTypeOf(AudioHelper.registerSettings()).toEqualTypeOf<void>();
expectTypeOf(audioHelper.create({ src: "a/path/to/some/sound/file.ogg" })).toEqualTypeOf<Sound>();
expectTypeOf(
  audioHelper.create({
    src: "a/path/to/some/sound/file.ogg",
    singleton: false,
    preload: true,
    autoplay: true,
    autoplayOptions: { loop: true, offset: 42, volume: 0.5, fade: 3 },
  }),
).toEqualTypeOf<Sound>();
expectTypeOf(AudioHelper.hasAudioExtension("a/path/to/some/sound/file.ogg")).toEqualTypeOf<boolean>();
expectTypeOf(AudioHelper.getDefaultSoundName("a/path/to/some/sound/file.ogg")).toEqualTypeOf<string>();
expectTypeOf(audioHelper.play("a/path/to/some/sound/file.ogg")).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(
  audioHelper.play("a/path/to/some/sound/file.ogg", { loop: true, offset: 42, volume: 0.5, fade: 3 }),
).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(audioHelper.awaitFirstGesture()).toEqualTypeOf<Promise<AudioContext>>();
expectTypeOf(audioHelper.preload("a/path/to/some/sound/file.ogg")).toEqualTypeOf<Promise<Sound>>();

declare const socket: io.Socket;

expectTypeOf(AudioHelper._activateSocketListeners(socket)).toEqualTypeOf<void>();
expectTypeOf(
  AudioHelper.play({
    src: "a/path/to/some/sound/file.ogg",
  }),
).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(
  AudioHelper.play(
    {
      src: "a/path/to/some/sound/file.ogg",
      volume: 0.8,
      autoplay: false,
      loop: true,
    },
    true,
  ),
).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(AudioHelper.preloadSound("a/path/to/some/sound/file.ogg")).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(AudioHelper.inputToVolume(0.5)).toEqualTypeOf<number>();
expectTypeOf(AudioHelper.inputToVolume("0.5", 1.7)).toEqualTypeOf<number>();
expectTypeOf(AudioHelper.volumeToInput(0.5)).toEqualTypeOf<number>();
expectTypeOf(AudioHelper.volumeToInput(0.5, 1.7)).toEqualTypeOf<number>();
expectTypeOf(audioHelper.getAudioContext()).toEqualTypeOf<AudioContext | null>();

declare const stream: MediaStream;
declare const callback: (maxDecibel: number, fftArray: Float32Array) => void;

expectTypeOf(audioHelper.startLevelReports("some id", stream, callback)).toEqualTypeOf<boolean | undefined>();
expectTypeOf(audioHelper.startLevelReports("some id", stream, callback, 60, 0.2)).toEqualTypeOf<boolean | undefined>();
expectTypeOf(audioHelper.stopLevelReports("some id")).toEqualTypeOf<void>();
