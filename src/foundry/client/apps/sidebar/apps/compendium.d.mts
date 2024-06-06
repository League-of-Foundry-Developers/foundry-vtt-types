export {};

declare global {
  /**
   * An interface for displaying the content of a CompendiumCollection.
   * @typeParam Metadata - The metadata of the compendium
   * @typeParam Options  - The type of the options object
   */
  class Compendium<
    Metadata extends CompendiumCollection.Metadata,
    Options extends ApplicationOptions = ApplicationOptions,
  > extends DocumentDirectory<Options> {
    /**
     * @param collection - The {@link CompendiumCollection} object represented by this interface.
     * @param options    - Application configuration options.
     */
    constructor(collection: CompendiumCollection<Metadata>, options?: Partial<Options> | undefined);

    collection: CompendiumCollection<Metadata>;

    override get entryType(): foundry.CONST.COMPENDIUM_DOCUMENT_TYPES;

    static override entryPartial: string;

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   template: "templates/apps/compendium.html",
     *   width: 350,
     *   height: window.innerHeight - 100,
     *   top: 70,
     *   left: 120,
     *   popOut: true
     * });
     * ```
     */
    static override get defaultOptions(): ApplicationOptions;

    override get id(): string;

    override get title(): string;

    override get tabName(): string;

    override get canCreateEntry(): boolean;

    override get canCreateFolder(): boolean;

    /**
     * A convenience redirection back to the metadata object of the associated CompendiumCollection
     */
    get metadata(): this["collection"]["metadata"];

    override initialize(): void;

    override render(
      force?: boolean | undefined,
      options?: Application.RenderOptions<ApplicationOptions> | undefined,
    ): unknown;

    override getData(options?: Partial<Options>): Promise<object>;

    protected override _entryAlreadyExists(entry: DirectoryMixinEntry): boolean;

    protected override _createDroppedEntry(
      entry: DirectoryMixinEntry,
      folderId?: string | undefined,
    ): Promise<DirectoryMixinEntry>;

    protected override _getEntryDragData(entryId: string): object;

    protected override _onCreateEntry(event: PointerEvent): Promise<void>;

    /**
     * Handle clicks on a footer button
     * @param event - The originating pointer event
     * @internal
     */
    _onClickFooterButton(event: PointerEvent): AdventureExporter | void;

    protected _getDocumentDragData(documentId: string): object;

    protected override _getFolderDragData(folderId: string): object;

    protected override _getFolderContextOptions(): ContextMenuEntry[];

    protected override _getEntryContextOptions(): ContextMenuEntry[];
  }
}
