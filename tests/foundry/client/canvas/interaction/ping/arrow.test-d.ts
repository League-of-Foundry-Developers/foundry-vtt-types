import { expectTypeOf } from "vitest";
import { ArrowPing } from "#client/canvas/interaction/_module.mjs";

const myPoint = new PIXI.Point(2, 2);

const myArrowPing = new ArrowPing(myPoint, {
  color: [0.2, 0.5, 0.6],
  color2: [0.3, 0, 0.2],
  name: "myArrowPing",
  rings: 2,
  rotation: Math.PI / 2,
  duration: 2000,
  size: 128,
});

expectTypeOf(myArrowPing.animate()).toEqualTypeOf<Promise<boolean>>();
