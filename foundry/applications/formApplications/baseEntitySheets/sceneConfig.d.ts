/**
 * A Scene configuration sheet
 * @see {@link Scene} The Scene Entity which is being configured
 */
declare class SceneConfig extends BaseEntitySheet<SceneConfig.Data, Scene> {
  /**
   * @override
   */
  static get defaultOptions(): SceneConfig.Options;

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
  protected static _getGridTypes(): Record<Const.GridType, string>;

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
  protected _onCapturePosition(event: Event): void;

  /**
   * @override
   */
  protected _onChangeRange(event: Event): void;

  /**
   * Handle click events to open the grid configuration application
   * @param event - The originating click event
   */
  protected _onGridConfig(event: Event): SceneConfig['minimize'];

  /**
   * @override
   */
  protected _updateObject(event: Event, formData: Scene.Data): Promise<Scene>;
}

declare namespace SceneConfig {
  interface Data extends BaseEntitySheet.Data {
    gridTypes: ReturnType<typeof SceneConfig['_getGridTypes']>;
    weatherTypes: ReturnType<SceneConfig['_getWeatherTypes']>;
    playlists: ReturnType<SceneConfig['_getEntities']>;
    journals: ReturnType<SceneConfig['_getEntities']>;
    hasGlobalThreshold: boolean;
    entity: BaseEntitySheet.Data['entity'] & {
      /**
       * @defaultValue `0`
       */
      globalLightThreshold: number;
    };
  }

  interface Options extends BaseEntitySheet.Options {
    /**
     * @defaultValue `['sheet', 'scene-sheet']`
     */
    classes: string[];

    /**
     * @defaultValue `'templates/scene/config.html'`
     */
    template: string;

    /**
     * @defaultValue `680`
     */
    width: number;

    /**
     * @defaultValue `'auto'`
     */
    height: 'auto' | number;
  }
}
