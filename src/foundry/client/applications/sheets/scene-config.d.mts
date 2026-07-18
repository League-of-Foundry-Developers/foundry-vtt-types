import type { DeepPartial, EmptyObject, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";
import type ContextMenu from "../ux/context-menu.d.mts";

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
   * The level to draw delegated fields from. This will be the viewed level if this scene is the viewed scene,
   * otherwise it will be the scene's active level.
   * @remarks TODO: Runtime returns `canvas.level ?? this.document.initialLevel`; the `levels`-related members of
   * `Canvas` and `Scene` aren't yet typed by fvtt-types.
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
   * @param options - (default: `{}`)
   * @internal
   */
  _previewScene(changed: string, options?: { force?: boolean | undefined }): void;

  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): object;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: object,
    options?: unknown,
  ): Promise<foundry.applications.api.DocumentSheetV2.SubmitResult<Scene.Implementation>>;

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
  protected _onDrop(event: DragEvent): Promise<void>;

  /**
   * Handle re-ordering levels via scene config.
   * @param event - The triggering event.
   * @param level - The scene level.
   */
  protected _onSortLevel(event: DragEvent, level: Level.Implementation): Promise<Level.Stored[]> | void;

  #SceneConfig: true;
}

declare namespace SceneConfig {
  interface Any extends AnySceneConfig {}
  interface AnyConstructor extends Identity<typeof AnySceneConfig> {}

  /**
   * @remarks A `DataField` paired with the tooltip and current (possibly level-delegated) value used to render its
   * form group.
   */
  interface FieldPreview {
    field: foundry.data.fields.DataField.Any;
    tooltip: string | null;
    value: unknown;
  }

  interface LevelListEntry {
    id: string | null;
    name: string;
    label: string;
    value: string | null;
    viewed: boolean;
    meta: string;
  }

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Scene.Implementation> {
    tabs: Record<string, ApplicationV2.Tab>;
    tabClasses: string;
    tab?: ApplicationV2.Tab | undefined;

    /**
     * @remarks Set to {@linkcode SceneConfig.defaultLevel | this.defaultLevel}`?.toObject() ?? {}` by
     * {@linkcode SceneConfig._preparePartContext | #_preparePartContext}
     */
    defaultLevel?: Level.Source | EmptyObject | undefined;

    levelLabel?: string | undefined;
    gridTypes?: Record<CONST.GRID_TYPES, string> | undefined;
    environmentFields?: Scene.Schema["environment"]["fields"] | undefined;

    // "basics" part
    ownerships?: { value: number; label: string }[] | undefined;
    background?: { color: FieldPreview; src: FieldPreview } | undefined;
    weatherTypes?: Record<string, string> | undefined;

    // "grid" part
    pixelsLabel?: string | undefined;
    minGrid?: number | undefined;
    gridStyles?: Record<string, string> | undefined;

    // "levels" part
    initialLevel?: string | null | undefined;
    levels?: LevelListEntry[] | undefined;

    // "visibility" part
    globalLight?: Scene.Source["environment"]["globalLight"] | undefined;
    fogFields?: Scene.Schema["fog"]["fields"] | undefined;
    fogExplorationModes?: Record<CONST.FOG_EXPLORATION_MODES, string> | undefined;
    fog?: { overlay: FieldPreview } | undefined;

    // "environment" part
    baseFields?: Scene.Schema["environment"]["fields"]["base"]["fields"] | undefined;
    darkFields?: Scene.Schema["environment"]["fields"]["dark"]["fields"] | undefined;
    baseHueDisabled?: boolean | undefined;
    darkHueDisabled?: boolean | undefined;

    // "misc" part
    pages?: Record<string, string> | undefined;
    sounds?: Record<string, string> | undefined;

    /**
     * @remarks TODO: Typed loosely because fvtt-types
     * doesn't yet type the v14 `transition` schema field on `Scene` or `CONFIG.Canvas.sceneTransitions`.
     */
    transitionTypes?: Record<string, string> | undefined;

    // "footer" part
    buttons?: ApplicationV2.FormFooterButton[] | undefined;
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Scene.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {
    /**
     * @remarks Narrowed from {@linkcode DocumentSheetV2.RenderOptions.renderData | the base `renderData`}; consumed by
     * {@linkcode SceneConfig._configureRenderOptions | #_configureRenderOptions}, which checks each entry's `_id`
     * (or, if a bare string, the entry itself) against {@linkcode SceneConfig.defaultLevel | #defaultLevel}'s id.
     */
    renderData: (string | { _id: string })[];
  }
}

declare abstract class AnySceneConfig extends SceneConfig<
  SceneConfig.RenderContext,
  SceneConfig.Configuration,
  SceneConfig.RenderOptions
> {
  constructor(...args: never);
}

export default SceneConfig;
