import { expectTypeOf } from "vitest";
import AudioTimeout = foundry.audio.AudioTimeout;

type NonsenseReturn = string | number | symbol[];
declare const context: AudioContext;
declare const callback: () => NonsenseReturn;

// @ts-expect-error construction requires a delay in ms to be passed
new AudioTimeout();
let timeout = new AudioTimeout(300);
timeout = new AudioTimeout(300, {});
timeout = new AudioTimeout(300, { context: null, callback: null });
timeout = new AudioTimeout(300, { context: undefined, callback: undefined });
const fixed = new AudioTimeout(300, { context, callback });

expectTypeOf(fixed).toEqualTypeOf<AudioTimeout<NonsenseReturn>>();
expectTypeOf(fixed.complete).toEqualTypeOf<Promise<NonsenseReturn> | undefined>();

const callbackString = { callback: () => "" };
const callbackNumber = { callback: () => 0 };
const callbackAsync = { callback: async () => "" };
const callbackVoid = {
  callback: () => {
    return;
  },
};

expectTypeOf(new AudioTimeout(3, callbackString).complete).toEqualTypeOf<Promise<string> | undefined>();
expectTypeOf(new AudioTimeout(3, callbackNumber).complete).toEqualTypeOf<Promise<number> | undefined>();
expectTypeOf(new AudioTimeout(3, callbackAsync).complete).toEqualTypeOf<Promise<Promise<string>> | undefined>();
expectTypeOf(new AudioTimeout(3, callbackVoid).complete).toEqualTypeOf<Promise<void> | undefined>();

expectTypeOf(timeout.cancel()).toEqualTypeOf<void>();
expectTypeOf(timeout.end()).toEqualTypeOf<void>();

expectTypeOf(AudioTimeout.wait(3, callbackString)).toEqualTypeOf<Promise<string>>();
expectTypeOf(AudioTimeout.wait(3, callbackNumber)).toEqualTypeOf<Promise<number>>();
expectTypeOf(AudioTimeout.wait(3, callbackAsync)).toEqualTypeOf<Promise<Promise<string>>>();
