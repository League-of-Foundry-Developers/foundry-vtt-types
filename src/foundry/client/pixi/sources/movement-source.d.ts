declare class MovementSource extends PointSource {
  /** @defaultValue `"move"` */
  static override sourceType: string | undefined;

  /** @remarks Not implemented */
  protected _refresh(): void;

  /** @remarks Not implemented */
  protected _destroy(): void;
}
