import { ConfiguredDocumentClassForName, ConfiguredObjectClassForName } from '../../../../../../../types/helperTypes';

declare global {
  /**
   * An extension of the MapLayer that displays overhead in the foreground of the Scene.
   */
  class ForegroundLayer extends MapLayer<MapLayer.LayerOptions<'foreground'>> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.layerOptions, {
     *   name: "foreground"
     * })
     * ```
     */
    static get layerOptions(): MapLayer.LayerOptions<'foreground'>;

    /**
     * @remarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): Canvas['foreground'];

    /**
     * Get an array of overhead Tile objects which are roofs
     */
    get roofs(): InstanceType<ConfiguredObjectClassForName<'Tile'>>[];

    /**
     * Determine whether to display roofs
     */
    get displayRoofs(): boolean;

    draw(): Promise<undefined>;

    /**
     * Draw the container used to cache the position of Token occlusion shapes to a RenderTexture
     */
    protected _drawOcclusionMask(): CachedContainer;

    /**
     * Perform one-time initialization actions which affect the foreground layer.
     * These actions presume and require that the layer has already been drawn.
     */
    initialize(): void;

    /** @override */
    activate(): this;

    deactivate(): this;

    tearDown(): Promise<this>;

    getZIndex(): number;

    getDocuments(): Exclude<this['documentCollection'], null> | InstanceType<ConfiguredDocumentClassForName<'Tile'>>[];

    /**
     * Refresh the display of tiles on the Foreground Layer depending on Token occlusion.
     */
    refresh(): void;

    /**
     * Add a roof sprite to the occlusion roof mask container
     * @param tile - The roof tile being added
     */
    addRoofSprite(tile: Tile): void;

    /**
     * Remove a roof sprite from occlusion roof mask container
     * @param tile - The roof tile being removed
     */
    removeRoofSprite(tile: Tile): void;

    /**
     * Update occlusion for all tiles on the foreground layer
     */
    updateOcclusion(): void;

    /**
     * Draw the container which caches token-based occlusion shapes
     * @param tokens - The set of currently observed tokens
     */
    protected _drawOcclusionShapes(tokens: ConfiguredObjectClassForName<'Token'>[]): void;

    protected _getDropData(
      event: DragEvent,
      data:
        | { type: 'Tile'; img: string; tileSize?: number; x: number; y: number }
        | ({ type: string } & Partial<Record<string, unknown>>)
    ): Promise<ConstructorParameters<typeof foundry.documents.BaseTile>[0]>;
  }
}
