import { expectTypeOf } from "vitest";

import Region = foundry.canvas.placeables.Region;
import ShapeObjectMixin from "#client/canvas/placeables/mixins/shapes.mjs";
import RegionGeometry = foundry.canvas.placeables.regions.RegionGeometry;
import RegionShape = foundry.data.regionShapes.RegionShape;
import PolygonTree = foundry.data.PolygonTree;
import type { DeepReadonly } from "fvtt-types/utils";

expectTypeOf(Region.implementation).toEqualTypeOf<Region.ImplementationClass>();
expectTypeOf(Region.embeddedName).toEqualTypeOf<"Region">();
expectTypeOf(Region.RENDER_FLAGS.redraw.propagate).toEqualTypeOf<
  Array<"refresh" | "refreshState" | "refreshVisibility" | "refreshBorder"> | undefined
>();

declare const doc: RegionDocument.Stored;
const region = new CONFIG.Region.objectClass(doc);

expectTypeOf(region.controlIcon).toBeNull();
expectTypeOf(region.geometry).toEqualTypeOf<RegionGeometry>();
expectTypeOf(region.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(region.center).toEqualTypeOf<PIXI.Point>();
expectTypeOf(region.isVisible).toBeBoolean();
expectTypeOf(region.isInteractable).toBeBoolean();
expectTypeOf(region.animationState).toEqualTypeOf<DeepReadonly<Region.AnimationState>>();
expectTypeOf(region.isAnimating).toBeBoolean();

// unconditionally throws
expectTypeOf(region.getSnappedPosition()).toBeNever();

expectTypeOf(region._pasteObject({ x: 50, y: 70 })).toEqualTypeOf<Region.PasteObjectData>();
expectTypeOf(
  region._pasteObject({ x: 50, y: 70 }, { hidden: true, snap: false, cut: true }),
).toEqualTypeOf<Region.PasteObjectData>();

// @ts-expect-error _draw always gets passed a value
expectTypeOf(region["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(region["_draw"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(region._redrawShapeControls()).toBeVoid();
expectTypeOf(region["_clear"]()).toBeVoid();
expectTypeOf(region["_destroy"](undefined)).toBeVoid();
expectTypeOf(region["_getMeasuredShapes"]()).toEqualTypeOf<foundry.data.BaseShapeData[]>();

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

expectTypeOf(region["_refreshVisibility"]()).toBeVoid();
expectTypeOf(region["_refreshState"]()).toBeVoid();
expectTypeOf(region["_refreshShapes"]()).toBeVoid();
expectTypeOf(region["_refreshGeometry"]()).toBeVoid();
expectTypeOf(region["_refreshBorder"]()).toBeVoid();
expectTypeOf(region["_getCoveredGridSpaceOffsets"]()).toEqualTypeOf<foundry.grid.BaseGrid.Offset2D[]>();
expectTypeOf(region._onTokenAnimationFrame()).toBeVoid();
expectTypeOf(region["_onAnimationStateChange"]()).toBeVoid();

declare const someUser: User.Implementation;
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
expectTypeOf(region["_canHUD"](someUser, pointerEvent)).toBeBoolean();

// @ts-expect-error _onControl is always passed a value
expectTypeOf(region["_onControl"]()).toBeVoid();
expectTypeOf(region["_onControl"]({})).toBeVoid();
expectTypeOf(region["_onControl"]({ releaseOthers: false })).toBeVoid();

// @ts-expect-error _onRelease always gets passed a value
expectTypeOf(region["_onRelease"]()).toBeVoid();
expectTypeOf(region["_onRelease"]({})).toBeVoid();

expectTypeOf(region["_onHoverIn"](pointerEvent)).toEqualTypeOf<boolean | void>();
expectTypeOf(region["_onHoverIn"](pointerEvent, {})).toEqualTypeOf<boolean | void>();
expectTypeOf(region["_onHoverIn"](pointerEvent, { hoverOutOthers: true, updateLegend: false })).toEqualTypeOf<
  boolean | void
>();
expectTypeOf(region["_onHoverIn"](pointerEvent, { hoverOutOthers: undefined, updateLegend: undefined })).toEqualTypeOf<
  boolean | void
>();

expectTypeOf(region["_onHoverOut"](pointerEvent)).toBeVoid();
expectTypeOf(region["_onHoverOut"](pointerEvent, {})).toBeVoid();
expectTypeOf(region["_onHoverOut"](pointerEvent, { updateLegend: false })).toBeVoid();
expectTypeOf(region["_onHoverOut"](pointerEvent, { updateLegend: undefined })).toBeVoid();

expectTypeOf(region["_overlapsSelection"](new PIXI.Rectangle())).toBeBoolean();
expectTypeOf(region["_updateDragPreviews"](pointerEvent)).toBeVoid();

// TODO:  _onUpdate test after document test helpers are done
expectTypeOf(region["_prepareDragLeftDropUpdates"](pointerEvent)).toEqualTypeOf<
  ShapeObjectMixin.DragLeftDropUpdate[]
>();

// deprecated since v13, until v15

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(Region.CLIPPER_SCALING_FACTOR).toEqualTypeOf<number>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(Region.MOVEMENT_SEGMENT_TYPES).toEqualTypeOf<typeof CONST.REGION_MOVEMENT_SEGMENTS>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(Region.MOVEMENT_SEGMENT_TYPES.ENTER).toExtend<CONST.REGION_MOVEMENT_SEGMENTS>();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.shapes).toEqualTypeOf<RegionShape.Any[]>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.bottom).toBeNumber();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.top).toBeNumber();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.polygons).toEqualTypeOf<PIXI.Polygon[]>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.polygonTree).toEqualTypeOf<PolygonTree>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.clipperPaths).toEqualTypeOf<ClipperLib.Paths>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.triangulation).toEqualTypeOf<Region.TriangulationData>();

const waypoints = [
  { x: 50, y: 50, elevation: 0 },
  { x: 70, y: 90, elevation: 60 },
];
const samples = [
  { x: 52, y: 62 },
  { x: 500, y: 7000 },
];
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.segmentizeMovement(waypoints, samples)).toEqualTypeOf<RegionDocument.MovementSegment[]>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.segmentizeMovement(waypoints, samples, {})).toEqualTypeOf<RegionDocument.MovementSegment[]>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.segmentizeMovement(waypoints, samples, { teleport: true })).toEqualTypeOf<
  RegionDocument.MovementSegment[]
>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.segmentizeMovement(waypoints, samples, { teleport: undefined })).toEqualTypeOf<
  RegionDocument.MovementSegment[]
>();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.testPoint({ x: 50, y: 50 })).toBeBoolean();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.testPoint({ x: 50, y: 50 }, 20)).toBeBoolean();
