import type { Document } from "../../../../common/abstract/module.d.mts";

declare global {
  /**
   * A special subclass of PIXI.Container used to represent a Drawing in the PrimaryCanvasGroup.
   */
  class DrawingShape extends PrimaryCanvasObjectMixin(PIXI.Graphics) {
    /**
     * Sorting values to deal with ties.
     */
    static PRIMARY_SORT_ORDER: number;

    /**
     * @defaultValue
     * ```js
     * return foundry.utils.mergeObject(super.defaultData, {
     *      shape: {
     *          type: "",
     *          width: 0,
     *          height: 0,
     *          radius: null,
     *          points: []
     *      },
     *      bezierFactor: 0,
     *      fillType: 0,
     *      fillColor: 0x7C7C7C,
     *      fillAlpha: 0.5,
     *      strokeWidth: 8,
     *      strokeColor: 0xFFFFFF,
     *      strokeAlpha: 1,
     *      text: "New Text",
     *      fontFamily: "Signika",
     *      fontSize: 48,
     *      textColor: 0xFFFFFF,
     *      textAlpha: 1
     * })
     * ```
     */
    static override get defaultData(): DrawingShape.PrimaryCanvasObjectDrawingShapeData;

    override refresh(): void;

    override setPosition(): void;

    protected override _getCanvasDocumentData(data: Document.Any): unknown;

    /**
     * Draw rectangular shapes.
     */
    protected _drawRectangle(): void;

    /**
     * Draw ellipsoid shapes.
     */
    protected _drawEllipse(): void;

    /**
     * Draw polygonal shapes.
     */
    protected _drawPolygon(): void;

    /**
     * Draw freehand shapes with bezier spline smoothing.
     */
    protected _drawFreehand(): void;
  }

  namespace DrawingShape {
    interface PrimaryCanvasObjectDrawingShapeData extends PrimaryCanvasObjectData {
      /** The shape */
      shape: object;

      /** The x-coordinate of the PCO location */
      x: number;

      /** The y-coordinate of the PCO location */
      y: number;

      /** The z-index of the PCO */
      z: number;

      /** The bezier factor */
      bezierFactor: number;

      /** The fill type */
      fillType: number;

      /** The fill color */
      fillColor: number;

      /** The fill alpha */
      fillAlpha: number;

      /** The stroke width */
      strokeWidth: number;

      /** The stroke color */
      strokeColor: number;

      /** The stroke alpha */
      strokeAlpha: number;

      /** The text */
      text: string;

      /** The text font family */
      fontFamily: string;

      /** The font size */
      fontSize: number;

      /** The text color */
      textColor: number;

      /** The text alpha */
      textAlpha: number;

      /** The rotation of this PCO */
      rotation: number;

      /** The PCO is hidden? */
      hidden: boolean;

      /** The elevation of the PCO */
      elevation: number;

      /** The sort key that resolves ties among the same elevation */
      sort: number;

      /** The PCO is considered as a roof? */
      roof: boolean;

      /** The PCO is considered as overhead? */
      overhead: boolean;

      /** The occlusion object for this PCO */
      occlusion: object;

      /** The data texture values */
      texture: PIXI.RenderTexture;
    }
  }
}
