import type { Canvas } from "#client/canvas/_module.d.mts";
import type { AnyMutableObject } from "#utils";
import type { ShapeControls } from "#client/canvas/containers/_module.d.mts";
import type { RectangleShapeData } from "#common/data/_module.d.mts";

/**
 * Controls for a Tile shape.
 */
declare class TileShapeControls extends ShapeControls<
  TileDocument.Implementation,
  foundry.canvas.placeables.Tile.Implementation,
  foundry.canvas.layers.TilesLayer.Implementation,
  RectangleShapeData
> {
  protected override _onDragStart(event: Canvas.Event.Pointer): void;

  protected override _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected override _prepareDragDropUpdate(event: Canvas.Event.Pointer): TileShapeControls.DragDropUpdate;

  protected override _onDragDrop(event: Canvas.Event.Pointer): void;

  protected override _onClick2(event: Canvas.Event.Pointer): void;
}

declare namespace TileShapeControls {
  interface DragDropUpdate extends AnyMutableObject {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  }
}

export default TileShapeControls;
