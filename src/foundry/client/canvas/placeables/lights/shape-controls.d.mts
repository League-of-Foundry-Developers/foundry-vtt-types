import type { Canvas } from "#client/canvas/_module.d.mts";
import type { AnyMutableObject } from "#utils";
import type { ShapeControls } from "#client/canvas/containers/_module.d.mts";
import type { CircleShapeData, ConeShapeData } from "#common/data/_module.d.mts";

/**
 * Controls for a AmbientLight shape.
 */
declare class AmbientLightShapeControls extends ShapeControls<
  AmbientLightDocument.Implementation,
  foundry.canvas.placeables.AmbientLight.Implementation,
  foundry.canvas.layers.LightingLayer.Implementation,
  CircleShapeData | ConeShapeData
> {
  protected override _onDragStart(event: Canvas.Event.Pointer): void;

  protected override _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected override _prepareDragDropUpdate(event: Canvas.Event.Pointer): AmbientLightShapeControls.DragDropUpdate;

  protected override _onDragDrop(event: Canvas.Event.Pointer): void;
}

declare namespace AmbientLightShapeControls {
  interface ConfigUpdate {
    dim: number;
    bright: number;
    angle: number;
  }

  interface DragDropUpdate extends AnyMutableObject {
    x: number;
    y: number;
    rotation: number;
    config: ConfigUpdate;
  }
}

export default AmbientLightShapeControls;
