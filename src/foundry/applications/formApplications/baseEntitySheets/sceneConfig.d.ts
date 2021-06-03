// TODO: Remove when updating this class!!!
// eslint-disable-next-line
// @ts-nocheck

/**
 * A Scene configuration sheet
 * @see {@link Scene} The Scene Entity which is being configured
 */
declare class SceneConfig extends DocumentSheet<DocumentSheet.Options, SceneConfig.Data, Scene> {
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
  static get defaultOptions(): typeof DocumentSheet['defaultOptions'];

  /**
   * @override
   */
  get id(): string;

  /**
   * @override
   */
  get title(): string;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): SceneConfig.Data;

  /**
   * Get an enumeration of the available grid types which can be applied to this Scene
   */
  protected static _getGridTypes(): Record<foundry.CONST.GridType, string>;

  /**
   * Get the available weather effect types which can be applied to this Scene
   */
  protected _getWeatherTypes(): Record<string, string>;

  /**
   * Get the alphabetized entities which can be chosen as a configuration for the scene
   */
  protected _getEntities(collection: EntityCollection): { _id: string; name: string }[];

  /**
   * @override
   */
  activateListeners(html: JQuery): void;

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
  interface Data extends DocumentSheet.Data {
    gridTypes: ReturnType<typeof SceneConfig['_getGridTypes']>;
    weatherTypes: ReturnType<SceneConfig['_getWeatherTypes']>;
    playlists: ReturnType<SceneConfig['_getEntities']>;
    journals: ReturnType<SceneConfig['_getEntities']>;
    hasGlobalThreshold: boolean;
    document: DocumentSheet.Data['document'] & {
      /**
       * @defaultValue `0`
       */
      globalLightThreshold: number;
    };
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
    gridType: foundry.CONST.GridType;
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
