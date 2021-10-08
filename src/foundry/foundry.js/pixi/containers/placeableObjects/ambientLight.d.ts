import type { ConfiguredDocumentClassForName } from '../../../../../types/helperTypes';
import { DocumentModificationOptions } from '../../../../common/abstract/document.mjs';

declare global {
  /**
   * An AmbientLight is an implementation of PlaceableObject which represents a dynamic light source within the Scene.
   */
  class AmbientLight extends PlaceableObject<InstanceType<ConfiguredDocumentClassForName<'AmbientLight'>>> {
    constructor(document: InstanceType<ConfiguredDocumentClassForName<'AmbientLight'>>);

    /**
     * A reference to the PointSource object which defines this light source area of effect
     */
    source: PointSource;

    /**
     * A reference to the ControlIcon used to configure this light
     * @defaultValue `undefined`
     */
    controlIcon: ControlIcon | undefined;

    /** @override */
    static embeddedName: 'AmbientLight';

    /** @override */
    get bounds(): NormalizedRectangle;

    /**
     * Test whether a specific AmbientLight source provides global illumination
     */
    get global(): boolean;

    /**
     * The maximum radius in pixels of the light field
     */
    get radius(): number;

    /**
     * Get the pixel radius of dim light emitted by this light source
     */
    get dimRadius(): number;

    /**
     * Get the pixel radius of bright light emitted by this light source
     */
    get brightRadius(): number;

    /**
     * Return whether the light source is currently visible in the scene
     */
    get isVisible(): boolean;

    /** @override */
    draw(): Promise<this>;

    /**
     * Draw the ControlIcon for the AmbientLight
     * @internal
     */
    protected _drawControlIcon(): ControlIcon;

    /** @override */
    refresh(): this;

    /**
     * Refresh the display of the ControlIcon for this AmbientLight source
     */
    refreshControl(): void;

    /**
     * The named identified for the source object associated with this light
     */
    get sourceId(): string;

    /**
     * Update the source object associated with this light
     * @param defer   - Defer refreshing the LightingLayer to manually call that refresh later.
     *                  (default: `false`)
     * @param deleted - Indicate that this light source has been deleted.
     *                  (default: `false`)
     */
    updateSource({ defer, deleted }?: { defer?: boolean; deleted?: boolean }): null | void;

    /** @override */
    protected _onCreate(
      data: foundry.data.AmbientLightData['_source'],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /** @override */
    protected _onUpdate(
      changed: DeepPartial<foundry.data.AmbientLightData['_source']>,
      options?: DocumentModificationOptions,
      userId?: string
    ): void;

    /** @override */
    protected _onDelete(options: DocumentModificationOptions, userId: string): void;

    /** @override */
    protected _canHUD(user: InstanceType<ConfiguredDocumentClassForName<'User'>>, event?: any): boolean;

    /** @override */
    protected _canConfigure(user: InstanceType<ConfiguredDocumentClassForName<'User'>>, event?: any): boolean;

    /** @override */
    protected _onClickRight(event: PIXI.InteractionEvent): Promise<this>;

    /** @override */
    protected _onDragLeftStart(event: PIXI.InteractionEvent): void;

    /** @override */
    protected _onDragLeftMove(event: PIXI.InteractionEvent): void;

    /** @override */
    protected _onDragLeftCancel(event: MouseEvent): void;
  }
}
