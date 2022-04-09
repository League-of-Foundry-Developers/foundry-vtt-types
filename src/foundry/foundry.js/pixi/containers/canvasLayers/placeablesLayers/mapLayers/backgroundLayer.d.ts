import {
  ConfiguredDocumentClassForName,
  ConfiguredObjectClassForName,
  DataSourceForPlaceable
} from '../../../../../../../types/helperTypes';

declare global {
  /**
   * An extension of the MapLayer that displays underfoot in the background of the Scene.
   */
  class BackgroundLayer extends MapLayer {
    /**
     * @remarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): Canvas['background'];

    /**
     * @remarks This is not overridden in foundry but reflects the real behavior.
     */
    static get layerOptions(): MapLayer.LayerOptions<'background'>;

    /**
     * The outline of the scene.
     * Not rendered within the BackgroundLayer, but rather beneath it so it does not impact the PrimaryMesh texture.
     */
    outline: PIXI.Graphics | undefined;

    /**
     * Draw a background outline which emphasizes what portion of the canvas is playable space and what is buffer.
     * @param outline - The outline graphics to use
     */
    drawOutline(outline: PIXI.Graphics): void;

    getDocuments(): Exclude<this['documentCollection'], null> | InstanceType<ConfiguredDocumentClassForName<'Tile'>>[];

    getZIndex(): number;

    storeHistory(
      type: PlaceablesLayer.HistoryEventType,
      data: DataSourceForPlaceable<InstanceType<ConfiguredObjectClassForName<'Tile'>>>
    ): void;
  }
}
