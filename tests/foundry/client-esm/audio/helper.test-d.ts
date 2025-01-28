import { expectTypeOf } from "vitest";
import type Sound from "../../../../src/foundry/client-esm/audio/sound.d.mts";

const helper = new foundry.audio.AudioHelper();

expectTypeOf(helper.sounds).toEqualTypeOf<Map<string, Sound>>();
expectTypeOf(helper.playing).toEqualTypeOf<Map<number, Sound>>();
expectTypeOf(helper.pending).toEqualTypeOf<(() => void)[]>();
expectTypeOf(helper.unlock).toEqualTypeOf<Promise<void>>();
expectTypeOf(helper.locked).toEqualTypeOf<boolean>();
expectTypeOf(helper.music).toEqualTypeOf<AudioContext>();
expectTypeOf(helper.environment).toEqualTypeOf<AudioContext>();
expectTypeOf(helper.interface).toEqualTypeOf<AudioContext>();
expectTypeOf(helper.context).toEqualTypeOf<AudioContext | undefined>();
expectTypeOf(helper.buffers).toEqualTypeOf<foundry.audio.AudioBufferCache>();

declare const context: AudioContext;
expectTypeOf(helper.create({ src: "", context: context })).toEqualTypeOf<Sound>();
expectTypeOf(helper.play("", {})).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(helper.awaitFirstGesture()).toEqualTypeOf<Promise<void>>();
expectTypeOf(helper.preload("")).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(helper.getAnalyzerContext()).toEqualTypeOf<AudioContext | null>();

declare const mediaStream: MediaStream;
declare const cb: (maxDecibel: number, fftArray: Float32Array) => void;
expectTypeOf(helper.startLevelReports("", mediaStream, cb)).toEqualTypeOf<boolean | undefined>();
expectTypeOf(helper.debug("")).toEqualTypeOf<void>();

expectTypeOf(foundry.audio.AudioHelper.levelAnalyserNativeInterval).toEqualTypeOf<number>();
expectTypeOf(foundry.audio.AudioHelper.THRESHOLD_CACHE_SIZE_BYTES).toEqualTypeOf<number>();
expectTypeOf(foundry.audio.AudioHelper.hasAudioExtension("")).toEqualTypeOf<boolean>();
expectTypeOf(foundry.audio.AudioHelper.getDefaultSoundName("")).toEqualTypeOf<string>();
expectTypeOf(foundry.audio.AudioHelper.registerSettings()).toEqualTypeOf<void>();

declare const socket: io.Socket;
expectTypeOf(foundry.audio.AudioHelper._activateSocketListeners(socket)).toEqualTypeOf<void>();

declare const data: foundry.audio.AudioHelper.PlayData;
expectTypeOf(foundry.audio.AudioHelper.play(data)).toEqualTypeOf<Promise<Sound>>();
expectTypeOf(foundry.audio.AudioHelper.inputToVolume(1)).toEqualTypeOf<number>();
expectTypeOf(foundry.audio.AudioHelper.inputToVolume("")).toEqualTypeOf<number>();
expectTypeOf(foundry.audio.AudioHelper.volumeToInput(1)).toEqualTypeOf<number>();
expectTypeOf(foundry.audio.AudioHelper.play(data)).toEqualTypeOf<Promise<Sound>>();
