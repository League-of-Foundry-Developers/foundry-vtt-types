import { expectTypeOf } from "vitest";
import BiquadFilterEffect = foundry.audio.BiquadFilterEffect;

declare const context: AudioContext;
// @ts-expect-error construction requires an AudioContext
let bqf = new BiquadFilterEffect();
bqf = new BiquadFilterEffect(context);
bqf = new BiquadFilterEffect(context, {});

// all possible properties, most of which are deep magic as far as the test author is concerned
bqf = new BiquadFilterEffect(context, {
  intensity: 5,
  type: "highpass",
  channelCount: 3,
  channelCountMode: "clamped-max",
  channelInterpretation: "discrete",
  detune: 20,
  frequency: 500,
  gain: 2.0,
  Q: 7,
});

// what Foundry actually expects you to pass, based on CONFIG.soundEffects defaults
// and the examples for `SoundsLayer#playAtPosition`
bqf = new BiquadFilterEffect(context, {
  intensity: 4,
  type: "highpass",
});

bqf = new BiquadFilterEffect(context, {
  intensity: undefined,
  type: undefined,
  // the rest of the interface comes from a built-in that does not allow nullish values on any properties
});

expectTypeOf(bqf.intensity).toEqualTypeOf<number>();
bqf.intensity = 15; // setter; will be clamped to 10

expectTypeOf(bqf.update()).toEqualTypeOf<void>();
expectTypeOf(bqf.update({})).toEqualTypeOf<void>();
expectTypeOf(bqf.update({ intensity: 2, type: "lowpass" })).toEqualTypeOf<void>();
// non-Finite `intensity`s, and `type`s not in the allowed list, get completely ignored
expectTypeOf(bqf.update({ intensity: null, type: null })).toEqualTypeOf<void>();
// this would throw at runtime, because the type isn't `"lowpass"` or `"highpass"`
expectTypeOf(bqf.update({ intensity: 2, type: "lowpass" })).toEqualTypeOf<void>();
