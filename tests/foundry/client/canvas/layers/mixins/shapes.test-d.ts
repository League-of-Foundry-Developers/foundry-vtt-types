import { expectTypeOf } from "vitest";
import type { AnyMutableObject } from "fvtt-types/utils";

import ShapeLayerMixin from "#client/canvas/layers/mixins/shapes.mjs";
import NotesLayer = foundry.canvas.layers.NotesLayer;
import PlaceableObject = foundry.canvas.placeables.PlaceableObject;

// `NotesLayer` doesn't use `ShapeLayerMixin` at runtime; it's a concrete, non-generic `PlaceablesLayer`
// subclass used here only to exercise a real composition.
class TestShapeLayer extends ShapeLayerMixin(NotesLayer) {}

declare const layer: TestShapeLayer;

expectTypeOf(TestShapeLayer.layerOptions.allowedEmptyShapes).toEqualTypeOf<string[]>();
expectTypeOf(TestShapeLayer.layerOptions.discardClosingPoint).toBeBoolean();

expectTypeOf(layer._mouseWheelContext).toEqualTypeOf<ShapeLayerMixin.MouseWheelContext | null>();

expectTypeOf(layer.getSnappedPoint({ x: 0, y: 0 })).toEqualTypeOf<foundry.canvas.Canvas.Point>();

declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
declare const wheelEvent: foundry.canvas.Canvas.Event.Wheel;
declare const someUser: User.Implementation;

expectTypeOf(layer["_deactivate"]()).toBeVoid();
expectTypeOf(layer["_tearDown"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_onClickLeft"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onClickLeft2"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_canDragLeftStart"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(layer["_onDragLeftStart"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftMove"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftDrop"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_commitDragLeftDrop"](pointerEvent)).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_onDragLeftCancel"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_createDragShapeData"](pointerEvent)).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(layer["_updateDragPreview"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onMouseWheel"](wheelEvent)).toBeVoid();
expectTypeOf(layer["_cancelMouseWheel"]()).toBeVoid();
expectTypeOf(layer["_updateMouseWheelShape"](wheelEvent)).toBeVoid();
expectTypeOf(layer["_updateMouseWheelPreview"]()).toBeVoid();
// `toEqualTypeOf` rejects this union as a type argument: "Type 'AnyMutableObject | [data: AnyMutableObject,
// options?: AnyMutableObject | undefined]' does not satisfy the constraint '{ [x: string]: never; [x: number]:
// unknown; }'." Checked as mutual assignability instead.
type PrepareMouseWheelUpdateReturn =
  | AnyMutableObject
  | [data: AnyMutableObject, options?: AnyMutableObject | undefined];
expectTypeOf(layer["_prepareMouseWheelUpdate"]()).toExtend<PrepareMouseWheelUpdateReturn>();
expectTypeOf<PrepareMouseWheelUpdateReturn>().toExtend<ReturnType<TestShapeLayer["_prepareMouseWheelUpdate"]>>();

expectTypeOf<ShapeLayerMixin.MouseWheelContext["preview"]>().toEqualTypeOf<PlaceableObject.Any>();
