/* ----------------------------------------- */
/*  Reusable Type Definitions                */
/* ----------------------------------------- */

/**
 * A single point, expressed as an object \{x, y\}
 */
declare type Point = PIXI.Point | { x: number; y: number };

/**
 * An extension of the default PIXI.Text object which forces double resolution.
 * At default resolution Text often looks blurry or fuzzy.
 */
declare class PreciseText extends PIXI.Text {}

/**
 * A single point, expressed as an array \[x,y\]
 */
declare type PointArray = [number, number];

/**
 * A Ray intersection point
 */
declare type RayIntersection = {
  x: number;
  y: number;
  t0: number;
  t1: number;
  wall?: Wall;
} | null;

/**
 * A standard rectangle interface.
 */
declare type Rectangle =
  | PIXI.Rectangle
  | {
      x: number;
      y: number;
      width: number;
      height: number;
    };

/* ----------------------------------------- */
/*  Database Workflows                       */
/* ----------------------------------------- */

/**
 * The expected structure for a Data record
 */
declare interface Data {
  [key: string]: any;
  _id: string;
}

/**
 * An object of optional keys and values which configure the behavior of a function
 */
declare interface Options {
  [key: string]: any;
}
