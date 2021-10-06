import { ConfiguredDocumentClass } from '../../../../../types/helperTypes';
import type { ConfiguredDocumentClassForName } from '../../../../../types/helperTypes';
import { DocumentModificationOptions } from '../../../../common/abstract/document.mjs';

declare global {
  /**
   * An AmbientSound is an implementation of PlaceableObject which represents a dynamic audio source within the Scene.
   */
  class AmbientSound extends PlaceableObject<InstanceType<ConfiguredDocumentClassForName<'AmbientSound'>>> {
    constructor(document: InstanceType<ConfiguredDocumentClassForName<'AmbientSound'>>);

    /**
     * The Sound which manages playback for this AmbientSound effect
     */
    sound: Sound | null;

    /** @override */
    static embeddedName: 'AmbientSound';

    /**
     * Create a Sound used to play this AmbientSound object
     * @internal
     */
    _createSound(): Sound | null;

    /**
     * Is this ambient sound is currently audible based on its hidden state and the darkness level of the Scene?
     */
    get isAudible(): boolean;

    /**
     * A convenience accessor for the sound type
     */
    get type(): 'l' | 'g';

    /**
     * A convenience accessor for the sound radius in pixels
     */
    get radius(): number;

    /**
     * Toggle playback of the sound depending on whether or not it is audible
     * @param isAudible - Is the sound audible?
     * @param volume    - The target playback volume
     * @param options   - Additional options which affect sound synchronization
     */
    sync(isAudible: boolean, volume: number, options?: Partial<AmbientSound.SyncOptions>): void;

    /** @override */
    clear(): this;

    /** @override */
    draw(): Promise<this>;

    /**
     * Draw the graphical preview of the audio source area of effect
     * @internal
     */
    drawField(): PIXI.Container;

    /**
     * Draw the ControlIcon for the AmbientLight
     * @internal
     */
    protected _drawControlIcon(): ControlIcon;

    /** @override */
    refresh(): this;

    /**
     * Refresh the display of the ControlIcon for this AmbientSound source
     */
    refreshControl(): void;

    /**
     * Compute the field-of-vision for an object, determining its effective line-of-sight and field-of-vision polygons
     * @returns An object containing the rays, LOS polygon, and FOV polygon for the light
     */
    updateSource(): { rays: null; los: null; fov: PIXI.Circle } | ReturnType<WallsLayer['computePolygon']>;

    /** @override */
    protected _onCreate(
      data: foundry.data.AmbientSoundData['_source'],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /** @override */
    protected _onUpdate(
      changed: DeepPartial<foundry.data.AmbientSoundData['_source']>,
      options?: DocumentModificationOptions,
      userId?: string
    ): void;

    /** @override */
    protected _onDelete(...args: Parameters<PlaceableObject['_onDelete']>): void;

    /** @override */
    protected _canHUD(user: InstanceType<ConfiguredDocumentClassForName<'User'>>, event?: any): boolean;

    /** @override */
    protected _canConfigure(user: InstanceType<ConfiguredDocumentClassForName<'User'>>, event?: any): boolean;

    /** @override */
    protected _onClickRight(event: PIXI.InteractionEvent): void;

    /** @override */
    protected _onDragLeftMove(event: PIXI.InteractionEvent): void;
  }

  namespace AmbientSound {
    interface SyncOptions {
      /**
       * A duration in milliseconds to fade volume transition
       * @defaultValue `250`
       */
      fade: number;
    }
  }
}
