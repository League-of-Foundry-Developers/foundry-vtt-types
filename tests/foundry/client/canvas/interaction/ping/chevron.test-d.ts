import { expectTypeOf } from "vitest";

import ChevronPing = foundry.canvas.interaction.ChevronPing;
import CanvasAnimation = foundry.canvas.animation.CanvasAnimation;

expectTypeOf(ChevronPing.CHEVRON_PATH).toBeString();

new ChevronPing({ x: 91, y: 64 });
const myChevronPing = new ChevronPing(
  { x: 12, y: 68 },
  {
    name: undefined,
    color: Color.fromHSL([0.5, 0.3, 0.92]),
    duration: 500,
    size: 48,
  },
);

expectTypeOf(myChevronPing.animate()).toEqualTypeOf<Promise<boolean>>();

declare const animData: CanvasAnimation.AnimationData<typeof myChevronPing>;

expectTypeOf(myChevronPing["_animateFrame"](20, animData)).toBeVoid();
