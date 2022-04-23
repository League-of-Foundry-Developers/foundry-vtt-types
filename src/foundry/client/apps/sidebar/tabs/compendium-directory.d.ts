import { ConfiguredDocumentClass } from '../../../../../types/helperTypes';

declare global {
  /**
   * A compendium of knowledge arcane and mystical!
   * @typeParam Options - The type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class CompendiumDirectory<
    Options extends ApplicationOptions = ApplicationOptions,
    Data extends object = CompendiumDirectory.Data
  > extends SidebarTab<Options> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "compendium",
     *   template: "templates/sidebar/compendium-directory.html",
     *   title: "COMPENDIUM.SidebarTitle"
     * });
     * ```
     */
    static override get defaultOptions(): ApplicationOptions;

    override getData(options?: Partial<Options>): Data | Promise<Data>;

    override activateListeners(html: JQuery): void;

    /**
     * Compendium sidebar Context Menu creation
     * @param html - The HTML being rendered for the compendium directory
     */
    protected _contextMenu(html: JQuery): void;

    /**
     * Get the sidebar directory entry context options
     * @returns The sidebar entry context options
     * @internal
     */
    protected _getEntryContextOptions(): ContextMenuEntry[];

    /**
     * Handle a Compendium Pack creation request
     * @param event - The originating click event
     * @internal
     */
    protected _onCreateCompendium(event: JQuery.ClickEvent): Promise<void>;

    /**
     * Handle a Compendium Pack deletion request
     * @param pack - The pack object requested for deletion
     * @internal
     */
    protected _onDeleteCompendium(
      pack: CompendiumCollection<CompendiumCollection.Metadata>
    ): Promise<CompendiumCollection<CompendiumCollection.Metadata> | void>;

    /**
     * Toggle the compendium entry open/closed state in the sidebar.
     * @param pack - The name of the compendium pack.
     * @internal
     */
    protected _toggleOpenState(pack: string): void;
  }

  namespace CompendiumDirectory {
    interface Data {
      user: InstanceType<ConfiguredDocumentClass<typeof User>>;
      packs: { [DocumentName in foundry.CONST.COMPENDIUM_DOCUMENT_TYPES]?: PackData<DocumentName> };
    }

    interface PackData<DocumentName extends foundry.CONST.COMPENDIUM_DOCUMENT_TYPES> {
      label: DocumentName;
      packs: CompendiumCollection<CompendiumCollection.Metadata & { entity: DocumentName }>[];
    }
  }
}
