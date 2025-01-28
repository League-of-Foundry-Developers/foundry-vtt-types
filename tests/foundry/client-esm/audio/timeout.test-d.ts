import { expectTypeOf } from "vitest";

const timeout = new foundry.audio.AudioTimeout(3);

const callbackString = { callback: () => "" };
const callbackNumber = { callback: () => 0 };
const callbackAsync = { callback: async () => "" };

expectTypeOf(new foundry.audio.AudioTimeout(3, callbackString).complete).toEqualTypeOf<Promise<string> | undefined>();
expectTypeOf(new foundry.audio.AudioTimeout(3, callbackNumber).complete).toEqualTypeOf<Promise<number> | undefined>();
expectTypeOf(new foundry.audio.AudioTimeout(3, callbackAsync).complete).toEqualTypeOf<
  Promise<Promise<string>> | undefined
>();
expectTypeOf(timeout.cancel()).toEqualTypeOf<void>();
expectTypeOf(timeout.end()).toEqualTypeOf<void>();

expectTypeOf(foundry.audio.AudioTimeout.wait(3, callbackString)).toEqualTypeOf<Promise<string>>();
expectTypeOf(foundry.audio.AudioTimeout.wait(3, callbackNumber)).toEqualTypeOf<Promise<number>>();
expectTypeOf(foundry.audio.AudioTimeout.wait(3, callbackAsync)).toEqualTypeOf<Promise<Promise<string>>>();
