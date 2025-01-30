import { expectTypeOf } from "vitest";

const cache = new foundry.audio.AudioBufferCache();

expectTypeOf(cache.usage).toEqualTypeOf<foundry.audio.AudioBufferCache.Usage>();
expectTypeOf(cache.getBuffer("")).toEqualTypeOf<AudioBuffer>();

declare const buffer: AudioBuffer;
expectTypeOf(cache.setBuffer("", buffer)).toEqualTypeOf<foundry.audio.AudioBufferCache>();
expectTypeOf(cache.delete("")).toEqualTypeOf<boolean>();
expectTypeOf(cache.lock("")).toEqualTypeOf<void>();
expectTypeOf(cache.toString()).toEqualTypeOf<string>();
