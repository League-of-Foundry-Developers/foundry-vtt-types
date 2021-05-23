/**
 * Tile Config Sheet
 * @typeParam P - the type of the options object
 */
declare class TileConfig<P extends TileConfig.Options = TileConfig.Options> extends FormApplication<
  P,
  TileConfig.Data,
  Tile
> {
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
   * @param tile    - The Tile object being configured
   * @param options - Additional application rendering options
   */
  constructor(tile: Tile, options?: Partial<P>);

  /** @override */
  close(options: Application.CloseOptions): Promise<void>;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): TileConfig.Data;

  /** @override */
  protected _onChangeInput(event: JQuery.ChangeEvent): void;

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject(event: Event, formData: TileConfig.FormData): Promise<Tile>;
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
