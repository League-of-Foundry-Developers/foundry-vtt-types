import type {
  ConfigurationFailure,
  ConfiguredDocumentClass,
  ConfiguredDocumentInstance,
  ConfiguredMetadata,
  CreateData,
} from "../../../types/documentConfiguration.d.mts";
import type {
  GetKey,
  InterfaceToObject,
  MakeConform,
  MustConform,
  ToMethod,
  AnyObject,
  EmptyObject,
  InexactPartial,
  RemoveIndexSignatures,
  FixedInstanceType,
  NullishProps,
  AllKeysOf,
  IntentionalPartial,
  DiscriminatedUnion,
  SimpleMerge,
  ConcreteKeys,
  ValueOf,
  PickValue,
  AnyMutableObject,
} from "fvtt-types/utils";
import type * as CONST from "../constants.mts";
import type {
  DataField,
  EmbeddedCollectionField,
  EmbeddedDocumentField,
  SchemaField,
  TypeDataField,
} from "../data/fields.d.mts";
import type { fields } from "../data/module.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.mts";
import type {
  DatabaseAction,
  DatabaseCreateOperation,
  DatabaseDeleteOperation,
  DatabaseGetOperation,
  DatabaseUpdateOperation,
  DocumentSocketRequest,
} from "./_types.d.mts";
import type DataModel from "./data.mts";
import type DocumentSocketResponse from "./socket.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

export default Document;

type _ClassMustBeAssignableToInternal = MustConform<typeof Document, Document.Internal.Constructor>;
type _InstanceMustBeAssignableToInternal = MustConform<Document.Any, Document.Internal.Instance.Any>;

/**
 * An extension of the base DataModel which defines a Document.
 * Documents are special in that they are persisted to the database and referenced by _id.
 */
declare abstract class Document<
  DocumentName extends Document.Type,
  Schema extends DataSchema,
  Parent extends Document.Any | null = null,
> extends DataModel<Schema, Parent, InterfaceToObject<Document.ConstructionContext<Parent>>> {
  /**
   * @param data    - Initial data provided to construct the Document
   * @param context - Construction context options
   */
  // Note: The constructor has been replaced with `never` in `Document` itself because it never makes
  // sense to try to construct `new Document(...)` directly. Not only is it an abstract class but
  // also it varies based upon the `Schema`. While this could be supported it also simplifies
  // typechecking and helps stymy circularities.
  constructor(...args: never);

  override parent: Parent;

  // options: not null (destructured)
  protected override _configure(options?: Document.ConfigureOptions): void;

  /**
   * An immutable reverse-reference to the name of the collection that this Document exists in on its parent, if any.
   */
  readonly parentCollection: Document.MetadataFor<DocumentName>["collection"] | null;

  /**
   * An immutable reference to a containing Compendium collection to which this Document belongs.
   */
  readonly pack: string | null;

  /**
   * A mapping of embedded Document collections which exist in this model.
   */
  readonly collections: Document.CollectionRecord<Schema>;

  /**
   * Ensure that all Document classes share the same schema of their base declaration.
   */
  static get schema(): foundry.data.fields.SchemaField.Any;

  // options: not null (parameter default only)
  protected _initialize(options?: Document.InitializeOptions): void;

  /**
   * A mapping of singleton embedded Documents which exist in this model.
   */
  readonly singletons: Record<string, Document.AnyChild<this>>;

  protected static override _initializationOrder(): Generator<[string, DataField.Any]>;

  /**
   * Default metadata which applies to each instance of this Document type.
   * @defaultValue
   * ```typescript
   * {
   *   name: "Document",
   *   collection: "documents",
   *   indexed: false,
   *   compendiumIndexFields: [],
   *   label: "DOCUMENT.Document",
   *   coreTypes: [],
   *   embedded: {},
   *   permissions: {
   *     create: "ASSISTANT",
   *     update: "ASSISTANT",
   *     delete: "ASSISTANT"
   *   },
   *   preserveOnImport: ["_id", "sort", "ownership"],
   *   schemaVersion: undefined
   * }
   * ```
   */
  static metadata: Document.Metadata.Any;

  /**
   * The database backend used to execute operations and handle results
   */
  static get database(): CONFIG["DatabaseBackend"];

  /**
   * Return a reference to the implemented subclass of this base document type.
   */
  static get implementation(): Document.AnyConstructor;

  /**
   * The base document definition that this document class extends from.
   */
  static get baseDocument(): Document.AnyConstructor;

  /**
   * The named collection to which this Document belongs.
   */
  static get collectionName(): string;

  /**
   * The named collection to which this Document belongs.
   */
  get collectionName(): Document.MetadataFor<DocumentName>["collection"];

  /**
   * The canonical name of this Document type, for example "Actor".
   */
  static get documentName(): string;

  /**
   * The canonical name of this Document type, for example "Actor".
   */
  get documentName(): DocumentName;

  /**
   * The allowed types which may exist for this Document class
   */
  static get TYPES(): string[];

  /**
   * Does this Document support additional subtypes?
   */
  static get hasTypeData(): undefined | true;

  /**
   * The Embedded Document hierarchy for this Document.
   */
  static get hierarchy(): Record<string, EmbeddedCollectionField.Any | EmbeddedDocumentField.Any>;

  /**
   * Identify the collection in a parent Document that this Document exists belongs to, if any.
   * @param parentCollection - An explicitly provided parent collection name.
   * @remarks If passed a value for `parentCollection`, simply returns that value
   *
   * Foundry marked `@internal`
   */
  _getParentCollection(parentCollection?: string): string | null;

  /**
   * The canonical identifier for this Document
   */
  get id(): string | null;

  /**
   * Test whether this Document is embedded within a parent Document
   */
  get isEmbedded(): boolean;

  /**
   * A Universally Unique Identifier (uuid) for this Document instance.
   */
  get uuid(): string;

  /**
   * Test whether a given User has a sufficient role in order to create Documents of this type in general.
   * @param user - The User being tested
   * @returns Does the User have a sufficient role to create?
   * @throws If this document's `metadata.permissions.create instanceof Function`
   */
  static canUserCreate(user: User.Internal.Implementation): boolean;

  /**
   * Get the explicit permission level that a specific User has over this Document, a value in {@link CONST.DOCUMENT_OWNERSHIP_LEVELS | `CONST.DOCUMENT_OWNERSHIP_LEVELS`}.
   * This method returns the value recorded in Document ownership, regardless of the User's role.
   * To test whether a user has a certain capability over the document, testUserPermission should be used.
   * @param user - The User being tested (default: `game.user`)
   * @returns A numeric permission level from CONST.DOCUMENT_OWNERSHIP_LEVELS or null
   */
  getUserLevel(user?: User.Internal.Implementation | null): CONST.DOCUMENT_OWNERSHIP_LEVELS | null;

  /**
   * Test whether a certain User has a requested permission level (or greater) over the Document
   * @param user       - The User being tested
   * @param permission - The permission level from DOCUMENT_PERMISSION_LEVELS to test
   * @param options    - Additional options involved in the permission test
   * @returns Does the user have this permission level over the Document?
   */
  // options: not null (destructured)
  testUserPermission(
    user: User.Internal.Implementation,
    permission: Document.TestableOwnershipLevel,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  /**
   * Test whether a given User has permission to perform some action on this Document
   * @param user   - The User attempting modification
   * @param action - The attempted action
   * @param data   - Data involved in the attempted action
   *                 (default: `{}`)
   * @returns Does the User have permission?
   */
  // data: not null (parameter default only)
  canUserModify<Action extends "create" | "update" | "delete">(
    user: User.Internal.Implementation,
    action: Action,
    data?: Document.CanUserModifyData<Schema, Action>,
  ): boolean;

  /**
   * Clone a document, creating a new document by combining current data with provided overrides.
   * The cloned document is ephemeral and not yet saved to the database.
   * @param data    - Additional data which overrides current document data at the time of creation
   * @param context - Additional context options passed to the create method
   * @returns The cloned Document instance
   */
  // data: not null (property access), context: not null (destructured)
  override clone<Save extends boolean | null | undefined = false>(
    data?: fields.SchemaField.UpdateData<Schema>,
    context?: Document.CloneContext<Save>,
  ): Save extends true ? Promise<this> : this;

  /**
   * For Documents which include game system data, migrate the system data object to conform to its latest data model.
   * The data model is defined by the template.json specification included by the game system.
   * @returns The migrated system data object
   * @throws If this document type either doesn't have subtypes or it does but the one on this document is a DataModel
   */
  migrateSystemData(): object;

  /** @remarks `Document#toObject` calls `this.constructor.shimData()` on the data before returning */
  override toObject<Source extends boolean | null | undefined>(
    source?: Source,
  ): Source extends true ? Readonly<SchemaField.PersistedData<Schema>> : SchemaField.PersistedData<Schema>;

  /**
   * Create multiple Documents using provided input data.
   * Data is provided as an array of objects where each individual object becomes one new Document.
   *
   * @param data    - An array of data objects or existing Documents to persist.
   *                  (default: `[]`)
   * @param operation - Parameters of the requested creation operation
   *                  (default: `{}`)
   * @returns An array of created Document instances
   *
   * @example Create a single Document
   * ```typescript
   * const data = [{name: "New Actor", type: "character", img: "path/to/profile.jpg"}];
   * const created = await Actor.createDocuments(data);
   * ```
   *
   * @example Create multiple Documents
   * ```typescript
   * const data = [{name: "Tim", type: "npc"], [{name: "Tom", type: "npc"}];
   * const created = await Actor.createDocuments(data);
   * ```
   *
   * @example Create multiple embedded Documents within a parent
   * ```typescript
   * const actor = game.actors.getName("Tim");
   * const data = [{name: "Sword", type: "weapon"}, {name: "Breastplate", type: "equipment"}];
   * const created = await Item.createDocuments(data, {parent: actor});
   * ```
   *
   * @example Create a Document within a Compendium pack
   * ```typescript
   * const data = [{name: "Compendium Actor", type: "character", img: "path/to/profile.jpg"}];
   * const created = await Actor.createDocuments(data, {pack: "mymodule.mypack"});
   * ```
   *
   * @remarks If a document is skipped by a hook or `_preCreate` then that element is skipped in the
   * return type. This means that you receive only documents that were actually created.
   */
  // Note: This uses `never` because it's unsound to try to do `Document.createDocuments` directly.
  static createDocuments(data: never, operation?: never): Promise<Document.Any[]>;

  /**
   * Update multiple Document instances using provided differential data.
   * Data is provided as an array of objects where each individual object updates one existing Document.
   *
   * @param updates - An array of differential data objects, each used to update a single Document
   *                  (default: `[]`)
   * @param operation - Parameters of the database update operation
   *                  (default: `{}`)
   * @returns An array of updated Document instances
   *
   * @example Update a single Document
   * ```typescript
   * const updates = [{_id: "12ekjf43kj2312ds", name: "Timothy"}];
   * const updated = await Actor.updateDocuments(updates);
   * ```
   *
   * @example Update multiple Documents
   * ```typescript
   * const updates = [{_id: "12ekjf43kj2312ds", name: "Timothy"}, {_id: "kj549dk48k34jk34", name: "Thomas"}]};
   * const updated = await Actor.updateDocuments(updates);
   * ```
   *
   * @example Update multiple embedded Documents within a parent
   * ```typescript
   * const actor = game.actors.getName("Timothy");
   * const updates = [{_id: sword.id, name: "Magic Sword"}, {_id: shield.id, name: "Magic Shield"}];
   * const updated = await Item.updateDocuments(updates, {parent: actor});
   * ```
   *
   * @example Update Documents within a Compendium pack
   * ```typescript
   * const actor = await pack.getDocument(documentId);
   * const updated = await Actor.updateDocuments([{_id: actor.id, name: "New Name"}], {pack: "mymodule.mypack"});
   * ```
   *
   * @remarks If a document is skipped by a hook or `_preCreate` then that element is skipped in the
   * return type. This means that you receive only documents that were actually updated.
   */
  // Note: This uses `never` because it's unsound to try to do `Document.updateDocuments`
  static updateDocuments(updates: never, operation?: never): Promise<Document.Any[]>;

  /**
   * Delete one or multiple existing Documents using an array of provided ids.
   * Data is provided as an array of string ids for the documents to delete.
   *
   * @param ids - An array of string ids for the documents to be deleted
   *              (default: `[]`)
   * @param operation - Parameters of the database deletion operation
   *                  (default: `{}`)
   * @returns An array of deleted Document instances
   *
   * @example Delete a single Document
   * ```typescript
   * const tim = game.actors.getName("Tim");
   * const deleted = await Actor.deleteDocuments([tim.id]);
   * ```
   *
   * @example Delete multiple Documents
   * ```typescript
   * const tim = game.actors.getName("Tim");
   * const tom = game.actors.getName("Tom");
   * const deleted = await Actor.deleteDocuments([tim.id, tom.id]);
   * ```
   *
   * @example Delete multiple embedded Documents within a parent
   * ```typescript
   * const tim = game.actors.getName("Tim");
   * const sword = tim.items.getName("Sword");
   * const shield = tim.items.getName("Shield");
   * const deleted = await Item.deleteDocuments([sword.id, shield.id], parent: actor});
   * ```
   *
   * @example Delete Documents within a Compendium pack
   * ```typescript
   * const actor = await pack.getDocument(documentId);
   * const deleted = await Actor.deleteDocuments([actor.id], {pack: "mymodule.mypack"});
   * ```
   *
   * @remarks If a document is skipped by a hook or `_preDelete` then that element is skipped in the
   * return type. This means that you receive only documents that were actually deleted.
   */
  // Note: This uses `never` because it's unsound to try to pass the operation for `Document.deleteDocument`
  static deleteDocuments(ids?: readonly string[], operation?: never): Promise<Document.Any[]>;

  /**
   * Create a new Document using provided input data, saving it to the database.
   * @see {@link Document.createDocuments | `Document.createDocuments`}
   * @param data      - Initial data used to create this Document, or a Document instance to persist.
   * @param operation - Parameters of the creation operation
   *                    (default: `{}`)
   * @returns The created Document instance
   *
   * @example Create a World-level Item
   * ```typescript
   * const data = [{name: "Special Sword", type: "weapon"}];
   * const created = await Item.create(data);
   * ```
   *
   * @example Create an Actor-owned Item
   * ```typescript
   * const data = [{name: "Special Sword", type: "weapon"}];
   * const actor = game.actors.getName("My Hero");
   * const created = await Item.create(data, {parent: actor});
   * ```
   *
   * @example Create an Item in a Compendium pack
   * ```typescript
   * const data = [{name: "Special Sword", type: "weapon"}];
   * const created = await Item.create(data, {pack: "mymodule.mypack"});
   * ```
   *
   * @remarks If the document creation is skipped by a hook or `_preCreate` then `undefined` is
   * returned.
   */
  // Note: This uses `never` because it's unsound to try to call `Document.create` directly.
  static create(data: never, operation?: never): Promise<Document.Any | undefined>;

  /**
   * Update this Document using incremental data, saving it to the database.
   * @see {@link Document.updateDocuments | `Document.updateDocuments`}
   * @param data      - Differential update data which modifies the existing values of this document data
   *                    (default: `{}`)
   * @param operation - Parameters of the update operation
   *                    (default: `{}`)
   * @returns The updated Document instance
   *
   * @remarks If the document update is skipped by a hook or `_preUpdate` then `undefined` is
   * returned.
   */
  // Note: This uses `never` because it's unsound to try to call `Document#update` directly.
  update(data: never, operation: never): Promise<this | undefined>;

  /**
   * Delete this Document, removing it from the database.
   * @see {@link Document.deleteDocuments | `Document.deleteDocuments`}
   * @param operation - Parameters of the deletion operation
   *                    (default: `{}`)
   * @returns The deleted Document instance
   *
   * @remarks If the document deletion is skipped by a hook or `_preUpdate` then `undefined` is
   * returned.
   */
  // Note: This uses `never` because it's unsound to try to call `Document#delete` directly.
  delete(operation: never): Promise<this | undefined>;

  /**
   * Get a World-level Document of this type by its id.
   * @param documentId - The Document ID
   * @param operation  - Additional options which customize the request
   * @returns The retrieved Document, or null
   */
  static get(documentId: string, operation?: Document.Database.GetOptions): Document.Any | null;

  /**
   * A compatibility method that returns the appropriate name of an embedded collection within this Document.
   * @param name - An existing collection name or a document name.
   * @returns The provided collection name if it exists, the first available collection for the
   *          document name provided, or null if no appropriate embedded collection could be found.
   * @example Passing an existing collection name.
   * ```js
   * Actor.getCollectionName("items");
   * // returns "items"
   * ```
   *
   * @example Passing a document name.
   * ```js
   * Actor.getCollectionName("Item");
   * // returns "items"
   * ```
   */
  static getCollectionName(name: never): string | null;

  /**
   * Obtain a reference to the Array of source data within the data object for a certain embedded Document name
   * @param embeddedName - The name of the embedded Document type
   * @returns The Collection instance of embedded Documents of the requested type
   * @remarks Usually returns some form of DocumentCollection, but not always (e.g. Token["actors"])
   */
  // Note: This uses `never` because it's unsound to try to call `Document#getEmbeddedCollection` directly.
  getEmbeddedCollection(embeddedName: never): unknown;

  /**
   * Get an embedded document by its id from a named collection in the parent document.
   * @param embeddedName - The name of the embedded Document type
   * @param id           - The id of the child document to retrieve
   * @param options      - Additional options which modify how embedded documents are retrieved
   * @returns The retrieved embedded Document instance, or undefined
   * @throws If the embedded collection does not exist, or if strict is true and the Embedded Document could not be found.
   */
  // Note: This uses `never` because it's unsound to try to call `Document#getEmbeddedDocument` directly.
  // options: not null (destructured)
  getEmbeddedDocument(
    embeddedName: never,
    id: string,
    options?: Document.GetEmbeddedDocumentOptions,
  ): Document.AnyChild<this> | undefined;

  /**
   * Create multiple embedded Document instances within this parent Document using provided input data.
   * @see {@link Document.createDocuments | `Document.createDocuments`}
   * @param embeddedName - The name of the embedded Document type
   * @param data         - An array of data objects used to create multiple documents
   *                       (default: `[]`)
   * @param operation    - Parameters of the database creation workflow
   *                       (default: `{}`)
   * @returns An array of created Document instances
   */
  // Note: This uses `never` because it's unsound to try to call `Document#createEmbeddedDocuments` directly.
  createEmbeddedDocuments(
    embeddedName: never,
    // Note: Not optional because `createEmbeddedDocuments("Actor")` does effectively nothing.
    data: never,
    operation?: never,
  ): Promise<Array<Document.AnyStored> | undefined>;

  /**
   * Update multiple embedded Document instances within a parent Document using provided differential data.
   * @see {@link Document.updateDocuments | `Document.updateDocuments`}
   * @param embeddedName - The name of the embedded Document type
   * @param updates      - An array of differential data objects, each used to update a single Document
   *                       (default: `[]`)
   * @param operation    - Parameters of the database update workflow
   *                       (default: `{}`)
   * @returns An array of updated Document instances
   */
  // Note: This uses `never` because it's unsound to try to call `Document#updateEmbeddedDocuments` directly.
  updateEmbeddedDocuments(
    embeddedName: never,
    // Note: Not optional because `updateEmbeddedDocuments("Actor")` does effectively nothing.
    updates: never,
    context?: never,
  ): Promise<Array<Document.AnyStored> | undefined>;

  /**
   * Delete multiple embedded Document instances within a parent Document using provided string ids.
   * @see {@link Document.deleteDocuments | `Document.deleteDocuments`}
   * @param embeddedName - The name of the embedded Document type
   * @param ids          - An array of string ids for each Document to be deleted
   * @param operation    - Parameters of the database deletion workflow
   *                       (default: `{}`)
   * @returns An array of deleted Document instances
   */
  deleteEmbeddedDocuments(
    embeddedName: never,
    ids: Array<string>,
    operation?: never,
  ): Promise<Array<Document.AnyStored>>;

  /**
   * Iterate over all embedded Documents that are hierarchical children of this Document.
   * @param _parentPath - A parent field path already traversed
   * @remarks Not called within Foundry's client-side code, likely exists for server documents
   */
  traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>]>;

  /**
   * Get the value of a "flag" for this document
   * See the setFlag method for more details on flags
   *
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   * @returns The flag value
   */
  getFlag(scope: never, key: never): unknown;

  /**
   * Assign a "flag" to this document.
   * Flags represent key-value type data which can be used to store flexible or arbitrary data required by either
   * the core software, game systems, or user-created modules.
   *
   * Each flag should be set using a scope which provides a namespace for the flag to help prevent collisions.
   *
   * Flags set by the core software use the "core" scope.
   * Flags set by game systems or modules should use the canonical name attribute for the module
   * Flags set by an individual world should "world" as the scope.
   *
   * Flag values can assume almost any data type. Setting a flag value to null will delete that flag.
   *
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   * @param value - The flag value
   * @returns A Promise resolving to the updated document
   */
  setFlag(scope: never, key: never, value: never): Promise<this>;

  /**
   * Remove a flag assigned to the document
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   * @returns The updated document instance
   */
  unsetFlag(scope: never, key: never): Promise<this>;

  /**
   * Pre-process a creation operation for a single Document instance.
   * Pre-operation events only occur for the client which requested the operation.
   * Modifications to the pending Document instance must be performed using {@link Document.updateSource | `Document#updateSource`}.
   * @param data    - The initial data object provided to the document creation request
   * @param options - Additional options which modify the creation request
   * @param user    - The User requesting the document creation
   * @returns Return false to exclude this Document from the creation operation
   */
  protected _preCreate(data: never, options: never, user: User.Internal.Implementation): Promise<boolean | void>;

  /**
   * Post-process a creation operation for a single Document instance.
   * Post-operation events occur for all connected clients.
   * @param data    - The initial data object provided to the document creation request
   * @param options - Additional options which modify the creation request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onCreate(data: never, options: never, userId: string): void;

  /**
   * Pre-process a creation operation, potentially altering its instructions or input data. Pre-operation events only
   * occur for the client which requested the operation.
   *
   * This batch-wise workflow occurs after individual {@link Document._preCreate | `Document#_preCreate`} workflows and provides a final
   * pre-flight check before a database operation occurs.
   *
   * Modifications to pending documents must mutate the documents array or alter individual document instances using
   * {@link Document.updateSource | `Document#updateSource`}.
   * @param documents - Pending document instances ot be created
   * @param operation - Parameters of the database creation operation
   * @param user      - The User requesting the creation operation
   * @returns Return false to cancel the creation operation entirely
   */
  // Note: This uses `never` because it's unsound to try to do `Document._preCreateOperation` directly.
  protected static _preCreateOperation(
    documents: never[],
    operation: never,
    user: User.Internal.Implementation,
  ): Promise<boolean | void>;

  /**
   * Post-process a creation operation, reacting to database changes which have occurred. Post-operation events occur
   * for all connected clients.
   *
   * This batch-wise workflow occurs after individual {@link Document._onCreate | `Document#_onCreate`} workflows.
   *
   * @param documents - The Document instances which were created
   * @param operation - Parameters of the database creation operation
   * @param user      - The User who performed the creation operation
   */
  // Note: This uses `never` because it's unsound to try to do `Document._onCreateOperation` directly.
  protected static _onCreateOperation(
    documents: never,
    operation: never,
    user: User.Internal.Implementation,
  ): Promise<void>;

  /**
   * Perform preliminary operations before a Document of this type is updated.
   * Pre-update operations only occur for the client which requested the operation.
   * @param changed - The differential data that is changed relative to the documents prior values
   * @param options - Additional options which modify the update request
   * @param user    - The User requesting the document update
   * @returns A return value of false indicates the update operation should be cancelled
   */
  protected _preUpdate(changed: never, options: never, user: User.Internal.Implementation): Promise<boolean | void>;

  /**
   * Perform follow-up operations after a Document of this type is updated.
   * Post-update operations occur for all clients after the update is broadcast.
   * @param changed - The differential data that was changed relative to the documents prior values
   * @param options - Additional options which modify the update request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onUpdate(changed: never, options: never, userId: string): void;

  /**
   * Pre-process an update operation, potentially altering its instructions or input data. Pre-operation events only
   * occur for the client which requested the operation.
   *
   * This batch-wise workflow occurs after individual {@link Document._preUpdate | `Document#_preUpdate`} workflows and provides a final
   * pre-flight check before a database operation occurs.
   *
   * Modifications to the requested updates are performed by mutating the data array of the operation.
   * {@link Document.updateSource | `Document#updateSource`}.
   *
   * @param documents - Document instances to be updated
   * @param operation - Parameters of the database update operation
   * @param user      - The User requesting the update operation
   * @returns Return false to cancel the update operation entirely
   */
  // Note: This uses `never` because it's unsound to try to do `Document._preUpdateOperation` directly.
  protected static _preUpdateOperation(
    documents: never,
    operation: never,
    user: User.Internal.Implementation,
  ): Promise<boolean | void>;

  /**
   * Post-process an update operation, reacting to database changes which have occurred. Post-operation events occur
   * for all connected clients.
   *
   * This batch-wise workflow occurs after individual {@link Document._onUpdate | `Document#_onUpdate`} workflows.
   *
   * @param documents - The Document instances which were updated
   * @param operation - Parameters of the database update operation
   * @param user      - The User who performed the update operation
   */
  // Note: This uses `never` because it's unsound to try to do `Document._onUpdateOperation` directly.
  protected static _onUpdateOperation(
    documents: never,
    operation: never,
    user: User.Internal.Implementation,
  ): Promise<void>;

  /**
   * Perform preliminary operations before a Document of this type is deleted.
   * Pre-delete operations only occur for the client which requested the operation.
   * @param options - Additional options which modify the deletion request
   * @param user    - The User requesting the document deletion
   * @returns A return value of false indicates the delete operation should be cancelled
   */
  protected _preDelete(options: never, user: User.Internal.Implementation): Promise<boolean | void>;

  /**
   * Perform follow-up operations after a Document of this type is deleted.
   * Post-deletion operations occur for all clients after the deletion is broadcast.
   * @param options - Additional options which modify the deletion request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onDelete(options: never, userId: string): void;

  /**
   * Pre-process a deletion operation, potentially altering its instructions or input data. Pre-operation events only
   * occur for the client which requested the operation.
   *
   * This batch-wise workflow occurs after individual {@link Document._preDelete | `Document#_preDelete`} workflows and provides a final
   * pre-flight check before a database operation occurs.
   *
   * Modifications to the requested deletions are performed by mutating the operation object.
   * {@link Document.updateSource | `Document#updateSource`}.
   *
   * @param documents - Document instances to be deleted
   * @param operation - Parameters of the database update operation
   * @param user      - The User requesting the deletion operation
   * @returns Return false to cancel the deletion operation entirely
   * @internal
   */
  // Note: This uses `never` because it's unsound to try to do `Document._preDeleteOperation` directly.
  protected static _preDeleteOperation(
    documents: never,
    operation: never,
    user: User.Internal.Implementation,
  ): Promise<unknown>;

  /**
   * Post-process a deletion operation, reacting to database changes which have occurred. Post-operation events occur
   * for all connected clients.
   *
   * This batch-wise workflow occurs after individual {@link Document._onDelete | `Document#_onDelete`} workflows.
   *
   * @param documents - The Document instances which were deleted
   * @param operation - Parameters of the database deletion operation
   * @param user      - The User who performed the deletion operation
   */
  // Note: This uses `never` because it's unsound to try to do `Document._onDeleteOperation` directly.
  protected static _onDeleteOperation(
    documents: never,
    operation: never,
    user: User.Internal.Implementation,
  ): Promise<unknown>;

  /**
   * @deprecated since v10
   * @remarks "You are accessing the "data" field of which was deprecated in v10 and replaced with "system".
   * Continued usage of pre-v10 ".data" paths is no longer supported"
   *
   * @throws An error with the above deprecation warning, if this Document's schema has a `system` field
   */
  get data(): never;

  /**
   * @deprecated since v11, will be removed in v13
   * @remarks "You are accessing `Document.hasSystemData` which is deprecated. Please use {@link Document.hasTypeData | `Document.hasTypeData`} instead."
   */
  static get hasSystemData(): undefined | true;

  /**
   * A reusable helper for adding migration shims.
   */
  // options: not null (parameter default only in _addDataFieldShim)
  protected static _addDataFieldShims(
    data: AnyMutableObject,
    shims: Record<string, string>,
    options?: Document.DataFieldShimOptions,
  ): void;

  /**
   * A reusable helper for adding a migration shim
   */
  // options: not null (parameter default only)
  protected static _addDataFieldShim(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    options?: Document.DataFieldShimOptions,
  ): void;

  /**
   * Define a simple migration from one field name to another.
   * The value of the data can be transformed during the migration by an optional application function.
   * @param data   - The data object being migrated
   * @param oldKey - The old field name
   * @param newKey - The new field name
   * @param apply  - An application function, otherwise the old value is applied
   * @remarks Foundry marked `@internal`
   */
  protected static _addDataFieldMigration(
    data: AnyMutableObject,
    oldKey: string,
    newKey: string,
    apply?: ((data: AnyMutableObject) => unknown) | null,
  ): boolean;

  // options: not null (destructured where forwarded)
  protected static _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"The Document._onCreateDocuments static method is deprecated in favor of Document._onCreateOperation"`
   */
  // Note: This uses `never` because it's unsound to try to do `Document._onCreateDocuments` directly.
  protected static _onCreateDocuments(
    documents: never,
    context: Document.ModificationContext<Document.Any | null>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"The Document._onUpdateDocuments static method is deprecated in favor of Document._onUpdateOperation"`
   */
  // Note: This uses `never` because it's unsound to try to do `Document._onUpdateDocuments` directly.
  protected static _onUpdateDocuments(
    documents: never,
    context: Document.ModificationContext<Document.Any | null>,
  ): Promise<unknown>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"The Document._onDeleteDocuments static method is deprecated in favor of Document._onDeleteOperation"`
   */
  // Note: This uses `never` because it's unsound to try to do `Document._onDeleteDocuments` directly.
  protected static _onDeleteDocuments(
    documents: never,
    context: Document.ModificationContext<Document.Any | null>,
  ): Promise<unknown>;

  static " fvtt_types_internal_document_name_static": Document.Type;

  " fvtt_types_internal_document_name": DocumentName;
  " fvtt_types_internal_document_schema": Schema;
  " fvtt_types_internal_document_parent": Parent;
}

// An empty schema is the most accurate because index signatures are stripped.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
declare abstract class AnyDocument extends Document<Document.Type, {}, Document.Any | null> {
  constructor(...args: never);

  // Note(LukeAbby): This uses `object` instead of `AnyObject` to avoid more thorough evaluation of
  // the involved types which can cause a loop.
  _source: object;
  system?: object;

  flags?: unknown;
}

type AnyDocumentClass = typeof AnyDocument;

declare namespace Document {
  /** Any Document, except for Settings */
  interface Any extends AnyDocument {}
  interface AnyStored extends Stored<Any> {}
  interface AnyValid extends AnyDocument {}
  interface AnyConstructor extends AnyDocumentClass {}

  type Type =
    | "ActiveEffect"
    | "ActorDelta"
    | "Actor"
    | "Adventure"
    | "Card"
    | "Cards"
    | "ChatMessage"
    | "Combat"
    | "Combatant"
    | "FogExploration"
    | "Folder"
    | "Item"
    | "JournalEntryPage"
    | "JournalEntry"
    | "Macro"
    | "PlaylistSound"
    | "Playlist"
    | "RegionBehavior"
    | "RollTable"
    | "Scene"
    | "Setting"
    | "TableResult"
    | "User"
    // All placeables also have a corresponding document class.
    | PlaceableType;

  type PlaceableType =
    | "AmbientLight"
    | "AmbientSound"
    | "Drawing"
    | "MeasuredTemplate"
    | "Note"
    | "Region"
    | "Tile"
    | "Token"
    | "Wall";

  type WithSubTypes = WithSystem | "Folder" | "Macro" | "TableResult";

  type WithSystem =
    | "ActiveEffect"
    | "ActorDelta"
    | "Actor"
    | "Card"
    | "Cards"
    | "ChatMessage"
    | "Combat"
    | "Combatant"
    | "Item"
    | "JournalEntryPage"
    | "RegionBehavior";

  // The `data` parameter has a default of `{}`. This means it's optional in that scenario.
  // Note(LukeAbby): Update when `ParameterWithDefaults` is added.
  // `CreateData` also should be updated to allow `undefined` directly.
  type ConstructorParameters<CreateData extends object | undefined, Parent extends Document.Any | null> = [
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {},
  ] extends [CreateData]
    ? [data?: CreateData, context?: Document.ConstructionContext<Parent>]
    : [data: CreateData, context?: Document.ConstructionContext<Parent>];

  type CoreTypesForName<Name extends Type> = string &
    GetKey<Document.MetadataFor<Name>, "coreTypes", [CONST.BASE_DOCUMENT_TYPE]>[number];

  type ConfiguredSubTypesOf<Name extends Type> = Name extends "ActorDelta"
    ? ConfiguredSubTypesOf<"Actor">
    : string & (keyof GetKey<DataModelConfig, Name, unknown> | keyof GetKey<SourceConfig, Name, unknown>);

  type SubTypesOf<Name extends Type> = Name extends "ActorDelta"
    ? SubTypesOf<"Actor">
    :
        | Document.CoreTypesForName<Name>
        | ConfiguredSubTypesOf<Name>
        | (Document.MetadataFor<Name> extends { readonly hasTypeData: true } ? Document.ModuleSubtype : never);

  type ModuleSubtype = `${string}.${string}`;

  type OfType<Name extends WithSubTypes, SubType extends SubTypesOf<Name>> =
    | (Name extends "ActiveEffect" ? ActiveEffect.OfType<SubType & ActiveEffect.SubType> : never)
    | (Name extends "ActorDelta" ? ActorDelta.OfType<SubType & ActorDelta.SubType> : never)
    | (Name extends "Actor" ? Actor.OfType<SubType & Actor.SubType> : never)
    | (Name extends "Card" ? Card.OfType<SubType & Card.SubType> : never)
    | (Name extends "Cards" ? Cards.OfType<SubType & Cards.SubType> : never)
    | (Name extends "ChatMessage" ? ChatMessage.OfType<SubType & ChatMessage.SubType> : never)
    | (Name extends "Combat" ? Combat.OfType<SubType & Combat.SubType> : never)
    | (Name extends "Combatant" ? Combatant.OfType<SubType & Combatant.SubType> : never)
    | (Name extends "Folder" ? Folder.OfType<SubType & Folder.SubType> : never)
    | (Name extends "Item" ? Item.OfType<SubType & Item.SubType> : never)
    | (Name extends "JournalEntryPage" ? JournalEntryPage.OfType<SubType & JournalEntryPage.SubType> : never)
    | (Name extends "Macro" ? Macro.OfType<SubType & Macro.SubType> : never)
    | (Name extends "RegionBehavior" ? RegionBehavior.OfType<SubType & RegionBehavior.SubType> : never)
    | (Name extends "TableResult" ? TableResult.OfType<SubType & TableResult.SubType> : never);

  /** @internal */
  type _ActorDeltaSystemData = {
    [SubType in keyof SystemData["Actor"]]: IntentionalPartial<SystemData["Actor"][SubType]>;
  };

  // Note(LukeAbby): This is written this way to make it more obviously covariant over `SubType`.
  type SystemFor<Name extends WithSystem, SubType extends SubTypesOf<Name>> = Name extends "ActorDelta"
    ? _ActorDeltaSystemData[ActorDelta.SubType]
    :
        | DiscriminatedUnion<
            SystemData extends {
              readonly [K in Name]: infer Data;
            }
              ? SubType extends keyof Data
                ? Data[SubType] extends object
                  ? Data[SubType]
                  : never
                : never
              : never
          >
        | (SubType extends `${string}.${string}` ? UnknownSystem : never);

  interface SystemData extends _SystemData {}

  /** @internal */
  type _SystemData = {
    [Name in Type]: {
      [SubType in SubTypesOf<Name>]: DataModelConfig extends _SubTypeShape<
        Name,
        SubType,
        abstract new (...args: infer _) => infer Model
      >
        ? Model
        : SourceConfig extends _SubTypeShape<Name, SubType, infer Source>
          ? Source
          : UnknownSystem;
    };
  };

  /** @internal */
  type _SubTypeShape<Name extends PropertyKey, SubType extends PropertyKey, T> = {
    readonly [_ in Name]: { readonly [_ in SubType]: T };
  };

  /**
   * With the existence of custom module subtypes a system can no longer rely on their configured types being the only ones.
   * A module can provide its own custom type though it is always of the form `${moduleName}.${subType}` so the `.` is a pretty
   * strong indicator.
   *
   * `UnknownSourceData` covers the case where it's configured without a data model.
   * See {@link UnknownSystem | `UnknownSystem`} for other possibilities.
   */
  interface UnknownSourceData extends AnyObject {
    type: `${string}.${string}`;
  }

  /**
   * With the existence of custom module subtypes a system can no longer rely on their configured types being the only ones.
   */
  type UnknownSystem = UnknownSourceData | TypeDataField.UnknownTypeDataModel | DataModel.UnknownDataModel;

  // TODO: Probably a way to auto-determine this
  type SystemType =
    | "ActiveEffect"
    | "Actor"
    | "Card"
    | "Cards"
    | "ChatMessage"
    | "Combat"
    | "Combatant"
    | "Item"
    | "JournalEntryPage"
    | "RegionBehavior";

  type EmbeddableNamesFor<Metadata extends Document.Metadata.Any> = Document.Type & ConcreteKeys<Metadata["embedded"]>;

  type CollectionNamesFor<Metadata extends Document.Metadata.Any> =
    | EmbeddableNamesFor<Metadata>
    | ValueOf<Metadata["embedded"]>;

  type IsParentOf<
    ParentDocument extends Document.Internal.Instance.Any,
    ChildDocument extends Document.Internal.Instance.Any,
  > = ParentDocument extends Internal.ParentFor<ChildDocument> ? true : false;

  type SocketRequest<Action extends DatabaseAction> = DocumentSocketRequest<Action>;
  type SocketResponse<Action extends DatabaseAction> = DocumentSocketResponse<Action>;

  // Documented at https://gist.github.com/LukeAbby/c7420b053d881db4a4d4496b95995c98
  namespace Internal {
    type Constructor = (abstract new (...args: never) => Instance.Any) & {
      " fvtt_types_internal_document_name_static": Document.Type;
    };

    interface Instance<
      DocumentName extends Document.Type,
      Schema extends DataSchema,
      Parent extends Document.Internal.Instance.Any | null,
    > {
      " fvtt_types_internal_document_name": DocumentName;
      " fvtt_types_internal_document_schema": Schema;
      " fvtt_types_internal_document_parent": Parent;
    }

    type DocumentNameFor<ConcreteInstance extends Instance.Any> =
      ConcreteInstance[" fvtt_types_internal_document_name"];

    type SchemaFor<ConcreteInstance extends Instance.Any> = ConcreteInstance[" fvtt_types_internal_document_schema"];

    type ParentFor<ConcreteInstance extends Instance.Any> = ConcreteInstance[" fvtt_types_internal_document_parent"];

    namespace Instance {
      interface Any extends Instance<any, any, any> {}

      type Complete<T extends Any> = T extends Document.Any ? T : never;
    }

    type OfType<Configured, Document extends Document.Any> = Configured extends { document: infer D }
      ? D extends Document
        ? D
        : FixedInstanceType<ConfigurationFailure[Document["documentName"]]>
      : Document;
  }

  /** Any Document, that is a child of the given parent Document. */
  // An empty schema is the most appropriate type due to removing index signatures.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  type AnyChild<Parent extends Any | null> = Document<Document.Type, {}, Parent>;

  /**
   * @deprecated {@link Document.CreateDataFor | `Document.CreateDataFor`}
   */
  type ConstructorDataFor<T extends Document.Internal.Constructor> = SchemaField.CreateData<
    T extends { defineSchema: () => infer R extends DataSchema } ? R : never
  >;

  /**
   * Returns the type of the constructor data for the given {@link foundry.abstract.Document | `foundry.abstract.Document`}.
   */
  type CreateDataFor<T extends Document.Internal.Constructor> = SchemaField.CreateData<
    T extends { defineSchema: () => infer R extends DataSchema } ? R : never
  >;

  type UpdateDataFor<T extends Document.Internal.Constructor> = SchemaField.UpdateData<
    T extends { defineSchema: () => infer R extends DataSchema } ? R : never
  >;

  // These helper types exist to help break a loop

  type UpdateDataForName<DocumentType extends Document.Type> =
    | (DocumentType extends "ActiveEffect" ? ActiveEffect.UpdateData : never)
    | (DocumentType extends "ActorDelta" ? ActorDelta.UpdateData : never)
    | (DocumentType extends "Actor" ? Actor.UpdateData : never)
    | (DocumentType extends "Adventure" ? Adventure.UpdateData : never)
    | (DocumentType extends "Card" ? Card.UpdateData : never)
    | (DocumentType extends "Cards" ? Cards.UpdateData : never)
    | (DocumentType extends "ChatMessage" ? ChatMessage.UpdateData : never)
    | (DocumentType extends "Combat" ? Combat.UpdateData : never)
    | (DocumentType extends "Combatant" ? Combatant.UpdateData : never)
    | (DocumentType extends "FogExploration" ? FogExploration.UpdateData : never)
    | (DocumentType extends "Folder" ? Folder.UpdateData : never)
    | (DocumentType extends "Item" ? Item.UpdateData : never)
    | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.UpdateData : never)
    | (DocumentType extends "JournalEntry" ? JournalEntry.UpdateData : never)
    | (DocumentType extends "Macro" ? Macro.UpdateData : never)
    | (DocumentType extends "PlaylistSound" ? PlaylistSound.UpdateData : never)
    | (DocumentType extends "Playlist" ? Playlist.UpdateData : never)
    | (DocumentType extends "RegionBehavior" ? RegionBehavior.UpdateData : never)
    | (DocumentType extends "Region" ? RegionDocument.UpdateData : never)
    | (DocumentType extends "RollTable" ? RollTable.UpdateData : never)
    | (DocumentType extends "Scene" ? Scene.UpdateData : never)
    | (DocumentType extends "Setting" ? Setting.UpdateData : never)
    | (DocumentType extends "TableResult" ? TableResult.UpdateData : never)
    | (DocumentType extends "User" ? User.UpdateData : never)
    | (DocumentType extends "AmbientLight" ? AmbientLightDocument.UpdateData : never)
    | (DocumentType extends "AmbientSound" ? AmbientSoundDocument.UpdateData : never)
    | (DocumentType extends "Drawing" ? DrawingDocument.UpdateData : never)
    | (DocumentType extends "MeasuredTemplate" ? MeasuredTemplateDocument.UpdateData : never)
    | (DocumentType extends "Note" ? NoteDocument.UpdateData : never)
    | (DocumentType extends "Tile" ? TileDocument.UpdateData : never)
    | (DocumentType extends "Token" ? TokenDocument.UpdateData : never)
    | (DocumentType extends "Wall" ? WallDocument.UpdateData : never);

  type CreateDataForName<DocumentType extends Document.Type> =
    | (DocumentType extends "ActiveEffect" ? ActiveEffect.CreateData : never)
    | (DocumentType extends "ActorDelta" ? ActorDelta.CreateData : never)
    | (DocumentType extends "Actor" ? Actor.CreateData : never)
    | (DocumentType extends "Adventure" ? Adventure.CreateData : never)
    | (DocumentType extends "Card" ? Card.CreateData : never)
    | (DocumentType extends "Cards" ? Cards.CreateData : never)
    | (DocumentType extends "ChatMessage" ? ChatMessage.CreateData : never)
    | (DocumentType extends "Combat" ? Combat.CreateData : never)
    | (DocumentType extends "Combatant" ? Combatant.CreateData : never)
    | (DocumentType extends "FogExploration" ? FogExploration.CreateData : never)
    | (DocumentType extends "Folder" ? Folder.CreateData : never)
    | (DocumentType extends "Item" ? Item.CreateData : never)
    | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.CreateData : never)
    | (DocumentType extends "JournalEntry" ? JournalEntry.CreateData : never)
    | (DocumentType extends "Macro" ? Macro.CreateData : never)
    | (DocumentType extends "PlaylistSound" ? PlaylistSound.CreateData : never)
    | (DocumentType extends "Playlist" ? Playlist.CreateData : never)
    | (DocumentType extends "RegionBehavior" ? RegionBehavior.CreateData : never)
    | (DocumentType extends "Region" ? RegionDocument.CreateData : never)
    | (DocumentType extends "RollTable" ? RollTable.CreateData : never)
    | (DocumentType extends "Scene" ? Scene.CreateData : never)
    | (DocumentType extends "Setting" ? Setting.CreateData : never)
    | (DocumentType extends "TableResult" ? TableResult.CreateData : never)
    | (DocumentType extends "User" ? User.CreateData : never)
    | (DocumentType extends "AmbientLight" ? AmbientLightDocument.CreateData : never)
    | (DocumentType extends "AmbientSound" ? AmbientSoundDocument.CreateData : never)
    | (DocumentType extends "Drawing" ? DrawingDocument.CreateData : never)
    | (DocumentType extends "MeasuredTemplate" ? MeasuredTemplateDocument.CreateData : never)
    | (DocumentType extends "Note" ? NoteDocument.CreateData : never)
    | (DocumentType extends "Tile" ? TileDocument.CreateData : never)
    | (DocumentType extends "Token" ? TokenDocument.CreateData : never)
    | (DocumentType extends "Wall" ? WallDocument.CreateData : never);

  /**
   * @deprecated {@link SchemaField.CreateData | `SchemaField.CreateData`}
   */
  type ConstructorDataForSchema<Schema extends DataSchema> = SchemaField.CreateData<Schema>;

  type SystemConstructor = AnyConstructor & {
    metadata: { name: SystemType };
  };

  type ToConfiguredClass<ConcreteDocument extends Document.Internal.Constructor> = ImplementationClassFor<
    NameFor<ConcreteDocument>
  >;

  type ToConfiguredInstance<ConcreteDocument extends Document.Internal.Constructor> = MakeConform<
    FixedInstanceType<ConfiguredDocumentClass[NameFor<ConcreteDocument>]>,
    Document.Any
    // TODO(LukeAbby): Look into if there's a way to do this without causing circular loops.
    // FixedInstanceType<ConfigurationFailure[Name]>
  >;

  type ToConfiguredStored<D extends Document.AnyConstructor> = Stored<ToConfiguredInstance<D>>;

  type Stored<D extends Document.Any> = D & {
    id: string;
    _id: string;
    _source: GetKey<D, "_source"> & { _id: string };
  };

  type Invalid<D extends Document.Any> = SimpleMerge<
    Stored<D>,
    {
      _source: object;
      system: object;
    }
  >;

  type ToStored<D extends Document.AnyConstructor> = Stored<FixedInstanceType<D>>;

  type ToStoredIf<D extends Document.AnyConstructor, Temporary extends boolean | undefined> = Temporary extends true
    ? FixedInstanceType<D>
    : ToConfiguredStored<D>;

  /** @deprecated {@link Document.TemporaryIf | `Document.TemporaryIf`} */
  type StoredIf<D extends Document.Any, Temporary extends boolean | undefined> = TemporaryIf<D, Temporary>;

  type TemporaryIf<D extends Document.Any, Temporary extends boolean | undefined> = Temporary extends true
    ? D
    : Stored<D>;

  type Temporary<D extends Document.Any> = D extends Stored<infer U> ? U : D;

  type NameFor<ConcreteDocument extends Document.Internal.Constructor> =
    ConcreteDocument[" fvtt_types_internal_document_name_static"];

  type ImplementationFor<Name extends Type> = MakeConform<ConfiguredDocumentInstance[Name], Document.Any>;
  type ImplementationClassFor<Name extends Type> = ConfiguredDocumentClass[Name];

  type ObjectClassFor<Name extends PlaceableType> = CONFIG[Name]["objectClass"];
  type ObjectFor<Name extends PlaceableType> = FixedInstanceType<CONFIG[Name]["objectClass"]>;

  /**
   * @deprecated {@link ObjectClassFor | `ObjectClassFor`}
   */
  type ConfiguredObjectClassForName<Name extends PlaceableType> = ObjectClassFor<Name>;

  /**
   * @deprecated {@link ObjectFor | `ObjectFor`}
   */
  type ConfiguredObjectInstanceForName<Name extends PlaceableType> = ObjectFor<Name>;

  type ConfiguredDataForName<Name extends Type> = GetKey<DataConfig, Name, EmptyObject>;

  type ConfiguredSourceForName<Name extends Type> = GetKey<SourceConfig, Name, EmptyObject>;

  // The type `{}` is useful here because in an intersection it reduces down to nothing unlike `EmptyObject`.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  type ConfiguredFlagsForName<Name extends Type> = GetKey<FlagConfig, Name, {}>;

  type SchemaFor<ConcreteDocument extends Internal.Instance.Any> =
    ConcreteDocument extends Internal.Instance<infer _1, infer Schema, infer _2> ? Schema : never;

  type MetadataFor<Name extends Document.Type> = ConfiguredMetadata[Name];

  type CollectionRecord<Schema extends DataSchema> = {
    [Key in keyof Schema]: Schema[Key] extends fields.EmbeddedCollectionField.Any ? Schema[Key] : never;
  };

  type Flags<ConcreteDocument extends Internal.Instance.Any> = OptionsForSchema<SchemaFor<ConcreteDocument>>;

  /** @internal */
  interface OptionsInFlags<Options extends DataField.Options.Any> {
    readonly flags?: DataField<Options, any>;
  }

  // These types only exists to simplify solving the `Document` type. Using `Document.Flags<this>` means the constraint `this extends Document.Any` has to be proved.
  // This is much more complex than proving the constraint for `Document.FlagsInternal<Schema>` that `Schema extends DataSchema`.

  // TODO: This needs to use the derived flags not just how they're initialized.
  type OptionsForSchema<Schema extends DataSchema> =
    RemoveIndexSignatures<Schema> extends OptionsInFlags<infer Options> ? DataField.InitializedType<Options> : never;

  // Like `keyof` but handles properties desirable for flags:
  // - `never` returns `never` (instead of `PropertyKey`).
  // - `unknown` returns `string` (instead of `never`).
  // - Allows any key in a union of objects (instead of just the common keys).
  // - Strips out non string keys.
  type FlagKeyOf<T> = unknown extends T
    ? string
    : [T] extends [never]
      ? never
      : T extends unknown
        ? keyof T & string
        : never;

  type FlagGetKey<T, K extends PropertyKey> = T extends unknown ? (K extends keyof T ? T[K] : never) : never;

  // Note(LukeAbby): It's at times been very important for `GetFlag` to be covariant over `ConcreteSchema`.
  // If it isn't then issues arise where the `Document` type ends up becoming invariant.
  // Currently it is actually contravariant over `ConcreteSchema` and this may cause issues (because of the usage of `keyof`).
  // Unfortunately it's not easy to avoid because the typical `GetKey` trick has issues between `never`, not defined at all, and `unknown` etc.
  type GetFlag<Name extends Document.Type, S extends string, K extends string> = FlagGetKey<
    FlagGetKey<Document.ConfiguredFlagsForName<Name>, S>,
    K
  >;

  interface CoreFlags {
    core?: {
      sheetLock?: boolean;
      sheetClass?: string;
    };
  }

  /** @internal */
  type _ConstructionContext<Parent extends Document.Any | null> = NullishProps<{
    /**
     * The parent Document of this one, if this one is embedded
     * @defaultValue `null`
     */
    parent: Parent;

    /**
     * The compendium collection ID which contains this Document, if any
     * @defaultValue `null`
     */
    pack: string;

    /**
     * Whether to validate initial data strictly?
     * @defaultValue `true`
     */
    strict: boolean;

    /**
     * An immutable reverse-reference to the name of the collection that this Document exists in on its parent, if any.
     * @privateRemarks Omitted from the typedef, inferred from usage in {@link Document._configure | `Document#_configure`}
     * (and included in the construction context rather than `ConfigureOptions` due to being passed to construction in
     * {@link foundry.abstract.EmbeddedCollection.createDocument | `EmbeddedCollection#createDocument`})
     */
    parentCollection: string;
  }>;

  /**
   * Foundry does not include the properties from the DataModel construction context in `DocumentConstructionContext`,
   * but they're all still valid.
   *
   * `strict` is omitted from the DataModel interface so the Document interface's property
   * description takes precedence.
   */
  interface ConstructionContext<Parent extends Document.Any | null = Document.Any | null>
    extends Omit<DataModel._ConstructionContext, "strict">,
      _ConstructionContext<Parent> {}

  /** `DataModel#constructor` pulls `parent` and `strict` out of the passed context before forwarding to `#_configure` */
  interface ConfigureOptions extends Omit<ConstructionContext, "parent" | "strict"> {}

  /** `DataModel#constructor` pulls `parent` out of the passed context before forwarding to `#_initializeSource` */
  interface InitializeOptions extends Omit<ConstructionContext, "parent"> {}

  /**
   * `DataModel#constructor` pulls `parent` out of the passed context before forwarding to `#_initializeSource`
   * @privateRemarks `Document` doesn't override `_initializeSource`, but at least one specific document does (Actor only, as of v12);
   * Without an override, this is handled by the `& ExtraConstructorOptions` in the `DataModel` signature, but with one,
   * a manually combined interface is needed.
   */
  interface InitializeSourceOptions extends DataModel.InitializeSourceOptions, Omit<ConstructionContext, "parent"> {}

  interface ModificationContext<Parent extends Document.Any | null> {
    /**
     * A parent Document within which these Documents should be embedded
     */
    parent?: Parent | undefined;

    /**
     * A Compendium pack identifier within which the Documents should be modified
     */
    pack?: string | undefined;

    /**
     * Block the dispatch of preCreate hooks for this operation
     * @defaultValue `false`
     */
    noHook?: boolean | undefined;

    /**
     * Return an index of the Document collection, used only during a get operation.
     * @defaultValue `false`
     */
    index?: boolean | undefined;

    /**
     * An array of fields to retrieve when indexing the collection
     */
    indexFields?: string[] | undefined;

    /**
     * When performing a creation operation, keep the provided _id instead of clearing it.
     * @defaultValue `false`
     */
    keepId?: boolean | undefined;

    /**
     * When performing a creation operation, keep existing _id values of documents embedded within the one being
     * created instead of generating new ones.
     * @defaultValue `true`
     */
    keepEmbeddedIds?: boolean | undefined;

    /**
     * Create a temporary document which is not saved to the database. Only used during creation.
     * @defaultValue `false`
     */
    temporary?: boolean | undefined;

    /**
     * Automatically re-render existing applications associated with the document.
     * @defaultValue `true`
     */
    render?: boolean | undefined;

    /**
     * Automatically create and render the Document sheet when the Document is first created.
     * @defaultValue `false`
     */
    renderSheet?: boolean | undefined;

    /**
     * Difference each update object against current Document data to reduce the size of the transferred data. Only
     * used during update.
     * @defaultValue `true`
     */
    diff?: boolean | undefined;

    /**
     * Merge objects recursively. If false, inner objects will be replaced explicitly. Use with caution!
     * @defaultValue `true`
     */
    recursive?: boolean | undefined;

    /**
     * Is the operation undoing a previous operation, only used by embedded Documents within a Scene
     */
    isUndo?: boolean | undefined;

    /**
     * Whether to delete all documents of a given type, regardless of the array of ids provided. Only used during a
     * delete operation.
     */
    deleteAll?: boolean | undefined;
  }

  /** @internal */
  type _CloneContext<Save extends boolean | null | undefined = boolean | null | undefined> = NullishProps<{
    /**
     * Save the clone to the World database?
     * @defaultValue `false`
     */
    save: Save;

    /**
     * Keep the same ID of the original document
     * @defaultValue `false`
     */
    keepId: boolean;

    /**
     * Track the clone source
     * @defaultValue `false`
     */
    addSource: boolean;
  }>;

  /**
   * @privateRemarks Since we've lost the ExtraConstructorOptions type param, we have to extend
   * the (parentless) construction context
   */
  interface CloneContext<Save extends boolean | null | undefined = boolean | null | undefined>
    extends _CloneContext<Save>,
      Omit<Document.ConstructionContext, "parent"> {}

  type ModificationOptions = Omit<Document.ModificationContext<Document.Any | null>, "parent" | "pack">;

  /* eslint-disable @typescript-eslint/no-deprecated */
  /** @deprecated Use {@link Database.PreCreateOptions | `Database.PreCreateOptions`} */
  type PreCreateOptions<Name extends Type> = Omit<
    Document.Database.OperationOf<Name, "create">,
    "data" | "noHook" | "pack" | "parent"
  >;

  /** @deprecated Use {@link Database.CreateOptions | `Database.CreateOptions`}  */
  type OnCreateOptions<Name extends Type> = Omit<
    Document.Database.OperationOf<Name, "create">,
    "pack" | "parentUuid" | "syntheticActorUpdate"
  >;

  /** @deprecated Use {@link Database.PreUpdateOptions | `Database.PreUpdateOperation`}  */
  type PreUpdateOptions<Name extends Type> = Omit<
    Document.Database.OperationOf<Name, "update">,
    "updates" | "restoreDelta" | "noHook" | "parent" | "pack"
  >;

  /** @deprecated Use {@link Database.UpdateOptions | `Database.OnUpdateOperation`} */
  type OnUpdateOptions<Name extends Type> = Omit<
    Document.Database.OperationOf<Name, "update">,
    "pack" | "parentUuid" | "syntheticActorUpdate"
  >;

  /** @deprecated Use {@link Database.PreDeleteOperationInstance | `Database.PreDeleteOperationInstance`} */
  type PreDeleteOptions<Name extends Type> = Omit<
    Document.Database.OperationOf<Name, "delete">,
    "ids" | "deleteAll" | "noHook" | "pack" | "parent"
  >;

  /** @deprecated Use {@link Database.DeleteOptions | `Database.OnDeleteOptions`} */
  type OnDeleteOptions<Name extends Type> = Omit<
    Document.Database.OperationOf<Name, "delete">,
    "deleteAll" | "pack" | "parentUuid" | "syntheticActorUpdate"
  >;

  /** @deprecated Use {@link Database.PreCreateOptions | `Database.PreCreateOptions`} or {@link Database.PreUpdateOptions | `Database.PreUpdateOperation`}*/
  type PreUpsertOptions<Name extends Type> = PreCreateOptions<Name> | PreUpdateOptions<Name>;

  /** @deprecated Use {@link Database.CreateOptions | `Database.CreateOptions`} or {@link Database.UpdateOptions | `Database.OnUpdateOperation`} */
  type OnUpsertOptions<Name extends Type> = OnCreateOptions<Name> | OnUpdateOptions<Name>;
  /* eslint-enable @typescript-eslint/no-deprecated */

  interface Metadata<out ThisType extends Document.Any> {
    readonly name: ThisType["documentName"];
    readonly collection: string;
    readonly indexed: boolean;
    readonly compendiumIndexFields: readonly string[];
    readonly label: string;
    readonly coreTypes: readonly string[];
    readonly embedded: {
      [DocumentType in Document.Type]?: string;
    };
    readonly permissions: {
      create: string | ToMethod<(user: User.Internal.Implementation, doc: ThisType, data: AnyObject) => boolean>;
      update: string | ToMethod<(user: User.Internal.Implementation, doc: ThisType, data: AnyObject) => boolean>;
      delete: string | ToMethod<(user: User.Internal.Implementation, doc: ThisType, data: EmptyObject) => boolean>;
    };
    readonly preserveOnImport: readonly string[];
    readonly schemaVersion?: string | undefined;
    readonly labelPlural?: string; // This is not set for the Document class but every class that implements Document actually provides it.
    readonly types?: readonly string[];
    readonly hasSystemData?: boolean;
  }

  namespace Metadata {
    interface Any extends Metadata<any> {}

    interface Default {
      readonly name: "Document";
      readonly collection: "documents";
      readonly indexed: false;
      readonly compendiumIndexFields: [];
      readonly label: "DOCUMENT.Document";
      readonly coreTypes: [CONST.BASE_DOCUMENT_TYPE];
      readonly embedded: EmptyObject;
      readonly permissions: {
        create: "ASSISTANT";
        update: "ASSISTANT";
        delete: "ASSISTANT";
      };
      readonly preserveOnImport: ["_id", "sort", "ownership"];
    }
  }

  type ConfiguredSheetClassFor<Name extends Document.Type> = MakeConform<
    GetKey<GetKey<CONFIG, Name>, "sheetClass">,
    AnyConstructor
  >;

  type ConfiguredObjectClassFor<Name extends Document.Type> = GetKey<GetKey<CONFIG, Name>, "objectClass">;

  type ConfiguredLayerClassFor<Name extends Document.Type> = GetKey<GetKey<CONFIG, Name>, "layerClass">;

  type DropData<T extends Document.Any> = T extends { id: string | undefined }
    ? DropData.Data<T> & DropData.UUID
    : DropData.Data<T>;

  namespace DropData {
    type Any = DropData<any>;

    interface Data<T extends Document.Any> {
      type: T["documentName"];
      data: T["_source"];
    }

    interface UUID {
      uuid: string;
    }
  }

  namespace Database {
    type Operation = "create" | "update" | "delete";

    /**
     * @privateRemarks Foundry types {@link Document.get | `Document.get`} as taking a {@link DatabaseGetOperation | `DatabaseGetOperation`}
     * but it only ever looks for `pack`
     */
    interface GetOptions extends Pick<DatabaseGetOperation, "pack"> {}

    /** Used for {@link Document.createDocuments | `Document.createDocuments`} */
    type CreateOperation<Op extends DatabaseCreateOperation> = NullishProps<Omit<Op, "data" | "modifiedTime">>;

    /** Used for {@link Document.update | `Document.update`} */
    type UpdateOperation<Op extends DatabaseUpdateOperation> = InexactPartial<Omit<Op, "updates">>;

    /** Used for {@link Document.delete | `Document.delete`} */
    type DeleteOperation<Op extends DatabaseDeleteOperation> = InexactPartial<Omit<Op, "ids">>;

    /** Used for {@link Document._preCreateOperation | `Document._preCreateOperation`} */
    type PreCreateOperationStatic<Op extends DatabaseCreateOperation> = InexactPartial<
      Op,
      Exclude<AllKeysOf<Op>, "modifiedTime" | "render" | "renderSheet" | "data" | "noHook" | "pack" | "parent">
    >;

    /** Used for {@link Document._preCreate | `Document#_preCreate`} */
    type PreCreateOptions<Op extends DatabaseCreateOperation> = Omit<
      PreCreateOperationStatic<Op>,
      "data" | "noHook" | "pack" | "parent"
    >;

    /** Used for {@link Document._onCreate | `Document#_onCreate`} */
    type CreateOptions<Op extends DatabaseCreateOperation> = Omit<
      Op,
      "data" | "pack" | "parentUuid" | "syntheticActorUpdate"
    >;

    /** Used for {@link Document.updateDocuments | `Document.updateDocuments`} */
    type UpdateDocumentsOperation<Op extends DatabaseUpdateOperation> = NullishProps<
      Omit<Op, "updates" | "modifiedTime">
    >;

    /** Used for {@link Document.update | `Document#update`} */
    type UpdateOperationInstance<Op extends DatabaseUpdateOperation> = InexactPartial<
      Omit<Op, "updates" | "parent" | "pack">
    >;

    /** Used for {@link Document._preUpdateOperation | `Document._preUpdateOperation`} */
    type PreUpdateOperationStatic<Op extends DatabaseUpdateOperation> = InexactPartial<
      Op,
      Exclude<
        AllKeysOf<Op>,
        "modifiedTime" | "diff" | "recursive" | "render" | "updates" | "restoreDelta" | "noHook" | "pack" | "parent"
      >
    >;

    /** Used for {@link Document._preUpdate | `Document#_preUpdate`} */
    type PreUpdateOptions<Op extends DatabaseUpdateOperation> = Omit<
      PreUpdateOperationStatic<Op>,
      "updates" | "restoreDelta" | "noHook" | "pack" | "parent"
    >;

    /** Used for {@link Document._onUpdate | `Document#_onUpdate`} */
    type UpdateOptions<Op extends DatabaseUpdateOperation> = Omit<
      Op,
      "updates" | "pack" | "parentUuid" | "syntheticActorUpdate"
    >;

    /** Used for {@link Document.deleteDocuments | `Document.deleteDocuments`} */
    type DeleteDocumentsOperation<Op extends DatabaseDeleteOperation> = NullishProps<Omit<Op, "ids" | "modifiedTime">>;

    /** Used for {@link Document.delete | `Document.delete`} */
    type DeleteOperationInstance<Op extends DatabaseDeleteOperation> = InexactPartial<
      Omit<Op, "ids" | "parent" | "pack">
    >;

    /** Used for {@link Document._preDeleteOperation | `Document._preDeleteOperation`} */
    type PreDeleteOperationStatic<Op extends DatabaseDeleteOperation> = InexactPartial<
      Op,
      Exclude<AllKeysOf<Op>, "modifiedTime" | "render" | "ids" | "deleteAll" | "noHook" | "pack" | "parent">
    >;

    /** Used for {@link Document._preDelete | `Document#_preDelete`} */
    type PreDeleteOperationInstance<Op extends DatabaseDeleteOperation> = Omit<
      InexactPartial<Op, Exclude<AllKeysOf<Op>, "modifiedTime" | "render">>,
      "ids" | "deleteAll" | "noHook" | "pack" | "parent"
    >;

    /** Used for {@link Document._onDelete | `Document#_onDelete`} */
    type DeleteOptions<Op extends DatabaseDeleteOperation> = Omit<
      Op,
      "ids" | "deleteAll" | "pack" | "parentUuid" | "syntheticActorUpdate"
    >;

    /**
     * This is a helper type that gets the right DatabaseOperation (including the
     * proper options) for a particular Document type.
     *
     * @deprecated This is no longer used internally inside fvtt-types. If you have use for it please file an issue.
     */
    type OperationOf<T extends Document.Type, Operation extends Database.Operation> =
      | (Operation extends "create" ? DatabaseOperationCreateMap[T] : never)
      | (Operation extends "update" ? DatabaseOperationUpdateMap[T] : never)
      | (Operation extends "delete" ? DatabaseOperationDeleteMap[T] : never);

    /**
     * @deprecated See individual document's namespaces.
     */
    interface Operations<
      _T extends Document.Internal.Instance.Any = Document.Internal.Instance.Any,
      _ExtraCreateOptions extends AnyObject = any,
      _ExtraUpdateOptions extends AnyObject = any,
      _ExtraDeleteOptions extends AnyObject = any,
    > {
      create: AnyObject;
      update: AnyObject;
      delete: AnyObject;
    }
  }

  interface DataFieldShimOptions {
    /**
     * A string to log as a compatibility warning on accessing the `oldKey`
     */
    warning?: string | null | undefined;

    /**
     * @remarks Foundry uses `if ("value" in options)` to determine whether to override the default value.
     */
    value?: unknown;
  }

  type ParentContext<Parent extends Document.Any | null> = Parent extends null
    ? {
        /** A parent document within which the created Document should belong */
        parent?: Parent | undefined;
      }
    : {
        /** A parent document within which the created Document should belong */
        parent: Parent;
      };

  type DefaultNameContext<SubType extends string, Parent extends Document.Any | null> = {
    /** The sub-type of the document */
    type?: SubType | undefined;

    /** A compendium pack within which the Document should be created */
    pack?: string | undefined;
  } & ParentContext<Parent>;

  interface FromDropDataOptions {
    /**
     * Import the provided document data into the World, if it is not already a World-level Document reference
     * @defaultValue `false`
     */
    importWorld?: boolean;
  }

  type CreateDialogData<CreateData extends object> = InexactPartial<
    CreateData,
    Extract<AllKeysOf<CreateData>, "name" | "type" | "folder">
  >;

  type CreateDialogContext<
    SubType extends string,
    Parent extends Document.Any | null,
  > = InexactPartial<Dialog.Options> & {
    /**
     * A compendium pack within which the Document should be created
     */
    pack?: string | null | undefined;

    /** A restriction the selectable sub-types of the Dialog. */
    types?: SubType[] | null | undefined;
  } & ParentContext<Parent>;

  interface FromImportContext<Parent extends Document.Any | null> extends ConstructionContext<Parent> {}

  type TestableOwnershipLevel = keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS;

  /** @internal */
  type _TestUserPermissionsOptions = NullishProps<{
    /**
     * Require the exact permission level requested?
     * @defaultValue `false`
     */
    exact: boolean;
  }>;

  interface TestUserPermissionOptions extends _TestUserPermissionsOptions {}

  /**
   * @deprecated {@link ImplementationFor | `ImplementationFor`}
   */
  type ConfiguredInstanceForName<Name extends Type> = ImplementationFor<Name>;

  /**
   * @deprecated {@link ImplementationClassFor | `ImplementationClassFor`}
   */
  type ConfiguredClassForName<Name extends Type> = ImplementationClassFor<Name>;

  /**
   * @deprecated {@link SchemaField.PersistedData | `SchemaField.PersistedData<Schema>`}
   */
  type ToObjectFalseType<T extends Document.Internal.Instance.Any> = T extends {
    toObject: (source: false) => infer U;
  }
    ? U
    : T;

  /**
   * @deprecated {@link Document.Database.OperationOf | `Document.Database.OperationOf`}
   */
  type DatabaseOperationsFor<
    Name extends Document.Type,
    ConcreteOperation extends Document.Database.Operation,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
  > = Document.Database.OperationOf<Name, ConcreteOperation>;

  /**
   * @deprecated {@link CreateDataForName | `CreateDataForName`}
   */
  type ConstructorDataForName<T extends Document.Type> = CreateData[T];

  type CanUserModifyData<Schema extends DataSchema, Action extends "create" | "update" | "delete"> =
    | (Action extends "create" ? SchemaField.CreateData<Schema> : never)
    | (Action extends "update" ? SchemaField.UpdateData<Schema> : never)
    | (Action extends "delete" ? EmptyObject : never);

  /**
   * @internal
   */
  type _GetEmbeddedDocumentOptions = NullishProps<{
    /**
     * Throw an Error if the requested id does not exist. See {@link Collection.get | `Collection#get`}
     * @defaultValue `false`
     */
    strict: boolean;

    /**
     * Allow retrieving an invalid Embedded Document.
     * @defaultValue `false`
     */
    invalid: boolean;
  }>;

  interface GetEmbeddedDocumentOptions extends _GetEmbeddedDocumentOptions {}

  /**
   * Gets the hierarchical fields in the schema. Hardcoded to whatever Foundry fields are hierarchical
   * as there is no way to access the a static property of a custom fields from an instance.
   */
  type HierarchyOf<Schema extends DataSchema> = PickValue<
    Schema,
    EmbeddedCollectionField.Any | EmbeddedDocumentField.Any
  >;

  // interface InitializeOptions extends D
}

/** @deprecated {@link Document.Database.Operation | `Document.Database.Operation`} */
export type Operation = Document.Database.Operation;

/* eslint-disable @typescript-eslint/no-deprecated */
/**
 * @deprecated if you want to get individual operations see {@link Document.Database.OperationOf | `Document.Database.OperationOf`}
 */
export interface DatabaseOperationMap {
  ActiveEffect: ActiveEffect.DatabaseOperations;
  Actor: Actor.DatabaseOperations;
  ActorDelta: ActorDelta.DatabaseOperations;
  Adventure: Adventure.DatabaseOperations;
  AmbientLight: AmbientLightDocument.DatabaseOperations;
  AmbientSound: AmbientSoundDocument.DatabaseOperations;
  Card: Card.DatabaseOperations;
  Cards: Cards.DatabaseOperations;
  ChatMessage: ChatMessage.DatabaseOperations;
  Combat: Combat.DatabaseOperations;
  Combatant: Combatant.DatabaseOperations;
  Drawing: DrawingDocument.DatabaseOperations;
  FogExploration: FogExploration.DatabaseOperations;
  Folder: Folder.DatabaseOperations;
  Item: Item.DatabaseOperations;
  JournalEntry: JournalEntry.DatabaseOperations;
  JournalEntryPage: JournalEntryPage.DatabaseOperations;
  Macro: Macro.DatabaseOperations;
  MeasuredTemplate: MeasuredTemplateDocument.DatabaseOperations;
  Note: NoteDocument.DatabaseOperations;
  Playlist: Playlist.DatabaseOperations;
  PlaylistSound: PlaylistSound.DatabaseOperations;
  Region: RegionDocument.DatabaseOperations;
  RegionBehavior: RegionBehavior.DatabaseOperations;
  RollTable: RollTable.DatabaseOperations;
  Scene: Scene.DatabaseOperations;
  Setting: Setting.DatabaseOperations;
  TableResult: TableResult.DatabaseOperations;
  Tile: TileDocument.DatabaseOperations;
  Token: TokenDocument.DatabaseOperations;
  User: User.DatabaseOperations;
  Wall: WallDocument.DatabaseOperations;
}
/* eslint-enable @typescript-eslint/no-deprecated */

interface DatabaseOperationCreateMap {
  ActiveEffect: ActiveEffect.Database.Create;
  Actor: Actor.Database.Create;
  ActorDelta: ActorDelta.Database.Create;
  Adventure: Adventure.Database.Create;
  AmbientLight: AmbientLightDocument.Database.Create;
  AmbientSound: AmbientSoundDocument.Database.Create;
  Card: Card.Database.Create;
  Cards: Cards.Database.Create;
  ChatMessage: ChatMessage.Database.Create;
  Combat: Combat.Database.Create;
  Combatant: Combatant.Database.Create;
  Drawing: DrawingDocument.Database.Create;
  FogExploration: FogExploration.Database.Create;
  Folder: Folder.Database.Create;
  Item: Item.Database.Create;
  JournalEntry: JournalEntry.Database.Create;
  JournalEntryPage: JournalEntryPage.Database.Create;
  Macro: Macro.Database.Create;
  MeasuredTemplate: MeasuredTemplateDocument.Database.Create;
  Note: NoteDocument.Database.Create;
  Playlist: Playlist.Database.Create;
  PlaylistSound: PlaylistSound.Database.Create;
  Region: RegionDocument.Database.Create;
  RegionBehavior: RegionBehavior.Database.Create;
  RollTable: RollTable.Database.Create;
  Scene: Scene.Database.Create;
  Setting: Setting.Database.Create;
  TableResult: TableResult.Database.Create;
  Tile: TileDocument.Database.Create;
  Token: TokenDocument.Database.Create;
  User: User.Database.Create;
  Wall: WallDocument.Database.Create;
}

interface DatabaseOperationUpdateMap {
  ActiveEffect: ActiveEffect.Database.Update;
  Actor: Actor.Database.Update;
  ActorDelta: ActorDelta.Database.Update;
  Adventure: Adventure.Database.Update;
  AmbientLight: AmbientLightDocument.Database.Update;
  AmbientSound: AmbientSoundDocument.Database.Update;
  Card: Card.Database.Update;
  Cards: Cards.Database.Update;
  ChatMessage: ChatMessage.Database.Update;
  Combat: Combat.Database.Update;
  Combatant: Combatant.Database.Update;
  Drawing: DrawingDocument.Database.Update;
  FogExploration: FogExploration.Database.Update;
  Folder: Folder.Database.Update;
  Item: Item.Database.Update;
  JournalEntry: JournalEntry.Database.Update;
  JournalEntryPage: JournalEntryPage.Database.Update;
  Macro: Macro.Database.Update;
  MeasuredTemplate: MeasuredTemplateDocument.Database.Update;
  Note: NoteDocument.Database.Update;
  Playlist: Playlist.Database.Update;
  PlaylistSound: PlaylistSound.Database.Update;
  Region: RegionDocument.Database.Update;
  RegionBehavior: RegionBehavior.Database.Update;
  RollTable: RollTable.Database.Update;
  Scene: Scene.Database.Update;
  Setting: Setting.Database.Update;
  TableResult: TableResult.Database.Update;
  Tile: TileDocument.Database.Update;
  Token: TokenDocument.Database.Update;
  User: User.Database.Update;
  Wall: WallDocument.Database.Update;
}

interface DatabaseOperationDeleteMap {
  ActiveEffect: ActiveEffect.Database.Delete;
  Actor: Actor.Database.Delete;
  ActorDelta: ActorDelta.Database.Delete;
  Adventure: Adventure.Database.Delete;
  AmbientLight: AmbientLightDocument.Database.Delete;
  AmbientSound: AmbientSoundDocument.Database.Delete;
  Card: Card.Database.Delete;
  Cards: Cards.Database.Delete;
  ChatMessage: ChatMessage.Database.Delete;
  Combat: Combat.Database.Delete;
  Combatant: Combatant.Database.Delete;
  Drawing: DrawingDocument.Database.Delete;
  FogExploration: FogExploration.Database.Delete;
  Folder: Folder.Database.Delete;
  Item: Item.Database.Delete;
  JournalEntry: JournalEntry.Database.Delete;
  JournalEntryPage: JournalEntryPage.Database.Delete;
  Macro: Macro.Database.Delete;
  MeasuredTemplate: MeasuredTemplateDocument.Database.Delete;
  Note: NoteDocument.Database.Delete;
  Playlist: Playlist.Database.Delete;
  PlaylistSound: PlaylistSound.Database.Delete;
  Region: RegionDocument.Database.Delete;
  RegionBehavior: RegionBehavior.Database.Delete;
  RollTable: RollTable.Database.Delete;
  Scene: Scene.Database.Delete;
  Setting: Setting.Database.Delete;
  TableResult: TableResult.Database.Delete;
  Tile: TileDocument.Database.Delete;
  Token: TokenDocument.Database.Delete;
  User: User.Database.Delete;
  Wall: WallDocument.Database.Delete;
}
