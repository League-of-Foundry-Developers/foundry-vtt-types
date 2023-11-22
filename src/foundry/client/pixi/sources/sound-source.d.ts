export {};

declare global {
  /**
   * A specialized subclass of the PointSource abstraction which is used to control the rendering of sound sources.
   */
  class SoundSource extends PointSource {
    static override sourceType: "sound";

    protected override _getPolygonConfiguration(): PointSourcePolygonConfig & { useThreshold: true };

    /** @remarks Not implemented */
    protected _refresh(): void;

    /** @remarks Not implemented */
    protected _destroy(): void;
  }
}
