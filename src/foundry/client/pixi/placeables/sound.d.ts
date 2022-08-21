import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes";
import type { DocumentModificationOptions } from "../../../common/abstract/document.mjs";

declare global {
  /**
   * An AmbientSound is an implementation of PlaceableObject which represents a dynamic audio source within the Scene.
   */
  class AmbientSound extends PlaceableObject<InstanceType<ConfiguredDocumentClassForName<"AmbientSound">>> {
    constructor(document: InstanceType<ConfiguredDocumentClassForName<"AmbientSound">>);

    /**
     * The Sound which manages playback for this AmbientSound effect
     */
    sound: Sound | null;

    /**
     * A SoundSource object which manages the area of effect for this ambient sound
     */
    source: SoundSource;

    static override embeddedName: "AmbientSound";

    /**
     * Create a Sound used to play this AmbientSound object
     * @internal
     */
    protected _createSound(): Sound | null;

    /**
     * Is this ambient sound is currently audible based on its hidden state and the darkness level of the Scene?
     */
    get isAudible(): boolean;

    override get bounds(): Rectangle;

    /**
     * The named identified for the source object associated with this ambient sound
     */
    get sourceId(): string;

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

    override clear(): this;

    override draw(): Promise<this>;

    override destroy(options?: Parameters<PlaceableObject["destroy"]>[0]): void;

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

    override refresh(): this;

    /**
     * Refresh the display of the ControlIcon for this AmbientSound source
     */
    refreshControl(): void;

    /**
     * Compute the field-of-vision for an object, determining its effective line-of-sight and field-of-vision polygons
     * @param options - (default: `{}`)
     */
    updateSource(options?: AmbientSound.UpdateSourceOptions | undefined): void;

    protected override _onCreate(
      data: foundry.data.AmbientSoundData["_source"],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _onUpdate(
      changed: DeepPartial<foundry.data.AmbientSoundData["_source"]>,
      options?: DocumentModificationOptions,
      userId?: string
    ): void;

    protected override _onDelete(...args: Parameters<PlaceableObject["_onDelete"]>): void;

    protected override _canHUD(user: InstanceType<ConfiguredDocumentClassForName<"User">>, event?: any): boolean;

    protected override _canConfigure(user: InstanceType<ConfiguredDocumentClassForName<"User">>, event?: any): boolean;

    protected override _onClickRight(event: PIXI.InteractionEvent): void;

    protected override _onDragLeftMove(event: PIXI.InteractionEvent): void;
  }

  namespace AmbientSound {
    interface SyncOptions {
      /**
       * A duration in milliseconds to fade volume transition
       * @defaultValue `250`
       */
      fade: number;
    }

    interface UpdateSourceOptions {
      /**
       * Defer refreshing the SoundsLayer to manually call that refresh later.
       * @defaultValue `false`
       */
      defer?: boolean | undefined;

      /**
       * Indicate that this SoundSource has been deleted.
       * @defaultValue `false`
       */
      deleted?: boolean | undefined;
    }
  }
}
