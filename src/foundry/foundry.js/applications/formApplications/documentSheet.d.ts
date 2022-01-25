import { ToObjectFalseType } from '../../../../types/helperTypes';

declare global {
  interface DocumentSheetOptions extends FormApplicationOptions {
    /**
     * The default permissions required to view this Document sheet.
     * @defaultValue {@link CONST.DOCUMENT_PERMISSION_LEVELS.LIMITED}
     */
    viewPermission: foundry.CONST.DOCUMENT_PERMISSION_LEVELS;
  }

  /**
   * Extend the FormApplication pattern to incorporate specific logic for viewing or editing Document instances.
   * See the FormApplication documentation for more complete description of this interface.
   * @param object  - A Document instance which should be managed by this form.
   * @param options - Optional configuration parameters for how the form behaves.
   *                  (default: `{}`)
   *
   * @typeParam Options          - the type of the options object
   * @typeParam Data             - The data structure used to render the handlebars template.
   * @typeParam ConcreteDocument - the type of the Document which should be managed by this form sheet
   */
  abstract class DocumentSheet<
    Options extends DocumentSheetOptions = DocumentSheetOptions,
    Data extends object = DocumentSheet.Data,
    ConcreteDocument extends foundry.abstract.Document<any, any> = Data extends DocumentSheet.Data<infer T>
      ? T
      : foundry.abstract.Document<any, any>
  > extends FormApplication<Options, Data, ConcreteDocument> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["sheet"],
     *   template: `templates/sheets/${this.name.toLowerCase()}.html`,
     *   viewPermission: CONST.DOCUMENT_PERMISSION_LEVELS.LIMITED,
     *   sheetConfig: true
     * });
     * ```
     */
    static get defaultOptions(): DocumentSheetOptions;

    /**
     * A semantic convenience reference to the Document instance which is the target object for this form.
     */
    get document(): ConcreteDocument;

    /**
     * @override
     */
    get id(): string;

    /**
     * @override
     */
    get isEditable(): boolean;

    /**
     * @override
     */
    get title(): string;

    /**
     * @override
     */
    close(options?: FormApplication.CloseOptions): Promise<void>;

    /**
     * @override
     */
    getData(options?: Partial<Options>): Data | Promise<Data>;

    /**
     * @override
     */
    render(force?: boolean, options?: Application.RenderOptions<Options>): this;

    /**
     * @override
     */
    protected _getHeaderButtons(): Application.HeaderButton[];

    /**
     * Handle requests to configure the default sheet used by this Document
     * @internal
     */
    protected _onConfigureSheet(event: JQuery.ClickEvent): void;

    /**
     * @param event - (unused)
     * @override
     */
    protected _updateObject(event: Event, formData: object): Promise<unknown>;
  }

  namespace DocumentSheet {
    /**
     * @typeParam ConcreteDocument - the type of the {@link foundry.abstract.Document} which should be managed by this form sheet
     * @typeParam Options          - the type of the options object
     */
    interface Data<
      ConcreteDocument extends foundry.abstract.Document<any, any> = foundry.abstract.Document<any, any>,
      Options extends DocumentSheetOptions = DocumentSheetOptions
    > {
      cssClass: string;
      editable: boolean;
      document: ConcreteDocument;
      data: ToObjectFalseType<ConcreteDocument>;
      limited: boolean;
      options: Options;
      owner: boolean;
      title: string;
    }
  }
}
