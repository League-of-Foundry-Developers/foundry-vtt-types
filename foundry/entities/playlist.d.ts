declare class Playlist extends Entity<Playlist.Data> {
  /**
   * Each sound which is played within the Playlist has a created Howl instance.
   * The keys of this object are the sound IDs and the values are the Howl instances.
   */
  audio: {
    [soundId: string]: {
      id: string | undefined;
      howl: Howl;
      sound: string;
    };
  };

  /**
   * Playlists may have a playback order which defines the sequence of Playlist Sounds
   */
  playbackOrder: string[];

  /** @override */
  static get config(): Entity.Config<Playlist>;

  /** @override */
  prepareEmbeddedEntities(): void;

  /**
   * Set up the Howl object by calling the core AudioHelper utility
   * @param sound - The PlaylistSound for which to create an audio object
   * @returns The created audio object
   */
  protected _createAudio(sound: Playlist.Sound): void;

  /**
   * This callback triggers whenever a sound concludes playback
   * Mark the concluded sound as no longer playing and possibly trigger playback for a subsequent sound depending on
   * the playlist mode.
   *
   * @param soundId - The sound ID of the track which is ending playback
   */
  protected _onEnd(soundId: string): Promise<void>;

  /**
   * Generate a new playback order for the playlist.
   * Use a seed for randomization to (hopefully) guarantee that all clients generate the same random order.
   * The seed is based on the first 9 characters of the UTC datetime multiplied by the index order of the playlist.
   */
  protected _getPlaybackOrder(): string[];

  /**
   * Get the next sound which should be played in the Playlist after the current sound completes
   * @param soundId - The ID of the currently playing sound
   * @returns The sound data for the next sound to play
   */
  protected _getNextSound(soundId: string): Playlist.Sound;

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * An Array of the sound data contained within this Playlist entity
   */
  get sounds(): Playlist.Sound[];

  /**
   * The playback mode for the Playlist instance
   */
  get mode(): number;

  /**
   * An indicator for whether any Sound within the Playlist is currently playing
   */
  get playing(): boolean;

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /**
   * Play (or stop) a single sound from the Playlist
   * @param sound - The sound object to begin playback
   */
  playSound(sound: Playlist.Sound): void;

  /**
   * Begin simultaneous playback for all sounds in the Playlist.
   * @returns The updated Playlist entity
   */
  playAll(): Promise<this>;

  /**
   * End playback for any/all currently playing sounds within the Playlist.
   * @returns The updated Playlist entity
   */
  stopAll(): Promise<this>;

  /**
   * Cycle the playlist mode
   * @returns A promise which resolves to the updated Playlist instance
   */
  cycleMode(): Promise<this>;

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers               */
  /* -------------------------------------------- */

  /** @override */
  protected _onUpdate(data: DeepPartial<Playlist.Data>, options: Entity.UpdateOptions, userId: string): void;

  /** @override */
  protected _onCreateEmbeddedEntity(
    embeddedName: string,
    child: Playlist.Sound,
    options: Entity.UpdateOptions,
    userId: string
  ): void;

  /** @override */
  protected _onUpdateEmbeddedEntity(
    embeddedName: string,
    child: Playlist.Sound,
    updateData: any,
    options: Entity.UpdateOptions,
    userId: string
  ): void;

  /** @override */
  protected _onDeleteEmbeddedEntity(
    embeddedName: string,
    child: Playlist.Sound,
    options: Entity.UpdateOptions,
    userId: string
  ): void;

  /** @override */
  protected _onModifyEmbeddedEntity(
    embeddedName: string,
    changes: any[],
    options: any,
    userId: string,
    context?: any
  ): void;

  /* -------------------------------------------- */
  /*  Importing and Exporting                     */
  /* -------------------------------------------- */

  /** @override */
  toCompendium(): Promise<Playlist.Data>;
}

declare namespace Playlist {
  interface Sound {
    flags: any;
    name: string;
    path: string;
    playing: boolean;
    repeat: boolean;
    streaming: boolean;
    volume: number;
    _id: string;
  }

  interface Data extends Entity.Data {
    mode: Const.PlaylistMode;
    name: string;
    permission: Entity.Permission;
    playing: boolean;
    sort: number;
    sounds: Sound[];
  }
}
