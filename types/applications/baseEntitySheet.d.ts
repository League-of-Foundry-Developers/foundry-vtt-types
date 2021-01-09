/**
 * A simple implementation of the FormApplication pattern which is specialized in editing Entity instances
 */
declare class BaseEntitySheet<
  DataType = any,
  EntityType extends Entity<DataType> = any
> extends FormApplication {
  constructor (...args: any)

  /**
   * A convenience accessor for the object property of the inherited FormApplication instance
   */
  get entity (): EntityType

  /**
   * The BaseEntitySheet requires that the form itself be editable as well as the entity be owned
   */
  get isEditable (): boolean

  /**
   * Assign the default options which are supported by the entity edit sheet
   */
  static get defaultOptions (): any

  /**
   * The displayed window title for the sheet - the entity name by default
   */
  get title (): string

  /**
   * @param event - (unused)
   * @override
   */
  _updateObject (
    event: Event,
    formData: any
  ): Promise<Entity>

  /**
   * Default data preparation logic for the entity sheet
   * @param options - (unused)
   * @override
   */
  getData (options?: any): BaseEntitySheet.Data
}

declare namespace BaseEntitySheet {
  interface Data<DataType = any> extends FormApplication.Data<object> {
    cssClass: string
    editable: boolean
    entity: EntityData<DataType>
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
}
