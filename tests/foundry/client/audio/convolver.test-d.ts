import { describe, expectTypeOf, test } from "vitest";
import ConvolverEffect = foundry.audio.ConvolverEffect;

declare const context: AudioContext;
declare const buffer: AudioBuffer;
declare const audioNode: AudioNode;
declare const audioParam: AudioParam;

describe("ConvolverEffect Tests", () => {
  test("Construction", () => {
    // @ts-expect-error construction requires an AudioContext
    new ConvolverEffect();
    new ConvolverEffect(context);
    new ConvolverEffect(context, {});

    // all possible properties, most of which are deep magic as far as the test author is concerned
    new ConvolverEffect(context, {
      intensity: 9,
      impulseResponsePath: "some/path/to/file.wav",
      buffer,
      channelCount: 7,
      channelCountMode: "explicit",
      channelInterpretation: "speakers",
      disableNormalization: false,
    });

    // What Foundry actually expects you to pass, based on CONFIG.soundEffects
    new ConvolverEffect(context, {
      intensity: 8,
    });

    new ConvolverEffect(context, {
      intensity: undefined,
      impulseResponsePath: undefined,
      // the rest of the interface comes from a built-in that does not allow nullish values on any properties
    });
  });

  const effect = new ConvolverEffect(context, { intensity: 8 });

  test("Miscellaneous", () => {
    expectTypeOf(effect.intensity).toEqualTypeOf<number>();
    effect.intensity = 2; // setter; exactly equivalent to the following test
    expectTypeOf(effect.update({ intensity: 2 })).toEqualTypeOf<void>();
    // non-Finite `intensity`s are ignored
    expectTypeOf(effect.update({ intensity: undefined })).toEqualTypeOf<void>();
  });

  test("Connection", () => {
    expectTypeOf(effect.disconnect()).toEqualTypeOf<void>();
    expectTypeOf(effect.disconnect(audioNode)).toEqualTypeOf<void>();
    expectTypeOf(effect.disconnect(audioParam)).toEqualTypeOf<void>();
    expectTypeOf(effect.connect(audioNode)).toEqualTypeOf<AudioNode>();
    // Foundry doesn't support this overload, so its deprecated
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(effect.connect(audioParam)).toEqualTypeOf<AudioParam>();
    expectTypeOf(effect.onConnectFrom(audioNode)).toEqualTypeOf<void>();
  });
});
