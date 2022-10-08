import type { ConfiguredDocumentClassForName, DocumentConstructor } from "../../../../types/helperTypes";

declare global {
  /**
   * The Application responsible for configuring a single Scene document.   *
   * @typeParam Options - the type of the options object
   */
  class SceneConfig<Options extends DocumentSheetOptions<Scene> = DocumentSheetOptions<Scene>> extends DocumentSheet<
    Options,
    InstanceType<ConfiguredDocumentClassForName<"Scene">>
  > {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "scene-config",
     *   classes: ["sheet", "scene-sheet"],
     *   template: "templates/scene/config.html",
     *   width: 560,
     *   height: "auto",
     *   tabs: [{navSelector: ".tabs", contentSelector: "form", initial: "basic"}]
     * });
     * ```
     */
    static override get defaultOptions(): DocumentSheetOptions<Scene>;

    override get title(): string;

    override close(options?: Application.CloseOptions | undefined): Promise<void>;

    override render(force?: boolean, options?: Application.RenderOptions<Options>): this;

    override getData(options?: Partial<Options>): MaybePromise<object>;

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

    override activateListeners(html: JQuery): void;

    /**
     * Capture the current Scene position and zoom level as the initial view in the Scene config
     * @param event - The originating click event
     * @internal
     */
    protected _onCapturePosition(event: JQuery.ClickEvent): void;

    protected override _onChangeInput(event: JQuery.ChangeEvent): void;

    protected override _onChangeColorPicker(event: JQuery.ChangeEvent): void;

    protected override _onChangeRange(event: JQuery.ChangeEvent): void;

    /**
     * Live update the scene as certain properties are changed.
     * @param changed - The changed property.
     * @internal
     */
    protected _previewScene(changed: string): void;

    /**
     * Reset the previewed darkness level, background color, grid alpha, and grid color back to their true values.
     * @internal
     */
    protected _resetScenePreview(): void;

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

    protected override _updateObject(event: Event, formData: SceneConfig.FormData): Promise<unknown>;
  }

  namespace SceneConfig {
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
      "initial.scale": number | null;
      "initial.x": number | null;
      "initial.y": number | null;
      journal: string;
      name: string;
      navName: string;
      navigation: boolean;
      padding: number;
      "permission.default": foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS;
      playlist: string;
      shiftX: number | null;
      shiftY: number | null;
      tokenVision: boolean;
      weather: string;
      width: number | null;
    };
  }
}
