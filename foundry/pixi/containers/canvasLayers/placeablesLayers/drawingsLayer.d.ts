/**
 * The DrawingsLayer subclass of PlaceablesLayer
 *
 * This layer implements a container for drawings which are rendered immediately above the TilesLayer
 * and immediately below the GridLayer.
 */
declare class DrawingsLayer extends PlaceablesLayer<Drawing> {
  /**
   * @defaultValue `"defaultDrawingConfig"`
   */
  static DEFAULT_CONFIG_SETTING: string;

  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.layerOptions, {
   *   canDragCreate: true,
   *   canDelete: true,
   *   controllableObjects: true,
   *   rotatableObjects: true,
   *   objectClass: Drawing,
   *   sheetClass: DrawingConfig,
   *   zIndex: 20
   * })
   * ```
   */
  static get layerOptions(): PlaceablesLayer.LayerOptions;

  /**
   * Use an adaptive precision depending on the size of the grid
   * @remarks Returns `2 | 4 | 8 | 16`
   */
  get gridPrecision(): number;

  /** @override */
  get hud(): Canvas['hud']['drawing'];

  /**
   * Render a configuration sheet to configure the default Drawing settings
   */
  configureDefault(): void;

  /**
   * Override the deactivation behavior of this layer.
   * Placeables on this layer remain visible even when the layer is inactive.
   */
  deactivate(): void;

  /**
   * Get initial data for a new drawing.
   * Start with some global defaults, apply user default config, then apply mandatory overrides per tool.
   * @param origin - The initial coordinate
   * @returns The new drawing data
   */
  protected _getNewDrawingData(
    origin: Point
  ): typeof CONST['DRAWING_DEFAULT_VALUES'] &
    (
      | {
          type: typeof CONST['DRAWING_TYPES']['RECTANGLE'] | typeof CONST['DRAWING_TYPES']['ELLIPSE'];
        }
      | {
          type: typeof CONST['DRAWING_TYPES']['POLYGON'];
          points: PointArray[];
        }
      | {
          type: typeof CONST['DRAWING_TYPES']['FREEHAND'];
          points: PointArray[];
          bezierFactor: number;
        }
      | {
          type: typeof CONST['DRAWING_TYPES']['TEXT'];
          fillColor: string;
          fillAlpha: number;
          strokeColor: string;
          text: string;
        }
    ) & {
      author: string;
      fillColor: string;
      fillAlpha: number;
      fontFamily: typeof CONFIG['defaultFontFamily'];
      x: number;
      y: number;
    };

  /** @override */
  protected _onClickLeft(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onClickLeft2(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onClickRight(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftCancel(event: PointerEvent): void;

  /**
   * Handling of mouse-up events which conclude a new object creation after dragging
   */
  protected _onDragLeftDrop(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

  /** @override */
  protected _onDragLeftStart(event: PIXI.InteractionEvent): void;
}
