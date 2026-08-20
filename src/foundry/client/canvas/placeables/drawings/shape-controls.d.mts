import type { Canvas } from "#client/canvas/_module.d.mts";
import type { AnyMutableObject } from "#utils";
import type { ShapeControls } from "#client/canvas/containers/_module.d.mts";
import type { EllipseShapeData, PolygonShapeData, RectangleShapeData } from "#common/data/_module.d.mts";

/**
 * Controls for a Drawing shape.
 */
declare class DrawingShapeControls extends ShapeControls<
  DrawingDocument.Implementation,
  foundry.canvas.placeables.Drawing.Implementation,
  foundry.canvas.layers.DrawingsLayer.Implementation,
  RectangleShapeData | EllipseShapeData | PolygonShapeData
> {
  protected override _drawShape(graphics: PIXI.Graphics): void;

  protected override _onDragStart(event: Canvas.Event.Pointer): void;

  protected override _onDragMove(event: Canvas.Event.Pointer): void;

  protected override _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected override _prepareDragDropUpdate(event: Canvas.Event.Pointer): DrawingShapeControls.DragDropUpdate;

  protected override _onDragDrop(event: Canvas.Event.Pointer): void;

  protected override _onClick2(event: Canvas.Event.Pointer): void;
}

declare namespace DrawingShapeControls {
  interface ShapeUpdate {
    width?: number | undefined;
    height?: number | undefined;
    points?: number[] | undefined;
  }

  interface DragDropUpdate extends AnyMutableObject {
    x: number;
    y: number;
    shape: ShapeUpdate;
    rotation: number;
  }
}

export default DrawingShapeControls;
