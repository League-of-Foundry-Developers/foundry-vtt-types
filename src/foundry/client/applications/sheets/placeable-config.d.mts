import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type CanvasDocumentMixin from "#client/documents/abstract/canvas-document.d.mts";
import type { MultiSelectInputConfig, MultiSelectInputReturn } from "../forms/fields.d.mts";

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
  Document extends CanvasDocumentMixin.AnyMixed = CanvasDocumentMixin.AnyMixed,
  RenderContext extends PlaceableConfig.RenderContext<Document> = PlaceableConfig.RenderContext<Document>,
  Configuration extends PlaceableConfig.Configuration<Document> = PlaceableConfig.Configuration<Document>,
  RenderOptions extends PlaceableConfig.RenderOptions = PlaceableConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<Document, RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   preview: true
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: PlaceableConfig.DefaultOptions;

  /**
   * The preview of this config.
   */
  protected _preview: Document | null;

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
   * @remarks Default parameter value is `{}`
   */
  protected _createPreview(data?: object): Promise<Document>;

  /**
   * Destroy the preview.
   */
  protected _destroyPreview(): void;

  /**
   * Preview changes.
   * @param changes - The changes to preview.
   */
  protected _previewChanges(changes: object): void;

  /**
   * Reset the preview.
   */
  protected _resetPreview(): void;

  /**
   * @privateRemarks Prevents duck typing
   */
  #PlaceableConfig: true;
}

declare namespace PlaceableConfig {
  interface Any extends AnyPlaceableConfig {}
  interface AnyConstructor extends Identity<typeof AnyPlaceableConfig> {}

  interface RenderContext<Document extends CanvasDocumentMixin.AnyMixed = CanvasDocumentMixin.AnyMixed>
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Document> {
    /**
     * @remarks This is the {@linkcode PlaceableConfig._preview | preview} document, not the persisted document.
     */
    document: Document;

    /**
     * @remarks Same value as {@linkcode document}.
     */
    model: Document;

    gridUnits: string;

    selectableLevels: { value: string; label: string }[];

    inputs: {
      createMultiSelectInput: <Config extends MultiSelectInputConfig>(
        field: unknown,
        config: Config,
      ) => MultiSelectInputReturn<Config>;
    };
  }

  interface Configuration<Document extends CanvasDocumentMixin.AnyMixed = CanvasDocumentMixin.AnyMixed>
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Document> {
    /**
     * Whether to display a real-time preview of changes to the placeable on the canvas.
     * @defaultValue `true`
     */
    preview: boolean;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<Document extends CanvasDocumentMixin.AnyMixed = CanvasDocumentMixin.AnyMixed> = DeepPartial<
    Configuration<Document>
  > &
    object & {
      /**
       * @deprecated Setting `document` in `PlaceableConfig.DEFAULT_OPTIONS` is not supported. If you
       * have a need for this, please file an issue.
       */
      document?: never;
    };

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyPlaceableConfig extends PlaceableConfig<
  CanvasDocumentMixin.AnyMixed,
  PlaceableConfig.RenderContext,
  PlaceableConfig.Configuration,
  PlaceableConfig.RenderOptions
> {
  constructor(...args: never);
}

export default PlaceableConfig;
