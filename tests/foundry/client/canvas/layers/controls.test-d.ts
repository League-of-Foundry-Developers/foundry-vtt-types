import { expectTypeOf } from "vitest";
import type { LineIntersection } from "#common/utils/_module.d.mts";
import { ControlsLayer } from "#client/canvas/layers/_module.mjs";

import Canvas = foundry.canvas.Canvas;
import Cursor = foundry.canvas.containers.Cursor;
import InteractionLayer = foundry.canvas.layers.InteractionLayer;
import Ruler = foundry.canvas.interaction.Ruler;
import Ray = foundry.canvas.geometry.Ray;

expectTypeOf(ControlsLayer.instance).toExtend<ControlsLayer.Implementation | undefined>();
expectTypeOf(ControlsLayer.layerOptions).toEqualTypeOf<ControlsLayer.LayerOptions>();

const layer = new ControlsLayer();

expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof InteractionLayer>();
expectTypeOf(layer.options).toEqualTypeOf<ControlsLayer.LayerOptions>();

expectTypeOf(layer.doors).toEqualTypeOf<PIXI.Container>();
expectTypeOf(layer.cursors).toEqualTypeOf<PIXI.Container>();
expectTypeOf(layer.rulers).toEqualTypeOf<PIXI.Container>();
expectTypeOf(layer.debug).toEqualTypeOf<PIXI.Graphics>();
expectTypeOf(layer.select).toEqualTypeOf<PIXI.Graphics | undefined>();

expectTypeOf(layer._cursors).toEqualTypeOf<Record<string, Cursor>>();
expectTypeOf(layer["_rulers"]).toEqualTypeOf<Record<string, Ruler.Implementation>>();
expectTypeOf(layer["_offscreenPings"]).toEqualTypeOf<Record<string, Canvas.Point>>();

expectTypeOf(layer.ruler).toEqualTypeOf<Ruler.Implementation | null>();
expectTypeOf(layer.getRulerForUser("afasfasg")).toEqualTypeOf<Ruler.Implementation | null>();

expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_tearDown"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(layer.drawCursors()).toBeVoid();
expectTypeOf(layer.drawRulers()).toBeVoid();
expectTypeOf(layer.drawDoors()).toBeVoid();

declare const someRect: PIXI.ICanvasRect;
expectTypeOf(layer.drawSelect(someRect)).toBeVoid();

expectTypeOf(layer["_deactivate"]()).toBeVoid();
expectTypeOf(layer["_onMouseMove"]()).toBeVoid();
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
declare const somePoint: PIXI.Point;
expectTypeOf(layer["_onLongPress"](pointerEvent, somePoint)).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(layer["_onCanvasPan"]()).toBeVoid();

declare const someUser: User.Implementation;
expectTypeOf(layer.drawCursor(someUser)).toEqualTypeOf<Cursor>();
expectTypeOf(layer.updateCursor(someUser, somePoint)).toBeVoid();
expectTypeOf(layer.updateCursor(someUser, null)).toBeVoid();

expectTypeOf(layer.updateRuler(someUser)).toBeVoid();
expectTypeOf(layer.updateRuler(someUser, null)).toBeVoid();
expectTypeOf(
  layer.updateRuler(someUser, {
    destination: { x: 50, y: 50 },
    history: [{ x: 20, y: 35, teleport: false, cost: 1 }],
    state: Ruler.STATES.MEASURING,
    token: "asfasgasg",
    waypoints: [
      { x: 0, y: 20 },
      { x: 10, y: 35 },
    ],
  }),
).toBeVoid();

// @ts-expect-error handlePing requires a `scene` ID in its options
expectTypeOf(layer.handlePing(someUser, somePoint)).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(layer.handlePing(someUser, somePoint, { scene: "some scene ID" })).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(
  layer.handlePing(someUser, somePoint, {
    scene: "some scene ID",
    color: 0xfaddaf,
    duration: 2323,
    name: "SomePing.ASFASDFAS",
    pull: null,
    size: 120,
    style: "alert",
    zoom: 2.6,
  }),
).toEqualTypeOf<Promise<boolean>>();

expectTypeOf(layer.drawOffscreenPing(somePoint)).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(layer.drawOffscreenPing(somePoint, {})).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(
  layer.drawOffscreenPing(somePoint, {
    color: [0.2, 0.7, 0.3],
    duration: 500,
    name: Symbol.toPrimitive,
    size: 500,
    style: "chevron",
    user: someUser,
  }),
).toEqualTypeOf<Promise<boolean>>();

expectTypeOf(layer.drawPing(somePoint)).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(layer.drawPing(somePoint, {})).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(
  layer.drawPing(somePoint, {
    // color: "#ABCDEF",
    name: null,
    duration: undefined,
    size: 250,
    style: null,
    user: null,
  }),
).toEqualTypeOf<Promise<boolean>>();

expectTypeOf(layer["_findViewportIntersection"](somePoint)).toEqualTypeOf<{
  ray: Ray;
  intersection: LineIntersection | undefined;
}>();

Hooks.on("drawControlsLayer", (layer) => {
  expectTypeOf(layer).toEqualTypeOf<ControlsLayer.Any>();
});

Hooks.on("tearDownControlsLayer", (layer) => {
  expectTypeOf(layer).toEqualTypeOf<ControlsLayer.Any>();
});

Hooks.on("activateControlsLayer", (layer) => {
  expectTypeOf(layer).toEqualTypeOf<ControlsLayer.Any>();
});

Hooks.on("deactivateControlsLayer", (layer) => {
  expectTypeOf(layer).toEqualTypeOf<ControlsLayer.Any>();
});
