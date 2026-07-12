import { describe, expectTypeOf, test } from "vitest";

import VFXEffect = foundry.canvas.vfx.VFXEffect;
import VFXComponent = foundry.canvas.vfx.VFXComponent;

const data = {
  name: "arrowShot",
  components: { shake: { type: "shake" } },
  timeline: [{ component: "shake", position: 0 }],
} satisfies VFXEffect.CreateData;

describe("VFXEffect", () => {
  test("TimelineSequenceEntry shape", () => {
    const entry: VFXEffect.TimelineSequenceEntry = { component: "foo" };
    const entryWithPos: VFXEffect.TimelineSequenceEntry = { component: "foo", position: "+500" };
    expectTypeOf(entry.component).toEqualTypeOf<string>();
    expectTypeOf(entryWithPos.position).toEqualTypeOf<number | string | undefined>();
  });

  test("play returns Promise<boolean>", () => {
    const effect = new VFXEffect(data);
    expectTypeOf(effect.play()).toEqualTypeOf<Promise<boolean>>();
    expectTypeOf(effect.play({ target: { x: 0, y: 0 } })).toEqualTypeOf<Promise<boolean>>();
  });

  test("playing and started are booleans", () => {
    const effect = new VFXEffect(data);
    expectTypeOf(effect.playing).toEqualTypeOf<boolean>();
    expectTypeOf(effect.started).toEqualTypeOf<boolean>();
  });

  test("components is a record of VFXComponent", () => {
    const effect = new VFXEffect(data);
    expectTypeOf(effect.components).toEqualTypeOf<Record<string, VFXComponent>>();
  });

  test("clone returns this", () => {
    const effect = new VFXEffect(data);
    expectTypeOf(effect.clone()).toEqualTypeOf<typeof effect>();
  });

  test("stop and cancel return Promise<void>", () => {
    const effect = new VFXEffect(data);
    expectTypeOf(effect.stop()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(effect.cancel()).toEqualTypeOf<Promise<void>>();
  });

  test("resolveReferences accepts a record", () => {
    const effect = new VFXEffect(data);
    effect.resolveReferences({ target: { x: 100, y: 200 } });
    effect.resolveReferences();
  });
});
