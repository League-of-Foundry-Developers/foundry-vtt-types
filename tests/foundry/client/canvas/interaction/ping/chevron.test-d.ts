import { describe, expectTypeOf, test } from "vitest";

import ChevronPing = foundry.canvas.interaction.ChevronPing;
import CanvasAnimation = foundry.canvas.animation.CanvasAnimation;

declare const animData: CanvasAnimation.AnimationData<ChevronPing>;

describe("ChevronPing tests", () => {
  test("Construction", () => {
    // @ts-expect-error Must pass an origin
    new ChevronPing();
    new ChevronPing({ x: 91, y: 64 });
    new ChevronPing(
      { x: 12, y: 68 },
      {
        name: undefined,
        color: Color.fromHSL([0.5, 0.3, 0.92]),
        duration: 500,
        size: 48,
      },
    );
  });

  const myChevronPing = new ChevronPing(
    { x: 12, y: 68 },
    {
      name: undefined,
      color: Color.fromHSL([0.5, 0.3, 0.92]),
      duration: 500,
      size: 48,
    },
  );

  test("Miscellaneous", () => {
    expectTypeOf(ChevronPing.CHEVRON_PATH).toBeString();
  });

  test("Animation", () => {
    expectTypeOf(myChevronPing.animate()).toEqualTypeOf<Promise<boolean>>();
    expectTypeOf(myChevronPing["_animateFrame"](20, animData)).toBeVoid();
  });
});
