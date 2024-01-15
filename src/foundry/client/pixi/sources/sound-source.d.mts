export {};

declare global {
  /**
   * A specialized subclass of the PointSource abstraction which is used to control the rendering of sound sources.
   */
  class SoundSource extends PointSource {
    static override sourceType: "sound";

    protected override _getPolygonConfiguration(): PointSourcePolygonConfig & { useThreshold: true };

    /** @remarks A no-op */
    protected _refresh(): void;

    /** @remarks A no-op */
    protected _destroy(): void;
  }
}
