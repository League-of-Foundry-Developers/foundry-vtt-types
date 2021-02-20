/**
 * The Scene entity
 */
declare class Scene extends Entity<Scene.Data> {
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
    data: Expanded<U> extends DeepPartial<Scene.Data> ? U : never,
    options: Entity.UpdateOptions
  ): Promise<this>;
  update(data: DeepPartial<Scene.Data>, options: Entity.UpdateOptions): Promise<this>;

  /** @override */
  protected _onCreate(data: Scene.Data, options: any, userId: string): void;

  /** @override */
  protected _onUpdate(data: DeepPartial<Scene.Data>, options: Entity.UpdateOptions, userId: string): void;

  /** @override */
  protected _onDelete(options: Entity.DeleteOptions, userId: string): void;

  /**
   * Handle Scene activation workflow if the active state is changed to true
   */
  protected _onActivate(active: boolean): void;

  /** @override */
  protected _onCreateEmbeddedEntity(embeddedName: string, child: any, options: any, userId: string): void;

  /** @override */
  protected _onUpdateEmbeddedEntity(
    embeddedName: string,
    child: any,
    updateData: any,
    options: any,
    userId: string
  ): void;

  /** @override */
  protected _onDeleteEmbeddedEntity(embeddedName: string, child: any, options: any, userId: string): void;

  /** @override */
  protected _onModifyEmbeddedEntity(
    embeddedName: string,
    changes: any[],
    options: any,
    userId: string,
    context?: any
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
    gridType: Const.GridType;
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
}
