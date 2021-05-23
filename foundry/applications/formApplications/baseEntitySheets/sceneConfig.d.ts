/**
 * A Scene configuration sheet
 * @see {@link Scene} The Scene Entity which is being configured
 */
declare class SceneConfig extends BaseEntitySheet<BaseEntitySheet.Options, SceneConfig.Data, Scene> {
  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   classes: ["sheet", "scene-sheet"],
   *   template: "templates/scene/config.html",
   *   width: 680,
   *   height: "auto"
   * });
   * ```
   */
  static get defaultOptions(): typeof BaseEntitySheet['defaultOptions'];

  /**
   * Get an enumeration of the available grid types which can be applied to this Scene
   */
  protected static _getGridTypes(): Record<Const.GridType, string>;

  /**
   * @override
   */
  get id(): string;

  /**
   * @override
   */
  get title(): string;

  /**
   * @override
   */
  activateListeners(html: JQuery): void;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): SceneConfig.Data;

  /**
   * Get the alphabetized entities which can be chosen as a configuration for the scene
   */
  protected _getEntities(collection: EntityCollection): { _id: string; name: string }[];

  /**
   * Get the available weather effect types which can be applied to this Scene
   */
  protected _getWeatherTypes(): Record<string, string>;

  /**
   * Capture the current Scene position and zoom level as the initial view in the Scene config
   * @param event - The originating click event
   */
  protected _onCapturePosition(event: JQuery.ClickEvent): void;

  /**
   * @override
   */
  protected _onChangeRange(event: JQuery.ChangeEvent): void;

  /**
   * Handle click events to open the grid configuration application
   * @param event - The originating click event
   */
  protected _onGridConfig(event: JQuery.ClickEvent): SceneConfig['minimize'];

  /**
   * @override
   */
  protected _updateObject(event: Event, formData: SceneConfig.FormData): Promise<Scene>;
}

declare namespace SceneConfig {
  interface Data extends BaseEntitySheet.Data {
    entity: BaseEntitySheet.Data['entity'] & {
      /**
       * @defaultValue `0`
       */
      globalLightThreshold: number;
    };
    gridTypes: ReturnType<typeof SceneConfig['_getGridTypes']>;
    hasGlobalThreshold: boolean;
    journals: ReturnType<SceneConfig['_getEntities']>;
    playlists: ReturnType<SceneConfig['_getEntities']>;
    weatherTypes: ReturnType<SceneConfig['_getWeatherTypes']>;
  }

  type FormData = {
    backgroundColor: Scene.Data['backgroundColor'];
    darkness: Scene.Data['darkness'];
    fogExploration: Scene.Data['fogExploration'];
    globalLight: Scene.Data['globalLight'];
    globalLightThreshold: Scene.Data['globalLightThreshold'];
    grid: GridConfig.FormData['grid'];
    gridAlpha: Scene.Data['gridAlpha'];
    gridColor: Scene.Data['gridColor'];
    gridDistance: Scene.Data['gridDistance'] | null;
    gridType: Const.GridType;
    gridUnits: Scene.Data['gridUnits'];
    hasGlobalThreshold: boolean;
    height: Scene.Data['height'] | null;
    img: Scene.Data['img'];
    'initial.scale': number | null;
    'initial.x': number | null;
    'initial.y': number | null;
    journal: Scene.Data['journal'];
    name: string;
    navName: Scene.Data['navName'];
    navigation: Scene.Data['navigation'];
    padding: Scene.Data['padding'];
    'permission.default': Scene.Data['permission'];
    playlist: Scene.Data['playlist'];
    shiftX: GridConfig.FormData['shiftX'];
    shiftY: GridConfig.FormData['shiftY'];
    tokenVision: Scene.Data['tokenVision'];
    weather: Scene.Data['weather'];
    width: Scene.Data['width'] | null;
  };
}
