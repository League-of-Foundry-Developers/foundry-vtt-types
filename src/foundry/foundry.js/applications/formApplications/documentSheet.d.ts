import { Document } from '../../../common/abstract/module.mjs';

declare global {
  /**
   * Extend the FormApplication pattern to incorporate specific logic for viewing or editing Document instances.
   * See the FormApplication documentation for more complete description of this interface.
   * @typeParam P - the type of the options object
   * @typeParam D - The data structure used to render the handlebars template.
   * @typeParam O - the type of the Document which should be managed by this form sheet
   */
  abstract class DocumentSheet<
    P extends DocumentSheet.Options = DocumentSheet.Options,
    D extends DocumentSheet.Data = DocumentSheet.Data,
    O extends Document<any, any> = D extends DocumentSheet.Data<infer T> ? T : Document<any, any>
  > extends FormApplication<P, D, O> {
    /**
     * @param object  - A Document instance which should be managed by this form.
     * @param options - Optional configuration parameters for how the form behaves.
     *                  (default: `{}`)
     */
    constructor(object: O, options?: Partial<P>);

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
    get document(): O;

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
    getData(options?: Application.RenderOptions): D | Promise<D>;

    /**
     * @override
     */
    render(force?: boolean, options?: Application.RenderOptions): this;

    /**
     * @override
     */
    protected _getHeaderButtons(): Application.HeaderButton[];

    /**
     * @param event - (unused)
     * @override
     */
    protected _updateObject(event: Event, formData: object): Promise<O>;

    /**
     * @deprecated since 0.8.0
     */
    get entity(): O;
  }

  namespace DocumentSheet {
    /**
     * @typeParam D - the type of the data in the Entity
     * @typeParam O - the type of the Entity which should be managed by this form sheet
     */
    interface Data<O extends Document<any, any> = Document<any, any>> {
      cssClass: string;
      editable: boolean;
      document: O;
      data: ReturnType<O['toObject']>;
      limited: boolean;
      options: Options;
      owner: boolean;
      title: string;
    }

    interface Options extends FormApplication.Options {
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
      viewPermission: foundry.CONST.EntityPermission;
    }
  }
}
