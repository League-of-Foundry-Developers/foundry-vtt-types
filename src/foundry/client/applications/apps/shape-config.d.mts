import type { AnyMutableObject, DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type { FormInputConfig } from "../forms/fields.d.mts";
import type { BaseShapeData } from "#common/data/data.d.mts";
import type { DataField } from "#common/data/fields.d.mts";

import Document = foundry.abstract.Document;
import BaseGrid = foundry.grid.BaseGrid;

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
  /** @throws If the provided shape does not have a parent {@linkcode Document}. */
  constructor(options: ShapeConfig.InputOptions<Configuration>);

  static override DEFAULT_OPTIONS: ShapeConfig.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The shape that is configured by this application.
   */
  get shape(): BaseShapeData;

  /**
   * The Document whose shape is configured by this application.
   */
  get document(): Document.Any;

  override get title(): string;

  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  protected override _configureRenderParts(
    options: HandlebarsApplicationMixin.RenderOptions,
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
   * @throws If the parent Document's schema has neither a `shapes` nor a `shape` field.
   */
  protected _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    shapeData: AnyMutableObject,
    updateOptions?: Document.Database.UpdateOneDocumentOperationForName<Document.Type>,
  ): Promise<void>;

  /**
   * Process the shape form data.
   * @internal
   */
  static _processShapeData(shape: BaseShapeData, shapeData: AnyMutableObject): AnyMutableObject;

  /**
   * Prepare the shape context.
   * @internal
   */
  static _prepareShapeContext(context: AnyMutableObject, shape: BaseShapeData, fields: DataField.Any): void;

  /**
   * Handle changes to dimension input.
   * @internal
   */
  static _onChangeDimension(input: HTMLInputElement, grid: BaseGrid): void;

  #ShapeConfig: true;
}

declare namespace ShapeConfig {
  interface Any extends AnyShapeConfig {}
  interface AnyConstructor extends Identity<typeof AnyShapeConfig> {}

  /** The options accepted by the {@linkcode ShapeConfig} constructor; `shape` is required. */
  type InputOptions<Configuration extends ShapeConfig.Configuration> = DeepPartial<Omit<Configuration, "shape">> & {
    shape: Configuration["shape"];
  };

  /**
   * @remarks {@linkcode ShapeConfig._prepareContext | ShapeConfig#_prepareContext} runs the shared context
   * through {@linkcode ShapeConfig._prepareShapeContext}, so the render context carries those members too.
   */
  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext, ShapeContext {
    rootId: string;

    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration<ShapeConfig extends ShapeConfig.Any = ShapeConfig.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<ShapeConfig> {
    /** The shape being configured. Must belong to a parent {@linkcode Document}. */
    shape: BaseShapeData;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<ShapeConfig extends ShapeConfig.Any = ShapeConfig.Any> = DeepPartial<
    Omit<Configuration<ShapeConfig>, "shape">
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}

  /** @internal */
  interface _ShapeContext {
    shape: BaseShapeData;

    fields: DataField.Any;

    source: BaseShapeData["_source"];

    gridUnits: string;

    dimensionInput: (field: DataField.Any, inputConfig: DimensionInputConfig) => HTMLElement[];

    /** @remarks Only present for token shapes; maps a {@linkcode CONST.TOKEN_SHAPES} value to its label. */
    tokenShapes?: Record<CONST.TOKEN_SHAPES, string> | undefined;
  }

  /**
   * The context prepared by {@linkcode ShapeConfig._prepareShapeContext}, describing the shape currently
   * being edited.
   */
  interface ShapeContext extends _ShapeContext {
    /** @remarks Only present when the shape is an emanation. */
    baseContext?: BaseShapeContext | undefined;
  }

  /** The nested context describing an emanation's base shape. */
  interface BaseShapeContext extends _ShapeContext {
    rootId: string;
  }

  /** The input configuration passed to {@linkcode ShapeContext.dimensionInput}. */
  interface DimensionInputConfig extends FormInputConfig<number> {
    /** The grid the dimension is measured against. */
    grid: BaseGrid;

    /** The id prefix applied to the generated inputs. */
    rootId: string;
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
