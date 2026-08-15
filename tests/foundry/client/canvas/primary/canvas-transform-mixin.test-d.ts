import { describe, expectTypeOf, test } from "vitest";

import CanvasTransformMixin = foundry.canvas.primary.CanvasTransformMixin;

describe("CanvasTransformMixin tests", () => {
  const myCT = new (CanvasTransformMixin(PIXI.Container))();

  test("Miscellaneous", () => {
    expectTypeOf(myCT).toExtend<PIXI.Container>();
    expectTypeOf(myCT).toExtend<CanvasTransformMixin.AnyMixed>();

    expectTypeOf(myCT.canvasTransform).toEqualTypeOf<PIXI.Matrix>();
    expectTypeOf(myCT["_canvasTransformID"]).toBeNumber();
    expectTypeOf(myCT.canvasBounds).toEqualTypeOf<PIXI.Rectangle>();
    expectTypeOf(myCT["_canvasBounds"]).toEqualTypeOf<PIXI.Bounds>();
    expectTypeOf(myCT["_canvasBoundsID"]).toBeNumber();

    expectTypeOf(myCT["_calculateCanvasBounds"]()).toBeVoid();
    expectTypeOf(myCT.updateCanvasTransform()).toBeVoid();
    expectTypeOf(myCT["_onCanvasTransformUpdate"]()).toBeVoid();
    expectTypeOf(myCT["_onCanvasBoundsUpdate"]()).toBeVoid();
    expectTypeOf(myCT.containsCanvasPoint({ x: 1000, y: 1000 })).toBeBoolean();
  });
});

describe("CanvasTransformMixin subclass tests", () => {
  class MyCanvasTransform extends CanvasTransformMixin(PIXI.Container) {
    protected override _calculateCanvasBounds(): void {
      this._canvasBounds.addFramePad(0, 0, this.width, this.height, 0, 0);
    }

    protected override _onCanvasTransformUpdate(): void {
      this._canvasBoundsID++;
    }

    protected override _onCanvasBoundsUpdate(): void {}

    override containsCanvasPoint(point: PIXI.IPointData): boolean {
      return this.canvasBounds.contains(point.x, point.y);
    }
  }

  test("Subclass", () => {
    const myCT = new MyCanvasTransform();

    expectTypeOf(myCT.canvasTransform).toEqualTypeOf<PIXI.Matrix>();
    expectTypeOf(myCT.containsCanvasPoint({ x: 0, y: 0 })).toBeBoolean();
  });
});
