export {};

declare global {
  class MovementSource extends PointSource {
    static override sourceType: "move";

    /** @remarks Not implemented */
    protected _refresh(): void;

    /** @remarks Not implemented */
    protected _destroy(): void;
  }
}
