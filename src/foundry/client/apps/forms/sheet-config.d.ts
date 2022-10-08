import type { DocumentConstructor, DocumentType } from "../../../../types/helperTypes";

declare global {
  /**
   * Document Sheet Configuration Application
   * @typeParam Options          - The type of the options object
   * @typeParam ConcreteDocument - The type of the Document which is being managed
   */
  class DocumentSheetConfig<
    Options extends FormApplicationOptions = FormApplicationOptions,
    ConcreteDocument extends foundry.abstract.Document<any, any> = foundry.abstract.Document<any, any>
  > extends FormApplication<Options, ConcreteDocument> {
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
    static #pending: Array<DocumentSheetConfig.SheetAssignment>;

    override get title(): string;

    override getData(options?: Partial<Options>): MaybePromise<object>;

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
      sheetClass: ConstructorOf<FormApplication<FormApplicationOptions, any>>,
      { label, types, makeDefault }?: DocumentSheetConfig.RegisterSheetOptions | undefined
    ): void;

    /**
     * Perform the sheet registration.
     * @param config - Configuration for how the sheet should be un-registered
     * @internal
     */
    static #registerSheet(config: Omit<DocumentSheetConfig.SheetRegistration, "action">): void;

    /**
     * Unregister a sheet class, removing it from the list of available Applications to use for a Document type
     * @param documentClass - The Document class for which to register a new Sheet option
     * @param scope         - Provide a unique namespace scope for this sheet
     * @param sheetClass    - A defined DocumentSheet subclass used to render the sheet
     * @param types         - An Array of types for which this sheet should be removed
     */
    static unregisterSheet(
      documentClass: DocumentConstructor,
      scope: string,
      sheetClass: ConstructorOf<FormApplication<FormApplicationOptions, any>>,
      { types }?: { types?: string[] }
    ): void;

    /**
     * Perform the sheet de-registration
     * @param config - Configuration for how the sheet should be un-registered
     * @internal
     */
    static #unregisterSheet(config: Omit<DocumentSheetConfig.SheetUnregistration, "action">): void;

    /**
     * Update the current default Sheets using a new core world setting.
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
      action: "register";

      /** The Document class being registered */
      documentClass: DocumentConstructor;

      /** The sheet ID being registered */
      id: string;

      /** The human-readable sheet label */
      label: string;

      /** The sheet class definition being registered */
      sheetClass: ConstructorOf<Application>;

      /** An array of types for which this sheet is added */
      types: string[];

      /** Make this sheet the default for provided types? */
      makeDefault: boolean;
    };

    type SheetUnregistration = {
      action: "unregister";

      /** The Document class being unregistered */
      documentClass: DocumentConstructor;

      /** The sheet ID being unregistered */
      id: string;

      /** An array of types for which this sheet is removed */
      types: string[];
    };

    type SheetAssignment = SheetRegistration | SheetUnregistration;

    interface FormData {
      defaultClass: string;
      sheetClass: string;
    }

    interface RegisterSheetOptions {
      /** A human-readable label for the sheet name, which will be localized */
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
}
