import type {
  Mixin,
  FixedInstanceType,
  Coalesce,
  AnyObject,
  Identity,
  MaybePromise,
  NullishProps,
  NullishCoalesce,
  InexactPartial,
} from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { Application, FormApplication } from "#client/appv1/api/_module.d.mts";
import type { ApplicationV2 } from "#client/applications/api/_module.d.mts";
import type TextEditor from "#client/applications/ux/text-editor.mjs";

declare class InternalClientDocument<DocumentName extends Document.Type> {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * A collection of Application instances which should be re-rendered whenever this document is updated.
   * The keys of this object are the application ids and the values are Application instances.
   * @defaultValue `{}`
   * @remarks Created during construction via `defineProperty`, with options `{value: {}, writable: false, enumerable: false}`
   */
  readonly apps: Record<string, Application.Any | ApplicationV2.Any>;

  /**
   * A cached reference to the Application instance used to configure this Document.
   * @defaultValue `null`
   * @remarks Created during construction via `defineProperty`, with options `{value: null, writable: true, enumerable: false}`
   * @internal
   */
  protected readonly _sheet: FixedInstanceType<Document.SheetClassFor<DocumentName>> | null;

  static name: "ClientDocumentMixin";

  /**
   * @see {@link foundry.abstract.Document._initialize | `abstract.Document#_initialize`}
   * @remarks ClientDocument override calls `super`, then if `game._documentsReady`, calls {@link InternalClientDocument._safePrepareData | `this._safePrepareData`}
   */
  // options: not null (parameter default only)
  protected _initialize(options?: Document.InitializeOptions): void;

  /**
   * Return a reference to the parent Collection instance which contains this Document.
   */
  get collection(): Collection<this> | null;

  /**
   * A reference to the Compendium Collection which contains this Document, if any, otherwise undefined.
   */
  get compendium(): DocumentName extends foundry.documents.collections.CompendiumCollection.DocumentName
    ? foundry.documents.collections.CompendiumCollection<DocumentName>
    : null;

  /**
   * Is this document in a compendium? A stricter check than {@link Document.inCompendium | `Document#inCompendium`}.
   */
  // Note(LukeAbby): See https://github.com/microsoft/TypeScript/issues/61967
  // get inCompendium(): boolean;

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
  get permission(): CONST.DOCUMENT_OWNERSHIP_LEVELS | null;

  /**
   * Lazily obtain a FormApplication instance used to configure this Document, or null if no sheet is available.
   */
  get sheet(): FormApplication.Any | ApplicationV2.Any | null;

  /**
   * A boolean indicator for whether or not the current game User has at least limited visibility for this Document.
   * Different Document types may have more specialized rules for what determines visibility.
   */
  get visible(): boolean;

  /**
   * Obtain the FormApplication class constructor which should be used to configure this Document.
   */
  protected _getSheetClass(): FormApplication.AnyConstructor | ApplicationV2.AnyConstructor | null;

  /**
   * Safely prepare data for a Document, catching any errors.
   */
  protected _safePrepareData(): void;

  /**
   * Prepare data for the Document. This method provides an opportunity for Document classes to define special data
   * preparation logic to compute values that don't need to be stored in the database, such as a "bloodied" hp value
   * or the total carrying weight of items. The work done by this method should be idempotent per initialization.
   * There are situations in which prepareData may be called more than once.
   *
   * By default, foundry calls the following methods in order whenever the document is created or updated.
   * 1. {@linkcode foundry.abstract.DataModel.reset | reset} (Inherited from DataModel)
   * 2. {@linkcode _initialize} (Inherited from DataModel)
   * 3. {@linkcode prepareData}
   * 4. {@linkcode foundry.abstract.TypeDataModel.prepareBaseData | TypeDataModel#prepareBaseData}
   * 5. {@linkcode prepareBaseData}
   * 6. {@linkcode prepareEmbeddedDocuments}
   * 7. {@linkcode foundry.abstract.TypeDataModel.prepareDerivedData | TypeDataModel#prepareBaseData}
   * 8. {@linkcode prepareDerivedData}
   *
   * Do NOT invoke database operations like {@linkcode Document.update | update} or {@linkcode Document.setFlag | setFlag} within data prep, as that can cause an
   * infinite loop by re-triggering the data initialization process.
   *
   * If possible you should extend {@linkcode prepareBaseData} and {@linkcode prepareDerivedData} instead of this function
   * directly, but some systems with more complicated calculations may want to override this function to add extra
   * steps, such as to calculate certain item values after actor data prep.
   */
  prepareData(): void;

  /**
   * Prepare data related to this Document itself, before any embedded Documents or derived data is computed.
   *
   * If possible when modifying the `system` object you should use {@linkcode foundry.abstract.TypeDataModel.prepareBaseData | TypeDataModel#prepareBaseData} on
   * your data models instead of this method directly on the document.
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
   * @see {@link foundry.applications.api.ApplicationV2.render | `foundry.applications.api.ApplicationV2#render`}
   * @param force   - Force rendering
   *                  (default: `false`)
   * @param context - Optional context
   *                  (default: `{}`)
   */
  render(force?: boolean, context?: Application.RenderOptions | ApplicationV2.RenderOptions): void;

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
  getRelativeUUID(relative: ClientDocument): string;

  /**
   * Create a content link for this document
   * @param eventData - The parsed object of data provided by the drop transfer event.
   * @param options   - Additional options to configure link generation.
   * @remarks Core's implementation doesn't use `eventData` here, but when it's passed in it's the return from
   * {@link TextEditor.getDragEventData | `TextEditor.getDragEventData(someDragEvent)`}
   */
  // options: not null (destructured)
  _createDocumentLink(eventData?: AnyObject | null, options?: ClientDocument.CreateDocumentLinkOptions): string;

  /**
   * Handle clicking on a content link for this document.
   * @param event - The triggering click event.
   * @remarks
   * In `ClientDocument`, returns `this.sheet.render(true)`:
   * - AppV1: returns that sheet
   * - AppV2: returns a Promise of that sheet
   *
   * However it unfortunately has to be typed as `MaybePromise<unknown>` due to the {@link Macro._onClickDocumentLink | `Macro`} override,
   * where `##executeScript` could return whatever a user-provided macro wants.
   */
  _onClickDocumentLink(event: MouseEvent): MaybePromise<unknown>;

  // _preCreate, _preUpdate, and _preDelete are all overridden with no signature changes,
  // just to call `this.system._preX` if `super` doesn't return `false`

  //  _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
  // For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.

  /**
   * Orchestrate dispatching descendant document events to parent documents when embedded children are modified.
   * @param event      - The event name, preCreate, onCreate, etc...
   * @param collection - The collection name being modified within this parent document
   * @param args       - Arguments passed to each dispatched function
   * @param _parent    - The document with directly modified embedded documents.
   *                     Either this document or a descendant of this one.
   * @internal
   * @remarks This has not been typed per-document as there does not appear to be a reason for users to ever extend or call this method.
   * If you have a use case for this, please file an issue.
   */
  protected _dispatchDescendantDocumentEvents(
    event: ClientDocument.LifeCycleEventName,
    collection: string,
    args: never,
    _parent: never,
  ): void;

  /**
   * Actions taken after descendant documents have been created, but before changes are applied to the client data.
   * @param parent     - The direct parent of the created Documents, may be this Document or a child
   * @param collection - The collection within which documents are being created
   * @param data       - The source data for new documents that are being created
   * @param options    - Options which modified the creation operation
   * @param userId     - The ID of the User who triggered the operation
   *
   * @remarks
   * To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   *
   * ```ts
   * class SwadeCards extends Cards {
   *   protected override _preCreateDescendantDocuments(...args: Cards.PreCreateDescendantDocumentsArgs) {
   *     super._preCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, data, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected _preCreateDescendantDocuments(
    parent: never,
    collection: never,
    data: never,
    options: never,
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
   *
   * @remarks
   * To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   *
   * ```ts
   * class GurpsCards extends Cards {
   *   protected override _onCreateDescendantDocuments(...args: Cards.OnCreateDescendantDocumentsArgs) {
   *     super._onCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, data, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected _onCreateDescendantDocuments(
    parent: never,
    collection: never,
    documents: never,
    data: never,
    options: never,
    userId: string,
  ): void;

  /**
   * Actions taken after descendant documents have been updated, but before changes are applied to the client data.
   * @param parent - The direct parent of the updated Documents, may be this Document or a child
   * @param collection - The collection within which documents are being updated
   * @param changes - The array of differential Document updates to be applied
   * @param options - Options which modified the update operation
   * @param userId - The ID of the User who triggered the operation
   *
   * @remarks
   * To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   *
   * ```ts
   * class LancerCards extends Cards {
   *   protected override _preUpdateDescendantDocuments(...args: Cards.OnUpdateDescendantDocuments) {
   *     super._preUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, changes, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected _preUpdateDescendantDocuments(
    parent: never,
    collection: never,
    changes: never,
    options: never,
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
   *
   * @remarks
   * To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   *
   * ```ts
   * class Ptr2eCards extends Cards {
   *   protected override _onUpdateDescendantDocuments(...args: Cards.OnUpdateDescendantDocumentsArgs) {
   *     super._onUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, changes, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected _onUpdateDescendantDocuments(
    parent: never,
    collection: never,
    documents: never,
    changes: never,
    options: never,
    userId: string,
  ): void;

  /**
   * Actions taken after descendant documents have been deleted, but before deletions are applied to the client data.
   * @param parent - The direct parent of the deleted Documents, may be this Document or a child
   * @param collection - The collection within which documents were deleted
   * @param ids - The array of document IDs which were deleted
   * @param options - Options which modified the deletion operation
   * @param userId - The ID of the User who triggered the operation
   *
   * @remarks
   * To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   *
   * ```ts
   * class KultCards extends Cards {
   *   protected override _preDeleteDescendantDocuments(...args: Cards.PreDeleteDescendantDocumentsArgs) {
   *     super._preDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, ids, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected _preDeleteDescendantDocuments(
    parent: never,
    collection: never,
    ids: never,
    options: never,
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
   *
   * @remarks
   * To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   *
   * ```ts
   * class BladesCards extends Cards {
   *   protected override _onDeleteDescendantDocuments(...args: Cards.OnUpdateDescendantDocuments) {
   *     super._onDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, ids, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected _onDeleteDescendantDocuments(
    parent: never,
    collection: never,
    documents: never,
    ids: string[],
    options: never,
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
   *
   * @privateRemarks Specific document overrides for non-{@link CONST.PRIMARY_DOCUMENT_TYPES | primary} documents should make `context`
   * required, as they require a passed `parent`
   */
  static defaultName(context: never): string;

  /**
   * Present a Dialog form to create a new Document of this type.
   * Choose a name and a type from a select menu of types.
   * @param data          - Document creation data               (default: `{}`)
   * @param createOptions - Document creation options            (default: `{}`)
   * @param options       - Options forwarded to DialogV2.prompt (default: `{}`)
   * @returns A Promise which resolves to the created Document, or null if the dialog was closed.
   *
   * @remarks
   * @throws If the passed {@linkcode Document.CreateDialogOptions.types} whitelist does not contain any valid, non-{@linkcode CONST.BASE_DOCUMENT_TYPE}
   * types.
   *
   * @privateRemarks `| undefined` is included in the return types of the specific document overrides due to {@linkcode Document.create}
   * possibly being `undefined` if creation is cancelled by preCreate methods or hooks.
   *
   * Specific document overrides for non-{@link CONST.PRIMARY_DOCUMENT_TYPES | primary} documents should make `createOptions` required, as
   * they require a passed `parent`
   *
   * This returns `Promise<unknown>` here because as of 13.350 there's a bug ({@link https://github.com/foundryvtt/foundryvtt/issues/13545})
   * in {@linkcode Folder.createDialog}.
   */
  static createDialog(data?: never, createOptions?: never, options?: never): Promise<unknown>;

  /**
   * Present a Dialog form to confirm deletion of this Document.
   * @param options   - Additional options passed to {@linkcode DialogV2.confirm} (default: `{}`)
   * @param operation - Document deletion options. (default: `{}`)
   * @returns A Promise that resolves to the deleted Document
   *
   * @remarks The only part of the {@linkcode DialogV2.ConfirmConfig} that one should be cautious passing is `"yes.callback"`, which actually does the delete.
   *
   * `"yes"` is in the computed return type because if deletion is cancelled by hook or {@linkcode Document._preDelete | Document#_preDelete}, the `yes` callback returns
   * undefined, and when button callbacks return undefined, the button's action is returned.
   */
  deleteDialog(options?: never, operation?: never): Promise<Document.DeleteDialogReturn<Document.Any, undefined>>;

  /**
   * Export document data to a JSON file which can be saved by the client and later imported into a different session.
   * @param options - Additional options passed to the {@linkcode ClientDocumentMixin.AnyMixed.toCompendium | ClientDocument#toCompendium} method
   */
  exportToJSON(options?: ClientDocument.ToCompendiumOptions): void;

  /**
   * Serialize salient information about this Document when dragging it.
   */
  toDragData(): Document.DropDataFor<DocumentName>;

  /**
   * A helper function to handle obtaining the relevant Document from dropped data provided via a DataTransfer event.
   * The dropped data could have:
   * 1. A data object explicitly provided
   * 2. A UUID
   *
   * @param data    - The data object extracted from a DataTransfer event
   * @returns The resolved Document
   * @throws If a Document could not be retrieved from the provided data.
   */
  // data is `never` here because specific documents must override to be accurate
  static fromDropData(data: never): Promise<unknown>;

  /**
   * Create the Document from the given source with migration applied to it.
   * Only primary Documents may be imported.
   *
   * This function must be used to create a document from data that predates the current core version.
   * It must be given nonpartial data matching the schema it had in the core version it is coming from.
   * It applies legacy migrations to the source data before calling {@linkcode Document.fromSource}.
   * If this function is not used to import old data, necessary migrations may not applied to the data
   * resulting in an incorrectly imported document.
   *
   * The core version is recorded in the `_stats` field, which all primary documents have. If the given source data
   * doesn't contain a `_stats` field, the data is assumed to be pre-V10, when the `_stats` field didn't exist yet.
   * The `_stats` field must not be stripped from the data before it is exported!
   * @param source - The document data that is imported.
   * @param context - The model construction context passed to {@linkcode Document.fromSource}.
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
   * @param options - Additional options which modify how the document is converted (default: `{}`)
   * @returns A data object of cleaned data suitable for compendium import
   */
  // options: not null (destructured)
  toCompendium<Options extends ClientDocument.ToCompendiumOptions | undefined = undefined>(
    pack?: foundry.documents.collections.CompendiumCollection<foundry.documents.collections.CompendiumCollection.DocumentName> | null,
    options?: Options,
  ): ClientDocument.ToCompendiumReturnType<DocumentName, Options>;

  /**
   * Create a content link for this Document.
   * @param options - Additional options to configure how the link is constructed.
   */
  // options: not null (parameter default only)
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
   * Specific callback actions to take when the embedded HTML for this document has been added to the DOM.
   * @param element - The embedded document HTML
   */
  onEmbed(element: foundry.applications.elements.HTMLDocumentEmbedElement): void;

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
}

type _ClientDocumentType = InternalClientDocument<Document.Type> & Document.AnyConstructor;
declare const _ClientDocument: _ClientDocumentType;

/**
 * A mixin which extends each Document definition with specialized client-side behaviors.
 * This mixin defines the client-side interface for database operations and common document behaviors.
 */
// FIXME(LukeAbby): Unlike most mixins, `ClientDocumentMixin` actually requires a specific constructor, the same as `Document`.
// This means that `BaseClass extends Document.Internal.Constructor` is actually too permissive.
// However this easily leads to circularities.
declare function ClientDocumentMixin<BaseClass extends ClientDocumentMixin.BaseClass>(
  Base: BaseClass,
): ClientDocumentMixin.Mix<BaseClass>;

declare namespace ClientDocumentMixin {
  interface AnyMixedConstructor extends ReturnType<typeof foundry.documents.abstract.ClientDocumentMixin<BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = Document.Internal.Constructor;

  type Mix<BaseClass extends Document.Internal.Constructor> = Mixin<
    typeof InternalClientDocument<Document.NameFor<BaseClass>>,
    BaseClass
  >;
}

// TODO: Namespaces typically match the Mixin, not the non-exported class, but we're exporting the class for type reasons,
// TODO: so this is an exception?
declare global {
  interface ClientDocument extends FixedInstanceType<typeof _ClientDocument> {}
  interface ClientDocumentConstructor extends Identity<typeof _ClientDocument> {}

  namespace ClientDocument {
    interface SortOptions<T, SortKey extends string = "sort"> extends foundry.utils.SortOptions<T, SortKey> {
      /**
       * Additional data changes which are applied to each sorted document
       * @defaultValue `{}`
       */
      updateData?: AnyObject;
    }

    // TODO: This may be better defined elsewhere
    type LifeCycleEventName = "preCreate" | "onCreate" | "preUpdate" | "onUpdate" | "preDelete" | "onDelete";

    // Note(LukeAbby): If the property could be omitted it is. This is the safest option because in indeterminate cases access would be unsafe.
    // In the future the indeterminate case could turn the property optional but that isn't done today because that's annoying to do for little benefit.

    /** @internal */
    type _OmitProperty<
      Omit extends boolean | null | undefined,
      Default extends boolean,
      ToOmit extends string,
    > = Omit extends true | (Default extends true ? undefined : never) ? ToOmit : never;

    /** @internal */
    type _ToCompendiumOptions = NullishProps<{
      /**
       * Clear the flags object
       * @defaultValue `false`
       */
      clearFlags: boolean;

      /**
       * Clear any prior source information
       * @defaultValue `true`
       * @remarks Deletes `_stats.compendiumSource` and `_stats.duplicateSource`, won't delete legacy source flags
       */
      clearSource: boolean;

      /**
       * Clear the currently assigned folder and sort order
       * @defaultValue `true`
       */
      clearSort: boolean;

      /**
       * Clear the currently assigned folder
       * @defaultValue `false`
       */
      clearFolder: boolean;

      /**
       * Clear document ownership
       * @defaultValue `true`
       */
      clearOwnership: boolean;

      /**
       * Clear fields which store document state
       * @defaultValue `true`
       */
      clearState: boolean;

      /**
       * Retain the current Document id
       * @defaultValue `false`
       */
      keepId: boolean;
    }>;

    interface ToCompendiumOptions extends _ToCompendiumOptions {}

    /** @internal */
    type _CreateDocumentLinkOptions = NullishProps<{
      /**
       * A document to generate a link relative to.
       * @remarks Ignored if falsey
       */
      relativeTo: ClientDocument;

      /**
       * A custom label to use instead of the document's name.
       * @defaultValue `this.name`
       */
      label: string;
    }>;

    interface CreateDocumentLinkOptions extends _CreateDocumentLinkOptions {}

    /** The return type of {@link ClientDocument._onClickDocumentLink | `ClientDocument#_onClickDocumentLink`} if not overridden */
    type OnClickDocumentLinkReturn = FormApplication.Any | Promise<ApplicationV2.Any>;

    type ToCompendiumReturnType<
      DocumentName extends Document.Type,
      Options extends ToCompendiumOptions | undefined,
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    > = _ToCompendiumReturnType<DocumentName, Coalesce<Options, {}>>;

    // TODO: `ownership` and the `_stats` sources are recursively removed from descendent document sources, not just the top level
    type _ToCompendiumReturnType<DocumentName extends Document.Type, Options extends ToCompendiumOptions> = _ClearFog<
      Options["clearState"],
      _ClearStats<
        Options["clearSource"],
        Omit<
          Document.ImplementationFor<DocumentName>["_source"],
          | ClientDocument._OmitProperty<Options["clearFlags"], false, "flags">
          | ClientDocument._OmitProperty<Options["clearSort"], true, "sort" | "navigation" | "navOrder"> // helping out Scene
          | ClientDocument._OmitProperty<Options["clearFolder"], true, "folder">
          | ClientDocument._OmitProperty<Options["clearOwnership"], true, "ownership">
          | ClientDocument._OmitProperty<Options["clearState"], true, "active" | "playing"> // helping out Playlist, Scene
          | (Options["keepId"] extends true ? never : "_id")
        >
      >
    >;

    /** @internal */
    type _ClearStats<ClearSource extends boolean | null | undefined, SourceData extends object> = [
      NullishCoalesce<ClearSource, true>,
    ] extends [true]
      ? {
          [K in keyof SourceData]: "_stats" extends K
            ? Omit<SourceData[K], "compendiumSource" | "duplicateSource">
            : never;
        }
      : SourceData;

    /** @internal */
    type _ClearFog<ClearState extends boolean | null | undefined, SourceData extends object> = [
      NullishCoalesce<ClearState, true>,
    ] extends [true]
      ? {
          [K in keyof SourceData]: "fog" extends K ? Omit<SourceData[K], "reset"> : never;
        }
      : SourceData;

    /** @internal */
    interface _OnSheetChangeOptions {
      /** Whether the sheet was originally open and needs to be re-opened. */
      sheetOpen: boolean;
    }

    interface OnSheetChangeOptions extends InexactPartial<_OnSheetChangeOptions> {}
  }
}

// declare class Foo<out DocumentName extends Document.Type> {
//   x: Document.Database2.UpdateManyDocumentsOperationForName<DocumentName>;
// }

export { ClientDocumentMixin as default, InternalClientDocument };
