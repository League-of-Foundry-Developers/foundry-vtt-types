import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * A compendium of knowledge arcane and mystical!
   * Renders the sidebar directory of compendium packs
   * @typeParam Options - The type of the options object
   */
  class CompendiumDirectory<
    Options extends DocumentDirectory.Options = DocumentDirectory.Options,
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
    static override get defaultOptions(): DocumentDirectory.Options;

    get activeFilters(): string[];

    // NOTE: It seems in source this is erroneously defined as a property, not a getter
    override get entryType(): "Compendium";

    static override entryPartial: "templates/sidebar/partials/pack-partial.html";

    protected override _entryAlreadyExists(entry: DirectoryApplicationMixin.Entry): boolean;

    protected override _getEntryDragData(entryId: string): object;

    protected override _entryIsSelf(
      entry: DirectoryApplicationMixin.Entry,
      otherEntry: DirectoryApplicationMixin.Entry,
    ): boolean;

    protected override _sortRelative(
      entry: DirectoryApplicationMixin.Entry,
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
    protected _getDroppedEntryFromData(data: object): Promise<DirectoryApplicationMixin.Entry>;

    protected override _createDroppedEntry(
      entry: DirectoryApplicationMixin.Entry,
      folderId?: string,
    ): Promise<DirectoryApplicationMixin.Entry>;

    protected override _getEntryName(entry: object): string;

    protected override _getEntryId(entry: object): string;

    // TODO: Implement GetDataReturnType
    override getData(options?: Partial<Options>): Promise<object>;

    // NOTE(LukeAbby): In v12 this is async for no apparent reason given that it doesn't call
    // anything that is async. However given that v13 fixes this I decided to prematurely fix it
    // to fix tests (e.g. allow superclasses to return `this`).
    override render(force?: boolean, options?: Application.RenderOptions<Options>): this;

    /**
     * Get the sidebar directory entry context options
     * @returns The sidebar entry context options
     * @internal
     */
    protected override _getEntryContextOptions(): foundry.applications.ux.ContextMenu.Entry<JQuery>[];

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
    interface Any extends AnyCompendiumDirectory {}
    interface AnyConstructor extends Identity<typeof AnyCompendiumDirectory> {}
  }
}

declare abstract class AnyCompendiumDirectory extends CompendiumDirectory<DocumentDirectory.Options> {
  constructor(...args: ConstructorParameters<typeof CompendiumDirectory>);
}
