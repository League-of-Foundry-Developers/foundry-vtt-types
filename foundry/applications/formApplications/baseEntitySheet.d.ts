/**
 * Extend the FormApplication pattern to incorporate specific logic for viewing or editing Entity instances.
 * See the FormApplication documentation for more complete description of this interface.
 * @typeParam P - the type of the options object
 * @typeParam D - The data structure used to render the handlebars template.
 * @typeParam O - the type of the Entity which should be managed by this form sheet
 */
declare class BaseEntitySheet<
  P extends BaseEntitySheet.Options = BaseEntitySheet.Options,
  D extends object = BaseEntitySheet.Data<Entity>,
  O extends Entity<any, any> = D extends BaseEntitySheet.Data<infer T> ? T : Entity
> extends FormApplication<P, D, O> {
  /**
   * @override
   */
  static get defaultOptions(): BaseEntitySheet.Options;

  /**
   * @param object  - An Entity which should be managed by this form sheet.
   * @param options - Optional configuration parameters for how the form behaves.
   */
  constructor(object: O, options?: Partial<P>);

  /**
   * A convenience accessor for the object property, which in the case of a BaseEntitySheet is an Entity instance.
   */
  get entity(): O;

  /**
   * @override
   */
  get isEditable(): boolean;

  /**
   * @override
   */
  get title(): string;

  /**
   * Default data preparation logic for the entity sheet
   * @param options - (unused)
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
}

declare namespace BaseEntitySheet {
  /**
   * @typeParam D - the type of the data in the Entity
   * @typeParam O - the type of the Entity which should be managed by this form sheet
   */
  interface Data<O extends Entity<any, any> = Entity<any, any>> {
    cssClass: string;
    editable: boolean;
    entity: Duplicated<O['data']>;
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
    viewPermission: Const.EntityPermission;
  }
}
