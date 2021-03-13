/**
 * Tile Config Sheet
 */
declare class TileConfig extends FormApplication<TileConfig.Data, Tile> {
  /**
   * @param tile    - The Tile object being configured
   * @param options - Additional application rendering options
   */
  constructor(tile: Tile, options?: Partial<TileConfig.Options>);

  options: TileConfig.Options;

  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   id: "tile-config",
   *   classes: ["sheet", "tile-sheet"],
   *   title: "Tile Configuration",
   *   template: "templates/scene/tile-config.html",
   *   width: 400,
   *   submitOnChange: true
   * });
   * ```
   */
  static get defaultOptions(): TileConfig.Options;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): TileConfig.Data;

  /** @override */
  protected _onChangeInput(event: Event): void;

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject(event: Event, formData: TileConfig.FormData): Promise<Tile>;

  /** @override */
  close(options: Application.CloseOptions): Promise<void>;
}

declare namespace TileConfig {
  interface Data {
    object: Duplicated<TileConfig['object']['data']>;
    options: TileConfig['options'];
    submitText: 'Create' | 'Update';
  }

  interface FormData {
    height: Tile.Data['height'] | null;
    img: Tile.Data['img'];
    rotation: Tile.Data['rotation'] | null;
    width: Tile.Data['width'] | null;
    x: Tile.Data['x'] | null;
    y: Tile.Data['y'] | null;
  }

  interface Options extends FormApplication.Options {
    /**
     * Configure a preview version of a tile which is not yet saved
     */
    preview?: boolean;
  }
}
