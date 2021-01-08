declare class Playlists extends Collection<Playlist> {
  entities: Playlist[]

  /** @override */
  get object (): Playlist;

  values (): IterableIterator<Playlist>;

  /**
   * Return the subset of Playlist entities which are currently playing
   */
  get playing (): Playlist[];

  /**
   * Handle changes to a Scene to determine whether to trigger changes to Playlist entities.
   * @param scene    The Scene entity being updated
   * @param data    Incremental update data
   * @param options  Update options
   */
  protected _onUpdateScene (scene: Scene, data: object, options: object): void;
}

declare class Playlist<D extends Playlist.Data = Playlist.Data> extends Entity<D> {
  /**
   * Each sound which is played within the Playlist has a created Howl instance.
   * The keys of this object are the sound IDs and the values are the Howl instances.
   * @type {Object}
   */
  audio: any

  /**
   * Playlists may have a playback order which defines the sequence of Playlist Sounds
   * @type {string[]}
   */
  playbackOrder: string[]

  /** @override */
  static get config (): EntityConfig

  /** @override */
  prepareEmbeddedEntities (): void

  /**
   * Set up the Howl object by calling the core AudioHelper utility
   * @param {Object} sound    The PlaylistSound for which to create an audio object
   * @return {Object}         The created audio object
   * @private
   */
  _createAudio (sound: Playlist.Sound): void

  /**
   * This callback triggers whenever a sound concludes playback
   * Mark the concluded sound as no longer playing and possibly trigger playback for a subsequent sound depending on
   * the playlist mode.
   *
   * @param {string} soundId  The sound ID of the track which is ending playback
   * @private
   */
  _onEnd (soundId: string): Promise<void>

  /**
   * Generate a new playback order for the playlist.
   * Use a seed for randomization to (hopefully) guarantee that all clients generate the same random order.
   * The seed is based on the first 9 characters of the UTC datetime multiplied by the index order of the playlist.
   * @private
   */
  _getPlaybackOrder (): string[]

  /**
   * Get the next sound which should be played in the Playlist after the current sound completes
   * @param {string} soundId    The ID of the currently playing sound
   * @return {Object}           The sound data for the next sound to play
   * @private
   */
  _getNextSound (soundId: string): any // TODO sound data

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * An Array of the sound data contained within this Playlist entity
   * @type {object[]}
   */
  get sounds (): any[] // TODO this.data.sounds; sound data

  /**
   * The playback mode for the Playlist instance
   * @type {number}
   */
  get mode (): number

  /**
   * An indicator for whether any Sound within the Playlist is currently playing
   * @type {boolean}
   */
  get playing (): boolean

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /**
   * Play (or stop) a single sound from the Playlist
   * @param sound {Object}       The sound object to begin playback
   */
  playSound (sound: any): void // sound data

  /**
   * Begin simultaneous playback for all sounds in the Playlist.
   * @returns {Promise<Playlist>} The updated Playlist entity
   */
  playAll (): Promise<this>

  /**
   * End playback for any/all currently playing sounds within the Playlist.
   * @returns {Promise<Playlist>} The updated Playlist entity
   */
  stopAll (): Promise<this>

  /**
   * Cycle the playlist mode
   * @return {Promise.<Playlist>}   A promise which resolves to the updated Playlist instance
   */
  cycleMode (): Promise<this>

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers               */
  /* -------------------------------------------- */

  /** @override */
  _onUpdate (data: D, options: EntityUpdateOptions, userId: string): void

  /** @override */
  _onCreateEmbeddedEntity (embeddedName: string, child: Playlist.Sound, options: EntityUpdateOptions, userId: string): void

  /** @override */
  _onUpdateEmbeddedEntity (embeddedName: string, child: Playlist.Sound, updateData: any, options: EntityUpdateOptions, userId: string): void

  /** @override */
  _onDeleteEmbeddedEntity (embeddedName: string, child: Playlist.Sound, options: EntityUpdateOptions, userId: string): void

  /** @override */
  _onModifyEmbeddedEntity (embeddedName: string, changes: any[], options: any, userId: string, context?: any): void

  /* -------------------------------------------- */
  /*  Importing and Exporting                     */
  /* -------------------------------------------- */

  /** @override */
  toCompendium (): any
}

declare namespace Playlist {
  interface Sound {
    flags?: any
    name?: string
    path?: string
    playing?: boolean
    repeat?: boolean
    streaming?: boolean
    volume?: number
    _id?: string
  }

  interface Data extends EntityData {
    sounds?: any[]
    mode?: number
    playing?: boolean
    sort?: number
  }
}
