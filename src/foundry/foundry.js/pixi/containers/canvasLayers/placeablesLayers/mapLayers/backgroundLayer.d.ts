import {
  ConfiguredDocumentClassForName,
  ConfiguredObjectClassForName,
  DataTypeForPlaceable
} from '../../../../../../../types/helperTypes';

declare global {
  /**
   * An extension of the MapLayer that displays underfoot in the background of the Scene.
   */
  class BackgroundLayer extends MapLayer {
    /**
     * @remarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): BackgroundLayer;

    /**
     * @remarks This is not overridden in foundry but reflects the real behavior.
     */
    static get layerOptions(): MapLayer.LayerOptions<'background'>;

    /**
     * The outline of the scene
     */
    outline: PIXI.Graphics | undefined;

    draw(): Promise<this>;

    /**
     * Draw a background outline which emphasizes what portion of the canvas is playable space and what is buffer.
     */
    protected _drawOutline(): PIXI.Graphics | undefined;

    getDocuments(): Iterable<InstanceType<ConfiguredDocumentClassForName<'Tile'>>>;

    getZIndex(): number;

    storeHistory(
      type: PlaceablesLayer.HistoryEventType,
      data: DataTypeForPlaceable<InstanceType<ConfiguredObjectClassForName<'Tile'>>>
    ): void;
  }
}
