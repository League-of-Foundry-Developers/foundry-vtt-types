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

type RequestData = object | object[] | string | string[];

interface SocketRequest {
  /**
   * The server-side action being requested
   */
  action?: string;

  /**
   * Data applied to the operation
   */
  data?: RequestData;

  /**
   * Additional options applied to the request
   */
  options?: object;

  /**
   * A Compendium pack name
   */
  pack?: string;

  /**
   * The ID of a parent document
   */
  parentId?: string;

  /**
   * The type of parent document
   */
  parentType?: string;

  /**
   * The type of object being modified
   */
  type?: string;
}

interface SocketResponse {
  /**
   * Data returned as a result of the request
   */
  data?: RequestData;

  /**
   * An error, if one occurred
   */
  error?: Error;

  /**
   * The initial request
   */
  request: SocketRequest;

  /**
   * The status of the request
   */
  status?: string;

  /**
   * The ID of the requesting User
   */
  userId?: string;
}
