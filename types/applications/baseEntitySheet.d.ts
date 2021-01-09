/**
 * Extend the FormApplication pattern to incorporate specific logic for viewing
 * or editing Entity instances.
 * See the FormApplication documentation for more complete description of this
 * interface.
 * @typeParam D - the type of the data in the Entity
 * @typeParam E - the type of the Entity which should be managed by this form
 *                sheet
 */
declare class BaseEntitySheet
<D = object, E extends Entity<D> = Entity<D>> extends FormApplication {
  /**
   * @param object - An Entity which should be managed by this form sheet.
   * @param options - Optional configuration parameters for how the form
   *                  behaves.
   */
  constructor (object: E, options: BaseEntitySheet.Options)

  /**
   * @override
   */
  static get defaultOptions (): BaseEntitySheet.Options

  /**
   * A convenience accessor for the object property, which in the case of a
   * BaseEntitySheet is an Entity instance.
   */
  get entity (): E

  /**
   * @override
   */
  get isEditable (): boolean

  /**
   * @override
   */
  get title (): string

  /**
   * @override
   */
  _getHeaderButtons (): Application.HeaderButton[]

  /**
   * @param event - (unused)
   * @override
   */
  _updateObject (
    event: Event,
    formData: object
  ): Promise<E>

  /**
   * Default data preparation logic for the entity sheet
   * @param options - (unused)
   * @override
   */
  getData (options?: any): BaseEntitySheet.Data<D>

  /**
   * @override
   */
  render (force: boolean, options: Application.RenderOptions): this
}

declare namespace BaseEntitySheet {
  interface Data<D = object> extends FormApplication.Data<object> {
    cssClass: string
    editable: boolean
    entity: EntityData<D>
    limited: boolean

    /**
     * @remarks This property is not populated and only exists to make the
     *          typescript compile.
     */
    object: object

    options: any
    owner: boolean
    title: string
  }

  interface Options extends FormApplication.Options {
    /**
     * @defaultValue `['sheet']`
     */
    classes: string[]

    /**
     * @defaultValue
     * ```javascript
     * `templates/sheets/${this.name.toLowerCase()}.html`
     * ```
     */
    template: string

    /**
     * @defaultValue {@link ConstTypes.EntityPermissions.Limited}
     */
    viewPermission: ConstTypes.EntityPermissions
  }
}
