import { expectTypeOf } from "vitest";
import { Wall } from "#client/canvas/placeables/_module.mjs";
import type { DoorControl } from "#client/canvas/containers/_module.d.mts";

import Canvas = foundry.canvas.Canvas;
import Ray = foundry.canvas.geometry.Ray;

expectTypeOf(Wall.embeddedName).toEqualTypeOf<"Wall">();
expectTypeOf(Wall.RENDER_FLAGS.redraw.propagate).toEqualTypeOf<
  | Array<"refresh" | "refreshState" | "refreshLine" | "refreshEndpoints" | "refreshDirection" | "refreshHighlight">
  | undefined
>();

declare const doc: WallDocument.Stored;

const wall = new CONFIG.Wall.objectClass(doc);

expectTypeOf(wall.controlIcon).toBeNull();
expectTypeOf(wall.doorControl).toEqualTypeOf<DoorControl.ConfiguredInstance | null | undefined>();
expectTypeOf(wall.line).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(wall.endpoints).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(wall.directionIcon).toEqualTypeOf<PIXI.Sprite | undefined>();
expectTypeOf(wall.highlight).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(wall.coords).toEqualTypeOf<Wall.Coordinates>();
expectTypeOf(wall.edge).toEqualTypeOf<foundry.canvas.geometry.edges.Edge>();
expectTypeOf(wall.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(wall.isDoor).toBeBoolean();
expectTypeOf(wall.isOpen).toBeBoolean();
expectTypeOf(wall.midpoint).toEqualTypeOf<Canvas.PointTuple>();
expectTypeOf(wall.center).toEqualTypeOf<PIXI.Point>();
expectTypeOf(wall.direction).toEqualTypeOf<number | null>();
// @ts-expect-error "`Wall#getSnappedPosition` is not supported: WallDocument does not have a (x, y) position"
expectTypeOf(wall.getSnappedPosition()).toBeNever();

expectTypeOf(wall.initializeEdge()).toBeVoid();
expectTypeOf(wall.initializeEdge({})).toBeVoid();
expectTypeOf(wall.initializeEdge({ deleted: true })).toBeVoid();
expectTypeOf(wall.initializeEdge({ deleted: null })).toBeVoid();

expectTypeOf(wall.toRay()).toEqualTypeOf<Ray>();

// @ts-expect-error _draw always gets passed a value
expectTypeOf(wall["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(wall["_draw"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(wall.clear()).toEqualTypeOf<Wall.Implementation>();
expectTypeOf(wall.createDoorControl()).toEqualTypeOf<DoorControl.ConfiguredInstance>();
expectTypeOf(wall.clearDoorControl()).toBeVoid();

expectTypeOf(wall.control()).toBeBoolean();
expectTypeOf(wall.control({})).toBeBoolean();
expectTypeOf(wall.control({ releaseOthers: true, chain: true })).toBeBoolean();
expectTypeOf(wall.control({ releaseOthers: false, chain: null })).toBeBoolean();

// @ts-expect-error _destroy always gets passed a value, even if that value is `undefined`
expectTypeOf(wall["_destroy"]()).toBeVoid();
expectTypeOf(wall["_destroy"]({})).toBeVoid();
expectTypeOf(wall["_destroy"]({ baseTexture: true, children: true, texture: true })).toBeVoid();
expectTypeOf(wall["_destroy"](true)).toBeVoid();
expectTypeOf(wall["_destroy"](undefined)).toBeVoid();

expectTypeOf(wall.isDirectionBetweenAngles(60, 90)).toBeBoolean();
declare const someRay: Ray;
expectTypeOf(wall.canRayIntersect(someRay)).toBeBoolean();
expectTypeOf(wall.getLinkedSegments()).toEqualTypeOf<Wall.GetLinkedSegmentsReturn>();

// @ts-expect-error an object must be passed
expectTypeOf(wall["_applyRenderFlags"]()).toBeVoid();
expectTypeOf(wall["_applyRenderFlags"]({})).toBeVoid();
// all falsey values have no effect
expectTypeOf(wall["_applyRenderFlags"]({ refreshLine: null, refreshEndpoints: undefined })).toBeVoid();
expectTypeOf(
  wall["_applyRenderFlags"]({
    redraw: true,
    refresh: true,
    refreshState: true,
    refreshLine: true,
    refreshEndpoints: true,
    refreshDirection: true,
    refreshHighlight: true,
  }),
).toBeVoid();

expectTypeOf(wall["_refreshLine"]()).toBeVoid();
expectTypeOf(wall["_refreshEndpoints"]()).toBeVoid();
expectTypeOf(wall["_refreshDirection"]()).toBeVoid();
expectTypeOf(wall["_refreshHighlight"]()).toBeVoid();
expectTypeOf(wall["_refreshState"]()).toBeVoid();

expectTypeOf(wall["_getWallColor"]()).toBeNumber();
expectTypeOf(wall["_playDoorSound"]("lock")).toBeVoid();
expectTypeOf(wall.soundRadius).toBeNumber();

declare const someUser: User.Implementation;
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;

expectTypeOf(wall["_canControl"](someUser, pointerEvent)).toBeBoolean();

expectTypeOf(wall["_onHoverIn"](pointerEvent)).toEqualTypeOf<false | void>();
expectTypeOf(wall["_onHoverIn"](pointerEvent, {})).toEqualTypeOf<false | void>();
expectTypeOf(wall["_onHoverIn"](pointerEvent, { hoverOutOthers: true })).toEqualTypeOf<false | void>();
expectTypeOf(wall["_onHoverIn"](pointerEvent, { hoverOutOthers: null })).toEqualTypeOf<false | void>();

expectTypeOf(wall["_overlapsSelection"](new PIXI.Rectangle())).toBeBoolean();

expectTypeOf(wall["_onHoverOut"](pointerEvent)).toBeVoid();
expectTypeOf(wall["_onClickLeft"](pointerEvent)).toBeBoolean();
expectTypeOf(wall["_onClickLeft2"](pointerEvent)).toBeVoid();
expectTypeOf(wall["_onClickRight2"](pointerEvent)).toBeVoid();
expectTypeOf(wall["_onDragLeftStart"](pointerEvent)).toBeVoid();
expectTypeOf(wall["_onDragLeftMove"](pointerEvent)).toBeVoid();

expectTypeOf(wall["_prepareDragLeftDropUpdates"](pointerEvent)).toEqualTypeOf<Wall.DragLeftDropUpdate[] | null>();

// deprecated since v12, until v14
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(wall.roof).toBeNull();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(wall.hasActiveRoof).toBeBoolean();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(wall.identifyInteriorState()).toBeVoid();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(wall.orientPoint({ x: 50, y: 79 })).toEqualTypeOf<CONST.WALL_DIRECTIONS>();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(wall.applyThreshold("light", wall.center)).toBeBoolean();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(wall.applyThreshold("light", wall.center, 200)).toBeBoolean();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(wall.applyThreshold("light", wall.center, null)).toBeBoolean();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(wall.vertices).toEqualTypeOf<foundry.canvas.geometry.edges.Edge>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(wall.A).toEqualTypeOf<PIXI.Point>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(wall.B).toEqualTypeOf<PIXI.Point>();
