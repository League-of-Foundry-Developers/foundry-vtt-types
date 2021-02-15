/**
 * The collection of Scene entities
 */
declare class Scenes extends EntityCollection<Scene> {
  /** @override */
  get entity(): string;

  /**
   * Return a reference to the Scene which is currently active
   * @returns
   */
  get active(): Scene;

  /**
   * Return a reference to the Scene which is currently viewed
   * @returns
   */
  get viewed(): Scene;

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers               */
  /* -------------------------------------------- */

  /** @override */
  static socketListeners(socket: SocketIOClient.Socket): void;

  /**
   * Augment the standard modifyDocument listener to flush fog exploration
   */
  protected static _resetFog(response: { scene: Scene; reset: boolean }): Promise<Canvas>;

  /**
   * Handle pre-loading the art assets for a Scene
   * @param sceneId - The Scene id to begin loading
   * @param push    - Trigger other connected clients to also pre-load Scene resources
   */
  preload(sceneId: string, push?: boolean): Promise<void>;

  /**
   * Handle requests pulling the current User to a specific Scene
   */
  protected static _pullToScene(sceneId: string): void;

  /** @override */
  fromCompendium(data: Scene.Data): Scene.Data;
}

/**
 * The Scene entity
 */
declare class Scene extends Entity<Scene.Data, Scene.EmbeddedEntityConfig> {
  /**
   * Track whether the scene is the active view
   */
  _view: boolean;

  /**
   * Track the viewed position of each scene (while in memory only, not persisted)
   * When switching back to a previously viewed scene, we can automatically pan to the previous position.
   * Object with keys: x, y, scale
   */
  _viewPosition: {
    x: number;
    y: number;
    scale: number;
  };

  static get config(): Entity.Config<Scene>;

  /** @override */
  prepareData(): Scene.Data;

  /** @override */
  prepareEmbeddedEntities(): void;

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * A convenience accessor for the background image of the Scene
   */
  get img(): string;

  /**
   * A convenience accessor for whether the Scene is currently active
   */
  get active(): boolean;

  /**
   * A convenience accessor for whether the Scene is currently viewed
   */
  get isView(): boolean;

  /**
   * A reference to the JournalEntry entity associated with this Scene, or null
   * @returns
   */
  get journal(): JournalEntry | null;

  /**
   * A reference to the Playlist entity for this Scene, or null
   */
  get playlist(): Playlist | null;

  /**
   * Set this scene as the current view
   * @returns
   */
  view(): Promise<void>;

  /**
   * Set this scene as currently active
   * @returns A Promise which resolves to the current scene once it has been successfully activated
   */
  activate(): Promise<this>;

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers               */
  /* -------------------------------------------- */

  /** @override */
  clone(createData?: DeepPartial<Scene.Data>, options?: Entity.CreateOptions): Promise<this>;

  /** @override */
  static create<T extends Scene, U>(
    this: ConstructorOf<T>,
    data: Expanded<U> extends DeepPartial<T['data']> ? U : DeepPartial<T['data']>,
    options?: Entity.CreateOptions
  ): Promise<T | null>;
  static create<T extends Scene, U>(
    this: ConstructorOf<T>,
    data: Expanded<U> extends DeepPartial<T['data']> ? ReadonlyArray<U> : ReadonlyArray<DeepPartial<T['data']>>,
    options?: Entity.CreateOptions
  ): Promise<T | T[] | null>;

  /** @override */
  update<U>(
    data: Expanded<U> extends DeepPartial<Scene.Data> ? U & { _id: string } : never,
    options: Entity.UpdateOptions
  ): Promise<this>;
  update(data: DeepPartial<Scene.Data> & { _id: string }, options: Entity.UpdateOptions): Promise<this>;

  /** @override */
  protected _onCreate(data: Scene.Data, options: Entity.CreateOptions, userId: string): void;

  /** @override */
  protected _onUpdate(
    data: DeepPartial<Scene.Data> & { _id: string },
    options: Entity.UpdateOptions,
    userId: string
  ): void;

  /** @override */
  protected _onDelete(options: Entity.DeleteOptions, userId: string): void;

  /**
   * Handle Scene activation workflow if the active state is changed to true
   */
  protected _onActivate(active: boolean): void;

  /** @override */
  protected _onCreateEmbeddedEntity<T extends keyof Scene.EmbeddedEntityConfig>(
    embeddedName: T,
    child: Scene.EmbeddedEntityConfig[T],
    options: Entity.CreateOptions & { temporary: boolean; renderSheet: boolean },
    userId: string
  ): void;

  /** @override */
  protected _onUpdateEmbeddedEntity<T extends keyof Scene.EmbeddedEntityConfig>(
    embeddedName: T,
    child: Scene.EmbeddedEntityConfig[T],
    updateData: DeepPartial<Scene.EmbeddedEntityConfig[T]> & { _id: string },
    options: Entity.UpdateOptions & { diff: boolean },
    userId: string
  ): void;

  /** @override */
  protected _onDeleteEmbeddedEntity<T extends keyof Scene.EmbeddedEntityConfig>(
    embeddedName: T,
    child: Scene.EmbeddedEntityConfig[T],
    options: Entity.DeleteOptions,
    userId: string
  ): void;

  /** @override */
  protected _onModifyEmbeddedEntity<T extends keyof Scene.EmbeddedEntityConfig>(
    embeddedName: T,
    changes: Scene.EmbeddedEntityConfig[T][],
    options: Entity.CreateOptions & { temporary: boolean; renderSheet: boolean },
    userId: string,
    context: { action: 'create' }
  ): void;
  protected _onModifyEmbeddedEntity<T extends keyof Scene.EmbeddedEntityConfig>(
    embeddedName: T,
    changes: (DeepPartial<Scene.EmbeddedEntityConfig[T]> & { _id: string })[] | string[],
    options: (Entity.UpdateOptions & { diff: boolean }) | Entity.DeleteOptions,
    userId: string,
    context: { action: 'update' }
  ): void;

  /* -------------------------------------------- */
  /*  History Storage Handlers                    */
  /* -------------------------------------------- */

  /** @override */
  protected static _handleCreateEmbeddedEntity({ request, result, userId }: any): any[];

  /** @override */
  protected static _handleUpdateEmbeddedEntity({ request, result, userId }: any): any[];

  /** @override */
  protected static _handleDeleteEmbeddedEntity({ request, result, userId }: any): any[];

  /* -------------------------------------------- */
  /*  Importing and Exporting                     */
  /* -------------------------------------------- */

  /** @override */
  toCompendium(): Promise<any>;

  /**
   * Create a 300px by 100px thumbnail image for this scene background
   * @param img    - A background image to use for thumbnail creation, otherwise the current scene
   *                 background is used.
   * @param width  - The desired thumbnail width. Default is 300px
   * @param height - The desired thumbnail height. Default is 100px;
   * @returns The created thumbnail data.
   */
  createThumbnail({
    img,
    width,
    height
  }: {
    img: string | null;
    width?: number;
    height?: number;
  }): Promise<ImageHelper.ThumbnailReturn>;
}

declare namespace Scene {
  interface Data extends Entity.Data {
    active: boolean;
    backgroundColor: string;
    darkness: number;
    description: string;
    drawings: Drawing['data'][];
    fogExploration: boolean;
    globalLight: boolean;
    globalLightThreshold: number;
    grid: number;
    gridAlpha: number;
    gridColor: string;
    gridDistance: number;
    gridType: number; // There's probably an enum TODO
    gridUnits: string;
    height: number;
    img: string;
    initial: { x: number; y: number; scale: number } | null;
    journal: string;
    lights: AmbientLight['data'][];
    name: string;
    navName: string;
    navOrder: number;
    navigation: boolean;
    notes: Note['data'][];
    padding: number;
    permission: Entity.Permission;
    playlist: string;
    shiftX: number;
    shiftY: number;
    size: number;
    sort: number;
    sounds: AmbientSound['data'][];
    templates: MeasuredTemplate['data'][];
    tiles: Tile['data'][];
    tokenVision: boolean;
    tokens: Token['data'][];
    walls: Wall['data'][];
    weather: string;
    width: number;
  }

  type EmbeddedEntityConfig = {
    AmbientLight: Data['lights'];
    AmbientSound: Data['sounds'];
    Drawing: Data['drawings'];
    Note: Data['notes'];
    MeasuredTemplate: Data['templates'];
    Tile: Data['tiles'];
    Token: Data['tokens'];
    Wall: Data['walls'];
  };
}
