import type { Edge, PolygonVertex } from "./edges/_module.d.mts";
import type { ClockwiseSweepPolygon, PointSourcePolygon, Ray, Quadtree } from "./_module.mjs";
/* eslint-disable @typescript-eslint/no-unused-vars */

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. It's also just nice to
// have as reference to keep us synced with the latest version of Foundry.

export {};

type ClipperPoint = PIXI.Polygon.ClipperPoint;

type EdgeType = Edge.EdgeTypes;

type EdgeOptions = Edge.EdgeOptions;

type PointSourcePolygonType = PointSourcePolygon.PolygonType;

type PointSourcePolygonConfig = PointSourcePolygon.Config;

// TODO: new in v13
// type ClockwiseSweepPolygonConfig =

type RayIntersection = Ray.Intersection;

type QuadtreeObject<T> = Quadtree.Object<T>;

type VertexMap = Map<number, PolygonVertex>;

type EdgeSet = Set<Edge>;

type PolygonRay = ClockwiseSweepPolygon.Ray;
