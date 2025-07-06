import { expectTypeOf } from "vitest";

import ResizeHandle = foundry.canvas.containers.ResizeHandle;
import Canvas = foundry.canvas.Canvas;

declare const someRect: Canvas.Rectangle;
declare const nullish: null | undefined;

// @ts-expect-error must pass offsets
new ResizeHandle();
new ResizeHandle([100, 200]);
new ResizeHandle([57, 93], { canDrag: undefined });
const myResizeHandle = new ResizeHandle([2, 3], { canDrag: () => true });

expectTypeOf(myResizeHandle.offset).toEqualTypeOf<[number, number]>();
expectTypeOf(myResizeHandle.handlers.canDrag).toEqualTypeOf<(() => boolean) | undefined>();
expectTypeOf(myResizeHandle.refresh({ x: 50, y: 70, height: 200, width: 545 })).toBeVoid();
expectTypeOf(myResizeHandle.refresh({ x: 50, y: 70, height: 200, width: 545 })).toBeVoid();

expectTypeOf(myResizeHandle.updateDimensions(someRect, someRect, someRect)).toEqualTypeOf<Canvas.Rectangle>();
expectTypeOf(
  myResizeHandle.updateDimensions(someRect, someRect, someRect, { aspectRatio: 16 / 9 }),
).toEqualTypeOf<Canvas.Rectangle>();
expectTypeOf(
  myResizeHandle.updateDimensions(someRect, someRect, someRect, { aspectRatio: nullish }),
).toEqualTypeOf<Canvas.Rectangle>();

expectTypeOf(myResizeHandle.activateListeners()).toBeVoid();

declare const fPE: PIXI.FederatedEvent<PointerEvent>;

expectTypeOf(myResizeHandle["_onHoverIn"](fPE)).toBeVoid();
expectTypeOf(myResizeHandle["_onHoverOut"](fPE)).toBeVoid();
expectTypeOf(myResizeHandle["_onMouseDown"](fPE)).toBeVoid();
