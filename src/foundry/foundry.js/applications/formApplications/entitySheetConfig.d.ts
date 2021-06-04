// TODO: Remove when updating this class!!!
// eslint-disable-next-line
// @ts-nocheck

/**
 * Entity Sheet Configuration Application
 * @typeParam P - the type of the options object
 * @typeParam E - the type of the Entity, this sheet is used to configure
 */
declare class EntitySheetConfig<
  P extends FormApplication.Options = FormApplication.Options,
  E extends Entity = Entity
> extends FormApplication<P, EntitySheetConfig.Data, E> {
  /**
   * @param entity  - The Entity object for which the sheet is being configured
   * @param options - Additional Application options
   */
  constructor(entity: E, options?: Partial<P>);

  /**
   * @defaultValue
   * ```typescript
   * const options = super.defaultOptions;
   * options.id = "sheet-config";
   * options.template = "templates/sheets/sheet-config.html";
   * options.width = 400;
   * ```
   */
  static get defaultOptions(): typeof FormApplication['defaultOptions'];

  /**
   * Add the Entity name into the window title
   */
  get title(): string;

  /**
   * Construct and return the data object used to render the HTML template for this form application.
   * @param options - (unused)
   */
  getData(options?: Application.RenderOptions): EntitySheetConfig.Data<E>;

  /**
   * This method is called upon form submission after form data is validated
   * @param event    - The initial triggering submission event
   * @param formData - The object of validated form data with which to update the object
   */
  protected _updateObject(event: Event, formData: EntitySheetConfig.FormData): Promise<void>;

  /**
   * Initialize the configured Sheet preferences for Entities which support dynamic Sheet assignment
   * Create the configuration structure for supported entities
   * Process any pending sheet registrations
   * Update the default values from settings data
   */
  static initializeSheets(): void;

  /**
   * Register a sheet class as a candidate which can be used to display entities of a given type
   * @param entityClass - The Entity for which to register a new Sheet option
   * @param scope       - Provide a unique namespace scope for this sheet
   * @param sheetClass  - A defined Application class used to render the sheet
   * @param label       - A human readable label for the sheet name, which will be localized
   * @param types       - An array of entity types for which this sheet should be used
   *                      (default: `[]`)
   * @param makeDefault - Whether to make this sheet the default for provided types
   *                      (default: `false`)
   */
  static registerSheet(
    entityClass: ConstructorOf<Entity>,
    scope: string,
    sheetClass: ConstructorOf<FormApplication>,
    { label, types, makeDefault }?: { label?: string; types?: string[]; makeDefault?: boolean }
  ): void;

  protected static _registerSheet({
    entityClass,
    id,
    label,
    sheetClass,
    types,
    makeDefault
  }: Exclude<EntitySheetConfig.Config, 'action'>): void;

  /**
   * Unregister a sheet class, removing it from the list of available Applications to use for an Entity type
   * @param entityClass - The Entity for which to register a new Sheet option
   * @param scope       - Provide a unique namespace scope for this sheet
   * @param sheetClass  - A defined Application class used to render the sheet
   * @param types       - An Array of types for which this sheet should be removed
   */
  static unregisterSheet(
    entityClass: ConstructorOf<Entity>,
    scope: string,
    sheetClass: ConstructorOf<FormApplication>,
    { types }?: { types?: string[] }
  ): void;

  protected static _unregisterSheet({
    entityClass,
    id,
    types
  }: Pick<EntitySheetConfig.Config, 'entityClass' | 'id' | 'types'>): void;

  /**
   * @typeParam T - the string array, passed as the types parameter
   */
  protected static _getEntityTypes<T extends string[]>(entityClass: any, types: T): T;
  protected static _getEntityTypes(entityClass: ConstructorOf<Entity>): string[];

  /**
   * Update the currently default Sheets using a new core world setting
   */
  protected static _updateDefaultSheets(setting?: Record<'Actor' | 'Item', Record<string, string>>): void;

  protected _pending: EntitySheetConfig.Config[];
}

declare namespace EntitySheetConfig {
  interface Config {
    action: 'register' | 'unregister';
    entityClass: ConstructorOf<Entity>;
    id: string;
    label: string;
    sheetClass: ConstructorOf<FormApplication>;
    types: string[];
    makeDefault: boolean;
  }

  /**
   * @typeParam P - the type of the options object
   * @typeParam E - the type of the entity
   */
  interface Data<E extends Entity = Entity, P extends FormApplication.Options = FormApplication.Options> {
    entityName: EntitySheetConfig<P, E>['object']['entity'];
    isGM: User['isGM'];
    object: foundry.utils.Duplicated<EntitySheetConfig<P, E>['object']['data']>;
    options: EntitySheetConfig<P, E>['options'];
    sheetClass: ReturnType<E['getFlag']> | '';
    sheetClasses: Record<SheetClass['id'], SheetClass['label']>;
    defaultClass: SheetClass['id'] | null;
    blankLabel: ReturnType<Localization['localize']>;
  }

  type FormData = Pick<Data, 'defaultClass' | 'sheetClass'>;

  interface SheetClass {
    id: string | number;
    cls?: ConstructorOf<FormApplication>;
    label: string;
    default: boolean;
  }

  type SheetClasses = Record<string, Record<string, SheetClass>>;
}
