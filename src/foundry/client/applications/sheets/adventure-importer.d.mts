import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

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

  /**
   * @defaultValue
   * ```js
   * {
   *   body: {template: "templates/adventure/importer.hbs"},
   *   footer: {template: "templates/generic/form-footer.hbs"}
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * A convenience alias for AdventureImporter#document
   * @remarks The fully-loaded Adventure once it has been retrieved from its compendium pack, otherwise the
   * shallow index-backed document this sheet was constructed with.
   */
  get adventure(): Adventure.Implementation;

  /**
   * @remarks We don't care for the purposes of import whether the compendium pack is locked.
   */
  override get isEditable(): boolean;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Prepare import options schema.
   * Options are rendered using the DataField#toInput method.
   */
  protected _prepareImportOptionsSchema(options: Adventure.ImportOptions): SchemaField.Any | undefined;

  /**
   * Prepare a list of content types provided by this adventure.
   */
  protected _getContentList(): AdventureImporterV2.ContentListEntry[];

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Configure how adventures that use this sheet class are imported.
   * This can be implemented by subclasses to implement custom import workflows.
   * @internal
   */
  _configureImport(importOptions: Adventure.ImportOptions): Promise<void>;

  /**
   * Configure how adventures that use this sheet class are imported.
   * This can be implemented by subclasses to implement custom import workflows.
   * @internal
   */
  _preImport(importData: Adventure.ImportData, importOptions: Adventure.ImportOptions): Promise<void>;

  /**
   * Configure how adventures that use this sheet class are imported.
   * This can be implemented by subclasses to implement custom import workflows.
   * @internal
   */
  _onImport(importResult: Adventure.ImportResult, importOptions: Adventure.ImportOptions): Promise<void>;

  /**
   * @remarks Unlike parent document sheets, the form data here is arbitrary, so the returned data is the
   * import options rather than an Adventure update.
   */
  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    updateData?: DocumentSheetV2.SubmitData<Adventure.Implementation>,
  ): DocumentSheetV2.SubmitData<Adventure.Implementation>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * Handle toggling the import all checkbox.
   * @param event - The change event.
   */
  protected _onToggleImportAll(event: Event): void;

  /**
   * @remarks Always resolves to an empty object; the Adventure is imported rather than updated.
   */
  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: DocumentSheetV2.SubmitData<Adventure.Implementation>,
    options?: DocumentSheetV2.ProcessSubmitOptions<Adventure.Implementation>,
  ): Promise<DocumentSheetV2.SubmitResult<Adventure.Implementation>>;

  #AdventureImporterV2: true;
}

declare namespace AdventureImporterV2 {
  interface Any extends AnyAdventureImporterV2 {}
  interface AnyConstructor extends Identity<typeof AnyAdventureImporterV2> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Adventure.Implementation> {
    /** @remarks The same value as {@linkcode AdventureImporterV2.adventure | #adventure}. */
    adventure: Adventure.Implementation;

    /** @remarks The Adventure's enriched description. */
    description: string;

    /** @remarks `true` until the full Adventure has been loaded from its compendium pack. */
    loading: boolean;

    /** @remarks Empty while {@linkcode RenderContext.loading | loading}. */
    contents: ContentListEntry[];

    /** @remarks Whether this Adventure has already been imported into the World. */
    imported: boolean;

    /**
     * @remarks The value of
     * {@linkcode AdventureImporterV2._prepareImportOptionsSchema | #_prepareImportOptionsSchema}, which core
     * leaves `undefined`.
     */
    optionsSchema: SchemaField.Any | undefined;

    buttons: ApplicationV2.FormFooterButton[];
  }

  /**
   * An entry of {@linkcode AdventureImporterV2._getContentList | #_getContentList}, describing one content
   * type the Adventure provides.
   */
  interface ContentListEntry {
    icon: string;

    label: string;

    count: number;

    /** @remarks The {@linkcode Adventure.contentFields} key this entry was built from. */
    field: string;
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
