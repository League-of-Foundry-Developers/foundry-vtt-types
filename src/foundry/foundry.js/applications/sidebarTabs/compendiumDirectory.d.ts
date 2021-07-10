import { ConfiguredDocumentClass } from '../../../../types/helperTypes';

declare global {
  /**
   * A compendium of knowledge arcane and mystical!
   * @typeParam Options - The type of the options object
   */
  class CompendiumDirectory<Options extends Application.Options = Application.Options> extends SidebarTab<Options> {
    /**
     * @override
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "compendium",
     *   template: "templates/sidebar/compendium-directory.html",
     *   title: "Compendium Packs"
     * });
     * ```
     */
    static get defaultOptions(): Application.Options;

    /**
     * @param options - (unused)
     * @override
     */
    getData(options?: Application.RenderOptions): CompendiumDirectory.Data;

    /**
     * @override
     */
    activateListeners(html: JQuery): void;

    /**
     * Compendium sidebar Context Menu creation
     * @param html - The HTML being rendered for the compendium directory
     */
    protected _contextMenu(html: JQuery): void;

    /**
     * Get the sidebar directory entry context options
     * @returns The sidebar entry context options
     */
    protected _getEntryContextOptions(): ContextMenu.Item[];

    /**
     * Handle a Compendium Pack creation request
     * @param event - The originating click event
     */
    protected _onCreateCompendium(event: JQuery.ClickEvent): Promise<void>;

    /**
     * Handle a Compendium Pack deletion request
     * @param pack - The pack object requested for deletion
     */
    protected _onDeleteCompendium(
      pack: CompendiumCollection<CompendiumCollection.Metadata>
    ): Promise<CompendiumCollection<CompendiumCollection.Metadata> | void>;
  }

  namespace CompendiumDirectory {
    interface Data {
      user: InstanceType<ConfiguredDocumentClass<typeof User>>;
      packs: { [DocumentName in foundry.CONST.CompendiumEntityType]?: PackData<DocumentName> };
    }

    interface PackData<DocumentName extends foundry.CONST.CompendiumEntityType> {
      label: DocumentName;
      packs: CompendiumCollection<CompendiumCollection.Metadata & { entity: DocumentName }>[];
    }
  }
}
