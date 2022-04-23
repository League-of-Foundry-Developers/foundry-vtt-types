import type { DocumentConstructor, DocumentType } from '../../../../types/helperTypes';

declare global {
  /**
   * Document Sheet Configuration Application
   * @typeParam Options          - The type of the options object
   * @typeParam Data             - The data structure used to render the handlebars template.
   * @typeParam ConcreteDocument - The type of the Document which is being managed
   */
  class DocumentSheetConfig<
    Options extends FormApplicationOptions = FormApplicationOptions,
    Data extends object = DocumentSheetConfig.Data<foundry.abstract.Document<any, any>, Options>,
    ConcreteDocument extends foundry.abstract.Document<any, any> = Data extends DocumentSheetConfig.Data<infer T>
      ? T
      : foundry.abstract.Document<any, any>
  > extends FormApplication<Options, Data, ConcreteDocument> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["form", "sheet-config"],
     *   template: "templates/sheets/sheet-config.html",
     *   width: 400
     * })
     * ```
     */
    static get defaultOptions(): FormApplicationOptions;

    /**
     * An array of pending sheet assignments which are submitted before other elements of the framework are ready.
     * @internal
     */
    protected static _pending: Array<DocumentSheetConfig.SheetAssignment>;

    override get title(): string;

    override getData(options?: Partial<Options>): Data | Promise<Data>;

    protected override _updateObject(event: Event, formData: DocumentSheetConfig.FormData): Promise<unknown>;

    /**
     * Initialize the configured Sheet preferences for Documents which support dynamic Sheet assignment
     * Create the configuration structure for supported documents
     * Process any pending sheet registrations
     * Update the default values from settings data
     */
    static initializeSheets(): void;

    /**
     * @internal
     */
    protected static _getDocumentTypes(cls: DocumentConstructor, types?: string[]): string[];

    /**
     * Register a sheet class as a candidate which can be used to display documents of a given type
     * @param documentClass - The Document class for which to register a new Sheet option
     * @param scope         - Provide a unique namespace scope for this sheet
     * @param sheetClass    - A defined Application class used to render the sheet
     * @param options       - Additional options used for sheet registration
     */
    static registerSheet(
      documentClass: DocumentConstructor,
      scope: string,
      sheetClass: ConstructorOf<FormApplication<FormApplicationOptions, any, any>>,
      { label, types, makeDefault }?: DocumentSheetConfig.RegisterSheetOptions | undefined
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
    }: Omit<DocumentSheetConfig.SheetRegistration, 'action'>): void;

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
      sheetClass: ConstructorOf<FormApplication<FormApplicationOptions, any, any>>,
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
    }: Omit<DocumentSheetConfig.SheetUnregistration, 'action'>): void;

    /**
     * Update the currently default Sheets using a new core world setting
     */
    static updateDefaultSheets(setting?: Record<DocumentType, Record<string, string>>): void;

    /**
     * Initialize default sheet configurations for all document types.
     * @internal
     */
    protected static _registerDefaultSheets(): void;
  }

  namespace DocumentSheetConfig {
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
      Options extends FormApplicationOptions = FormApplicationOptions
    > {
      isGM: boolean;
      object: ConcreteDocument['data']['_source'];
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

      /** An array of document types for which this sheet should be used */
      types?: string[];

      /**
       * Whether to make this sheet the default for provided types
       * @defaultValue `false`
       */
      makeDefault?: boolean;
    }
  }

  /**
   * @deprecated since v9
   */
  class EntitySheetConfig<
    Options extends FormApplicationOptions = FormApplicationOptions,
    Data extends object = DocumentSheetConfig.Data<foundry.abstract.Document<any, any>, Options>,
    ConcreteDocument extends foundry.abstract.Document<any, any> = Data extends DocumentSheetConfig.Data<infer T>
      ? T
      : foundry.abstract.Document<any, any>
  > extends DocumentSheetConfig<Options, Data, ConcreteDocument> {}
}
