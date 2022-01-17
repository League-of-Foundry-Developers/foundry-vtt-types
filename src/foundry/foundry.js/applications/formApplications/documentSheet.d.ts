import { ToObjectFalseType } from '../../../../types/helperTypes';

declare global {
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
    Options extends DocumentSheet.Options = DocumentSheet.Options,
    Data extends object = DocumentSheet.Data,
    ConcreteDocument extends foundry.abstract.Document<any, any> = Data extends DocumentSheet.Data<infer T>
      ? T
      : foundry.abstract.Document<any, any>
  > extends FormApplication<Options, Data, ConcreteDocument> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ['sheet'],
     *   template: `templates/sheets/${this.name.toLowerCase()}.html`,
     *   viewPermission: CONST.ENTITY_PERMISSIONS.LIMITED
     * });
     * ```
     */
    static get defaultOptions(): DocumentSheet.Options;

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
     * @param event - (unused)
     * @override
     */
    protected _updateObject(event: Event, formData: object): Promise<unknown>;

    /**
     * @deprecated since 0.8.0
     */
    get entity(): ConcreteDocument;
  }

  namespace DocumentSheet {
    /**
     * @typeParam ConcreteDocument - the type of the {@link foundry.abstract.Document} which should be managed by this form sheet
     * @typeParam Options          - the type of the options object
     */
    interface Data<
      ConcreteDocument extends foundry.abstract.Document<any, any> = foundry.abstract.Document<any, any>,
      Options extends DocumentSheet.Options = DocumentSheet.Options
    > {
      cssClass: string;
      editable: boolean;
      document: ConcreteDocument;
      data: ToObjectFalseType<ConcreteDocument>;
      limited: boolean;
      options: Options;
      owner: boolean;
      title: string;
      readonly entity: this['data'];
    }

    interface Options extends FormApplicationOptions {
      /**
       * @defaultValue `['sheet']`
       */
      classes: string[];

      /**
       * @defaultValue
       * ```javascript
       * `templates/sheets/${this.name.toLowerCase()}.html`
       * ```
       */
      template: string;

      /**
       * @defaultValue {@link ENTITY_PERMISSIONS.LIMITED}
       */
      viewPermission: foundry.CONST.DOCUMENT_PERMISSION_LEVELS;
    }
  }
}
