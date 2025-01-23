import { expectTypeOf } from "vitest";

const myPoint = new PIXI.Point(2, 2);

const myChevronPing = new ChevronPing(myPoint, {
  name: undefined,
  color: Color.fromHSL([0.5, 0.3, 0.92]),
  duration: 500,
  size: 48,
});

expectTypeOf(myChevronPing.animate()).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(myChevronPing._loadChevron()).toEqualTypeOf<Promise<PIXI.Sprite>>();
