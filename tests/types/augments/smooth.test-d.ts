import { expectTypeOf, test } from "vitest";

test("types/augments/smooth", () => {
  const graphics = new PIXI.smooth.SmoothGraphics();

  const scaleMode: string = PIXI.smooth.LINE_SCALE_MODE.NONE;
  expectTypeOf(scaleMode).toBeString();
  expectTypeOf(graphics.lineStyle(1, 0xffffff, 1, 0.5, PIXI.smooth.LINE_SCALE_MODE.NONE)).toEqualTypeOf<
    typeof graphics
  >();
  expectTypeOf(graphics.lineStyle({ width: 1, scaleMode: PIXI.smooth.LINE_SCALE_MODE.HORIZONTAL })).toEqualTypeOf<
    typeof graphics
  >();

  const joint: number = PIXI.smooth.JOINT_TYPE.JOINT_MITER;
  expectTypeOf(joint).toBeNumber();
});
