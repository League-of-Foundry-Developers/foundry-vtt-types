export {};

declare global {
  namespace TileLayer {
    export interface LayerOptions extends PlaceablesLayer.LayerOptions<'Tile'> {
      name: 'tiles';
      zIndex: 0;
      controllableObjects: true;
      rotatableObjects: true;
    }
  }

  /**
   * A PlaceablesLayer designed for rendering the visual Scene for a specific vertical cross-section.
   * Each TileLayer contains a single background image as well as an arbitrary number of Tile objects.
   */
  class TileLayer extends PlaceablesLayer<'Tile', TileLayer.LayerOptions> {
    /** {@inheritdoc} */
    static override documentName: 'Tile';

    /* -------------------------------------------- */
    /*  Layer Attributes                            */
    /* -------------------------------------------- */

    /** {@inheritdoc} */
    static override get layerOptions(): TileLayer.LayerOptions;

    /* -------------------------------------------- */

    /** {@inheritdoc} */
    get hud(): OptionalChaining<Canvas['hud'], 'tile'>;

    /* -------------------------------------------- */

    /**
     * An array of Tile objects which are rendered within the objects container
     */
    get tiles(): Tile[];

    /* -------------------------------------------- */

    /**
     * Get an array of overhead Tile objects which are roofs
     */
    get roofs(): Tile[];

    /* -------------------------------------------- */

    /**
     * Determine whether to display roofs
     */
    get displayRoofs(): boolean;

    /* -------------------------------------------- */

    /**
     * A convenience reference to the tile occlusion mask on the primary canvas group.
     */
    get occlusionMask(): CachedContainer;

    /* -------------------------------------------- */
    /*  Layer Methods                               */
    /* -------------------------------------------- */

    /** {@inheritdoc} */
    activate(): this;

    /* -------------------------------------------- */

    /** {@inheritdoc} */
    deactivate(): this;

    /* -------------------------------------------- */

    /** {@inheritdoc} */
    tearDown(): Promise<this>;

    /* -------------------------------------------- */
    /*  Event Handlers                              */
    /* -------------------------------------------- */

    /** {@inheritdoc} */
    protected _onDragLeftStart(event: PIXI.InteractionEvent): Promise<void>;

    /* -------------------------------------------- */

    /** {@inheritdoc} */
    protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

    /* -------------------------------------------- */

    /** {@inheritdoc} */
    protected _onDragLeftDrop(event: PIXI.InteractionEvent): void;

    /* -------------------------------------------- */

    /** {@inheritdoc} */
    protected _onDragLeftCancel(event: PointerEvent): void;

    /* -------------------------------------------- */

    /**
     * Handle drop events for Tile data on the Tiles Layer
     * @param event - The concluding drag event
     * @param data  - The extracted Tile data
     */
    protected _onDropData(
      event: DragEvent,
      data:
        | { type: 'Tile'; img: string; tileSize?: number; x: number; y: number }
        | ({ type: string } & Partial<Record<string, unknown>>)
    ): Promise<InstanceType<ConfiguredTile> | undefined>;

    /* -------------------------------------------- */

    /**
     * Prepare the data object when a new Tile is dropped onto the canvas
     * @param event - The concluding drag event
     * @param data  - The extracted Tile data
     * @returns The prepared data to create
     */
    protected _getDropData(
      event: DragEvent,
      data: MapLayer.DropData
    ): Promise<ConstructorParameters<typeof foundry.documents.BaseTile>[0]>;
  }
}
