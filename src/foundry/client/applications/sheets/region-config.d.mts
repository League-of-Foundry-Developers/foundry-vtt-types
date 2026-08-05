import type { DeepPartial, Identity, IntentionalPartial } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type PlaceableConfig from "./placeable-config.d.mts";
import type ShapeConfig from "../apps/shape-config.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";

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
  static override DEFAULT_OPTIONS: PlaceableConfig.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

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
  ): DocumentSheetV2.SubmitData<RegionDocument.Implementation>;

  protected override _previewChanges(changes: DocumentSheetV2.SubmitData<RegionDocument.Implementation>): void;

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

  #RegionConfig: true;
}

declare namespace RegionConfig {
  interface Any extends AnyRegionConfig {}
  interface AnyConstructor extends Identity<typeof AnyRegionConfig> {}

  /**
   * @remarks Every added member comes from
   * {@linkcode RegionConfig._preparePartContext | #_preparePartContext}, which only sets the members the
   * part being rendered consumes, so they are all `IntentionalPartial`ed.
   */
  interface RenderContext
    extends PlaceableConfig.RenderContext<RegionDocument.Implementation>, IntentionalPartial<PreparePartContext> {}

  /** @remarks Added by {@linkcode RegionConfig._preparePartContext | #_preparePartContext} */
  interface PreparePartContext {
    /** @remarks Added for the `tabs` part. */
    tabClasses: string;

    /** @remarks Added for the `footer` part. */
    buttons: ApplicationV2.FormFooterButton[];

    /**
     * @remarks Added for the `behaviors` part; the Region's visible behaviors, enabled first and then sorted
     * by name.
     */
    behaviors: BehaviorContext[];

    /** @remarks Added for the `behaviors` part. */
    canCreateBehavior: boolean;

    /** @remarks Added for the `appearance` part. */
    visibilities: VisibilityChoice[];

    /**
     * @remarks Added for the `shapes` part, and only when the Region has exactly one shape. Prepared by
     * {@linkcode ShapeConfig._prepareShapeContext} with the shape's `hole` field removed.
     */
    shapeContext: ShapeConfig.BaseShapeContext;

    /**
     * @remarks Added for the `placement` part; the parent Scene's Tokens the current User owns, sorted by
     * label.
     */
    attachableTokens: TokenChoice[];

    /** @remarks Added for the `placement` part; sorted by label. */
    restrictionTypes: RestrictionTypeChoice[];

    /** @remarks Only added when the part being rendered is also a tab of the `sheet` group. */
    tab: ApplicationV2.Tab;
  }

  /** An entry of {@linkcode PreparePartContext.behaviors}. */
  interface BehaviorContext {
    id: string;

    name: string;

    typeLabel: string;

    /** @remarks Falls back to `"fa-regular fa-notdef"` when the behavior's type has no configured icon. */
    typeIcon: string;

    disabled: boolean;

    canUpdate: boolean;

    canDelete: boolean;
  }

  /** An entry of {@linkcode PreparePartContext.visibilities}. */
  interface VisibilityChoice {
    value: CONST.REGION_VISIBILITY;

    label: string;
  }

  /** An entry of {@linkcode PreparePartContext.attachableTokens}. */
  interface TokenChoice {
    value: string;

    label: string;
  }

  /** An entry of {@linkcode PreparePartContext.restrictionTypes}. */
  interface RestrictionTypeChoice {
    value: CONST.EDGE_RESTRICTION_TYPES;

    label: string;
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
