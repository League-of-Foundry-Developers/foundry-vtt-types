export {};

declare global {
  /**
   * A compendium of knowledge arcane and mystical!
   * Renders the sidebar directory of compendium packs
   * @typeParam Options - The type of the options object
   */
  class CompendiumDirectory<
    Options extends DocumentDirectoryOptions = DocumentDirectoryOptions,
  > extends DirectoryApplicationMixin(SidebarTab)<Options> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "compendium",
     *   template: "templates/sidebar/compendium-directory.html",
     *   title: "COMPENDIUM.SidebarTitle",
     *   contextMenuSelector: ".directory-item.compendium",
     *   entryClickSelector: ".compendium"
     * });
     * ```
     */
    static override get defaultOptions(): DocumentDirectoryOptions;

    get activeFilters(): string[];

    // NOTE: It seems in source this is erroneously defined as a property, not a getter
    override get entryType(): "Compendium";

    static override entryPartial: "templates/sidebar/partials/pack-partial.html";

    protected override _entryAlreadyExists(entry: DirectoryMixinEntry): boolean;

    protected override _getEntryDragData(entryId: string): object;

    protected override _entryIsSelf(entry: DirectoryMixinEntry, otherEntry: DirectoryMixinEntry): boolean;

    protected override _sortRelative(
      entry: DirectoryMixinEntry,
      sortData: { sortKey: string; sortBefore: boolean; updateData: object },
    ): Promise<object>;

    override activateListeners(html: JQuery): void;

    /**
     * Display a menu of compendium types to filter by
     * @param event - The originating pointer event
     */
    protected _displayFilterCompendiumMenu(event: PointerEvent): Promise<void>;

    /**
     * Handle toggling a compendium type filter
     * @param event - The originating pointer event
     * @param type  - The compendium type to filter by. If null, clear all filters.
     */
    protected _onToggleCompendiumFilterType(event: PointerEvent, type: string | null): void;

    /**
     * The collection of Compendium Packs which are displayed in this Directory
     */
    get collection(): CompendiumPacks;

    /**
     * Get the dropped Entry from the drop data
     * @param data - The data being dropped
     * @returns The dropped Entry
     */
    protected _getDroppedEntryFromData(data: object): Promise<DirectoryMixinEntry>;

    protected override _createDroppedEntry(entry: DirectoryMixinEntry, folderId?: string): Promise<DirectoryMixinEntry>;

    protected override _getEntryName(entry: object): string;

    protected override _getEntryId(entry: object): string;

    // TODO: Implement GetDataReturnType
    override getData(options?: Partial<Options>): Promise<object>;

    override render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<unknown>;

    /**
     * Get the sidebar directory entry context options
     * @returns The sidebar entry context options
     * @internal
     */
    protected override _getEntryContextOptions(): ContextMenuEntry[];

    protected override _onClickEntryName(event: PointerEvent): Promise<void>;

    protected override _onCreateEntry(event: PointerEvent): Promise<void>;

    /**
     * Handle a Compendium Pack deletion request
     * @param pack - The pack object requested for deletion
     * @internal
     */
    protected _onDeleteCompendium(
      pack: CompendiumCollection<CompendiumCollection.Metadata>,
    ): Promise<CompendiumCollection<CompendiumCollection.Metadata> | void>;
  }

  namespace CompendiumDirectory {
    type Any = AnyCompendiumDirectory;
    type AnyConstructor = typeof AnyCompendiumDirectory;
  }
}

declare abstract class AnyCompendiumDirectory extends CompendiumDirectory<DocumentDirectoryOptions> {
  constructor(...args: ConstructorParameters<typeof CompendiumDirectory>);
}
