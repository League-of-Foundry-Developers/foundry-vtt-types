/**
 * A CanvasLayer responsible for drawing a square grid
 */
declare class GridLayer extends CanvasLayer{
    /**
     * The Grid container
     * @type {PIXI.Container} (default: ``null``)
     */
    grid: PIXI.Container

    /**
     * The Grid Highlight container
     * @type {PIXI.Container} (default = ``null``)
     */
    highlight: PIXI.Container

    /**
     * Map named highlight layers
     * @type {{GridHighlight}}
     */
    highlightLayers: GridHighlight

    /* -------------------------------------------- */

  /** @override */
  //TODO: figure out how layerOptions works

    constructor ()
}