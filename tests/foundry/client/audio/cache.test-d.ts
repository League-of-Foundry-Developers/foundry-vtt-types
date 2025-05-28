import { expectTypeOf } from "vitest";
import AudioBufferCache = foundry.audio.AudioBufferCache;

let cache = new AudioBufferCache();
cache = new AudioBufferCache(655360); // 640k of audio buffer ought to be enough for anyone

expectTypeOf(cache.usage).toEqualTypeOf<AudioBufferCache.Usage>();
expectTypeOf(cache.getBuffer("foo")).toEqualTypeOf<AudioBuffer | undefined>();

declare const buffer: AudioBuffer;
expectTypeOf(cache.setBuffer("bar", buffer)).toEqualTypeOf<AudioBufferCache>();
expectTypeOf(cache.delete("baz")).toEqualTypeOf<boolean>();
expectTypeOf(cache.lock("foobar")).toEqualTypeOf<void>();
expectTypeOf(cache.toString()).toEqualTypeOf<string>();
