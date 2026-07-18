import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AdventureImporterV2: AdventureImporterV2.Any;
    }
  }
}

/**
 * This Document Sheet is responsible for rendering an Adventure and providing an interface to import it.
 */
declare class AdventureImporterV2<
  RenderContext extends AdventureImporterV2.RenderContext = AdventureImporterV2.RenderContext,
  Configuration extends AdventureImporterV2.Configuration = AdventureImporterV2.Configuration,
  RenderOptions extends AdventureImporterV2.RenderOptions = AdventureImporterV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Adventure.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["adventure-importer"],
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-download"
   *   },
   *   position: {width: 920},
   *   form: {
   *     closeOnSubmit: true
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * A convenience alias for AdventureImporter#document
   */
  get adventure(): Adventure.Implementation;

  override get isEditable(): boolean;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Prepare import options schema.
   * Options are rendered using the DataField#toInput method.
   * @param options - The import options
   */
  protected _prepareImportOptionsSchema(
    options: Adventure.ImportOptions,
  ): foundry.data.fields.SchemaField.Any | undefined;

  /**
   * Prepare a list of content types provided by this adventure.
   */
  protected _getContentList(): AdventureImporterV2.ContentListEntry[];

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Configure how adventures that use this sheet class are imported.
   * This can be implemented by subclasses to implement custom import workflows.
   * @remarks Core's implementation is a no-op.
   */
  protected _configureImport(importOptions: Adventure.ImportOptions): Promise<void>;

  /**
   * Configure how adventures that use this sheet class are imported.
   * This can be implemented by subclasses to implement custom import workflows.
   * @remarks Core's implementation is a no-op.
   */
  protected _preImport(importData: Adventure.ImportData, importOptions: Adventure.ImportOptions): Promise<void>;

  /**
   * Configure how adventures that use this sheet class are imported.
   * This can be implemented by subclasses to implement custom import workflows.
   * @remarks Core's implementation is a no-op.
   */
  protected _onImport(importResult: Adventure.ImportResult, importOptions: Adventure.ImportOptions): Promise<void>;

  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    updateData?: unknown,
  ): object;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * Handle toggling the import all checkbox.
   * @param event - The change event.
   */
  protected _onToggleImportAll(event: Event): void;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: object,
    options?: unknown,
  ): Promise<foundry.applications.api.DocumentSheetV2.SubmitResult<Adventure.Implementation>>;
}

declare namespace AdventureImporterV2 {
  interface Any extends AnyAdventureImporterV2 {}
  interface AnyConstructor extends Identity<typeof AnyAdventureImporterV2> {}

  interface ContentListEntry {
    icon: string;
    label: string;
    count: number;
    field: string;
  }

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Adventure.Implementation> {
    adventure: Adventure.Implementation;
    description: string;
    loading: boolean;
    contents: ContentListEntry[];
    imported: boolean;
    optionsSchema: foundry.data.fields.SchemaField.Any | undefined;
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Adventure.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyAdventureImporterV2 extends AdventureImporterV2<
  AdventureImporterV2.RenderContext,
  AdventureImporterV2.Configuration,
  AdventureImporterV2.RenderOptions
> {
  constructor(...args: never);
}

export default AdventureImporterV2;
