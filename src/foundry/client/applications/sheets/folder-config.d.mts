import type { DeepPartial, Identity } from "#utils";
import type {
  ApplicationV2,
  DocumentSheetV2,
  HandlebarsApplicationMixin,
} from "#client/applications/api/_module.d.mts";
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      FolderConfig: FolderConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Folder document.
 */
declare class FolderConfig<
  RenderContext extends FolderConfig.RenderContext = FolderConfig.RenderContext,
  Configuration extends FolderConfig.Configuration = FolderConfig.Configuration,
  RenderOptions extends FolderConfig.RenderOptions = FolderConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Folder.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["folder-config"],
   *   canCreate: true,
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-folder"
   *   },
   *   position: {width: 480},
   *   form: {
   *     closeOnSubmit: true
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   body: {template: "templates/sheets/folder-config.hbs"},
   *   footer: {template: "templates/generic/form-footer.hbs"}
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  // `_formConfig` is unused by Foundry
  protected override _onChangeForm(_formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
  ): object;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
    options?: unknown,
  ): Promise<void>;
}

declare namespace FolderConfig {
  interface Any extends AnyFolderConfig {}
  interface AnyConstructor extends Identity<typeof AnyFolderConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Folder.Implementation> {
    /**
     * @remarks Uses the Folder's `_source.name` if this sheet is for a persisted folder, otherwise defaults to `""`.
     */
    name: string;

    /**
     * @remarks Uses the Folder's `_source.name` if this sheet is for a persisted folder, otherwise defaults to
     * {@linkcode Folder.defaultName | folder.constructor.defaultName}`({pack: folder.pack})}`.
     */
    namePlaceholder: string;

    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Folder.Implementation> {
    /**
     * @deprecated This property should exist on this interface but due to a core bug
     * ({@link https://github.com/foundryvtt/foundryvtt/issues/13545}), this is currently
     * ignored in v13.
     */
    // TODO: un-deprecate in v14, it has been fixed
    resolve: ResolveFunction;
  }

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}

  type ResolveFunction = (doc: ClientDocumentMixin.AnyMixed | null) => void;
}

declare abstract class AnyFolderConfig extends FolderConfig<
  FolderConfig.RenderContext,
  FolderConfig.Configuration,
  FolderConfig.RenderOptions
> {
  constructor(...args: never);
}

export default FolderConfig;
