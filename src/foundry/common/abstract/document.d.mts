import type {
  ConfiguredDocumentClass,
  ConfiguredDocumentInstance,
  ConfiguredMetadata,
} from "../../../types/documentConfiguration.d.mts";
import type {
  AllKeysOf,
  AnyMutableObject,
  AnyObject,
  Brand,
  Coalesce,
  ConcreteKeys,
  EmptyObject,
  FixedInstanceType,
  GetKey,
  Identity,
  InexactPartial,
  IntentionalPartial,
  InterfaceToObject,
  MakeConform,
  MaybeArray,
  MaybePromise,
  NullishProps,
  Override,
  PickValue,
  PrettifyType,
  RemoveIndexSignatures,
  SimpleMerge,
  ToMethod,
} from "#utils";
import type {
  DataField,
  DataSchema,
  DocumentStatsField,
  EmbeddedCollectionField,
  EmbeddedDocumentField,
  SchemaField,
  TypeDataField,
} from "../data/fields.d.mts";
import type { FormSelectOption } from "#client/applications/forms/fields.d.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.mts";
import type { DocumentSocketRequest } from "./_types.d.mts";
import type {
  DataModel,
  DatabaseBackend,
  DocumentSocketResponse,
  EmbeddedCollection,
} from "#common/abstract/_module.d.mts";
import type { ApplicationV2, DialogV2 } from "#client/applications/api/_module.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";
import type { ClientDocumentMixin, WorldCollection } from "#client/documents/abstract/_module.d.mts";
import type { SystemConfig } from "#configuration";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type DocumentCollection from "#client/documents/abstract/document-collection.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type ClientDatabaseBackend from "#client/data/client-backend.d.mts";

export default Document;

type InexactPartialExcept<T extends object, RequiredKey> = {
  [K in keyof T as Extract<K, RequiredKey>]: T[K];
} & {
  [K in keyof T as Exclude<K, RequiredKey>]?: T[K] | undefined;
};

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

// Note(LukeAbby): Patterns of the form `interface Example<T> extends T {}` don't count as using `T`.
// From tsc's point of view when calculating variance it may as well look like `interface Example<T> {}`.
// Fundamentally this ordinarily means `Example<T>` will always be assignable to `Example<U>` and
// vice versa.
//
// Obviously this is a problem, so `Uses` exists to add an unobtrusive covariant usage of the type
// parameter, making `Example<T>` assignable to `Example<U>` only if `T` is a subtype of `U`.
declare class Uses<T> {
  #t?: T;
}

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

  protected override _configure(options?: Document.ConfigureOptions): void;

  /**
   * An immutable reverse-reference to the name of the collection that this Document exists in on its parent, if any.
   * @defaultValue {@linkcode Document._getParentCollection | this._getParentCollection(parentCollection)}
   *
   * @remarks Defined via `Object.defineProperty` in {@linkcode Document._configure | #_configure} with `writable: false`.
   *
   * Always `null` in temporary documents, except {@linkcode foundry.documents.BaseActorDelta.parentCollection | ActorDelta}s.
   *
   * @privateRemarks This could realistically be any string passed as
   * {@linkcode Document.ConstructionContext.parentCollection | parentCollection} in the construction context of a `new Document()`. It's
   * typed as-is because everywhere it is specified by core, it happens to match the `metadata.collection` of the given document type, and
   * users are not realistically going to pass it, since they can't define new `EmbeddedCollectionField`s or `EmbeddedDocumentField`s.
   */
  readonly parentCollection: Document.MetadataFor<DocumentName>["collection"] | null;

  /**
   * An immutable reference to a containing Compendium collection to which this Document belongs.
   * @remarks Defined via `Object.defineProperty` in {@linkcode Document._configure | #_configure} with `writable: false`
   */
  get pack(): Document.Pack<DocumentName>;

  /**
   * A mapping of embedded Document collections which exist in this model.
   * @remarks Defined via `Object.defineProperty` in {@linkcode Document._configure | #_configure} with `writable: false`, and the value is
   * {@linkcode Object.seal}ed.
   */
  readonly collections: Document.CollectionRecord<Schema>;

  /**
   * Ensure that all Document classes share the same schema of their base declaration.
   */
  static override get schema(): SchemaField.Any;

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
   * @remarks This is `false` in {@linkcode Document.metadata}, and is only `true` in subclasses that override it so, as of 13.351
   */
  static get hasTypeData(): boolean;

  /**
   * The Embedded Document hierarchy for this Document.
   * @remarks This is a getter until first access, at which point it calculates the value, and replaces itself via
   * `Object.defineProperty(this, "hierarchy", { value: Object.freeze(hierarchy), writable: false });`
   */
  static readonly hierarchy: Readonly<Record<string, EmbeddedCollectionField.Any | EmbeddedDocumentField.Any>>;

  /**
   * Identify the collection in a parent Document that this Document exists belongs to, if any.
   * @param parentCollection - An explicitly provided parent collection name.
   * @remarks If passed a value for `parentCollection`, simply returns that value.
   * @internal
   */
  _getParentCollection(parentCollection?: string | null): string | null;

  // TODO: is this fake property necessary?
  _id: string | null;

  /**
   * The canonical identifier for this Document
   */
  get id(): string | null;

  /**
   * A reference to the Compendium Collection containing this Document, if any, and otherwise null.
   * @remarks The body in `Document` simply throws; All documents just use the override defined at
   * {@linkcode ClientDocumentMixin.AnyMixed.compendium | ClientDocument#compendium} out of the box.
   */
  abstract get compendium(): unknown;

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
   * @remarks Always `null` for temporary documents, always `string` for persisted,  though embedded
   * documents in non-persisted parents may have incorrect values at runtime.
   */
  get uuid(): string | null;

  /**
   * Test whether a given User has sufficient permissions to create Documents of this type in general. This does not
   * guarantee that the User is able to create all Documents of this type, as certain document-specific requirements
   * may also be present.
   *
   * Generally speaking, this method is used to verify whether a User should be presented with the option to create
   * Documents of this type in the UI.
   * @param user - The User being tested
   * @returns Does the User have a sufficient role to create?
   *
   * @privateRemarks Temporary `User`s' {@linkcode User.hasRole | #hasRole} and {@linkcode User.hasPermission | #hasPermission} methods work
   * without error, so `Implementation` over `Stored`.
   *
   * This method has been added to the document template to remove the exposure of `User.Internal.Implementation`.
   */
  static canUserCreate(user: User.Internal.Implementation): boolean;

  /**
   * Get the explicit permission level that a User has over this Document, a value in {@linkcode CONST.DOCUMENT_OWNERSHIP_LEVELS}.
   * Compendium content ignores the ownership field in favor of User role-based ownership. Otherwise, Documents use
   * granular per-User ownership definitions and Embedded Documents defer to their parent ownership.
   *
   * This method returns the value recorded in Document ownership, regardless of the User's role, for example a
   * `GAMEMASTER` user might still return a result of `NONE` if they are not explicitly denoted as having a level.
   *
   * To test whether a user has a certain capability over the document, testUserPermission should be used.
   * @param user - The User being tested (default: `game.user`)
   * @returns A numeric permission level from `CONST.DOCUMENT_OWNERSHIP_LEVELS`
   *
   * @privateRemarks Temporary `User`s' {@linkcode User.hasRole | #hasRole} methods work without error, so `Implementation` over `Stored`.
   *
   * This method has been added to the document template to remove the exposure of `User.Internal.Implementation`.
   */
  getUserLevel(user?: User.Internal.Implementation): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  /**
   * Test whether a certain User has a requested permission level (or greater) over the Document
   * @param user       - The User being tested
   * @param permission - The permission level from {@linkcode CONST.DOCUMENT_OWNERSHIP_LEVELS} to test
   * @param options    - Additional options involved in the permission test
   * @returns Does the user have this permission level over the Document?
   *
   * @privateRemarks Temporary `User`s still have {@linkcode User.role | role}s, so `Implementation` over `Stored`.
   *
   * This method has been added to the document template to remove the exposure of `User.Internal.Implementation`.
   */
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
   * @privateRemarks Temporary `User`s {@linkcode User.hasRole | #hasRole} and {@linkcode User.hasPermission | #hasPermission} methods work
   * without error, so `Implementation` over `Stored`.
   *
   * This method has been added to the document template to remove the exposure of `User.Internal.Implementation`.
   */
  canUserModify<Action extends Document.Database.OperationAction>(
    user: User.Internal.Implementation,
    action: Action,
    data?: Document.CanUserModifyData<DocumentName, Action>,
  ): boolean;

  /**
   * Clone a document, creating a new document by combining current data with provided overrides.
   * The cloned document is ephemeral and not yet saved to the database.
   * @param data    - Additional data which overrides current document data at the time of creation
   * @param context - Additional context options passed to the create method
   * @returns The cloned Document instance
   */
  override clone<Save extends boolean | undefined = undefined>(
    data?: SchemaField.UpdateData<Schema>,
    context?: Document.CloneContext<Save>,
  ): Document.Clone<this, Save>;

  /**
   * For Documents which include game system data, migrate the system data object to conform to its latest data model.
   * The data model is defined by the template.json specification included by the game system.
   * @returns The migrated system data object
   * @remarks
   * @throws If this document type either doesn't have subtypes or it does but the one on this document is a `DataModel`
   */
  migrateSystemData(): object;

  /** @remarks `Document#toObject` calls `this.constructor.shimData()` on the data before returning */
  override toObject(source?: boolean): SchemaField.SourceData<Schema>;

  /**
   * Create multiple Documents using provided input data.
   * Data is provided as an array of objects where each individual object becomes one new Document.
   *
   * @param data      - An array of data objects or existing Documents to persist. (default: `[]`)
   * @param operation - Parameters of the requested creation operation (default: `{}`)
   * @returns An array of created Document instances
   *
   * @example
   * Create a single Document
   * ```js
   * const data = [{name: "New Actor", type: "character", img: "path/to/profile.jpg"}];
   * const created = await Actor.implementation.createDocuments(data);
   * ```
   *
   * @example
   * Create multiple Documents
   * ```js
   * const data = [{name: "Tim", type: "npc"}, {name: "Tom", type: "npc"}];
   * const created = await Actor.implementation.createDocuments(data);
   * ```
   *
   * @example
   * Create multiple embedded Documents within a parent
   * ```js
   * const actor = game.actors.getName("Tim");
   * const data = [{name: "Sword", type: "weapon"}, {name: "Breastplate", type: "equipment"}];
   * const created = await Item.implementation.createDocuments(data, {parent: actor});
   * ```
   *
   * @example
   * Create a Document within a Compendium pack
   * ```js
   * const data = [{name: "Compendium Actor", type: "character", img: "path/to/profile.jpg"}];
   * const created = await Actor.implementation.createDocuments(data, {pack: "mymodule.mypack"});
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
   * @param updates   - An array of differential data objects, each used to update a single Document (default: `[]`)
   * @param operation - Parameters of the database update operation (default: `{}`)
   * @returns An array of updated Document instances
   *
   * @example
   * Update a single Document
   * ```js
   * const updates = [{_id: "12ekjf43kj2312ds", name: "Timothy"}];
   * const updated = await Actor.implementation.updateDocuments(updates);
   * ```
   *
   * @example
   * Update multiple Documents
   * ```js
   * const updates = [{_id: "12ekjf43kj2312ds", name: "Timothy"}, {_id: "kj549dk48k34jk34", name: "Thomas"}]};
   * const updated = await Actor.implementation.updateDocuments(updates);
   * ```
   *
   * @example
   * Update multiple embedded Documents within a parent
   * ```js
   * const actor = game.actors.getName("Timothy");
   * const updates = [{_id: sword.id, name: "Magic Sword"}, {_id: shield.id, name: "Magic Shield"}];
   * const updated = await Item.implementation.updateDocuments(updates, {parent: actor});
   * ```
   *
   * @example
   * Update Documents within a Compendium pack
   * ```js
   * const actor = await pack.getDocument(documentId);
   * const updated = await Actor.implementation.updateDocuments([{_id: actor.id, name: "New Name"}],
   *   {pack: "mymodule.mypack"});
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
   * @param ids       - An array of string ids for the documents to be deleted (default: `[]`)
   * @param operation - Parameters of the database deletion operation (default: `{}`)
   * @returns An array of deleted Document instances
   *
   * @example
   * Delete a single Document
   * ```js
   * const tim = game.actors.getName("Tim");
   * const deleted = await Actor.implementation.deleteDocuments([tim.id]);
   * ```
   *
   * @example
   * Delete multiple Documents
   * ```js
   * const tim = game.actors.getName("Tim");
   * const tom = game.actors.getName("Tom");
   * const deleted = await Actor.implementation.deleteDocuments([tim.id, tom.id]);
   * ```
   *
   * @example
   * Delete multiple embedded Documents within a parent
   * ```js
   * const tim = game.actors.getName("Tim");
   * const sword = tim.items.getName("Sword");
   * const shield = tim.items.getName("Shield");
   * const deleted = await Item.implementation.deleteDocuments([sword.id, shield.id], parent: actor});
   * ```
   *
   * @example
   * Delete Documents within a Compendium pack
   * ```js
   * const actor = await pack.getDocument(documentId);
   * const deleted = await Actor.implementation.deleteDocuments([actor.id], {pack: "mymodule.mypack"});
   * ```
   *
   * @remarks If a document is skipped by a hook or `_preDelete` then that element is skipped in the
   * return type. This means that you receive only documents that were actually deleted.
   *
   * `ids` is required because despite it having a parameter default, passing no IDs is a nonsense call on its own; however, specific
   * document overrides type `ids` as `| undefined` because the {@linkcode DatabaseBackend.DeleteOperation.deleteAll | deleteAll} operation
   * property exists, but using it requires passing *something* to the first parameter.
   */
  // Note: This uses `never` because it's unsound to try to call `Document.deleteDocument` rather than a specific document's method.
  static deleteDocuments(ids: never, operation?: never): Promise<Document.Any[]>;

  /**
   * Create a new Document using provided input data, saving it to the database.
   * @see {@linkcode Document.createDocuments}
   * @param data      - Initial data used to create this Document, or a Document instance to persist.
   * @param operation - Parameters of the creation operation (default: `{}`)
   * @returns The created Document instance
   *
   * @example
   * Create a World-level Item
   * ```js
   * const data = [{name: "Special Sword", type: "weapon"}];
   * const created = await Item.implementation.create(data);
   * ```
   *
   * @example
   * Create an Actor-owned Item
   * ```js
   * const data = [{name: "Special Sword", type: "weapon"}];
   * const actor = game.actors.getName("My Hero");
   * const created = await Item.implementation.create(data, {parent: actor});
   * ```
   *
   * @example
   * Create an Item in a Compendium pack
   * ```js
   * const data = [{name: "Special Sword", type: "weapon"}];
   * const created = await Item.implementation.create(data, {pack: "mymodule.mypack"});
   * ```
   *
   * @remarks If the document creation is skipped by a hook or `_preCreate` then `undefined` is returned.
   *
   * `data` can be a `CreateData` object, an instance of this specific Document, or a possibly-mixed array of those types.
   * If an array is passed, an array will be returned.
   */
  // Note: This uses `never` because it's unsound to try to call `Document.create` directly.
  static create(data: never, operation?: never): Promise<MaybeArray<Document.Any> | undefined>;

  /**
   * Update this Document using incremental data, saving it to the database.
   * @see {@linkcode Document.updateDocuments}
   * @param data      - Differential update data which modifies the existing values of this document data (default: `{}`)
   * @param operation - Parameters of the update operation (default: `{}`)
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
   * @param operation - Parameters of the deletion operation (default: `{}`)
   * @returns The deleted Document instance
   *
   * @remarks If the document deletion is skipped by a hook or `_preDelete` then `undefined` is
   * returned.
   */
  // Note: This uses `never` because it's unsound to try to call `Document#delete` directly.
  delete(operation?: never): Promise<this | undefined>;

  /**
   * Get a World-level Document of this type by its id.
   * @param documentId - The Document ID
   * @param operation  - Additional options which customize the request
   * @returns The retrieved Document, or null
   *
   * @remarks Contrary to the above, this *can* be used to 'get' compendium documents by passing `operation.pack`, but this will return the
   * index entry (or `null`) instead of the Document.
   *
   * {@linkcode FogExploration.get} can possibly forward args and return to/from {@linkcode FogExploration.load},
   * which accounts for the `Promise<>` part of the return; All other documents return `SomeDoc.Implementation | IndexEntry<DocName> | null`
   */
  // TODO: improve with a conditional return possibly: https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/3545
  static get(
    documentId: string,
    operation?: never,
  ): MaybePromise<Document.Any | CompendiumCollection.IndexEntry | null>;

  /**
   * A compatibility method that returns the appropriate name of an embedded collection within this Document.
   * @param name - An existing collection name or a document name.
   * @returns The provided collection name if it exists, the first available collection for the document name
   * provided, or null if no appropriate embedded collection could be found.
   *
   * @example
   * Passing an existing collection name.
   * ```js
   * Actor.implementation.getCollectionName("items");
   * // returns "items"
   * ```
   *
   * @example
   * Passing a document name.
   * ```js
   * Actor.implementation.getCollectionName("Item");
   * // returns "items"
   * ```
   */
  // Calling `Document.getCollectionName` always throws as the relevant `baseDocument` cannot be found.
  static getCollectionName(name: never): string | null;

  /**
   * Obtain a reference to the Array of source data within the data object for a certain embedded Document name
   * @param embeddedName - The name of the embedded Document type
   * @returns The Collection instance of embedded Documents of the requested type
   *
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
   *
   * @remarks `embeddedName` can also be the collection name, e.g to get an `Item` from an `Actor` instance, both `"Item"` and `"items"` are
   * valid.
   * @throws If the embedded collection does not exist, or if strict is true and the Embedded Document could not be found.
   */
  // Note: This uses `never` because it's unsound to try to call `Document#getEmbeddedDocument` directly.
  getEmbeddedDocument(
    embeddedName: never,
    id: string,
    options?: Document.GetEmbeddedDocumentOptions,
  ): Document.Any | undefined;

  /**
   * Create multiple embedded Document instances within this parent Document using provided input data.
   * @see {@linkcode Document.createDocuments}
   * @param embeddedName - The name of the embedded Document type
   * @param data         - An array of data objects used to create multiple documents (default: `[]`)
   * @param operation    - Parameters of the database creation workflow (default: `{}`)
   * @returns An array of created Document instances
   *
   * @remarks Unlike {@linkcode Document.getEmbeddedDocument | Document#getEmbeddedDocument}, `embeddedName` must be a document type;
   * collection names are not valid.
   *
   * As this is a create operation, `| undefined` is included in the specific document overrides' return type
   *
   * @privateRemarks `data` has a parameter default but passing no updates is nonsensical, so it's not marked optional here.
   *
   * `Temporary` is not handled here as making temporary embedded documents is nonsense, and it's going away in v14.
   */
  // Note: This uses `never` because it's unsound to try to call `Document#createEmbeddedDocuments` directly.
  // Note(LukeAbby): Returns `unknown` instead of `Promise<Array<Document.AnyStored> | undefined>` to stymy errors.
  createEmbeddedDocuments(embeddedName: never, data: never, operation?: never): unknown;

  /**
   * Update multiple embedded Document instances within a parent Document using provided differential data.
   * @see {@linkcode Document.updateDocuments}
   * @param embeddedName - The name of the embedded Document type
   * @param updates      - An array of differential data objects, each used to update a single Document (default: `[]`)
   * @param operation    - Parameters of the database update workflow (default: `{}`)
   * @returns An array of updated Document instances
   *
   * @remarks Unlike {@linkcode Document.getEmbeddedDocument | Document#getEmbeddedDocument}, `embeddedName` must be a document type;
   * collection names are not valid.
   *
   * @privateRemarks `updates` has a parameter default but passing no updates is nonsensical, so it's not marked optional here.
   */
  // Note: This uses `never` because it's unsound to try to call `Document#updateEmbeddedDocuments` directly.
  // Note(LukeAbby): Returns `unknown` instead of `Promise<Array<Document.AnyStored> | undefined>` to stymy errors.
  updateEmbeddedDocuments(embeddedName: never, updates: never, context?: never): unknown;

  /**
   * Delete multiple embedded Document instances within a parent Document using provided string ids.
   * @see {@linkcode Document.deleteDocuments}
   * @param embeddedName - The name of the embedded Document type
   * @param ids          - An array of string ids for each Document to be deleted
   * @param operation    - Parameters of the database deletion workflow (default: `{}`)
   * @returns An array of deleted Document instances
   *
   * @remarks Unlike {@linkcode Document.getEmbeddedDocument | Document#getEmbeddedDocument}, `embeddedName` must be a document type;
   * collection names are not valid.
   */
  // Note: This uses `never` because it's unsound to try to call `Document#deleteEmbeddedDocuments` directly.
  // Note(LukeAbby): Returns `unknown` instead of `Promise<Array<Document.AnyStored> | undefined>` to stymy errors.
  deleteEmbeddedDocuments(embeddedName: never, ids: Array<string>, operation?: never): unknown;

  /**
   * Iterate over all embedded Documents that are hierarchical children of this Document.
   * @param _parentPath - A parent field path already traversed
   * @remarks Not called within Foundry's client-side code, likely exists for server documents
   */
  // TODO: Put this into the document template with types that recurse Doc.Hierarchy for embedded documents
  // TODO: https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/3546
  traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.Any], void, undefined>;

  /**
   * Get the value of a "flag" for this document
   * See the {@linkcode Document.setFlag | #setFlag} method for more details on flags
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
   *
   * @remarks This method is a wrapper on {@linkcode Document.update | #update}, so it can return `undefined` if the update
   * is cancelled by {@linkcode Document._preUpdate | #_preUpdate} or the associated hook.
   */
  setFlag(scope: never, key: never, value: never): Promise<this | undefined>;

  /**
   * Remove a flag assigned to the document
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   * @returns The updated document instance
   *
   * @remarks This method is a wrapper on {@linkcode Document.delete | #delete}, so it can return `undefined` if the update
   * is cancelled by {@linkcode Document._preDelete | #_preDelete} or the associated hook.
   */
  unsetFlag(scope: never, key: never): Promise<this | undefined>;

  /**
   * Pre-process a creation operation for a single Document instance.
   * Pre-operation events only occur for the client which requested the operation.
   * Modifications to the pending Document instance must be performed using {@linkcode Document.updateSource | Document#updateSource}.
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
   * This batch-wise workflow occurs after individual {@linkcode Document._preCreate | Document#_preCreate} workflows and provides a final
   * pre-flight check before a database operation occurs.
   *
   * Modifications to pending documents must mutate the documents array or alter individual document instances using
   * {@linkcode Document.updateSource | Document#updateSource}.
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
   * This batch-wise workflow occurs after individual {@linkcode Document._onCreate | Document#_onCreate} workflows.
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
   * This batch-wise workflow occurs after individual {@linkcode Document._preUpdate | Document#_preUpdate} workflows and provides a final
   * pre-flight check before a database operation occurs.
   *
   * Modifications to the requested updates are performed by mutating the data array of the operation.
   * {@linkcode Document.updateSource | Document#updateSource}.
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
   * This batch-wise workflow occurs after individual {@linkcode Document._onUpdate | Document#_onUpdate} workflows.
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
   * This batch-wise workflow occurs after individual {@linkcode Document._preDelete | Document#_preDelete} workflows and provides a final
   * pre-flight check before a database operation occurs.
   *
   * Modifications to the requested deletions are performed by mutating the operation object.
   * {@linkcode Document.updateSource | Document#updateSource}.
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
   * This batch-wise workflow occurs after individual {@linkcode Document._onDelete | Document#_onDelete} workflows.
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
   * @param data    - The data object being shimmed
   * @param shims   - The mapping of old keys to new keys
   * @param options - Options passed to {@linkcode foundry.utils.logCompatibilityWarning}
   * @internal
   *
   * @remarks See {@linkcode Document._addDataFieldShim} remarks
   */
  protected static _addDataFieldShims(
    data: AnyMutableObject,
    shims: Record<string, string>,
    options?: Document.DataFieldShimOptions,
  ): void;

  /**
   * A reusable helper for adding a migration shim
   * The value of the data can be transformed during the migration by an optional application function.
   * @param data    - The data object being shimmed
   * @param oldKey  - The old field name
   * @param newKey  - The new field name
   * @param options - Options passed to {@linkcode foundry.utils.logCompatibilityWarning} (default: `{}`)
   * @internal
   *
   * @remarks This method calls {@linkcode Document._logDataFieldMigration | this._logDataFieldMigration}, but that is the only reference to
   * `this`, meaning if you're okay with nonsense being logged, it's valid to call for any data object, and if you provide your own
   * `_logDataFieldMigration`, doing `Document._addDataFieldShim.call(MyClass, ...)` can avoid even that.
   */
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
   * @returns Whether a migration was applied.
   * @internal
   *
   * @remarks This method has no references to `this` at all, and is not limited to operating on `Document` source data; it can be
   * used as a helper on any data object, making it one of the few static methods on `Document` it's valid to call on the base
   * class.
   */
  protected static _addDataFieldMigration<Data extends AnyMutableObject>(
    data: Data,
    oldKey: string,
    newKey: string,
    apply?: (data: Data) => unknown,
  ): boolean;

  /**
   * Log a compatibility warning for the data field migration.
   * @param oldKey  - The old field name
   * @param newKey  - The new field name
   * @param options - Options passed to {@linkcode foundry.utils.logCompatibilityWarning} (default: `{}`)
   * @internal
   */
  protected static _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

  /**
   * Clear the fields from the given Document data recursively.
   * @param data       - The (partial) Document data
   * @param fieldNames - The fields that are cleared
   * @param options    - (default: `{}`)
   * @internal
   */
  protected static _clearFieldsRecursively(
    data: AnyMutableObject,
    fieldNames: string[],
    options?: Document.ClearFieldsRecursivelyOptions,
  ): void;

  /**
   * @deprecated "The `Document._onCreateDocuments` static method is deprecated in favor of {@linkcode Document._onCreateOperation}"
   * (since v12, until v14)
   */
  // Note: This uses `never` because it's unsound to try to do `Document._onCreateDocuments` directly.
  protected static _onCreateDocuments(documents: never, context: never): Promise<void>;

  /**
   * @deprecated "The `Document._onUpdateDocuments` static method is deprecated in favor of {@linkcode Document._onUpdateOperation}"
   * (since v12, until v14)
   */
  // Note: This uses `never` because it's unsound to try to do `Document._onUpdateDocuments` directly.
  protected static _onUpdateDocuments(documents: never, context: never): Promise<unknown>;

  /**
   * @deprecated "The `Document._onDeleteDocuments` static method is deprecated in favor of {@linkcode Document._onDeleteOperation}"
   * (since v12, until v14)
   */
  // Note: This uses `never` because it's unsound to try to do `Document._onDeleteDocuments` directly.
  protected static _onDeleteDocuments(documents: never, context: never): Promise<unknown>;

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
  interface AnyStored extends Document.Internal.Stored<ClientDocumentMixin.AnyMixed> {}
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

  /**
   * Documents that require a parent for persisted creation. Most of them do not require
   * one for temporary construction; only `ActorDelta` does, as of 13.351.
   */
  type AlwaysEmbeddedType = Exclude<EmbeddedType, PrimaryType>;

  /** Documents which can only be persisted inside compendia. As of 13.351 this is only `Adventure`. */
  type AlwaysCompendiumType = "Adventure";

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

  /**
   * @privateRemarks This is hand-written here as a preemptive anti-circularity measure, it is checked against calculated values in tests.
   */
  // TODO: actually write said tests
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

    type ParentForName<Name extends Document.EmbeddedType> = Document.StoredForName<
      Document.Internal.DocumentNameFor<Exclude<Document.ParentForName<Name>, null>>
    >;
  }

  type WorldCollectionForName<Name extends Document.WorldType> = WorldCollection.ForName<Name>;

  type IsParentOf<
    ParentDocument extends Document.Internal.Instance.Any,
    ChildDocument extends Document.Internal.Instance.Any,
  > = ParentDocument extends Internal.ParentFor<ChildDocument> ? true : false;

  type SocketRequest<Action extends DatabaseBackend.DatabaseAction> = DocumentSocketRequest<Action>;
  type SocketResponse<Action extends DatabaseBackend.DatabaseAction> = DocumentSocketResponse<Action>;

  /**
   * Documents that can't be either directly in compendia, or embedded in documents that can be in compendia, should always return `false`
   * for {@linkcode Document.inCompendium | Document#inCompendium}. We can't force `true` for documents that can only be persisted in
   * compendia (e.g `Adventure`) here, because they could be temporary.
   */
  type InCompendium<Name extends Document.Type> = Name extends
    | CONST.COMPENDIUM_DOCUMENT_TYPES
    | CONST.EMBEDDED_DOCUMENT_TYPES
    | "Folder"
    ? boolean
    : false;

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

    /** Persisted, non-primary, embedded documents always have a non-`null` `parent` */
    type StoredParent<D extends Document.Any> = D["documentName"] extends Document.AlwaysEmbeddedType
      ? NonNullable<D["parent"]>
      : D["parent"];

    /** Persisted, non-primary, embedded documents always have a non-`null` `parent` */
    type StoredParentCollection<D extends Document.Any> = D["documentName"] extends Document.AlwaysEmbeddedType
      ? NonNullable<D["parentCollection"]>
      : D["parentCollection"];

    /** Persisted documents will always have a `collection`, whether it's a pack, a world collection, or another document. */
    type StoredCollection<D extends ClientDocumentMixin.AnyMixed> = Exclude<D["collection"], null>;

    /** Some documents can only be persisted in compendia. */
    type StoredInCompendium<D extends ClientDocumentMixin.AnyMixed> =
      D["documentName"] extends Document.AlwaysCompendiumType ? Exclude<D["inCompendium"], false> : D["inCompendium"];

    /** Some documents can only be persisted in compendia. */
    type StoredCompendium<D extends ClientDocumentMixin.AnyMixed> =
      D["documentName"] extends Document.AlwaysCompendiumType ? Exclude<D["compendium"], null> : D["compendium"];

    // TODO(LukeAbby): Improve the type display with a helper here.
    // TODO(LukeAbby): Add `StoredSource` for a better type display there.
    type Stored<D extends ClientDocumentMixin.AnyMixed> = Override<
      D,
      {
        /**
         * The canonical identifier for this Document
         * @remarks As this is a persisted Document, it is guaranteed to have an ID.
         */
        get id(): string;

        /** @remarks As this is a persisted Document, it is guaranteed to have an ID. */
        _id: string;

        /**
         * A Universally Unique Identifier (uuid) for this Document instance.
         * @remarks Always `null` for temporary documents, always `string` for persisted,  though embedded
         * documents in non-persisted parents may have incorrect values at runtime.
         */
        get uuid(): string;

        /** @remarks As this is a persisted Document, its source is guaranteed to have an ID. */
        _source: Override<D["_source"], { _id: string }>;

        /**
         * Extract the source data for the DataModel into a simple object format that can be serialized.
         * @returns The document source data expressed as a plain object
         */
        toJSON(): Override<D["_source"], { _id: string }>;

        /** @remarks As this is a persisted Document, it is guaranteed to have a non-`null` `parent`. */
        parent: Document.Internal.StoredParent<D>;

        /** @remarks As this is a persisted Document, it is guaranteed to have a non-`null` `parentCollection`. */
        parentCollection: Document.Internal.StoredParentCollection<D>;

        /** @remarks As this is a persisted Document, it is guaranteed to have a non-`null` `collection`. */
        collection: Document.Internal.StoredCollection<D>;

        /** Is this document in a compendium? */
        get inCompendium(): StoredInCompendium<D>;

        /** A reference to the Compendium Collection containing this Document, if any, and otherwise null. */
        get compendium(): StoredCompendium<D>;
      }
    >;

    type Invalid<D extends Document.Any> = D extends { system: unknown } ? _InvalidSystem<D> : _Invalid<D>;

    /** @internal */
    // @ts-expect-error This pattern is inherently an error.
    interface _InvalidSystem<D extends Document.Any> extends D, Uses<D> {
      // `Record<string, unknown>` is used to allow arbitrary property access since `in` checks are
      // a nuisance.
      _source: Record<string, unknown>;
      system: Record<string, unknown>;
      get invalid(): true;
    }

    /** @internal */
    // @ts-expect-error This pattern is inherently an error.
    interface _Invalid<D extends Document.Any> extends D, Uses<D> {
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
    // Unfortunately it's not easy to avoid because the typical `GetKey` trick has issues between `never`, not defined at all, and `unknown`
    // etc.
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
        readonly collection?: infer CollectionClass;
      };
    }
      ? CollectionClass
      : never;

    // Note(LukeAbby): Will be updated with the CONFIG revamp.
    type ConfiguredCollection<Name extends Document.Type> = FixedInstanceType<ConfiguredCollectionClass<Name>>;

    type PreCreateDescendantDocumentsArgs<
      Parent extends Document.AnyStored,
      DirectDescendantName extends Document.Type,
      Embedded extends Document.Metadata.Embedded,
    > = DirectDescendantName extends unknown
      ? [
          parent: Parent,
          collection: Embedded[DirectDescendantName],
          data: Document.CreateDataForName<DirectDescendantName>[],
          options: Document.Database.PreCreateOptionsForName<DirectDescendantName>,
          userId: string,
        ]
      : never;

    type OnCreateDescendantDocumentsArgs<
      Parent extends Document.AnyStored,
      DirectDescendantName extends Document.Type,
      Embedded extends Document.Metadata.Embedded,
    > = DirectDescendantName extends unknown
      ? [
          parent: Parent,
          collection: Embedded[DirectDescendantName],
          documents: Document.StoredForName<DirectDescendantName>[],
          data: Document.CreateDataForName<DirectDescendantName>[],
          options: Document.Database.OnCreateOptionsForName<DirectDescendantName>,
          userId: string,
        ]
      : never;

    type PreUpdateDescendantDocumentsArgs<
      Parent extends Document.AnyStored,
      DirectDescendantName extends Document.Type,
      Embedded extends Document.Metadata.Embedded,
    > = DirectDescendantName extends unknown
      ? [
          parent: Parent,
          collection: Embedded[DirectDescendantName],
          changes: Document.UpdateDataForName<DirectDescendantName>[],
          options: Document.Database.PreUpdateOptionsForName<DirectDescendantName>,
          userId: string,
        ]
      : never;

    type OnUpdateDescendantDocumentsArgs<
      Parent extends Document.AnyStored,
      DirectDescendantName extends Document.Type,
      Embedded extends Document.Metadata.Embedded,
    > = DirectDescendantName extends unknown
      ? [
          parent: Parent,
          collection: Embedded[DirectDescendantName],
          documents: Document.StoredForName<DirectDescendantName>[],
          changes: Document.UpdateDataForName<DirectDescendantName>[],
          options: Document.Database.OnUpdateOptionsForName<DirectDescendantName>,
          userId: string,
        ]
      : never;

    type PreDeleteDescendantDocumentsArgs<
      Parent extends Document.AnyStored,
      DirectDescendantName extends Document.Type,
      Embedded extends Document.Metadata.Embedded,
    > = DirectDescendantName extends unknown
      ? [
          parent: Parent,
          collection: Embedded[DirectDescendantName],
          ids: string[],
          options: Document.Database.PreDeleteOptionsForName<DirectDescendantName>,
          userId: string,
        ]
      : never;

    type OnDeleteDescendantDocumentsArgs<
      Parent extends Document.AnyStored,
      DirectDescendantName extends Document.Type,
      Embedded extends Document.Metadata.Embedded,
    > = DirectDescendantName extends unknown
      ? [
          parent: Parent,
          collection: Embedded[DirectDescendantName],
          documents: Document.StoredForName<DirectDescendantName>[],
          ids: string[],
          options: Document.Database.OnDeleteOptionsForName<DirectDescendantName>,
          userId: string,
        ]
      : never;
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
    | (DocumentType extends "Region" ? RegionDocument.UpdateData : never)
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
    | (DocumentType extends "Region" ? RegionDocument.Source : never)
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
    | (DocumentType extends "Region" ? RegionDocument.Parent : never)
    | (DocumentType extends "Tile" ? TileDocument.Parent : never)
    | (DocumentType extends "Token" ? TokenDocument.Parent : never)
    | (DocumentType extends "Wall" ? WallDocument.Parent : never);

  type SystemConstructor = AnyConstructor & {
    metadata: { name: SystemType };
  };

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
    | (DocumentType extends "Region" ? RegionDocument.Stored : never)
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
    | (DocumentType extends "Region" ? RegionDocument.Invalid : never)
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

  /**
   * This ensures that Documents that require a parent even for temporary construction
   * @internal
   */
  interface _ParentContext<Parent extends Document.Any | null> extends _DynamicBase<
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
  interface _DynamicBase<T extends object> extends T, Uses<T> {}

  /** @internal */
  interface _ConstructionContext<Parent extends Document.Any | null>
    extends
      _ParentContext<Parent>,
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
         * @privateRemarks Omitted from the typedef, inferred from usage in {@linkcode Document._configure | Document#_configure}
         * (and included in the construction context rather than `ConfigureOptions` due to being passed to construction in
         * {@linkcode EmbeddedCollection.createDocument | EmbeddedCollection#createDocument}). See
         * {@linkcode Document.parentCollection | Document#parentCollection}.
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
    extends Omit<DataModel._ConstructionContext, "strict">, _ConstructionContext<Parent> {}

  /**
   * `Document` has no constructor override, and `DataModel#constructor` pulls `parent` and `strict` out of the passed context before
   * forwarding to {@linkcode Document._configure | #_configure}
   */
  interface ConfigureOptions extends Omit<ConstructionContext, "parent" | "strict"> {}

  /**
   * The type for {@linkcode Document.pack | Document#pack}. Types that can never exist in compendia get `null`, everything else gets
   * `string | null`. We unfortunately can't exclude `null` for {@link AlwaysCompendiumType | documents only persisted in compendia}
   * because temporary documents exist.
   */
  type Pack<Name extends Document.Type> =
    | null
    | (CompendiumCollection.ForDocument<Name> extends never ? never : string);

  /**
   * `Document` has no constructor override, and `DataModel#constructor` pulls `parent` out of the passed context before forwarding to
   * {@linkcode Document._initializeSource | #_initializeSource}
   */
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

  // TODO: properly test passing save: true and not
  /** @internal */
  type _CloneContext<Save extends boolean | undefined> = InexactPartial<{
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
   * The context for {@linkcode Document.clone | Document#close}. Since we've lost the `ExtraConstructorOptions` type param from
   * {@linkcode DataModel}, we have to extend the construction context.
   *
   * If {@linkcode _CloneContext.save | save} is `true`, this gets passed to {@linkcode Document.create} as the operation.
   *
   * `parent`, `pack`, and `strict` are all overwritten with no respect to passed values, so they've been omitted from the extended types.
   * This allows the use of a generic {@linkcode DatabaseBackend.CreateOperation}, since any document-specific properties are irrelevant
   * (`data` doesn't go in a {@linkcode Document.Database.CreateDocumentsOperation | CreateDocumentsOperation}).
   *
   * @privateRemarks `temporary` is not being supported here; returning a temporary doc is the default behaviour of `clone()`, passing
   * `{ save: true, temporary: true }` is nonsensical.
   */
  // TODO: remove temporary from the omit in v14
  interface CloneContext<Save extends boolean | undefined = undefined>
    extends
      _CloneContext<Save>,
      Omit<Document.ConstructionContext, "parent" | "strict">,
      Omit<
        Document.Database.CreateDocumentsOperation<DatabaseBackend.CreateOperation>,
        "parent" | "pack" | "keepId" | "temporary"
      > {}

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
      view: string | ToMethod<(user: User.Internal.Implementation, doc: ThisType, data: object) => boolean>;
      create: string | ToMethod<(user: User.Internal.Implementation, doc: ThisType, data: object) => boolean>;
      update: string | ToMethod<(user: User.Internal.Implementation, doc: ThisType, data: object) => boolean>;
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
    /** Database action types which make a change in the database */
    type OperationAction = Exclude<DatabaseBackend.DatabaseAction, "get">;

    /**
     * The `(Pre|On)(Create|Update)Operation` interfaces all receive `data` or `update` params that have been `#toObject`ed. The `Extract`
     * branch only exists to handle the deprecated {@linkcode Document._onCreateDocuments} method, which receives the final client-side
     * mutated `operation` object, where `ClientDatabaseBackend##preCreateDocumentArray` has set `operation.data = documents`.
     * @internal
     */
    // TODO: remove Extract branch in v14 when `_onCreateDocuments` goes away
    type _RestrictToDataObjects<Operation extends object, Key extends keyof Operation, Excl extends boolean = true> =
      Operation[Key] extends Array<infer Data>
        ? Excl extends true
          ? Omit<Operation, Key> & { [_ in Key]: Array<Exclude<Data, Document.Any>> }
          : Omit<Operation, Key> & { [_ in Key]: Array<Extract<Data, Document.Any>> }
        : never;

    /* ***********************************************
     *            GET OPERATION HELPERS              *
     *************************************************/

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document.get}.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.GetOperation | GetOperation}, e.g
     * {@linkcode Macro.Database.GetOperation}.
     *
     * @remarks This type is identical to {@linkcode BackendGetOperation}. Core's implementation of `Document.get` only ever checks for, or
     * makes use of, {@linkcode DatabaseBackend.GetOperation.pack | pack}, but they type its `operation` parameter as a full `GetOperation`,
     * so that's what we allow.
     */
    type GetDocumentsOperation<BaseOperation extends DatabaseBackend.GetOperation> = BackendGetOperation<BaseOperation>;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode DatabaseBackend.get | DatabaseBackend#get}
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.GetOperation | GetOperation}, e.g
     * {@linkcode Macro.Database.GetOperation}.
     *
     * @remarks No properties are required here. `IntentionalPartial` because `undefined`-valued properties don't survive the socket.
     */
    type BackendGetOperation<BaseOperation extends DatabaseBackend.GetOperation> = IntentionalPartial<BaseOperation>;

    /* ***********************************************
     *                  GET LOOKUPS                  *
     *************************************************/

    /**
     * This type exists to be the constraint for {@linkcode Document.get}'s `operation` parameter. Because
     * {@linkcode DatabaseBackend.GetOperation} is typed for the point in the operation lifecycle with the
     * most required properties, any specific documents' {@linkcode GetDocumentsOperation}s are not
     * assignable to it, since they have been partialed.
     */
    type AnyGetOperation = IntentionalPartial<DatabaseBackend.GetOperation>;

    /** @see {@linkcode DatabaseBackend.GetOperation} */
    type GetOperationForName<DocName extends Document.Type> = Internal.Lookup<"GetOperation", DocName>;

    /** @see {@linkcode Document.Database.GetDocumentsOperation} */
    type GetDocumentsOperationForName<DocName extends Document.Type> = Internal.Lookup<
      "GetDocumentsOperation",
      DocName
    >;

    /** @see {@linkcode Document.Database.BackendGetOperation} */
    type BackendGetOperationForName<DocName extends Document.Type> = Internal.Lookup<"BackendGetOperation", DocName>;

    /* ***********************************************
     *           CREATE OPERATION HELPERS            *
     *************************************************/

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document.create} or
     * {@linkcode Document.createDocuments | .createDocuments}. Unlike for `Update` or `Delete` operations, there is no one vs many
     * distinction for `Create` ops, as `.create` will take either a single data object or instance, or an array of such, and it provides no
     * guaranteed properties over `.createDocuments`.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.CreateOperation}, e.g
     * {@linkcode JournalEntry.Database.CreateOperation}.
     *
     * @remarks `data` is omitted because it's passed to either method as a separate parameter.
     *
     * See {@linkcode BackendCreateOperation}'s remarks for more info.
     */
    type CreateDocumentsOperation<BaseOperation extends DatabaseBackend.CreateOperation> = Omit<
      BackendCreateOperation<BaseOperation>,
      "data"
    >;

    /**
     * A helper type for defining the interface that gets passed to
     * {@linkcode Document.createEmbeddedDocuments | Document#createEmbeddedDocuments}.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.CreateOperation}, e.g
     * {@linkcode JournalEntry.Database.CreateOperation}.
     *
     * @remarks This type does the same omission as {@linkcode UpdateOneDocumentOperation} or {@linkcode DeleteOneDocumentOperation}, for
     * similar reasons: the called method sets `pack` and `parent` to the values from the instance it's called on.
     */
    type CreateEmbeddedOperation<BaseOperation extends DatabaseBackend.CreateOperation> = Omit<
      CreateDocumentsOperation<BaseOperation>,
      "pack" | "parent" | "parentUuid"
    >;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode DatabaseBackend.create | DatabaseBackend#create}. This
     * project assumes that that method has not been overridden, or, if it has, that the override calls `super` immediately.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.CreateOperation}, e.g
     * {@linkcode JournalEntry.Database.CreateOperation}.
     *
     * @remarks Some properties are omitted because they are overwritten before the next opportunity for non-core code to interact with this
     * object ({@linkcode ClientDatabaseBackend._createDocuments | ClientDatabaseBackend#_createDocuments}):
     *
     * - `action`: set in `DatabaseBackend##configureCreate`. Only the one possible value.
     * - `modifiedTime`: set in `DatabaseBackend##configureOperation`
     *
     * For non-{@link CONST.PRIMARY_DOCUMENT_TYPES | primary} documents, one of `parent` or `parentUuid` are required; enforcing this at the
     * type level would involve an annoying amount of work, which we chosen not to do for now.
     *
     * Use of `InexactPartialExcept` was required to properly reflect `data` being the only truly required property here
     * (`DatabaseBackend##configureCreate` will throw if it isn't at least an array).
     *
     * Properties with values of explicit `undefined` will be passed to {@linkcode Document._preCreate | Document#_preCreate},
     * {@linkcode Document._preCreateOperation}, and {@link Hooks.PreCreateDocument | the `preCreate[Document]` hook}, but will be stripped
     * when sent over the socket, and will not appear in the object passed to {@linkcode Document._onCreate | Document#_onCreate},
     * {@linkcode Document._onCreateOperation}, or {@link Hooks.CreateDocument | the `create[Document]` hook}.
     */
    type BackendCreateOperation<BaseOperation extends DatabaseBackend.CreateOperation> = InexactPartialExcept<
      Omit<BaseOperation, "action" | "modifiedTime">,
      "data"
    >;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document._preCreate | Document#_preCreate},
     * {@link Hooks.PreCreateDocument | the `preCreate[Document]` hook}, and
     * {@linkcode ClientDocumentMixin.AnyMixed._preCreateDescendantDocuments | ClientDocument._preCreateDescendantDocuments}.
     *
     * This type assumes that any override of {@linkcode ClientDatabaseBackend._createDocuments | ClientDatabaseBackend#_createDocuments}
     * calls `super`, ensuring a call to `##preCreateDocumentArray`.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.CreateOperation}, e.g
     * {@linkcode JournalEntry.Database.CreateOperation}.
     *
     * @remarks This type makes no optionality changes, only omits the keys that `ClientDatabaseBackend##preCreateDocumentArray` pulls out
     * of `operation` before passing on the remainder as `options`.
     */
    type PreCreateOptions<BaseOperation extends DatabaseBackend.CreateOperation> = Omit<
      BaseOperation,
      "data" | "noHook" | "pack" | "parent"
    >;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document._preCreateOperation}.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.CreateOperation}, e.g
     * {@linkcode JournalEntry.Database.CreateOperation}.
     *
     * @remarks The only change this type makes is to restrict the `CreateData` to source objects only;
     * `ClientDatabaseBackend##preCreateDocumentArray` has called `#toObject` on all instances by this point.
     */
    type PreCreateOperation<BaseOperation extends DatabaseBackend.CreateOperation> = _RestrictToDataObjects<
      BaseOperation,
      "data"
    >;

    /**
     * A helper type for defining the interface that gets passed to the deprecated {@linkcode Document._onCreateDocuments} method. This will
     * be removed in v14 along with that method.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.CreateOperation}, e.g
     * {@linkcode JournalEntry.Database.CreateOperation}.
     *
     * @remarks Since this method is called inside {@linkcode Document.createDocuments}, but *after* the call to
     * {@linkcode DatabaseBackend.create | DatabaseBackend#create}, it receives the final mutated version of the client-side `operation`
     * object, and the last thing `ClientDatabaseBackend##preCreateDocumentArray` does is set `operation.data = documents`, this is the one
     * use for the `false`/`Extract` branch in {@linkcode _RestrictToDataObjects}.
     *
     * `modifiedTime` will be the time sent from the client, same as in the `pre_` interfaces.
     */
    type OnCreateDocumentsOperation<BaseOperation extends DatabaseBackend.CreateOperation> = _RestrictToDataObjects<
      BaseOperation,
      "data",
      false
    >;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document._onCreate | Document#_onCreate},
     * {@link Hooks.CreateDocument | the `create[Document]` hook}, and
     * {@linkcode ClientDocumentMixin.AnyMixed._onCreateDescendantDocuments | ClientDocument._onCreateDescendantDocuments}.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.CreateOperation}, e.g
     * {@linkcode JournalEntry.Database.CreateOperation}.
     *
     * @remarks This interface is created in `ClientDatabaseBackend##handleCreateDocuments`, which pulls out the omitted keys before passing
     * the rest of the object along.
     *
     * `data` is omitted not because it gets pulled out but because it does not exist in the `operation` the socket returns. It is added
     * back *after* `options` is defined, which is why it appears in {@linkcode Document.Database.OnCreateOperation | OnCreateOperation}.
     *
     * See {@linkcode ActorDelta.Database.CreateOperation.syntheticActorUpdate} for more on that key.
     *
     * `temporary` is omitted because any operation that included it would have short-circuited at the
     * {@linkcode ClientDatabaseBackend._createDocuments | ClientDatabaseBackend#_createDocuments} stage, skipping post-operation calls like
     * this interface is used for.
     */
    type OnCreateOptions<BaseOperation extends DatabaseBackend.CreateOperation> = Omit<
      BaseOperation,
      "data" | "pack" | "parentUuid" | "syntheticActorUpdate" | "temporary"
    >;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document._onCreateOperation}, and
     * {@linkcode DocumentCollection._onModifyContents | DocumentCollection#_onModifyContents}.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.CreateOperation}, e.g
     * {@linkcode JournalEntry.Database.CreateOperation}.
     *
     * @remarks `ClientDatabaseBackend##handleCreateDocuments` sets `operation.data = response.result`, that being the array of data objects
     * sent back from the server. No instances appear in it, regardless of initial input. This object is a new reference from the original
     * `operation` at the head of this call stack.
     *
     * `temporary` is omitted because any operation that included it would have short-circuited at the
     * {@linkcode ClientDatabaseBackend._createDocuments | ClientDatabaseBackend#_createDocuments} stage, skipping post-operation calls like
     * this interface is used for.
     */
    type OnCreateOperation<BaseOperation extends DatabaseBackend.CreateOperation> = Omit<
      _RestrictToDataObjects<BaseOperation, "data">,
      "temporary"
    >;

    /* ***********************************************
     *               CREATE LOOKUPS                  *
     *************************************************/

    /**
     * This type exists to be the constraint for {@linkcode Document.createDocuments}'s and {@linkcode Document.create}'s `operation`
     * parameters. Because {@linkcode DatabaseBackend.CreateOperation} is typed for the point in the operation lifecycle with the most
     * required properties, any specific documents' {@linkcode CreateDocumentsOperation}s are not assignable to it, since they have been
     * partialed.
     */
    type AnyCreateOperation = IntentionalPartial<DatabaseBackend.CreateOperation>;

    /**
     * @remarks This previously found the interface for passing to the relevant {@linkcode Document.create}.
     * {@linkcode CreateDocumentsOperationForName} performs that duty now, while this returns types valid
     * for {@linkcode DatabaseBackend._createDocuments | DatabaseBackend#_createDocuments}.
     */
    type CreateOperationForName<
      DocName extends Document.Type,
      Temporary extends boolean | undefined = boolean | undefined,
    > = Internal.Lookup<"CreateOperation", DocName, Temporary>;

    /** @see {@linkcode Document.Database.CreateDocumentsOperation} */
    type CreateDocumentsOperationForName<
      DocName extends Document.Type,
      Temporary extends boolean | undefined = boolean | undefined,
    > = Internal.Lookup<"CreateDocumentsOperation", DocName, Temporary>;

    /** @see {@linkcode Document.Database.CreateEmbeddedOperation} */
    type CreateEmbeddedOperationForName<DocName extends Document.Type> = Internal.Lookup<
      "CreateEmbeddedOperation",
      DocName
    >;

    /** @see {@linkcode Document.Database.BackendCreateOperation} */
    type BackendCreateOperationForName<
      DocName extends Document.Type,
      Temporary extends boolean | undefined = boolean | undefined,
    > = Internal.Lookup<"BackendCreateOperation", DocName, Temporary>;

    /** @see {@linkcode Document.Database.PreCreateOptions} */
    type PreCreateOptionsForName<
      DocName extends Document.Type,
      Temporary extends boolean | undefined = boolean | undefined,
    > = Internal.Lookup<"PreCreateOptions", DocName, Temporary>;

    /** @see {@linkcode Document.Database.PreCreateOperation} */
    type PreCreateOperationForName<
      DocName extends Document.Type,
      Temporary extends boolean | undefined = boolean | undefined,
    > = Internal.Lookup<"PreCreateOperation", DocName, Temporary>;

    /** @see {@linkcode Document.Database.OnCreateDocumentsOperation} */
    type OnCreateDocumentsOperationForName<DocName extends Document.Type> = Internal.Lookup<
      "OnCreateDocumentsOperation",
      DocName
    >;

    /** @see {@linkcode Document.Database.OnCreateOptions} */
    type OnCreateOptionsForName<DocName extends Document.Type> = Internal.Lookup<"OnCreateOptions", DocName>;

    /** @see {@linkcode Document.Database.OnCreateOperation} */
    type OnCreateOperationForName<DocName extends Document.Type> = Internal.Lookup<"OnCreateOperation", DocName>;

    /* ***********************************************
     *           UPDATE OPERATION HELPERS            *
     *************************************************/

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document.update | Document#update}, and, via aliases in the
     * specific document namespaces (e.g {@linkcode NoteDocument.Database.UpdateAsEmbeddedOperation}),
     * {@linkcode Document.updateEmbeddedDocuments | Document#updateEmbeddedDocuments}.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.UpdateOperation}, e.g
     * {@linkcode JournalEntry.Database.UpdateOperation}
     *
     * @remarks Since this interface is for the instance method only, `pack` and `parent` are omitted because they get set to the instance's
     * values, and `updates` because it's passed to `#update` as the first parameter.
     *
     * See {@linkcode UpdateManyDocumentsOperation}'s remarks for more info.
     */
    type UpdateOneDocumentOperation<BaseOperation extends DatabaseBackend.UpdateOperation> = Omit<
      UpdateManyDocumentsOperation<BaseOperation>,
      "pack" | "parent" | "parentUuid"
    >;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document.updateDocuments}.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.UpdateOperation}, e.g
     * {@linkcode JournalEntry.Database.UpdateOperation}.
     *
     * @remarks `updates` is omitted because it is set to what's passed as the first argument to the aforementioned methods before being
     * passed on to {@linkcode DatabaseBackend.update | DatabaseBackend#update}.
     *
     * See {@linkcode BackendUpdateOperation}'s remarks for more info.
     */
    type UpdateManyDocumentsOperation<BaseOperation extends DatabaseBackend.UpdateOperation> = Omit<
      BackendUpdateOperation<BaseOperation>,
      "updates"
    >;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode DatabaseBackend.update | DatabaseBackend#update}. This
     * project assumes that that method has not been overridden, or, if it has, that the override calls `super` immediately.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.UpdateOperation}, e.g
     * {@linkcode JournalEntry.Database.UpdateOperation}.
     *
     * @remarks Some properties are omitted because they are overwritten before the next opportunity for non-core code to interact with this
     * object ({@linkcode ClientDatabaseBackend._updateDocuments | ClientDatabaseBackend#_updateDocuments}):
     *
     * - `action`: set in `DatabaseBackend##configureUpdate`. Only the one possible value.
     * - `modifiedTime`: set in `DatabaseBackend##configureOperation`
     *
     * For non-{@link CONST.PRIMARY_DOCUMENT_TYPES | primary} documents, one of `parent` or `parentUuid` are required; enforcing this at the
     * type level would involve an annoying amount of work, which we chosen not to do for now.
     *
     * Use of `InexactPartialExcept` was required to properly reflect `updates` being the only truly required property here
     * (`DatabaseBackend##configureUpdate` will throw if it isn't at least an array)
     *
     * Properties with values of explicit `undefined` will be passed to {@linkcode Document._preUpdate | Document#_preUpdate},
     * {@linkcode Document._preUpdateOperation}, and {@link Hooks.PreUpdateDocument | the `preUpdate[Document]` hook}, but will be stripped
     * when sent over the socket, and will not appear in the object passed to {@linkcode Document._onUpdate | Document#_onUpdate},
     * {@linkcode Document._onUpdateOperation}, or {@link Hooks.UpdateDocument | the `update[Document]` hook}.
     */
    type BackendUpdateOperation<BaseOperation extends DatabaseBackend.UpdateOperation> = InexactPartialExcept<
      Omit<BaseOperation, "action" | "modifiedTime">,
      "updates"
    >;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document._preUpdate | Document#_preUpdate},
     * {@link Hooks.PreUpdateDocument | the `preUpdate[Document]` hook}, and
     * {@linkcode ClientDocumentMixin.AnyMixed._preUpdateDescendantDocuments | ClientDocument._preUpdateDescendantDocuments}.
     *
     * This type assumes that any override of {@linkcode ClientDatabaseBackend._updateDocuments | ClientDatabaseBackend#_updateDocuments}
     * calls `super`, ensuring a call to `##preUpdateDocumentArray`.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.UpdateOperation}, e.g
     * {@linkcode JournalEntry.Database.UpdateOperation}.
     *
     * @remarks This type makes no optionality changes, only omits the keys that `ClientDatabaseBackend##preUpdateDocumentArray` pulls out
     * of `operation` before passing on the remainder as `options`.
     *
     * See {@linkcode ActorDelta.Database.DeleteOperation.restoreDelta} for more information on that property.
     */
    type PreUpdateOptions<BaseOperation extends DatabaseBackend.UpdateOperation> = Omit<
      BaseOperation,
      "updates" | "restoreDelta" | "noHook" | "pack" | "parent"
    >;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document._preUpdateOperation}.
     *
     * This type assumes that any override of {@linkcode ClientDatabaseBackend._updateDocuments | ClientDatabaseBackend#_updateDocuments}
     * calls `super`, ensuring a call to `##preUpdateDocumentArray`.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.UpdateOperation}, e.g
     * {@linkcode JournalEntry.Database.UpdateOperation}.
     *
     * @remarks The only change this type makes is to restrict the `UpdateData` to source objects only;
     * `ClientDatabaseBackend##preUpdateDocumentArray` has called `#toObject` on all instances by this point.
     */
    type PreUpdateOperation<BaseOperation extends DatabaseBackend.UpdateOperation> = _RestrictToDataObjects<
      BaseOperation,
      "updates"
    >;

    /**
     * A helper type for defining the interface that gets passed to the deprecated {@linkcode Document._onUpdateDocuments} method. This
     * interface will be removed in v14 along with that method.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.UpdateOperation}, e.g
     * {@linkcode JournalEntry.Database.UpdateOperation}.
     *
     * @remarks This is effectively the same type as {@linkcode PreUpdateOperation}. Unlike {@linkcode OnCreateDocumentsOperation}, nothing
     * modifies the object after {@linkcode Document._preUpdateOperation}.
     *
     * `modifiedTime` will be the time sent from the client, same as in the `pre_` interfaces.
     */
    type OnUpdateDocumentsOperation<BaseOperation extends DatabaseBackend.UpdateOperation> =
      PreUpdateOperation<BaseOperation>;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document._onUpdate | Document#_onUpdate},
     * {@link Hooks.UpdateDocument | the `update[Document]` hook}, and
     * {@linkcode ClientDocumentMixin.AnyMixed._onUpdateDescendantDocuments | ClientDocument._onUpdateDescendantDocuments}.
     *
     * This type assumes that any override of {@linkcode ClientDatabaseBackend._updateDocuments | ClientDatabaseBackend#_updateDocuments}
     * calls `super`, ensuring a call to `##preUpdateDocumentArray`.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.UpdateOperation}, e.g
     * {@linkcode JournalEntry.Database.UpdateOperation}.
     *
     * @remarks This interface is created in `ClientDatabaseBackend##handleUpdateDocuments`, which pulls out the omitted keys before passing
     * the rest of the object along.
     *
     * `updates` is omitted not because it gets pulled out but because it does not exist in the `operation` the socket returns. It is added
     * back *after* `options` is defined, which is why it appears in {@linkcode Document.Database.OnUpdateOperation | OnUpdateOperation}.
     *
     * See {@linkcode ActorDelta.Database.UpdateOperation.syntheticActorUpdate} for more on that key.
     */
    type OnUpdateOptions<BaseOperation extends DatabaseBackend.UpdateOperation> = Omit<
      BaseOperation,
      "updates" | "pack" | "parentUuid" | "syntheticActorUpdate"
    >;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document._onUpdateOperation}, and
     * {@linkcode DocumentCollection._onModifyContents | DocumentCollection#_onModifyContents}.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.UpdateOperation}, e.g
     * {@linkcode JournalEntry.Database.UpdateOperation}.
     *
     * @remarks The only change this type makes is to restrict the `UpdateData` to source objects only;
     * `ClientDatabaseBackend##preUpdateDocumentArray` has called `#toObject` on all instances by this point.
     */
    type OnUpdateOperation<BaseOperation extends DatabaseBackend.UpdateOperation> = _RestrictToDataObjects<
      BaseOperation,
      "updates"
    >;

    /* ***********************************************
     *               UPDATE LOOKUPS                  *
     *************************************************/

    /**
     * This type exists to be the constraint for {@linkcode Document.updateDocuments}'s and {@linkcode Document.update | Document#update}'s
     * `operation` parameters. Because {@linkcode DatabaseBackend.UpdateOperation} is typed for the point in the operation lifecycle with
     * the most required properties, any specific documents' {@linkcode UpdateManyDocumentsOperation}s or
     * {@linkcode UpdateOneDocumentOperation}s are not assignable to it, since they have  been partialed.
     */
    type AnyUpdateOperation = IntentionalPartial<DatabaseBackend.UpdateOperation>;

    /**
     * @remarks This previously found the interface for passing to the relevant {@linkcode Document.update | Document#update}.
     * {@linkcode UpdateOneDocumentOperationForName} performs that duty now, while this returns types valid for
     * {@linkcode DatabaseBackend._updateDocuments | DatabaseBackend#_updateDocuments}
     */
    type UpdateOperationForName<DocName extends Document.Type> = Internal.Lookup<"UpdateOperation", DocName>;

    /** @see {@linkcode Document.Database.UpdateOneDocumentOperation} */
    type UpdateOneDocumentOperationForName<DocName extends Document.Type> = Internal.Lookup<
      "UpdateOneDocumentOperation",
      DocName
    >;

    /** @see {@linkcode Document.Database.UpdateOneDocumentOperation} */
    type UpdateEmbeddedOperationForName<DocName extends Document.Type> = Internal.Lookup<
      "UpdateEmbeddedOperation",
      DocName
    >;

    /** @see {@linkcode Document.Database.UpdateManyDocumentsOperation} */
    type UpdateManyDocumentsOperationForName<DocName extends Document.Type> = Internal.Lookup<
      "UpdateManyDocumentsOperation",
      DocName
    >;

    /** @see {@linkcode Document.Database.BackendUpdateOperation} */
    type BackendUpdateOperationForName<DocName extends Document.Type> = Internal.Lookup<
      "BackendUpdateOperation",
      DocName
    >;

    /** @see {@linkcode Document.Database.PreUpdateOptions} */
    type PreUpdateOptionsForName<DocName extends Document.Type> = Internal.Lookup<"PreUpdateOptions", DocName>;

    /** @see {@linkcode Document.Database.PreUpdateOperation} */
    type PreUpdateOperationForName<DocName extends Document.Type> = Internal.Lookup<"PreUpdateOperation", DocName>;

    /** @see {@linkcode Document.Database.OnUpdateDocumentsOperation} */
    type OnUpdateDocumentsOperationForName<DocName extends Document.Type> = Internal.Lookup<
      "OnUpdateDocumentsOperation",
      DocName
    >;

    /** @see {@linkcode Document.Database.OnUpdateOptions} */
    type OnUpdateOptionsForName<DocName extends Document.Type> = Internal.Lookup<"OnUpdateOptions", DocName>;

    /** @see {@linkcode Document.Database.OnUpdateOperation} */
    type OnUpdateOperationForName<DocName extends Document.Type> = Internal.Lookup<"OnUpdateOperation", DocName>;

    /* ***********************************************
     *           DELETE OPERATION HELPERS            *
     *************************************************/

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document.delete | Document#delete}, and, via aliases in the
     * specific document namespaces (e.g {@linkcode NoteDocument.Database.DeleteAsEmbeddedOperation}),
     * {@linkcode Document.deleteEmbeddedDocuments | Document#deleteEmbeddedDocuments}.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.DeleteOperation}, e.g
     * {@linkcode JournalEntry.Database.DeleteOperation}.
     *
     * @remarks Since this interface is for the instance method only, `pack` and `parent` are omitted as they get set to the instance's
     * values.
     *
     * See {@linkcode DeleteManyDocumentsOperation}'s remarks for more info.
     */
    type DeleteOneDocumentOperation<BaseOperation extends DatabaseBackend.DeleteOperation> = Omit<
      DeleteManyDocumentsOperation<BaseOperation>,
      "pack" | "parent" | "parentUuid"
    >;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document.deleteDocuments}.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.DeleteOperation}, e.g
     * {@linkcode JournalEntry.Database.DeleteOperation}.
     *
     * @remarks `ids` is omitted because it is set to what's passed as the first argument to the aforementioned methods before being passed
     * on to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete}.
     *
     * See {@linkcode BackendDeleteOperation}'s remarks for more info.
     */
    type DeleteManyDocumentsOperation<BaseOperation extends DatabaseBackend.DeleteOperation> = Omit<
      BackendDeleteOperation<BaseOperation>,
      "ids"
    >;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete}. This
     * project assumes that that method has not been overridden, or, if it has, that the override calls `super` immediately.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.DeleteOperation}, e.g
     * {@linkcode JournalEntry.Database.DeleteOperation}.
     *
     * @remarks Some properties are omitted because they are overwritten before the next opportunity for non-core code to interact with this
     * object ({@linkcode ClientDatabaseBackend._deleteDocuments | ClientDatabaseBackend#_deleteDocuments}):
     *
     * - `action`: set in `DatabaseBackend##configureDelete`. Only the one possible value.
     * - `modifiedTime`: set in `DatabaseBackend##configureOperation`
     *
     * For non-{@link CONST.PRIMARY_DOCUMENT_TYPES | primary} documents, one of `parent` or `parentUuid` are required; enforcing this at the
     * type level would involve an annoying amount of work, which we chosen not to do for now.
     *
     * Use of `InexactPartialExcept` was required to properly reflect `deletes` being the only truly required property here
     * (`DatabaseBackend##configureDelete` will throw if it isn't at least an array)
     *
     * Properties with values of explicit `undefined` will be passed to {@linkcode Document._preDelete | Document#_preDelete},
     * {@linkcode Document._preDeleteOperation}, and {@link Hooks.PreDeleteDocument | the `preDelete[Document]` hook}, but will be stripped
     * when sent over the socket, and will not appear in the object passed to {@linkcode Document._onDelete | Document#_onDelete},
     * {@linkcode Document._onDeleteOperation}, or {@link Hooks.DeleteDocument | the `delete[Document]` hook}.
     */
    type BackendDeleteOperation<BaseOperation extends DatabaseBackend.DeleteOperation> = InexactPartialExcept<
      Omit<BaseOperation, "action" | "modifiedTime">,
      "ids"
    >;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document._preDelete | Document#_preDelete},
     * {@link Hooks.PreDeleteDocument | the `preDelete[Document]` hook}, and
     * {@linkcode ClientDocumentMixin.AnyMixed._preDeleteDescendantDocuments | ClientDocument._preDeleteDescendantDocuments}.
     *
     * This type assumes that any override of {@linkcode ClientDatabaseBackend._deleteDocuments | ClientDatabaseBackend#_deleteDocuments}
     * calls `super`, ensuring a call to `##preDeleteDocumentArray`.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.DeleteOperation}, e.g
     * {@linkcode JournalEntry.Database.DeleteOperation}.
     *
     * @remarks This type makes no optionality changes, only omits the keys that `ClientDatabaseBackend##preDeleteDocumentArray` pulls out
     * of `operation` before passing on the remainder as `options`.
     */
    type PreDeleteOptions<BaseOperation extends DatabaseBackend.DeleteOperation> = Omit<
      BaseOperation,
      "ids" | "deleteAll" | "noHook" | "pack" | "parent"
    >;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document._preDeleteOperation}.
     *
     * This type assumes that any override of {@linkcode ClientDatabaseBackend._deleteDocuments | ClientDatabaseBackend#_deleteDocuments}
     * calls `super`, ensuring a call to `##preDeleteDocumentArray`.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.DeleteOperation}, e.g
     * {@linkcode JournalEntry.Database.DeleteOperation}.
     *
     * @remarks This type is a no-op, here only for consistency of the operation interface 'type template'. Unlike create or update ops,
     * there is no data property to restrict, just a list of IDs.
     */
    type PreDeleteOperation<BaseOperation extends DatabaseBackend.DeleteOperation> = BaseOperation;

    /**
     * A helper type for defining the interface that gets passed to the deprecated {@linkcode Document._onDeleteDocuments} method. This
     * interface will be removed in v14 along with that method.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.DeleteOperation}, e.g
     * {@linkcode JournalEntry.Database.CreateOperation}.
     *
     * @remarks This is effectively the same type as {@linkcode PreDeleteOperation}. Unlike {@linkcode OnCreateDocumentsOperation}, nothing
     * modifies the object after {@linkcode Document._preDeleteOperation}.
     *
     * `modifiedTime` will be the time sent from the client, same as in the `pre_` interfaces.
     */
    type OnDeleteDocumentsOperation<BaseOperation extends DatabaseBackend.DeleteOperation> =
      PreDeleteOperation<BaseOperation>;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document._onDelete | Document#_onDelete},
     * {@link Hooks.DeleteDocument | the `delete[Document]` hook}, and
     * {@linkcode ClientDocumentMixin.AnyMixed._onDeleteDescendantDocuments | ClientDocument._onDeleteDescendantDocuments}.
     *
     * This type assumes that any override of {@linkcode ClientDatabaseBackend._deleteDocuments | ClientDatabaseBackend#_deleteDocuments}
     * calls `super`, ensuring a call to `##preDeleteDocumentArray`.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.DeleteOperation}, e.g
     * {@linkcode JournalEntry.Database.DeleteOperation}.
     *
     * @remarks This interface is created in `ClientDatabaseBackend##handleDeleteDocuments`, which pulls out the omitted keys before passing
     * the rest of the object along.
     *
     * `ids` is omitted not because it gets pulled out but because it does not exist in the `operation` the socket returns. It is added back
     * _after_ `options` is defined, which is why it appears in {@linkcode Document.Database.OnDeleteOperation | OnDeleteOperation}.
     *
     * See {@linkcode ActorDelta.Database.DeleteOperation.syntheticActorUpdate} for more on that key.
     */
    type OnDeleteOptions<BaseOperation extends DatabaseBackend.DeleteOperation> = Omit<
      BaseOperation,
      "ids" | "deleteAll" | "pack" | "parentUuid" | "syntheticActorUpdate"
    >;

    /**
     * A helper type for defining the interface that gets passed to {@linkcode Document._onDeleteOperation}, and
     * {@linkcode DocumentCollection._onModifyContents | DocumentCollection#_onModifyContents}.
     *
     * @template BaseOperation - A specific document's {@linkcode DatabaseBackend.DeleteOperation}, e.g
     * {@linkcode JournalEntry.Database.DeleteOperation}.
     *
     * @remarks This type is a no-op, here only for consistency of the operation interface 'type template'. Unlike create or update ops,
     * there is no data property to restrict, just a list of IDs.
     */
    type OnDeleteOperation<BaseOperation extends DatabaseBackend.DeleteOperation> = BaseOperation;

    /* ***********************************************
     *               DELETE LOOKUPS                  *
     *************************************************/

    /**
     * This type exists to be the constraint for {@linkcode Document.deleteDocuments}'s and {@linkcode Document.delete | Document#delete}'s
     * `operation` parameters. Because {@linkcode DatabaseBackend.DeleteOperation} is typed for the point in the operation lifecycle with
     * the most required properties, any specific documents' {@linkcode DeleteManyDocumentsOperation}s or
     * {@linkcode DeleteOneDocumentOperation}s are not assignable to it, since they have  been partialed.
     */
    type AnyDeleteOperation = IntentionalPartial<DatabaseBackend.UpdateOperation>;

    /**
     * @remarks This previously found the interface for passing to the relevant {@linkcode Document.delete | Document#delete}.
     * {@linkcode DeleteOneDocumentOperationForName} performs that duty now, while this returns types valid
     * for {@linkcode DatabaseBackend._deleteDocuments | DatabaseBackend#_deleteDocuments}
     */
    type DeleteOperationForName<DocName extends Document.Type> = Internal.Lookup<"DeleteOperation", DocName>;

    /** @see {@linkcode Document.Database.DeleteOneDocumentOperation} */
    type DeleteOneDocumentOperationForName<DocName extends Document.Type> = Internal.Lookup<
      "DeleteOneDocumentOperation",
      DocName
    >;

    /** @see {@linkcode Document.Database.DeleteOneDocumentOperation} */
    type DeleteEmbeddedOperationForName<DocName extends Document.Type> = Internal.Lookup<
      "DeleteEmbeddedOperation",
      DocName
    >;

    /** @see {@linkcode Document.Database.DeleteManyDocumentsOperation} */
    type DeleteManyDocumentsOperationForName<DocName extends Document.Type> = Internal.Lookup<
      "DeleteManyDocumentsOperation",
      DocName
    >;

    /** @see {@linkcode Document.Database.BackendDeleteOperation} */
    type BackendDeleteOperationForName<DocName extends Document.Type> = Internal.Lookup<
      "BackendDeleteOperation",
      DocName
    >;

    /** @see {@linkcode Document.Database.PreDeleteOptions} */
    type PreDeleteOptionsForName<DocName extends Document.Type> = Internal.Lookup<"PreDeleteOptions", DocName>;

    /** @see {@linkcode Document.Database.PreDeleteOperation} */
    type PreDeleteOperationForName<DocName extends Document.Type> = Internal.Lookup<"PreDeleteOperation", DocName>;

    /** @see {@linkcode Document.Database.OnDeleteDocumentsOperation} */
    type OnDeleteDocumentsOperationForName<DocName extends Document.Type> = Internal.Lookup<
      "OnDeleteDocumentsOperation",
      DocName
    >;

    /** @see {@linkcode Document.Database.OnDeleteOptions} */
    type OnDeleteOptionsForName<DocName extends Document.Type> = Internal.Lookup<"OnDeleteOptions", DocName>;

    /** @see {@linkcode Document.Database.OnDeleteOperation} */
    type OnDeleteOperationForName<DocName extends Document.Type> = Internal.Lookup<"OnDeleteOperation", DocName>;

    namespace Internal {
      type GetOperation = "GetDocumentsOperation" | "BackendGetOperation" | "GetOperation";

      type CreateOperation =
        | "CreateDocumentsOperation"
        | "CreateEmbeddedOperation"
        | "BackendCreateOperation"
        | "CreateOperation"
        | "PreCreateOptions"
        | "PreCreateOperation"
        | "OnCreateDocumentsOperation"
        | "OnCreateOptions"
        | "OnCreateOperation";

      type UpdateOperation =
        | "UpdateOneDocumentOperation"
        | "UpdateEmbeddedOperation"
        | "UpdateManyDocumentsOperation"
        | "BackendUpdateOperation"
        | "UpdateOperation"
        | "PreUpdateOptions"
        | "PreUpdateOperation"
        | "OnUpdateDocumentsOperation"
        | "OnUpdateOptions"
        | "OnUpdateOperation";

      type DeleteOperation =
        | "DeleteOneDocumentOperation"
        | "DeleteEmbeddedOperation"
        | "DeleteManyDocumentsOperation"
        | "BackendDeleteOperation"
        | "DeleteOperation"
        | "PreDeleteOptions"
        | "PreDeleteOperation"
        | "OnDeleteDocumentsOperation"
        | "OnDeleteOptions"
        | "OnDeleteOperation";

      type Operation = GetOperation | CreateOperation | UpdateOperation | DeleteOperation;

      type Lookup<
        Operation extends Document.Database.Internal.Operation,
        Name extends Document.Type,
        Temporary extends boolean | undefined = boolean | undefined,
      > =
        | (Name extends "ActiveEffect" ? ActiveEffect.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "ActorDelta" ? ActorDelta.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "Actor" ? Actor.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "Adventure" ? Adventure.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "AmbientLight"
            ? AmbientLightDocument.Database.Internal.OperationNameMap<Temporary>[Operation]
            : never)
        | (Name extends "AmbientSound"
            ? AmbientSoundDocument.Database.Internal.OperationNameMap<Temporary>[Operation]
            : never)
        | (Name extends "Card" ? Card.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "Cards" ? Cards.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "ChatMessage" ? ChatMessage.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "Combat" ? Combat.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "Combatant" ? Combatant.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "CombatantGroup"
            ? CombatantGroup.Database.Internal.OperationNameMap<Temporary>[Operation]
            : never)
        | (Name extends "Drawing" ? DrawingDocument.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "FogExploration"
            ? FogExploration.Database.Internal.OperationNameMap<Temporary>[Operation]
            : never)
        | (Name extends "Folder" ? Folder.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "Item" ? Item.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "JournalEntryCategory"
            ? JournalEntryCategory.Database.Internal.OperationNameMap<Temporary>[Operation]
            : never)
        | (Name extends "JournalEntryPage"
            ? JournalEntryPage.Database.Internal.OperationNameMap<Temporary>[Operation]
            : never)
        | (Name extends "JournalEntry" ? JournalEntry.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "Macro" ? Macro.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "MeasuredTemplate"
            ? MeasuredTemplateDocument.Database.Internal.OperationNameMap<Temporary>[Operation]
            : never)
        | (Name extends "Note" ? NoteDocument.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "PlaylistSound"
            ? PlaylistSound.Database.Internal.OperationNameMap<Temporary>[Operation]
            : never)
        | (Name extends "Playlist" ? Playlist.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "RegionBehavior"
            ? RegionBehavior.Database.Internal.OperationNameMap<Temporary>[Operation]
            : never)
        | (Name extends "Region" ? RegionDocument.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "RollTable" ? RollTable.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "Scene" ? Scene.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "Setting" ? Setting.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "TableResult" ? TableResult.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "Tile" ? TileDocument.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "Token" ? TokenDocument.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "User" ? User.Database.Internal.OperationNameMap<Temporary>[Operation] : never)
        | (Name extends "Wall" ? WallDocument.Database.Internal.OperationNameMap<Temporary>[Operation] : never);
    }

    /* ***********************************************
     *             DocsV2 DEPRECATIONS               *
     *************************************************/

    /** @deprecated Use {@linkcode OperationAction} instead. This type will be removed in v14. */
    type Operation = OperationAction;

    /**
     * @deprecated This type has been replaced with document-specific interfaces, e.g {@linkcode Macro.Database.GetDocumentsOperation}.
     * This type will be removed in v14.
     *
     * @see {@linkcode GetDocumentsOperation}
     */
    interface GetOptions extends Pick<DatabaseBackend.GetOperation, "pack"> {}

    // CreateDocumentsOperation didn't change purpose or name

    /** @deprecated Use {@linkcode UpdateOneDocumentOperation} instead. This type will be removed in v14 */
    type UpdateOperation<Op extends DatabaseBackend.UpdateOperation> = UpdateOneDocumentOperation<Op>;

    /** @deprecated Use {@linkcode DeleteOneDocumentOperation} instead. This type will be removed in v14 */
    type DeleteOperation<Op extends DatabaseBackend.DeleteOperation> = DeleteOneDocumentOperation<Op>;

    /** @deprecated Use {@linkcode PreCreateOperation} instead. This type will be removed in v14 */
    type PreCreateOperationStatic<Op extends DatabaseBackend.CreateOperation> = PreCreateOperation<Op>;

    // PreCreateOptions didn't change purpose or name

    /** @deprecated Use {@linkcode OnCreateOptions} instead. This type will be removed in v14 */
    type CreateOptions<Op extends DatabaseBackend.CreateOperation> = OnCreateOptions<Op>;

    /** @deprecated Use {@linkcode UpdateManyDocumentsOperation} instead. This type will be removed in v14 */
    type UpdateDocumentsOperation<Op extends DatabaseBackend.UpdateOperation> = UpdateManyDocumentsOperation<Op>;

    /** @deprecated Use {@linkcode UpdateOneDocumentOperation} instead. This type will be removed in v14 */
    type UpdateOperationInstance<Op extends DatabaseBackend.UpdateOperation> = UpdateOneDocumentOperation<Op>;

    /** @deprecated Use {@linkcode PreUpdateOperation} instead. This type will be removed in v14 */
    type PreUpdateOperationStatic<Op extends DatabaseBackend.UpdateOperation> = PreUpdateOperation<Op>;

    // PreUpdateOptions didn't change purpose or name

    /** @deprecated Use {@linkcode OnUpdateOptions} instead. This type will be removed in v14 */
    type UpdateOptions<Op extends DatabaseBackend.UpdateOperation> = OnUpdateOptions<Op>;

    /** @deprecated Use {@linkcode DeleteManyDocumentOperation} instead. This type will be removed in v14 */
    type DeleteDocumentsOperation<Op extends DatabaseBackend.DeleteOperation> = DeleteManyDocumentsOperation<Op>;

    /** @deprecated Use {@linkcode DeleteOneDocumentOperation} instead. This type will be removed in v14 */
    type DeleteOperationInstance<Op extends DatabaseBackend.DeleteOperation> = DeleteOneDocumentOperation<Op>;

    /** @deprecated Use {@linkcode PreDeleteOperation} instead. This type will be removed in v14 */
    type PreDeleteOperationStatic<Op extends DatabaseBackend.DeleteOperation> = PreDeleteOperation<Op>;

    /** @deprecated Use {@linkcode PreDeleteOptions} instead. This type will be removed in v14 */
    type PreDeleteOperationInstance<Op extends DatabaseBackend.DeleteOperation> = PreDeleteOptions<Op>;

    /** @deprecated Use {@linkcode OnDeleteOptions} instead. This type will be removed in v14 */
    type DeleteOptions<Op extends DatabaseBackend.DeleteOperation> = OnDeleteOptions<Op>;

    /** @deprecated Use {@linkcode CreateOperationForName} instead. This type will be removed in v14 */
    type CreateForName<DocumentName extends Document.Type> = CreateOperationForName<DocumentName>;

    /** @deprecated Use {@linkcode OnCreateOptionsForName} instead. This type will be removed in v14 */
    type CreateOptionsFor<DocumentName extends Document.Type> = OnCreateOptionsForName<DocumentName>;

    /** @deprecated Use {@linkcode OnUpdateOptionsForName} instead. This type will be removed in v14 */
    type UpdateOptionsFor<DocumentName extends Document.Type> = OnUpdateOptionsForName<DocumentName>;

    /** @deprecated Use {@linkcode OnDeleteOptionsForName} instead. This type will be removed in v14 */
    type DeleteOptionsFor<DocumentName extends Document.Type> = OnDeleteOptionsForName<DocumentName>;

    /** @deprecated Use {@linkcode PreCreateOptionsForName} instead. This type will be removed in v14 */
    type PreCreateOptionsFor<DocumentName extends Document.Type> = PreCreateOptionsForName<DocumentName>;

    /** @deprecated Use {@linkcode PreUpdateOptionsForName} instead. This type will be removed in v14 */
    type PreUpdateOptionsFor<DocumentName extends Document.Type> = PreUpdateOptionsForName<DocumentName>;

    /** @deprecated Use {@linkcode PreDeleteOptionsForName} instead. This type will be removed in v14 */
    type PreDeleteOptionsFor<DocumentName extends Document.Type> = PreDeleteOptionsForName<DocumentName>;
  }

  /**
   * @remarks {@linkcode Document.testUserPermission | Document#testUserPermission}'s second param can take either the string level name or
   * the numerical (branded) value.
   */
  type ActionPermission = keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS;

  /** @internal */
  interface _TestUserPermissionsOptions {
    /**
     * Require the exact permission level requested?
     * @defaultValue `false`
     */
    exact: boolean;
  }

  interface TestUserPermissionOptions extends InexactPartial<_TestUserPermissionsOptions> {}

  type CanUserModifyData<Name extends Document.Type, Action extends Document.Database.OperationAction> =
    | (Action extends "create" ? CreateDataForName<Name> : never)
    | (Action extends "update" ? UpdateDataForName<Name> : never)
    | (Action extends "delete" ? EmptyObject : never);

  interface GetEmbeddedDocumentOptions extends EmbeddedCollection.GetOptions {}

  /**
   * Gets the hierarchical fields in the schema. Hardcoded to whatever Foundry fields are hierarchical
   * as there is no way to access the a static property of a custom fields from an instance.
   */
  type HierarchyOf<Schema extends DataSchema> = PickValue<
    Schema,
    EmbeddedCollectionField.Any | EmbeddedDocumentField.Any
  >;

  interface DataFieldShimOptions extends LogCompatibilityWarningOptions {
    /** The deprecation message */
    warning?: string | undefined;

    /**
     * The value of the shim
     * @remarks Foundry uses `if ("value" in options)` to determine whether to override the default value.
     */
    value?: unknown;
  }

  type RecursiveFieldClearCallback = (data: AnyMutableObject, fieldName: string) => void;

  interface ClearFieldsRecursivelyOptions {
    /** A callback that is invoked on each field in order to clear it. */
    callback?: RecursiveFieldClearCallback | undefined;
  }

  /* ***********************************************
   *             CLIENT DOCUMENT TYPES             *
   *************************************************/

  /**
   * If a `parent` is required for a given Document's creation, its template must pass `NonNullable<X.Parent>` to `CreateDialogOptions`,
   * e.g {@linkcode JournalEntryPage.CreateDialogOptions}
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

  /**
   * Only allow passing a `type` to {@linkcode ClientDocumentMixin.AnyMixed.defaultName | ClientDocument#defaultName} if the Document in
   * question has type data.
   * @internal
   */
  type _PossibleSubtypeContext<DocumentName extends Document.Type> =
    GetKey<Document.MetadataFor<DocumentName>, "hasTypeData"> extends true
      ? InexactPartial<{
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

  /**
   * A helper type for defining the interface passed to a specific Document's
   * {@linkcode ClientDocumentMixin.AnyMixed.defaultName | ClientDocument#defaultName}.
   */
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

  /**
   * The {@linkcode ClientDocumentMixin.AnyMixed.createDialog | ClientDocument.createDialog} method's default template
   */
  // TODO(LukeAbby): Inline into each document.
  type CreateDialogData<CreateData extends object> = InexactPartial<{
    [K in keyof CreateData as Extract<K, "name" | "type" | "folder">]: CreateData[K];
  }> &
    Omit<CreateData, "name" | "type" | "folder">;

  /** @internal */
  type _PossibleSubtypesContext<DocumentName extends Document.Type> =
    GetKey<Document.MetadataFor<DocumentName>, "hasTypeData"> extends true
      ? InexactPartial<{
          /**
           * A restriction the selectable sub-types of the Dialog.
           * @remarks Only checked if the document has `static TYPES` of length \> 1 (i.e it both `hasTypeData` and has
           * at least one non-`"base"` type registered). The computed list will always exclude {@linkcode CONST.BASE_DOCUMENT_TYPE},
           * so it is disallowed in this whitelist.
           */
          types: Exclude<Document.SubTypesOf<DocumentName>, "base">[];
        }>
      : {
          /** @deprecated This Document type does not support subtypes */
          types?: never;
        };

  /** @deprecated in favor of {@linkcode CreateDialogOptions}. Will be removed in v14. */
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

  /**
   * Prior to v13, {@linkcode ClientDocumentMixin.AnyMixed.createDialog | ClientDocument.createDialog} took Dialog (V1) options in the same
   * parameter as the {@linkcode Document.Database.CreateDocumentsOperation | CreateDocumentsOperation}. In v13+, it still checks for a
   * subset of those options that are relevant to DialogV2 (and also `jQuery`, for some reason) and, if they exist, reorganizes them to
   * match V2 option format and adds them to the new `dialogOptions` object, which is a rest property on the new 3rd parameter.
   *
   * This is `IntentionalPartial` because `.createDialog` checks for keys with `in`.
   * @internal
   */
  type _PartialDialogV1OptionsForCreateDialog = IntentionalPartial<
    Pick<DialogV2.PromptConfig, "id" | "classes"> & {
      /** @deprecated As of v13 these options are being passed to a {@linkcode DialogV2} so this property has no effect */
      jQuery: boolean;

      title: string;
    } & ApplicationV2.Position
  >;

  /** The interface for {@linkcode CreateDialogOptions.folders}, see remarks there */
  interface DialogFoldersChoices extends Omit<FormSelectOption, "value" | "label"> {
    id: string;
    name: string;
  }

  /**
   * A helper type for defining the interface to pass to a specific document's {@linkcode ClientDocument.createDialog | .createDialog}'s
   * second parameter.
   */
  type CreateDialogOptions<DocumentName extends Document.Type> = DialogV2.PromptConfig &
    InexactPartial<{
      /**
       * Available folders in which the new Document can be placed
       * @remarks This gets passed to a {@linkcode foundry.applications.handlebars.selectOptions | selectOptions} as the choices, with the
       * default template having `valueAttr="id" labelAttr="name"`
       */
      folders: Array<DialogFoldersChoices>;

      /**
       * A template to use for the dialog contents instead of the default.
       * @remarks If nothing is passed for this, the default at `templates/sidebar/document-create.html` will be used
       */
      template: string;

      /**
       * Additional render context to provide to the template.
       * @remarks Only relevant if passing a non-default {@linkcode template}
       */
      context: AnyObject;
    }> &
    _PossibleSubtypesContext<DocumentName>;

  /**
   * A helper type for generating the return for {@linkcode ClientDocumentMixin.AnyMixed.createDialog | ClientDocument.createDialog}.
   *
   * @remarks The passed config is {@linkcode foundry.utils.mergeObject | mergeObject}ed over an existing base config, which has an `ok`
   * callback forwarding the return of {@linkcode Document.create} (but a call where we are sure that it's only being passed a  single
   * data object).
   */
  type CreateDialogReturn<
    Doc extends Document.Any,
    PassedConfig extends DialogV2.PromptConfig | undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  > = _CreateDialogReturn<Doc, Coalesce<PassedConfig, {}>>;

  /**
   * Nested `SimpleMerge`s is to avoid using the more complicated `Merge` type. Merging the `ok` object separately allows calls like
   * ```js
   * Actor.createDialog({}, {}, { ok: { label: "Something" }})
   * ```
   * to not knock out the `callback` from a types perspective, and more finesse isn't required because other properties that affect
   * the return type are either top level or not included in the default config.
   * @internal
   */
  type _CreateDialogReturn<
    Doc extends Document.Any,
    PassedConfig extends DialogV2.PromptConfig,
  > = DialogV2.PromptReturn<
    SimpleMerge<
      PassedConfig,
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      { ok: SimpleMerge<{ callback: () => Promise<Doc | undefined> }, GetKey<PassedConfig, "ok", {}>> }
    >
  >;

  /**
   * A helper type for generating the return for {@linkcode ClientDocumentMixin.AnyMixed.deleteDialog | ClientDocument#deleteDialog}.
   *
   * @remarks The passed config is {@linkcode foundry.utils.mergeObject | mergeObject}ed over an existing base config, which has a `yes`
   * callback forwarding the return of {@linkcode Document.delete | Document#delete}.
   */
  type DeleteDialogReturn<
    Doc extends Document.Any,
    PassedConfig extends DialogV2.ConfirmConfig | undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  > = _DeleteDialogReturn<Doc, Coalesce<PassedConfig, {}>>;

  /**
   * Nested `SimpleMerge`s is to avoid using the more complicated `Merge` type. Merging the `yes` object separately allows calls like
   * ```js
   * someActor.deleteDialog({}, { yes: { label: "KILL" }})
   * ```
   * to not knock out the `callback` from a types perspective, and more finesse isn't required because other properties that affect
   * the return type are either top level or not included in the default config.
   * @internal
   */
  type _DeleteDialogReturn<
    Doc extends Document.Any,
    PassedConfig extends DialogV2.ConfirmConfig,
  > = DialogV2.ConfirmReturn<
    SimpleMerge<
      PassedConfig,
      {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        yes: SimpleMerge<{ callback: () => Promise<Doc | undefined> }, GetKey<PassedConfig, "yes", {}>>;
      }
    >
  >;

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   *
   * {@linkcode ClientDocumentMixin.AnyMixed.deleteDialog}'s first parameter is a {@linkcode DialogV2.ConfirmConfig}, but
   * it will accept top level position-related keys with a deprecation warning and move them into the `position` object, where they
   * should be in AppV2 configs.
   */
  interface DeleteDialogDeprecatedConfig extends DialogV2.ConfirmConfig, IntentionalPartial<ApplicationV2.Position> {}

  /** This interface is necessitated by the change in default `strict` behaviour and nothing else */
  interface FromImportContext<Parent extends Document.Any | null> extends Omit<
    Document.ConstructionContext<Parent>,
    "strict"
  > {
    /**
     * Strict validation is enabled by default.
     * @defaultValue `true`
     * @remarks Not allowed to be `undefined` as that would produce `false`, not the expected default of `true`, due to being spread
     * into an object with `strict: true`, then passed to {@linkcode Document.fromSource}, where the parameter default is `false`
     */
    strict?: boolean;
  }

  type Clone<This extends Document.Any, Save extends boolean | undefined> = Save extends true ? Promise<This> : This;

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
   * @deprecated This type should not be used directly. Use `InvalidForName` as this type does not account for anything declaration merged
   * into `Invalid`.
   */
  type Invalid<D extends Document.Any> = Document.Internal.Invalid<D>;

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
   * @deprecated This type has been deprecated because of the inconsistent casing of "Subtype" instead of "SubType". Use
   * {@linkcode Document.ModuleSubType} instead.
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

  // These types only exists to simplify solving the `Document` type. Using `Document.Flags<this>` means the constraint
  // `this extends Document.Any` has to be proved. This is much more complex than proving the constraint for
  // `Document.FlagsInternal<Schema>` that `Schema extends DataSchema`.

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

  type TemporaryIfForName<Name extends Document.Type, Temporary extends boolean | undefined> =
    | (Name extends "ActiveEffect" ? ActiveEffect.TemporaryIf<Temporary> : never)
    | (Name extends "ActorDelta" ? ActorDelta.TemporaryIf<Temporary> : never)
    | (Name extends "Actor" ? Actor.TemporaryIf<Temporary> : never)
    | (Name extends "Adventure" ? Adventure.TemporaryIf<Temporary> : never)
    | (Name extends "AmbientLight" ? AmbientLightDocument.TemporaryIf<Temporary> : never)
    | (Name extends "AmbientSound" ? AmbientSoundDocument.TemporaryIf<Temporary> : never)
    | (Name extends "Card" ? Card.TemporaryIf<Temporary> : never)
    | (Name extends "Cards" ? Cards.TemporaryIf<Temporary> : never)
    | (Name extends "ChatMessage" ? ChatMessage.TemporaryIf<Temporary> : never)
    | (Name extends "Combat" ? Combat.TemporaryIf<Temporary> : never)
    | (Name extends "Combatant" ? Combatant.TemporaryIf<Temporary> : never)
    | (Name extends "CombatantGroup" ? CombatantGroup.TemporaryIf<Temporary> : never)
    | (Name extends "Drawing" ? DrawingDocument.TemporaryIf<Temporary> : never)
    | (Name extends "FogExploration" ? FogExploration.TemporaryIf<Temporary> : never)
    | (Name extends "Folder" ? Folder.TemporaryIf<Temporary> : never)
    | (Name extends "Item" ? Item.TemporaryIf<Temporary> : never)
    | (Name extends "JournalEntryCategory" ? JournalEntryCategory.TemporaryIf<Temporary> : never)
    | (Name extends "JournalEntryPage" ? JournalEntryPage.TemporaryIf<Temporary> : never)
    | (Name extends "JournalEntry" ? JournalEntry.TemporaryIf<Temporary> : never)
    | (Name extends "Macro" ? Macro.TemporaryIf<Temporary> : never)
    | (Name extends "MeasuredTemplate" ? MeasuredTemplateDocument.TemporaryIf<Temporary> : never)
    | (Name extends "Note" ? NoteDocument.TemporaryIf<Temporary> : never)
    | (Name extends "PlaylistSound" ? PlaylistSound.TemporaryIf<Temporary> : never)
    | (Name extends "Playlist" ? Playlist.TemporaryIf<Temporary> : never)
    | (Name extends "RegionBehavior" ? RegionBehavior.TemporaryIf<Temporary> : never)
    | (Name extends "Region" ? RegionDocument.TemporaryIf<Temporary> : never)
    | (Name extends "RollTable" ? RollTable.TemporaryIf<Temporary> : never)
    | (Name extends "Scene" ? Scene.TemporaryIf<Temporary> : never)
    | (Name extends "Setting" ? Setting.TemporaryIf<Temporary> : never)
    | (Name extends "TableResult" ? TableResult.TemporaryIf<Temporary> : never)
    | (Name extends "Tile" ? TileDocument.TemporaryIf<Temporary> : never)
    | (Name extends "Token" ? TokenDocument.TemporaryIf<Temporary> : never)
    | (Name extends "User" ? User.TemporaryIf<Temporary> : never)
    | (Name extends "Wall" ? WallDocument.TemporaryIf<Temporary> : never);

  /**
   * @deprecated This type is being retired, if you have a document class reference, use
   * {@linkcode ImplementationClassFor | Document.ImplementationClassFor<Cls["documentName"]>} instead. This type will be removed in v15.
   */
  type ToConfiguredClass<ConcreteDocument extends Document.Internal.Constructor> = ImplementationClassFor<
    NameFor<ConcreteDocument>
  >;

  /**
   * @deprecated This type is being retired, if you have a document class reference, use
   * {@linkcode ImplementationFor | Document.ImplementationFor<Cls["documentName"]>} instead. This type will be removed in v15.
   */
  type ToConfiguredInstance<ConcreteDocument extends Document.Internal.Constructor> = ImplementationFor<
    NameFor<ConcreteDocument>
  >;

  /**
   * @deprecated This has been removed without replacement. If you have a need for it please let us know.
   */
  type ConfiguredCollectionClass<Name extends Document.Type> = Document.Internal.ConfiguredCollectionClass<Name>;

  /**
   * @deprecated This has been removed without replacement. If you have a need for it please let us know.
   */
  type ConfiguredCollection<Name extends Document.Type> = Document.Internal.ConfiguredCollection<Name>;
}
