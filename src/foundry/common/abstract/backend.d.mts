import type { InexactPartial, FixedInstanceType, LoggingLevels, Identity, IntentionalPartial, AnyObject } from "#utils";
import type Document from "./document.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `CompendiumCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin, DocumentCollection } from "#client/documents/abstract/_module.d.mts";

/** @privateRemarks `EmbeddedCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { EmbeddedCollection } from "#common/abstract/_module.d.mts";

/**
 * An abstract base class extended on both the client and server which defines how Documents are retrieved, created,
 * updated, and deleted.
 */
declare abstract class DatabaseBackend {
  /**
   * Retrieve Documents based on provided query parameters.
   * @param documentClass - The Document definition
   * @param operation     - Parameters of the get operation
   * @param user          - The requesting User
   * @returns An array of retrieved Document instances or index objects
   */
  get<DocClass extends Document.AnyConstructor>(
    documentClass: DocClass,
    operation: Document.Database2.BackendGetOperationForName<DocClass["documentName"]>,
    user?: User.Implementation,
  ): Promise<FixedInstanceType<DocClass>>[];

  /**
   * Retrieve Document instances using the specified operation parameters.
   * @param documentClass  - The Document class definition
   * @param operation      - Parameters of the get operation
   * @param user           - The requesting User
   * @returns An array of retrieved Document instances or index objects
   */
  protected abstract _getDocuments<DocClass extends Document.AnyConstructor>(
    documentClass: DocClass,
    operation: Document.Database2.GetOperationForName<DocClass["documentName"]>,
    user?: User.Implementation,
  ): Promise<FixedInstanceType<DocClass>[]>;

  /**
   * Create new Documents using provided data and context.
   * It is recommended to use {@linkcode Document.createDocuments} or {@linkcode Document.create} rather than calling this
   * method directly.
   * @param documentClass - The Document class definition
   * @param operation     - Parameters of the create operation
   * @param user          - The requesting User
   * @returns An array of created Document instances
   *
   * @remarks If `user` isn't passed, {@linkcode ClientDatabaseBackend._createDocuments | ClientDatabaseBackend#_createDocuments} defaults
   * to `game.user`
   */
  // TODO: possible improvements around Stored types and inferring type data
  create<DocClass extends Document.AnyConstructor>(
    documentClass: DocClass,
    operation: Document.Database2.BackendCreateOperationForName<DocClass["documentName"]>,
    user?: User.Implementation,
  ): Promise<FixedInstanceType<DocClass>[]>;

  /**
   * Create Document instances using provided data and operation parameters.
   * @param documentClass - The Document class definition
   * @param operation     - Parameters of the create operation
   * @param user          - The requesting User
   * @returns An array of created Document instances
   */
  // TODO: possible improvements around Stored types and inferring type data
  protected _createDocuments<DocClass extends Document.AnyConstructor>(
    documentClass: DocClass,
    operation: Document.Database2.CreateOperationForName<DocClass["documentName"]>,
    user: User.Implementation,
  ): Promise<FixedInstanceType<DocClass>[]>;

  /**
   * Update Documents using provided data and context.
   * It is recommended to use {@linkcode Document.updateDocuments} or {@linkcode Document.update | Document#update} rather than calling this
   * method directly.
   * @param documentClass - The Document class definition
   * @param operation     - Parameters of the update operation
   * @param user          - The requesting User
   * @returns  An array of updated Document instances
   */
  update<DocClass extends Document.AnyConstructor>(
    documentClass: DocClass,
    operation: Document.Database2.BackendUpdateOperationForName<DocClass["documentName"]>,
    user?: User.Implementation,
  ): Promise<FixedInstanceType<DocClass>[]>;

  /**
   * Update Document instances using provided data and operation parameters.
   * @param documentClass - The Document class definition
   * @param operation     - Parameters of the update operation
   * @param user          - The requesting User
   * @returns  An array of updated Document instances
   */
  protected abstract _updateDocuments<DocClass extends Document.AnyConstructor>(
    documentClass: DocClass,
    operation: Document.Database2.UpdateOperationForName<DocClass["documentName"]>,
    user: User.Implementation,
  ): Promise<FixedInstanceType<DocClass>[]>;

  /**
   * Delete Documents using provided ids and context.
   * It is recommended to use {@linkcode foundry.abstract.Document.deleteDocuments} or
   * {@link foundry.abstract.Document.delete | `foundry.abstract.Document#delete`} rather than calling this method directly.
   * @param documentClass - The Document class definition
   * @param operation     - Parameters of the delete operation
   * @param user          - The requesting User
   * @returns The deleted Document instances
   */
  delete<DocClass extends Document.AnyConstructor>(
    documentClass: DocClass,
    operation: Document.Database2.BackendDeleteOperationForName<DocClass["documentName"]>,
    user?: User.Implementation,
  ): Promise<FixedInstanceType<DocClass>[]>;

  /**
   * Delete Document instances using provided ids and operation parameters.
   * @param documentClass - The Document class definition
   * @param operation     - Parameters of the delete operation
   * @param user          - The requesting User
   */
  protected abstract _deleteDocuments<DocClass extends Document.AnyConstructor>(
    documentClass: DocClass,
    operation: Document.Database2.DeleteOperationForName<DocClass["documentName"]>,
    user: User.Implementation,
  ): Promise<FixedInstanceType<DocClass>[]>;

  /**
   * Get the parent Document (if any) associated with a request context.
   * @param operation - The requested database operation
   * @returns The parent Document, or null
   */
  _getParent(operation: DatabaseBackend.DatabaseOperation): Promise<Document.Any | null>;

  /**
   * Describe the scopes which are suitable as the namespace for a flag key
   * @remarks Not marked abstract on Foundry's end, but is a no-op in this class
   */
  abstract getFlagScopes(): string[];

  /**
   * Describe the scopes which are suitable as the namespace for a flag key
   * @remarks Not marked abstract on Foundry's end, but is a no-op in this class
   */
  abstract getCompendiumScopes(): string[];

  /**
   * Log a database operations message.
   * @param level   - The logging level
   * @param message - The message
   */
  protected abstract _log(level: LoggingLevels, message: string): void;

  /**
   * Log a database operation for an embedded document, capturing the action taken and relevant IDs
   * @param action    - The action performed
   * @param type      - The document type
   * @param documents - The documents modified
   * @param context   - The context of the log request
   */
  protected _logOperation(
    action: string,
    type: string,
    documents: Document.Any[],
    context?: DatabaseBackend.LogOperationContext,
  ): void;

  /**
   * Construct a standardized error message given the context of an attempted operation
   * @remarks This method is only called in server-side code
   */
  protected _logError(user: User.Implementation, action: string, context?: DatabaseBackend.LogErrorContext): string;

  #DatabaseBackend: true;
}

declare namespace DatabaseBackend {
  interface Any extends AnyDatabaseBackend {}
  interface AnyConstructor extends Identity<typeof AnyDatabaseBackend> {}

  type _LogOperationContext = InexactPartial<{
    /** A parent document */
    parent: Document.Any;

    /** A compendium pack within which the operation occurred */
    pack: string;

    /**
     * The logging level
     * @defaultValue `"info"`
     */
    level: LoggingLevels;
  }>;

  interface LogOperationContext extends _LogOperationContext {}

  interface LogErrorContext extends Omit<_LogOperationContext, "level"> {}

  interface DatabaseOperationMap {
    get: GetOperation;
    create: CreateOperation;
    update: UpdateOperation;
    delete: DeleteOperation;
  }

  type DatabaseAction = keyof DatabaseOperationMap;
  type DatabaseOperation = DatabaseOperationMap[keyof DatabaseOperationMap];

  /**
   * The optional portion of this type is `IntentionalPartial` instead of `InexactPartial` because keys with `undefined` values do not
   * survive passage over the socket. The interfaces users will most commonly be passing are `InexactPartial`ed in their entirety to allow
   * passing `undefined` regardless for DX reasons, and because some keys are only set via `??=`
   * @internal
   */
  type _CommonOperationKeys<Parent extends Document.Any | null = Document.Any | null> = {
    /**
     * A parent Document within which Documents are embedded
     *
     * @remarks Either this property or {@linkcode _CommonOperationKeys.parentUuid | parentUuid} is required for obligately embedded
     * documents (i.e, any *not* found in {@linkcode CONST.PRIMARY_DOCUMENT_TYPES}).
     *
     * This property takes precedence, although it will be dropped and replaced with `parentUuid` before being sent over the socket; this is
     * transparent to users as it is reconstituted in the `ClientDatabaseBackend##handle[Operation]Documents` methods.
     *
     * This property is guaranteed present by `DatabaseBackend##configureOperation` calling
     * {@linkcode ClientDatabaseBackend._getParent | ClientDatabaseBackend#_getParent}, and so is typed as required in this root interface.
     */
    parent: Parent;

    /**
     * The timestamp when the operation was performed
     *
     * @remarks This property is set in `DatabaseBackend##configureOperation`; since passed values are never respected, it is omitted from
     * interfaces for prior to that call ({@linkcode Document.Database2.CreateDocumentsOperation | CreateDocumentsOperation},
     * {@linkcode Document.Database2.BackendCreateOperation | BackendCreateOperation})
     */
    modifiedTime: number;
  } & IntentionalPartial<{
    /**
     * Whether the database operation is broadcast to other connected clients
     *
     * @remarks Behaves as if the default is `true`
     * @privateRemarks Despite this being marked required in core's typedef, it is only ever set (to `false`) in the server-side
     * `FogExploration._onXOperation` methods. It sees no other use in core.
     */
    broadcast: boolean;

    /**
     * Block the dispatch of hooks related to this operation
     *
     * @remarks Behaves as if the default is `false`.
     *
     * Despite the description, only prevents `pre[Operation][Document]` hooks from being called. Post-operation hooks (`createItem` etc)
     * still fire.
     */
    noHook: boolean;

    /**
     * Re-render Applications whose display depends on the created Documents
     * @defaultValue `true`
     *
     * @remarks This property is guaranteed to exist by the `DatabaseBackend##configure[Operation]` methods. It is not omitted from passable
     * types as it's set via `??=`, so passed values are respected.
     */
    render: boolean;

    /**
     * A compendium collection ID which contains the Documents
     *
     * @remarks Will be added to the operation automatically if:
     * - A `parent` is passed in the operation and *it* is in a pack (for any operation, via the Document static methods
     * ({@linkcode Document.createDocuments} etc))
     * - The operation is started via a call to {@linkcode Document.update | Document#update} or {@linkcode Document.delete | #delete}
     * - The operation is started via a call to an `[operation]EmbeddedDocuments` method
     */
    pack: string | null;

    /**
     * A parent Document UUID provided when the parent instance is unavailable
     */
    parentUuid: string | null;
  }>;

  /**
   * The root, abstract `GetOperation` interface.
   *
   * @remarks This interface is typed such that it's accurate for the point where the most properties are guaranteed by core to exist (after
   * `DatabaseBackend##configureGet` and `##configureOperation`, before (and thus valid to pass to)
   * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}).
   *
   * @privateRemarks Optional parameters are not `| undefined` because keys with `undefined` values do not survive passage over the socket.
   * The interfaces users will most commonly be passing ({@linkcode Document.Database2.GetDocumentsOperation | GetDocumentsOperation},
   * {@linkcode Document.Database2.BackendGetOperation | BackendGetOperation}) are `InexactPartial`ed in their entirety to allow passing
   * `undefined` regardless for DX reasons, and because some keys are only set via `??=`.
   */
  interface GetOperation<Parent extends Document.Any | null = Document.Any | null> extends Pick<
    _CommonOperationKeys<Parent>,
    "pack" | "parent" | "parentUuid"
  > {
    /**
     * The action of this database operation
     * @remarks Added to the operation object in `DatabaseBackend##configureGet`
     */
    action: "get";

    /**
     * Get requests are never broadcast.
     *
     * @remarks This is set `false` in `DatabaseBackend##configureGet`. This *could* be overwritten by a
     * {@linkcode ClientDatabaseBackend._getDocuments} override, but that would be nonsensical.
     *
     * @privateRemarks Not `Pick`ed from {@linkcode _CommonOperationKeys} to allow this alternate definition
     */
    broadcast: false;

    /**
     * A query object which identifies the set of documents retrieved
     * @remarks See {@linkcode CompendiumCollection.getDocuments | CompendiumCollection#getDocuments} for examples
     * of query syntax.
     *
     * Most operations will go out via the aforementioned method, and will thus have at least an empty object for this key,
     * but completely omitting it produces the same behaviour from the server (return all documents specified by `pack` and
     * `parent`).
     */
    query?: AnyObject;

    /**
     * Return indices only instead of full Document records
     * @remarks Behaves as if the default is `false`
     */
    index?: boolean;

    /**
     * An array of field identifiers which should be indexed
     *
     * @remarks Only fields that haven't been previously indexed this page load need be passed. Any given compendium will have the fields
     * in it's Document class's metadata (e.g {@linkcode Actor.metadata.compendiumIndexFields}), and any pushed into the relevant array in
     * `CONFIG` (e.g {@linkcode CONFIG.Actor.compendiumIndexFields}) before the initial index is requested, in its index already.
     */
    indexFields?: string[];
  }

  /**
   * The root, abstract `CreateOperation` interface.
   *
   * @remarks This interface is typed such that it's accurate for the point where the most properties are guaranteed by core to exist (after
   * `DatabaseBackend##configureCreate` and `##configureOperation`, before (and thus valid to pass to)
   * {@linkcode ClientDatabaseBackend._createDocuments | ClientDatabaseBackend#_createDocuments}).
   *
   * ---
   * ### **On Declaration Merging**
   *
   * Despite there being an abundance of interfaces descended from this one, if one wants to add a property to any of them, while you might
   * at first try only merging into the one specific interface in question, given the way the operation object is passed around, and how
   * keys added by hooks or document lifecycle methods propagate (see below), it only ever makes sense to merge into either this interface
   * (affecting **all** Documents), or into the base `CreateOperation` type for a specific document (e.g
   * {@linkcode Actor.Database2.CreateOperation}).
   *
   * The stages of life of the operation object:
   * 1. A {@linkcode Document.Database2.CreateDocumentsOperation | CreateDocumentsOperation} is passed to {@linkcode Document.create} or
   * {@linkcode Document.createDocuments} (this is the usual entry point).
   * 2. It then becomes a {@linkcode Document.Database2.BackendCreateOperation | BackendCreateOperation} and is passed to
   * {@linkcode DatabaseBackend.create | DatabaseBackend#create}.
   * 3. It's sent through `DatabaseBackend##configureCreate` and `##configureOperation` to become this interface, and then is passed to
   * {@linkcode ClientDatabaseBackend._createDocuments | ClientDatabaseBackend#_createDocuments}.
   * 4. `ClientDatabaseBackend##preCreateDocumentArray` pulls out some keys to create a
   * {@linkcode Document.Database2.PreCreateOptions | PreCreateOptions} that gets passed to
   * {@linkcode Document._preCreate | Document#_preCreate} and {@link Hooks.PreCreateDocument | the `preCreate[Document]` hook} for each
   * element of `data`, possibly acquiring new keys from either. It's also sent to
   * {@linkcode ClientDocumentMixin.AnyMixed._preCreateDescendantDocuments | ClientDocument._preCreateDescendantDocuments}, if applicable.
   * 5. `##preCreateDocumentArray` then merges the previous step's `options` back into the `operation`, including any new keys, to produce
   * a {@linkcode Document.Database2.PreCreateOperation | PreCreateOperation}, which is passed to {@linkcode Document._preCreateOperation}.
   * 6. The operation gets sent to the server, at which point any keys with the value `undefined` are lost. The response from the server is
   * then fed into `ClientDatabaseBackend##handleCreateDocuments`, which, like `##pCDA` before, pulls out some keys to create an
   * {@linkcode Document.Database2.OnCreateOptions | OnCreateOptions} which is passed to {@linkcode Document._onCreate | Document#_onCreate}
   * and {@link Hooks.CreateDocument | the `create[Document]` hook}, as well as
   * {@linkcode ClientDocumentMixin.AnyMixed._onCreateDescendantDocuments | ClientDocument._onCreateDescendantDocuments}, if applicable.
   * 7. Also as before, `##handleCreateDocuments` then merges any altered/added keys back into the operation, producing a
   * {@linkcode Document.Database2.OnCreateOperation} which is passed to {@linkcode Document._onCreateOperation}, and the relevant
   * {@linkcode DocumentCollection._onModifyContents | DocumentCollection#_onModifyContents} or
   * {@linkcode EmbeddedCollection._onModifyContents | EmbeddedCollection#_onModifyContents} method.
   * ---
   *
   * @privateRemarks Optional parameters are not `| undefined` because keys with `undefined` values do not survive passage over the socket.
   * The interfaces users will most commonly be passing ({@linkcode Document.Database2.CreateDocumentsOperation | CreateDocumentsOperation},
   * {@linkcode Document.Database2.BackendCreateOperation | BackendCreateOperation}) are `InexactPartial`ed in their entirety to allow
   * passing `undefined` regardless for DX reasons, and because some keys are only set via `??=`.
   *
   * Any properties that are included in the Foundry typedef, but which can never be seen by client code (e.g `_result`, `_createData`) are
   * not included in this interface.
   */
  interface CreateOperation<
    CreateData extends object = object,
    Parent extends Document.Any | null = Document.Any | null,
    Temporary extends boolean | undefined = boolean | undefined,
  > extends _CommonOperationKeys<Parent> {
    /**
     * The action of this database operation
     * @remarks Added to the operation object in `DatabaseBackend##configureCreate`
     */
    action: "create";

    /**
     * An array of data objects from which to create Documents
     *
     * @remarks For the passable interfaces ({@linkcode Document.Database2.CreateDocumentsOperation | CreateDocumentsOperation},
     * {@linkcode Document.Database2.BackendCreateOperation | BackendCreateOperation}), and this base type, this can be a mixed array of
     * either `CreateData` objects or Document instances. It's restricted to only the `CreateData` in all interfaces downstream of this one,
     * except {@linkcode Document.Database2.OnCreateDocumentsOperation | OnCreateDocumentsOperation}
     */
    // TODO: remove the except clause above in v14
    data: CreateData[];

    /**
     * Render the sheet Application for any created Documents
     * @defaultValue `false`
     * @remarks This is guaranteed to exist by `DatabaseBackend##configureCreate`. It is not omitted from passable types as it's set via
     * `??=`, so passed values are respected.
     *
     * Creation calls made via {@linkcode ClientDocumentMixin.AnyMixed.createDialog | ClientDocument.createDialog} will have this default to
     * `true`
     */
    renderSheet: boolean;

    /**
     * Retain the `_id` values of provided data instead of generating new ids
     * @remarks Behaves like the default is `false`
     */
    keepId?: boolean;

    /**
     * Retain the `_id` values of embedded document data instead of generating new ids for each embedded document
     * @remarks Behaves like the default is `false`
     */
    keepEmbeddedIds?: boolean;

    /**
     * @deprecated "It is no longer supported to create temporary documents using the {@linkcode Document.createDocuments}
     * API. Use the `new Document()` constructor instead." (since v12, until v14)
     * @remarks Behaves like the default is `false`
     */
    temporary?: Temporary;
  }

  /**
   * The root, abstract `UpdateOperation` interface.
   *
   * @remarks This interface is typed such that it's accurate for the point where the most properties are guaranteed by core to exist
   * (after `DatabaseBackend##configureUpdate` and `##configureOperation`, before (and thus valid to pass to)
   * {@linkcode ClientDatabaseBackend._updateDocuments | ClientDatabaseBackend#_updateDocuments})
   *
   * ---
   * ### **On Declaration Merging**
   *
   * Despite there being an abundance of interfaces descended from this one, if one wants to add a property to any of them, while you might
   * at first try only merging into the one specific interface in question, given the way the operation object is passed around, and how
   * keys added by hooks or document lifecycle methods propagate (see below), it only ever makes sense to merge into either this interface
   * (affecting **all** Documents), or into the base `UpdateOperation` type for a specific document (e.g
   * {@linkcode Actor.Database2.UpdateOperation}).
   *
   * The stages of life of the operation object:
   * 1. An {@linkcode Document.Database2.UpdateOneDocumentOperation | UpdateOneDocumentOperation} is passed to
   * {@linkcode Document.update | Document#update}, or an
   * {@linkcode Document.Database2.UpdateManyDocumentsOperation | UpdateManyDocumentsOperation} is passed to
   * {@linkcode Document.updateDocuments} (this is the usual entry point).
   * 2. It then becomes a {@linkcode Document.Database2.BackendUpdateOperation | BackendUpdateOperation} and is passed to
   * {@linkcode DatabaseBackend.update | DatabaseBackend#update}.
   * 3. It's sent through `DatabaseBackend##configureUpdate` and `##configureOperation` to become this interface, and then is passed to
   * {@linkcode ClientDatabaseBackend._updateDocuments | ClientDatabaseBackend#_updateDocuments}.
   * 4. `ClientDatabaseBackend##preUpdateDocumentArray` pulls out some keys to update a
   * {@linkcode Document.Database2.PreUpdateOptions | PreUpdateOptions} that gets passed to
   * {@linkcode Document._preUpdate | Document#_preUpdate} and {@link Hooks.PreUpdateDocument | the `preUpdate[Document]` hook} for each
   * element of `data`, possibly acquiring new keys from either. It's also sent to
   * {@linkcode ClientDocumentMixin.AnyMixed._preUpdateDescendantDocuments | ClientDocument._preUpdateDescendantDocuments}, if applicable.
   * 5. `##preUpdateDocumentArray` then merges the previous step's `options` back into the `operation`, including any new keys, to produce
   * a {@linkcode Document.Database2.PreUpdateOperation | PreUpdateOperation}, which is passed to {@linkcode Document._preUpdateOperation}.
   * 6. The operation gets sent to the server, at which point any keys with the value `undefined` are lost. The response from the server is
   * then fed into `ClientDatabaseBackend##handleUpdateDocuments`, which, like `##pCDA` before, pulls out some keys to create an
   * {@linkcode Document.Database2.OnUpdateOptions | OnUpdateOptions} which is passed to {@linkcode Document._onUpdate | Document#_onUpdate}
   * and {@link Hooks.UpdateDocument | the `update[Document]` hook}, as well as
   * {@linkcode ClientDocumentMixin.AnyMixed._onUpdateDescendantDocuments | ClientDocument._onUpdateDescendantDocuments}, if applicable.
   * 7. Also as before, `##handleUpdateDocuments` then merges any altered/added keys back into the operation, producing a
   * {@linkcode Document.Database2.OnUpdateOperation} which is passed to {@linkcode Document._onUpdateOperation}, and the relevant
   * {@linkcode DocumentCollection._onModifyContents | DocumentCollection#_onModifyContents} or
   * {@linkcode EmbeddedCollection._onModifyContents | EmbeddedCollection#_onModifyContents} method.
   *
   * ---
   *
   * @privateRemarks Optional parameters are not `| undefined` because keys with `undefined` values do not survive passage over the socket.
   * The interfaces users will most commonly be passing
   * ({@linkcode Document.Database2.UpdateManyDocumentsOperation | UpdateDocumentsOperation},
   * {@linkcode Document.Database2.BackendUpdateOperation | BackendUpdateOperation}) are `InexactPartial`ed in their entirety to allow
   * passing `undefined` regardless for DX reasons, and because some keys are only set via `??=`.
   *
   * Any properties that are included in the Foundry typedef, but which can never be seen by client code (e.g `_result`, `_updateData`)
   * are not included in this interface.
   */
  interface UpdateOperation<
    UpdateData extends object = object,
    Parent extends Document.Any | null = Document.Any | null,
  > extends _CommonOperationKeys<Parent> {
    /**
     * The action of this database operation
     * @remarks Added to the operation object in `DatabaseBackend##configureUpdate`
     */
    action: "update";

    /**
     * An array of data objects used to update existing Documents.
     * Each update object must contain the _id of the target Document
     *
     * @remarks For the passable interfaces ({@linkcode Document.Database2.UpdateManyDocumentsOperation | UpdateDocumentsOperation},
     * {@linkcode Document.Database2.BackendUpdateOperation | BackendUpdateOperation}), and this base type, this can be a mixed array of
     * either `UpdateData` objects or Document instances. It's restricted to only the `UpdateData` in all interfaces downstream of this one.
     */
    updates: UpdateData[];

    /**
     * Difference each update object against current Document data and only use differential data for the update operation
     * @defaultValue `true`
     * @remarks This property is guaranteed present by `DatabaseBackend##configureUpdate`. It is not omitted from passable types as it's
     * set via `??=`, so passed values are respected.
     */
    diff: boolean;

    /**
     * Merge objects recursively. If false, inner objects will be replaced explicitly. Use with caution!
     * @defaultValue `true`
     * @remarks This property is guaranteed present by `DatabaseBackend##configureUpdate`. It is not omitted from passable types as it's
     * set via `??=`, so passed values are respected.
     */
    recursive: boolean;
  }

  /**
   * The root, abstract `DeleteOperation` interface.
   *
   * @remarks This interface is typed such that it's accurate for the point where the most properties are guaranteed by core to exist
   * (after `DatabaseBackend##configureDelete` and `##configureOperation`, before (and thus valid to pass to)
   * {@linkcode ClientDatabaseBackend._deleteDocuments | ClientDatabaseBackend#_deleteDocuments})
   *
   * ---
   * ### **On Declaration Merging**
   *
   * Despite there being an abundance of interfaces descended from this one, if one wants to add a property to any of them, while you might
   * at first try only merging into the one specific interface in question, given the way the operation object is passed around, and how
   * keys added by hooks or document lifecycle methods propagate (see below), it only ever makes sense to merge into either this interface
   * (affecting **all** Documents), or into the base `DeleteOperation` type for a specific document (e.g
   * {@linkcode Actor.Database2.DeleteOperation}).
   *
   * The stages of life of the operation object:
   * 1. An {@linkcode Document.Database2.DeleteOneDocumentOperation | DeleteOneDocumentOperation} is passed to
   * {@linkcode Document.delete | Document#delete}, or an
   * {@linkcode Document.Database2.DeleteManyDocumentsOperation | DeleteManyDocumentsOperation} is passed to
   * {@linkcode Document.deleteDocuments} (this is the usual entry point).
   * 2. It then becomes a {@linkcode Document.Database2.BackendDeleteOperation | BackendDeleteOperation} and is passed to
   * {@linkcode DatabaseBackend.delete | DatabaseBackend#delete}.
   * 3. It's sent through `DatabaseBackend##configureDelete` and `##configureOperation` to become this interface, and then is passed to
   * {@linkcode ClientDatabaseBackend._deleteDocuments | ClientDatabaseBackend#_deleteDocuments}.
   * 4. `ClientDatabaseBackend##preDeleteDocumentArray` pulls out some keys to delete a
   * {@linkcode Document.Database2.PreDeleteOptions | PreDeleteOptions} that gets passed to
   * {@linkcode Document._preDelete | Document#_preDelete} and {@link Hooks.PreDeleteDocument | the `preDelete[Document]` hook} for each
   * element of `data`, possibly acquiring new keys from either. It's also sent to
   * {@linkcode ClientDocumentMixin.AnyMixed._preDeleteDescendantDocuments | ClientDocument._preDeleteDescendantDocuments}, if applicable.
   * 5. `##preDeleteDocumentArray` then merges the previous step's `options` back into the `operation`, including any new keys, to produce
   * a {@linkcode Document.Database2.PreDeleteOperation | PreDeleteOperation}, which is passed to {@linkcode Document._preDeleteOperation}.
   * 6. The operation gets sent to the server, at which point any keys with the value `undefined` are lost. The response from the server is
   * then fed into `ClientDatabaseBackend##handleDeleteDocuments`, which, like `##pCDA` before, pulls out some keys to create an
   * {@linkcode Document.Database2.OnDeleteOptions | OnDeleteOptions} which is passed to {@linkcode Document._onDelete | Document#_onDelete}
   * and {@link Hooks.DeleteDocument | the `delete[Document]` hook}, as well as
   * {@linkcode ClientDocumentMixin.AnyMixed._onDeleteDescendantDocuments | ClientDocument._onDeleteDescendantDocuments}, if applicable.
   * 7. Also as before, `##handleDeleteDocuments` then merges any altered/added keys back into the operation, producing a
   * {@linkcode Document.Database2.OnDeleteOperation} which is passed to {@linkcode Document._onDeleteOperation}, and the relevant
   * {@linkcode DocumentCollection._onModifyContents | DocumentCollection#_onModifyContents} or
   * {@linkcode EmbeddedCollection._onModifyContents | EmbeddedCollection#_onModifyContents} method.
   *
   * ---
   *
   * @privateRemarks Optional parameters are not `| undefined` because keys with `undefined` values do not survive passage over the socket.
   * The interfaces users will most commonly be passing
   * ({@linkcode Document.Database2.DeleteManyDocumentsOperation | DeleteDocumentsOperation},
   * {@linkcode Document.Database2.BackendDeleteOperation | BackendDeleteOperation}) are `InexactPartial`ed in their entirety to allow
   * passing `undefined` regardless for DX reasons, and because some keys are only set via `??=`.
   *
   * Any properties that are included in Foundry's typedef, but which can never be seen by client code (e.g `_result`) are not included in
   * this interface.
   */
  interface DeleteOperation<
    Parent extends Document.Any | null = Document.Any | null,
  > extends _CommonOperationKeys<Parent> {
    /**
     * The action of this database operation
     * @remarks Added to the operation object in `DatabaseBackend##configureDelete`
     */
    action: "delete";

    /**
     * An array of Document ids which should be deleted.
     */
    ids: string[];

    /**
     * Delete all documents in the Collection, regardless of `_id`
     * @defaultValue `false`
     * @remarks This property is guaranteed to exist by `DatabaseBackend##configureDelete`. It is not omitted from passable types as it's
     * set via `??=`
     */
    deleteAll: boolean;

    /**
     * The mapping of IDs of deleted Documents to the UUIDs of the Documents that replace the deleted Documents
     *
     * @remarks This is only set by calls in {@linkcode foundry.canvas.layers.PlaceablesLayer.pasteObjects | PlaceablesLayer#pasteObjects}
     * and {@linkcode RegionDocument.teleportToken | RegionDocument#teleportToken}, and only consumed by {@linkcode Combat._onDeleteTokens}
     * as of 13.350.
     */
    replacements?: Record<string, string>;
  }
}

export default DatabaseBackend;

declare abstract class AnyDatabaseBackend extends DatabaseBackend {
  constructor(...args: never);
}
