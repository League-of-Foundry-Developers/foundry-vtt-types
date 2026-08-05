import type { AnyObject, DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type { MultiSelectInputConfig, MultiSelectInputReturn } from "../forms/fields.d.mts";
import type { DataField } from "#common/data/fields.d.mts";

import Document = foundry.abstract.Document;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      PlaceableConfig: PlaceableConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a Placeable document within a parent Scene.
 */
declare class PlaceableConfig<
  ConcreteDocument extends Document.Any,
  RenderContext extends PlaceableConfig.RenderContext<ConcreteDocument> =
    PlaceableConfig.RenderContext<ConcreteDocument>,
  Configuration extends PlaceableConfig.Configuration<ConcreteDocument> =
    PlaceableConfig.Configuration<ConcreteDocument>,
  RenderOptions extends PlaceableConfig.RenderOptions = PlaceableConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<ConcreteDocument, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: PlaceableConfig.DefaultOptions;

  /**
   * The preview of this config.
   */
  protected _preview: ConcreteDocument | null;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _postRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _preClose(options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Initialize the preview.
   */
  protected _initializePreview(): Promise<void>;

  /**
   * Create the preview.
   * @param data - Additional data which overrides current document data at the time of creation
   */
  protected _createPreview(data?: AnyObject): Promise<ConcreteDocument>;

  /**
   * Destroy the preview.
   */
  protected _destroyPreview(): void;

  /**
   * Preview changes.
   * @param changes - The changes to preview.
   */
  protected _previewChanges(changes: DocumentSheetV2.SubmitData<ConcreteDocument>): void;

  /**
   * Reset the preview.
   */
  protected _resetPreview(): void;

  #PlaceableConfig: true;
}

declare namespace PlaceableConfig {
  interface Any extends AnyPlaceableConfig {}
  interface AnyConstructor extends Identity<typeof AnyPlaceableConfig> {}

  interface RenderContext<ConcreteDocument extends Document.Any>
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<ConcreteDocument> {
    /**
     * @remarks The preview document, not the sheet's own {@linkcode PlaceableConfig.document | #document}.
     */
    model: ConcreteDocument;

    /**
     * @remarks The parent Scene's grid units, falling back to the localization of `"MEASUREMENT.GridUnits"`.
     */
    gridUnits: string;

    selectableLevels: LevelChoice[];

    inputs: Inputs;
  }

  interface Configuration<
    ConcreteDocument extends Document.Any,
    PlaceableConfig extends PlaceableConfig.Any = PlaceableConfig.Any,
  >
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<ConcreteDocument, PlaceableConfig> {
    /**
     * Should changes to the form be previewed on the parent Scene's canvas?
     * @defaultValue `true`
     */
    preview: boolean;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<PlaceableConfig extends PlaceableConfig.Any = PlaceableConfig.Any> = DeepPartial<
    Omit<Configuration<Document.Any, PlaceableConfig>, "document">
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}

  /** An entry of {@linkcode RenderContext.selectableLevels}, describing one Level of the parent Scene. */
  interface LevelChoice {
    value: string;

    label: string;
  }

  interface Inputs {
    /**
     * @remarks The `field` parameter exists so this can be called as a Handlebars field helper; it is ignored.
     */
    createMultiSelectInput: <Config extends MultiSelectInputConfig>(
      field: DataField.Any,
      config: Config,
    ) => MultiSelectInputReturn<Config>;
  }
}

declare abstract class AnyPlaceableConfig extends PlaceableConfig<
  Document.Any,
  PlaceableConfig.RenderContext<Document.Any>,
  PlaceableConfig.Configuration<Document.Any>,
  PlaceableConfig.RenderOptions
> {
  constructor(...args: never);
}

export default PlaceableConfig;
