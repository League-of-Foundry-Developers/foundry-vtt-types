import type {
  ConfiguredDocumentClass,
  ConfiguredDocumentClassForName,
  ConstructorDataType,
  DatabaseOperationsFor,
  DocumentConstructor,
  DocumentType,
  DocumentTypeWithTypeData,
  PlaceableDocumentType,
} from "../../../types/helperTypes.mts";
import type {
  ConfiguredStoredDocument,
  DeepPartial,
  InexactPartial,
  RemoveIndexSignatures,
  StoredDocument,
} from "../../../types/utils.mts";
import type * as CONST from "../constants.mts";
import type { DataField, EmbeddedCollectionField, EmbeddedDocumentField, SchemaField } from "../data/fields.d.mts";
import type { fields } from "../data/module.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.mts";
import type { DatabaseGetOperation } from "./_types.d.mts";
import type DataModel from "./data.mts";

export default Document;

/**
 * An extension of the base DataModel which defines a Document.
 * Documents are special in that they are persisted to the database and referenced by _id.
 */
declare abstract class Document<
  Schema extends DataSchema,
  ConcreteMetadata extends AnyMetadata = AnyMetadata,
  Parent extends Document.Any | null = null,
> extends DataModel<Schema, Parent> {
  /**
   * @param data    - Initial data provided to construct the Document
   * @param context - Construction context options
   */
  constructor(data?: fields.SchemaField.InnerConstructorType<Schema>, context?: DocumentConstructionContext);

  override parent: Parent;

  protected override _configure(options?: { pack?: string | null }): void;

  /**
   * An immutable reverse-reference to the name of the collection that this Document exists in on its parent, if any.
   */
  readonly parentCollection: string | null;

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

  protected _initialize(options?: any): void;

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
  static get implementation(): DocumentConstructor;

  /**
   * The base document definition that this document class extends from.
   */
  static get baseDocument(): DocumentConstructor;

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
   * The allowed types which may exist for this Document class
   */
  static get TYPES(): string[];

  /**
   * Does this Document support additional subtypes?
   */
  static get hasTypeData(): boolean;

  /**
   * The Embedded Document hierarchy for this Document.
   */
  static get hierarchy(): Record<string, EmbeddedCollectionField<any, any> | EmbeddedDocumentField<any>>;

  /**
   * Identify the collection in a parent Document that this Document exists belongs to, if any.
   * @param parentCollection - An explicitly provided parent collection name.
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
   */
  static canUserCreate(user: foundry.documents.BaseUser): boolean;

  /**
   * Get the explicit permission level that a specific User has over this Document, a value in CONST.DOCUMENT_OWNERSHIP_LEVELS.
   * This method returns the value recorded in Document ownership, regardless of the User's role.
   * To test whether a user has a certain capability over the document, testUserPermission should be used.
   * @param user - The User being tested
   *               (default: `game.user`)
   * @returns A numeric permission level from CONST.DOCUMENT_OWNERSHIP_LEVELS or null
   */
  getUserLevel(user?: foundry.documents.BaseUser): CONST.DOCUMENT_OWNERSHIP_LEVELS | null;

  /**
   * Test whether a certain User has a requested permission level (or greater) over the Document
   * @param user       - The User being tested
   * @param permission - The permission level from DOCUMENT_PERMISSION_LEVELS to test
   * @param options    - Additional options involved in the permission test
   * @returns Does the user have this permission level over the Document?
   */
  testUserPermission(
    user: foundry.documents.BaseUser,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: InexactPartial<{
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact: boolean;
    }>,
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
  override clone<Save extends boolean = false>(
    data?: fields.SchemaField.AssignmentType<Schema, {}>,
    context?: InexactPartial<
      {
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
      } & DocumentConstructionContext
    >, // Adding StoredDocument to the return causes a recursive type error in Scene
  ): Save extends true ? Promise<this> : this;

  /**
   * For Documents which include game system data, migrate the system data object to conform to its latest data model.
   * The data model is defined by the template.json specification included by the game system.
   * @returns The migrated system data object
   */
  migrateSystemData(): object;

  override toObject(source: true): this["_source"];
  override toObject(source?: boolean): ReturnType<this["schema"]["toObject"]>;

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
   */

  static createDocuments<
    T extends Document.AnyConstructor,
    Operation extends DatabaseOperationsFor<T["metadata"]["name"], "create">,
  >(
    this: T,
    data: Array<
      | fields.SchemaField.AssignmentType<InstanceType<T>["schema"]["fields"]>
      | (fields.SchemaField.AssignmentType<InstanceType<T>["schema"]["fields"]> & Record<string, unknown>)
    >,
    operation?: InexactPartial<Omit<Operation, "data">>,
  ): Promise<MaybeTemporary<T, Operation["temporary"] extends true ? true : false> | undefined>;
  // Operation["temporary"] extends true
  //   ? Promise<InstanceType<ConfiguredDocumentClass<T>> | undefined>
  //   : Promise<ConfiguredStoredDocument<T> | undefined>;

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
   */
  static updateDocuments<T extends Document.AnyConstructor>(
    this: T,
    updates?: Array<DeepPartial<ConstructorDataType<T> | (ConstructorDataType<T> & Record<string, unknown>)>>,
    operation?: InexactPartial<Omit<DatabaseOperationsFor<InstanceType<T>["documentName"], "update">, "updates">>,
  ): Promise<InstanceType<ConfiguredDocumentClass<T>>[]>;

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
   */
  static deleteDocuments<T extends Document.AnyConstructor>(
    this: T,
    ids?: string[],
    operation?: InexactPartial<Omit<DatabaseOperationsFor<InstanceType<T>["documentName"], "delete">, "ids">>,
  ): Promise<InstanceType<ConfiguredDocumentClass<T>>[]>;

  /**
   * Create a new Document using provided input data, saving it to the database.
   * @see {@link Document.createDocuments}
   * @param data    - Initial data used to create this Document
   * @param operation - Parameters of the creation operation
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
  static create<
    T extends Document.AnyConstructor,
    const Operation extends DatabaseOperationsFor<T["metadata"]["name"], "create">,
  >(
    this: T,
    data: ConstructorDataType<T> | (ConstructorDataType<T> & Record<string, unknown>),
    operation?: InexactPartial<Omit<Operation, "data">>,
  ): Operation["temporary"] extends true
    ? Promise<InstanceType<ConfiguredDocumentClass<T>> | undefined>
    : Promise<ConfiguredStoredDocument<T> | undefined>;

  /**
   * Update this Document using incremental data, saving it to the database.
   * @see {@link Document.updateDocuments}
   * @param data      - Differential update data which modifies the existing values of this document data
   *                    (default: `{}`)
   * @param operation - Parameters of the update operation
   *                    (default: `{}`)
   * @returns The updated Document instance
   *
   * @remarks If no document has actually been updated, the returned {@link Promise} resolves to `undefined`.
   */
  override update(
    data?:
      | fields.SchemaField.AssignmentType<Schema, {}>
      | (fields.SchemaField.AssignmentType<Schema, {}> & Record<string, unknown>),
    operation?: InexactPartial<Omit<DatabaseOperationsFor<ConcreteMetadata["name"], "update">, "updates">>,
  ): Promise<this | undefined>;

  /**
   * Delete this Document, removing it from the database.
   * @see {@link Document.deleteDocuments}
   * @param operation - Parameters of the deletion operation
   *                    (default: `{}`)
   * @returns The deleted Document instance
   *
   * @remarks If no document has actually been deleted, the returned {@link Promise} resolves to `undefined`.
   */
  delete(
    operation?: InexactPartial<Omit<DatabaseOperationsFor<ConcreteMetadata["name"], "delete">, "ids">>,
  ): Promise<this | undefined>;

  /**
   * Get a World-level Document of this type by its id.
   * @param documentId - The Document ID
   * @param options    - Additional options which customize the request
   * @returns The retrieved Document, or null
   */
  static get(documentId: string, options?: InexactPartial<DatabaseGetOperation>): Document.Any | null;

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
  static getCollectionName(name: string): string | null;

  /**
   * Obtain a reference to the Array of source data within the data object for a certain embedded Document name
   * @param embeddedName - The name of the embedded Document type
   * @returns The Collection instance of embedded Documents of the requested type
   * @remarks Usually returns some form of DocumentCollection, but not always (e.g. Token["actors"])
   */
  getEmbeddedCollection<DocType extends Document.TypeName>(
    embeddedName: DocType,
  ): Collection<InstanceType<Document.ConfiguredClassForName<DocType>>>;

  /**
   * Get an embedded document by its id from a named collection in the parent document.
   * @param embeddedName - The name of the embedded Document type
   * @param id           - The id of the child document to retrieve
   * @param options      - Additional options which modify how embedded documents are retrieved
   * @returns The retrieved embedded Document instance, or undefined
   * @throws If the embedded collection does not exist, or if strict is true and the Embedded Document could not be found.
   */
  getEmbeddedDocument(
    embeddedName: string,
    id: string,
    options: InexactPartial<{
      /**
       * Throw an Error if the requested id does not exist. See Collection#get
       * @defaultValue `false`
       */
      strict: boolean;
      /**
       * Allow retrieving an invalid Embedded Document.
       * @defaultValue `false`
       */
      invalid: boolean;
    }>,
  ): Document.AnyChild<this> | undefined;

  /**
   * Create multiple embedded Document instances within this parent Document using provided input data.
   * @see {@link Document.createDocuments}
   * @param embeddedName - The name of the embedded Document type
   * @param data         - An array of data objects used to create multiple documents
   *                       (default: `[]`)
   * @param operation    - Parameters of the database creation workflow
   *                       (default: `{}`)
   * @returns An array of created Document instances
   */
  // TODO: After regions are defined, change first parameter to `extends foundry.CONST.EMBEDDED_DOCUMENT_TYPES`
  createEmbeddedDocuments<
    EmbeddedName extends Exclude<DocumentType, "Cards">,
    Operation extends DatabaseOperationsFor<EmbeddedName, "create">,
  >(
    embeddedName: EmbeddedName,
    data?: Array<ConstructorDataType<ConfiguredDocumentClassForName<EmbeddedName>>>,
    operation?: InexactPartial<Operation>,
  ): Promise<
    Array<
      Operation["temporary"] extends true
        ? InstanceType<ConfiguredDocumentClassForName<EmbeddedName>>
        : StoredDocument<InstanceType<ConfiguredDocumentClassForName<EmbeddedName>>>
    >
  >;

  /**
   * Update multiple embedded Document instances within a parent Document using provided differential data.
   * @see {@link Document.updateDocuments}
   * @param embeddedName - The name of the embedded Document type
   * @param updates      - An array of differential data objects, each used to update a single Document
   *                       (default: `[]`)
   * @param operation    - Parameters of the database update workflow
   *                       (default: `{}`)
   * @returns An array of updated Document instances
   */
  // TODO: After regions are defined, change first parameter to `extends foundry.CONST.EMBEDDED_DOCUMENT_TYPES`
  updateEmbeddedDocuments<EmbeddedName extends Exclude<DocumentType, "Cards">>(
    embeddedName: EmbeddedName,
    updates?: Array<Record<string, unknown>>,
    operation?: DatabaseOperationsFor<ConcreteMetadata["name"], "update">,
  ): Promise<Array<StoredDocument<InstanceType<ConfiguredDocumentClassForName<EmbeddedName>>>>>;

  /**
   * Delete multiple embedded Document instances within a parent Document using provided string ids.
   * @see {@link Document.deleteDocuments}
   * @param embeddedName - The name of the embedded Document type
   * @param ids          - An array of string ids for each Document to be deleted
   * @param operation    - Parameters of the database deletion workflow
   *                       (default: `{}`)
   * @returns An array of deleted Document instances
   */
  deleteEmbeddedDocuments<EmbeddedName extends DocumentType>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: DatabaseOperationsFor<ConcreteMetadata["name"], "delete">,
  ): Promise<Array<StoredDocument<InstanceType<ConfiguredDocumentClassForName<EmbeddedName>>>>>;

  /**
   * Iterate over all embedded Documents that are hierarchical children of this Document.
   * @param _parentPath - A parent field path already traversed
   * @remarks Not called within Foundry's client-side code, likely exists for server documents
   */
  traverseEmbeddedDocuments(_parentPath?: string): Generator<[string, Document.Any]>;

  /**
   * Get the value of a "flag" for this document
   * See the setFlag method for more details on flags
   *
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   * @returns The flag value
   */
  getFlag<
    S extends Document.FlagKeyOf<Document.OptionsForSchema<Schema>>,
    K extends Document.FlagKeyOf<Document.OptionsForSchema<Schema>[S]>,
  >(scope: S, key: K): Document.GetFlagForSchema<Schema, S, K>;

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
    S extends keyof Document.OptionsForSchema<Schema>,
    K extends keyof Required<Document.OptionsForSchema<Schema>>[S],
    V extends Required<Document.OptionsForSchema<Schema>>[S][K],
  >(scope: S, key: K, value: V): Promise<this>;
  setFlag<S extends keyof Document.OptionsForSchema<Schema>, K extends string>(
    scope: S,
    key: K,
    v: unknown extends Document.OptionsForSchema<Schema>[S] ? unknown : never,
  ): Promise<this>;

  /**
   * Remove a flag assigned to the document
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   * @returns The updated document instance
   */
  unsetFlag(scope: string, key: string): Promise<this>;

  /**
   * Pre-process a creation operation for a single Document instance.
   * Pre-operation events only occur for the client which requested the operation.
   * Modifications to the pending Document instance must be performed using {@link Document#updateSource}.
   * @param data    - The initial data object provided to the document creation request
   * @param options - Additional options which modify the creation request
   * @param user    - The User requesting the document creation
   * @returns Return false to exclude this Document from the creation operation
   */
  protected _preCreate(
    data: fields.SchemaField.AssignmentType<Schema>,
    options: DocumentPreCreateOptions<ConcreteMetadata["name"]>,
    user: foundry.documents.BaseUser,
  ): Promise<boolean | void>;

  /**
   * Post-process a creation operation for a single Document instance.
   * Post-operation events occur for all connected clients.
   * @param data    - The initial data object provided to the document creation request
   * @param options - Additional options which modify the creation request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onCreate(
    data: fields.SchemaField.InnerAssignmentType<Schema>,
    options: DocumentOnCreateOptions<ConcreteMetadata["name"]>,
    userId: string,
  ): void;

  /**
   * Pre-process a creation operation, potentially altering its instructions or input data. Pre-operation events only
   * occur for the client which requested the operation.
   *
   * This batch-wise workflow occurs after individual {@link Document#_preCreate} workflows and provides a final
   * pre-flight check before a database operation occurs.
   *
   * Modifications to pending documents must mutate the documents array or alter individual document instances using
   * {@link Document#updateSource}.
   * @param documents - Pending document instances ot be created
   * @param operation - Parameters of the database creation operation
   * @param user      - The User requesting the creation operation
   * @returns Return false to cancel the creation operation entirely
   */
  protected static _preCreateOperation<T extends Document.AnyConstructor, BlahXXX extends boolean = false>(
    this: T,
    documents: InstanceType<Document.ConfiguredClass<T>>[],
    operation: DatabaseOperationsFor<T["metadata"]["name"], "create", BlahXXX>,
    user: foundry.documents.BaseUser,
  ): Promise<boolean | void>;

  /**
   * Post-process a creation operation, reacting to database changes which have occurred. Post-operation events occur
   * for all connected clients.
   *
   * This batch-wise workflow occurs after individual {@link Document#_onCreate} workflows.
   *
   * @param documents - The Document instances which were created
   * @param operation - Parameters of the database creation operation
   * @param user      - The User who performed the creation operation
   */
  protected static _onCreateOperation<T extends Document.AnyConstructor, BlahXXX extends boolean = false>(
    this: T,
    documents: InstanceType<Document.ConfiguredClass<T>>[],
    operation: DatabaseOperationsFor<T["metadata"]["name"], "create", BlahXXX>,
    user: foundry.documents.BaseUser,
  ): Promise<void>;

  /**
   * Perform preliminary operations before a Document of this type is updated.
   * Pre-update operations only occur for the client which requested the operation.
   * @param changed - The differential data that is changed relative to the documents prior values
   * @param options - Additional options which modify the update request
   * @param user    - The User requesting the document update
   * @returns A return value of false indicates the update operation should be cancelled
   */
  protected _preUpdate(
    changed: fields.SchemaField.AssignmentType<Schema>,
    options: DocumentPreUpdateOptions<ConcreteMetadata["name"]>,
    user: foundry.documents.BaseUser,
  ): Promise<boolean | void>;

  /**
   * Perform follow-up operations after a Document of this type is updated.
   * Post-update operations occur for all clients after the update is broadcast.
   * @param changed - The differential data that was changed relative to the documents prior values
   * @param options - Additional options which modify the update request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onUpdate(
    changed: fields.SchemaField.InnerAssignmentType<Schema>,
    options: DocumentOnUpdateOptions<ConcreteMetadata["name"]>,
    userId: string,
  ): void;

  /**
   * Pre-process an update operation, potentially altering its instructions or input data. Pre-operation events only
   * occur for the client which requested the operation.
   *
   * This batch-wise workflow occurs after individual {@link Document#_preUpdate} workflows and provides a final
   * pre-flight check before a database operation occurs.
   *
   * Modifications to the requested updates are performed by mutating the data array of the operation.
   * {@link Document#updateSource}.
   *
   * @param documents - Document instances to be updated
   * @param operation - Parameters of the database update operation
   * @param user      - The User requesting the update operation
   * @returns Return false to cancel the update operation entirely
   */
  protected static _preUpdateOperation<T extends Document.AnyConstructor>(
    this: T,
    documents: InstanceType<Document.ConfiguredClass<T>>[],
    operation: DatabaseOperationsFor<InstanceType<T>["documentName"], "update">,
    user: foundry.documents.BaseUser,
  ): Promise<boolean | void>;

  /**
   * Post-process an update operation, reacting to database changes which have occurred. Post-operation events occur
   * for all connected clients.
   *
   * This batch-wise workflow occurs after individual {@link Document#_onUpdate} workflows.
   *
   * @param documents - The Document instances which were updated
   * @param operation - Parameters of the database update operation
   * @param user      - The User who performed the update operation
   */
  protected static _onUpdateOperation<T extends Document.AnyConstructor>(
    this: T,
    documents: InstanceType<Document.ConfiguredClass<T>>[],
    operation: DatabaseOperationsFor<InstanceType<T>["documentName"], "update">,
    user: foundry.documents.BaseUser,
  ): Promise<void>;

  /**
   * Perform preliminary operations before a Document of this type is deleted.
   * Pre-delete operations only occur for the client which requested the operation.
   * @param options - Additional options which modify the deletion request
   * @param user    - The User requesting the document deletion
   * @returns A return value of false indicates the delete operation should be cancelled
   */
  protected _preDelete(
    options: DocumentPreDeleteOptions<ConcreteMetadata["name"]>,
    user: foundry.documents.BaseUser,
  ): Promise<boolean | void>;

  /**
   * Perform follow-up operations after a Document of this type is deleted.
   * Post-deletion operations occur for all clients after the deletion is broadcast.
   * @param options - Additional options which modify the deletion request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onDelete(options: DocumentOnDeleteOptions<ConcreteMetadata["name"]>, userId: string): void;

  /**
   * Pre-process a deletion operation, potentially altering its instructions or input data. Pre-operation events only
   * occur for the client which requested the operation.
   *
   * This batch-wise workflow occurs after individual {@link Document#_preDelete} workflows and provides a final
   * pre-flight check before a database operation occurs.
   *
   * Modifications to the requested deletions are performed by mutating the operation object.
   * {@link Document#updateSource}.
   *
   * @param documents - Document instances to be deleted
   * @param operation - Parameters of the database update operation
   * @param user      - The User requesting the deletion operation
   * @returns Return false to cancel the deletion operation entirely
   * @internal
   */
  protected static _preDeleteOperation<T extends Document.AnyConstructor>(
    this: T,
    documents: InstanceType<Document.ConfiguredClass<T>>[],
    operation: DatabaseOperationsFor<InstanceType<T>["documentName"], "delete">,
    user: foundry.documents.BaseUser,
  ): Promise<boolean | void>;

  /**
   * Post-process a deletion operation, reacting to database changes which have occurred. Post-operation events occur
   * for all connected clients.
   *
   * This batch-wise workflow occurs after individual {@link Document#_onDelete} workflows.
   *
   * @param documents - The Document instances which were deleted
   * @param operation - Parameters of the database deletion operation
   * @param user      - The User who performed the deletion operation
   */
  protected static _onDeleteOperation<T extends Document.AnyConstructor>(
    this: T,
    documents: InstanceType<Document.ConfiguredClass<T>>[],
    operation: DatabaseOperationsFor<InstanceType<T>["documentName"], "delete">,
    user: foundry.documents.BaseUser,
  ): Promise<void>;

  /**
   * Configure whether V10 Document Model migration warnings should be logged for this class.
   */
  static LOG_V10_COMPATIBILITY_WARNINGS: boolean;

  /**
   * @deprecated since v11, will be removed in v13
   * @remarks "You are accessing `Document.hasSystemData` which is deprecated. Please use `Document.hasTypeData` instead."
   */
  static get hasSystemData(): boolean;

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
    apply?: (data: object) => any,
  ): unknown;

  protected static _logDataFieldMigration(
    oldKey: string,
    newKey: string,
    options?: LogCompatibilityWarningOptions,
  ): void;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"The Document._onCreateDocuments static method is deprecated in favor of Document._onCreateOperation"`
   */
  protected static _onCreateDocuments<T extends Document.AnyConstructor>(
    this: T,
    documents: Array<InstanceType<ConfiguredDocumentClass<T>>>,
    context: DocumentModificationContext,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"The Document._onUpdateDocuments static method is deprecated in favor of Document._onUpdateOperation"`
   */
  protected static _onUpdateDocuments<T extends Document.AnyConstructor>(
    this: T,
    documents: Array<InstanceType<ConfiguredDocumentClass<T>>>,
    context: DocumentModificationContext,
  ): Promise<unknown>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"The Document._onDeleteDocuments static method is deprecated in favor of Document._onDeleteOperation"`
   */
  protected static _onDeleteDocuments<T extends Document.AnyConstructor>(
    this: T,
    documents: Array<InstanceType<ConfiguredDocumentClass<T>>>,
    context: DocumentModificationContext,
  ): Promise<unknown>;
}

declare namespace Document {
  /** Any Document, except for Settings */
  export type Any = Document<DataSchema, AnyMetadata, any>;

  /** Any Document, that is a child of the given parent Document. */
  export type AnyChild<Parent extends Any | null> = Document<DataSchema, AnyMetadata, Parent>;

  export type Constructor = typeof Document<DataSchema, AnyMetadata, any>;

  export type AnyConstructor = Pick<typeof Document, keyof typeof Document> & (new (...args: any[]) => Document.Any);

  type SystemConstructor = AnyConstructor & { metadata: { name: SystemType; coreTypes?: string[] } };

  type ConfiguredClass<T extends { metadata: AnyMetadata }> = ConfiguredClassForName<T["metadata"]["name"]>;

  type ConfiguredClassForName<Name extends TypeName> = CONFIG[Name]["documentClass"];

  // Doubled references are useful but shouldn't store the lists separately
  type SystemType = DocumentTypeWithTypeData;

  type TypeName = DocumentType;

  type PlaceableTypeName = PlaceableDocumentType;

  export type SchemaFor<ConcreteDocument extends Any> =
    ConcreteDocument extends Document<infer Schema, any, any> ? Schema : never;

  export type MetadataFor<ConcreteDocument extends Any> =
    ConcreteDocument extends Document<any, infer ConcreteMetadata, any> ? ConcreteMetadata : never;

  type CollectionRecord<Schema extends DataSchema> = {
    [Key in keyof Schema]: Schema[Key] extends fields.EmbeddedCollectionField<any, any> ? Schema[Key] : never;
  };

  export type Flags<ConcreteDocument extends Any> = OptionsForSchema<SchemaFor<ConcreteDocument>>;

  interface OptionsInFlags<Options extends DataFieldOptions.Any> {
    readonly flags?: DataField<Options, any, any, any>;
  }

  // These  types only exists to simplify solving the `Document` type. Using `Document.Flags<this>` means the constraint `this extends Document.Any` has to be proved.
  // This is much more complex than proving the constraint for `Document.FlagsInternal<Schema>` that `Schema extends DataSchema`.

  // TODO: This needs to use the derived flags not just how they're initialized.
  type OptionsForSchema<Schema extends DataSchema> =
    RemoveIndexSignatures<Schema> extends OptionsInFlags<infer Options> ? DataField.InitializedType<Options> : never;

  // Returns only string keys and returns `never` if `T` is never.
  type FlagKeyOf<T> = T extends never ? never : keyof T & string;

  export type GetFlag<ConcreteDocument extends Any, S extends string, K extends string> = GetFlagForSchema<
    SchemaFor<ConcreteDocument>,
    S,
    K
  >;

  export type FlagInSchema<S extends string, K extends string, Options extends DataFieldOptions.Any> = {
    readonly [_ in S]?: {
      readonly [_ in K]?: DataField<Options, any, any, any>;
    };
  };

  // Looks for flags in the schema.
  // If a flag can't be found `undefined` is returned.
  type GetFlagForSchema<Schema extends DataSchema, S extends string, K extends string> =
    OptionsForSchema<Schema> extends FlagInSchema<S, K, infer Options> ? DataField.InitializedType<Options> : undefined;
}

/** @deprecated - since v12 */
export type DocumentModificationOptions = Omit<DocumentModificationContext, "parent" | "pack">;

export interface Context<Parent extends Document.Any | null> {
  /**
   * A parent document within which this Document is embedded
   */
  parent?: Parent;

  /**
   * A named compendium pack within which this Document exists
   */
  pack?: string;
}

export type AnyMetadata = Metadata<Document.Any>;

export interface Metadata<ConcreteDocument extends Document.Any> {
  name: Document.TypeName;
  collection: string;
  indexed?: boolean;
  compendiumIndexFields?: string[];
  label: string;
  coreTypes?: readonly string[];
  embedded: Record<string, string>;
  permissions: {
    create:
      | string
      | ((
          user: foundry.documents.BaseUser,
          doc: ConcreteDocument,
          data: fields.SchemaField.InnerAssignmentType<ConcreteDocument["schema"]["fields"]>,
        ) => boolean);
    update:
      | string
      | ((
          user: foundry.documents.BaseUser,
          doc: ConcreteDocument,
          data: fields.SchemaField.InnerAssignmentType<ConcreteDocument["schema"]["fields"]>,
        ) => boolean);
    delete: string | ((user: foundry.documents.BaseUser, doc: ConcreteDocument, data: {}) => boolean);
  };
  preserveOnImport?: string[];
  schemaVersion: string | undefined;
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

export type Operation = "create" | "update" | "delete";

export interface DatabaseOperationMap<BlahXXX extends boolean> {
  ActiveEffect: ActiveEffect.DatabaseOperations<BlahXXX>;
  Actor: Actor.DatabaseOperations<BlahXXX>;
  ActorDelta: ActorDelta.DatabaseOperations<BlahXXX>;
  Adventure: Adventure.DatabaseOperations<BlahXXX>;
  AmbientLight: AmbientLightDocument.DatabaseOperations<BlahXXX>;
  AmbientSound: AmbientSoundDocument.DatabaseOperations<BlahXXX>;
  Card: Card.DatabaseOperations<BlahXXX>;
  Cards: Cards.DatabaseOperations<BlahXXX>;
  ChatMessage: ChatMessage.DatabaseOperations<BlahXXX>;
  Combat: Combat.DatabaseOperations<BlahXXX>;
  Combatant: Combatant.DatabaseOperations<BlahXXX>;
  Drawing: DrawingDocument.DatabaseOperations<BlahXXX>;
  FogExploration: FogExploration.DatabaseOperations<BlahXXX>;
  Folder: Folder.DatabaseOperations<BlahXXX>;
  Item: Item.DatabaseOperations<BlahXXX>;
  JournalEntry: JournalEntry.DatabaseOperations<BlahXXX>;
  JournalEntryPage: JournalEntryPage.DatabaseOperations<BlahXXX>;
  Macro: Macro.DatabaseOperations<BlahXXX>;
  MeasuredTemplate: MeasuredTemplateDocument.DatabaseOperations<BlahXXX>;
  Note: NoteDocument.DatabaseOperations<BlahXXX>;
  Playlist: Playlist.DatabaseOperations<BlahXXX>;
  PlaylistSound: PlaylistSound.DatabaseOperations<BlahXXX>;
  // TODO: Add these once documents are done
  // Region: ActiveEffect.DatabaseOperations<BlahXXX>;
  // RegionBehavior: ActiveEffect.DatabaseOperations<BlahXXX>;
  RollTable: RollTable.DatabaseOperations<BlahXXX>;
  Scene: Scene.DatabaseOperations<BlahXXX>;
  Setting: Setting.DatabaseOperations<BlahXXX>;
  TableResult: TableResult.DatabaseOperations<BlahXXX>;
  Tile: TileDocument.DatabaseOperations<BlahXXX>;
  Token: TokenDocument.DatabaseOperations<BlahXXX>;
  User: User.DatabaseOperations<BlahXXX>;
  Wall: WallDocument.DatabaseOperations<BlahXXX>;
}

// options
export type DocumentPreCreateOptions<Name extends DocumentType> = Omit<
  DatabaseOperationsFor<Name, "create">,
  "data" | "noHook" | "pack" | "parent"
>;
export type DocumentOnCreateOptions<Name extends DocumentType> = Omit<
  DatabaseOperationsFor<Name, "create">,
  "pack" | "parentUuid" | "syntheticActorUpdate"
>;

export type DocumentPreUpdateOptions<Name extends DocumentType> = Omit<
  DatabaseOperationsFor<Name, "update">,
  "updates" | "restoreDelta" | "noHook" | "parent" | "pack"
>;
export type DocumentOnUpdateOptions<Name extends DocumentType> = Omit<
  DatabaseOperationsFor<Name, "update">,
  "pack" | "parentUuid" | "syntheticActorUpdate"
>;

export type DocumentPreDeleteOptions<Name extends DocumentType> = Omit<
  DatabaseOperationsFor<Name, "delete">,
  "ids" | "deleteAll" | "noHook" | "pack" | "parent"
>;
export type DocumentOnDeleteOptions<Name extends DocumentType> = Omit<
  DatabaseOperationsFor<Name, "delete">,
  "deleteAll" | "pack" | "parentUuid" | "syntheticActorUpdate"
>;

export type DocumentPreUpsertOptions<Name extends DocumentType> =
  | DocumentPreCreateOptions<Name>
  | DocumentPreUpdateOptions<Name>;
export type DocumentOnUpsertOptions<Name extends DocumentType> =
  | DocumentOnCreateOptions<Name>
  | DocumentOnUpdateOptions<Name>;

type MaybeTemporary<
  ConcreteDocument extends Document.AnyConstructor,
  Temporary extends boolean,
> = Temporary extends true
  ? InstanceType<ConfiguredDocumentClass<ConcreteDocument>>
  : ConfiguredStoredDocument<ConcreteDocument>;
