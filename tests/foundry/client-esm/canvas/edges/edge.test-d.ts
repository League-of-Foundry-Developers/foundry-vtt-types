import { expectTypeOf } from "vitest";
import type { PIXI } from "../../../../../src/configuration/globals.d.mts";
import type { WallThresholdData } from "../../../../../src/foundry/common/documents/_types.d.mts";

declare const p: Canvas.Point;
const edge = new foundry.canvas.edges.Edge(p, p);

expectTypeOf(edge.a).toEqualTypeOf<PIXI.Point>();
expectTypeOf(edge.b).toEqualTypeOf<PIXI.Point>();
expectTypeOf(edge.id).toEqualTypeOf<string>();
expectTypeOf(edge.object).toEqualTypeOf<PlaceableObject>();
expectTypeOf(edge.type).toEqualTypeOf<foundry.canvas.edges.Edge.EdgeTypes>();
expectTypeOf(edge.direction).toEqualTypeOf<foundry.CONST.WALL_DIRECTIONS>();
expectTypeOf(edge.light).toEqualTypeOf<foundry.CONST.WALL_SENSE_TYPES>();
expectTypeOf(edge.move).toEqualTypeOf<foundry.CONST.WALL_SENSE_TYPES>();
expectTypeOf(edge.sight).toEqualTypeOf<foundry.CONST.WALL_SENSE_TYPES>();
expectTypeOf(edge.sound).toEqualTypeOf<foundry.CONST.WALL_SENSE_TYPES>();
expectTypeOf(edge.threshold).toEqualTypeOf<WallThresholdData>();
expectTypeOf(edge.nw).toEqualTypeOf<Canvas.Point>();
expectTypeOf(edge.se).toEqualTypeOf<Canvas.Point>();
expectTypeOf(edge.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(edge.intersections).toEqualTypeOf<
  { edge: foundry.canvas.edges.Edge; intersection: foundry.utils.LineIntersection }[]
>();
expectTypeOf(edge.vertexA).toEqualTypeOf<foundry.canvas.edges.PolygonVertex>();
expectTypeOf(edge.vertexB).toEqualTypeOf<foundry.canvas.edges.PolygonVertex>();
expectTypeOf(edge.isLimited("direction")).toEqualTypeOf<boolean>();
expectTypeOf(edge.clone()).toEqualTypeOf<foundry.canvas.edges.Edge>();

declare const edge2: foundry.canvas.edges.Edge;
expectTypeOf(edge.getIntersection(edge2)).toEqualTypeOf<foundry.utils.LineIntersection | void>();
expectTypeOf(edge.applyThreshold("", p)).toEqualTypeOf<boolean>();
expectTypeOf(edge.orientPoint(p)).toEqualTypeOf<foundry.CONST.WALL_DIRECTIONS>();
expectTypeOf(edge.recordIntersections(edge2)).toEqualTypeOf<void>();
expectTypeOf(edge.removeIntersections()).toEqualTypeOf<void>();

expectTypeOf(foundry.canvas.edges.Edge.identifyEdgeIntersections([edge2])).toEqualTypeOf<void>();
