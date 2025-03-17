import type { GetDataReturnType, Identity } from "fvtt-types/utils";

declare global {
  /**
   * An interface for importing an adventure from a compendium pack.
   */
  class AdventureImporter<Options extends AdventureImporter.Options = AdventureImporter.Options> extends DocumentSheet<
    Options,
    Adventure.ConfiguredInstance
  > {
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

    override getData(options?: Partial<Options>): Promise<GetDataReturnType<AdventureImporter.AdventureImporterData>>;

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

    protected override _updateObject(event: Event, formData: object): Promise<void | ReturnType<Adventure["import"]>>;

    /**
     * Mirror Adventure#import but call AdventureImporter#_importContent and AdventureImport#_prepareImportData
     * @deprecated since v11, will be removed in v13
     */
    _importLegacy(formData: object): Promise<void>;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks `"AdventureImporter#_prepareImportData is deprecated. Please use Adventure#prepareImport instead."`
     */
    _prepareImportData(formData: object): Promise<void>;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks `"AdventureImporter#_importContent is deprecated. Please use Adventure#importContent instead."`
     */
    _importContent(formData: object): Promise<void>;
  }

  namespace AdventureImporter {
    interface Any extends AnyAdventureImporter {}
    interface AnyConstructor extends Identity<typeof AnyAdventureImporter> {}

    interface Options extends DocumentSheetOptions<Adventure.ConfiguredInstance> {}

    interface AdventureImporterData {
      adventure: Adventure.ConfiguredInstance;

      contents: ReturnType<AdventureImporter["_getContentList"]>;

      imported: boolean;
    }
  }
}

declare abstract class AnyAdventureImporter extends AdventureImporter<AdventureImporter.Options> {
  constructor(arg0: never, ...args: never[]);
}
