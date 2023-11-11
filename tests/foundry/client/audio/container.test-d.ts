import { expectTypeOf } from "vitest";

const audioContainer = new AudioContainer("a/path/to/some/sound/file.ogg");
expectTypeOf(audioContainer).toEqualTypeOf<AudioContainer>();
expectTypeOf(audioContainer.src).toEqualTypeOf<string>();
expectTypeOf(audioContainer.sourceNode).toEqualTypeOf<
  AudioBufferSourceNode | MediaElementAudioSourceNode | undefined
>();
expectTypeOf(audioContainer.gainNode).toEqualTypeOf<GainNode | undefined>();
expectTypeOf(audioContainer.isBuffer).toEqualTypeOf<boolean>();
expectTypeOf(audioContainer.loaded).toEqualTypeOf<boolean>();
expectTypeOf(audioContainer.failed).toEqualTypeOf<boolean>();
expectTypeOf(audioContainer.playing).toEqualTypeOf<boolean>();
expectTypeOf(audioContainer.loop).toEqualTypeOf<boolean>();
expectTypeOf(AudioContainer.MAX_BUFFER_DURATION).toEqualTypeOf<number>();
expectTypeOf(audioContainer.buffer).toEqualTypeOf<AudioBuffer | null | undefined>();
expectTypeOf(audioContainer.context).toEqualTypeOf<AudioContext>();
expectTypeOf(audioContainer.duration).toEqualTypeOf<number | undefined>();
expectTypeOf(audioContainer.element).toEqualTypeOf<HTMLMediaElement | undefined>();
expectTypeOf(audioContainer.load()).toEqualTypeOf<Promise<void>>();
expectTypeOf(audioContainer.play(0, () => undefined)).toEqualTypeOf<void>();
expectTypeOf(audioContainer.stop()).toEqualTypeOf<void>();
