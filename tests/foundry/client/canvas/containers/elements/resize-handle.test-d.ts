import { describe, expectTypeOf, test } from "vitest";

import ResizeHandle = foundry.canvas.containers.ResizeHandle;
import Canvas = foundry.canvas.Canvas;

declare const rect: Canvas.Rectangle;
declare const nullish: null | undefined;
declare const federatedPointerEvent: PIXI.FederatedEvent<PointerEvent>;

describe("ResizeHandle Tests", () => {
  test("Construction", () => {
    // @ts-expect-error must pass offsets
    new ResizeHandle();
    new ResizeHandle([100, 200]);
    new ResizeHandle([57, 93], { canDrag: undefined });
    new ResizeHandle([2, 3], { canDrag: () => true });
  });

  const myResizeHandle = new ResizeHandle([2, 3], { canDrag: () => true });

  test("Uncategorized", () => {
    expectTypeOf(myResizeHandle.offset).toEqualTypeOf<[number, number]>();
    expectTypeOf(myResizeHandle.handlers.canDrag).toEqualTypeOf<(() => boolean) | undefined>();
    expectTypeOf(myResizeHandle.refresh({ x: 50, y: 70, height: 200, width: 545 })).toBeVoid();
    expectTypeOf(myResizeHandle.refresh({ x: 50, y: 70, height: 200, width: 545 })).toBeVoid();

    expectTypeOf(myResizeHandle.updateDimensions(rect, rect, rect)).toEqualTypeOf<Canvas.Rectangle>();
    expectTypeOf(
      myResizeHandle.updateDimensions(rect, rect, rect, { aspectRatio: 16 / 9 }),
    ).toEqualTypeOf<Canvas.Rectangle>();
    expectTypeOf(
      myResizeHandle.updateDimensions(rect, rect, rect, { aspectRatio: nullish }),
    ).toEqualTypeOf<Canvas.Rectangle>();
  });

  test("Events", () => {
    expectTypeOf(myResizeHandle.activateListeners()).toBeVoid();
    expectTypeOf(myResizeHandle["_onHoverIn"](federatedPointerEvent)).toBeVoid();
    expectTypeOf(myResizeHandle["_onHoverOut"](federatedPointerEvent)).toBeVoid();
    expectTypeOf(myResizeHandle["_onMouseDown"](federatedPointerEvent)).toBeVoid();
  });
});
