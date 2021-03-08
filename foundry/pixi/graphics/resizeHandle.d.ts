declare class ResizeHandle extends PIXI.Graphics {
  constructor(offset: ResizeHandle['offset'], ...args: ConstructorParameters<typeof PIXI.Graphics>);

  offset: [widthOffset: number, heightOffset: number];

  refresh(bounds: Rectangle): void;

  updateDimensions(
    current: Rectangle,
    origin: Rectangle,
    destination: Rectangle,
    { aspectRatio }?: { aspectRatio?: number | null }
  ): Rectangle;
}
