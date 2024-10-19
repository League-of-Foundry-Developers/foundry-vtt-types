import type { ConfiguredDocuments } from "../../../types/configuredDocuments.d.mts";
import type { GetKey, MakeConform } from "../../../types/helperTypes.mts";
import type { DeepPartial, EmptyObject, InexactPartial, RemoveIndexSignatures } from "../../../types/utils.mts";
import type * as CONST from "../constants.mts";
import type { DataField } from "../data/fields.d.mts";
import type { fields } from "../data/module.mts";
import type { LogCompatibilityWarningOptions } from "../utils/logging.mts";
import type DataModel from "./data.mts";

export default Document;

declare const __DocumentBrand: unique symbol;

declare const __Schema: unique symbol;
declare const __ConcreteMetadata: unique symbol;
declare const __Parent: unique symbol;

/**
 * An extension of the base DataModel which defines a Document.
 * Documents are special in that they are persisted to the database and referenced by _id.
 */
declare abstract class Document<
  Schema extends DataSchema,
  ConcreteMetadata extends AnyMetadata = AnyMetadata,
  Parent extends Document.Any | null = null,
> extends DataModel<Schema, Parent> {
  static [__DocumentBrand]: never;

  [__Schema]: Schema;
  [__ConcreteMetadata]: ConcreteMetadata;
  [__Parent]: Parent;

  /**
   * @param data    - Initial data provided to construct the Document
   * @param context - Construction context options
   */
  constructor(data?: fields.SchemaField.InnerConstructorType<Schema>, context?: Document.ConstructionContext<Parent>);

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
  static get implementation(): Document.AnyConstructor;

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
   * Does this Document support additional sub-types?
   */
  static get hasTypeData(): boolean;

  /**
   * The Embedded Document hierarchy for this Document.
   */
  static get hierarchy(): Record<string, DataField.Any>;

  /**
   * Determine the collection this Document exists in on its parent, if any.
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
   * @returns A numeric permission level from CONST.DOCUMENT_OWNERSHIP_LEVELS or null
   */
  getUserLevel(user: foundry.documents.BaseUser): CONST.DOCUMENT_OWNERSHIP_LEVELS | null;

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
      } & Document.ConstructionContext<this["parent"]>
    >, // FIXME(LukeAbby): Adding Document.Stored to the return causes a recursive type error in Scene
  ): Save extends true ? Promise<this> : this;

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
   * const created = await Item.createDocuments(data, {parent: actor});
   * ```
   *
   * @example Create a Document within a Compendium pack
   * ```typescript
   * const data = [{name: "Compendium Actor", type: "character", img: "path/to/profile.jpg"}];
   * const created = await Actor.createDocuments(data, {pack: "mymodule.mypack"});
   * ```
   */
  static createDocuments<T extends Document.AnyConstructor>(
    this: T,
    data: Array<
      | fields.SchemaField.AssignmentType<InstanceType<T>["schema"]["fields"]>
      | (fields.SchemaField.AssignmentType<InstanceType<T>["schema"]["fields"]> & Record<string, unknown>)
    >,
    context: Document.ModificationContext<InstanceType<T>["parent"]> & { temporary: false },
  ): Promise<Document.Stored<InstanceType<Document.ConfiguredClass<T>>>[]>;
  static createDocuments<T extends Document.AnyConstructor>(
    this: T,
    data: Array<
      | fields.SchemaField.AssignmentType<InstanceType<T>["schema"]["fields"]>
      | (fields.SchemaField.AssignmentType<InstanceType<T>["schema"]["fields"]> & Record<string, unknown>)
    >,
    context: Document.ModificationContext<InstanceType<T>["parent"]> & { temporary: boolean },
  ): Promise<InstanceType<Document.ConfiguredClass<T>>[]>;
  static createDocuments<T extends Document.AnyConstructor>(
    this: T,
    data?: Array<
      | fields.SchemaField.AssignmentType<InstanceType<T>["schema"]["fields"]>
      | (fields.SchemaField.AssignmentType<InstanceType<T>["schema"]["fields"]> & Record<string, unknown>)
    >,
    context?: Document.ModificationContext<InstanceType<T>["parent"]>,
  ): Promise<Document.Stored<InstanceType<Document.ConfiguredClass<T>>>[]>;

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
  static updateDocuments<T extends Document.AnyConstructor>(
    this: T,
    updates?: Array<DeepPartial<Document.ConstructorDataFor<T> & Record<string, unknown>>>,
    context?: Document.ModificationContext<InstanceType<T>["parent"]> & foundry.utils.MergeObjectOptions,
  ): Promise<Document.ToConfiguredInstance<T>[]>;

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
  static deleteDocuments<T extends Document.AnyConstructor>(
    this: T,
    ids?: string[],
    context?: Document.ModificationContext<InstanceType<T>["parent"]>,
  ): Promise<Document.ToConfiguredInstance<T>[]>;

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
  static create<T extends Document.AnyConstructor>(
    this: T,
    data: Document.ConstructorDataFor<T>,
    context: Document.ModificationContext<InstanceType<T>["parent"]> & { temporary: false },
  ): Promise<Document.ToConfiguredStored<T> | undefined>;
  static create<T extends Document.AnyConstructor>(
    this: T,
    data: Document.ConstructorDataFor<T>,
    context: Document.ModificationContext<InstanceType<T>["parent"]> & { temporary: boolean },
  ): Promise<Document.ToConfiguredInstance<T> | undefined>;
  static create<T extends Document.AnyConstructor>(
    this: T,
    data: Document.ConstructorDataFor<T>,
    context?: Document.ModificationContext<InstanceType<T>["parent"]>,
  ): Promise<Document.ToConfiguredStored<T> | undefined>;

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
    data?:
      | fields.SchemaField.AssignmentType<Schema, {}>
      | (fields.SchemaField.AssignmentType<Schema, {}> & Record<string, unknown>),
    context?: Document.ModificationContext<this["parent"]> & foundry.utils.MergeObjectOptions,
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
  delete(context?: Document.ModificationContext<this["parent"]>): Promise<this | undefined>;

  /**
   * Get a World-level Document of this type by its id.
   * @param documentId - The Document ID
   * @param options    - Additional options which customize the request
   * @returns The retrieved Document, or null
   */
  static get(
    documentId: string,
    options: InexactPartial<{
      pack: string;
    }>,
  ): Document.Any | null;

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
   * @param context      - Additional context which customizes the creation workflow
   *                       (default: `{}`)
   * @returns An array of created Document instances
   */
  // Excluding FogExploration because it broke polymorphism and is never embedded. Can be removed in v12
  createEmbeddedDocuments<
    EmbeddedName extends Exclude<Document.Type, "FogExploration">,
    Temporary extends boolean = false,
  >(
    embeddedName: EmbeddedName,
    data?: Array<Document.ConstructorDataFor<Document.ConfiguredClassForName<EmbeddedName>>>,
    context?: Omit<Document.ModificationContext<this["parent"]>, "temporary"> & { temporary?: Temporary }, // Possibly a way to specify the parent here, but seems less relevant?
  ): Promise<
    Array<
      Temporary extends true
        ? Document.ConfiguredInstanceForName<EmbeddedName>
        : Document.Stored<Document.ConfiguredInstanceForName<EmbeddedName>>
    >
  >;

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
  updateEmbeddedDocuments<EmbeddedName extends Exclude<Document.Type, "FogExploration">>(
    embeddedName: EmbeddedName,
    updates?: Array<Record<string, unknown>>,
    context?: Document.ModificationContext<this["parent"]>,
  ): Promise<Array<Document.Stored<Document.ConfiguredInstanceForName<EmbeddedName>>>>;

  /**
   * Delete multiple embedded Document instances within a parent Document using provided string ids.
   * @see {@link Document.deleteDocuments}
   * @param embeddedName - The name of the embedded Document type
   * @param ids          - An array of string ids for each Document to be deleted
   * @param context      - Additional context which customizes the deletion workflow
   *                       (default: `{}`)
   * @returns An array of deleted Document instances
   */
  deleteEmbeddedDocuments<EmbeddedName extends Exclude<Document.Type, "FogExploration">>(
    embeddedName: EmbeddedName,
    ids: Array<string>,
    context?: Document.ModificationContext<this["parent"]>,
  ): Promise<Array<Document.Stored<Document.ConfiguredInstanceForName<EmbeddedName>>>>;

  /**
   * Get the value of a "flag" for this document
   * See the setFlag method for more details on flags
   *
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   * @returns The flag value
   */
  getFlag<
    S extends Document.FlagKeyOf<Document.FlagsFor<this>>,
    K extends Document.FlagKeyOf<GetKey<Document.FlagsFor<this>, S>>,
  >(scope: S, key: K): Document.GetFlag<this, S, K>;

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
    S extends keyof GetKey<this, "flags">,
    K extends keyof NonNullable<GetKey<this, "flags">>[S],
    V extends NonNullable<GetKey<this, "flags">>[S][K],
  >(scope: S, key: K, value: V): Promise<this>;

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
   * @returns A return value of false indicates the creation operation should be cancelled
   */
  protected _preCreate(
    data: fields.SchemaField.AssignmentType<Schema>,
    options: DocumentModificationOptions,
    user: foundry.documents.BaseUser,
  ): Promise<boolean | void>;

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
    options: DocumentModificationOptions,
    user: foundry.documents.BaseUser,
  ): Promise<boolean | void>;

  /**
   * Perform preliminary operations before a Document of this type is deleted.
   * Pre-delete operations only occur for the client which requested the operation.
   * @param options - Additional options which modify the deletion request
   * @param user    - The User requesting the document deletion
   * @returns A return value of false indicates the delete operation should be cancelled
   */
  protected _preDelete(options: DocumentModificationOptions, user: foundry.documents.BaseUser): Promise<boolean | void>;

  /**
   * Perform follow-up operations after a Document of this type is created.
   * Post-creation operations occur for all clients after the creation is broadcast.
   * @param data    - The data from which the document was created
   * @param options - Additional options which modify the creation request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onCreate(
    data: fields.SchemaField.InnerAssignmentType<Schema>,
    options: DocumentModificationOptions,
    userId: string,
  ): void;

  /**
   * Perform follow-up operations after a Document of this type is updated.
   * Post-update operations occur for all clients after the update is broadcast.
   * @param changed - The differential data that was changed relative to the documents prior values
   * @param options - Additional options which modify the update request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onUpdate(
    changed: fields.SchemaField.InnerAssignmentType<Schema>,
    options: DocumentModificationOptions,
    userId: string,
  ): void;

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
   */
  protected static _onCreateDocuments<T extends Document.AnyConstructor>(
    this: T,
    documents: Array<Document.ToConfiguredInstance<T>>,
    context: Document.ModificationContext<InstanceType<T>["parent"]>,
  ): Promise<void>;

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
  protected static _onUpdateDocuments<T extends Document.AnyConstructor>(
    this: T,
    documents: Array<Document.ToConfiguredInstance<T>>,
    context: Document.ModificationContext<InstanceType<T>["parent"]>,
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
  protected static _onDeleteDocuments<T extends Document.AnyConstructor>(
    this: T,
    documents: Array<Document.ToConfiguredInstance<T>>,
    context: Document.ModificationContext<InstanceType<T>["parent"]>,
  ): Promise<unknown>;

  /**
   * Configure whether V10 Document Model migration warnings should be logged for this class.
   */
  static LOG_V10_COMPATIBILITY_WARNINGS: boolean;

  /**
   * @deprecated since v10
   */
  get data(): unknown;

  /**
   * @deprecated since v11, will be removed in v13
   * @remarks "You are accessing `Document.hasSystemData` which is deprecated. Please use `Document.hasTypeData` instead."
   */
  static get hasSystemData(): boolean;

  override toObject(source: true): this["_source"];
  override toObject(source?: boolean): ReturnType<this["schema"]["toObject"]>;

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

  protected static _logV10CompatibilityWarning(options?: LogCompatibilityWarningOptions): void;
}

declare abstract class AnyDocument extends Document<any, any, any> {
  constructor(arg0: never, ...args: never[]);

  // Note(LukeAbby): Specifically adding the `__DocumentBrand` should be redundant but in practice it seems to help tsc more efficiently deduce that it's actually inheriting from `Document`.
  // This is odd but probably is because it bails from looking up the parent class properties at times or something.
  static [__DocumentBrand]: never;

  // `getFlag` does some unusual introspection on effectively `GetKey<this, "flags">`.
  // This is because not all documents have flags.
  flags?: unknown;

  getFlag(scope: never, key: never): any;
}

declare namespace Document {
  /** Any Document, except for Settings */
  type Any = Document<any, any, any>;

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
    | "Tile"
    | "Token"
    | "Wall";

  // TODO: Probably a way to auto-determine this
  type SystemType = "Actor" | "Card" | "Cards" | "Item" | "JournalEntryPage";

  // Documented at https://gist.github.com/LukeAbby/c7420b053d881db4a4d4496b95995c98
  namespace Internal {
    type Constructor = (abstract new (arg0: never, ...args: never[]) => Instance.Any) & {
      [__DocumentBrand]: never;
    };

    interface Instance<
      Schema extends DataSchema,
      ConcreteMetadata extends AnyMetadata,
      Parent extends Document.Any | null,
    > {
      [__Schema]: Schema;
      [__ConcreteMetadata]: ConcreteMetadata;
      [__Parent]: Parent;
    }

    namespace Instance {
      type Any = Instance<any, any, any>;

      type Complete<T extends Any> = T extends Document.Any ? T : never;
    }
  }

  /** Any Document, that is a child of the given parent Document. */
  type AnyChild<Parent extends Any | null> = Document<any, any, Parent>;

  type AnyConstructor = typeof AnyDocument;

  /**
   * Returns the type of the constructor data for the given {@link foundry.abstract.Document}.
   */
  type ConstructorDataFor<T extends Document.Internal.Constructor> =
    foundry.data.fields.SchemaField.InnerAssignmentType<
      T extends { defineSchema: () => infer R extends DataSchema } ? R : never
    >;

  type SystemConstructor = AnyConstructor & {
    metadata: { name: SystemType; coreTypes?: readonly string[] | undefined };
  };

  type ConfiguredClass<T extends { metadata: AnyMetadata }> = ConfiguredClassForName<T["metadata"]["name"]>;

  type ConfiguredClassForName<Name extends Type> = MakeConform<ConfiguredDocuments[Name], Document.AnyConstructor>;

  type SubTypesOf<T extends Type> =
    ConfiguredInstanceForName<T> extends { type: infer Types } ? Types : typeof foundry.CONST.BASE_DOCUMENT_TYPE;

  type ToConfiguredClass<ConcreteDocument extends Document.Internal.Constructor> = MakeConform<
    ConfiguredDocuments[NameFor<ConcreteDocument>],
    Document.AnyConstructor
  >;

  type ToConfiguredInstance<ConcreteDocument extends Document.Internal.Constructor> = MakeConform<
    // NOTE(LukeAbby): This avoids calling `Document.ToConfiguredClass` because that checks the static side of the class which can be expensive and even lead to loops.
    InstanceType<ConfiguredDocuments[NameFor<ConcreteDocument>]>,
    Document.Any
  >;

  type ToConfiguredStored<D extends Document.Internal.Constructor> = Stored<ToConfiguredInstance<D>>;

  type Stored<D extends Document.Internal.Instance.Any> = D & {
    id: string;
    _id: string;
    _source: GetKey<D, "_source"> & { _id: string };
  };

  type Temporary<D extends Document.Internal.Instance.Any> = D extends Stored<infer U> ? U : D;

  type NameFor<ConcreteDocument extends Document.Internal.Constructor> = ConcreteDocument extends {
    readonly metadata: { readonly name: infer Name extends Type };
  }
    ? Name
    : never;

  type ConfiguredInstanceForName<Name extends Type> = MakeConform<
    InstanceType<ConfiguredDocuments[Name]>,
    Document.Any
  >;

  type ConfiguredObjectClassForName<Name extends PlaceableType> = CONFIG[Name]["objectClass"];
  type ConfiguredObjectInstanceForName<Name extends PlaceableType> = InstanceType<CONFIG[Name]["objectClass"]>;

  type ConfiguredDataForName<Name extends Type> = GetKey<DataConfig, Name, EmptyObject>;

  type ConfiguredSourceForName<Name extends Type> = GetKey<SourceConfig, Name, EmptyObject>;

  type ConfiguredFlagsForName<Name extends Type> = GetKey<FlagConfig, Name, EmptyObject>;

  type ToObjectFalseType<T extends Document.Internal.Instance.Any> = T extends {
    toObject: (source: false) => infer U;
  }
    ? U
    : T;

  type SchemaFor<ConcreteDocument extends Internal.Instance.Any> =
    ConcreteDocument extends Internal.Instance<infer Schema, any, any> ? Schema : never;

  type MetadataFor<ConcreteDocument extends Internal.Instance.Any> =
    ConcreteDocument extends Internal.Instance<any, infer ConcreteMetadata, any> ? ConcreteMetadata : never;

  type CollectionRecord<Schema extends DataSchema> = {
    [Key in keyof Schema]: Schema[Key] extends fields.EmbeddedCollectionField.Any ? Schema[Key] : never;
  };

  type Flags<ConcreteDocument extends Internal.Instance.Any> = OptionsForSchema<SchemaFor<ConcreteDocument>>;

  interface OptionsInFlags<Options extends DataFieldOptions.Any> {
    readonly flags?: DataField<Options, any>;
  }

  // These  types only exists to simplify solving the `Document` type. Using `Document.Flags<this>` means the constraint `this extends Document.Any` has to be proved.
  // This is much more complex than proving the constraint for `Document.FlagsInternal<Schema>` that `Schema extends DataSchema`.

  // TODO: This needs to use the derived flags not just how they're initialized.
  type OptionsForSchema<Schema extends DataSchema> =
    RemoveIndexSignatures<Schema> extends OptionsInFlags<infer Options> ? DataField.InitializedType<Options> : never;

  // Like `keyof` but handles properties desirable for flags:
  // - `never` returns `never` (instead of `PropertyKey`)
  // - `unknown` returns `string` (instead of `never`)
  // - Strips out non string keys.
  type FlagKeyOf<T> = T extends unknown ? string : T extends never ? never : keyof T & string;

  type FlagGetKey<T, K extends PropertyKey> = K extends keyof T ? T[K] : never;

  // Note(LukeAbby): It's at times been very important for `GetFlag` to be covariant over `ConcreteDocument`.
  // If it isn't then issues arise where the `Document` type ends up becoming invaraint.
  // Currently it is actually contravariant over `ConcreteDocument` and this may cause issues (because of the usage of `keyof`).
  // Unfortunately it's not easy to avoid because the typical `GetKey` trick has issues between `never`, not defined at all, and `unknown` etc.
  type GetFlag<ConcreteDocument extends Internal.Instance.Any, S extends string, K extends string> = FlagGetKey<
    FlagGetKey<Document.FlagsFor<ConcreteDocument>, S>,
    K
  >;

  type FlagsFor<ConcreteDocument extends Internal.Instance.Any> = GetKey<ConcreteDocument, "flags", never>;

  interface ConstructionContext<Parent extends Document.Any | null> {
    /**
     * The parent Document of this one, if this one is embedded
     * @defaultValue `null`
     */
    parent?: Parent | null;

    /**
     * The compendium collection ID which contains this Document, if any
     * @defaultValue `null`
     */
    pack?: string | null;

    /**
     * Whether to validate initial data strictly?
     * @defaultValue `true`
     */
    strict?: boolean;
  }

  interface ModificationContext<Parent extends Document.Any | null> {
    /**
     * A parent Document within which these Documents should be embedded
     */
    parent?: Parent | null;

    /**
     * A Compendium pack identifier within which the Documents should be modified
     */
    pack?: string;

    /**
     * Block the dispatch of preCreate hooks for this operation
     * @defaultValue `false`
     */
    noHook?: boolean;

    /**
     * Return an index of the Document collection, used only during a get operation.
     * @defaultValue `false`
     */
    index?: boolean;

    /**
     * An array of fields to retrieve when indexing the collection
     */
    indexFields?: string[];

    /**
     * When performing a creation operation, keep the provided _id instead of clearing it.
     * @defaultValue `false`
     */
    keepId?: boolean;

    /**
     * When performing a creation operation, keep existing _id values of documents embedded within the one being created instead of generating new ones.
     * @defaultValue `true`
     */
    keepEmbeddedIds?: boolean;

    /**
     * Create a temporary document which is not saved to the database. Only used during creation.
     * @defaultValue `false`
     */
    temporary?: boolean;

    /**
     * Automatically re-render existing applications associated with the document.
     * @defaultValue `true`
     */
    render?: boolean;

    /**
     * Automatically create and render the Document sheet when the Document is first created.
     * @defaultValue `false`
     */
    renderSheet?: boolean;

    /**
     * Difference each update object against current Document data to reduce the size of the transferred data. Only used during update.
     * @defaultValue `true`
     */
    diff?: boolean;

    /**
     * Merge objects recursively. If false, inner objects will be replaced explicitly. Use with caution!
     * @defaultValue `true`
     */
    recursive?: boolean;

    /**
     * Is the operation undoing a previous operation, only used by embedded Documents within a Scene
     */
    isUndo?: boolean;

    /**
     * Whether to delete all documents of a given type, regardless of the array of ids provided. Only used during a delete operation.
     */
    deleteAll?: boolean;
  }

  /**
   * @deprecated {@link Type | `Document.Type`}
   */
  type TypeName = Document.Type;

  /**
   * @deprecated {@link Document.PlaceableType | `Document.PlaceableType`}
   */
  type PlaceableTypeName = Document.PlaceableType;
}

export type DocumentModificationOptions = Omit<Document.ModificationContext<Document.Any | null>, "parent" | "pack">;

export interface Context<Parent extends Document.Any | null> {
  /**
   * A parent document within which this Document is embedded
   */
  parent?: Parent | undefined;

  /**
   * A named compendium pack within which this Document exists
   */
  pack?: string | undefined;
}

export type AnyMetadata = Metadata<any>;

export interface Metadata<ConcreteDocument extends Document.Any> {
  name: Document.TypeName;
  collection: string;
  indexed?: boolean | undefined;
  compendiumIndexFields?: string[] | undefined;
  label: string;
  coreTypes?: readonly string[] | undefined;
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
  preserveOnImport?: readonly string[] | undefined;
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
