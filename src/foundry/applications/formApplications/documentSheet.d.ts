/**
 * Extend the FormApplication pattern to incorporate specific logic for viewing or editing Document instances.
 * See the FormApplication documentation for more complete description of this interface.
 * @typeParam P - the type of the options object
 * @typeParam D - The data structure used to render the handlebars template.
 * @typeParam O - the type of the Document which should be managed by this form sheet
 */
declare abstract class DocumentSheet<
  P extends DocumentSheet.Options = DocumentSheet.Options,
  D extends object = DocumentSheet.Data<Entity>,
  O extends Entity<any, any> = D extends DocumentSheet.Data<infer T> ? T : Entity
> extends FormApplication<P, D, O> {
  /**
   * @param object  - An Entity which should be managed by this form sheet.
   * @param options - Optional configuration parameters for how the form behaves.
   */
  constructor(object: O, options?: Partial<P>);

  /**
   * {@inheritdoc}
   *
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
   * @deprecated since 0.8.0
   */
  get entity(): O;

  /**
   * @override
   */
  get isEditable(): boolean;

  /**
   * @override
   */
  render(force?: boolean, options?: Application.RenderOptions): this;

  /**
   * Default data preparation logic for the entity sheet
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): D | Promise<D>;

  /**
   * @override
   */
  protected _getHeaderButtons(): Application.HeaderButton[];

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject(event: Event, formData: object): Promise<O>;
}

declare namespace DocumentSheet {
  /**
   * @typeParam D - the type of the data in the Entity
   * @typeParam O - the type of the Entity which should be managed by this form sheet
   */
  interface Data<O extends Entity<any, any> = Entity<any, any>> {
    cssClass: string;
    editable: boolean;
    document: foundry.utils.Duplicated<O['data']>;
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
