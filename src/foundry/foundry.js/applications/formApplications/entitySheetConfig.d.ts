import type { DocumentConstructor } from '../../../../types/helperTypes';

declare global {
  /**
   * Entity Sheet Configuration Application
   * @typeParam Options          - The type of the options object
   * @typeParam Data             - The data structure used to render the handlebars template.
   * @typeParam ConcreteDocument - The type of the Document which is being managed
   */
  class EntitySheetConfig<
    Options extends FormApplication.Options = FormApplication.Options,
    Data extends object = EntitySheetConfig.Data<foundry.abstract.Document<any, any>, Options>,
    ConcreteDocument extends foundry.abstract.Document<any, any> = Data extends EntitySheetConfig.Data<infer T>
      ? T
      : foundry.abstract.Document<any, any>
  > extends FormApplication<Options, Data, ConcreteDocument> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "sheet-config",
     *   template: "templates/sheets/sheet-config.html",
     *   width: 400,
     * })
     * ```
     */
    static get defaultOptions(): FormApplication.Options;

    /**
     * An array of pending sheet assignments which are submitted before other elements of the framework are ready.
     * @internal
     */
    static _pending: Array<EntitySheetConfig.SheetAssignment>;

    /** @override */
    get title(): string;

    /** @override */
    getData(options?: Partial<Options>): Data | Promise<Data>;

    /** @override */
    protected _updateObject(event: Event, formData: EntitySheetConfig.FormData): Promise<void>;

    /**
     * Initialize the configured Sheet preferences for Entities which support dynamic Sheet assignment
     * Create the configuration structure for supported entities
     * Process any pending sheet registrations
     * Update the default values from settings data
     */
    static initializeSheets(): void;

    /**
     * @internal
     */
    protected static _getDocumentTypes(cls: DocumentConstructor, types?: string[]): string[];

    /**
     * Register a sheet class as a candidate which can be used to display entities of a given type
     * @param documentClass - The Document class for which to register a new Sheet option
     * @param scope         - Provide a unique namespace scope for this sheet
     * @param sheetClass    - A defined Application class used to render the sheet
     * @param options       - Additional options used for sheet registration
     */
    static registerSheet(
      documentClass: DocumentConstructor,
      scope: string,
      sheetClass: ConstructorOf<Application>,
      { label, types, makeDefault }?: EntitySheetConfig.RegisterSheetOptions
    ): void;

    /**
     * Perform the sheet registration
     * @internal
     */
    protected static _registerSheet({
      documentClass,
      id,
      label,
      sheetClass,
      types,
      makeDefault
    }: Omit<EntitySheetConfig.SheetRegistration, 'action'>): void;

    /**
     * Unregister a sheet class, removing it from the list of available Applications to use for a Document type
     * @param documentClass - The Document class for which to register a new Sheet option
     * @param scope         - Provide a unique namespace scope for this sheet
     * @param sheetClass    - A defined Application class used to render the sheet
     * @param types         - An Array of types for which this sheet should be removed
     */
    static unregisterSheet(
      documentClass: DocumentConstructor,
      scope: string,
      sheetClass: ConstructorOf<Application>,
      { types }?: { types?: string[] }
    ): void;

    /**
     * Perform the sheet de-registration
     * @internal
     */
    protected static _unregisterSheet({
      documentClass,
      id,
      types
    }: Omit<EntitySheetConfig.SheetUnregistration, 'action'>): void;

    /**
     * Update the currently default Sheets using a new core world setting
     */
    static updateDefaultSheets(setting?: Record<'Actor' | 'Item', Record<string, string>>): void;
  }

  namespace EntitySheetConfig {
    type SheetRegistration = {
      action: 'register';
      documentClass: DocumentConstructor;
      id: string;
      label: string;
      sheetClass: ConstructorOf<Application>;
      types: string[];
      makeDefault: boolean;
    };

    type SheetUnregistration = {
      action: 'unregister';
      documentClass: DocumentConstructor;
      id: string;
      types: string[];
    };

    type SheetAssignment = SheetRegistration | SheetUnregistration;

    /**
     * @typeParam ConcreteDocument - The type of the Document which is being managed
     * @typeParam Options          - The type of the options object
     */
    interface Data<
      ConcreteDocument extends foundry.abstract.Document<any, any>,
      Options extends FormApplication.Options = FormApplication.Options
    > {
      isGM: boolean;
      object: foundry.utils.Duplicated<ConcreteDocument['data']>;
      options: Options;
      sheetClass: string;
      sheetClasses: Record<string, string>;
      defaultClass: string;
      blankLabel: string;
    }

    interface FormData {
      defaultClass: string;
      sheetClass: string;
    }

    interface RegisterSheetOptions {
      /** A human readable label for the sheet name, which will be localized */
      label?: string;

      /** An array of entity types for which this sheet should be used */
      types?: string[];

      /**
       * Whether to make this sheet the default for provided types
       * @defaultValue `false`
       */
      makeDefault?: boolean;
    }
  }
}
