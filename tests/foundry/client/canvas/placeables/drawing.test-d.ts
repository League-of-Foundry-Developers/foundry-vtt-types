import { expectTypeOf } from "vitest";

import Drawing = foundry.canvas.placeables.Drawing;
import ShapeObjectMixin from "#client/canvas/placeables/mixins/shapes.mjs";
import PrimaryGraphics = foundry.canvas.primary.PrimaryGraphics;

declare const drawingDoc: DrawingDocument.Stored;
declare const scene: Scene.Stored;

expectTypeOf(Drawing.implementation).toEqualTypeOf<Drawing.ImplementationClass>();
expectTypeOf(Drawing.embeddedName).toEqualTypeOf<"Drawing">();
expectTypeOf(Drawing.RENDER_FLAGS.redraw.propagate).toEqualTypeOf<
  | Array<
      | "refresh"
      | "refreshState"
      | "refreshVisibility"
      | "refreshTransform"
      | "refreshPosition"
      | "refreshRotation"
      | "refreshSize"
      | "refreshShape"
      | "refreshText"
      | "refreshFrame"
      | "refreshElevation"
    >
  | undefined
>();
expectTypeOf(Drawing.FREEHAND_SAMPLE_RATE).toBeNumber();
expectTypeOf(Drawing.SHAPE_TYPES).toEqualTypeOf<foundry.data.ShapeData.TYPES>();
expectTypeOf(Drawing.rescaleDimensions(drawingDoc.toObject(), 50, 72)).toEqualTypeOf<DrawingDocument.Source>();
expectTypeOf(Drawing.normalizeShape(drawingDoc.toObject())).toEqualTypeOf<DrawingDocument.Source>();

Hooks.on("drawDrawing", (object) => {
  expectTypeOf(object).toEqualTypeOf<Drawing.Implementation>();
});

Hooks.on("refreshDrawing", (object) => {
  expectTypeOf(object).toEqualTypeOf<Drawing.Implementation>();
});

Hooks.on("destroyDrawing", (object) => {
  expectTypeOf(object).toEqualTypeOf<Drawing.Implementation>();
});

Hooks.on("controlDrawing", (object, controlled) => {
  expectTypeOf(object).toEqualTypeOf<Drawing.Implementation>();
  expectTypeOf(controlled).toEqualTypeOf<boolean>();
});

Hooks.on("hoverDrawing", (object, hover) => {
  expectTypeOf(object).toEqualTypeOf<Drawing.Implementation>();
  expectTypeOf(hover).toEqualTypeOf<boolean>();
});

const drawing = new CONFIG.Drawing.objectClass(drawingDoc);

expectTypeOf(drawing.isAuthor).toBeBoolean();
expectTypeOf(drawing.isVisible).toBeBoolean();
expectTypeOf(drawing.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(drawing.center).toEqualTypeOf<PIXI.Point>();
expectTypeOf(drawing.isTiled).toBeBoolean();
expectTypeOf(drawing.isPolygon).toBeBoolean();
expectTypeOf(drawing.hasText).toBeBoolean();
expectTypeOf(drawing._pendingText).toEqualTypeOf<string | undefined>();
expectTypeOf(drawing._onkeydown).toEqualTypeOf<((event: KeyboardEvent) => void) | null>();
expectTypeOf(drawing.shape).toEqualTypeOf<PrimaryGraphics | PIXI.Graphics | undefined>();
expectTypeOf(drawing.text).toEqualTypeOf<PIXI.Text | null>();
expectTypeOf(drawing.frame).toEqualTypeOf<PIXI.Container | undefined>();
expectTypeOf(drawing.controls).toEqualTypeOf<PIXI.Container | undefined>();

// @ts-expect-error _destroy always gets passed a value, even if that value is `undefined`
expectTypeOf(drawing["_destroy"]()).toBeVoid();
expectTypeOf(drawing["_destroy"]({})).toBeVoid();
expectTypeOf(drawing["_destroy"]({ baseTexture: true, children: true, texture: true })).toBeVoid();
expectTypeOf(drawing["_destroy"](true)).toBeVoid();
expectTypeOf(drawing["_destroy"](undefined)).toBeVoid();

// @ts-expect-error _draw always gets passed a value
expectTypeOf(drawing["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(drawing["_draw"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(drawing["_clear"]()).toBeVoid();

expectTypeOf(drawing["_getLineStyle"]()).toEqualTypeOf<Drawing.LineStyleData>();
expectTypeOf(drawing["_getFillStyle"]()).toEqualTypeOf<Drawing.FillStyleData>();
expectTypeOf(drawing["_getTextStyle"]()).toEqualTypeOf<PIXI.TextStyle>();

expectTypeOf(drawing.clone()).toEqualTypeOf<Drawing.Implementation>();
// @ts-expect-error an object must be passed
expectTypeOf(drawing["_applyRenderFlags"]()).toBeVoid();
expectTypeOf(drawing["_applyRenderFlags"]({})).toBeVoid();
// all falsey values have no effect
expectTypeOf(drawing["_applyRenderFlags"]({ refreshElevation: false, refreshTransform: undefined })).toBeVoid();
expectTypeOf(
  drawing["_applyRenderFlags"]({
    redraw: true,
    refresh: true,
    refreshState: true,
    refreshTransform: true,
    refreshPosition: true,
    refreshRotation: true,
    refreshSize: true,
    refreshShape: true,
    refreshText: true,
    refreshFrame: true,
    refreshElevation: true,
  }),
).toBeVoid();

expectTypeOf(drawing["_refreshPosition"]()).toBeVoid();
expectTypeOf(drawing["_refreshRotation"]()).toBeVoid();
expectTypeOf(drawing["_refreshVisibility"]()).toBeVoid();
expectTypeOf(drawing["_refreshState"]()).toBeVoid();
expectTypeOf(drawing["_refreshShape"]()).toBeVoid();
expectTypeOf(drawing["_refreshElevation"]()).toBeVoid();
expectTypeOf(drawing["_refreshText"]()).toBeVoid();

expectTypeOf(
  drawing["_onCreate"](
    drawingDoc.toObject(),
    { action: "create", documentName: "Drawing", parent: scene, modifiedTime: 7, render: true, renderSheet: false },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(
  drawing._onUpdate(
    // partial source data
    { bezierFactor: 2, flags: { core: { sheetLock: true } }, fillColor: "#ABCFEF" },
    {
      action: "update",
      documentName: "Drawing",
      parent: scene,
      modifiedTime: 7,
      render: true,
      diff: true,
      recursive: true,
    },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(
  drawing._onDelete(
    { action: "delete", documentName: "Drawing", parent: scene, modifiedTime: 7, render: true },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

// @ts-expect-error _onControl is always passed a value
expectTypeOf(drawing["_onControl"]()).toBeVoid();
expectTypeOf(drawing["_onControl"]({})).toBeVoid();
expectTypeOf(drawing["_onControl"]({ releaseOthers: false })).toBeVoid();

// @ts-expect-error _onRelease always gets passed a value
expectTypeOf(drawing["_onRelease"]()).toBeVoid();
expectTypeOf(drawing["_onRelease"]({})).toBeVoid();

expectTypeOf(drawing["_overlapsSelection"](new PIXI.Rectangle())).toBeBoolean();

expectTypeOf(drawing.enableTextEditing()).toBeVoid();
expectTypeOf(drawing.enableTextEditing({})).toBeVoid();
expectTypeOf(drawing.enableTextEditing({ forceTextEditing: true, isNew: false })).toBeVoid();
expectTypeOf(drawing.enableTextEditing({ forceTextEditing: undefined, isNew: undefined })).toBeVoid();

// TODO: _onUpdate test after document test helpers are done

declare const someUser: User.Implementation;
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
expectTypeOf(drawing["_canControl"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(drawing["_canConfigure"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(drawing._hasShapeChanged({ rotation: 45 })).toBeBoolean();
expectTypeOf(drawing["_initializeDragShape"](pointerEvent)).toEqualTypeOf<foundry.data.BaseShapeData>();
expectTypeOf(drawing["_updateDragPreviews"](pointerEvent)).toBeVoid();
expectTypeOf(drawing["_prepareDragLeftDropUpdates"](pointerEvent)).toEqualTypeOf<
  ShapeObjectMixin.DragLeftDropUpdate[]
>();
