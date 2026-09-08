import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import ShapeObjectMixin from "#client/canvas/placeables/mixins/shapes.mjs";
import Note = foundry.canvas.placeables.Note;
import ShapeControlsHandle = foundry.canvas.containers.ShapeControlsHandle;

// `Note` doesn't use `ShapeObjectMixin` at runtime; it's a concrete, non-generic `PlaceableObject`
// subclass used here only to exercise a real composition.
class TestShapeObject extends ShapeObjectMixin(Note.implementation) {}

declare const placeable: TestShapeObject;

expectTypeOf(placeable["_measurementLines"]).toEqualTypeOf<PIXI.Graphics>();
expectTypeOf(placeable["_measurementLabels"]).toEqualTypeOf<PIXI.Container>();
expectTypeOf(placeable["_measurementSolidLineStyle"]).toEqualTypeOf<PIXI.ILineStyleOptions>();
expectTypeOf(placeable["_measurementDashLineStyle"]).toEqualTypeOf<PIXI.ILineStyleOptions>();

expectTypeOf(placeable.hoveredHandle).toEqualTypeOf<ShapeControlsHandle.Any | null>();
expectTypeOf(placeable._hoveredHandle).toEqualTypeOf<ShapeControlsHandle.Any | null>();

expectTypeOf(placeable.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(placeable.center).toEqualTypeOf<PIXI.Point>();
expectTypeOf(placeable["_getTargetAlpha"]()).toBeNumber();
expectTypeOf(placeable["_overlapsSelection"](new PIXI.Rectangle())).toBeBoolean();

declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
declare const someUser: User.Implementation;

expectTypeOf(placeable["_onClickLeft"](pointerEvent)).toEqualTypeOf<boolean | void>();
expectTypeOf(placeable["_onClickLeft2"](pointerEvent)).toBeVoid();
expectTypeOf(placeable["_canDragLeftStart"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(placeable["_onDragLeftStart"](pointerEvent)).toEqualTypeOf<boolean | void>();
expectTypeOf(placeable["_onDragLeftMove"](pointerEvent)).toBeVoid();
expectTypeOf(placeable["_updateDragPreviews"](pointerEvent)).toBeVoid();
expectTypeOf(placeable["_onDragLeftDrop"](pointerEvent)).toEqualTypeOf<boolean | void>();
expectTypeOf(placeable["_onDragLeftCancel"](pointerEvent)).toEqualTypeOf<boolean | void>();
expectTypeOf(placeable["_initializeDragLeft"](pointerEvent)).toBeVoid();
expectTypeOf(placeable["_initializeDragShape"](pointerEvent)).toEqualTypeOf<foundry.data.BaseShapeData>();
expectTypeOf(placeable["_prepareDragLeftDropUpdates"](pointerEvent)).toEqualTypeOf<
  ShapeObjectMixin.DragLeftDropUpdate[]
>();
expectTypeOf(placeable["_finalizeDragLeft"](pointerEvent)).toBeVoid();

expectTypeOf(placeable["_draw"]({})).toBeVoid();
expectTypeOf(placeable["_getMeasurementTextStyle"]()).toEqualTypeOf<PIXI.TextStyle>();
expectTypeOf(placeable["_getMeasuredShapes"]()).toEqualTypeOf<foundry.data.BaseShapeData[]>();
expectTypeOf(placeable["_formatMeasuredDistance"](5)).toBeString();
expectTypeOf(placeable["_refreshMeasurements"]()).toBeVoid();

expectTypeOf(placeable["_onUpdate"]({}, {}, "someUserId")).toBeVoid();
expectTypeOf(placeable["_onDelete"]({}, "someUserId")).toBeVoid();
expectTypeOf(placeable._hasShapeChanged({} satisfies AnyObject)).toBeBoolean();
