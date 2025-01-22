import { expectTypeOf } from "vitest";

declare function someEasing(pt: number): number;
declare const somePromise: Promise<unknown>;
expectTypeOf(CanvasAnimation.easeOutCircle(3)).toEqualTypeOf<number>();
expectTypeOf(
  CanvasAnimation.animate(
    [
      {
        parent: { darkness: 0 },
        attribute: "darkness",
        to: 0.8,
      },
    ],
    {
      duration: 2000,
      priority: 27 as PIXI.UPDATE_PRIORITY,
      easing: someEasing,
      name: "darknessShift",
      wait: somePromise,
    },
  ),
).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(CanvasAnimation.getAnimation("darknessShift")).toEqualTypeOf<CanvasAnimationData | undefined>;
