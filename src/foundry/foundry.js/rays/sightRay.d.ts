/**
 * A subclass of Ray that is used specifically for computing source polygons
 *
 * This was used for the RadialSweepPolygon but can now be deleted once that is
 * @deprecated since v9d2
 */
declare class SightRay extends Ray {
  /**
   * The array of sorted collision points which apply for this Ray.
   */
  collisions: WallEndpoint[];

  /**
   * The target endpoint at which this Ray was fired
   */
  endpoint: WallEndpoint | null;

  /**
   * The result objects which records the outcome of this Ray
   */
  result: {
    collisions: unknown[];
    continuation: unknown | undefined;
    limitation: number;
    superfluous: boolean;
    stopped: boolean;
    activeWalls: unknown | undefined;
  };

  /**
   * The final collision point that this SightRay encountered.
   */
  get lastCollision(): WallEndpoint | null;
}
