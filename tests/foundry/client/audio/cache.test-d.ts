import { describe, expectTypeOf, test } from "vitest";

import AudioBufferCache = foundry.audio.AudioBufferCache;

declare const buffer: AudioBuffer;

describe("AudioBufferCache", () => {
  test("Construction", () => {
    new AudioBufferCache(); // 1GB of cache by default but
    new AudioBufferCache(655360); // 640k of audio buffer ought to be enough for anyone
  });

  const cache = new AudioBufferCache();

  test("Miscellaneous", () => {
    expectTypeOf(cache.usage).toEqualTypeOf<AudioBufferCache.Usage>();
    expectTypeOf(cache.toString()).toEqualTypeOf<string>();
  });

  test("Entry operations", () => {
    expectTypeOf(cache.getBuffer("foo")).toEqualTypeOf<AudioBuffer | undefined>();
    expectTypeOf(cache.setBuffer("bar", buffer)).toEqualTypeOf<AudioBufferCache>();
    expectTypeOf(cache.delete("baz")).toEqualTypeOf<boolean>();
    expectTypeOf(cache.lock("foobar")).toEqualTypeOf<void>();
  });
});
