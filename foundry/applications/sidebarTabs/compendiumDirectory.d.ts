/**
 * A compendium of knowledge arcane and mystical!
 */
declare class CompendiumDirectory extends SidebarTab<CompendiumDirectory.Options> {
  /**
   * @override
   */
  static get defaultOptions(): CompendiumDirectory.Options;

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
   */
  protected _contextMenu(html: JQuery): void;

  /**
   * Get the sidebar directory entry context options
   * @returns The sidebar entry context options
   */
  protected _getEntryContextOptions(): ContextMenu.Item[];

  /**
   * Handle a Compendium Pack creation request
   */
  protected _onCreateCompendium(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Handle a Compendium Pack deletion request
   * @param pack - The pack object requested for deletion
   */
  protected _onDeleteCompendium(pack: Compendium): Promise<Compendium | void>;
}

declare namespace CompendiumDirectory {
  interface Data {
    user: User;
    packs: Record<string, PackData>;
  }

  interface Options extends SidebarTab.Options {
    /**
     * @defaultValue `'compendium'`
     */
    id: string;

    /**
     * @defaultValue `'templates/sidebar/compendium.html'`
     */
    template: string;

    /**
     * @defaultValue `'Compendium Packs'`
     */
    title: string;
  }

  interface PackData {
    label: string;
    packs: Compendium[];
  }
}
