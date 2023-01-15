import {
  ConfiguredDocumentClass,
  ConstructorDataType,
  DocumentConstructor,
  DocumentType
} from "../../../types/helperTypes";
import type { AnySchemaField } from "../data/fields.mjs.js";
import type { LogCompatibilityWarningOptions } from "../utils/logging.mjs";
import DataModel from "./data.mjs";
import EmbeddedCollection from "./embedded-collection.mjs";

export type AnyDocument = Document<any, any, any, any, any>;
export type AnyChildDocument<Parent extends AnyDocument | null> = Document<any, any, any, any, Parent>;

export default Document;
/**
 * An extension of the base DataModel which defines a Document.
 * Documents are special in that they are persisted to the database and referenced by _id.
 */
declare abstract class Document<
  Schema extends AnySchemaField,
  SourceData extends { flags: Record<string, unknown> },
  ConstructorData extends SourceData = SourceData,
  ConcreteMetadata extends AnyMetadata = AnyMetadata,
  Parent extends AnyDocument | null = null
> extends DataModel<Schema, SourceData, ConstructorData, Parent> {
  /**
   * @param data    - Initial data provided to construct the Document
   * @param context - Construction context options
   */
  constructor(data?: ConstructorData, context?: DocumentConstructionContext);

  override parent: Parent;

  protected override _configure(options?: { pack?: string | null } | undefined): void;

  /**
   * An immutable reference to a containing Compendium collection to which this Document belongs.
   */
  readonly pack: string | null;

  readonly collections: Record<string, EmbeddedCollection<ConstructorOf<AnyDocument>, this>>;

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
   *   preserveOnImport: ["_id", "sort", "ownership"]
   * }
   * ```
   */
  static metadata: Metadata<any>;

  /**
   * The database backend used to execute operations and handle results
   */
  static get database(): CONFIG["DatabaseBackend"];

  /**
   * Return a reference to the implemented subclass of this base document type.
   */
  // Referencing the concrete class the config is not possible because accessors cannot be generic and there is not
  // static polymorphic this type
  static get implementation(): ConstructorOf<AnyDocument>;

  /**
   * The named collection to which this Document belongs.
   */
  static get collectionName(): string;

  /**
   * The named collection to which this Document belongs.
   */
  get collectionName(): ConcreteMetadata["collection"];

  /**
   * The canonical name of this Document type, for example "Actor".
   */
  static get documentName(): string;

  /**
   * The canonical name of this Document type, for example "Actor".
   */
  get documentName(): ConcreteMetadata["name"];

  /**
   * Does this Document definition include a SystemDataField?
   */
  static get hasSystemData(): boolean;

  /**
   * The canonical identifier for this Document
   */
  get id(): string | null;

  /**
   * Test whether this Document is embedded within a parent Document
   */
  get isEmbedded(): boolean;

  /**
   * Test whether a given User has a sufficient role in order to create Documents of this type in general.
   * @param user - The User being tested
   * @returns Does the User have a sufficient role to create?
   */
  static canUserCreate(user: foundry.documents.BaseUser): boolean;

  /**
   * Get the permission level that a specific User has over this Document, a value in CONST.DOCUMENT_OWNERSHIP_LEVELS.
   * @param user - The User being tested
   * @returns A numeric permission level from CONST.DOCUMENT_OWNERSHIP_LEVELS or null
   */
  getUserLevel(user: foundry.documents.BaseUser): foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | null;

  /**
   * Test whether a certain User has a requested permission level (or greater) over the Document
   * @param user       - The User being tested
   * @param permission - The permission level from DOCUMENT_PERMISSION_LEVELS to test
   * @param options    - Additional options involved in the permission test
   * @returns Does the user have this permission level over the Document?
   */
  testUserPermission(
    user: foundry.documents.BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    {
      exact
    }?: {
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact?: boolean;
    }
  ): boolean;

  /**
   * Test whether a given User has permission to perform some action on this Document
   * @param user   - The User attempting modification
   * @param action - The attempted action
   * @param data   - Data involved in the attempted action
   *                 (default: `{}`)
   * @returns Does the User have permission?
   */
  canUserModify(user: foundry.documents.BaseUser, action: "create" | "update" | "delete", data?: object): boolean;

  /**
   * Clone a document, creating a new document by combining current data with provided overrides.
   * The cloned document is ephemeral and not yet saved to the database.
   * @param data    - Additional data which overrides current document data at the time of creation
   * @param context - Additional context options passed to the create method
   * @returns The cloned Document instance
   */
  override clone(
    data?: DeepPartial<ConstructorData>,
    {
      save,
      ...context
    }?: {
      /**
       * Save the clone to the World database?
       * @defaultValue `false`
       */
      save?: boolean;

      /**
       * Keep the same ID of the original document
       * @defaultValue `false`
       */
      keepId?: boolean;
    } & DocumentConstructionContext
  ): this | Promise<this>;

  /**
   * For Documents which include game system data, migrate the system data object to conform to its latest data model.
   * The data model is defined by the template.json specification included by the game system.
   * @returns The migrated system data object
   */
  migrateSystemData(): object;

  /**
   * Create multiple Documents using provided input data.
   * Data is provided as an array of objects where each individual object becomes one new Document.
   *
   * @param data    - An array of data objects used to create multiple documents
   *                  (default: `[]`)
   * @param context - Additional context which customizes the creation workflow
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
   * const created = await Item.createDocuments(data, {parent: actor});this
   * ```
   *
   * @example Create a Document within a Compendium pack
   * ```typescript
   * const data = [{name: "Compendium Actor", type: "character", img: "path/to/profile.jpg"}];
   * const created = await Actor.createDocuments(data, {pack: "mymodule.mypack"});
   * ```
   */
  static createDocuments<T extends DocumentConstructor>(
    this: T,
    data: Array<
      ConstructorDataType<InstanceType<T>> | (ConstructorDataType<InstanceType<T>> & Record<string, unknown>)
    >,
    context: DocumentModificationContext & { temporary: false }
  ): Promise<StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>[]>;
  static createDocuments<T extends DocumentConstructor>(
    this: T,
    data: Array<
      ConstructorDataType<InstanceType<T>> | (ConstructorDataType<InstanceType<T>> & Record<string, unknown>)
    >,
    context: DocumentModificationContext & { temporary: boolean }
  ): Promise<InstanceType<ConfiguredDocumentClass<T>>[]>;
  static createDocuments<T extends DocumentConstructor>(
    this: T,
    data?: Array<
      ConstructorDataType<InstanceType<T>> | (ConstructorDataType<InstanceType<T>> & Record<string, unknown>)
    >,
    context?: DocumentModificationContext
  ): Promise<StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>[]>;

  /**
   * Update multiple Document instances using provided differential data.
   * Data is provided as an array of objects where each individual object updates one existing Document.
   *
   * @param updates - An array of differential data objects, each used to update a single Document
   *                  (default: `[]`)
   * @param context - Additional context which customizes the update workflow
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
   */
  static updateDocuments<T extends DocumentConstructor>(
    this: T,
    updates?: Array<
      DeepPartial<
        ConstructorDataType<InstanceType<T>> | (ConstructorDataType<InstanceType<T>> & Record<string, unknown>)
      >
    >,
    context?: DocumentModificationContext & foundry.utils.MergeObjectOptions
  ): Promise<InstanceType<ConfiguredDocumentClass<T>>[]>;

  /**
   * Delete one or multiple existing Documents using an array of provided ids.
   * Data is provided as an array of string ids for the documents to delete.
   *
   * @param ids - An array of string ids for the documents to be deleted
   *              (default: `[]`)
   * @param context - Additional context which customizes the update workflow
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
   */
  static deleteDocuments<T extends DocumentConstructor>(
    this: T,
    ids?: string[],
    context?: DocumentModificationContext
  ): Promise<InstanceType<ConfiguredDocumentClass<T>>[]>;

  /**
   * Create a new Document using provided input data, saving it to the database.
   * @see {@link Document.createDocuments}
   * @param data    - Initial data used to create this Document
   * @param context - Additional context which customizes the creation workflow
   *                  (default: `{}`)
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
   * @remarks If no document has actually been created, the returned {@link Promise} resolves to `undefined`.
   */
  static create<T extends DocumentConstructor>(
    this: T,
    data: ConstructorDataType<InstanceType<T>> | (ConstructorDataType<InstanceType<T>> & Record<string, unknown>),
    context: DocumentModificationContext & { temporary: false }
  ): Promise<StoredDocument<InstanceType<ConfiguredDocumentClass<T>>> | undefined>;
  static create<T extends DocumentConstructor>(
    this: T,
    data: ConstructorDataType<InstanceType<T>> | (ConstructorDataType<InstanceType<T>> & Record<string, unknown>),
    context: DocumentModificationContext & { temporary: boolean }
  ): Promise<InstanceType<ConfiguredDocumentClass<T>> | undefined>;
  static create<T extends DocumentConstructor>(
    this: T,
    data: ConstructorDataType<InstanceType<T>> | (ConstructorDataType<InstanceType<T>> & Record<string, unknown>),
    context?: DocumentModificationContext
  ): Promise<StoredDocument<InstanceType<ConfiguredDocumentClass<T>>> | undefined>;

  /**
   * Update this Document using incremental data, saving it to the database.
   * @see {@link Document.updateDocuments}
   * @param data    - Differential update data which modifies the existing values of this document data
   *                  (default: `{}`)
   * @param context - Additional context which customizes the update workflow
   *                  (default: `{}`)
   * @returns The updated Document instance
   *
   * @remarks If no document has actually been updated, the returned {@link Promise} resolves to `undefined`.
   */
  override update(
    data?: DeepPartial<ConstructorData | (ConstructorData & Record<string, unknown>)>,
    context?: DocumentModificationContext & foundry.utils.MergeObjectOptions
  ): Promise<this | undefined>;

  /**
   * Delete this Document, removing it from the database.
   * @see {@link Document.deleteDocuments}
   * @param context - Additional context which customizes the deletion workflow
   *                  (default: `{}`)
   * @returns The deleted Document instance
   *
   * @remarks If no document has actually been deleted, the returned {@link Promise} resolves to `undefined`.
   */
  delete(context?: DocumentModificationContext): Promise<this | undefined>;

  /**
   * Get a World-level Document of this type by its id.
   * @param documentId - The Document ID
   * @returns The retrieved Document, or null
   */
  static get(documentId: string): AnyDocument | null;

  /**
   * Obtain a reference to the Array of source data within the data object for a certain embedded Document name
   * @param embeddedName - The name of the embedded Document type
   * @returns The Collection instance of embedded Documents of the requested type
   */
  getEmbeddedCollection(embeddedName: string): EmbeddedCollection<ConstructorOf<AnyDocument>, this>; // TODO: Improve

  /**
   * Get an embedded document by it's id from a named collection in the parent document.
   * @param embeddedName - The name of the embedded Document type
   * @param id           - The id of the child document to retrieve
   * @param options      - Additional options which modify how embedded documents are retrieved
   * @returns The retrieved embedded Document instance, or undefined
   */
  getEmbeddedDocument(
    embeddedName: string,
    id: string,
    {
      strict
    }?: {
      /**
       * Throw an Error if the requested id does not exist. See Collection#get
       * @defaultValue `false`
       */
      strict?: boolean;
    }
  ): AnyChildDocument<this> | undefined;

  /**
   * Create multiple embedded Document instances within this parent Document using provided input data.
   * @see {@link Document.createDocuments}
   * @param embeddedName - The name of the embedded Document type
   * @param data         - An array of data objects used to create multiple documents
   *                       (default: `[]`)
   * @param context      - Additional context which customizes the creation workflow
   *                       (default: `{}`)
   * @returns An array of created Document instances
   */
  createEmbeddedDocuments(
    embeddedName: string,
    data: Array<Record<string, unknown>>,
    context: DocumentModificationContext & { temporary: false }
  ): Promise<Array<StoredDocument<AnyChildDocument<this>>>>;
  createEmbeddedDocuments(
    embeddedName: string,
    data: Array<Record<string, unknown>>,
    context: DocumentModificationContext & { temporary: boolean }
  ): Promise<Array<AnyChildDocument<this>>>;
  createEmbeddedDocuments(
    embeddedName: string,
    data: Array<Record<string, unknown>>,
    context?: DocumentModificationContext
  ): Promise<Array<StoredDocument<AnyChildDocument<this>>>>;

  /**
   * Update multiple embedded Document instances within a parent Document using provided differential data.
   * @see {@link Document.updateDocuments}
   * @param embeddedName - The name of the embedded Document type
   * @param updates      - An array of differential data objects, each used to update a single Document
   *                       (default: `[]`)
   * @param context      - Additional context which customizes the creation workflow
   *                       (default: `{}`)
   * @returns An array of updated Document instances
   */
  updateEmbeddedDocuments(
    embeddedName: string,
    updates?: Array<Record<string, unknown>>,
    context?: DocumentModificationContext
  ): Promise<Array<AnyChildDocument<this>>>;

  /**
   * Delete multiple embedded Document instances within a parent Document using provided string ids.
   * @see {@link Document.deleteDocuments}
   * @param embeddedName - The name of the embedded Document type
   * @param ids          - An array of string ids for each Document to be deleted
   * @param context      - Additional context which customizes the deletion workflow
   *                       (default: `{}`)
   * @returns An array of deleted Document instances
   */
  deleteEmbeddedDocuments(
    embeddedName: string,
    ids: Array<string>,
    context?: DocumentModificationContext
  ): Promise<Array<AnyChildDocument<this>>>;

  /**
   * Get the value of a "flag" for this document
   * See the setFlag method for more details on flags
   *
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   * @returns The flag value
   */
  getFlag<S extends keyof SourceData["flags"], K extends keyof SourceData["flags"][S]>(
    scope: S,
    key: K
  ): SourceData["flags"][S][K];
  getFlag<S extends keyof SourceData["flags"], K extends keyof Required<SourceData["flags"]>[S]>(
    scope: S,
    key: K
  ): Required<SourceData["flags"]>[S][K] | undefined;
  getFlag<S extends keyof SourceData["flags"]>(
    scope: S,
    key: string
  ): unknown extends SourceData["flags"][S] ? unknown : never;
  getFlag(scope: string, key: string): unknown;

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
  setFlag<
    S extends keyof SourceData["flags"],
    K extends keyof Required<SourceData["flags"]>[S],
    V extends Required<SourceData["flags"]>[S][K]
  >(scope: S, key: K, value: V): Promise<this>;
  setFlag<S extends keyof SourceData["flags"], K extends string>(
    scope: S,
    key: K,
    v: unknown extends SourceData["flags"][S] ? unknown : never
  ): Promise<this>;

  /**
   * Remove a flag assigned to the document
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   * @returns The updated document instance
   */
  unsetFlag(scope: string, key: string): Promise<this>;

  /**
   * Perform preliminary operations before a Document of this type is created.
   * Pre-creation operations only occur for the client which requested the operation.
   * Modifications to the pending document before it is persisted should be performed with this.updateSource().
   * @param data    - The initial data used to create the document
   * @param options - Additional options which modify the creation request
   * @param user    - The User requesting the document creation
   */
  protected _preCreate(
    data: ConstructorData,
    options: DocumentModificationOptions,
    user: foundry.documents.BaseUser
  ): Promise<void>;

  /**
   * Perform preliminary operations before a Document of this type is updated.
   * Pre-update operations only occur for the client which requested the operation.
   * @param changed - The differential data that is changed relative to the documents prior values
   * @param options - Additional options which modify the update request
   * @param user    - The User requesting the document update
   */
  protected _preUpdate(
    changed: DeepPartial<ConstructorData>,
    options: DocumentModificationOptions,
    user: foundry.documents.BaseUser
  ): Promise<void>;

  /**
   * Perform preliminary operations before a Document of this type is deleted.
   * Pre-delete operations only occur for the client which requested the operation.
   * @param options - Additional options which modify the deletion request
   * @param user    - The User requesting the document deletion
   */
  protected _preDelete(options: DocumentModificationOptions, user: foundry.documents.BaseUser): Promise<void>;

  /**
   * Perform follow-up operations after a Document of this type is created.
   * Post-creation operations occur for all clients after the creation is broadcast.
   * @param data    - The data from which the document was created
   * @param options - Additional options which modify the creation request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onCreate(data: SourceData, options: DocumentModificationOptions, userId: string): void;

  /**
   * Perform follow-up operations after a Document of this type is updated.
   * Post-update operations occur for all clients after the update is broadcast.
   * @param changed - The differential data that was changed relative to the documents prior values
   * @param options - Additional options which modify the update request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onUpdate(changed: DeepPartial<SourceData>, options: DocumentModificationOptions, userId: string): void;

  /**
   * Perform follow-up operations after a Document of this type is deleted.
   * Post-deletion operations occur for all clients after the deletion is broadcast.
   * @param options - Additional options which modify the deletion request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onDelete(options: DocumentModificationOptions, userId: string): void;

  /**
   * Perform follow-up operations when a set of Documents of this type are created.
   * This is where side effects of creation should be implemented.
   * Post-creation side effects are performed only for the client which requested the operation.
   * @param documents - The Document instances which were created
   * @param context   - The context for the modification operation
   *
   * @remarks The base implementation returns `void` but it is typed as
   * `unknown` to allow deriving classes to return whatever they want. The
   * return type is not meant to be used.
   */
  protected static _onCreateDocuments<T extends DocumentConstructor>(
    this: T,
    documents: Array<InstanceType<ConfiguredDocumentClass<T>>>,
    context: DocumentModificationContext
  ): Promise<unknown>;

  /**
   * Perform follow-up operations when a set of Documents of this type are updated.
   * This is where side effects of updates should be implemented.
   * Post-update side effects are performed only for the client which requested the operation.
   * @param documents - The Document instances which were updated
   * @param context   - The context for the modification operation
   *
   * @remarks The base implementation returns `void` but it is typed as
   * `unknown` to allow deriving classes to return whatever they want. The
   * return type is not meant to be used.
   */
  protected static _onUpdateDocuments<T extends DocumentConstructor>(
    this: T,
    documents: Array<InstanceType<ConfiguredDocumentClass<T>>>,
    context: DocumentModificationContext
  ): Promise<unknown>;

  /**
   * Perform follow-up operations when a set of Documents of this type are deleted.
   * This is where side effects of deletion should be implemented.
   * Post-deletion side effects are performed only for the client which requested the operation.
   * @param documents - The Document instances which were deleted
   * @param context   - The context for the modification operation
   *
   * @remarks The base implementation returns `void` but it is typed as
   * `unknown` to allow deriving classes to return whatever they want. The
   * return type is not meant to be used.
   */
  protected static _onDeleteDocuments<T extends DocumentConstructor>(
    this: T,
    documents: Array<InstanceType<ConfiguredDocumentClass<T>>>,
    context: DocumentModificationContext
  ): Promise<unknown>;

  /**
   * Configure whether V10 Document Model migration warnings should be logged for this class.
   */
  static LOG_V10_COMPATIBILITY_WARNINGS: boolean;

  /**
   * @deprecated since v10
   */
  get data(): unknown;

  override toObject(source: true): this["_source"];
  override toObject(source?: boolean | undefined): ReturnType<this["schema"]["toObject"]>;

  /**
   * A reusable helper for adding migration shims.
   */
  protected static _addDataFieldShims(data: object, shims: object, options: object): unknown;

  /**
   * A reusable helper for adding a migration shim
   */
  protected static _addDataFieldShim(data: object, oldKey: string, newKey: string, options?: object): unknown;

  /**
   * Define a simple migration from one field name to another.
   * The value of the data can be transformed during the migration by an optional application function.
   * @param data   - The data object being migrated
   * @param oldKey - The old field name
   * @param newKey - The new field name
   * @param apply  - An application function, otherwise the old value is applied
   * @internal
   */
  protected static _addDataFieldMigration(
    data: object,
    oldKey: string,
    newKey: string,
    apply?: (data: object) => any
  ): unknown;

  protected static _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions
  ): void;

  protected static _logV10CompatibilityWarning(options?: LogCompatibilityWarningOptions): void;
}

export type DocumentModificationOptions = Omit<DocumentModificationContext, "parent" | "pack">;

export interface Context<Parent extends AnyDocument | null> {
  /**
   * A parent document within which this Document is embedded
   */
  parent?: Parent;

  /**
   * A named compendium pack within which this Document exists
   */
  pack?: string;
}

export type AnyMetadata = Metadata<AnyDocument>;

export interface Metadata<ConcreteDocument extends AnyDocument> {
  name: DocumentType;
  collection: string;
  indexed: boolean;
  compendiumIndexFields: string[];
  label: string;
  coreTypes: string[];
  embedded: Record<string, ConstructorOf<AnyDocument>>;
  permissions: {
    create:
      | string
      | ((user: foundry.documents.BaseUser, doc: ConcreteDocument, data: ConcreteDocument["_source"]) => boolean);
    update: string | ((user: foundry.documents.BaseUser, doc: ConcreteDocument, data: object) => boolean);
    delete: string | ((user: foundry.documents.BaseUser, doc: ConcreteDocument, data: {}) => boolean);
  };
  preserveOnImport: string[];

  labelPlural: string; // This is not set for the Document class but every class that implements Document actually provides it.
  types: readonly string[];
  hasSystemData: boolean;
  pack: any;
}

export interface DocumentMetadata {
  name: "Document";
  collection: "documents";
  label: "DOCUMENT.Document";
  types: [];
  embedded: {};
  hasSystemData: false;
  permissions: {
    create: "ASSISTANT";
    update: "ASSISTANT";
    delete: "ASSISTANT";
  };
  pack: null;
}
