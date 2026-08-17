import { expectTypeOf } from "vitest";
import drawBorder = foundry.canvas.borders.drawBorder;

declare const graphics: PIXI.smooth.SmoothGraphics;

expectTypeOf(drawBorder(graphics, new PIXI.Rectangle(0, 0, 10, 10))).toBeVoid();
expectTypeOf(drawBorder(graphics, new PIXI.RoundedRectangle(0, 0, 10, 10, 2))).toBeVoid();
expectTypeOf(drawBorder(graphics, new PIXI.Circle(0, 0, 10))).toBeVoid();
expectTypeOf(drawBorder(graphics, new PIXI.Ellipse(0, 0, 10, 5))).toBeVoid();
expectTypeOf(drawBorder(graphics, new PIXI.Polygon([0, 0, 10, 0, 10, 10]))).toBeVoid();

// A draw callback stands in for a shape; its return value is discarded.
expectTypeOf(drawBorder(graphics, (g) => g.drawCircle(0, 0, 10))).toBeVoid();

expectTypeOf(
  drawBorder(graphics, new PIXI.Circle(0, 0, 10), {
    color: 0x00ff00,
    dashed: true,
    alignment: 1,
    clear: false,
  }),
).toBeVoid();

expectTypeOf(
  drawBorder(graphics, new PIXI.Circle(0, 0, 10), {
    color: undefined,
    dashed: undefined,
    alignment: undefined,
    clear: undefined,
  }),
).toBeVoid();
