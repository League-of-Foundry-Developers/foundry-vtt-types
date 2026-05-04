import type { DeepPartial, Identity, InexactPartial, IntentionalPartial } from "#utils";
import type { Application } from "#client/appv1/api/_module.d.mts";
import type {
  ApplicationV2,
  DocumentSheetV2,
  HandlebarsApplicationMixin,
} from "#client/applications/api/_module.d.mts";
import type { Document } from "#common/abstract/_module.d.mts";
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";
import type { ClientDatabaseBackend, fields } from "#client/data/_module.d.mts";
import type { DefaultSheetsConfig } from "#client/applications/settings/menus/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DocumentSheetConfig: DocumentSheetConfig.Any;
    }
  }
}

/**
 * An Application for configuring Document sheet settings.
 */
declare class DocumentSheetConfig<
  Document extends Document.Any = Document.Any,
  RenderContext extends DocumentSheetConfig.RenderContext<Document> = DocumentSheetConfig.RenderContext<Document>,
  Configuration extends DocumentSheetConfig.Configuration<Document> = DocumentSheetConfig.Configuration<Document>,
  RenderOptions extends DocumentSheetConfig.RenderOptions = DocumentSheetConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<Document, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  override get title(): string;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for the footer part.
   * @remarks `options` is unused
   */
  protected _prepareFooterContext(context: DeepPartial<RenderContext>, options?: RenderOptions): Promise<void>;

  /**
   * Prepare render context for the form part.
   * @remarks `options` is unused
   */
  protected _prepareFormContext(context: DeepPartial<RenderContext>, options?: RenderOptions): Promise<void>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /** @remarks Overridden in {@linkcode DocumentSheetConfig} to be a no-op */
  protected override _onClose(_options: DeepPartial<RenderOptions>): void;

  /** @remarks Overridden in {@linkcode DocumentSheetConfig} to be a no-op */
  protected override _onFirstRender(
    _context: DeepPartial<RenderContext>,
    _options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * Marshal information on the available sheet classes for a given document type and sub-type, and format it for
   * display.
   * @param documentName - The Document type.
   * @param subType      - The Document sub-type, if applicable. (default: {@linkcode CONST.BASE_DOCUMENT_TYPE})
   */
  static getSheetClassesForSubType<
    Name extends Document.Type,
    SubType extends Document.SubTypesOf<Name> | undefined = undefined,
  >(documentName: Name, subType?: SubType): DocumentSheetConfig.SheetClassesForSubTypeReturn;

  /**
   * Retrieve the user's theme preference for the given Document.
   * @param document - The Document.
   * @returns The theme identifier, or a blank string if the user has no preference.
   */
  static getSheetThemeForDocument(document: ClientDocumentMixin.AnyMixed): string;

  /**
   * Initialize the configured sheet preferences for Documents which support dynamic sheet assignment.
   * @remarks Called in {@linkcode foundry.Game.setupGame | Game#setupGame} between `setup` and `ready` hooks.
   */
  static initializeSheets(): Promise<void>;

  /**
   * Register a sheet class as a candidate to be used to display Documents of a given type.
   * @param documentClass - The Document class to register a new sheet for.
   * @param scope         - A unique namespace scope for this sheet.
   * @param sheetClass    - An Application class used to render the sheet.
   * @param options       - Sheet registration configuration options.
   */
  static registerSheet<DocumentClass extends ClientDocumentMixin.AnyMixedConstructor>(
    documentClass: DocumentClass,
    scope: ClientDatabaseBackend.FlagScope,
    sheetClass: Application.AnyConstructor | DocumentSheetV2.AnyConstructor,
    options?: DocumentSheetConfig.RegisterSheetOptions<DocumentClass>,
  ): void;

  static unregisterSheet<DocumentClass extends ClientDocumentMixin.AnyMixedConstructor>(
    documentClass: DocumentClass,
    scope: ClientDatabaseBackend.FlagScope,
    sheetClass: Application.AnyConstructor | DocumentSheetV2.AnyConstructor,
    options?: DocumentSheetConfig.UnregisterSheetOptions<DocumentClass>,
  ): void;

  /**
   * Update the current default sheets using a new core World setting.
   * @param setting - The stored default sheet settings.
   */
  static updateDefaultSheets(setting?: DefaultSheetsConfig.SettingData): void;

  #DocumentSheetConfig: true;
}

declare namespace DocumentSheetConfig {
  interface Any extends AnyDocumentSheetConfig {}
  interface AnyConstructor extends Identity<typeof AnyDocumentSheetConfig> {}

  /**
   * @remarks `document` is omitted/extended from the `DocumentSheetV2` context because it is (sometimes)
   * overwritten by {@linkcode DocumentSheetConfig._prepareFormContext | #_prepareFormContext}.
   * Additional part context is `IntentionalPartial`ed because its all conditional.
   */
  interface RenderContext<Document extends Document.Any>
    extends
      HandlebarsApplicationMixin.RenderContext,
      Omit<DocumentSheetV2.RenderContext<Document>, "document">,
      IntentionalPartial<PreparePartContext> {
    /**
     * @remarks {@linkcode DocumentSheetConfig._prepareFormContext | #_prepareFormContext}
     * overwrites the value from {@linkcode DocumentSheetV2._prepareContext | DocumentSheetV2#_prepareContext}.
     */
    document: Document | DocumentSheetConfig.DocumentContextOverride;
  }

  interface PreparePartContext
    extends IntentionalPartial<PrepareFooterContext>, IntentionalPartial<PrepareFormContext> {
    /** @remarks Added by `#_preparePartContext` */
    partId: "form" | "footer" | (string & {});
  }

  /** @remarks Added by {@linkcode DocumentSheetConfig._prepareFormContext | #_prepareFormContext} */
  interface PrepareFormContext {
    defaults: {
      sheet: {
        field: fields.StringField<{
          label: "SHEETS.DefaultSheet";

          hint: "SHEETS.TypeSheetHint";

          /** @remarks `choices` is `{ defaultClasses } = `{@linkcode DocumentSheetConfig.getSheetClassesForSubType}`(documentName, type)` */
          choices: Record<string, string>;
        }>;

        name: "defaultClass";

        /** @remarks `!game.user.isGM` */
        disabled: boolean;

        /** @remarks `{ defaultClass } = `{@linkcode DocumentSheetConfig.getSheetClassesForSubType}`(documentName, type)` */
        value: string;
      };

      theme: {
        field: fields.StringField<{
          label: "SHEETS.Theme";

          hint: "SHEETS.ThemeHint";

          /** @remarks `CONFIG[documentName]["sheetClasses"][type]?.themes ?? {}` */
          choices: Record<string, string>;
        }>;

        name: "defaultTheme";

        /**
         * @remarks
         * ```js
         * foundry.utils.getProperty(game.settings.get("core", "sheetThemes"), `defaults.${documentName}.${type}`) || ""
         * ```
         */
        value: string;

        /** @remarks `true` if the default sheet class for this document is `AppV1` */
        disabled: boolean;
      };
    };
  }

  /** @remarks Added by {@linkcode DocumentSheetConfig._prepareFooterContext | #_prepareFooterContext}. */
  interface PrepareFooterContext {
    buttons: { type: string; icon: string; label: string }[];
  }

  /** The type {@linkcode DocumentSheetConfig._prepareFormContext | #_prepareFormContext} overwrites `context.document` with */
  interface DocumentContextOverride {
    sheet: {
      field: fields.StringField<{
        label: "SHEETS.ThisSheet";

        hint: "SHEETS.DocumentSheetHint";

        /** @remarks `choices` is `{ sheetClasses } = `{@linkcode DocumentSheetConfig.getSheetClassesForSubType}`(documentName, type)` */
        choices: Record<string, string>;
      }>;

      name: "sheetClass";

      /** @remarks Either the instance override stored in `flags.core.sheetClass`, or `""` */
      value: string;
    };

    theme: {
      field: fields.StringField<{
        label: "SHEETS.Theme";

        hint: "SHEETS.ThemeHint";

        /** @remarks `CONFIG[documentName]["sheetClasses"][type]?.themes ?? {}` */
        choices: Record<string, string>;
      }>;

      name: "theme";

      /** @remarks `game.settings.get("core", "sheetThemes").documents?.[document.uuid] || ""` */
      value: string;

      /** @remarks `true` if the current sheet class for this document is `AppV1` */
      disabled: boolean;
    };
  }

  interface Configuration<Document extends Document.Any>
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Document> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}

  interface SheetClassesForSubTypeReturn {
    /** @remarks Keys are `{PackageID}.{ClassName}`, values are descriptive labels. */
    sheetClasses: Record<string, string>;

    /** @remarks Keys are `{PackageID}.{ClassName}`, values are descriptive labels. */
    defaultClasses: Record<string, string>;

    /** @remarks Will be of form `{PackageID}.{ClassName}`. */
    defaultClass: string;
  }

  /** @internal */
  interface _SheetRegistrationOptions<DocumentClass extends ClientDocumentMixin.AnyMixedConstructor> {
    /**
     * A human-readable label for the sheet name, or a function that returns one. Will be localized.
     * @remarks "Will be localized" means *before* storage in `CONFIG`, inside `.#registerSheet`.
     *
     * If not provided, the `id` (`${scope}.${sheetClass.name}`) will be used as the label.
     */
    label: string | (() => string);

    /**
     * An array of Document sub-types to register the sheet for.
     * @remarks If not provided, the sheet will be registered for all configured types of the provided document class.
     */
    types: Document.SubTypesOf<DocumentClass["documentName"]>[];

    /**
     * An object of theme keys to labels that the sheet supports. If this option is not supplied, the sheet is assumed
     * to support both light and dark themes. If null is supplied, it indicates that the sheet does not support theming.
     *
     * @defaultValue
     * ```js
     * {
     *   dark: "SETTINGS.UI.FIELDS.colorScheme.choices.dark",
     *   light: "SETTINGS.UI.FIELDS.colorScheme.choices.light"
     * }
     * ```
     *
     * @privateRemarks There is a moment where this is allowed to be `undefined` outside the use of `InexactPartial` for
     * {@linkcode RegisterSheetOptions}, but since that's only as an input to the hard-private `.#registerSheet`,
     * it has not been typed as such.
     */
    themes: Record<string, string> | null;

    /**
     * Whether to make this sheet the default for the provided sub-types.
     * @defaultValue `false`
     */
    makeDefault: boolean;

    /**
     * Whether this sheet is available to be selected as a default sheet for all Documents of that type.
     * @defaultValue `true`
     */
    canBeDefault: boolean;

    /**
     * Whether this sheet appears in the sheet configuration UI for users.
     * @defaultValue `true`
     */
    canConfigure: boolean;
  }

  interface RegisterSheetOptions<DocumentClass extends ClientDocumentMixin.AnyMixedConstructor> extends InexactPartial<
    _SheetRegistrationOptions<DocumentClass>
  > {}

  interface UnregisterSheetOptions<
    DocumentClass extends ClientDocumentMixin.AnyMixedConstructor,
  > extends InexactPartial<Pick<_SheetRegistrationOptions<DocumentClass>, "types">> {}

  /**
   * @remarks The data type stored in `CONFIG[documentName]["sheetClasses"][subType]`
   */
  interface SheetRegistrationDescriptor<DocumentClass extends ClientDocumentMixin.AnyMixedConstructor> extends Omit<
    _SheetRegistrationOptions<DocumentClass>,
    "label"
  > {
    /** The Document class to register a new sheet option for. */
    documentClass: DocumentClass;

    /** The identifier of the sheet being registered. */
    id: string;

    /** An Application class used to render the sheet. */
    sheetClass: Application.AnyConstructor | DocumentSheetV2.AnyConstructor;

    /**
     * A human-readable label for the sheet name, or a function that returns one. Will be localized.
     * @remarks When stored in `CONFIG`, this will always be a string; if a function returning a string is passed for
     * {@linkcode RegisterSheetOptions.label}, `.#registerSheet` will call it and only store the return.
     */
    label: string;
  }
}

declare abstract class AnyDocumentSheetConfig extends DocumentSheetConfig<
  Document.Any,
  DocumentSheetConfig.RenderContext<Document.Any>,
  DocumentSheetConfig.Configuration<Document.Any>,
  DocumentSheetConfig.RenderOptions
> {
  constructor(...args: never);
}

export default DocumentSheetConfig;
