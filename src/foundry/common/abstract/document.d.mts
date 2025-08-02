import type {
  ConfiguredDocumentClass,
  ConfiguredDocumentInstance,
  ConfiguredMetadata,
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
  PickValue,
  Identity,
  Brand,
  AnyMutableObject,
  MaybePromise,
  SimpleMerge,
  PrettifyType,
  AllKeysOf,
  Override,
  ConcreteKeys,
} from "#utils";
import type * as CONST from "../constants.mts";
import type {
  DataSchema,
  DataField,
  DocumentStatsField,
  EmbeddedCollectionField,
  EmbeddedDocumentField,
  SchemaField,
  TypeDataField,
} from "../data/fields.d.mts";
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
import type EmbeddedCollection from "./embedded-collection.d.mts";
import type { SystemConfig } from "#configuration";

export default Document;

type InexactPartialExcept<T extends object, RequiredKey> = {
  [K in keyof T as Extract<K, RequiredKey>]: T[K];
} & {
  [K in keyof T as Exclude<K, RequiredKey>]?: T[K] | undefined;
};

type _ClassMustBeAssignableToInternal = MustConform<typeof Document, Document.Internal.Constructor>;
type _InstanceMustBeAssignableToInternal = MustConform<Document.Any, Document.Internal.Instance.Any>;

// Note(LukeAbby): Properties from `Schema` technically derive from `DataModel`. This means that if
// `name?: string` etc. were to be put in `Document` directly they'd actually override the schema.
// Therefore this workaround is used to force `DataModel` to override the properties.
declare const _InternalDocument: (new (...args: any[]) => {
  // TODO: removing undefined breaks everything, but should be valid to do, investigate
  name?: string | null | undefined;

  // `{}` is used so that `{}` and the actual shape of `system` are merged.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  system?: {} | undefined;
  _stats?: DocumentStatsField.InitializedData | undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  flags?: {} | undefined;
}) &
  typeof DataModel;

/**
 * An extension of the base DataModel which defines a Document.
 * Documents are special in that they are persisted to the database and referenced by _id.
 */
declare abstract class Document<
  DocumentName extends Document.Type,
  Schema extends DataSchema,
  Parent extends Document.Any | null = null,
> extends _InternalDocument<Schema, Parent, InterfaceToObject<Document.ConstructionContext<Parent>>> {
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
  static get schema(): SchemaField.Any;

  protected static override _initializationOrder(): Generator<[string, DataField.Any], void, undefined>;

  /**
   * Default metadata which applies to each instance of this Document type.
   * @defaultValue
   * ```typescript
   * {
   *   name: "Document",
   *   label: "DOCUMENT.Document"
   *   coreTypes: [BASE_DOCUMENT_TYPE],
   *   collection: "documents",
   *   embedded: {},
   *   hasTypeData: false,
   *   indexed: false,
   *   compendiumIndexFields: [],
   *   permissions: {
   *     view: "LIMITED"       // At least limited permission is required to view the Document
   *     create: "ASSISTANT",  // Assistants or Gamemasters can create Documents
   *     update: "ASSISTANT",  // Document owners can update Documents (this includes GM users)
   *     delete: "ASSISTANT"   // Assistants or Gamemasters can create Documents
   *   },
   *   preserveOnImport: ["_id", "sort", "ownership", folder],
   *   schemaVersion: undefined
   * }
   * ```
   */
  static metadata: Document.Metadata.Any;

  /**
   * @defaultValue `["DOCUMENT"]`
   */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * The database backend used to execute operations and handle results
   */
  static get database(): CONFIG["DatabaseBackend"];

  /**
   * Return a reference to the implemented subclass of this base document type.
   */
  static get implementation(): Document.Internal.Constructor;

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
  static get documentName(): Document.Type;

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

  _id: string | null;

  /**
   * The canonical identifier for this Document
   */
  get id(): string | null;

  /**
   * Test whether this Document is embedded within a parent Document
   */
  get isEmbedded(): boolean;

  /**
   * Is this document in a compendium?
   */
  get inCompendium(): boolean;

  /**
   * A Universally Unique Identifier (uuid) for this Document instance.
   */
  get uuid(): string;

  /**
   * Test whether a given User has sufficient permissions to create Documents of this type in general. This does not
   * guarantee that the User is able to create all Documents of this type, as certain document-specific requirements
   * may also be present.
   *
   * Generally speaking, this method is used to verify whether a User should be presented with the option to create
   * Documents of this type in the UI.
   * @param user - The User being tested
   * @returns Does the User have a sufficient role to create?
   */
  static canUserCreate(user: User.Implementation): boolean;

  /**
   * Get the explicit permission level that a User has over this Document, a value in {@link CONST.DOCUMENT_OWNERSHIP_LEVELS | `CONST.DOCUMENT_OWNERSHIP_LEVELS`}.
   * Compendium content ignores the ownership field in favor of User role-based ownership. Otherwise, Documents use
   * granular per-User ownership definitions and Embedded Documents defer to their parent ownership.
   *
   * This method returns the value recorded in Document ownership, regardless of the User's role, for example a
   * GAMEMASTER user might still return a result of NONE if they are not explicitly denoted as having a level.
   *
   * To test whether a user has a certain capability over the document, testUserPermission should be used.
   * @param user - The User being tested (default: `game.user`)
   * @returns A numeric permission level from CONST.DOCUMENT_OWNERSHIP_LEVELS or null
   *
   * @privateRemarks Making this just `User.Implementation` causes circularities
   */
  getUserLevel(user?: User.Internal.Implementation | null): CONST.DOCUMENT_OWNERSHIP_LEVELS | null;

  /**
   * Test whether a certain User has a requested permission level (or greater) over the Document
   * @param user       - The User being tested
   * @param permission - The permission level from DOCUMENT_PERMISSION_LEVELS to test
   * @param options    - Additional options involved in the permission test
   * @returns Does the user have this permission level over the Document?
   *
   * @privateRemarks Making this just `User.Implementation` causes circularities
   */
  // options: not null (destructured)
  testUserPermission(
    user: User.Internal.Implementation,
    permission: Document.ActionPermission,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  /**
   * Test whether a given User has permission to perform some action on this Document
   * @param user   - The User attempting modification
   * @param action - The attempted action
   * @param data   - Data involved in the attempted action (default: `{}`)
   * @returns Does the User have permission?
   *
   * @privateRemarks Making this just `User.Implementation` causes circularities
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
  override clone<Save extends boolean | null | undefined = undefined>(
    data?: SchemaField.UpdateData<Schema>,
    context?: Document.CloneContext<Save>,
  ): Document.Clone<this, Save>;

  /**
   * For Documents which include game system data, migrate the system data object to conform to its latest data model.
   * The data model is defined by the template.json specification included by the game system.
   * @returns The migrated system data object
   * @throws If this document type either doesn't have subtypes or it does but the one on this document is a DataModel
   */
  migrateSystemData(): object;

  /** @remarks `Document#toObject` calls `this.constructor.shimData()` on the data before returning */
  override toObject(source?: boolean | null): SchemaField.SourceData<Schema>;

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
   * @see {@linkcode Document.createDocuments}
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
  // TODO: This can take an array of data and return an array of documents, in addition to its current typing
  static create(data: never, operation?: never): Promise<Document.Any | undefined>;

  /**
   * Update this Document using incremental data, saving it to the database.
   * @see {@linkcode Document.updateDocuments}
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
   * @see {@linkcode Document.deleteDocuments}
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
   *
   * @remarks If the Document is in a compendium (i.e `operation.pack` is provided), returns the index
   * entry (or `null`), instead of the Document.
   *
   * {@link FogExploration.get | `FogExploration.get`} can possibly forward args and return to/from
   * {@link FogExploration.load | `FogExploration.load`}, which accounts for the `Promise<>` part
   * of the return; All other documents return `SomeDoc.Implementation | null`
   */
  // TODO: Type for possible index entry return
  static get(documentId: string, operation?: Document.Database.GetOptions): MaybePromise<Document.Any | null>;

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
  getEmbeddedDocument(
    embeddedName: never,
    id: string,
    options: Document.GetEmbeddedDocumentOptions,
  ): Document.Any | undefined;

  /**
   * Create multiple embedded Document instances within this parent Document using provided input data.
   * @see {@linkcode Document.createDocuments}
   * @param embeddedName - The name of the embedded Document type
   * @param data         - An array of data objects used to create multiple documents
   *                       (default: `[]`)
   * @param operation    - Parameters of the database creation workflow
   *                       (default: `{}`)
   * @returns An array of created Document instances
   */
  // Note: This uses `never` because it's unsound to try to call `Document#createEmbeddedDocuments` directly.
  // Note(LukeAbby): Returns `unknown` instead of `Promise<Array<Document.AnyStored> | undefined>` to stymy errors.
  createEmbeddedDocuments(
    embeddedName: never,
    // Note: Not optional because `createEmbeddedDocuments("Actor")` does effectively nothing.
    data: never,
    operation?: never,
  ): unknown;

  /**
   * Update multiple embedded Document instances within a parent Document using provided differential data.
   * @see {@linkcode Document.updateDocuments}
   * @param embeddedName - The name of the embedded Document type
   * @param updates      - An array of differential data objects, each used to update a single Document
   *                       (default: `[]`)
   * @param operation    - Parameters of the database update workflow
   *                       (default: `{}`)
   * @returns An array of updated Document instances
   */
  // Note: This uses `never` because it's unsound to try to call `Document#updateEmbeddedDocuments` directly.
  // Note(LukeAbby): Returns `unknown` instead of `Promise<Array<Document.AnyStored> | undefined>` to stymy errors.
  updateEmbeddedDocuments(
    embeddedName: never,
    // Note: Not optional because `updateEmbeddedDocuments("Actor")` does effectively nothing.
    updates: never,
    context?: never,
  ): unknown;

  /**
   * Delete multiple embedded Document instances within a parent Document using provided string ids.
   * @see {@linkcode Document.deleteDocuments}
   * @param embeddedName - The name of the embedded Document type
   * @param ids          - An array of string ids for each Document to be deleted
   * @param operation    - Parameters of the database deletion workflow
   *                       (default: `{}`)
   * @returns An array of deleted Document instances
   */
  // Note: This uses `never` because it's unsound to try to call `Document#deleteEmbeddedDocuments` directly.
  // Note(LukeAbby): Returns `unknown` instead of `Promise<Array<Document.AnyStored> | undefined>` to stymy errors.
  deleteEmbeddedDocuments(embeddedName: never, ids: Array<string>, operation?: never): unknown;

  /**
   * Iterate over all embedded Documents that are hierarchical children of this Document.
   * @param _parentPath - A parent field path already traversed
   * @remarks Not called within Foundry's client-side code, likely exists for server documents
   */
  traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.AnyChild<this>], void, undefined>;

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
  protected _onCreate(data: never, options: never, userId: string): MaybePromise<void>;

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
  protected _onUpdate(changed: never, options: never, userId: string): MaybePromise<void>;

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
  protected _onDelete(options: never, userId: string): MaybePromise<void>;

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
    apply?: (data: AnyMutableObject) => unknown,
  ): unknown;

  // options: not null (destructured where forwarded)
  protected static _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onCreateDocuments` static method is deprecated in favor of {@link Document._onCreateOperation | `Document._onCreateOperation`}"
   */
  // Note: This uses `never` because it's unsound to try to do `Document._onCreateDocuments` directly.
  protected static _onCreateDocuments(
    documents: never,
    context: Document.ModificationContext<Document.Any | null>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onUpdateDocuments` static method is deprecated in favor of {@link Document._onUpdateOperation | `Document._onUpdateOperation`}"
   */
  // Note: This uses `never` because it's unsound to try to do `Document._onUpdateDocuments` directly.
  protected static _onUpdateDocuments(
    documents: never,
    context: Document.ModificationContext<Document.Any | null>,
  ): Promise<unknown>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks "The `Document._onDeleteDocuments` static method is deprecated in favor of {@link Document._onDeleteOperation | `Document._onDeleteOperation`}"
   */
  // Note: This uses `never` because it's unsound to try to do `Document._onDeleteDocuments` directly.
  protected static _onDeleteDocuments(
    documents: never,
    context: Document.ModificationContext<Document.Any | null>,
  ): Promise<unknown>;

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
}

declare namespace Document {
  interface Any extends AnyDocument {}
  interface AnyStored extends Document.Internal.Stored<Any> {}
  interface AnyValid extends AnyDocument {
    get invalid(): false;
  }
  interface AnyInvalid extends Document.Internal.Invalid<AnyValid> {}

  interface AnyConstructor extends Identity<typeof AnyDocument> {}

  type Type = CONST.ALL_DOCUMENT_TYPES;

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

  type PrimaryType = CONST.PRIMARY_DOCUMENT_TYPES;
  type EmbeddedType = CONST.EMBEDDED_DOCUMENT_TYPES;
  type WorldType = CONST.WORLD_DOCUMENT_TYPES;
  type CompendiumType = CONST.COMPENDIUM_DOCUMENT_TYPES;

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
    | "CombatantGroup"
    | "Item"
    | "JournalEntryPage"
    | "RegionBehavior";

  type CoreTypesForName<Name extends Type> = _CoreTypes<
    Name,
    string & GetKey<Document.MetadataFor<Name>, "coreTypes", [CONST.BASE_DOCUMENT_TYPE]>[number]
  >;

  /** @internal */
  type _CoreTypes<Name extends Type, Types> = SystemConfig extends { [_ in Name]: { readonly base: "ignore" } }
    ? Exclude<Types, "base">
    : Types;

  type ConfiguredSubTypeOf<Name extends Type> = Name extends "ActorDelta"
    ? ConfiguredSubTypeOf<"Actor">
    : // ESLint doesn't know that `DataModelConfig` and `SourceConfig` are meant to be declaration merged into.
      // Therefore it hastily thinks the results are always `never`.
      // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-duplicate-type-constituents
      string & (keyof GetKey<DataModelConfig, Name, unknown> | keyof GetKey<SourceConfig, Name, unknown>);

  type SubTypesOf<Name extends Document.Type> = Name extends "ActorDelta"
    ? SubTypesOf<"Actor">
    : Document.CoreTypesForName<Name> | ConfiguredSubTypeOf<Name> | _ModuleSubType<Name>;

  /** @internal */
  type _ModuleSubType<Name extends Type> = SystemConfig extends {
    [_ in Name]: { readonly moduleSubType: "ignore" };
  }
    ? never
    : Document.MetadataFor<Name> extends { readonly hasTypeData: true }
      ? Document.ModuleSubType
      : never;

  type ModuleSubType = Brand<`${string}.${string}`, "Document.ModuleSubtype">;

  type OfType<Name extends WithSubTypes, SubType extends SubTypesOf<Name>> =
    | (Name extends "ActiveEffect" ? ActiveEffect.OfType<SubType & ActiveEffect.SubType> : never)
    | (Name extends "ActorDelta" ? ActorDelta.OfType<SubType & ActorDelta.SubType> : never)
    | (Name extends "Actor" ? Actor.OfType<SubType & Actor.SubType> : never)
    | (Name extends "Card" ? Card.OfType<SubType & Card.SubType> : never)
    | (Name extends "Cards" ? Cards.OfType<SubType & Cards.SubType> : never)
    | (Name extends "ChatMessage" ? ChatMessage.OfType<SubType & ChatMessage.SubType> : never)
    | (Name extends "Combat" ? Combat.OfType<SubType & Combat.SubType> : never)
    | (Name extends "Combatant" ? Combatant.OfType<SubType & Combatant.SubType> : never)
    | (Name extends "CombatantGroup" ? CombatantGroup.OfType<SubType & CombatantGroup.SubType> : never)
    | (Name extends "Folder" ? Folder.OfType<SubType & Folder.SubType> : never)
    | (Name extends "Item" ? Item.OfType<SubType & Item.SubType> : never)
    | (Name extends "JournalEntryPage" ? JournalEntryPage.OfType<SubType & JournalEntryPage.SubType> : never)
    | (Name extends "Macro" ? Macro.OfType<SubType & Macro.SubType> : never)
    | (Name extends "RegionBehavior" ? RegionBehavior.OfType<SubType & RegionBehavior.SubType> : never)
    | (Name extends "TableResult" ? TableResult.OfType<SubType & TableResult.SubType> : never);

  /**
   * With the existence of custom module subtypes a system can no longer rely on their configured types being the only ones.
   * A module can provide its own custom type though it is always of the form `${moduleName}.${subType}` so the `.` is a pretty
   * strong indicator.
   *
   * `UnknownSourceData` covers the case where it's configured without a data model.
   * See {@linkcode UnknownSystem} for other possibilities.
   */
  interface UnknownSourceData extends AnyObject {
    type: ModuleSubType;
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
    | "CombatantGroup"
    | "Item"
    | "JournalEntryPage"
    | "RegionBehavior";

  namespace Embedded {
    type CollectionNameFor<
      Embedded extends Document.Metadata.Embedded,
      CollectionName extends Document.Embedded.CollectionName<Embedded>,
    > = Extract<GetKey<Metadata.Embedded, CollectionName, CollectionName>, Document.Type>;

    type DocumentFor<
      Embedded extends Document.Metadata.Embedded,
      CollectionName extends Document.Embedded.CollectionName<Embedded>,
    > = Document.ImplementationFor<CollectionNameFor<Embedded, CollectionName>>;

    type CollectionFor<
      Parent extends Document.Any,
      Embedded extends Document.Metadata.Embedded,
      CollectionName extends Document.Embedded.CollectionName<Embedded>,
    > = EmbeddedCollection<DocumentFor<Embedded, CollectionName>, Parent>;

    type CollectionName<Embedded extends Document.Metadata.Embedded> = {
      [K in keyof Embedded]: K extends Document.Type ? Extract<K | Embedded[K], string> : never;
    }[keyof Embedded];
  }

  /**
   * @internal
   */
  interface _WorldCollectionMap {
    Actor: foundry.documents.collections.Actors.Implementation;
    Cards: foundry.documents.collections.CardStacks;
    Combat: foundry.documents.collections.CombatEncounters;
    FogExploration: foundry.documents.collections.FogExplorations;
    Folder: foundry.documents.collections.Folders;
    Item: foundry.documents.collections.Items;
    JournalEntry: foundry.documents.collections.Journal;
    Macro: foundry.documents.collections.Macros;
    ChatMessage: foundry.documents.collections.ChatMessages;
    Playlist: foundry.documents.collections.Playlists;
    Scene: foundry.documents.collections.Scenes;
    Setting: foundry.documents.collections.WorldSettings;
    RollTable: foundry.documents.collections.RollTables;
    User: foundry.documents.collections.Users;
  }

  type WorldCollectionFor<Name extends Document.WorldType> = _WorldCollectionMap[Name];

  type IsParentOf<
    ParentDocument extends Document.Internal.Instance.Any,
    ChildDocument extends Document.Internal.Instance.Any,
  > = ParentDocument extends Internal.ParentFor<ChildDocument> ? true : false;

  type SocketRequest<Action extends DatabaseAction> = DocumentSocketRequest<Action>;
  type SocketResponse<Action extends DatabaseAction> = DocumentSocketResponse<Action>;

  // Documented at https://gist.github.com/LukeAbby/c7420b053d881db4a4d4496b95995c98
  namespace Internal {
    type Constructor = (abstract new (...args: never) => Instance.Any) & {
      documentName: Document.Type;
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

    type ModelMap<Name extends Document.WithSubTypes> = _ModelMap<
      Name,
      // `{}` is used to avoid `keyof never` issues.
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      GetKey<DataModelConfig, Name, {}>,
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      GetKey<SourceConfig, Name, {}>
    > &
      // `Document.ModuleSubType` has to be accounted for specially because of its perculiar nature.
      Record<Document.ModuleSubType, _ModuleSubTypeFor<Name>>;

    type _ModuleSubTypeFor<Name extends Document.WithSubTypes> = SystemConfig extends {
      readonly [_ in Name]: { readonly moduleSubtype: "ignore" };
    }
      ? never
      : // The `Extract<..., object>` serves a dual purpose:
        // 1) Get rid of `| undefined` for optional subtypes.
        // 2) Make sure it's obvious to TypeScript `system` is always an object.
        Extract<GetKey<GetKey<DataModelConfig, Name, object>, Document.ModuleSubType, Document.UnknownSystem>, object>;

    // Note(LukeAbby): This is written this way to preserve any optional modifiers.
    type _ModelMap<Name extends Document.WithSubTypes, DataModel, Config> = PrettifyType<
      SimpleMerge<
        {
          [SubType in Document.CoreTypesForName<Name>]: EmptyObject;
        },
        SimpleMerge<
          {
            [SubType in keyof DataModel]: EmptyObject;
          },
          {
            [SubType in keyof Config]: EmptyObject;
          }
        >
      >
    >;

    type SystemMap<Name extends Document.WithSubTypes> = _SystemMap<
      Name,
      // `{}` is used to avoid `keyof never` issues.
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      GetKey<DataModelConfig, Name, {}>,
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      GetKey<DataConfig, Name, {}>
    > &
      // `Document.ModuleSubType` has to be accounted for specially because of its perculiar nature.
      Record<Document.ModuleSubType, _ModuleSubTypeFor<Name>>;

    // Note(LukeAbby): This is written this way to preserve any optional modifiers.
    type _SystemMap<Name extends Document.WithSubTypes, DataModel, DataConfig> = PrettifyType<
      SimpleMerge<
        {
          [SubType in Document.CoreTypesForName<Name>]: EmptyObject;
        },
        SimpleMerge<
          {
            [SubType in keyof DataModel]: DataModel[SubType] extends
              | (abstract new (...args: never) => infer Model extends DataModel.Any)
              | undefined
              ? Model
              : never;
          },
          {
            [SubType in keyof DataConfig]: DataConfig[SubType];
          }
        >
      >
    >;

    type SystemOfType<
      Name extends Document.WithSystem,
      SystemMap extends Record<SubType, object | undefined>,
      SubType extends string,
      ConfiguredSubType extends string,
    > = SystemConfig extends { readonly [_ in Name]: { readonly discriminate: "all" } }
      ? _DiscriminateUndefined<SystemMap[SubType]>
      :
          | ([Extract<SubType, ConfiguredSubType>] extends [never]
              ? never
              : _DiscriminateUndefined<SystemMap[Extract<SubType, ConfiguredSubType>]>)
          | ([Exclude<SubType, ConfiguredSubType>] extends [never]
              ? never
              : SystemMap[Exclude<SubType, ConfiguredSubType>]);

    /** @internal */
    type _DiscriminateUndefined<T extends object | undefined> = _DiscriminatedUnion<
      Exclude<T, undefined>,
      {
        // Avoid discriminating index signatures.
        [K in keyof T]: ConcreteKeys<T>;
      }[keyof T]
    >;

    /** @internal */
    type _DiscriminatedUnion<U extends object, AllKeys extends PropertyKey> = U extends object
      ? [Exclude<AllKeys, keyof U>] extends [never]
        ? U
        : U & {
            readonly [K in Exclude<AllKeys, keyof U>]?: never;
          }
      : never;

    // TODO(LukeAbby): Improve the type display with a helper here.
    // TODO(LukeAbby): Add `StoredSource` for a better type display there.
    type Stored<D extends Document.Any> = Override<
      D,
      {
        id: string;
        _id: string;
        _source: Override<D["_source"], { _id: string }>;
        toJSON(): Override<D["_source"], { _id: string }>;
      }
    >;

    type Invalid<D extends Document.Any> = D extends { system: unknown } ? _InvalidSystem<D> : _Invalid<D>;

    /** @internal */
    // @ts-expect-error This pattern is inherently an error.
    interface _InvalidSystem<D extends Document.Any> extends D {
      // `Record<string, unknown>` is used to allow arbitrary property access since `in` checks are
      // a nuisance.
      _source: Record<string, unknown>;
      system: Record<string, unknown>;
      get invalid(): true;
    }

    /** @internal */
    // @ts-expect-error This pattern is inherently an error.
    interface _Invalid<D extends Document.Any> extends D {
      _source: Record<string, unknown>;
      get invalid(): true;
    }

    type DiscriminateSystem<
      Name extends Document.WithSystem,
      TypeMap extends Record<SubType, { system: object | undefined }>,
      SubType extends string,
      ConfiguredSubType extends string,
    > = SystemConfig extends { readonly [_ in Name]: { readonly discriminate: "all" } }
      ? DiscriminateSubType<SubType, TypeMap>
      :
          | DiscriminateSubType<Extract<SubType, ConfiguredSubType>, TypeMap>
          | ([Exclude<SubType, ConfiguredSubType>] extends [never]
              ? never
              : TypeMap[Exclude<SubType, ConfiguredSubType>]);

    type DiscriminateSubType<
      SubType extends AllSubType,
      TypeMap extends Record<AllSubType, { system: object | undefined }>,
      AllSubType extends string = SubType,
    > = SubType extends unknown
      ? [AllSubType] extends [SubType]
        ? TypeMap[SubType] // There's only one subtype so avoid the worse type display of `OfType`.
        : _DiscriminateSubType<SubType, TypeMap, AllSubType>
      : never;

    type _DiscriminateSubType<
      OneSubType extends AllSubType,
      TypeMap extends Record<AllSubType, { system: object | undefined }>,
      AllSubType extends string,
    > = TypeMap[OneSubType] & {
      system: SystemDiscriminant<
        Exclude<TypeMap[OneSubType]["system"], undefined>,
        Exclude<TypeMap[AllSubType]["system"], undefined>
      >;
    };

    /** @internal */
    type SystemDiscriminant<System extends object, AllSystem extends object> = Omit<
      {
        [K in AllKeysOf<AllSystem>]?: never;
      },
      keyof System
    >;

    interface DropData<DocumentType extends Document.Type> {
      /**
       * The data used to create a new document.
       * At least one of `data` and `uuid` must be set.
       */
      data?: Document.CreateDataForName<DocumentType>;

      /**
       * The uuid of an existing document.
       * At least one of `data` and `uuid` must be set.
       */
      // TODO: Handle as part of the UUID update.
      uuid?: string;
    }

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
          ? // Note(LukeAbby): This is a quick hack to get core flags on all documents.
            // This should definitely be improved.
            keyof (T & CoreFlags) & string
          : never;

    type FlagGetKey<T, K extends PropertyKey> = T extends unknown
      ? K extends keyof (T & CoreFlags)
        ? (T & CoreFlags)[K]
        : never
      : never;

    // Note(LukeAbby): It's at times been very important for `GetFlag` to be covariant over `ConcreteSchema`.
    // If it isn't then issues arise where the `Document` type ends up becoming invariant.
    // Currently it is actually contravariant over `ConcreteSchema` and this may cause issues (because of the usage of `keyof`).
    // Unfortunately it's not easy to avoid because the typical `GetKey` trick has issues between `never`, not defined at all, and `unknown` etc.
    type GetFlag<Flags extends object, S extends string, K extends string> = FlagGetKey<
      FlagGetKey<Flags & CoreFlags, S>,
      K
    >;

    // The type `{}` is useful here because in an intersection it reduces down to nothing unlike `EmptyObject`.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    type ConfiguredFlagsForName<Name extends Type> = GetKey<FlagConfig, Name, {}>;

    // Note(LukeAbby): Will be updated with the CONFIG revamp.
    type ConfiguredCollectionClass<Name extends Document.Type> = CONFIG extends {
      readonly [K in Name]: {
        readonly documentClass?: infer DocumentClass;
      };
    }
      ? DocumentClass
      : never;

    // Note(LukeAbby): Will be updated with the CONFIG revamp.
    type ConfiguredCollection<Name extends Document.Type> = FixedInstanceType<ConfiguredCollectionClass<Name>>;
  }

  /** Any Document, that is a child of the given parent Document. */
  // An empty schema is the most appropriate type due to removing index signatures.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  type AnyChild<Parent extends Any | null> = Document<Document.Type, {}, Parent>;

  // These helper types exist to help break a loop

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
    | (DocumentType extends "CombatantGroup" ? CombatantGroup.CreateData : never)
    | (DocumentType extends "FogExploration" ? FogExploration.CreateData : never)
    | (DocumentType extends "Folder" ? Folder.CreateData : never)
    | (DocumentType extends "Item" ? Item.CreateData : never)
    | (DocumentType extends "JournalEntryCategory" ? JournalEntryCategory.CreateData : never)
    | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.CreateData : never)
    | (DocumentType extends "JournalEntry" ? JournalEntry.CreateData : never)
    | (DocumentType extends "Macro" ? Macro.CreateData : never)
    | (DocumentType extends "PlaylistSound" ? PlaylistSound.CreateData : never)
    | (DocumentType extends "Playlist" ? Playlist.CreateData : never)
    | (DocumentType extends "RegionBehavior" ? RegionBehavior.CreateData : never)
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
    | (DocumentType extends "Region" ? RegionDocument.CreateData : never)
    | (DocumentType extends "Tile" ? TileDocument.CreateData : never)
    | (DocumentType extends "Token" ? TokenDocument.CreateData : never)
    | (DocumentType extends "Wall" ? WallDocument.CreateData : never);

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
    | (DocumentType extends "CombatantGroup" ? CombatantGroup.UpdateData : never)
    | (DocumentType extends "FogExploration" ? FogExploration.UpdateData : never)
    | (DocumentType extends "Folder" ? Folder.UpdateData : never)
    | (DocumentType extends "Item" ? Item.UpdateData : never)
    | (DocumentType extends "JournalEntryCategory" ? JournalEntryCategory.UpdateData : never)
    | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.UpdateData : never)
    | (DocumentType extends "JournalEntry" ? JournalEntry.UpdateData : never)
    | (DocumentType extends "Macro" ? Macro.UpdateData : never)
    | (DocumentType extends "PlaylistSound" ? PlaylistSound.UpdateData : never)
    | (DocumentType extends "Playlist" ? Playlist.UpdateData : never)
    | (DocumentType extends "RegionBehavior" ? RegionBehavior.UpdateData : never)
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
    | (DocumentType extends "Region" ? NoteDocument.UpdateData : never)
    | (DocumentType extends "Tile" ? TileDocument.UpdateData : never)
    | (DocumentType extends "Token" ? TokenDocument.UpdateData : never)
    | (DocumentType extends "Wall" ? WallDocument.UpdateData : never);

  type SourceForName<DocumentType extends Document.Type> =
    | (DocumentType extends "ActiveEffect" ? ActiveEffect.Source : never)
    | (DocumentType extends "ActorDelta" ? ActorDelta.Source : never)
    | (DocumentType extends "Actor" ? Actor.Source : never)
    | (DocumentType extends "Adventure" ? Adventure.Source : never)
    | (DocumentType extends "Card" ? Card.Source : never)
    | (DocumentType extends "Cards" ? Cards.Source : never)
    | (DocumentType extends "ChatMessage" ? ChatMessage.Source : never)
    | (DocumentType extends "Combat" ? Combat.Source : never)
    | (DocumentType extends "Combatant" ? Combatant.Source : never)
    | (DocumentType extends "CombatantGroup" ? CombatantGroup.Source : never)
    | (DocumentType extends "FogExploration" ? FogExploration.Source : never)
    | (DocumentType extends "Folder" ? Folder.Source : never)
    | (DocumentType extends "Item" ? Item.Source : never)
    | (DocumentType extends "JournalEntryCategory" ? JournalEntryCategory.Source : never)
    | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.Source : never)
    | (DocumentType extends "JournalEntry" ? JournalEntry.Source : never)
    | (DocumentType extends "Macro" ? Macro.Source : never)
    | (DocumentType extends "PlaylistSound" ? PlaylistSound.Source : never)
    | (DocumentType extends "Playlist" ? Playlist.Source : never)
    | (DocumentType extends "RegionBehavior" ? RegionBehavior.Source : never)
    | (DocumentType extends "RollTable" ? RollTable.Source : never)
    | (DocumentType extends "Scene" ? Scene.Source : never)
    | (DocumentType extends "Setting" ? Setting.Source : never)
    | (DocumentType extends "TableResult" ? TableResult.Source : never)
    | (DocumentType extends "User" ? User.Source : never)
    | (DocumentType extends "AmbientLight" ? AmbientLightDocument.Source : never)
    | (DocumentType extends "AmbientSound" ? AmbientSoundDocument.Source : never)
    | (DocumentType extends "Drawing" ? DrawingDocument.Source : never)
    | (DocumentType extends "MeasuredTemplate" ? MeasuredTemplateDocument.Source : never)
    | (DocumentType extends "Note" ? NoteDocument.Source : never)
    | (DocumentType extends "Region" ? NoteDocument.Source : never)
    | (DocumentType extends "Tile" ? TileDocument.Source : never)
    | (DocumentType extends "Token" ? TokenDocument.Source : never)
    | (DocumentType extends "Wall" ? WallDocument.Source : never);

  type ParentForName<DocumentType extends Document.Type> =
    | (DocumentType extends "ActiveEffect" ? ActiveEffect.Parent : never)
    | (DocumentType extends "ActorDelta" ? ActorDelta.Parent : never)
    | (DocumentType extends "Actor" ? Actor.Parent : never)
    | (DocumentType extends "Adventure" ? Adventure.Parent : never)
    | (DocumentType extends "Card" ? Card.Parent : never)
    | (DocumentType extends "Cards" ? Cards.Parent : never)
    | (DocumentType extends "ChatMessage" ? ChatMessage.Parent : never)
    | (DocumentType extends "Combat" ? Combat.Parent : never)
    | (DocumentType extends "Combatant" ? Combatant.Parent : never)
    | (DocumentType extends "CombatantGroup" ? CombatantGroup.Parent : never)
    | (DocumentType extends "FogExploration" ? FogExploration.Parent : never)
    | (DocumentType extends "Folder" ? Folder.Parent : never)
    | (DocumentType extends "Item" ? Item.Parent : never)
    | (DocumentType extends "JournalEntryCategory" ? JournalEntryCategory.Parent : never)
    | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.Parent : never)
    | (DocumentType extends "JournalEntry" ? JournalEntry.Parent : never)
    | (DocumentType extends "Macro" ? Macro.Parent : never)
    | (DocumentType extends "PlaylistSound" ? PlaylistSound.Parent : never)
    | (DocumentType extends "Playlist" ? Playlist.Parent : never)
    | (DocumentType extends "RegionBehavior" ? RegionBehavior.Parent : never)
    | (DocumentType extends "RollTable" ? RollTable.Parent : never)
    | (DocumentType extends "Scene" ? Scene.Parent : never)
    | (DocumentType extends "Setting" ? Setting.Parent : never)
    | (DocumentType extends "TableResult" ? TableResult.Parent : never)
    | (DocumentType extends "User" ? User.Parent : never)
    | (DocumentType extends "AmbientLight" ? AmbientLightDocument.Parent : never)
    | (DocumentType extends "AmbientSound" ? AmbientSoundDocument.Parent : never)
    | (DocumentType extends "Drawing" ? DrawingDocument.Parent : never)
    | (DocumentType extends "MeasuredTemplate" ? MeasuredTemplateDocument.Parent : never)
    | (DocumentType extends "Note" ? NoteDocument.Parent : never)
    | (DocumentType extends "Region" ? NoteDocument.Parent : never)
    | (DocumentType extends "Tile" ? TileDocument.Parent : never)
    | (DocumentType extends "Token" ? TokenDocument.Parent : never)
    | (DocumentType extends "Wall" ? WallDocument.Parent : never);

  type SystemConstructor = AnyConstructor & {
    metadata: { name: SystemType };
  };

  type ToConfiguredClass<ConcreteDocument extends Document.Internal.Constructor> = ImplementationClassFor<
    NameFor<ConcreteDocument>
  >;

  type ToConfiguredInstance<ConcreteDocument extends Document.Internal.Constructor> = ImplementationFor<
    NameFor<ConcreteDocument>
  >;

  type StoredForName<DocumentType extends Document.Type> =
    | (DocumentType extends "ActiveEffect" ? ActiveEffect.Stored : never)
    | (DocumentType extends "ActorDelta" ? ActorDelta.Stored : never)
    | (DocumentType extends "Actor" ? Actor.Stored : never)
    | (DocumentType extends "Adventure" ? Adventure.Stored : never)
    | (DocumentType extends "Card" ? Card.Stored : never)
    | (DocumentType extends "Cards" ? Cards.Stored : never)
    | (DocumentType extends "ChatMessage" ? ChatMessage.Stored : never)
    | (DocumentType extends "Combat" ? Combat.Stored : never)
    | (DocumentType extends "Combatant" ? Combatant.Stored : never)
    | (DocumentType extends "CombatantGroup" ? CombatantGroup.Stored : never)
    | (DocumentType extends "FogExploration" ? FogExploration.Stored : never)
    | (DocumentType extends "Folder" ? Folder.Stored : never)
    | (DocumentType extends "Item" ? Item.Stored : never)
    | (DocumentType extends "JournalEntryCategory" ? JournalEntryCategory.Stored : never)
    | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.Stored : never)
    | (DocumentType extends "JournalEntry" ? JournalEntry.Stored : never)
    | (DocumentType extends "Macro" ? Macro.Stored : never)
    | (DocumentType extends "PlaylistSound" ? PlaylistSound.Stored : never)
    | (DocumentType extends "Playlist" ? Playlist.Stored : never)
    | (DocumentType extends "RegionBehavior" ? RegionBehavior.Stored : never)
    | (DocumentType extends "RollTable" ? RollTable.Stored : never)
    | (DocumentType extends "Scene" ? Scene.Stored : never)
    | (DocumentType extends "Setting" ? Setting.Stored : never)
    | (DocumentType extends "TableResult" ? TableResult.Stored : never)
    | (DocumentType extends "User" ? User.Stored : never)
    | (DocumentType extends "AmbientLight" ? AmbientLightDocument.Stored : never)
    | (DocumentType extends "AmbientSound" ? AmbientSoundDocument.Stored : never)
    | (DocumentType extends "Drawing" ? DrawingDocument.Stored : never)
    | (DocumentType extends "MeasuredTemplate" ? MeasuredTemplateDocument.Stored : never)
    | (DocumentType extends "Note" ? NoteDocument.Stored : never)
    | (DocumentType extends "Region" ? NoteDocument.Stored : never)
    | (DocumentType extends "Tile" ? TileDocument.Stored : never)
    | (DocumentType extends "Token" ? TokenDocument.Stored : never)
    | (DocumentType extends "Wall" ? WallDocument.Stored : never);

  type InvalidForName<DocumentType extends Document.Type> =
    | (DocumentType extends "ActiveEffect" ? ActiveEffect.Invalid : never)
    | (DocumentType extends "ActorDelta" ? ActorDelta.Invalid : never)
    | (DocumentType extends "Actor" ? Actor.Invalid : never)
    | (DocumentType extends "Adventure" ? Adventure.Invalid : never)
    | (DocumentType extends "Card" ? Card.Invalid : never)
    | (DocumentType extends "Cards" ? Cards.Invalid : never)
    | (DocumentType extends "ChatMessage" ? ChatMessage.Invalid : never)
    | (DocumentType extends "Combat" ? Combat.Invalid : never)
    | (DocumentType extends "Combatant" ? Combatant.Invalid : never)
    | (DocumentType extends "CombatantGroup" ? CombatantGroup.Invalid : never)
    | (DocumentType extends "FogExploration" ? FogExploration.Invalid : never)
    | (DocumentType extends "Folder" ? Folder.Invalid : never)
    | (DocumentType extends "Item" ? Item.Invalid : never)
    | (DocumentType extends "JournalEntryCategory" ? JournalEntryCategory.Invalid : never)
    | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.Invalid : never)
    | (DocumentType extends "JournalEntry" ? JournalEntry.Invalid : never)
    | (DocumentType extends "Macro" ? Macro.Invalid : never)
    | (DocumentType extends "PlaylistSound" ? PlaylistSound.Invalid : never)
    | (DocumentType extends "Playlist" ? Playlist.Invalid : never)
    | (DocumentType extends "RegionBehavior" ? RegionBehavior.Invalid : never)
    | (DocumentType extends "RollTable" ? RollTable.Invalid : never)
    | (DocumentType extends "Scene" ? Scene.Invalid : never)
    | (DocumentType extends "Setting" ? Setting.Invalid : never)
    | (DocumentType extends "TableResult" ? TableResult.Invalid : never)
    | (DocumentType extends "User" ? User.Invalid : never)
    | (DocumentType extends "AmbientLight" ? AmbientLightDocument.Invalid : never)
    | (DocumentType extends "AmbientSound" ? AmbientSoundDocument.Invalid : never)
    | (DocumentType extends "Drawing" ? DrawingDocument.Invalid : never)
    | (DocumentType extends "MeasuredTemplate" ? MeasuredTemplateDocument.Invalid : never)
    | (DocumentType extends "Note" ? NoteDocument.Invalid : never)
    | (DocumentType extends "Region" ? NoteDocument.Invalid : never)
    | (DocumentType extends "Tile" ? TileDocument.Invalid : never)
    | (DocumentType extends "Token" ? TokenDocument.Invalid : never)
    | (DocumentType extends "Wall" ? WallDocument.Invalid : never);

  type NameFor<ConcreteDocument extends Document.Internal.Constructor> = ConcreteDocument["documentName"];

  type ImplementationFor<Name extends Type> = ConfiguredDocumentInstance[Name];
  type ImplementationClassFor<Name extends Type> = ConfiguredDocumentClass[Name];

  type ObjectClassFor<Name extends PlaceableType> = CONFIG[Name]["objectClass"];
  type ObjectFor<Name extends PlaceableType> = FixedInstanceType<CONFIG[Name]["objectClass"]>;

  type ConfiguredDataForName<Name extends Type> = GetKey<DataConfig, Name, EmptyObject>;

  type ConfiguredSourceForName<Name extends Type> = GetKey<SourceConfig, Name, EmptyObject>;

  type SchemaFor<ConcreteDocument extends Internal.Instance.Any> =
    ConcreteDocument extends Internal.Instance<infer _1, infer Schema, infer _2> ? Schema : never;

  type MetadataFor<Name extends Document.Type> = ConfiguredMetadata[Name];

  type CollectionRecord<Schema extends DataSchema> = {
    [Key in keyof Schema]: Schema[Key] extends EmbeddedCollectionField.Any
      ? NonNullable<Schema[Key][" __fvtt_types_internal_initialized_data"]>
      : never;
  };

  interface CoreFlags {
    core?: {
      sheetLock?: boolean;
      sheetClass?: string;
    };
  }

  /** @internal */
  interface _ParentContext<Parent extends Document.Any | null>
    extends _DynamicBase<
      Parent extends null
        ? {
            /**
             * The parent Document of this one, if this one is embedded
             * @defaultValue `null`
             */
            parent?: Parent | undefined;
          }
        : {
            /**
             * The parent Document of this one, if this one is embedded
             */
            parent: Parent;
          }
    > {}

  // @ts-expect-error This pattern is inherently an error.
  interface _DynamicBase<T extends object> extends T {}

  /** @internal */
  interface _ConstructionContext<Parent extends Document.Any | null>
    extends _ParentContext<Parent>,
      NullishProps<{
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
      }> {}

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

  interface Metadata<out ThisType extends Document.Any> {
    readonly name: ThisType["documentName"];
    readonly label: string;
    readonly coreTypes: readonly string[];
    readonly collection: string;
    readonly embedded: {
      [DocumentType in Document.Type]?: string;
    };
    readonly permissions: {
      view: string | ToMethod<(user: User.Internal.Implementation, doc: ThisType, data: AnyObject) => boolean>;
      create: string | ToMethod<(user: User.Internal.Implementation, doc: ThisType, data: AnyObject) => boolean>;
      update: string | ToMethod<(user: User.Internal.Implementation, doc: ThisType, data: AnyObject) => boolean>;
      delete: string | ToMethod<(user: User.Internal.Implementation, doc: ThisType, data: EmptyObject) => boolean>;
    };
    readonly hasTypeData?: boolean;
    readonly indexed: boolean;
    readonly compendiumIndexFields: readonly string[];
    readonly preserveOnImport: readonly string[];
    readonly schemaVersion?: string | undefined;
    readonly labelPlural?: string; // This is not set for the Document class but every class that implements Document actually provides it.
  }

  namespace Metadata {
    interface Any extends Metadata<any> {}

    interface Default {
      readonly name: "Document";
      readonly label: "DOCUMENT.Document";
      readonly coreTypes: [CONST.BASE_DOCUMENT_TYPE];
      readonly collection: "documents";
      readonly embedded: EmptyObject;
      readonly hasTypeData: false;
      readonly indexed: false;
      readonly compendiumIndexFields: [];
      readonly permissions: {
        view: "LIMITED";
        create: "ASSISTANT";
        update: "OWNER";
        delete: "ASSISTANT";
      };
      readonly preserveOnImport: ["_id", "sort", "ownership", "folder"];
    }

    interface Embedded extends Identity<{ [K in Document.Type]?: string }> {}
  }

  type SheetClassFor<Name extends Document.Type> = MakeConform<
    GetKey<GetKey<CONFIG, Name>, "sheetClass">,
    AnyConstructor
  >;

  type LayerClassFor<Name extends Document.Type> = GetKey<GetKey<CONFIG, Name>, "layerClass">;

  namespace Database {
    type Operation = "create" | "update" | "delete";

    /**
     * @privateRemarks Foundry types {@link Document.get | `Document.get`} as taking a {@link DatabaseGetOperation | `DatabaseGetOperation`}
     * but it only ever looks for `pack`
     */
    interface GetOptions extends Pick<DatabaseGetOperation, "pack"> {}

    /** Used for {@linkcode Document.createDocuments} */
    type CreateOperation<Op extends DatabaseCreateOperation> = NullishProps<Omit<Op, "data" | "modifiedTime">>;

    /** Used for {@linkcode Document.update} */
    type UpdateOperation<Op extends DatabaseUpdateOperation> = InexactPartial<Omit<Op, "updates">>;

    /** Used for {@linkcode Document.delete} */
    type DeleteOperation<Op extends DatabaseDeleteOperation> = InexactPartial<Omit<Op, "ids">>;

    /** Used for {@linkcode Document._preCreateOperation} */
    type PreCreateOperationStatic<Op extends DatabaseCreateOperation> = InexactPartialExcept<
      Op,
      "modifiedTime" | "render" | "renderSheet" | "data" | "noHook" | "pack" | "parent"
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

    /** Used for {@linkcode Document.updateDocuments} */
    type UpdateDocumentsOperation<Op extends DatabaseUpdateOperation> = NullishProps<
      Omit<Op, "updates" | "modifiedTime">
    >;

    /** Used for {@link Document.update | `Document#update`} */
    type UpdateOperationInstance<Op extends DatabaseUpdateOperation> = InexactPartial<
      Omit<Op, "updates" | "parent" | "pack">
    >;

    /** Used for {@linkcode Document._preUpdateOperation} */
    type PreUpdateOperationStatic<Op extends DatabaseUpdateOperation> = InexactPartialExcept<
      Op,
      "modifiedTime" | "diff" | "recursive" | "render" | "updates" | "restoreDelta" | "noHook" | "pack" | "parent"
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

    /** Used for {@linkcode Document.deleteDocuments} */
    type DeleteDocumentsOperation<Op extends DatabaseDeleteOperation> = NullishProps<Omit<Op, "ids" | "modifiedTime">>;

    /** Used for {@linkcode Document.delete} */
    type DeleteOperationInstance<Op extends DatabaseDeleteOperation> = InexactPartial<
      Omit<Op, "ids" | "parent" | "pack">
    >;

    /** Used for {@linkcode Document._preDeleteOperation} */
    type PreDeleteOperationStatic<Op extends DatabaseDeleteOperation> = InexactPartialExcept<
      Op,
      "modifiedTime" | "render" | "ids" | "deleteAll" | "noHook" | "pack" | "parent"
    >;

    /** Used for {@link Document._preDelete | `Document#_preDelete`} */
    type PreDeleteOperationInstance<Op extends DatabaseDeleteOperation> = Omit<
      InexactPartialExcept<Op, "modifiedTime" | "render">,
      "ids" | "deleteAll" | "noHook" | "pack" | "parent"
    >;

    /** Used for {@link Document._onDelete | `Document#_onDelete`} */
    type DeleteOptions<Op extends DatabaseDeleteOperation> = Omit<
      Op,
      "ids" | "deleteAll" | "pack" | "parentUuid" | "syntheticActorUpdate"
    >;

    type CreateForName<DocumentType extends Document.Type> =
      | (DocumentType extends "ActiveEffect" ? ActiveEffect.Database.Create : never)
      | (DocumentType extends "ActorDelta" ? ActorDelta.Database.Create : never)
      | (DocumentType extends "Actor" ? Actor.Database.Create : never)
      | (DocumentType extends "Adventure" ? Adventure.Database.Create : never)
      | (DocumentType extends "Card" ? Card.Database.Create : never)
      | (DocumentType extends "Cards" ? Cards.Database.Create : never)
      | (DocumentType extends "ChatMessage" ? ChatMessage.Database.Create : never)
      | (DocumentType extends "Combat" ? Combat.Database.Create : never)
      | (DocumentType extends "Combatant" ? Combatant.Database.Create : never)
      | (DocumentType extends "CombatantGroup" ? CombatantGroup.Database.Create : never)
      | (DocumentType extends "FogExploration" ? FogExploration.Database.Create : never)
      | (DocumentType extends "Folder" ? Folder.Database.Create : never)
      | (DocumentType extends "Item" ? Item.Database.Create : never)
      | (DocumentType extends "JournalEntryCategory" ? JournalEntryCategory.Database.Create : never)
      | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.Database.Create : never)
      | (DocumentType extends "JournalEntry" ? JournalEntry.Database.Create : never)
      | (DocumentType extends "Macro" ? Macro.Database.Create : never)
      | (DocumentType extends "PlaylistSound" ? PlaylistSound.Database.Create : never)
      | (DocumentType extends "Playlist" ? Playlist.Database.Create : never)
      | (DocumentType extends "RegionBehavior" ? RegionBehavior.Database.Create : never)
      | (DocumentType extends "RollTable" ? RollTable.Database.Create : never)
      | (DocumentType extends "Scene" ? Scene.Database.Create : never)
      | (DocumentType extends "Setting" ? Setting.Database.Create : never)
      | (DocumentType extends "TableResult" ? TableResult.Database.Create : never)
      | (DocumentType extends "User" ? User.Database.Create : never)
      | (DocumentType extends "AmbientLight" ? AmbientLightDocument.Database.Create : never)
      | (DocumentType extends "AmbientSound" ? AmbientSoundDocument.Database.Create : never)
      | (DocumentType extends "Drawing" ? DrawingDocument.Database.Create : never)
      | (DocumentType extends "MeasuredTemplate" ? MeasuredTemplateDocument.Database.Create : never)
      | (DocumentType extends "Note" ? NoteDocument.Database.Create : never)
      | (DocumentType extends "Region" ? RegionDocument.Database.Create : never)
      | (DocumentType extends "Tile" ? TileDocument.Database.Create : never)
      | (DocumentType extends "Token" ? TokenDocument.Database.Create : never)
      | (DocumentType extends "Wall" ? WallDocument.Database.Create : never);

    type CreateOperationForName<
      DocumentType extends Document.Type,
      Temporary extends boolean | undefined = boolean | undefined,
    > =
      | (DocumentType extends "ActiveEffect" ? ActiveEffect.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "ActorDelta" ? ActorDelta.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Actor" ? Actor.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Adventure" ? Adventure.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Card" ? Card.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Cards" ? Cards.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "ChatMessage" ? ChatMessage.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Combat" ? Combat.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Combatant" ? Combatant.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "CombatantGroup" ? CombatantGroup.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "FogExploration" ? FogExploration.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Folder" ? Folder.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Item" ? Item.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "JournalEntryCategory" ? JournalEntryCategory.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "JournalEntry" ? JournalEntry.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Macro" ? Macro.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "PlaylistSound" ? PlaylistSound.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Playlist" ? Playlist.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "RegionBehavior" ? RegionBehavior.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "RollTable" ? RollTable.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Scene" ? Scene.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Setting" ? Setting.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "TableResult" ? TableResult.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "User" ? User.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "AmbientLight" ? AmbientLightDocument.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "AmbientSound" ? AmbientSoundDocument.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Drawing" ? DrawingDocument.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "MeasuredTemplate" ? MeasuredTemplateDocument.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Note" ? NoteDocument.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Region" ? RegionDocument.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Tile" ? TileDocument.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Token" ? TokenDocument.Database.CreateOperation<Temporary> : never)
      | (DocumentType extends "Wall" ? WallDocument.Database.CreateOperation<Temporary> : never);

    type UpdateOperationForName<DocumentType extends Document.Type> =
      | (DocumentType extends "ActiveEffect" ? ActiveEffect.Database.UpdateOperation : never)
      | (DocumentType extends "ActorDelta" ? ActorDelta.Database.UpdateOperation : never)
      | (DocumentType extends "Actor" ? Actor.Database.UpdateOperation : never)
      | (DocumentType extends "Adventure" ? Adventure.Database.UpdateOperation : never)
      | (DocumentType extends "Card" ? Card.Database.UpdateOperation : never)
      | (DocumentType extends "Cards" ? Cards.Database.UpdateOperation : never)
      | (DocumentType extends "ChatMessage" ? ChatMessage.Database.UpdateOperation : never)
      | (DocumentType extends "Combat" ? Combat.Database.UpdateOperation : never)
      | (DocumentType extends "Combatant" ? Combatant.Database.UpdateOperation : never)
      | (DocumentType extends "CombatantGroup" ? CombatantGroup.Database.UpdateOperation : never)
      | (DocumentType extends "FogExploration" ? FogExploration.Database.UpdateOperation : never)
      | (DocumentType extends "Folder" ? Folder.Database.UpdateOperation : never)
      | (DocumentType extends "Item" ? Item.Database.UpdateOperation : never)
      | (DocumentType extends "JournalEntryCategory" ? JournalEntryCategory.Database.UpdateOperation : never)
      | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.Database.UpdateOperation : never)
      | (DocumentType extends "JournalEntry" ? JournalEntry.Database.UpdateOperation : never)
      | (DocumentType extends "Macro" ? Macro.Database.UpdateOperation : never)
      | (DocumentType extends "PlaylistSound" ? PlaylistSound.Database.UpdateOperation : never)
      | (DocumentType extends "Playlist" ? Playlist.Database.UpdateOperation : never)
      | (DocumentType extends "RegionBehavior" ? RegionBehavior.Database.UpdateOperation : never)
      | (DocumentType extends "RollTable" ? RollTable.Database.UpdateOperation : never)
      | (DocumentType extends "Scene" ? Scene.Database.UpdateOperation : never)
      | (DocumentType extends "Setting" ? Setting.Database.UpdateOperation : never)
      | (DocumentType extends "TableResult" ? TableResult.Database.UpdateOperation : never)
      | (DocumentType extends "User" ? User.Database.UpdateOperation : never)
      | (DocumentType extends "AmbientLight" ? AmbientLightDocument.Database.UpdateOperation : never)
      | (DocumentType extends "AmbientSound" ? AmbientSoundDocument.Database.UpdateOperation : never)
      | (DocumentType extends "Drawing" ? DrawingDocument.Database.UpdateOperation : never)
      | (DocumentType extends "MeasuredTemplate" ? MeasuredTemplateDocument.Database.UpdateOperation : never)
      | (DocumentType extends "Note" ? NoteDocument.Database.UpdateOperation : never)
      | (DocumentType extends "Region" ? RegionDocument.Database.UpdateOperation : never)
      | (DocumentType extends "Tile" ? TileDocument.Database.UpdateOperation : never)
      | (DocumentType extends "Token" ? TokenDocument.Database.UpdateOperation : never)
      | (DocumentType extends "Wall" ? WallDocument.Database.UpdateOperation : never);

    type DeleteOperationForName<DocumentType extends Document.Type> =
      | (DocumentType extends "ActiveEffect" ? ActiveEffect.Database.DeleteOperation : never)
      | (DocumentType extends "ActorDelta" ? ActorDelta.Database.DeleteOperation : never)
      | (DocumentType extends "Actor" ? Actor.Database.DeleteOperation : never)
      | (DocumentType extends "Adventure" ? Adventure.Database.DeleteOperation : never)
      | (DocumentType extends "Card" ? Card.Database.DeleteOperation : never)
      | (DocumentType extends "Cards" ? Cards.Database.DeleteOperation : never)
      | (DocumentType extends "ChatMessage" ? ChatMessage.Database.DeleteOperation : never)
      | (DocumentType extends "Combat" ? Combat.Database.DeleteOperation : never)
      | (DocumentType extends "Combatant" ? Combatant.Database.DeleteOperation : never)
      | (DocumentType extends "CombatantGround" ? CombatantGroup.Database.DeleteOperation : never)
      | (DocumentType extends "FogExploration" ? FogExploration.Database.DeleteOperation : never)
      | (DocumentType extends "Folder" ? Folder.Database.DeleteOperation : never)
      | (DocumentType extends "Item" ? Item.Database.DeleteOperation : never)
      | (DocumentType extends "JournalEntryCategory" ? JournalEntryCategory.Database.DeleteOperation : never)
      | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.Database.DeleteOperation : never)
      | (DocumentType extends "JournalEntry" ? JournalEntry.Database.DeleteOperation : never)
      | (DocumentType extends "Macro" ? Macro.Database.DeleteOperation : never)
      | (DocumentType extends "PlaylistSound" ? PlaylistSound.Database.DeleteOperation : never)
      | (DocumentType extends "Playlist" ? Playlist.Database.DeleteOperation : never)
      | (DocumentType extends "RegionBehavior" ? RegionBehavior.Database.DeleteOperation : never)
      | (DocumentType extends "RollTable" ? RollTable.Database.DeleteOperation : never)
      | (DocumentType extends "Scene" ? Scene.Database.DeleteOperation : never)
      | (DocumentType extends "Setting" ? Setting.Database.DeleteOperation : never)
      | (DocumentType extends "TableResult" ? TableResult.Database.DeleteOperation : never)
      | (DocumentType extends "User" ? User.Database.DeleteOperation : never)
      | (DocumentType extends "AmbientLight" ? AmbientLightDocument.Database.DeleteOperation : never)
      | (DocumentType extends "AmbientSound" ? AmbientSoundDocument.Database.DeleteOperation : never)
      | (DocumentType extends "Drawing" ? DrawingDocument.Database.DeleteOperation : never)
      | (DocumentType extends "MeasuredTemplate" ? MeasuredTemplateDocument.Database.DeleteOperation : never)
      | (DocumentType extends "Note" ? NoteDocument.Database.DeleteOperation : never)
      | (DocumentType extends "Region" ? RegionDocument.Database.DeleteOperation : never)
      | (DocumentType extends "Tile" ? TileDocument.Database.DeleteOperation : never)
      | (DocumentType extends "Token" ? TokenDocument.Database.DeleteOperation : never)
      | (DocumentType extends "Wall" ? WallDocument.Database.DeleteOperation : never);

    type CreateOptionsFor<DocumentType extends Document.Type> =
      | (DocumentType extends "ActiveEffect" ? ActiveEffect.Database.CreateOptions : never)
      | (DocumentType extends "ActorDelta" ? ActorDelta.Database.CreateOptions : never)
      | (DocumentType extends "Actor" ? Actor.Database.CreateOptions : never)
      | (DocumentType extends "Adventure" ? Adventure.Database.CreateOptions : never)
      | (DocumentType extends "Card" ? Card.Database.CreateOptions : never)
      | (DocumentType extends "Cards" ? Cards.Database.CreateOptions : never)
      | (DocumentType extends "ChatMessage" ? ChatMessage.Database.CreateOptions : never)
      | (DocumentType extends "Combat" ? Combat.Database.CreateOptions : never)
      | (DocumentType extends "Combatant" ? Combatant.Database.CreateOptions : never)
      | (DocumentType extends "CombatantGroup" ? CombatantGroup.Database.CreateOptions : never)
      | (DocumentType extends "FogExploration" ? FogExploration.Database.CreateOptions : never)
      | (DocumentType extends "Folder" ? Folder.Database.CreateOptions : never)
      | (DocumentType extends "Item" ? Item.Database.CreateOptions : never)
      | (DocumentType extends "JournalEntryCategory" ? JournalEntryCategory.Database.CreateOptions : never)
      | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.Database.CreateOptions : never)
      | (DocumentType extends "JournalEntry" ? JournalEntry.Database.CreateOptions : never)
      | (DocumentType extends "Macro" ? Macro.Database.CreateOptions : never)
      | (DocumentType extends "PlaylistSound" ? PlaylistSound.Database.CreateOptions : never)
      | (DocumentType extends "Playlist" ? Playlist.Database.CreateOptions : never)
      | (DocumentType extends "RegionBehavior" ? RegionBehavior.Database.CreateOptions : never)
      | (DocumentType extends "RollTable" ? RollTable.Database.CreateOptions : never)
      | (DocumentType extends "Scene" ? Scene.Database.CreateOptions : never)
      | (DocumentType extends "Setting" ? Setting.Database.CreateOptions : never)
      | (DocumentType extends "TableResult" ? TableResult.Database.CreateOptions : never)
      | (DocumentType extends "User" ? User.Database.CreateOptions : never)
      | (DocumentType extends "AmbientLight" ? AmbientLightDocument.Database.CreateOptions : never)
      | (DocumentType extends "AmbientSound" ? AmbientSoundDocument.Database.CreateOptions : never)
      | (DocumentType extends "Drawing" ? DrawingDocument.Database.CreateOptions : never)
      | (DocumentType extends "MeasuredTemplate" ? MeasuredTemplateDocument.Database.CreateOptions : never)
      | (DocumentType extends "Note" ? NoteDocument.Database.CreateOptions : never)
      | (DocumentType extends "Region" ? RegionDocument.Database.CreateOptions : never)
      | (DocumentType extends "Tile" ? TileDocument.Database.CreateOptions : never)
      | (DocumentType extends "Token" ? TokenDocument.Database.CreateOptions : never)
      | (DocumentType extends "Wall" ? WallDocument.Database.CreateOptions : never);

    type UpdateOptionsFor<DocumentType extends Document.Type> =
      | (DocumentType extends "ActiveEffect" ? ActiveEffect.Database.UpdateOptions : never)
      | (DocumentType extends "ActorDelta" ? ActorDelta.Database.UpdateOptions : never)
      | (DocumentType extends "Actor" ? Actor.Database.UpdateOptions : never)
      | (DocumentType extends "Adventure" ? Adventure.Database.UpdateOptions : never)
      | (DocumentType extends "Card" ? Card.Database.UpdateOptions : never)
      | (DocumentType extends "Cards" ? Cards.Database.UpdateOptions : never)
      | (DocumentType extends "ChatMessage" ? ChatMessage.Database.UpdateOptions : never)
      | (DocumentType extends "Combat" ? Combat.Database.UpdateOptions : never)
      | (DocumentType extends "Combatant" ? Combatant.Database.UpdateOptions : never)
      | (DocumentType extends "CombatantGroup" ? CombatantGroup.Database.UpdateOptions : never)
      | (DocumentType extends "FogExploration" ? FogExploration.Database.UpdateOptions : never)
      | (DocumentType extends "Folder" ? Folder.Database.UpdateOptions : never)
      | (DocumentType extends "Item" ? Item.Database.UpdateOptions : never)
      | (DocumentType extends "JournalEntryCategory" ? JournalEntryCategory.Database.UpdateOptions : never)
      | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.Database.UpdateOptions : never)
      | (DocumentType extends "JournalEntry" ? JournalEntry.Database.UpdateOptions : never)
      | (DocumentType extends "Macro" ? Macro.Database.UpdateOptions : never)
      | (DocumentType extends "PlaylistSound" ? PlaylistSound.Database.UpdateOptions : never)
      | (DocumentType extends "Playlist" ? Playlist.Database.UpdateOptions : never)
      | (DocumentType extends "RegionBehavior" ? RegionBehavior.Database.UpdateOptions : never)
      | (DocumentType extends "RollTable" ? RollTable.Database.UpdateOptions : never)
      | (DocumentType extends "Scene" ? Scene.Database.UpdateOptions : never)
      | (DocumentType extends "Setting" ? Setting.Database.UpdateOptions : never)
      | (DocumentType extends "TableResult" ? TableResult.Database.UpdateOptions : never)
      | (DocumentType extends "User" ? User.Database.UpdateOptions : never)
      | (DocumentType extends "AmbientLight" ? AmbientLightDocument.Database.UpdateOptions : never)
      | (DocumentType extends "AmbientSound" ? AmbientSoundDocument.Database.UpdateOptions : never)
      | (DocumentType extends "Drawing" ? DrawingDocument.Database.UpdateOptions : never)
      | (DocumentType extends "MeasuredTemplate" ? MeasuredTemplateDocument.Database.UpdateOptions : never)
      | (DocumentType extends "Note" ? NoteDocument.Database.UpdateOptions : never)
      | (DocumentType extends "Region" ? RegionDocument.Database.UpdateOptions : never)
      | (DocumentType extends "Tile" ? TileDocument.Database.UpdateOptions : never)
      | (DocumentType extends "Token" ? TokenDocument.Database.UpdateOptions : never)
      | (DocumentType extends "Wall" ? WallDocument.Database.UpdateOptions : never);

    type DeleteOptionsFor<DocumentType extends Document.Type> =
      | (DocumentType extends "ActiveEffect" ? ActiveEffect.Database.DeleteOptions : never)
      | (DocumentType extends "ActorDelta" ? ActorDelta.Database.DeleteOptions : never)
      | (DocumentType extends "Actor" ? Actor.Database.DeleteOptions : never)
      | (DocumentType extends "Adventure" ? Adventure.Database.DeleteOptions : never)
      | (DocumentType extends "Card" ? Card.Database.DeleteOptions : never)
      | (DocumentType extends "Cards" ? Cards.Database.DeleteOptions : never)
      | (DocumentType extends "ChatMessage" ? ChatMessage.Database.DeleteOptions : never)
      | (DocumentType extends "Combat" ? Combat.Database.DeleteOptions : never)
      | (DocumentType extends "Combatant" ? Combatant.Database.DeleteOptions : never)
      | (DocumentType extends "CombatantGroup" ? CombatantGroup.Database.DeleteOptions : never)
      | (DocumentType extends "FogExploration" ? FogExploration.Database.DeleteOptions : never)
      | (DocumentType extends "Folder" ? Folder.Database.DeleteOptions : never)
      | (DocumentType extends "Item" ? Item.Database.DeleteOptions : never)
      | (DocumentType extends "JournalEntryCategory" ? JournalEntryCategory.Database.DeleteOptions : never)
      | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.Database.DeleteOptions : never)
      | (DocumentType extends "JournalEntry" ? JournalEntry.Database.DeleteOptions : never)
      | (DocumentType extends "Macro" ? Macro.Database.DeleteOptions : never)
      | (DocumentType extends "PlaylistSound" ? PlaylistSound.Database.DeleteOptions : never)
      | (DocumentType extends "Playlist" ? Playlist.Database.DeleteOptions : never)
      | (DocumentType extends "RegionBehavior" ? RegionBehavior.Database.DeleteOptions : never)
      | (DocumentType extends "RollTable" ? RollTable.Database.DeleteOptions : never)
      | (DocumentType extends "Scene" ? Scene.Database.DeleteOptions : never)
      | (DocumentType extends "Setting" ? Setting.Database.DeleteOptions : never)
      | (DocumentType extends "TableResult" ? TableResult.Database.DeleteOptions : never)
      | (DocumentType extends "User" ? User.Database.DeleteOptions : never)
      | (DocumentType extends "AmbientLight" ? AmbientLightDocument.Database.DeleteOptions : never)
      | (DocumentType extends "AmbientSound" ? AmbientSoundDocument.Database.DeleteOptions : never)
      | (DocumentType extends "Drawing" ? DrawingDocument.Database.DeleteOptions : never)
      | (DocumentType extends "MeasuredTemplate" ? MeasuredTemplateDocument.Database.DeleteOptions : never)
      | (DocumentType extends "Note" ? NoteDocument.Database.DeleteOptions : never)
      | (DocumentType extends "Region" ? RegionDocument.Database.DeleteOptions : never)
      | (DocumentType extends "Tile" ? TileDocument.Database.DeleteOptions : never)
      | (DocumentType extends "Token" ? TokenDocument.Database.DeleteOptions : never)
      | (DocumentType extends "Wall" ? WallDocument.Database.DeleteOptions : never);

    type PreCreateOptionsFor<DocumentType extends Document.Type> =
      | (DocumentType extends "ActiveEffect" ? ActiveEffect.Database.PreCreateOptions : never)
      | (DocumentType extends "ActorDelta" ? ActorDelta.Database.PreCreateOptions : never)
      | (DocumentType extends "Actor" ? Actor.Database.PreCreateOptions : never)
      | (DocumentType extends "Adventure" ? Adventure.Database.PreCreateOptions : never)
      | (DocumentType extends "Card" ? Card.Database.PreCreateOptions : never)
      | (DocumentType extends "Cards" ? Cards.Database.PreCreateOptions : never)
      | (DocumentType extends "ChatMessage" ? ChatMessage.Database.PreCreateOptions : never)
      | (DocumentType extends "Combat" ? Combat.Database.PreCreateOptions : never)
      | (DocumentType extends "Combatant" ? Combatant.Database.PreCreateOptions : never)
      | (DocumentType extends "CombatantGroup" ? CombatantGroup.Database.PreCreateOptions : never)
      | (DocumentType extends "FogExploration" ? FogExploration.Database.PreCreateOptions : never)
      | (DocumentType extends "Folder" ? Folder.Database.PreCreateOptions : never)
      | (DocumentType extends "Item" ? Item.Database.PreCreateOptions : never)
      | (DocumentType extends "JournalEntryCategory" ? JournalEntryCategory.Database.PreCreateOptions : never)
      | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.Database.PreCreateOptions : never)
      | (DocumentType extends "JournalEntry" ? JournalEntry.Database.PreCreateOptions : never)
      | (DocumentType extends "Macro" ? Macro.Database.PreCreateOptions : never)
      | (DocumentType extends "PlaylistSound" ? PlaylistSound.Database.PreCreateOptions : never)
      | (DocumentType extends "Playlist" ? Playlist.Database.PreCreateOptions : never)
      | (DocumentType extends "RegionBehavior" ? RegionBehavior.Database.PreCreateOptions : never)
      | (DocumentType extends "RollTable" ? RollTable.Database.PreCreateOptions : never)
      | (DocumentType extends "Scene" ? Scene.Database.PreCreateOptions : never)
      | (DocumentType extends "Setting" ? Setting.Database.PreCreateOptions : never)
      | (DocumentType extends "TableResult" ? TableResult.Database.PreCreateOptions : never)
      | (DocumentType extends "User" ? User.Database.PreCreateOptions : never)
      | (DocumentType extends "AmbientLight" ? AmbientLightDocument.Database.PreCreateOptions : never)
      | (DocumentType extends "AmbientSound" ? AmbientSoundDocument.Database.PreCreateOptions : never)
      | (DocumentType extends "Drawing" ? DrawingDocument.Database.PreCreateOptions : never)
      | (DocumentType extends "MeasuredTemplate" ? MeasuredTemplateDocument.Database.PreCreateOptions : never)
      | (DocumentType extends "Note" ? NoteDocument.Database.PreCreateOptions : never)
      | (DocumentType extends "Region" ? RegionDocument.Database.PreCreateOptions : never)
      | (DocumentType extends "Tile" ? TileDocument.Database.PreCreateOptions : never)
      | (DocumentType extends "Token" ? TokenDocument.Database.PreCreateOptions : never)
      | (DocumentType extends "Wall" ? WallDocument.Database.PreCreateOptions : never);

    type PreUpdateOptionsFor<DocumentType extends Document.Type> =
      | (DocumentType extends "ActiveEffect" ? ActiveEffect.Database.PreUpdateOptions : never)
      | (DocumentType extends "ActorDelta" ? ActorDelta.Database.PreUpdateOptions : never)
      | (DocumentType extends "Actor" ? Actor.Database.PreUpdateOptions : never)
      | (DocumentType extends "Adventure" ? Adventure.Database.PreUpdateOptions : never)
      | (DocumentType extends "Card" ? Card.Database.PreUpdateOptions : never)
      | (DocumentType extends "Cards" ? Cards.Database.PreUpdateOptions : never)
      | (DocumentType extends "ChatMessage" ? ChatMessage.Database.PreUpdateOptions : never)
      | (DocumentType extends "Combat" ? Combat.Database.PreUpdateOptions : never)
      | (DocumentType extends "Combatant" ? Combatant.Database.PreUpdateOptions : never)
      | (DocumentType extends "CombatantGroup" ? CombatantGroup.Database.PreUpdateOptions : never)
      | (DocumentType extends "FogExploration" ? FogExploration.Database.PreUpdateOptions : never)
      | (DocumentType extends "Folder" ? Folder.Database.PreUpdateOptions : never)
      | (DocumentType extends "Item" ? Item.Database.PreUpdateOptions : never)
      | (DocumentType extends "JournalEntryCategory" ? JournalEntryCategory.Database.PreUpdateOptions : never)
      | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.Database.PreUpdateOptions : never)
      | (DocumentType extends "JournalEntry" ? JournalEntry.Database.PreUpdateOptions : never)
      | (DocumentType extends "Macro" ? Macro.Database.PreUpdateOptions : never)
      | (DocumentType extends "PlaylistSound" ? PlaylistSound.Database.PreUpdateOptions : never)
      | (DocumentType extends "Playlist" ? Playlist.Database.PreUpdateOptions : never)
      | (DocumentType extends "RegionBehavior" ? RegionBehavior.Database.PreUpdateOptions : never)
      | (DocumentType extends "RollTable" ? RollTable.Database.PreUpdateOptions : never)
      | (DocumentType extends "Scene" ? Scene.Database.PreUpdateOptions : never)
      | (DocumentType extends "Setting" ? Setting.Database.PreUpdateOptions : never)
      | (DocumentType extends "TableResult" ? TableResult.Database.PreUpdateOptions : never)
      | (DocumentType extends "User" ? User.Database.PreUpdateOptions : never)
      | (DocumentType extends "AmbientLight" ? AmbientLightDocument.Database.PreUpdateOptions : never)
      | (DocumentType extends "AmbientSound" ? AmbientSoundDocument.Database.PreUpdateOptions : never)
      | (DocumentType extends "Drawing" ? DrawingDocument.Database.PreUpdateOptions : never)
      | (DocumentType extends "MeasuredTemplate" ? MeasuredTemplateDocument.Database.PreUpdateOptions : never)
      | (DocumentType extends "Note" ? NoteDocument.Database.PreUpdateOptions : never)
      | (DocumentType extends "Region" ? RegionDocument.Database.PreUpdateOptions : never)
      | (DocumentType extends "Tile" ? TileDocument.Database.PreUpdateOptions : never)
      | (DocumentType extends "Token" ? TokenDocument.Database.PreUpdateOptions : never)
      | (DocumentType extends "Wall" ? WallDocument.Database.PreUpdateOptions : never);

    type PreDeleteOptionsFor<DocumentType extends Document.Type> =
      | (DocumentType extends "ActiveEffect" ? ActiveEffect.Database.PreDeleteOptions : never)
      | (DocumentType extends "ActorDelta" ? ActorDelta.Database.PreDeleteOptions : never)
      | (DocumentType extends "Actor" ? Actor.Database.PreDeleteOptions : never)
      | (DocumentType extends "Adventure" ? Adventure.Database.PreDeleteOptions : never)
      | (DocumentType extends "Card" ? Card.Database.PreDeleteOptions : never)
      | (DocumentType extends "Cards" ? Cards.Database.PreDeleteOptions : never)
      | (DocumentType extends "ChatMessage" ? ChatMessage.Database.PreDeleteOptions : never)
      | (DocumentType extends "Combat" ? Combat.Database.PreDeleteOptions : never)
      | (DocumentType extends "Combatant" ? Combatant.Database.PreDeleteOptions : never)
      | (DocumentType extends "CombatantGroup" ? CombatantGroup.Database.PreDeleteOptions : never)
      | (DocumentType extends "FogExploration" ? FogExploration.Database.PreDeleteOptions : never)
      | (DocumentType extends "Folder" ? Folder.Database.PreDeleteOptions : never)
      | (DocumentType extends "Item" ? Item.Database.PreDeleteOptions : never)
      | (DocumentType extends "JournalEntryCategory" ? JournalEntryCategory.Database.PreDeleteOptions : never)
      | (DocumentType extends "JournalEntryPage" ? JournalEntryPage.Database.PreDeleteOptions : never)
      | (DocumentType extends "JournalEntry" ? JournalEntry.Database.PreDeleteOptions : never)
      | (DocumentType extends "Macro" ? Macro.Database.PreDeleteOptions : never)
      | (DocumentType extends "PlaylistSound" ? PlaylistSound.Database.PreDeleteOptions : never)
      | (DocumentType extends "Playlist" ? Playlist.Database.PreDeleteOptions : never)
      | (DocumentType extends "RegionBehavior" ? RegionBehavior.Database.PreDeleteOptions : never)
      | (DocumentType extends "RollTable" ? RollTable.Database.PreDeleteOptions : never)
      | (DocumentType extends "Scene" ? Scene.Database.PreDeleteOptions : never)
      | (DocumentType extends "Setting" ? Setting.Database.PreDeleteOptions : never)
      | (DocumentType extends "TableResult" ? TableResult.Database.PreDeleteOptions : never)
      | (DocumentType extends "User" ? User.Database.PreDeleteOptions : never)
      | (DocumentType extends "AmbientLight" ? AmbientLightDocument.Database.PreDeleteOptions : never)
      | (DocumentType extends "AmbientSound" ? AmbientSoundDocument.Database.PreDeleteOptions : never)
      | (DocumentType extends "Drawing" ? DrawingDocument.Database.PreDeleteOptions : never)
      | (DocumentType extends "MeasuredTemplate" ? MeasuredTemplateDocument.Database.PreDeleteOptions : never)
      | (DocumentType extends "Note" ? NoteDocument.Database.PreDeleteOptions : never)
      | (DocumentType extends "Region" ? RegionDocument.Database.PreDeleteOptions : never)
      | (DocumentType extends "Tile" ? TileDocument.Database.PreDeleteOptions : never)
      | (DocumentType extends "Token" ? TokenDocument.Database.PreDeleteOptions : never)
      | (DocumentType extends "Wall" ? WallDocument.Database.PreDeleteOptions : never);
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

  /**
   * If a `parent` is required for a given Document's creation, its template must pass `NonNullable<X.Parent>` to `CreateDialogContext`
   *
   * @internal
   */
  type ParentContext<Parent extends Document.Any | null> = Parent extends null
    ? {
        /** A parent document within which the created Document should belong */
        parent?: Parent | undefined;
      }
    : {
        /** A parent document within which the created Document should belong */
        parent: Parent;
      };

  /** @internal */
  type _PossibleSubtypeContext<DocumentName extends Document.Type> =
    GetKey<Document.MetadataFor<DocumentName>, "hasTypeData"> extends true
      ? NullishProps<{
          /**
           * The sub-type of the document
           * @remarks Pulls from `CONFIG[documentName].typeLabels?.[type]` if provided. Ignored if falsey.
           */
          type: Document.SubTypesOf<DocumentName>;
        }>
      : {
          /** @deprecated This Document type does not support subtypes */
          type?: never;
        };

  type DefaultNameContext<DocumentName extends Document.Type, Parent extends Document.Any | null> = InexactPartial<{
    /**
     * A compendium pack within which the Document should be created
     * @remarks Only used to generate the list of existing names to check against when incrementing the index for the `(number)` suffix.
     * Ignored if falsey, or if `parent` is provided and truthy.
     */
    pack: string | null;

    /**
     * A parent document within which the created Document should belong
     * @remarks Only used to generate the list of existing names to check against when incrementing the index for the `(number)` suffix.
     * Ignored if falsey.
     */
    parent: Parent | null;
  }> &
    _PossibleSubtypeContext<DocumentName>;

  // TODO(LukeAbby): Inline into each document.
  type CreateDialogData<CreateData extends object> = InexactPartial<{
    [K in keyof CreateData as Extract<K, "name" | "type" | "folder">]: CreateData[K];
  }> &
    Omit<CreateData, "name" | "type" | "folder">;

  /** @internal */
  type _PossibleSubtypesContext<DocumentName extends Document.Type> =
    GetKey<Document.MetadataFor<DocumentName>, "hasTypeData"> extends true
      ? {
          /** @deprecated This Document type does not support subtypes */
          types?: never;
        }
      : NullishProps<{
          /**
           * A restriction the selectable sub-types of the Dialog.
           * @remarks Only checked if the document has `static TYPES` of length \> 1 (i.e it both `hasTypeData` and has
           * at least one non-`"base"` type registered). The computed list will always exclude {@link CONST.BASE_DOCUMENT_TYPE | `CONST.BASE_DOCUMENT_TYPE`},
           * so it is disallowed in this whitelist.
           */
          types: Exclude<Document.SubTypesOf<DocumentName>, "base">[];
        }>;

  /** @deprecated in favor of {@linkcode CreateDialogOptions} */
  type CreateDialogContext<
    DocumentName extends Document.Type,
    Parent extends Document.Any | null,
  > = InexactPartial<foundry.appv1.api.Dialog.Options> &
    NullishProps<{
      /**
       * A compendium pack within which the Document should be created
       * @remarks Only checked if `parent` is falsey, and only used to generate the list of folders for the dialog
       */
      pack: string;
    }> &
    _PossibleSubtypesContext<DocumentName> &
    ParentContext<Parent>;

  type CreateDialogOptions<DocumentName extends Document.Type> =
    InexactPartial<foundry.applications.api.DialogV2.PromptConfig> &
      NullishProps<{
        /**
         * A template to use for the dialog contents instead of the default.
         */
        template: string;

        /**
         * Additional render context to provide to the template.
         */
        context: AnyObject;
      }> &
      _PossibleSubtypesContext<DocumentName>;

  interface FromImportContext<Parent extends Document.Any | null> extends Omit<ConstructionContext<Parent>, "strict"> {
    /**
     * Strict validation is enabled by default.
     * @defaultValue `true`
     * @remarks Not allowed to be `undefined` as that would produce `false`, not the expected default of `true`, due to being spread
     * into an object with `strict: true`, then passed to {@link Document.fromSource | `Document.fromSource`}, where the parameter
     * default is `false`
     */
    strict?: boolean | null;
  }

  type ActionPermission = keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS;

  /** @internal */
  type _TestUserPermissionsOptions = NullishProps<{
    /**
     * Require the exact permission level requested?
     * @defaultValue `false`
     */
    exact: boolean;
  }>;

  interface TestUserPermissionOptions extends _TestUserPermissionsOptions {}

  type CanUserModifyData<Schema extends DataSchema, Action extends "create" | "update" | "delete"> =
    | (Action extends "create" ? SchemaField.CreateData<Schema> : never)
    | (Action extends "update" ? SchemaField.UpdateData<Schema> : never)
    | (Action extends "delete" ? EmptyObject : never);

  /**
   * @internal
   */
  type _GetEmbeddedDocumentOptions = InexactPartial<{
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

  type PreCreateDescendantDocumentsArgs<
    Parent extends Document.AnyStored,
    DirectDescendant extends Document.Any,
    Embedded extends Document.Metadata.Embedded,
  > = DirectDescendant extends unknown
    ? [
        parent: Parent,
        collection: Embedded[DirectDescendant["documentName"]],
        data: Document.CreateDataForName<DirectDescendant["documentName"]>[],
        options: Document.Database.CreateOptionsFor<DirectDescendant["documentName"]>,
        userId: string,
      ]
    : never;

  type OnCreateDescendantDocumentsArgs<
    Parent extends Document.AnyStored,
    DirectDescendant extends Document.Any,
    Embedded extends Document.Metadata.Embedded,
  > = DirectDescendant extends unknown
    ? [
        parent: Parent,
        collection: Embedded[DirectDescendant["documentName"]],
        documents: DirectDescendant[],
        data: Document.CreateDataForName<DirectDescendant["documentName"]>[],
        options: Document.Database.CreateOptionsFor<DirectDescendant["documentName"]>,
        userId: string,
      ]
    : never;

  type PreUpdateDescendantDocumentsArgs<
    Parent extends Document.AnyStored,
    DirectDescendant extends Document.Any,
    Embedded extends Document.Metadata.Embedded,
  > = DirectDescendant extends unknown
    ? [
        parent: Parent,
        collection: Embedded[DirectDescendant["documentName"]],
        changes: Document.UpdateDataForName<DirectDescendant["documentName"]>[],
        options: Document.Database.UpdateOptionsFor<DirectDescendant["documentName"]>,
        userId: string,
      ]
    : never;

  type OnUpdateDescendantDocumentsArgs<
    Parent extends Document.AnyStored,
    DirectDescendant extends Document.Any,
    Embedded extends Document.Metadata.Embedded,
  > = DirectDescendant extends unknown
    ? [
        parent: Parent,
        collection: Embedded[DirectDescendant["documentName"]],
        documents: DirectDescendant[],
        changes: Document.UpdateDataForName<DirectDescendant["documentName"]>[],
        options: Document.Database.UpdateOptionsFor<DirectDescendant["documentName"]>,
        userId: string,
      ]
    : never;

  type PreDeleteDescendantDocumentsArgs<
    Parent extends Document.AnyStored,
    DirectDescendant extends Document.Any,
    Embedded extends Document.Metadata.Embedded,
  > = DirectDescendant extends unknown
    ? [
        parent: Parent,
        collection: Embedded[DirectDescendant["documentName"]],
        ids: string[],
        options: Document.Database.DeleteOptionsFor<DirectDescendant["documentName"]>,
        userId: string,
      ]
    : never;

  type OnDeleteDescendantDocumentsArgs<
    Parent extends Document.AnyStored,
    DirectDescendant extends Document.Any,
    Embedded extends Document.Metadata.Embedded,
  > = DirectDescendant extends unknown
    ? [
        parent: Parent,
        collection: Embedded[DirectDescendant["documentName"]],
        documents: DirectDescendant[],
        ids: string[],
        options: Document.Database.DeleteOptionsFor<DirectDescendant["documentName"]>,
        userId: string,
      ]
    : never;

  type Clone<This extends Document.Any, Save extends boolean | null | undefined> = Save extends true
    ? Promise<This>
    : This;

  /**
   * The options for `fromDropData`. Foundry never uses these so the interface is currently empty.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface DropDataOptions {}

  type DropDataFor<Name extends Document.Type> = {
    ActiveEffect: ActiveEffect.DropData;
    ActorDelta: ActorDelta.DropData;
    Actor: Actor.DropData;
    Adventure: Adventure.DropData;
    Card: Card.DropData;
    Cards: Cards.DropData;
    ChatMessage: ChatMessage.DropData;
    Combat: Combat.DropData;
    Combatant: Combatant.DropData;
    CombatantGroup: CombatantGroup.DropData;
    FogExploration: FogExploration.DropData;
    Folder: Folder.DropData;
    Item: Item.DropData;
    JournalEntryCategory: JournalEntryCategory.DropData;
    JournalEntryPage: JournalEntryPage.DropData;
    JournalEntry: JournalEntry.DropData;
    Macro: Macro.DropData;
    PlaylistSound: PlaylistSound.DropData;
    Playlist: Playlist.DropData;
    RegionBehavior: RegionBehavior.DropData;
    RollTable: RollTable.DropData;
    Scene: Scene.DropData;
    Setting: Setting.DropData;
    TableResult: TableResult.DropData;
    User: User.DropData;
    AmbientLight: AmbientLightDocument.DropData;
    AmbientSound: AmbientSoundDocument.DropData;
    Drawing: DrawingDocument.DropData;
    MeasuredTemplate: MeasuredTemplateDocument.DropData;
    Note: NoteDocument.DropData;
    Region: RegionDocument.DropData;
    Tile: TileDocument.DropData;
    Token: TokenDocument.DropData;
    Wall: WallDocument.DropData;
  }[Name];

  /**
   * @deprecated This type should not be used directly. Use `StoredForName` as this type does not account for anything declaration merged into `Stored`.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ToConfiguredStored<D extends Document.AnyConstructor> = Stored<ToConfiguredInstance<D>>;

  /**
   * @deprecated This type should not be used directly. Use `StoredForName` as this type does not account for anything declaration merged into `Stored`.
   */
  type Stored<D extends Document.Any> = Document.Internal.Stored<D>;

  /**
   * @deprecated This type should not be used directly. Use `InvalidForName` as this type does not account for anything declaration merged into `Invalid`.
   */
  type Invalid<D extends Document.Any> = Document.Internal.Invalid<D>;

  /**
   * @deprecated This type should not be used directly. Use `StoredForName` as this type does not account for anything declaration merged into `Stored`.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ToStored<D extends Document.AnyConstructor> = Stored<FixedInstanceType<D>>;

  /**
   * @deprecated This type should not be used directly. Use `StoredForName` as this type does not account for anything declaration merged into `Stored`.
   */
  type ToStoredIf<D extends Document.AnyConstructor, Temporary extends boolean | undefined> = Temporary extends true
    ? FixedInstanceType<D>
    : // eslint-disable-next-line @typescript-eslint/no-deprecated
      ToConfiguredStored<D>;

  /** @deprecated This type currently does not have a replacement as it was deemed too niche. If you have a use case for it let us know. */
  type Temporary<D extends Document.Any> = D extends Internal.Stored<infer U> ? U : D;

  /**
   * @deprecated Replaced with {@linkcode Document.SheetClassFor}
   */
  export import ConfiguredSheetClassFor = Document.SheetClassFor;

  /**
   * @deprecated Replaced with {@linkcode Document.ObjectClassFor}
   */
  export import ConfiguredObjectClassFor = Document.ObjectClassFor;

  /**
   * @deprecated Replaced with {@linkcode Document.LayerClassFor}
   */
  export import ConfiguredLayerClassFor = Document.LayerClassFor;

  /**
   * Returns the type of the constructor data for the given {@linkcode foundry.abstract.Document}.
   * @deprecated Replaced with {@linkcode CreateDataForName}
   */
  type CreateDataFor<T extends Document.Internal.Constructor> = SchemaField.CreateData<
    T extends { defineSchema: () => infer R extends DataSchema } ? R : never
  >;

  /**
   * @deprecated Replaced with {@linkcode UpdateDataForName}
   */
  type UpdateDataFor<T extends Document.Internal.Constructor> = SchemaField.UpdateData<
    T extends { defineSchema: () => infer R extends DataSchema } ? R : never
  >;

  /**
   * @deprecated Use `[Document].DropData` instead.
   */
  type DropData<T extends Document.Any> = T extends { id: string | undefined }
    ? // eslint-disable-next-line @typescript-eslint/no-deprecated
      DropData.Data<T> & DropData.UUID
    : // eslint-disable-next-line @typescript-eslint/no-deprecated
      DropData.Data<T>;

  namespace DropData {
    /**
     * @deprecated This type is likely too broad to be useful. Deprecated without replacement.
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type Any = DropData<any>;

    /**
     * @deprecated This type is a part of the drop data which is now gotten through
     * `[Document].DropData`. Use that instead.
     */
    interface Data<T extends Document.Any> {
      type: T["documentName"];
      data: T["_source"];
    }

    /**
     * @deprecated This type is a part of the drop data which is now gotten through
     * `[Document].DropData`. Use that instead.
     */
    interface UUID {
      uuid: string;
    }
  }

  /**
   * @deprecated This type has been deprecated because of the inconsistent casing of "Subtype" instead of "SubType". Use {@linkcode Document.ModuleSubType} instead.
   */
  type ModuleSubtype = ModuleSubType;

  /**
   * @deprecated This type was used to simplify the logic behind `ConstructorArgs` but that's now being deprecated.
   */
  type ConstructorParameters<CreateData extends object | undefined, Parent extends Document.Any | null> = [
    data?: CreateData,
    context?: Document.ConstructionContext<Parent>,
  ];

  /**
   * @deprecated This type has been moved to be internal. If you have a need for this type please
   * let us know.
   */
  type ConfiguredFlagsForName<Name extends Type> = Internal.ConfiguredFlagsForName<Name>;

  /**
   * @deprecated This type is no longer used and will be removed.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type Flags<ConcreteDocument extends Internal.Instance.Any> = OptionsForSchema<SchemaFor<ConcreteDocument>>;

  /**
   * @internal
   * @deprecated This type is no longer used and will be removed.
   */
  interface OptionsInFlags<Options extends DataField.Options.Any> {
    readonly flags?: DataField<Options, any>;
  }

  // These types only exists to simplify solving the `Document` type. Using `Document.Flags<this>` means the constraint `this extends Document.Any` has to be proved.
  // This is much more complex than proving the constraint for `Document.FlagsInternal<Schema>` that `Schema extends DataSchema`.

  /**
   * @deprecated This type is being made internal.
   */
  type OptionsForSchema<Schema extends DataSchema> =
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    RemoveIndexSignatures<Schema> extends OptionsInFlags<infer Options> ? DataField.InitializedType<Options> : never;

  /**
   * @deprecated `FlagKeyOf` is being made internal. If you need this for some reason please let
   * us know.
   */
  type FlagKeyOf<T> = Internal.FlagKeyOf<T>;

  /**
   * @deprecated `FlagGetKey` is being made internal. If you need this for some reason please let
   * us know.
   */
  type FlagGetKey<T, K extends PropertyKey> = Internal.FlagGetKey<T, K>;

  /**
   * @deprecated `GetFlag` has been moved to be internal. Use `[Document].Flag.Get` instead.
   * If you need this for some reason please let us know.
   */
  type GetFlag<Name extends Document.Type, S extends string, K extends string> = Internal.GetFlag<
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    Extract<Document.ConfiguredFlagsForName<Name>, object>,
    S,
    K
  >;

  /**
   * @deprecated Use the `TemporaryIf` available on each sub-document.
   */
  type TemporaryIf<D extends Document.Any, Temporary extends boolean | undefined> = Temporary extends true
    ? D
    : // eslint-disable-next-line @typescript-eslint/no-deprecated
      Stored<D>;

  /**
   * @deprecated This has been removed without replacement. If you have a need for it please let us know.
   */
  type ConfiguredCollectionClass<Name extends Document.Type> = Document.Internal.ConfiguredCollectionClass<Name>;

  /**
   * @deprecated This has been removed without replacement. If you have a need for it please let us know.
   */
  type ConfiguredCollection<Name extends Document.Type> = Document.Internal.ConfiguredCollection<Name>;
}
