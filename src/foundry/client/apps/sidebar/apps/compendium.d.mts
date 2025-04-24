import type Document from "../../../../common/abstract/document.d.mts";

declare global {
  /**
   * An interface for displaying the content of a CompendiumCollection.
   * @typeParam Metadata - The metadata of the compendium
   * @typeParam Options  - The type of the options object
   */
  class Compendium<
    Metadata extends CompendiumCollection.Metadata,
    Options extends Compendium.Options<Metadata> = Compendium.Options<Metadata>,
  > extends DocumentDirectory<"Compendium", Options> {
    /**
     * @param options - Compendium configuration options.
     */
    constructor(options: Partial<Options>);

    override get entryType(): Metadata["type"];

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
    static override get defaultOptions(): Compendium.Options<CompendiumCollection.Metadata>;

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

    override render(force?: boolean, options?: Application.RenderOptions<Application.Options>): this;

    // TODO: Implement GetDataReturnType
    override getData(options?: Partial<Options>): Promise<object>;

    protected override _entryAlreadyExists(entry: DirectoryApplicationMixin.Entry): boolean;

    protected override _createDroppedEntry(
      entry: DirectoryApplicationMixin.Entry,
      folderId?: string,
    ): Promise<DirectoryApplicationMixin.Entry>;

    protected override _getEntryDragData(entryId: string): { type: string; uuid: string };

    protected override _onCreateEntry(event: PointerEvent): Promise<void>;

    /**
     * Handle clicks on a footer button
     * @param event - The originating pointer event
     * @internal
     */
    _onClickFooterButton(event: PointerEvent): AdventureExporter | void;

    protected _getDocumentDragData(documentId: string): { type: string; uuid: string };

    protected override _getFolderDragData(folderId: string): { type: "Folder"; uuid: string };

    protected override _getFolderContextOptions(): ContextMenu.Entry[];

    protected override _getEntryContextOptions(): ContextMenu.Entry[];
  }

  namespace Compendium {
    interface Any extends Compendium<any, any> {}

    type PackID = `${string}.${string}`;

    interface Options<Metadata extends CompendiumCollection.Metadata = CompendiumCollection.Metadata>
      extends DocumentDirectory.Options<Document.ImplementationClassFor<Metadata["type"]>> {
      // TODO(LukeAbby): Replace with `CompendiumCollection<Metadata>` when possible.
      collection: any;
    }
  }
}
