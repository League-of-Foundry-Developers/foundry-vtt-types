import type { Canvas } from "#client/canvas/_module.d.mts";
import type { ShapeControls } from "#client/canvas/containers/_module.d.mts";
import type { BaseShapeData } from "#common/data/_module.d.mts";

/**
 * Controls for a Region shape.
 */
declare class RegionShapeControls extends ShapeControls<
  RegionDocument.Implementation,
  foundry.canvas.placeables.Region.Implementation,
  foundry.canvas.layers.RegionLayer.Implementation,
  BaseShapeData
> {
  protected override _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected override _onClick2(event: Canvas.Event.Pointer): void;
}

export default RegionShapeControls;
