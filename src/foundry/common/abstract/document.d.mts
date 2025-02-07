import type {
  ConfiguredDocuments,
  ConfiguredMetadata,
  DefaultDocuments,
  ConstructorData,
} from "../../../types/documentConfiguration.d.mts";
import type {
  GetKey,
  InterfaceToObject,
  MakeConform,
  MustConform,
  ToMethod,
  AnyObject,
  DeepPartial,
  EmptyObject,
  InexactPartial,
  RemoveIndexSignatures,
  FixedInstanceType,
} from "../../../utils/index.d.mts";
import type * as CONST from "../constants.mts";
import type { DataField, EmbeddedCollectionField, EmbeddedDocumentField } from "../data/fields.d.mts";
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

type _ConfigurationFailureClassMustBeAssignableToInternal = MustConform<
  Document.ConfigurationFailureClass,
  Document.Internal.Constructor
>;
type _ConfigurationFailureInstanceMustBeAssignableToInternal = MustConform<
  Document.ConfigurationFailureInstance,
  Document.Internal.Instance.Any
>;

/**
 * An extension of the base DataModel which defines a Document.
 * Documents are special in that they are persisted to the database and referenced by _id.
 */
declare abstract class Document<
  DocumentName extends Document.Type,
  Schema extends DataSchema,
  Parent extends Document.Any | null = null,
> extends DataModel<Schema, Parent, InterfaceToObject<Document.ConstructionContext<Parent>>> {
  static [Document.Internal.DocumentBrand]: true;

  [Document.Internal.DocumentName]: DocumentName;
  [Document.Internal.Schema]: Schema;
  [Document.Internal.Parent]: Parent;

  /**
   * @param data    - Initial data provided to construct the Document
   * @param context - Construction context options
   */
  constructor(data?: fields.SchemaField.InnerConstructorType<Schema>, context?: Document.ConstructionContext<Parent>);

  override parent: Parent;

  protected override _configure(options?: {
    pack?: string | null | undefined;
    parentCollection?: string | null | undefined;
  }): void;

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
  static metadata: Readonly<Document.Metadata.Any>;

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
  get collectionName(): Document.Internal.SimpleMetadata<DocumentName>["collection"];

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
   * @remarks Document.TYPES is overly generic so subclasses don't cause problems
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
  static canUserCreate(user: User): boolean;

  /**
   * Get the explicit permission level that a specific User has over this Document, a value in CONST.DOCUMENT_OWNERSHIP_LEVELS.
   * This method returns the value recorded in Document ownership, regardless of the User's role.
   * To test whether a user has a certain capability over the document, testUserPermission should be used.
   * @param user - The User being tested
   *               (default: `game.user`)
   * @returns A numeric permission level from CONST.DOCUMENT_OWNERSHIP_LEVELS or null
   */
  getUserLevel(user?: User): CONST.DOCUMENT_OWNERSHIP_LEVELS | null;

  /**
   * Test whether a certain User has a requested permission level (or greater) over the Document
   * @param user       - The User being tested
   * @param permission - The permission level from DOCUMENT_PERMISSION_LEVELS to test
   * @param options    - Additional options involved in the permission test
   * @returns Does the user have this permission level over the Document?
   */
  testUserPermission(
    user: User,
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
  canUserModify(user: User, action: "create" | "update" | "delete", data?: object): boolean;

  /**
   * Clone a document, creating a new document by combining current data with provided overrides.
   * The cloned document is ephemeral and not yet saved to the database.
   * @param data    - Additional data which overrides current document data at the time of creation
   * @param context - Additional context options passed to the create method
   * @returns The cloned Document instance
   */
  override clone<Save extends boolean = false>(
    data?: fields.SchemaField.AssignmentType<Schema, EmptyObject>,
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
      } & Document.ConstructionContext<this["parent"]>
    >, // FIXME(LukeAbby): Adding Document.Stored to the return causes a recursive type error in Scene
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
  static createDocuments<T extends Document.AnyConstructor, Temporary extends boolean | undefined>(
    this: T,
    data: Array<Document.ConstructorDataFor<NoInfer<T>>>,
    operation?: InexactPartial<
      Omit<Document.Database.OperationOf<NoInfer<T>["metadata"]["name"], "create">, "data">
    > & {
      temporary?: Temporary;
    },
  ): Promise<Document.ToStoredIf<T, Temporary>[] | undefined>;

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
    updates?: Array<DeepPartial<Document.UpdateDataFor<NoInfer<T>>>>,
    operation?: InexactPartial<
      Omit<Document.Database.OperationOf<FixedInstanceType<NoInfer<T>>["documentName"], "update">, "updates">
    >,
  ): Promise<Document.ToConfiguredInstance<T>[]>;

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
    operation?: InexactPartial<
      Omit<Document.Database.OperationOf<FixedInstanceType<NoInfer<T>>["documentName"], "delete">, "ids">
    >,
  ): Promise<Document.ToConfiguredInstance<T>[]>;

  /**
   * Create a new Document using provided input data, saving it to the database.
   * @see {@link Document.createDocuments}
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
   * @remarks If no document has actually been created, the returned {@link Promise} resolves to `undefined`.
   */
  static create<T extends Document.AnyConstructor, Temporary extends boolean | undefined>(
    this: T,
    data: Document.ConstructorDataFor<NoInfer<T>> | Document.ConstructorDataFor<NoInfer<T>>[],
    operation?: InexactPartial<
      Omit<Document.Database.OperationOf<NoInfer<T>["metadata"]["name"], "create">, "data">
    > & {
      temporary?: Temporary;
    },
  ): Promise<Document.ToStoredIf<T, Temporary> | undefined>;

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
  update(
    // TODO: Determine if this is Partial, DeepPartial, or InexactPartial.
    data?: Partial<Document.ConstructorDataForSchema<Schema>>,
    operation?: InexactPartial<Omit<Document.Database.OperationOf<DocumentName, "update">, "updates">>,
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
    operation?: InexactPartial<Omit<Document.Database.OperationOf<DocumentName, "delete">, "ids">>,
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
  getEmbeddedCollection<EmbeddedName extends foundry.CONST.EMBEDDED_DOCUMENT_TYPES>(
    embeddedName: EmbeddedName,
  ): Collection<Document.ConfiguredInstanceForName<EmbeddedName>>;

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
  // TODO: I think we could do a better job on all the embedded methods of limiting the types here based on the
  //   allowed embedded types of the parent (vs. allowing any document to create embedded
  //   documents of any type)
  createEmbeddedDocuments<
    EmbeddedName extends foundry.CONST.EMBEDDED_DOCUMENT_TYPES,
    Temporary extends boolean | undefined,
  >(
    embeddedName: EmbeddedName,
    data?: Array<Document.ConstructorDataForName<Extract<EmbeddedName, Document.Type>>>,
    operation?: InexactPartial<Document.Database.OperationOf<Extract<EmbeddedName, Document.Type>, "create">> & {
      temporary?: Temporary;
    },
  ): Promise<Array<Document.ConfiguredInstanceForName<Extract<EmbeddedName, Document.Type>>> | undefined>;

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
  updateEmbeddedDocuments<EmbeddedName extends foundry.CONST.EMBEDDED_DOCUMENT_TYPES>(
    embeddedName: EmbeddedName,
    updates?: Array<AnyObject>,
    context?: Document.ModificationContext<this["parent"]>,
  ): Promise<Array<Document.Stored<Document.ConfiguredInstanceForName<Extract<EmbeddedName, Document.Type>>>>>;

  /**
   * Delete multiple embedded Document instances within a parent Document using provided string ids.
   * @see {@link Document.deleteDocuments}
   * @param embeddedName - The name of the embedded Document type
   * @param ids          - An array of string ids for each Document to be deleted
   * @param operation    - Parameters of the database deletion workflow
   *                       (default: `{}`)
   * @returns An array of deleted Document instances
   */
  deleteEmbeddedDocuments<EmbeddedName extends foundry.CONST.EMBEDDED_DOCUMENT_TYPES>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    operation?: Document.Database.OperationOf<DocumentName, "delete">,
  ): Promise<Array<Document.Stored<Document.ConfiguredInstanceForName<EmbeddedName>>>>;

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
    S extends Document.FlagKeyOf<Document.ConfiguredFlagsForName<DocumentName>>,
    K extends Document.FlagKeyOf<Document.FlagGetKey<Document.ConfiguredFlagsForName<DocumentName>, S>>,
  >(scope: S, key: K): Document.GetFlag<DocumentName, S, K>;

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
    S extends Document.FlagKeyOf<Document.ConfiguredFlagsForName<DocumentName>>,
    K extends Document.FlagKeyOf<Document.FlagGetKey<Document.ConfiguredFlagsForName<DocumentName>, S>>,
    V extends Document.GetFlag<DocumentName, S, K>,
  >(scope: S, key: K, value: V): Promise<this>;

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
    options: Document.PreCreateOptions<DocumentName>,
    user: User,
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
    options: Document.OnCreateOptions<DocumentName>,
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
  protected static _preCreateOperation<T extends Document.AnyConstructor>(
    this: T,
    documents: Document.ToConfiguredInstance<NoInfer<T>>[],
    operation: Document.Database.OperationOf<NoInfer<T>["metadata"]["name"], "create">,
    user: User,
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
  protected static _onCreateOperation<T extends Document.AnyConstructor>(
    this: T,
    documents: Document.ToConfiguredInstance<NoInfer<T>>[],
    operation: Document.Database.OperationOf<NoInfer<T>["metadata"]["name"], "create">,
    user: User,
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
    options: Document.PreUpdateOptions<DocumentName>,
    user: User,
  ): Promise<boolean | void>;

  /**
   * Perform follow-up operations after a Document of this type is updated.
   * Post-update operations occur for all clients after the update is broadcast.
   * @param changed - The differential data that was changed relative to the documents prior values
   * @param options - Additional options which modify the update request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onUpdate(
    changed: fields.SchemaField.InnerUpdateData<Schema>,
    options: Document.OnUpdateOptions<DocumentName>,
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
    documents: Document.ToConfiguredInstance<NoInfer<T>>[],
    operation: Document.Database.OperationOf<FixedInstanceType<NoInfer<T>>["documentName"], "update">,
    user: User,
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
    documents: Document.ToConfiguredInstance<NoInfer<T>>[],
    operation: Document.Database.OperationOf<FixedInstanceType<NoInfer<T>>["documentName"], "update">,
    user: User,
  ): Promise<void>;

  /**
   * Perform preliminary operations before a Document of this type is deleted.
   * Pre-delete operations only occur for the client which requested the operation.
   * @param options - Additional options which modify the deletion request
   * @param user    - The User requesting the document deletion
   * @returns A return value of false indicates the delete operation should be cancelled
   */
  protected _preDelete(options: Document.PreDeleteOptions<DocumentName>, user: User): Promise<boolean | void>;

  /**
   * Perform follow-up operations after a Document of this type is deleted.
   * Post-deletion operations occur for all clients after the deletion is broadcast.
   * @param options - Additional options which modify the deletion request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onDelete(options: Document.OnDeleteOptions<DocumentName>, userId: string): void;

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
    documents: Document.ToConfiguredInstance<NoInfer<T>>[],
    operation: Document.Database.OperationOf<FixedInstanceType<NoInfer<T>>["documentName"], "delete">,
    user: User,
  ): Promise<unknown>;

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
    documents: Document.ToConfiguredInstance<NoInfer<T>>[],
    operation: Document.Database.OperationOf<FixedInstanceType<NoInfer<T>>["documentName"], "delete">,
    user: User,
  ): Promise<unknown>;

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
    documents: Array<Document.ToConfiguredInstance<NoInfer<T>>>,
    context: Document.ModificationContext<Document.Any | null>,
  ): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"The Document._onUpdateDocuments static method is deprecated in favor of Document._onUpdateOperation"`
   */
  protected static _onUpdateDocuments<T extends Document.AnyConstructor>(
    this: T,
    documents: Array<Document.ToConfiguredInstance<NoInfer<T>>>,
    context: Document.ModificationContext<Document.Any | null>,
  ): Promise<unknown>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"The Document._onDeleteDocuments static method is deprecated in favor of Document._onDeleteOperation"`
   */
  protected static _onDeleteDocuments<T extends Document.AnyConstructor>(
    this: T,
    documents: Array<Document.ToConfiguredInstance<NoInfer<T>>>,
    context: Document.ModificationContext<Document.Any | null>,
  ): Promise<unknown>;
}

declare abstract class AnyDocument extends Document<any, any, any> {
  constructor(arg0: never, ...args: never[]);

  // Note(LukeAbby): Specifically adding the `DocumentBrand` should be redundant but in practice it seems to help tsc more efficiently deduce that it's actually inheriting from `Document`.
  // This is odd but probably is because it bails from looking up the parent class properties at times or something.
  static [Document.Internal.DocumentBrand]: true;

  flags?: unknown;

  getFlag(scope: never, key: never): any;
}

// Note(LukeAbby): The point of this class is to show up in intellisense.
// When something fails to be configured it should be replaced with `typeof ConfigurationFailure & typeof Item` or whatever the relevant class is.
// This helps to minimize the number of errors that appears in a repo with broken configuration as they can be very misleading and confusing.
declare abstract class ConfigurationFailure extends AnyDocument {
  static [Document.Internal.DocumentBrand]: true;
}

declare namespace Document {
  /** Any Document, except for Settings */
  type Any = AnyDocument;
  type AnyConstructor = typeof AnyDocument;

  type ConfigurationFailureClass = typeof ConfigurationFailure;
  type ConfigurationFailureInstance = ConfigurationFailure;

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
    | "Region"
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

  type CoreTypesForName<Name extends Type> = string &
    GetKey<Document.Internal.SimpleMetadata<Name>, "coreTypes", ["base"]>[number];

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

  type EmbeddableNamesFor<ConcreteDocument extends Document.Internal.Instance.Any> = {
    [K in keyof ConfiguredDocuments]: IsParentOf<
      ConcreteDocument,
      FixedInstanceType<ConfiguredDocuments[K]>
    > extends true
      ? K
      : never;
  };

  type IsParentOf<
    ParentDocument extends Document.Internal.Instance.Any,
    ChildDocument extends Document.Internal.Instance.Any,
  > = ParentDocument extends Internal.ParentFor<ChildDocument> ? true : false;

  type SocketRequest<Action extends DatabaseAction> = DocumentSocketRequest<Action>;
  type SocketResponse<Action extends DatabaseAction> = DocumentSocketResponse<Action>;

  // Documented at https://gist.github.com/LukeAbby/c7420b053d881db4a4d4496b95995c98
  namespace Internal {
    const DocumentBrand: unique symbol;

    const DocumentName: unique symbol;
    const Schema: unique symbol;
    const Parent: unique symbol;

    // This metadata is called "simple" because where there should be proper references to the
    // current document there is instead `Document.Any`. This helps simplify loops.
    // Use cases should be limited to when these references aren't needed.
    type SimpleMetadata<Name extends Document.Type> = ConfiguredMetadata<Document.Any>[Name];

    type Constructor = (abstract new (arg0: never, ...args: never[]) => Instance.Any) & {
      [DocumentBrand]: true;
    };

    interface Instance<
      DocumentName extends Document.Type,
      Schema extends DataSchema,
      Parent extends Document.Internal.Instance.Any | null,
    > {
      [DocumentName]: DocumentName;
      [Schema]: Schema;
      [Parent]: Parent;
    }

    type DocumentNameFor<ConcreteInstance extends Instance.Any> = ConcreteInstance[typeof DocumentName];

    type SchemaFor<ConcreteInstance extends Instance.Any> = ConcreteInstance[typeof Schema];

    type ParentFor<ConcreteInstance extends Instance.Any> = ConcreteInstance[typeof Parent];

    namespace Instance {
      type Any = Instance<any, any, any>;

      type Complete<T extends Any> = T extends Document.Any ? T : never;
    }
  }

  /** Any Document, that is a child of the given parent Document. */
  type AnyChild<Parent extends Any | null> = Document<any, any, Parent>;

  /**
   * Returns the type of the constructor data for the given {@link foundry.abstract.Document}.
   */
  type ConstructorDataFor<T extends Document.Internal.Constructor> = ConstructorDataForSchema<
    T extends { defineSchema: () => infer R extends DataSchema } ? R : never
  >;

  // TODO(LukeAbby): Actually make this distinguishable from `Document.ConstructorDataFor` and `Document.ConstructorDataForSchema`.
  type UpdateDataFor<T extends Document.Internal.Constructor> = ConstructorDataForSchema<
    T extends { defineSchema: () => infer R extends DataSchema } ? R : never
  >;

  // These helper types exist to help break a loop
  type ConstructorDataForName<T extends Document.Type> = ConstructorData[T];
  type UpdateDataForName<T extends Document.Type> = ConstructorData[T];

  type ConstructorDataForSchema<Schema extends DataSchema> =
    foundry.data.fields.SchemaField.InnerAssignmentType<Schema>;

  type SystemConstructor = AnyConstructor & {
    metadata: { name: SystemType };
  };

  type ConfiguredClassForName<Name extends Type> = MakeConform<
    ConfiguredDocuments[Name],
    Document.Internal.Constructor,
    typeof ConfigurationFailure & DefaultDocuments[Name]
  >;

  type SubTypesOf<T extends Type> =
    ConfiguredInstanceForName<T> extends { type: infer Types } ? Types : typeof foundry.CONST.BASE_DOCUMENT_TYPE;

  // NOTE(LukeAbby): This type is less DRY than it could be to avoid undue complexity in such a critical helpeer.
  // This has _many_ times been seen to cause loops so this type is written in an intentionally more paranoid way.
  // The reason for the verbosity and repetition is to avoid eagerly evaluating any branches that might cause a loop.
  type ToConfiguredClass<ConcreteDocument extends Document.Internal.Constructor> = MakeConform<
    ConfiguredDocuments[NameFor<ConcreteDocument>],
    Document.AnyConstructor,
    typeof ConfigurationFailure & DefaultDocuments[NameFor<ConcreteDocument>]
  >;

  type ToConfiguredInstance<ConcreteDocument extends Document.Internal.Constructor> = MakeConform<
    FixedInstanceType<ConfiguredDocuments[NameFor<ConcreteDocument>]>,
    Document.Any,
    ConfigurationFailure & FixedInstanceType<DefaultDocuments[NameFor<ConcreteDocument>]>
  >;

  type ToConfiguredStored<D extends Document.Internal.Constructor> = Stored<ToConfiguredInstance<D>>;

  type Stored<D extends Document.Internal.Instance.Any> = D & {
    id: string;
    _id: string;
    _source: GetKey<D, "_source"> & { _id: string };
  };

  type ToStoredIf<
    D extends Document.Internal.Constructor,
    Temporary extends boolean | undefined,
  > = Temporary extends true ? ToConfiguredStored<D> : ToConfiguredInstance<D>;

  type Temporary<D extends Document.Internal.Instance.Any> = D extends Stored<infer U> ? U : D;

  type NameFor<ConcreteDocument extends Document.Internal.Constructor> = ConcreteDocument extends {
    readonly metadata: { readonly name: infer Name extends Type };
  }
    ? Name
    : never;

  type ConfiguredInstanceForName<Name extends Type> = MakeConform<
    FixedInstanceType<ConfiguredDocuments[Name]>,
    Document.Any
  >;

  type ConfiguredObjectClassForName<Name extends PlaceableType> = CONFIG[Name]["objectClass"];
  type ConfiguredObjectInstanceForName<Name extends PlaceableType> = FixedInstanceType<CONFIG[Name]["objectClass"]>;

  type ConfiguredDataForName<Name extends Type> = GetKey<DataConfig, Name, EmptyObject>;

  type ConfiguredSourceForName<Name extends Type> = GetKey<SourceConfig, Name, EmptyObject>;

  type ConfiguredFlagsForName<Name extends Type> = GetKey<FlagConfig, Name, EmptyObject>;

  type ToObjectFalseType<T extends Document.Internal.Instance.Any> = T extends {
    toObject: (source: false) => infer U;
  }
    ? U
    : T;

  type SchemaFor<ConcreteDocument extends Internal.Instance.Any> =
    ConcreteDocument extends Internal.Instance<infer _1, infer Schema, infer _2> ? Schema : never;

  type MetadataFor<ConcreteDocument extends Document.Internal.Instance.Any> =
    ConfiguredMetadata<ConcreteDocument>[ConcreteDocument extends {
      readonly documentName: infer Name extends Document.Type;
    }
      ? Name
      : never];

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
  // If it isn't then issues arise where the `Document` type ends up becoming invaraint.
  // Currently it is actually contravariant over `ConcreteSchema` and this may cause issues (because of the usage of `keyof`).
  // Unfortunately it's not easy to avoid because the typical `GetKey` trick has issues between `never`, not defined at all, and `unknown` etc.
  type GetFlag<Name extends Document.Type, S extends string, K extends string> = FlagGetKey<
    FlagGetKey<Document.ConfiguredFlagsForName<Name>, S>,
    K
  >;

  interface ConstructionContext<Parent extends Document.Any | null> {
    /**
     * The parent Document of this one, if this one is embedded
     * @defaultValue `null`
     */
    parent?: Parent | undefined;

    /**
     * The compendium collection ID which contains this Document, if any
     * @defaultValue `null`
     */
    pack?: string | null | undefined;

    /**
     * Whether to validate initial data strictly?
     * @defaultValue `true`
     */
    strict?: boolean | null | undefined;

    /**
     * An immutable reverse-reference to the name of the collection that thi8s Document exists in on its parent, if any.
     */
    parentCollection?: string | null | undefined;
  }

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

  type ModificationOptions = Omit<Document.ModificationContext<Document.Any | null>, "parent" | "pack">;

  type PreCreateOptions<Name extends Type> = Omit<
    Document.Database.OperationOf<Name, "create">,
    "data" | "noHook" | "pack" | "parent"
  >;
  type OnCreateOptions<Name extends Type> = Omit<
    Document.Database.OperationOf<Name, "create">,
    "pack" | "parentUuid" | "syntheticActorUpdate"
  >;

  type PreUpdateOptions<Name extends Type> = Omit<
    Document.Database.OperationOf<Name, "update">,
    "updates" | "restoreDelta" | "noHook" | "parent" | "pack"
  >;
  type OnUpdateOptions<Name extends Type> = Omit<
    Document.Database.OperationOf<Name, "update">,
    "pack" | "parentUuid" | "syntheticActorUpdate"
  >;

  type PreDeleteOptions<Name extends Type> = Omit<
    Document.Database.OperationOf<Name, "delete">,
    "ids" | "deleteAll" | "noHook" | "pack" | "parent"
  >;
  type OnDeleteOptions<Name extends Type> = Omit<
    Document.Database.OperationOf<Name, "delete">,
    "deleteAll" | "pack" | "parentUuid" | "syntheticActorUpdate"
  >;

  type PreUpsertOptions<Name extends Type> = PreCreateOptions<Name> | PreUpdateOptions<Name>;
  type OnUpsertOptions<Name extends Type> = OnCreateOptions<Name> | OnUpdateOptions<Name>;

  interface Metadata<out ThisType extends Document.Any> {
    readonly name: ThisType["documentName"];
    readonly collection: string;
    readonly indexed?: boolean | undefined;
    readonly compendiumIndexFields?: readonly string[] | undefined;
    readonly label: string;
    readonly coreTypes: readonly string[];
    readonly embedded: Record<string, string>;
    readonly permissions: {
      create: string | ToMethod<(user: User, doc: ThisType, data: Document.ConstructorDataForName<Type>) => boolean>;
      update: string | ToMethod<(user: User, doc: ThisType, data: Document.UpdateDataForName<Type>) => boolean>;
      delete: string | ToMethod<(user: User, doc: ThisType, data: EmptyObject) => boolean>;
    };
    readonly preserveOnImport?: readonly string[] | undefined;
    readonly schemaVersion: string | undefined;
    readonly labelPlural: string; // This is not set for the Document class but every class that implements Document actually provides it.
    readonly types: readonly string[];
    readonly hasSystemData: boolean;
  }

  namespace Metadata {
    type Any = Metadata<any>;

    export interface Default {
      name: "Document";
      collection: "documents";
      label: "DOCUMENT.Document";
      coreTypes: [typeof foundry.CONST.BASE_DOCUMENT_TYPE];
      types: [];
      embedded: EmptyObject;
      hasSystemData: false;
      permissions: {
        create: "ASSISTANT";
        update: "ASSISTANT";
        delete: "ASSISTANT";
      };
      pack: null;
    }
  }

  /**
   * @deprecated {@link Document.Database.OperationOf | `Document.Database.OperationOf`}
   */
  type DatabaseOperationsFor<
    Name extends Document.Type,
    ConcreteOperation extends Document.Database.Operation,
  > = Document.Database.OperationOf<Name, ConcreteOperation>;

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

    /* eslint-disable @typescript-eslint/no-empty-object-type */
    interface Operations<
      T extends Document.Internal.Instance.Any = Document.Internal.Instance.Any,
      ExtraCreateOptions extends AnyObject = {},
      ExtraUpdateOptions extends AnyObject = {},
      ExtraDeleteOptions extends AnyObject = {},
    > {
      create: DatabaseCreateOperation<T> & InexactPartial<ExtraCreateOptions>;
      update: DatabaseUpdateOperation<T> & InexactPartial<ExtraUpdateOptions>;
      delete: DatabaseDeleteOperation & InexactPartial<ExtraDeleteOptions>;
    }
    /* eslint-enable @typescript-eslint/no-empty-object-type */

    /**
     * This is a helper type that gets the right DatabaseOperation (including the
     * proper options) for a particular Document type.
     */
    type OperationOf<
      T extends Document.Type,
      Operation extends Database.Operation,
      // eslint-disable-next-line @typescript-eslint/no-deprecated
    > = DatabaseOperationMap[T][Operation];
  }
}

/** @deprecated {@link Document.Database.Operation | `Document.Database.Operation`} */
export type Operation = Document.Database.Operation;

/* eslint-disable @typescript-eslint/no-empty-object-type */
/** @deprecated {@link Document.Database.Operations | `Document.Database.Operations`} */
export type DocumentDatabaseOperations<
  T extends Document.Internal.Instance.Any = Document.Internal.Instance.Any,
  ExtraCreateOptions extends AnyObject = {},
  ExtraUpdateOptions extends AnyObject = {},
  ExtraDeleteOptions extends AnyObject = {},
> = Document.Database.Operations<T, ExtraCreateOptions, ExtraUpdateOptions, ExtraDeleteOptions>;
/* eslint-enable @typescript-eslint/no-empty-object-type */

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
  Region: ActiveEffect.DatabaseOperations;
  RegionBehavior: ActiveEffect.DatabaseOperations;
  RollTable: RollTable.DatabaseOperations;
  Scene: Scene.DatabaseOperations;
  Setting: Setting.DatabaseOperations;
  TableResult: TableResult.DatabaseOperations;
  Tile: TileDocument.DatabaseOperations;
  Token: TokenDocument.DatabaseOperations;
  User: User.DatabaseOperations;
  Wall: WallDocument.DatabaseOperations;
}
