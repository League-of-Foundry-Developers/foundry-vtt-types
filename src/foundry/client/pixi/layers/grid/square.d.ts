export {};

declare global {
  /**
   * Construct a square grid container
   */
  class SquareGrid extends BaseGrid {
    override draw(options?: BaseGrid.DrawOptions | undefined): this;

    override getCenter(x: number, y: number): PointArray;

    override getGridPositionFromPixels(x: number, y: number): PointArray;

    override getPixelsFromGridPosition(row: number, col: number): PointArray;

    /**
     * @param interval - (default: `1`)
     */
    override getSnappedPosition(
      x: number,
      y: number,
      interval?: number | null,
      options?: Record<string, unknown>,
    ): { x: number; y: number };

    override shiftPosition(x: number, y: number, dx: number, dy: number, options: Record<string, unknown>): PointArray;

    /** @internal */
    protected _getNearestVertex(x: number, y: number): PointArray;

    /**
     * @param options - (default: `{}`)
     */
    override highlightGridPosition(layer: GridHighlight, options?: BaseGrid.HighlightGridPositionOptions): void;

    /**
     * @param options - (default: `{}`)
     */
    override measureDistances(segments: GridLayer.Segment[], options?: MeasureDistancesOptions): number[];

    override getNeighbors(row: number, col: number): PointArray[];
  }
}
