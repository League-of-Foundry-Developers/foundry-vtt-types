/**
 * Entity Sheet Configuration Application
 *
 * @param entity - The Entity object for which the sheet is being configured
 * @param options - Additional Application options
 */
declare class EntitySheetConfig extends FormApplication {
  _updateObject(event?: Event, formData?: object): Promise<void>;
}
