import { BaseUser } from "../documents.mjs";
import { AnyDocumentData } from "./data.mjs";
import {
  ConfiguredDocumentClass,
  DocumentConstructor,
  ToObjectFalseType,
  DocumentType,
  ConstructorDataType
} from "../../../types/helperTypes";
import EmbeddedCollection from "./embedded-collection.mjs";

type ParentType<T extends Document<any, any>> = T extends Document<any, infer U> ? U : never;
export type ContextType<T extends Document<any, any>> = Context<ParentType<T>>;
export type DocumentDataType<T extends Document<any, any>> = T extends Document<infer U, any> ? U : never;

/**
 * The abstract base class shared by both client and server-side which defines the model for a single document type.
 */
declare abstract class Document<
  ConcreteDocumentData extends AnyDocumentData,
  Parent extends Document<any, any> | null = null,
  ConcreteMetadata extends Metadata<any> = Metadata<any>
> {
  /**
   * Create a new Document by providing an initial data object.
   * @param data    - Initial data provided to construct the Document
   * @param context - Additional parameters which define Document context
   */
  constructor(data?: ConstructorDataType<ConcreteDocumentData>, context?: Context<Parent>);

  /**
   * An immutable reverse-reference to the parent Document to which this embedded Document belongs.
   */
  readonly parent: Parent | null;

  /**
   * An immutable reference to a containing Compendium collection to which this Document belongs.
   */
  readonly pack: string | null;

  /**
   * The base data object for this Document which persists both the original source and any derived data.
   */
  readonly data: ConcreteDocumentData;

  /**
   * Perform one-time initialization tasks which only occur when the Document is first constructed.
   */
  protected _initialize(): void;

  /**
   * Every document must define an object which represents its data schema.
   * This must be a subclass of the DocumentData interface.
   *
   * @remarks
   * This method is abstract and needs to be implemented by inheriting classes.
   */
  static get schema(): ConstructorOf<AnyDocumentData>;

  /**
   * Default metadata which applies to each instance of this Document type.
   * @defaultValue
   * ```typescript
   * {
   *   name: "Document",
   *   collection: "documents",
   *   label: "DOCUMENT.Document",
   *   types: [],
   *   embedded: {},
   *   hasSystemData: false,
   *   permissions: {
   *     create: "ASSISTANT",
   *     update: "ASSISTANT",
   *     delete: "ASSISTANT"
   *   },
   *   pack: null
   * }
   * ```
   */
  static get metadata(): Metadata<any>;

  /**
   * The database backend used to execute operations and handle results
   */
  static get database(): CONFIG["DatabaseBackend"];

  /**
   * Return a reference to the implemented subclass of this base document type.
   */
  static get implementation(): ConstructorOf<Document<any, any>>; // Referencing the concrete class the config is not possible because accessors cannot be generic and there is not static polymorphic this type

  /**
   * The named collection to which this Document belongs.
   */
  static get collectionName(): string;

  /**
   * The canonical name of this Document type, for example "Actor".
   */
  static get documentName(): string;

  /**
   * The named collection to which this Document belongs.
   */
  get collectionName(): ConcreteMetadata["collection"];

  /**
   * The canonical name of this Document type, for example "Actor".
   */
  get documentName(): ConcreteMetadata["name"];

  /**
   * The canonical identifier for this Document
   */
  get id(): string | null;

  /**
   * Test whether this Document is embedded within a parent Document
   */
  get isEmbedded(): boolean;

  /**
   * The name of this Document, if it has one assigned
   */
  get name(): string | null;

  /**
   * Test whether a given User has a sufficient role in order to create Documents of this type in general.
   * @param user - The User being tested
   * @returns Does the User have a sufficient role to create?
   */
  static canUserCreate(user: BaseUser): boolean;

  /**
   * Clone a document, creating a new document by combining current data with provided overrides.
   * The cloned document is ephemeral and not yet saved to the database.
   * @param data   - Additional data which overrides current document data at the time of creation
   *                 (default: `{}`)
   * @param save   - Save the clone to the World database?
   *                 (default: `false`)
   * @param context - Additional context options passed to the create method
   *                 (default: `{}`)
   * @returns The cloned Document instance
   */
  clone(
    data?: DeepPartial<
      ConstructorDataType<ConcreteDocumentData> | (ConstructorDataType<ConcreteDocumentData> & Record<string, unknown>)
    >,
    { save, ...context }?: { save: boolean } & DocumentModificationContext
  ): TemporaryDocument<this> | Promise<TemporaryDocument<this> | undefined>;

  /**
   * Get the permission level that a specific User has over this Document, a value in CONST.DOCUMENT_OWNERSHIP_LEVELS.
   * @param user - The User being tested
   * @returns A numeric permission level from CONST.DOCUMENT_OWNERSHIP_LEVELS or null
   */
  getUserLevel(user: BaseUser): foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | null;

  /**
   * Test whether a certain User has a requested permission level (or greater) over the Document
   * @param user       - The User being tested
   * @param permission - The permission level from DOCUMENT_PERMISSION_LEVELS to test
   * @param exact      - Require the exact permission level requested?
   *                     (default: `false`)
   * @returns Does the user have this permission level over the Document?
   */
  testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    { exact }?: { exact?: boolean }
  ): boolean;

  /**
   * Test whether a given User has permission to perform some action on this Document
   * @param user   - The User attempting modification
   * @param action - The attempted action
   * @param data   - Data involved in the attempted action
   *                 (default: `{}`)
   * @returns  Does the User have permission?
   */
  canUserModify(user: BaseUser, action: "create" | "update" | "delete", data?: object): boolean;

  /**
   * Create multiple Documents using provided input data.
   * Data is provided as an array of objects where each individual object becomes one new Document.
   *
   * @param data    - An array of data objects used to create multiple documents
   *                  (default: `[]`)
   * @param context - Additional context which customizes the creation workflow
   *                  (default: `{}`)
   * @returns An array of created Document instances
   *Additional context which customizes the creation workflow
   * @example <caption>Create a single Document</caption>
   * ```typescript
   * const data = [{name: "New Actor", type: "character", img: "path/to/profile.jpg"}];
   * const created = await Actor.createDocuments(data);
   * ```
   *
   * @example <caption>Create multiple Documents</caption>
   * ```typescript
   * const data = [{name: "Tim", type: "npc"], [{name: "Tom", type: "npc"}];
   * const created = await Actor.createDocuments(data);
   * ```
   *
   * @example <caption>Create multiple embedded Documents within a parent</caption>
   * ```typescript
   * const actor = game.actors.getName("Tim");
   * const data = [{name: "Sword", type: "weapon"}, {name: "Breastplate", type: "equipment"}];
   * const created = await Item.createDocuments(data, {parent: actor});this
   * ```
   *
   * @example <caption>Create a Document within a Compendium pack</caption>
   * ```typescript
   * const data = [{name: "Compendium Actor", type: "character", img: "path/to/profile.jpg"}];
   * const created = await Actor.createDocuments(data, {pack: "mymodule.mypack"});
   * ```
   */
  static createDocuments<T extends DocumentConstructor>(
    this: T,
    data: Array<
      | ConstructorDataType<InstanceType<T>["data"]>
      | (ConstructorDataType<InstanceType<T>["data"]> & Record<string, unknown>)
    >,
    context: DocumentModificationContext & { temporary: false }
  ): Promise<StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>[]>;
  static createDocuments<T extends DocumentConstructor>(
    this: T,
    data: Array<
      | ConstructorDataType<InstanceType<T>["data"]>
      | (ConstructorDataType<InstanceType<T>["data"]> & Record<string, unknown>)
    >,
    context: DocumentModificationContext & { temporary: boolean }
  ): Promise<InstanceType<ConfiguredDocumentClass<T>>[]>;
  static createDocuments<T extends DocumentConstructor>(
    this: T,
    data?: Array<
      | ConstructorDataType<InstanceType<T>["data"]>
      | (ConstructorDataType<InstanceType<T>["data"]> & Record<string, unknown>)
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
   * @example <caption>Update a single Document</caption>
   * ```typescript
   * const updates = [{_id: "12ekjf43kj2312ds", name: "Timothy"}];
   * const updated = await Actor.updateDocuments(updates);
   * ```
   *
   * @example <caption>Update multiple Documents</caption>
   * ```typescript
   * const updates = [{_id: "12ekjf43kj2312ds", name: "Timothy"}, {_id: "kj549dk48k34jk34", name: "Thomas"}]};
   * const updated = await Actor.updateDocuments(updates);
   * ```
   *
   * @example <caption>Update multiple embedded Documents within a parent</caption>
   * ```typescript
   * const actor = game.actors.getName("Timothy");
   * const updates = [{_id: sword.id, name: "Magic Sword"}, {_id: shield.id, name: "Magic Shield"}];
   * const updated = await Item.updateDocuments(updates, {parent: actor});
   * ```
   *
   * @example <caption>Update Documents within a Compendium pack</caption>
   * ```typescript
   * const actor = await pack.getDocument(documentId);
   * const updated = await Actor.updateDocuments([{_id: actor.id, name: "New Name"}], {pack: "mymodule.mypack"});
   * ```
   */
  static updateDocuments<T extends DocumentConstructor>(
    this: T,
    updates?: Array<
      DeepPartial<
        | ConstructorDataType<InstanceType<T>["data"]>
        | (ConstructorDataType<InstanceType<T>["data"]> & Record<string, unknown>)
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
   * @example <caption>Delete a single Document</caption>
   * ```typescript
   * const tim = game.actors.getName("Tim");
   * const deleted = await Actor.deleteDocuments([tim.id]);
   * ```
   *
   * @example <caption>Delete multiple Documents</caption>
   * ```typescript
   * const tim = game.actors.getName("Tim");
   * const tom = game.actors.getName("Tom");
   * const deleted = await Actor.deleteDocuments([tim.id, tom.id]);
   * ```
   *
   * @example <caption>Delete multiple embedded Documents within a parent</caption>
   * ```typescript
   * const tim = game.actors.getName("Tim");
   * const sword = tim.items.getName("Sword");
   * const shield = tim.items.getName("Shield");
   * const deleted = await Item.deleteDocuments([sword.id, shield.id], parent: actor});
   * ```
   *
   * @example <caption>Delete Documents within a Compendium pack</caption>
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
   * @example <caption>Create a World-level Item</caption>
   * ```typescript
   * const data = [{name: "Special Sword", type: "weapon"}];
   * const created = await Item.create(data);
   * ```
   *
   * @example <caption>Create an Actor-owned Item</caption>
   * ```typescript
   * const data = [{name: "Special Sword", type: "weapon"}];
   * const actor = game.actors.getName("My Hero");
   * const created = await Item.create(data, {parent: actor});
   * ```
   *
   * @example <caption>Create an Item in a Compendium pack</caption>
   * ```typescript
   * const data = [{name: "Special Sword", type: "weapon"}];
   * const created = await Item.create(data, {pack: "mymodule.mypack"});
   * ```
   *
   * @remarks If no document has actually been created, the returned {@link Promise} resolves to `undefined`.
   */
  static create<T extends DocumentConstructor>(
    this: T,
    data:
      | ConstructorDataType<InstanceType<T>["data"]>
      | (ConstructorDataType<InstanceType<T>["data"]> & Record<string, unknown>),
    context: DocumentModificationContext & { temporary: false }
  ): Promise<StoredDocument<InstanceType<ConfiguredDocumentClass<T>>> | undefined>;
  static create<T extends DocumentConstructor>(
    this: T,
    data:
      | ConstructorDataType<InstanceType<T>["data"]>
      | (ConstructorDataType<InstanceType<T>["data"]> & Record<string, unknown>),
    context: DocumentModificationContext & { temporary: boolean }
  ): Promise<InstanceType<ConfiguredDocumentClass<T>> | undefined>;
  static create<T extends DocumentConstructor>(
    this: T,
    data:
      | ConstructorDataType<InstanceType<T>["data"]>
      | (ConstructorDataType<InstanceType<T>["data"]> & Record<string, unknown>),
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
  update(
    data?: DeepPartial<
      ConstructorDataType<ConcreteDocumentData> | (ConstructorDataType<ConcreteDocumentData> & Record<string, unknown>)
    >,
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
   * Obtain a reference to the Array of source data within the data object for a certain embedded Document name
   * @param embeddedName - The name of the embedded Document type
   * @returns The Collection instance of embedded Documents of the requested type
   */
  getEmbeddedCollection(embeddedName: string): EmbeddedCollection<DocumentConstructor, AnyDocumentData>; // TODO: Improve

  /**
   * Get an embedded document by it's id from a named collection in the parent document.
   * @param embeddedName - The name of the embedded Document type
   * @param id           - The id of the child document to retrieve
   * @param options      - Additional options which modify how embedded documents are retrieved
   * @param strict       - Throw an Error if the requested id does not exist. See Collection#get
   *                       (default: `false`)
   * @returns The retrieved embedded Document instance, or undefined
   */
  getEmbeddedDocument(
    embeddedName: string,
    id: string,
    { strict }?: { strict?: boolean }
  ): Document<any, this> | undefined;

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
  ): Promise<Array<StoredDocument<Document<any, this>>>>;
  createEmbeddedDocuments(
    embeddedName: string,
    data: Array<Record<string, unknown>>,
    context: DocumentModificationContext & { temporary: boolean }
  ): Promise<Array<Document<any, this>>>;
  createEmbeddedDocuments(
    embeddedName: string,
    data: Array<Record<string, unknown>>,
    context?: DocumentModificationContext
  ): Promise<Array<StoredDocument<Document<any, this>>>>;

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
  ): Promise<Array<Document<any, this>>>;

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
  ): Promise<Array<Document<any, this>>>;

  /**
   * Get the value of a "flag" for this document
   * See the setFlag method for more details on flags
   *
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   * @returns The flag value
   */
  getFlag<
    S extends keyof ConcreteDocumentData["_source"]["flags"],
    K extends keyof ConcreteDocumentData["_source"]["flags"][S]
  >(scope: S, key: K): ConcreteDocumentData["_source"]["flags"][S][K];
  getFlag<
    S extends keyof ConcreteDocumentData["_source"]["flags"],
    K extends keyof Required<ConcreteDocumentData["_source"]["flags"]>[S]
  >(scope: S, key: K): Required<ConcreteDocumentData["_source"]["flags"]>[S][K] | undefined;
  getFlag<S extends keyof ConcreteDocumentData["_source"]["flags"]>(
    scope: S,
    key: string
  ): unknown extends ConcreteDocumentData["_source"]["flags"][S] ? unknown : never;
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
    S extends keyof ConcreteDocumentData["_source"]["flags"],
    K extends keyof Required<ConcreteDocumentData["_source"]["flags"]>[S],
    V extends Required<ConcreteDocumentData["_source"]["flags"]>[S][K]
  >(scope: S, key: K, value: V): Promise<this>;
  setFlag<S extends keyof ConcreteDocumentData["_source"]["flags"], K extends string>(
    scope: S,
    key: K,
    v: unknown extends ConcreteDocumentData["_source"]["flags"][S] ? unknown : never
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
   * @param data    - The initial data used to create the document
   * @param options - Additional options which modify the creation request
   * @param user    - The User requesting the document creation
   */
  protected _preCreate(
    data: ConstructorDataType<ConcreteDocumentData>,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void>;

  /**
   * Perform preliminary operations before a Document of this type is updated.
   * Pre-update operations only occur for the client which requested the operation.
   * @param changed - The differential data that is changed relative to the documents prior values
   * @param options - Additional options which modify the update request
   * @param user    - The User requesting the document update
   */
  protected _preUpdate(
    changed: DeepPartial<ConstructorDataType<ConcreteDocumentData>>,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void>;

  /**
   * Perform preliminary operations before a Document of this type is deleted.
   * Pre-delete operations only occur for the client which requested the operation.
   * @param options - Additional options which modify the deletion request
   * @param user    - The User requesting the document deletion
   */
  protected _preDelete(options: DocumentModificationOptions, user: BaseUser): Promise<void>;

  /**
   * Perform follow-up operations after a Document of this type is created.
   * Post-creation operations occur for all clients after the creation is broadcast.
   * @param data   - The data from which the document was created
   * @param options- Additional options which modify the creation request
   * @param user   - The id of the User requesting the document update
   */
  protected _onCreate(
    data: ConcreteDocumentData["_source"],
    options: DocumentModificationOptions,
    userId: string
  ): void;

  /**
   * Perform follow-up operations after a Document of this type is updated.
   * Post-update operations occur for all clients after the update is broadcast.
   * @param changed - The differential data that was changed relative to the documents prior values
   * @param options - Additional options which modify the update request
   * @param user    - The id of the User requesting the document update
   */
  protected _onUpdate(
    changed: DeepPartial<ConcreteDocumentData["_source"]>,
    options: DocumentModificationOptions,
    userId: string
  ): void;

  /**
   * Perform follow-up operations after a Document of this type is deleted.
   * Post-deletion operations occur for all clients after the deletion is broadcast.
   * @param options- Additional options which modify the deletion request
   * @param user   - The id of the User requesting the document update
   */
  protected _onDelete(options: DocumentModificationOptions, userId: string): void;

  /**
   * Perform follow-up operations when a set of Documents of this type are created.
   * This is where side effects of creation should be implemented.
   * Post-creation side effects are performed only for the client which requested the operation.
   * @param documents- The Document instances which were created
   * @param context  - The context for the modification operation
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
   * Transform the Document instance into a plain object.
   * The created object is an independent copy of the original data.
   * See DocumentData#toObject
   * @param source - Draw values from the underlying data source rather than transformed values
   * @returns The extracted primitive object
   */
  toObject(
    source?: true
  ): this["id"] extends string
    ? ReturnType<this["data"]["toJSON"]> & { _id: string }
    : ReturnType<this["data"]["toJSON"]>;
  toObject(
    source: false
  ): this["id"] extends string
    ? ToObjectFalseType<ConcreteDocumentData> & { _id: string }
    : ToObjectFalseType<ConcreteDocumentData>;

  /**
   * Convert the Document instance to a primitive object which can be serialized.
   * See DocumentData#toJSON
   * @returns The document data expressed as a plain object
   */
  toJSON(): this["id"] extends string
    ? ReturnType<this["data"]["toJSON"]> & { _id: string }
    : ReturnType<this["data"]["toJSON"]>;

  /**
   * For Documents which include game system data, migrate the system data object to conform to its latest data model.
   * The data model is defined by the template.json specification included by the game system.
   * @returns The migrated system data object
   */
  migrateSystemData(): object;
}

export type DocumentModificationOptions = Omit<DocumentModificationContext, "parent" | "pack">;

export interface Context<Parent extends Document<any, any> | null> {
  /**
   * A parent document within which this Document is embedded
   */
  parent?: Parent;

  /**
   * A named compendium pack within which this Document exists
   */
  pack?: string;
}

export interface Metadata<ConcreteDocument extends Document<any, any>> {
  name: DocumentType;
  collection: string;
  label: string;
  labelPlural: string; // This is not set for the Document class but every class that implements Document actually provides it.
  types: readonly string[];
  embedded: Record<string, ConstructorOf<Document<any, any>>>;
  hasSystemData: boolean;
  permissions: {
    create: string | ((user: BaseUser, doc: ConcreteDocument, data: ConcreteDocument["data"]["_source"]) => boolean);
    update:
      | string
      | ((
          user: BaseUser,
          doc: ConcreteDocument,
          data: DeepPartial<ConstructorDataType<ConcreteDocument["data"]>>
        ) => boolean);
    delete: string | ((user: BaseUser, doc: ConcreteDocument, data: {}) => boolean);
  };
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

export default Document;
