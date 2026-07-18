import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type PlaceableConfig from "./placeable-config.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";
import type ShapeConfig from "../apps/shape-config.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      RegionConfig: RegionConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Region document within a parent Scene.
 */
declare class RegionConfig<
  RenderContext extends RegionConfig.RenderContext = RegionConfig.RenderContext,
  Configuration extends RegionConfig.Configuration = RegionConfig.Configuration,
  RenderOptions extends RegionConfig.RenderOptions = RegionConfig.RenderOptions,
> extends PlaceableConfig<RegionDocument.Implementation, RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["region-config"],
   *   viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-regular fa-game-board"
   *   },
   *   position: { width: 500 },
   *   form: {
   *     closeOnSubmit: true
   *   },
   *   actions: {
   *     shapeCreateFromWalls: RegionConfig.#onShapeCreateFromWalls,
   *     shapeToggleHole: RegionConfig.#onShapeToggleHole,
   *     shapeMoveUp: RegionConfig.#onShapeMoveUp,
   *     shapeMoveDown: RegionConfig.#onShapeMoveDown,
   *     shapeEdit: RegionConfig.#onShapeEdit,
   *     shapeRemove: RegionConfig.#onShapeRemove,
   *     shapeRemoveAll: RegionConfig.#onShapeRemoveAll,
   *     behaviorCreate: RegionConfig.#onBehaviorAdd,
   *     behaviorDelete: RegionConfig.#onBehaviorDelete,
   *     behaviorEdit: RegionConfig.#onBehaviorEdit,
   *     behaviorToggle: RegionConfig.#onBehaviorToggle
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: PlaceableConfig.DefaultOptions<RegionDocument.Implementation>;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   sheet: {
   *     tabs: [
   *       { id: "appearance", icon: "fa-solid fa-paint-roller" },
   *       { id: "shapes", icon: "fa-solid fa-shapes" },
   *       { id: "placement", icon: "fa-solid fa-location-dot" },
   *       { id: "behaviors", icon: "fa-solid fa-child-reaching" }
   *     ],
   *     initial: "appearance",
   *     labelPrefix: "REGION.TABS"
   *   }
   * }
   * ```
   */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * Update the Levels select element.
   * @param event - An input change event within the form
   */
  protected _updateLevelsSelectElement(event?: Event): void;

  /**
   * Update the Is Restricted select element.
   * @param event - An input change event within the form
   */
  protected _updateRestrictionEnabledElement(event?: Event): void;

  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): object;

  protected override _previewChanges(changes: foundry.documents.BaseRegion.UpdateData): void;

  /**
   * Define whether a user is able to begin a dragstart workflow for a given drag selector.
   * @param selector - The candidate HTML selector for dragging
   * @returns Can the current user drag this selector?
   */
  protected _canDragStart(selector: string): boolean;

  /**
   * Define whether a user is able to conclude a drag-and-drop workflow for a given drop selector.
   * @param selector - The candidate HTML selector for the drop target
   * @returns Can the current user drop on this selector?
   */
  protected _canDragDrop(selector: string): boolean;

  /**
   * An event that occurs when a drag workflow begins.
   * @param event - The initiating drag start event
   */
  protected _onDragStart(event: DragEvent): Promise<void>;

  /**
   * An event that occurs when a drag workflow moves over a drop target.
   */
  protected _onDragOver(event: DragEvent): void;

  /**
   * An event that occurs when data is dropped into a drop target.
   */
  protected _onDrop(event: DragEvent): Promise<void>;

  #regionConfig: true;
}

declare namespace RegionConfig {
  interface Any extends AnyRegionConfig {}
  interface AnyConstructor extends Identity<typeof AnyRegionConfig> {}

  interface RenderContext extends PlaceableConfig.RenderContext<RegionDocument.Implementation> {
    tab?: ApplicationV2.Tab | undefined;
    tabClasses?: string | undefined;
    buttons?: ApplicationV2.FormFooterButton[] | undefined;
    behaviors?:
      | {
          id: string;
          name: string;
          typeLabel: string;
          typeIcon: string;
          disabled: boolean;
          canUpdate: boolean;
          canDelete: boolean;
        }[]
      | undefined;
    canCreateBehavior?: boolean | undefined;
    visibilities?: { value: CONST.REGION_VISIBILITY; label: string }[] | undefined;

    /** @remarks Added by {@linkcode ShapeConfig._prepareShapeContext | ShapeConfig#_prepareShapeContext} */
    shapeContext?: ShapeConfig.ShapeContext | undefined;
    attachableTokens?: { value: string; label: string }[] | undefined;
    restrictionTypes?: { value: CONST.EDGE_RESTRICTION_TYPES; label: string }[] | undefined;
  }

  interface Configuration extends PlaceableConfig.Configuration<RegionDocument.Implementation> {}

  interface RenderOptions extends PlaceableConfig.RenderOptions {}
}

declare abstract class AnyRegionConfig extends RegionConfig<
  RegionConfig.RenderContext,
  RegionConfig.Configuration,
  RegionConfig.RenderOptions
> {
  constructor(...args: never);
}

export default RegionConfig;
