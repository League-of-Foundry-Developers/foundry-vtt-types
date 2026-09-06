import type { Canvas } from "#client/canvas/_module.d.mts";
import type { AnyMutableObject } from "#utils";
import type { ShapeControls } from "#client/canvas/containers/_module.d.mts";
import type { CircleShapeData } from "#common/data/_module.d.mts";

/**
 * Controls for a AmbientSound shape.
 */
declare class AmbientSoundShapeControls extends ShapeControls<
  AmbientSoundDocument.Implementation,
  foundry.canvas.placeables.AmbientSound.Implementation,
  foundry.canvas.layers.SoundsLayer.Implementation,
  CircleShapeData
> {
  protected override _onDragStart(event: Canvas.Event.Pointer): void;

  protected override _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected override _prepareDragDropUpdate(event: Canvas.Event.Pointer): AmbientSoundShapeControls.DragDropUpdate;

  protected override _onDragDrop(event: Canvas.Event.Pointer): void;
}

declare namespace AmbientSoundShapeControls {
  interface DragDropUpdate extends AnyMutableObject {
    x: number;
    y: number;
    radius: number;
  }
}

export default AmbientSoundShapeControls;
