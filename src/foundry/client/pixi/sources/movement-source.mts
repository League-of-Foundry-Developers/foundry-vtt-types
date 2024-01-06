declare global {
  class MovementSource extends PointSource {
    static override sourceType: "move";

    /** @remarks A no-op */
    protected _refresh(): void;

    /** @remarks A no-op */
    protected _destroy(): void;
  }
}
