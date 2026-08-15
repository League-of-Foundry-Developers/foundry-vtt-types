import { expectTypeOf } from "vitest";

import Canvas = foundry.canvas.Canvas;

declare const region: RegionDocument.Stored;
declare const waypoints: RegionDocument.SegmentizeMovementPathWaypoint[];
declare const samples: Canvas.Point[];

expectTypeOf(region.segmentizeMovementPath(waypoints, samples)).toEqualTypeOf<RegionDocument.MovementSegment[]>();
expectTypeOf(region.segmentizeMovementPath(waypoints, samples, 0.75)).toEqualTypeOf<RegionDocument.MovementSegment[]>();
expectTypeOf(region.segmentizeMovementPath(waypoints, samples, undefined)).toEqualTypeOf<
  RegionDocument.MovementSegment[]
>();
