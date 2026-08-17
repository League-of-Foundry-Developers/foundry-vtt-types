import type { Identity, InexactPartial } from "#utils";
import type { PolygonTree } from "#client/data/polygon-tree.d.mts";
import type PointSourcePolygon from "./source-polygon.d.mts";

/**
 * This class computes the elevated surface exposure polygon tree.
 */
declare class ElevatedSurfaceExposureGenerator {
  /**
   * @param polygon - The source polygon the exposure is computed for
   * @param options - The surface exposure options
   */
  constructor(polygon: PointSourcePolygon.Any, options?: ElevatedSurfaceExposureGenerator.Options);

  /**
   * Compute the elevated surface exposure for the given source polygon using the
   * {@linkcode ElevatedSurfaceExposureGenerator}.
   * @param polygon - The source polygon the exposure is computed for
   * @param options - The surface exposure options
   * @returns The computed elevated surface exposure or null if empty
   */
  static compute(
    polygon: PointSourcePolygon.Any,
    options?: ElevatedSurfaceExposureGenerator.Options,
  ): PolygonTree | null;

  /**
   * The source polygon the exposure is computed for.
   */
  get polygon(): PointSourcePolygon.Any;

  /**
   * Points with at most this distance (grid units) from the surface are exposed.
   */
  get threshold(): number;

  /**
   * The result of the computation, which is null if the surface exposure is empty.
   * @throws If {@linkcode ElevatedSurfaceExposureGenerator.compute | ElevatedSurfaceExposureGenerator#compute}
   * wasn't called yet.
   */
  get result(): PolygonTree | null;

  /**
   * Compute the surface exposure.
   * @returns The computed elevated surface exposure or null if empty
   */
  compute(): PolygonTree | null;

  #ElevatedSurfaceExposureGenerator: true;
}

declare namespace ElevatedSurfaceExposureGenerator {
  interface Any extends AnyElevatedSurfaceExposureGenerator {}
  interface AnyConstructor extends Identity<typeof AnyElevatedSurfaceExposureGenerator> {}

  /** @internal */
  interface _Options {
    /**
     * Points with at most this distance (grid units) from the surface are exposed.
     * @defaultValue `0`
     */
    threshold: number;
  }

  /**
   * The surface exposure options
   */
  interface Options extends InexactPartial<_Options> {}
}

export default ElevatedSurfaceExposureGenerator;

declare abstract class AnyElevatedSurfaceExposureGenerator extends ElevatedSurfaceExposureGenerator {
  constructor(...args: never);
}
