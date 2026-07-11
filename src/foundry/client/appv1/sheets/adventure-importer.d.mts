import type { GetDataReturnType, Identity } from "#utils";
import type { Application, DocumentSheet } from "../api/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationConfig {
      AdventureImporter: AdventureImporter.Any;
    }
  }
}

/**
 * An interface for importing an adventure from a compendium pack.
 */
declare class AdventureImporter<
  Options extends AdventureImporter.Options = AdventureImporter.Options,
> extends DocumentSheet<Adventure.Implementation, Options> {
  /**
   * An alias for the Adventure document
   */
  adventure: this["object"];

  override get isEditable(): boolean;

  /**
   * @defaultValue
   * ```typescript
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   template: "templates/adventure/importer.html",
   *   id: "adventure-importer",
   *   classes: ["sheet", "adventure", "adventure-importer"],
   *   width: 800,
   *   height: "auto",
   *   submitOnClose: false,
   *   closeOnSubmit: true
   * });
   * ```
   */
  static override get defaultOptions(): AdventureImporter.Options;

  override getData(options?: Partial<Options>): Promise<GetDataReturnType<AdventureImporter.Data>>;

  override activateListeners(html: JQuery<HTMLElement>): void;

  /**
   * Handle toggling the import all checkbox.
   * @param event - The change event
   */
  protected _onToggleImportAll(event: Event): void;

  /**
   * Prepare a list of content types provided by this adventure.
   */
  protected _getContentList(): { icon: string; label: string; count: number }[];

  protected override _getHeaderButtons(): Application.HeaderButton[];

  protected override _updateObject(
    event: Event,
    formData: object,
  ): Promise<void | ReturnType<Adventure.Implementation["import"]>>;

  /**
   * Mirror {@linkcode Adventure.import | Adventure#import} but call {@linkcode _importContent | AdventureImporter#_importContent} and
   * {@linkcode _prepareImportData | AdventureImport#_prepareImportData}
   * @remarks This isn't itself deprecated but calls two deprecated methods and will likely be removed with them in v16.
   */
  _importLegacy(formData: object): Promise<void>;

  /**
   * @deprecated "`AdventureImporter#_prepareImportData` is deprecated. Please use
   * {@linkcode Adventure.prepareImport Adventure#prepareImport} instead." (since v11, until v16)
   */
  _prepareImportData(formData: object): Promise<Adventure.ImportData>;

  /**
   * @deprecated "`AdventureImporter#_importContent` is deprecated. Please use {@linkcode Adventure.importContent | Adventure#importContent}
   * instead." (since v13, until v16)
   */
  _importContent(formData: object): Promise<Adventure.ImportResult>;
}

declare namespace AdventureImporter {
  interface Any extends AnyAdventureImporter {}
  interface AnyConstructor extends Identity<typeof AnyAdventureImporter> {}

  interface Options extends DocumentSheet.Options<Adventure.Implementation> {}

  interface Data {
    adventure: Adventure.Implementation;

    contents: ReturnType<AdventureImporter["_getContentList"]>;

    imported: boolean;
  }

  /**
   * @deprecated Replaced with {@linkcode AdventureImporter.Data}.
   */
  type AdventureImporterData = Data;
}

declare abstract class AnyAdventureImporter extends AdventureImporter<AdventureImporter.Options> {
  constructor(...args: never);
}

export default AdventureImporter;
