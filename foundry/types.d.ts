/**
 * A single point, expressed as an object \{x, y\}
 */
declare type Point = PIXI.Point | { x: number; y: number };

/**
 * A single point, expressed as an array \[x,y\]
 */
declare type PointArray = [x: number, y: number];

/**
 * A Ray intersection point
 */
declare type RayIntersection = {
  x: number;
  y: number;
  t0: number;
  t1: number;
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
