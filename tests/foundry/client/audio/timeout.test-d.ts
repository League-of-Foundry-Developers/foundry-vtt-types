import { describe, expectTypeOf, test } from "vitest";

import AudioTimeout = foundry.audio.AudioTimeout;

type NonsenseReturn = string | number | symbol[];
declare const context: AudioContext;
declare const callback: () => NonsenseReturn;

describe("AudioTimeout Tests", () => {
  test("Construction", () => {
    // @ts-expect-error construction requires a delay in ms to be passed
    new AudioTimeout();
    new AudioTimeout(300);
    new AudioTimeout(300, {});
    new AudioTimeout(300, { context: undefined, callback: undefined });
    new AudioTimeout(300, { context, callback });
  });

  const fixed = new AudioTimeout(300, { context, callback });

  test("Miscellaneous", () => {
    expectTypeOf(fixed).toEqualTypeOf<AudioTimeout<NonsenseReturn>>();
    expectTypeOf(fixed.complete).toEqualTypeOf<Promise<NonsenseReturn> | undefined>();
    expectTypeOf(fixed.cancelled).toBeBoolean();
    expectTypeOf(fixed.cancel()).toEqualTypeOf<void>();
    expectTypeOf(fixed.end()).toEqualTypeOf<void>();
  });

  const callbackString = { callback: () => "" };
  const callbackNumber = { callback: () => 0 };
  const callbackAsync = { callback: async () => "" };
  const callbackVoid = {
    callback: () => {
      return;
    },
  };

  test("Callback returns", () => {
    expectTypeOf(new AudioTimeout(3, callbackString).complete).toEqualTypeOf<Promise<string> | undefined>();
    expectTypeOf(new AudioTimeout(3, callbackNumber).complete).toEqualTypeOf<Promise<number> | undefined>();
    expectTypeOf(new AudioTimeout(3, callbackAsync).complete).toEqualTypeOf<Promise<Promise<string>> | undefined>();
    expectTypeOf(new AudioTimeout(3, callbackVoid).complete).toEqualTypeOf<Promise<void> | undefined>();

    expectTypeOf(AudioTimeout.wait(3, callbackString)).toEqualTypeOf<Promise<string>>();
    expectTypeOf(AudioTimeout.wait(3, callbackNumber)).toEqualTypeOf<Promise<number>>();
    expectTypeOf(AudioTimeout.wait(3, callbackAsync)).toEqualTypeOf<Promise<Promise<string>>>();
  });
});
