/**
 * A cached container group which renders the primary visible contents of a Scene.
 */
declare class PrimaryCanvasGroup extends CachedContainer {
  constructor();

  background: BackgroundLayer;

  drawings: DrawingsLayer;

  grid: GridLayer;

  templates: TemplateLayer;

  tokens: TokenLayer;

  foreground: ForegroundLayer;

  /** @defaultValue `true` */
  sortableChildren: boolean;

  /**
   * The name of this canvas group
   * @defaultValue `"primary"`
   */
  static groupName: string;

  /**
   * @defaultValue `[0, 0, 0, 0]`
   */
  override clearColor: [r: number, g: number, b: number, a: number];

  /**
   * Create the member layers of the scene container
   * @internal
   */
  protected _createLayers(): void;

  override render(renderer: Parameters<PIXI.Container["render"]>[0]): void;
}
