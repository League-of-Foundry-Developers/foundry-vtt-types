import type { DeepPartial, EmptyObject, Identity, IntentionalPartial } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type ContextMenu from "../ux/context-menu.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";
import type { ColorField, FilePathField } from "#common/data/fields.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      SceneConfig: SceneConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Scene document.
 */
declare class SceneConfig<
  RenderContext extends SceneConfig.RenderContext = SceneConfig.RenderContext,
  Configuration extends SceneConfig.Configuration = SceneConfig.Configuration,
  RenderOptions extends SceneConfig.RenderOptions = SceneConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Scene.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["scene-config"],
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-map"
   *   },
   *   position: {width: 600},
   *   form: {
   *     closeOnSubmit: true
   *   },
   *   actions: {
   *     addLevel: SceneConfig.#onAddLevel,
   *     capturePosition: SceneConfig.#onCapturePosition,
   *     editLevel: SceneConfig.#onEditLevel,
   *     toggleLinkDimensions: SceneConfig.#onToggleLinkDimensions,
   *     openGridConfig: SceneConfig.#onOpenGridConfig,
   *     removeLevel: SceneConfig.#onRemoveLevel,
   *     resetEnvironment: SceneConfig.#onResetEnvironment,
   *     transitionPlay: SceneConfig.#onTransitionPlay
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   tabs: {template: "templates/generic/tab-navigation.hbs"},
   *   basics: {template: "templates/scene/config/basics.hbs", scrollable: [""]},
   *   grid: {template: "templates/scene/config/grid.hbs"},
   *   levels: {template: "templates/scene/config/levels.hbs", scrollable: [".levels"]},
   *   visibility: {template: "templates/scene/config/visibility.hbs", scrollable: [""]},
   *   environment: {template: "templates/scene/config/environment.hbs", scrollable: [""]},
   *   misc: {template: "templates/scene/config/misc.hbs", scrollable: [""]},
   *   footer: {template: "templates/generic/form-footer.hbs"}
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   sheet: {
   *     tabs: [
   *       {id: "basics", icon: "fa-solid fa-image"},
   *       {id: "grid", icon: "fa-solid fa-grid"},
   *       {id: "levels", icon: "fa-solid fa-layer-group"},
   *       {id: "visibility", icon: "fa-solid fa-eye"},
   *       {id: "environment", icon: "fa-solid fa-sun-cloud"},
   *       {id: "misc", icon: "fa-solid fa-shapes"}
   *     ],
   *     initial: "basics",
   *     labelPrefix: "SCENE.TABS.SHEET"
   *   }
   * }
   * ```
   */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * The level to draw delegated fields from. This will be the viewed level if this scene is the viewed scene, otherwise
   * it will be the scene's active level.
   */
  get defaultLevel(): Level.Implementation;

  /**
   * Get an enumeration of the available grid types which can be applied to this Scene
   * @internal
   */
  static _getGridTypes(): Record<CONST.GRID_TYPES, string>;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Get an enumeration of the available fog exploration modes for this Scene.
   * @internal
   */
  static _getFogExplorationModes(): Record<CONST.FOG_EXPLORATION_MODES, string>;

  override changeTab(tab: string, group: string, options?: ApplicationV2.ChangeTabOptions): void;

  /**
   * Live update the scene as certain properties are changed.
   * @param changed - The changed property
   * @internal
   */
  _previewScene(changed: string, options?: SceneConfig.PreviewSceneOptions): void;

  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): DocumentSheetV2.SubmitData<Scene.Implementation>;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: DocumentSheetV2.SubmitData<Scene.Implementation>,
    options?: DocumentSheetV2.ProcessSubmitOptions<Scene.Implementation>,
  ): Promise<DocumentSheetV2.SubmitResult<Scene.Implementation>>;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Get the set of ContextMenu options for levels in the scene config.
   */
  protected _getLevelContextOptions(): ContextMenu.Entry<HTMLElement>[];

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  /**
   * Handle drag start.
   * @param event - The initial event.
   */
  protected _onDragStart(event: DragEvent): void;

  /**
   * Handle dropping some data onto the sheet.
   * @param event - The triggering event.
   */
  protected _onDrop(event: DragEvent): Promise<Level.Implementation[] | void>;

  /**
   * Handle re-ordering levels via scene config.
   * @param event - The triggering event.
   * @param level - The scene level.
   */
  protected _onSortLevel(event: DragEvent, level: Level.Implementation): Promise<Level.Implementation[]> | void;

  #SceneConfig: true;
}

declare namespace SceneConfig {
  interface Any extends AnySceneConfig {}
  interface AnyConstructor extends Identity<typeof AnySceneConfig> {}

  /**
   * @remarks Members added by {@linkcode SceneConfig._preparePartContext | #_preparePartContext} are
   * `IntentionalPartial`ed because most are only set for the one part that consumes them.
   */
  interface RenderContext
    extends
      HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<Scene.Implementation>,
      IntentionalPartial<PreparePartContext> {
    tabClasses: string;
  }

  /** @remarks Added by {@linkcode SceneConfig._preparePartContext | #_preparePartContext} */
  interface PreparePartContext {
    /**
     * @remarks Added for every part; the source data of {@linkcode SceneConfig.defaultLevel | #defaultLevel},
     * or `{}` when the Scene has no default level.
     */
    defaultLevel: Level.Source | EmptyObject;

    /**
     * @remarks Added for every part; `"SCENE.CurrentLevel"` while this Scene is being viewed, otherwise
     * `"SCENE.InitialLevel"`.
     */
    levelLabel: string;

    /** @remarks Added for every part; the value of {@linkcode SceneConfig._getGridTypes}. */
    gridTypes: Record<CONST.GRID_TYPES, string>;

    /** @remarks Added for every part. */
    environmentFields: Scene.EnvironmentSchema;

    /** @remarks Added for the `basics` part; the GM-only and all-players accessibility choices. */
    ownerships: OwnershipChoice[];

    /** @remarks Added for the `basics` part. */
    background: BackgroundContext;

    /** @remarks Added for the `basics` part; localized {@linkcode CONFIG.weatherEffects} labels. */
    weatherTypes: Record<string, string>;

    /** @remarks Added for the `grid` part. */
    pixelsLabel: string;

    /** @remarks Added for the `grid` part; the value of {@linkcode CONST.GRID_MIN_SIZE}. */
    minGrid: number;

    /** @remarks Added for the `grid` part; localized {@linkcode CONFIG.Canvas.gridStyles} labels. */
    gridStyles: Record<string, string>;

    /** @remarks Added for the `levels` part. */
    initialLevel: string;

    /** @remarks Added for the `levels` part, in reverse sort order. */
    levels: LevelContext[];

    /** @remarks Added for the `levels` and `visibility` parts. */
    globalLight: Scene.GlobalLightSource;

    /** @remarks Added for the `levels` and `visibility` parts. */
    fogFields: Scene.FogSchema;

    /**
     * @remarks Added for the `levels` and `visibility` parts; the value of
     * {@linkcode SceneConfig._getFogExplorationModes}.
     */
    fogExplorationModes: Record<CONST.FOG_EXPLORATION_MODES, string>;

    /** @remarks Added for the `levels` and `visibility` parts. */
    fog: FogContext;

    /** @remarks Added for the `environment` part. */
    baseFields: Scene.BaseEnvironmentSchema;

    /** @remarks Added for the `environment` part. */
    darkFields: Scene.DarkEnvironmentSchema;

    /** @remarks Added for the `environment` part. */
    baseHueDisabled: boolean;

    /** @remarks Added for the `environment` part. */
    darkHueDisabled: boolean;

    /**
     * @remarks Added for the `misc` part; the pages of the linked JournalEntry keyed by page ID, or `[]` when
     * no JournalEntry is linked.
     */
    pages: Record<string, string> | [];

    /**
     * @remarks Added for the `misc` part; the sounds of the linked Playlist keyed by sound ID, or `[]` when no
     * Playlist is linked.
     */
    sounds: Record<string, string> | [];

    /** @remarks Added for the `misc` part; localized {@linkcode CONFIG.Canvas.sceneTransitions} labels. */
    transitionTypes: Record<string, string>;

    /** @remarks Added for the `footer` part. */
    buttons: ApplicationV2.FormFooterButton[];

    /** @remarks Only added when the part being rendered is also a tab of the `sheet` group. */
    tab: ApplicationV2.Tab;
  }

  /** An entry of {@linkcode PreparePartContext.ownerships}. */
  interface OwnershipChoice {
    value: typeof CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE | typeof CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;

    label: string;
  }

  /** An entry of {@linkcode PreparePartContext.levels}. */
  interface LevelContext {
    id: string;

    name: string;

    label: string;

    value: string;

    /** @remarks Whether this is the Level currently being viewed on the canvas. */
    viewed: boolean;

    /**
     * @remarks The Level's localized `[bottom, top]` elevation range, using `-∞`/`+∞` for infinite bounds, or
     * `""` when both bounds are infinite.
     */
    meta: string;
  }

  /** The delegated background fields of the `basics` part. */
  interface BackgroundContext {
    color: DelegatedField<ColorField>;

    src: DelegatedField<FilePathField>;
  }

  /** The delegated fog fields of the `visibility` part. */
  interface FogContext {
    overlay: DelegatedField<FilePathField>;
  }

  /**
   * A field whose value is delegated to the Scene's default Level, rendered with a tooltip naming that Level
   * when the Scene has more than one.
   */
  interface DelegatedField<Field> {
    field: Field;

    /** @remarks `null` unless the Scene has more than one Level. */
    tooltip: string | null;

    value: string | undefined;
  }

  interface PreviewSceneOptions {
    /** Should the preview be forced, regardless of changes? */
    force?: boolean | undefined;
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Scene.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnySceneConfig extends SceneConfig<
  SceneConfig.RenderContext,
  SceneConfig.Configuration,
  SceneConfig.RenderOptions
> {
  constructor(...args: never);
}

export default SceneConfig;
