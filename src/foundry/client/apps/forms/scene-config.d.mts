import type { MaybePromise } from "../../../../utils/index.d.mts";
import type Document from "../../../common/abstract/document.d.mts";

declare global {
  /**
   * The Application responsible for configuring a single Scene document.   *
   * @typeParam Options - the type of the options object
   */
  class SceneConfig<
    Options extends DocumentSheetOptions<Scene.ConfiguredInstance> = DocumentSheetOptions<Scene.ConfiguredInstance>,
  > extends DocumentSheet<Options, Scene.ConfiguredInstance> {
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
    static override get defaultOptions(): DocumentSheetOptions<Scene.ConfiguredInstance>;

    /**
     * Indicates if width / height should change together to maintain aspect ratio
     */
    linkedDimensions: boolean;

    override get title(): string;

    override close(options?: Application.CloseOptions): Promise<void>;

    override render(force?: boolean, options?: Application.RenderOptions<Options>): this;

    override getData(options?: Partial<Options>): MaybePromise<object>; // TODO: implement GetDataReturnType

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
    protected _getDocuments(
      collection: WorldCollection<Document.AnyConstructor, string>,
    ): { _id: string; name: string }[];

    override activateListeners(html: JQuery): void;

    /**
     * Capture the current Scene position and zoom level as the initial view in the Scene config
     * @param event - The originating click event
     * @internal
     */
    protected _onCapturePosition(event: JQuery.ClickEvent): void;

    /**
     * Handle click events to open the grid configuration application
     * @param event - The originating click event
     */
    protected _onGridConfig(event: Event): Promise<void>;

    /**
     * Handle click events to link or unlink the scene dimensions
     */
    protected _onLinkDimensions(event: Event): Promise<void>;

    protected override _onChangeInput(event: JQuery.ChangeEvent): Promise<void>;

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
     * Handle updating the select menu of JournalEntryPage options when the JournalEntry is changed.
     * @param event - The initiating select change event.
     */
    protected _onChangeJournal(event: JQuery.ChangeEvent): void;

    protected override _updateObject(event: Event, formData: SceneConfig.FormData): Promise<unknown>;
  }

  namespace SceneConfig {
    type Any = SceneConfig<any>;

    interface FormData {
      backgroundColor: Scene["backgroundColor"];
      "background.src": Scene["background"]["src"];
      "background.offsetX": Scene["background"]["offsetX"];
      "background.offsetY": Scene["background"]["offsetY"];
      darkness: Scene["darkness"];
      fogExploration: Scene["fogExploration"];
      fogOverlay: Scene["fogOverlay"];
      fogUnexploredColor: Scene["fogUnexploredColor"];
      foreground: Scene["foreground"];
      foregroundElevation: Scene["foregroundElevation"];
      globalLight: Scene["globalLight"];
      globalLightThreshold: Scene["globalLightThreshold"];
      grid: Scene["grid"];
      "grid.alpha": Scene["grid"]["alpha"];
      "grid.color": Scene["grid"]["color"];
      "grid.distance": Scene["grid"]["distance"];
      "grid.type": Scene["grid"]["type"];
      "grid.units": Scene["grid"]["units"];
      hasGlobalThreshold: boolean;
      height: Scene["height"];
      "initial.scale": Scene["initial"]["scale"];
      "initial.x": Scene["initial"]["x"];
      "initial.y": Scene["initial"]["y"];
      journal: Scene["_source"]["journal"];
      journalEntryPage: Scene["journalEntryPage"];
      name: Scene["name"];
      navName: Scene["navName"];
      navigation: Scene["navigation"];
      padding: Scene["padding"];
      "ownership.default": Scene["ownership"]["default"];
      playlist: Scene["playlist"];
      playlistSound: Scene["playlistSound"];
      tokenVision: Scene["tokenVision"];
      weather: Scene["weather"];
      width: Scene["width"];
    }
  }
}
