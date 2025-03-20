import { expectTypeOf } from "vitest";

expectTypeOf(InterfaceCanvasGroup.groupName).toEqualTypeOf<"interface">();

declare const someDrawing: Drawing.Object;
const myInterfaceGroup = new InterfaceCanvasGroup();

expectTypeOf(myInterfaceGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"interface">>();
expectTypeOf(myInterfaceGroup.addDrawing(someDrawing)).toEqualTypeOf<PIXI.Graphics>();
expectTypeOf(myInterfaceGroup.removeDrawing(someDrawing)).toEqualTypeOf<void>();
expectTypeOf(
  myInterfaceGroup.createScrollingText({ x: 0, y: 0 }, "Scrolling! Text!", {
    distance: 256,
    anchor: CONST.TEXT_ANCHOR_POINTS.RIGHT,
    direction: CONST.TEXT_ANCHOR_POINTS.LEFT,
    jitter: 0.2,
    duration: 3000,
    // past this line are `PIXI.ITextStyle` props
    dropShadow: true,
    fontFamily: "serif",
    strokeThickness: 4,
  }),
).toEqualTypeOf<Promise<PreciseText | null>>();
