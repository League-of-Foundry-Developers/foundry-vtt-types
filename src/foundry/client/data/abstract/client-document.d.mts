import type { Mixin, FixedInstanceType, Coalesce, AnyObject } from "fvtt-types/utils";
import type {
  DatabaseCreateOperation,
  DatabaseDeleteOperation,
  DatabaseUpdateOperation,
} from "../../../common/abstract/_types.d.mts";
import type Document from "../../../common/abstract/document.d.mts";

declare class InternalClientDocument<BaseDocument extends Document.Internal.Instance.Any = Document.Any> {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * A collection of Application instances which should be re-rendered whenever this document is updated.
   * The keys of this object are the application ids and the values are Application instances. Each
   * Application in this object will have its render method called by {@link Document.render | `Document#render`}.
   * @see {@link Document.render | `Document#render`}
   * @defaultValue `{}`
   */
  readonly apps: Record<string, Application.Any | foundry.applications.api.ApplicationV2.Any>;

  /**
   * A cached reference to the FormApplication instance used to configure this Document.
   * @defaultValue `null`
   */
  protected readonly _sheet: FixedInstanceType<
    Document.ConfiguredSheetClassFor<Document.Internal.DocumentNameFor<BaseDocument>>
  > | null;

  static name: "ClientDocumentMixin";

  /**
   * @see {@link abstract.Document._initialize | `abstract.Document#_initialize`}
   */
  protected _initialize(): void;

  /**
   * Return a reference to the parent Collection instance which contains this Document.
   */
  get collection(): Collection<this>;

  /**
   * A reference to the Compendium Collection which contains this Document, if any, otherwise undefined.
   */
  get compendium(): Document.MetadataFor<
    Document.Internal.DocumentNameFor<BaseDocument>
  > extends CompendiumCollection.Metadata
    ? CompendiumCollection<Document.MetadataFor<Document.Internal.DocumentNameFor<BaseDocument>>>
    : undefined;

  /**
   * A boolean indicator for whether the current game User has ownership rights for this Document.
   * Different Document types may have more specialized rules for what constitutes ownership.
   */
  get isOwner(): boolean;

  /**
   * Test whether this Document is owned by any non-Gamemaster User.
   */
  get hasPlayerOwner(): boolean;

  /**
   * A boolean indicator for whether the current game User has exactly LIMITED visibility (and no greater).
   */
  get limited(): boolean;

  /**
   * Return a string which creates a dynamic link to this Document instance.
   */
  get link(): string;

  /**
   * Return the permission level that the current game User has over this Document.
   * See the CONST.DOCUMENT_OWNERSHIP_LEVELS object for an enumeration of these levels.
   *
   * @example
   * ```typescript
   * game.user.id; // "dkasjkkj23kjf"
   * actor.data.permission; // {default: 1, "dkasjkkj23kjf": 2};
   * actor.permission; // 2
   * ```
   */
  get permission(): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  /**
   * Lazily obtain a FormApplication instance used to configure this Document, or null if no sheet is available.
   */
  get sheet(): FormApplication.Any | foundry.applications.api.ApplicationV2.Any | null;

  /**
   * A boolean indicator for whether or not the current game User has at least limited visibility for this Document.
   * Different Document types may have more specialized rules for what determines visibility.
   */
  get visible(): boolean;

  /**
   * Obtain the FormApplication class constructor which should be used to configure this Document.
   */
  protected _getSheetClass():
    | FormApplication.AnyConstructor
    | foundry.applications.api.ApplicationV2.AnyConstructor
    | null;

  /**
   * Safely prepare data for a Document, catching any errors.
   */
  protected _safePrepareData(): void;

  /**
   * Prepare data for the Document. This method is called automatically by the DataModel#_initialize workflow.
   * This method provides an opportunity for Document classes to define special data preparation logic.
   * The work done by this method should be idempotent. There are situations in which prepareData may be called more
   * than once.
   */
  prepareData(): void;

  /**
   * Prepare data related to this Document itself, before any embedded Documents or derived data is computed.
   */
  prepareBaseData(): void;

  /**
   * Prepare all embedded Document instances which exist within this primary Document.
   */
  prepareEmbeddedDocuments(): void;

  /**
   * Apply transformations or derivations to the values of the source data object.
   * Compute data fields whose values are not stored to the database.
   */
  prepareDerivedData(): void;

  /**
   * Render all Application instances which are connected to this document by calling their respective
   * @see {@link Application.render | `Application#render`}
   * @param force   - Force rendering
   *                  (default: `false`)
   * @param context - Optional context
   *                  (default: `{}`)
   */
  render(
    force?: boolean,
    context?: Application.RenderOptions | foundry.applications.api.ApplicationV2.RenderOptions,
  ): void;

  /**
   * Determine the sort order for this Document by positioning it relative a target sibling.
   * See SortingHelper.performIntegerSort for more details
   * @param options - Sorting options provided to SortingHelper.performIntegerSort
   * @returns The Document after it has been re-sorted
   */
  sortRelative(options?: ClientDocument.SortOptions<this>): Promise<this>;

  /**
   * Construct a UUID relative to another document.
   * @param doc - The document to compare against.
   */
  getRelativeUuid(relative: ClientDocument): string;

  /**
   * Create a content link for this document
   * @param eventData - The parsed object of data provided by the drop transfer event.
   * @param options   - Additional options to configure link generation.
   */
  protected _createDocumentLink(eventData: unknown, options?: ClientDocument.CreateDocumentLinkOptions): string;

  /**
   * Handle clicking on a content link for this document.
   * @param event - The triggering click event.
   */
  _onClickDocumentLink(event: MouseEvent): unknown;

  /**
   * @privateRemarks _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
   * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
   */

  /**
   * Orchestrate dispatching descendant document events to parent documents when embedded children are modified.
   * @param event      - The event name, preCreate, onCreate, etc...
   * @param collection - The collection name being modified within this parent document
   * @param args       - Arguments passed to each dispatched function
   * @param _parent    - The document with directly modified embedded documents.
   *                     Either this document or a descendant of this one.
   * @internal
   */
  protected _dispatchDescendantDocumentEvents(
    event: ClientDocument.LifeCycleEventName,
    collection: string,
    args: unknown[],
    _parent: Document.Any,
  ): void;

  // TODO: Improve the data typing
  /**
   * Actions taken after descendant documents have been created, but before changes are applied to the client data.
   * @param parent     - The direct parent of the created Documents, may be this Document or a child
   * @param collection - The collection within which documents are being created
   * @param data       - The source data for new documents that are being created
   * @param options    - Options which modified the creation operation
   * @param userId     - The ID of the User who triggered the operation
   * @privateRemarks Make generic over `collection`
   */
  protected _preCreateDescendantDocuments(
    parent: Document.Any,
    collection: string,
    data: unknown[],
    options: Document.Database.CreateOptions<DatabaseCreateOperation>,
    userId: string,
  ): void;

  /**
   * Actions taken after descendant documents have been created and changes have been applied to client data.
   * @param parent     - The direct parent of the created Documents, may be this Document or a child
   * @param collection - The collection within which documents were created
   * @param documents  - The array of created Documents
   * @param data       - The source data for new documents that were created
   * @param options    - Options which modified the creation operation
   * @param userId     - The ID of the User who triggered the operation
   */
  protected _onCreateDescendantDocuments(
    parent: Document.Any,
    collection: string,
    documents: never,
    data: unknown[],
    options: Document.Database.CreateOptions<DatabaseCreateOperation>,
    userId: string,
  ): void;

  /**
   * Actions taken after descendant documents have been updated, but before changes are applied to the client data.
   * @param parent - The direct parent of the updated Documents, may be this Document or a child
   * @param collection - The collection within which documents are being updated
   * @param changes - The array of differential Document updates to be applied
   * @param options - Options which modified the update operation
   * @param userId - The ID of the User who triggered the operation
   */
  protected _preUpdateDescendantDocuments(
    parent: Document.Any,
    collection: string,
    changes: unknown[],
    options: Document.Database.UpdateOptions<DatabaseUpdateOperation>,
    userId: string,
  ): void;

  /**
   * Actions taken after descendant documents have been updated and changes have been applied to client data.
   * @param parent - The direct parent of the updated Documents, may be this Document or a child
   * @param collection - The collection within which documents were updated
   * @param documents - The array of updated Documents
   * @param changes - The array of differential Document updates which were applied
   * @param options - Options which modified the update operation
   * @param userId - The ID of the User who triggered the operation
   */
  protected _onUpdateDescendantDocuments(
    parent: Document.Any,
    collection: string,
    documents: never,
    changes: unknown[],
    options: Document.Database.UpdateOptions<DatabaseUpdateOperation>,
    userId: string,
  ): void;

  /**
   * Actions taken after descendant documents have been deleted, but before deletions are applied to the client data.
   * @param parent - The direct parent of the deleted Documents, may be this Document or a child
   * @param collection - The collection within which documents were deleted
   * @param ids - The array of document IDs which were deleted
   * @param options - Options which modified the deletion operation
   * @param userId - The ID of the User who triggered the operation
   */
  protected _preDeleteDescendantDocuments(
    parent: Document.Any,
    collection: string,
    ids: string[],
    options: Document.Database.DeleteOptions<DatabaseDeleteOperation>,
    userId: string,
  ): void;

  /**
   * Actions taken after descendant documents have been deleted and those deletions have been applied to client data.
   * @param parent - The direct parent of the deleted Documents, may be this Document or a child
   * @param collection - The collection within which documents were deleted
   * @param documents - The array of Documents which were deleted
   * @param ids - The array of document IDs which were deleted
   * @param options - Options which modified the deletion operation
   * @param userId - The ID of the User who triggered the operation
   */
  protected _onDeleteDescendantDocuments(
    parent: Document.Any,
    collection: string,
    documents: never,
    ids: string[],
    options: Document.Database.DeleteOptions<DatabaseDeleteOperation>,
    userId: string,
  ): void;

  /**
   * Whenever the Document's sheet changes, close any existing applications for this Document, and re-render the new
   * sheet if one was already open.
   */
  protected _onSheetChange(options?: ClientDocument.OnSheetChangeOptions): Promise<void>;

  /**
   * Gets the default new name for a Document
   * @param context - The context for which to create the Document name.
   */
  static defaultName(context: Document.DefaultNameContext<never, never>): string;

  /**
   * Present a Dialog form to create a new Document of this type.
   * Choose a name and a type from a select menu of types.
   * @param data    - Initial data with which to populate the creation form
   *                  (default: `{}`)
   * @param context - Additional context options or dialog positioning options
   *                  (default: `{}`)
   * @returns A Promise which resolves to the created Document, or null if the dialog was
   *          closed.
   */
  static createDialog(data: never, context: never): Promise<unknown>;

  /**
   * Present a Dialog form to confirm deletion of this Document.
   * @param options - Positioning and sizing options for the resulting dialog
   *                  (default: `{}`)
   * @returns A Promise which resolves to the deleted Document
   */
  deleteDialog(options?: Partial<Dialog.Options>): Promise<this | false | null | undefined>;

  /**
   * Export document data to a JSON file which can be saved by the client and later imported into a different session.
   * @param options - Additional options passed to the {@link ClientDocument.toCompendium | `ClientDocument#toCompendium`} method
   */
  exportToJSON(options?: ClientDocument.ToCompendiumOptions): void;

  /**
   * Serialize salient information about this Document when dragging it.
   */
  toDragData(): Document.DropData<Document.Internal.Instance.Complete<BaseDocument>>;

  /**
   * A helper function to handle obtaining the relevant Document from dropped data provided via a DataTransfer event.
   * The dropped data could have:
   * 1. A data object explicitly provided
   * 2. A UUID
   *
   * @param data    - The data object extracted from a DataTransfer event
   * @param options - Additional options which affect drop data behavior
   * @returns The resolved Document
   * @throws If a Document could not be retrieved from the provided data.
   */
  static fromDropData(data: Document.DropData<never>, options?: Document.FromDropDataOptions): Promise<unknown>;

  /**
   * Create the Document from the given source with migration applied to it.
   * Only primary Documents may be imported.
   *
   * This function must be used to create a document from data that predates the current core version.
   * It must be given nonpartial data matching the schema it had in the core version it is coming from.
   * It applies legacy migrations to the source data before calling {@link Document.fromSource | `Document.fromSource`}.
   * If this function is not used to import old data, necessary migrations may not applied to the data
   * resulting in an incorrectly imported document.
   *
   * The core version is recorded in the `_stats` field, which all primary documents have. If the given source data
   * doesn't contain a `_stats` field, the data is assumed to be pre-V10, when the `_stats` field didn't exist yet.
   * The `_stats` field must not be stripped from the data before it is exported!
   * @param source - The document data that is imported.
   * @param context - The model construction context passed to {@link Document.fromSource | `Document.fromSource`}.
   *                  (default: `context.strict=true`) Strict validation is enabled by default.
   */
  static fromImport(source: never, context?: never): Promise<unknown>;

  /**
   * Update this Document using a provided JSON string.
   * @param json - JSON data string
   * @returns The updated Document instance
   */
  importFromJSON(json: string): Promise<this>;

  /**
   * Render an import dialog for updating the data related to this Document through an exported JSON file
   */
  importFromJSONDialog(): Promise<void>;

  /**
   * Transform the Document data to be stored in a Compendium pack.
   * Remove any features of the data which are world-specific.
   * @param pack    - A specific pack being exported to
   * @param options - Additional options which modify how the document is converted
   *                  (default: `{}`)
   * @returns A data object of cleaned data suitable for compendium import
   */
  toCompendium<Options extends ClientDocument.ToCompendiumOptions>(
    pack?: CompendiumCollection<CompendiumCollection.Metadata> | null,
    options?: Options,
  ): ClientDocument.ToCompendiumReturnType<BaseDocument, Options>;

  /**
   * Create a content link for this Document.
   * @param options - Additional options to configure how the link is constructed.
   */
  toAnchor(options?: TextEditor.EnrichmentAnchorOptions): HTMLAnchorElement;

  /**
   * Convert a Document to some HTML display for embedding purposes.
   * @param config  - Configuration for embedding behavior.
   * @param options - The original enrichment options for cases where the Document embed content also contains text that must be enriched.
   * @returns A representation of the Document as HTML content, or null if such a representation could not be generated.
   */
  toEmbed(
    config: TextEditor.DocumentHTMLEmbedConfig,
    options?: TextEditor.EnrichmentOptions,
  ): Promise<HTMLElement | null>;

  /**
   * A method that can be overridden by subclasses to customize embedded HTML generation.
   * @param config  - Configuration for embedding behavior.
   * @param options - The original enrichment options for cases where the Document embed content also contains text that must be enriched.
   * @returns Either a single root element to append, or a collection of elements that comprise the embedded content
   */
  protected _buildEmbedHTML(
    config: TextEditor.DocumentHTMLEmbedConfig,
    options?: TextEditor.EnrichmentOptions,
  ): Promise<HTMLElement | HTMLCollection | null>;

  /**
   * A method that can be overridden by subclasses to customize inline embedded HTML generation.
   * @param content - The embedded content.
   * @param config  - Configuration for embedding behavior.
   * @param options - The original enrichment options for cases where the Document embed content also contains text that must be enriched.
   */
  protected _createInlineEmbed(
    content: HTMLElement | HTMLCollection,
    config: TextEditor.DocumentHTMLEmbedConfig,
    options?: TextEditor.EnrichmentOptions,
  ): Promise<HTMLElement | null>;

  /**
   * A method that can be overridden by subclasses to customize the generation of the embed figure.
   * @param content - The embedded content.
   * @param config  - Configuration for embedding behavior.
   * @param options - The original enrichment options for cases where the Document embed content also contains text that must be enriched.
   */
  protected _createFigureEmbed(
    content: HTMLElement | HTMLCollection,
    config: TextEditor.DocumentHTMLEmbedConfig,
    options?: TextEditor.EnrichmentOptions,
  ): Promise<HTMLElement | null>;

  /**
   * Preliminary actions taken before a set of embedded Documents in this parent Document are created.
   * @param embeddedName - The name of the embedded Document type
   * @param result       - An Array of created data objects
   * @param options      - Options which modified the creation operation
   * @param userId       - The ID of the User who triggered the operation
   * @deprecated since v11
   */
  protected _preCreateEmbeddedDocuments(
    embeddedName: string,
    result: AnyObject[],
    options: Document.ModificationOptions,
    userId: string,
  ): void;

  /**
   * Follow-up actions taken after a set of embedded Documents in this parent Document are created.
   * @param embeddedName - The name of the embedded Document type
   * @param documents    - An Array of created Documents
   * @param result       - An Array of created data objects
   * @param options      - Options which modified the creation operation
   * @param userId       - The ID of the User who triggered the operation
   * @deprecated since v11
   */
  protected _onCreateEmbeddedDocuments(
    embeddedName: string,
    documents: never,
    result: AnyObject[],
    options: Document.ModificationOptions,
    userId: string,
  ): void;

  /**
   * Preliminary actions taken before a set of embedded Documents in this parent Document are updated.
   * @param embeddedName - The name of the embedded Document type
   * @param result       - An Array of incremental data objects
   * @param options      - Options which modified the update operation
   * @param userId       - The ID of the User who triggered the operation
   * @deprecated since v11
   */
  protected _preUpdateEmbeddedDocuments(
    embeddedName: string,
    result: AnyObject[],
    options: Document.ModificationOptions,
    userId: string,
  ): void;

  /**
   * Follow-up actions taken after a set of embedded Documents in this parent Document are updated.
   * @param embeddedName - The name of the embedded Document type
   * @param documents    - An Array of updated Documents
   * @param result       - An Array of incremental data objects
   * @param options      - Options which modified the update operation
   * @param userId       - The ID of the User who triggered the operation
   * @deprecated since v11
   */
  protected _onUpdateEmbeddedDocuments(
    embeddedName: string,
    documents: never,
    result: AnyObject[],
    options: Document.ModificationContext<Document.Any | null>,
    userId: string,
  ): void;

  /**
   * Preliminary actions taken before a set of embedded Documents in this parent Document are deleted.
   * @param embeddedName - The name of the embedded Document type
   * @param result       - An Array of document IDs being deleted
   * @param options      - Options which modified the deletion operation
   * @param userId       - The ID of the User who triggered the operation
   * @deprecated since v11
   */
  protected _preDeleteEmbeddedDocuments(
    embeddedName: string,
    result: string[],
    options: Document.ModificationContext<Document.Any | null>,
    userId: string,
  ): void;

  /**
   * Follow-up actions taken after a set of embedded Documents in this parent Document are deleted.
   * @param embeddedName - The name of the embedded Document type
   * @param documents    - An Array of deleted Documents
   * @param result       - An Array of document IDs being deleted
   * @param options      - Options which modified the deletion operation
   * @param userId       - The ID of the User who triggered the operation
   * @deprecated since v11
   */
  protected _onDeleteEmbeddedDocuments(
    embeddedName: string,
    documents: never,
    result: string[],
    options: Document.ModificationContext<Document.Any | null>,
    userId: string,
  ): void;
}

type _ClientDocumentType = InternalClientDocument & Document.AnyConstructor;
declare const _ClientDocument: _ClientDocumentType;

type ClientDocumentMixinBaseClass = Document.Internal.Constructor;

declare global {
  /**
   * This class does not really exist at runtime. It's here for types only.
   */
  class ClientDocument extends _ClientDocument {
    // This may have be removed at some point in the future if it causes issues but the idea is to
    // prevent operations like `new ClientDocument()` or `extends ClientDocument` because this does
    // is not a class that really exists at runtime.
    private constructor(...args: any[]);
  }

  /**
   * A mixin which extends each Document definition with specialized client-side behaviors.
   * This mixin defines the client-side interface for database operations and common document behaviors.
   */
  // FIXME(LukeAbby): Unlike most mixins, `ClientDocumentMixin` actually requires a specific constructor, the same as `Document`.
  // This means that `BaseClass extends Document.Internal.Constructor` is actually too permissive.
  // However this easily leads to circularities.
  //
  // Note(LukeAbby): The seemingly redundant merging in of `typeof AnyDocument` makes it easier for tsc to recognize that anything extending `ClientDocumentMixin` is also a document.
  function ClientDocumentMixin<BaseClass extends Document.Internal.Constructor>(
    Base: BaseClass,
  ): Mixin<typeof InternalClientDocument<FixedInstanceType<BaseClass>>, BaseClass>;

  namespace ClientDocument {
    interface SortOptions<T, SortKey extends string = "sort"> extends SortingHelpers.SortOptions<T, SortKey> {
      /**
       * Additional data changes which are applied to each sorted document
       * @defaultValue `{}`
       */
      updateData?: any;
    }

    // TODO: This may be better defined elsewhere
    type LifeCycleEventName = "preCreate" | "onCreate" | "preUpdate" | "onUpdate" | "preDelete" | "onDelete";

    // Note(LukeAbby): If the property could be omitted it is. This is the safest option because in indeterminate cases access would be unsafe.
    // In the future the indeterminate case could turn the property optional but that isn't done today because that's annoying to do for little benefit.
    /** @internal */
    type _OmitProperty<Omit extends boolean | undefined, Default extends boolean, ToOmit extends string> = Omit extends
      | true
      | (Default extends true ? undefined : never)
      ? ToOmit
      : never;

    interface ToCompendiumOptions {
      /**
       * Clear the flags object
       * @defaultValue `false`
       */
      clearFlags?: boolean | undefined;

      /**
       * Clear any prior source information
       * @defaultValue `true`
       */
      clearSource?: boolean | undefined;

      /**
       * Clear the currently assigned folder and sort order
       * @defaultValue `true`
       */
      clearSort?: boolean | undefined;

      /**
       * Clear the currently assigned folder
       * @defaultValue `false`
       */
      clearFolder?: boolean | undefined;

      /**
       * Clear document ownership
       * @defaultValue `true`
       */
      clearOwnership?: boolean | undefined;

      /**
       * Clear fields which store document state
       * @defaultValue `true`
       */
      clearState?: boolean | undefined;

      /**
       * Retain the current Document id
       * @defaultValue `false`
       */
      keepId?: boolean | undefined;
    }

    interface CreateDocumentLinkOptions {
      /**
       * A document to generate a link relative to.
       */
      relativeTo?: ClientDocument | undefined;

      /**
       * A custom label to use instead of the document's name.
       */
      label?: string | undefined;
    }

    type ToCompendiumReturnType<
      BaseDocument extends Document.Internal.Instance.Any,
      Options extends ToCompendiumOptions,
    > = _ToCompendiumReturnType<
      Options["clearSource"],
      Omit<
        Document.Internal.Instance.Complete<BaseDocument>["_source"],
        | ClientDocument._OmitProperty<Options["clearFlags"], false, "flags">
        | ClientDocument._OmitProperty<Options["clearSort"], true, "sort" | "navigation" | "navOrder"> // helping out Scene
        | ClientDocument._OmitProperty<Options["clearFolder"], true, "folder">
        | ClientDocument._OmitProperty<Options["clearOwnership"], true, "ownership">
        | ClientDocument._OmitProperty<Options["clearState"], true, "active" | "fogReset" | "playing"> // helping out Playlist, Scene
        | (Options["keepId"] extends true ? never : "_id")
      >
    >;

    type _ToCompendiumReturnType<ClearSource extends boolean | undefined, SourceData extends object> = [
      Coalesce<ClearSource, true>,
    ] extends [true]
      ? {
          [K in keyof SourceData]: "_stats" extends K
            ? Omit<SourceData[K], "compendiumSource" | "duplicateSource">
            : never;
        }
      : SourceData;

    interface OnSheetChangeOptions {
      /**
       * Whether the sheet was originally open and needs to be re-opened.
       */
      sheetOpen?: boolean | undefined;
    }
  }
}

// This is yet another `AnyDocument` type.
// It exists specifically because the `Document.AnyConstructor` type is too safe to be merged in with a mixin.
// The `...args: never` trick trips up the base constructor check and so this one with an actual `...args: any[]` one is used instead.
//
// `{}` is used to avoid merging `DataSchema` with the real schema.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
declare class AnyDocument extends Document<Document.Type, {}, Document.Any | null> {
  constructor(...args: any[]);

  getFlag(scope: never, key: never): any;
}
