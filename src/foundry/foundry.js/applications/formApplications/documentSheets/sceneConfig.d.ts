import type { ConfiguredDocumentClassForName, DocumentConstructor } from '../../../../../types/helperTypes';

declare global {
  /**
   * The Application responsible for configuring a single Scene document.
   * @see {@link Scene} The Scene Document which is being configured
   *
   * @typeParam Options - the type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class SceneConfig<
    Options extends DocumentSheetOptions = DocumentSheetOptions,
    Data extends object = SceneConfig.Data<Options>
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClassForName<'Scene'>>> {
    /**
     * @override
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "scene-config",
     *   classes: ["sheet", "scene-sheet"],
     *   template: "templates/scene/config.html",
     *   width: 680,
     *   height: "auto",
     * });
     * ```
     */
    static get defaultOptions(): DocumentSheetOptions;

    /**
     * @override
     */
    get title(): string;

    /**
     * @override
     * @remarks This incorrectly overrides `Application#render` by potentially returning `void`, see https://gitlab.com/foundrynet/foundryvtt/-/issues/6026.
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    render(force?: boolean, options?: Application.RenderOptions<Options>): this | void;

    /**
     * @param options - (unused)
     * @override
     */
    getData(options?: Partial<DocumentSheetOptions>): Data | Promise<Data>;

    /**
     * Get an enumeration of the available grid types which can be applied to this Scene
     * @internal
     */
    protected static _getGridTypes(): Record<foundry.CONST.GRID_TYPES, string>;

    /**
     * Get the available weather effect types which can be applied to this Scene
     * @internal
     */
    protected _getWeatherTypes(): Record<string, string>;

    /**
     * Get the alphabetized Documents which can be chosen as a configuration for the Scene
     * @internal
     */
    protected _getDocuments(collection: WorldCollection<DocumentConstructor, string>): { _id: string; name: string }[];

    /** @override */
    activateListeners(html: JQuery): void;

    /**
     * Capture the current Scene position and zoom level as the initial view in the Scene config
     * @param event - The originating click event
     * @internal
     */
    protected _onCapturePosition(event: JQuery.ClickEvent): void;

    /** @override */
    protected _onChangeRange(event: JQuery.ChangeEvent): void;

    /**
     * Handle updating the select menu of PlaylistSound options when the Playlist is changed
     * @param event - The initiating select change event
     * @internal
     */
    _onChangePlaylist(event: JQuery.ChangeEvent): void;

    /**
     * Handle click events to open the grid configuration application
     * @param event - The originating click event
     */
    protected _onGridConfig(event: JQuery.ClickEvent): void;

    /**
     * @override
     */
    protected _updateObject(
      event: Event,
      formData: SceneConfig.FormData
    ): Promise<InstanceType<ConfiguredDocumentClassForName<'Scene'>> | undefined>;
  }

  namespace SceneConfig {
    interface Data<Options extends DocumentSheetOptions = DocumentSheetOptions>
      extends DocumentSheet.Data<InstanceType<ConfiguredDocumentClassForName<'Scene'>>, Options> {
      gridTypes: ReturnType<typeof SceneConfig['_getGridTypes']>;
      weatherTypes: ReturnType<SceneConfig['_getWeatherTypes']>;
      playlists: ReturnType<SceneConfig['_getDocuments']>;
      sounds: ReturnType<SceneConfig['_getDocuments']>;
      journals: ReturnType<SceneConfig['_getDocuments']>;
      hasGlobalThreshold: boolean;
      data: DocumentSheet.Data<InstanceType<ConfiguredDocumentClassForName<'Scene'>>, Options>['data'] & {
        /**
         * @defaultValue `0`
         */
        globalLightThreshold: number;
      };
    }

    type FormData = {
      backgroundColor: string;
      darkness: number;
      fogExploration: boolean;
      foreground: string;
      globalLight: boolean;
      globalLightThreshold: number;
      grid: number | null;
      gridAlpha: number;
      gridColor: string;
      gridDistance: number | null;
      gridType: foundry.CONST.GRID_TYPES;
      gridUnits: string;
      hasGlobalThreshold: boolean;
      height: number | null;
      img: string;
      'initial.scale': number | null;
      'initial.x': number | null;
      'initial.y': number | null;
      journal: string;
      name: string;
      navName: string;
      navigation: boolean;
      padding: number;
      'permission.default': foundry.CONST.DOCUMENT_PERMISSION_LEVELS;
      playlist: string;
      shiftX: number | null;
      shiftY: number | null;
      tokenVision: boolean;
      weather: string;
      width: number | null;
    };
  }
}
