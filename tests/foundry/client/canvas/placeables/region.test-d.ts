import { expectTypeOf } from "vitest";
import { Region, PlaceableObject } from "#client/canvas/placeables/_module.mjs";
import type { RegionGeometry } from "#client/canvas/placeables/regions/_module.d.mts";
import type { RegionShape, RegionPolygonTree } from "#client/data/region-shapes/_module.d.mts";

expectTypeOf(Region.embeddedName).toEqualTypeOf<"Region">();
expectTypeOf(Region.RENDER_FLAGS.redraw.propagate).toEqualTypeOf<
  Array<"refresh" | "refreshState" | "refreshBorder"> | undefined
>();
expectTypeOf(Region.CLIPPER_SCALING_FACTOR).toEqualTypeOf<100>();
expectTypeOf(Region.MOVEMENT_SEGMENT_TYPES).toEqualTypeOf<Region.MovementSegmentTypes>();
expectTypeOf(Region.MOVEMENT_SEGMENT_TYPES.ENTER).toExtend<Region.MOVEMENT_SEGMENT_TYPES>();

declare const doc: RegionDocument.Stored;
const region = new CONFIG.Region.objectClass(doc);

expectTypeOf(region.controlIcon).toBeNull();
expectTypeOf(region.shapes).toEqualTypeOf<RegionShape.Any[]>();
expectTypeOf(region.bottom).toBeNumber();
expectTypeOf(region.top).toBeNumber();
expectTypeOf(region.polygons).toEqualTypeOf<PIXI.Polygon[]>();
expectTypeOf(region.polygonTree).toEqualTypeOf<RegionPolygonTree>();
expectTypeOf(region.clipperPaths).toEqualTypeOf<ClipperLib.Paths>();
expectTypeOf(region.triangulation).toEqualTypeOf<Region.TriangulationData>();
expectTypeOf(region.geometry).toEqualTypeOf<RegionGeometry>();
expectTypeOf(region.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(region.center).toEqualTypeOf<PIXI.Point>();
expectTypeOf(region.isVisible).toBeBoolean();

// unconditionally throws
expectTypeOf(region.getSnappedPosition()).toBeNever();

// @ts-expect-error _draw always gets passed a value
expectTypeOf(region["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(region["_draw"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(region.clear()).toEqualTypeOf<Region.Implementation>();

// @ts-expect-error an object must be passed
expectTypeOf(region["_applyRenderFlags"]()).toBeVoid();
expectTypeOf(region["_applyRenderFlags"]({})).toBeVoid();
// all falsey values have no effect
expectTypeOf(region["_applyRenderFlags"]({ refreshBorder: false, refreshState: undefined })).toBeVoid();
expectTypeOf(
  region["_applyRenderFlags"]({
    redraw: true,
    refresh: true,
    refreshState: true,
    refreshBorder: true,
  }),
).toBeVoid();

declare const someUser: User.Implementation;
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
expectTypeOf(region["_canDrag"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(region["_canHUD"](someUser, pointerEvent)).toBeBoolean();

// @ts-expect-error _onControl is always passed a value
expectTypeOf(region["_onControl"]()).toBeVoid();
expectTypeOf(region["_onControl"]({})).toBeVoid();
expectTypeOf(region["_onControl"]({ releaseOthers: false })).toBeVoid();

// @ts-expect-error _onRelease always gets passed a value
expectTypeOf(region["_onRelease"]()).toBeVoid();
expectTypeOf(region["_onRelease"]({})).toBeVoid();

expectTypeOf(region["_onHoverIn"](pointerEvent)).toBeVoid();
expectTypeOf(region["_onHoverIn"](pointerEvent, {})).toBeVoid();
expectTypeOf(region["_onHoverIn"](pointerEvent, { hoverOutOthers: true, updateLegend: false })).toBeVoid();
expectTypeOf(region["_onHoverIn"](pointerEvent, { hoverOutOthers: null, updateLegend: null })).toBeVoid();

expectTypeOf(region["_onHoverOut"](pointerEvent)).toBeVoid();
expectTypeOf(region["_onHoverOut"](pointerEvent, {})).toBeVoid();
expectTypeOf(region["_onHoverOut"](pointerEvent, { updateLegend: false })).toBeVoid();
expectTypeOf(region["_onHoverOut"](pointerEvent, { updateLegend: null })).toBeVoid();

expectTypeOf(region["_overlapsSelection"](new PIXI.Rectangle())).toBeBoolean();

expectTypeOf(region.testPoint({ x: 50, y: 50 })).toBeBoolean();
expectTypeOf(region.testPoint({ x: 50, y: 50 }, 20)).toBeBoolean();

const waypoints = [
  { x: 50, y: 50, elevation: 0 },
  { x: 70, y: 90, elevation: 60 },
];
const samples = [
  { x: 52, y: 62 },
  { x: 500, y: 7000 },
];
expectTypeOf(region.segmentizeMovement(waypoints, samples)).toEqualTypeOf<Region.MovementSegment[]>();
expectTypeOf(region.segmentizeMovement(waypoints, samples, {})).toEqualTypeOf<Region.MovementSegment[]>();
expectTypeOf(region.segmentizeMovement(waypoints, samples, { teleport: true })).toEqualTypeOf<
  Region.MovementSegment[]
>();
expectTypeOf(region.segmentizeMovement(waypoints, samples, { teleport: null })).toEqualTypeOf<
  Region.MovementSegment[]
>();

expectTypeOf(region["_prepareDragLeftDropUpdates"](pointerEvent)).toEqualTypeOf<PlaceableObject.DragLeftDropUpdate[]>();
