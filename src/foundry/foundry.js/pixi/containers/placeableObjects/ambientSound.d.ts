import { BaseAmbientSound } from '../../../../common/documents.mjs';

declare global {
  /**
   * An AmbientSound is an implementation of PlaceableObject which represents a dynamic audio source within the Scene.
   *
   * @example
   * ```typescript
   * AmbientSound.create({
   *   t: "l",
   *   x: 1000,
   *   y: 1000,
   *   radius: 60,
   *   easing: true,
   *   path: "sounds/audio-file.mp3",
   *   repeat: true,
   *   volume: 0.4
   * });
   * ```
   */
  class AmbientSound extends PlaceableObject<BaseAmbientSound> {
    /**
     * The Howl instance used to play this AmbientSound effect
     */
    howl: Howl;

    /**
     * The Howl sound ID of the playing instance of this sound
     */
    howlId?: number;

    /**
     * Create an audio helper instance to use for the Ambient Sound
     */
    protected _createHowl(): Howl;

    /** @override */
    static get embeddedName(): 'AmbientSound';

    /**
     * @remarks
     * Not implemented for AmbientSound
     */
    get bounds(): never;

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
     * @param fade      - Whether to fade the volume from its previous level
     */
    play(isAudible: boolean, volume?: number, { fade }?: { fade?: boolean }): void | number;

    /**
     * @override
     * @remarks
     * Returns void
     */
    clear(): any;

    /** @override */
    draw(): Promise<this>;

    /**
     * Draw the graphical preview of the audio source area of effect
     */
    protected drawField(): PIXI.Container;

    /**
     * Draw the ControlIcon for the AmbientLight
     */
    protected _drawControlIcon(): ControlIcon;

    /** @override */
    refresh(): this;

    /**
     * Compute the field-of-vision for an object, determining its effective line-of-sight and field-of-vision polygons
     * @returns An object containing the rays, LOS polygon, and FOV polygon for the light
     */
    computeFOV(): {
      fov: PIXI.Polygon | null;
      los: PIXI.Polygon | null;
      rays: Array<Ray> | null;
    };

    /** @override */
    protected _onCreate(): void;

    /** @override */
    protected _onUpdate(data: AmbientSound.Data): void;

    /** @override */
    protected _onDelete(): void;
  }

  namespace AmbientSound {
    interface Data {
      easing: boolean;
      path: string;
      radius: number;
      repeat: boolean;
      type: 'l' | 'g';
      volume: number;
      x: number;
      y: number;
    }
  }
}
