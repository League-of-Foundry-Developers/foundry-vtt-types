import type { GetDataReturnType, MaybePromise } from "#utils";
import type { Document } from "#common/abstract/_module.d.mts";
import type ApplicationV2 from "#client-esm/applications/api/application.mjs";

declare global {
  /**
   * Document Sheet Configuration Application
   * @template Options          - The type of the options object
   * @template ConcreteDocument - The type of the Document which is being managed
   */
  class DocumentSheetConfig<
    ConcreteDocument extends foundry.abstract.Document.Any = foundry.abstract.Document.Any,
    Options extends FormApplication.Options = FormApplication.Options,
  > extends FormApplication<ConcreteDocument, Options> {
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
    static get defaultOptions(): FormApplication.Options;

    /**
     * An array of pending sheet assignments which are submitted before other elements of the framework are ready.
     * @internal
     */
    static #pending: Array<DocumentSheetConfig.SheetAssignment>;

    override get title(): string;

    override getData(
      options?: Partial<Options>,
    ): MaybePromise<GetDataReturnType<DocumentSheetConfig.DocumentSheetConfigData>>;

    protected override _updateObject(event: Event, formData: DocumentSheetConfig.FormData): Promise<unknown>;

    /**
     * Marshal information on the available sheet classes for a given document type and sub-type, and format it for
     * @param documentName - The Document type.
     * @param subType      - The Document sub-type. // TODO: Generic to specify string options?
     */
    static getSheetClassesForSubType(
      documentName: Document.Type,
      subType: string,
    ): DocumentSheetConfig.SheetClassesForSubType;

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
    protected static _getDocumentTypes(cls: Document.AnyConstructor, types?: string[]): string[];

    /**
     * Register a sheet class as a candidate which can be used to display documents of a given type
     * @param documentClass - The Document class for which to register a new Sheet option
     * @param scope         - Provide a unique namespace scope for this sheet
     * @param sheetClass    - A defined Application class used to render the sheet
     * @param config        - Additional options used for sheet registration
     */
    static registerSheet(
      documentClass: Document.AnyConstructor,
      scope: string,
      sheetClass: Application.AnyConstructor | ApplicationV2.AnyConstructor,
      config?: DocumentSheetConfig.RegisterSheetOptions,
    ): void;

    /**
     * Unregister a sheet class, removing it from the list of available Applications to use for a Document type
     * @param documentClass - The Document class for which to register a new Sheet option
     * @param scope         - Provide a unique namespace scope for this sheet
     * @param sheetClass    - A defined DocumentSheet subclass used to render the sheet
     * @param types         - An Array of types for which this sheet should be removed
     */
    static unregisterSheet(
      documentClass: Document.AnyConstructor,
      scope: string,
      sheetClass: Application.AnyConstructor | ApplicationV2.AnyConstructor,
      { types }?: DocumentSheetConfig.UnregisterSheetOptions,
    ): void;

    /**
     * Update the current default Sheets using a new core world setting.
     */
    static updateDefaultSheets(setting?: Record<Document.Type, Record<string, string>>): void;

    /**
     * Initialize default sheet configurations for all document types.
     * @internal
     */
    protected static _registerDefaultSheets(): void;

    #documentSheetConfig: true;
  }

  namespace DocumentSheetConfig {
    interface Any extends DocumentSheetConfig<any, any> {}

    interface SheetRegistration {
      action: "register";

      /** The Document class being registered */
      documentClass: Document.AnyConstructor;

      /** The sheet ID being registered */
      id: string;

      /** The human-readable sheet label */
      label: string;

      /** The sheet class definition being registered */
      sheetClass: Application.AnyConstructor;

      /** An array of types for which this sheet is added */
      types: string[];

      /** Make this sheet the default for provided types? */
      makeDefault: boolean;
    }

    interface SheetUnregistration {
      action: "unregister";

      /** The Document class being unregistered */
      documentClass: Document.AnyConstructor;

      /** The sheet ID being unregistered */
      id: string;

      /** An array of types for which this sheet is removed */
      types: string[];
    }

    type SheetAssignment = SheetRegistration | SheetUnregistration;

    interface FormData {
      defaultClass: string;
      sheetClass: string;
    }

    interface RegisterSheetOptions {
      /** A human-readable label for the sheet name, which will be localized */
      label?: string | undefined;

      /** An array of document types for which this sheet should be used */
      types?: string[] | undefined;

      /**
       * An object of theme keys to labels that the sheet supports. If this option is not supplied,
       * the sheet is assumed to support both light and dark themes. If null is supplied, it
       * indicates that the sheet does not support theming.
       */
      themes?: Record<string, string> | null | undefined;

      /**
       * Whether to make this sheet the default for provided types
       * @defaultValue `false`
       */
      makeDefault?: boolean | undefined;

      /**
       * Whether this sheet is available to be selected as a default sheet for all Documents of that type.
       * @defaultValue `true`
       */
      canBeDefault?: boolean | undefined;

      /**
       * Whether this sheet appears in the sheet configuration UI for users.
       * @defaultValue `true`
       */
      canConfigure?: boolean | undefined;
    }

    interface UnregisterSheetOptions {
      types?: string[] | undefined;
    }

    interface SheetClassesForSubType {
      sheetClasses: Record<string, string>;
      defaultClass: string;
      defaultClasses: Record<string, string>;
    }

    interface DocumentSheetConfigData extends SheetClassesForSubType {
      isGM: boolean;
      object: foundry.abstract.Document.Any;
      options: FormApplication.Options;
      sheetClass: string;
      blankLabel: string;
    }
  }
}
