import type { AnyObject, DeepPartial, Identity } from "#utils";
import type { DataField } from "#common/data/fields.d.mts";
import type { FormInputConfig } from "../forms/fields.d.mts";
import type { BaseShapeData } from "#common/data/data.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

import Document = foundry.abstract.Document;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ShapeConfig: ShapeConfig.Any;
    }
  }
}

/**
 * The configuration to edit a shape of a Document.
 */
declare class ShapeConfig<
  RenderContext extends ShapeConfig.RenderContext = ShapeConfig.RenderContext,
  Configuration extends ShapeConfig.Configuration = ShapeConfig.Configuration,
  RenderOptions extends ShapeConfig.RenderOptions = ShapeConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @remarks Throws if `options.shape.parent` is not a {@linkcode Document}.
   */
  constructor(options: DeepPartial<Configuration> & Pick<Configuration, "shape">);

  /**
   * @defaultValue
   * ```js
   * {
   *   id: "{id}",
   *   classes: ["shape-config"],
   *   tag: "form",
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-shapes"
   *   },
   *   position: { width: 480 },
   *   form: {
   *     handler: ShapeConfig.#onSubmitForm,
   *     closeOnSubmit: true
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: ShapeConfig.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   form: {
   *     templates: ["templates/apps/shape-config/parts/origin.hbs"]
   *   },
   *   footer: {
   *     template: "templates/generic/form-footer.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The shape that is configured by this application.
   */
  get shape(): ShapeConfig.Shape;

  /**
   * The Document whose shape is configured by this application.
   */
  get document(): Document.Any;

  get title(): string;

  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  protected override _configureRenderParts(
    options: RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * Submit a Document update request based on the processed form data.
   * @param event         - The originating form submission event
   * @param form          - The form element that was submitted
   * @param shapeData     - Processed and validated form data to be used for a document update
   * @param updateOptions - Additional options altering the request
   * @throws Subclasses that don't implement a `shapes` or `shape` schema field on their document must override
   * this method.
   */
  protected _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    shapeData: AnyObject,
    updateOptions?: unknown,
  ): Promise<void>;

  /**
   * Process the shape form data.
   * @param shape     - The shape being edited.
   * @param shapeData - The submitted shape data.
   * @remarks Foundry marks this `@internal`, but it is called externally by
   * {@linkcode foundry.applications.sheets.RegionConfig | RegionConfig}, which is not a subclass, so it must be
   * public here.
   */
  static _processShapeData(shape: ShapeConfig.Shape, shapeData: AnyObject): AnyObject;

  /**
   * Prepare the shape context.
   * @param context - The render context to populate.
   * @param shape   - The shape being edited.
   * @param fields  - The shape's schema fields.
   * @remarks Foundry marks this `@internal`, but it is called externally by
   * {@linkcode foundry.applications.sheets.RegionConfig | RegionConfig}, which is not a subclass, so it must be
   * public here.
   */
  static _prepareShapeContext(
    context: ShapeConfig.ShapeContext,
    shape: ShapeConfig.Shape,
    fields: Record<string, DataField.Any>,
  ): void;

  /**
   * Handle changes to dimension input.
   * @param input - The input element that changed.
   * @param grid  - The grid the shape is placed in.
   * @remarks Foundry marks this `@internal`, but it is called externally by
   * {@linkcode foundry.applications.sheets.RegionConfig | RegionConfig}, which is not a subclass, so it must be
   * public here.
   */
  static _onChangeDimension(input: HTMLInputElement, grid: ShapeConfig.GridInfo): void;

  #ShapeConfig: true;
}

declare namespace ShapeConfig {
  interface Any extends AnyShapeConfig {}
  interface AnyConstructor extends Identity<typeof AnyShapeConfig> {}

  /**
   * @remarks `BaseShapeData` itself does not have `grid`/`base` properties; these are added by the untyped
   * `ClientShapeDataMixin` in `client/data/shapes.mjs` (for `grid`) and are only present on `"emanation"`-type
   * shapes (for `base`).
   */
  interface Shape extends BaseShapeData {
    grid: GridInfo;
    base?: Shape | undefined;
  }

  interface GridInfo {
    size: number;
    distance: number;
    units: string;
    isGridless: boolean;
    isSquare: boolean;
  }

  interface Configuration extends ApplicationV2.Configuration {
    /**
     * The shape that is configured by this application.
     */
    shape: Shape;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> & object;

  interface RenderOptions extends ApplicationV2.RenderOptions, HandlebarsApplicationMixin.RenderOptions {}

  interface ShapeContext {
    shape?: Shape | undefined;
    fields?: Record<string, DataField.Any> | undefined;
    source?: AnyObject | undefined;
    gridUnits?: string | undefined;

    /**
     * A Handlebars helper used to render a linked pixels/grid-units dimension input pair.
     */
    dimensionInput?: ((field: DataField.Any, inputConfig: FormInputConfig) => HTMLElement[]) | undefined;

    /**
     * Present only when {@linkcode Shape.type | shape.type} is `"emanation"`.
     */
    baseContext?: (ShapeContext & { tokenShapes?: Record<string, string> | undefined }) | undefined;

    /**
     * Present only when {@linkcode Shape.type | shape.type} is `"token"`, or `"emanation"` with a `"token"` base.
     */
    tokenShapes?: Record<string, string> | undefined;
  }

  interface RenderContext extends ApplicationV2.RenderContext, HandlebarsApplicationMixin.RenderContext, ShapeContext {
    /** @remarks Added by {@linkcode ShapeConfig._prepareContext | #_prepareContext} */
    rootId?: string | undefined;

    /** @remarks Added by {@linkcode ShapeConfig._prepareContext | #_prepareContext} */
    buttons?: ApplicationV2.FormFooterButton[] | undefined;
  }
}

declare abstract class AnyShapeConfig extends ShapeConfig<
  ShapeConfig.RenderContext,
  ShapeConfig.Configuration,
  ShapeConfig.RenderOptions
> {
  constructor(...args: never);
}

export default ShapeConfig;
