import type { Brand, Identity, InexactPartial, ToMethod } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PrimaryCanvasObjectMixin } from "#client/canvas/primary/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type Edge from "./edges/edge.d.mts";

/**
 * A Quadtree implementation that supports collision detection for rectangles.
 */
declare class Quadtree<out T> {
  /**
   * @param bounds  - The outer bounds of the region
   * @param options - Additional options which configure the Quadtree
   */
  constructor(bounds: Canvas.Rectangle, options?: Quadtree.Options<T>);

  /**
   * Bounding rectangle of the quadtree.
   */
  protected _bounds: PIXI.Rectangle;

  /**
   * The maximum number of objects allowed within this node before it must split
   * @defaultValue `20`
   */
  maxObjects: number;

  /**
   * The maximum number of levels that the base quadtree is allowed
   * @defaultValue `4`
   */
  maxDepth: number;

  /**
   * The depth of this node within the root Quadtree
   * @defaultValue `0`
   */
  depth: number;

  /**
   * The objects contained at this level of the tree
   * @defaultValue `[]`
   */
  objects: Quadtree.Object<T>[];

  /**
   * Children of this node
   * @defaultValue `[]`
   */
  nodes: Quadtree<T>[];

  /**
   * The root Quadtree
   */
  root: Quadtree<T>;

  /**
   * A constant that enumerates the index order of the quadtree nodes from top-left to bottom-right.
   */
  static INDICES: Quadtree.Indices;

  /**
   * The bounding rectangle of the region
   */
  get bounds(): PIXI.Rectangle;

  set bounds(newBounds);

  /**
   * The width of the bounding rectangle
   */
  get width(): number;

  set width(w);

  /**
   * The height of the bounding rectangle
   */
  get height(): number;

  set height(h);

  /**
   * The x-coordinate of the bounding rectangle
   */
  get x(): number;

  set x(x);

  /**
   * The y-coordinate of the bounding rectangle
   */
  get y(): number;

  set y(y);

  /**
   * Return an array of all the objects in the Quadtree (recursive)
   */
  get all(): Quadtree.Object<T>[];

  /**
   * Re-position the bounding rectangle of this Quadtree, clear existing data, and re-insert all objects.
   * Useful if the Quadtree needs to move.
   * @param x - The new x-coordinate of the bounding rectangle
   * @param y - The new y-coordinate of the bounding rectangle
   * @returns This Quadtree for method chaining
   */
  setPosition(x: number, y: number): this;

  /**
   * Re-dimension the bounding rectangle of this Quadtree, clear existing data, and re-insert all objects.
   * Useful if the underlying canvas or region is resized.
   * @param width  - The new width of the bounding rectangle
   * @param height - The new height of the bounding rectangle
   * @returns This Quadtree for method chaining
   */
  setDimensions(width: number, height: number): this;

  /**
   * Split this node into 4 sub-nodes.
   * @returns The split Quadtree
   */
  split(): this;

  /**
   * Clear the quadtree of all existing contents
   * @returns The cleared Quadtree
   */
  clear(): this;

  /**
   * Add a rectangle object to the tree
   * @param obj - The object being inserted
   * @returns The Quadtree nodes the object was added to.
   */
  insert(obj: Quadtree.Object<T>): Quadtree<T>[];

  /**
   * Remove an object from the quadtree
   * @param target - The quadtree target being removed
   * @returns The Quadtree for method chaining
   */
  remove(target: T): this;

  /**
   * Remove an existing object from the quadtree and re-insert it with a new position
   * @param obj - The object being inserted
   * @returns The Quadtree nodes the object was added to
   */
  update(obj: Quadtree.Object<T>): Quadtree<T>[];

  /**
   * Get all the objects which could collide with the provided rectangle
   * @param rect - The normalized target rectangle
   * @param options - Options affecting the collision test.
   * @returns The objects in the Quadtree which represent potential collisions
   */
  getObjects(rect: Canvas.Rectangle, options?: Quadtree.GetObjectsOptions<T>): Set<T>;

  /**
   * Obtain the leaf nodes to which a target rectangle belongs.
   * This traverses the quadtree recursively obtaining the final nodes which have no children.
   * @param rect - The target rectangle.x
   * @returns The Quadtree nodes to which the target rectangle belongs
   */
  getLeafNodes(rect: Canvas.Rectangle): Quadtree<T>[];

  /**
   * Obtain the child nodes within the current node which a rectangle belongs to.
   * Note that this function is not recursive, it only returns nodes at the current or child level.
   * @param rect - The target rectangle.
   * @returns The Quadtree nodes to which the target rectangle belongs
   */
  getChildNodes(rect: Canvas.Rectangle): Quadtree<T>[];

  /**
   * Identify all nodes which are adjacent to this one within the parent Quadtree.
   */
  getAdjacentNodes(): Quadtree<T>[];

  /**
   * Visualize the nodes and objects in the quadtree
   */
  visualize({ objects }?: Quadtree.VisualizeOptions): void;
}

declare namespace Quadtree {
  interface Any extends AnyQuadtree {}
  interface AnyConstructor extends Identity<typeof AnyQuadtree> {}

  /** @internal */
  type _OptionalSet<T> = InexactPartial<{
    /** @remarks Foundry never passes an object including `n`, which is handled by `obj.n = obj.n || new Set()` in `#insert()` */
    n?: Set<Quadtree<T>>;
  }>;

  /** @internal */
  interface _ObjectBase<T> {
    r: Canvas.Rectangle;
    t: T;
  }

  interface Object<T> extends _ObjectBase<T>, _OptionalSet<T> {}

  type INDICES = Brand<number, "Quadtree.INDICES">;

  interface Indices {
    tl: 0 & Quadtree.INDICES;
    tr: 1 & Quadtree.INDICES;
    bl: 2 & Quadtree.INDICES;
    br: 3 & Quadtree.INDICES;
  }

  /** @internal */
  type _Options<T> = InexactPartial<{
    /**
     * The maximum number of objects per node
     * @defaultValue `20`
     */
    maxObjects: number;

    /**
     * The maximum number of levels within the root Quadtree
     * @defaultValue `4`
     */
    maxDepth: number;

    /**
     * The depth level of the sub-tree. For internal use
     * @defaultValue `0`
     * @remarks Can't be `null` because of an `=== 0` check in `#visualize()`, and it only has a parameter default
     * @internal
     */
    _depth: number;

    /**
     * The root of the quadtree. For internal use
     * @internal
     */
    _root: Quadtree<T> | null;
  }>;

  /**
   * Additional options which configure the Quadtree
   */
  interface Options<T> extends _Options<T> {}

  type CollisionTestFunction<T> = ToMethod<(o: Quadtree.Object<T>, rect: PIXI.Rectangle) => boolean>;

  /** @internal */
  type _GetObjectsOptions<T> = InexactPartial<{
    /**
     * Function to further refine objects to return
     * after a potential collision is found. Parameters are the object and rect, and the
     * function should return true if the object should be added to the result set.
     */
    // Note(LukeAbby): Made a method to preserve covariance.
    collisionTest: CollisionTestFunction<T>;

    /**
     * The existing result set, for internal use.
     * @defaultValue `new Set<T>()`
     * @internal
     */
    _s: Set<T>;
  }>;

  interface GetObjectsOptions<T> extends _GetObjectsOptions<T> {}

  /** @internal */
  type _VisualizeOptions = InexactPartial<{
    /**
     * Visualize the rectangular bounds of objects in the Quadtree.
     * @defaultValue `false`
     */
    objects: boolean;
  }>;

  interface VisualizeOptions extends _VisualizeOptions {}
}

/**
 * A subclass of Quadtree specifically intended for classifying the location of objects on the game canvas.
 * @remarks Foundry never uses `Quadtree` directly, only this class, and only ever fills it with:
 * - {@linkcode foundry.canvas.groups.PrimaryCanvasGroup.quadtree | canvas.primary.quadtree}: {@linkcode foundry.canvas.primary.PrimaryCanvasObjectMixin.AnyMixed | PrimaryCanvasObject}s
 * - Various {@linkcode foundry.canvas.layers.PlaceablesLayer.quadtree | PlaceablesLayer} subclasses: Their associated {@linkcode foundry.canvas.placeables.PlaceableObject.Any | PlaceableObject}s
 * - {@linkcode foundry.canvas.geometry.edges.CanvasEdges | canvas.edges}: {@linkcode foundry.canvas.geometry.edges.Edge | Edge}s (this quadtree is true private on `CanvasEdges` so can't be linked to)
 */
declare class CanvasQuadtree<out T extends CanvasQuadtree.CanvasQuadtreeObject> extends Quadtree<T> {
  /**
   * Create a CanvasQuadtree which references `canvas.dimensions.rect`.
   * We pass an empty object to the parent, then override `_bounds`.
   * @param options - Additional options passed to the parent Quadtree.
   */
  constructor(options?: Quadtree.Options<T>);

  /**
   * @remarks This is `defineProperty`'d as an accessor in construction, explicitly `configurable: true, enumerable: true`.
   *
   * The getter returns {@linkcode Canvas.Dimensions.rect | canvas.dimensions.rect} if it exists or a new, all-zeroes, PIXI.Rectangle otherwise
   *
   * The setter is a no-op that drops a console warning: "`CanvasQuadtree` ignores direct assignment to `_bounds`; it always uses `canvas.dimensions.rect`."
   */
  protected _bounds: PIXI.Rectangle;
}

declare namespace CanvasQuadtree {
  interface Any extends AnyCanvasQuadtree {}
  interface AnyConstructor extends Identity<typeof AnyCanvasQuadtree> {}

  /** @remarks See {@linkcode CanvasQuadtree} class description */
  type CanvasQuadtreeObject = PrimaryCanvasObjectMixin.AnyMixed | PlaceableObject.Any | Edge;
}

export { Quadtree as default, CanvasQuadtree };

declare abstract class AnyQuadtree extends Quadtree<unknown> {
  constructor(...args: never);
}

declare abstract class AnyCanvasQuadtree extends CanvasQuadtree<CanvasQuadtree.CanvasQuadtreeObject> {
  constructor(...args: never);
}
