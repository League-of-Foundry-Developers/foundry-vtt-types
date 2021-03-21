/**
 * An abstract class pattern for all primary data entities within the Foundry VTT Framework. An entity represents a
 * primary data concept, for example: Actor, Item, Scene, or ChatMessage. Each Entity type in Foundry Virtual
 * Tabletop extends this base Entity class which ensures similar behavior and workflow across all entity types.
 *
 * Documentation for this class is provided for reference, but developers should not extend this class directly,
 * instead work with or extend the Entity implementations that are referenced in this section of the API documentation.
 *
 * Entities are instantiated by providing their base data, and an optional Array of Application instances which should
 * be automatically refreshed when the Entity experiences an update.
 *
 * @see {@link EntityCollection} The EntityCollection abstract class which contains Entity instances.
 * @see {@link Actor} The Actor Entity.
 * @see {@link Combat} The Combat Encounter Entity.
 * @see {@link Folder} The Folder Entity.
 * @see {@link Item} The Item Entity.
 * @see {@link JournalEntry} The Journal Entry Entity.
 * @see {@link ChatMessage} The Chat Message Entity.
 * @see {@link Playlist} The Audio Playlist Entity.
 * @see {@link Scene} The Scene Entity.
 * @see {@link RollTable} The Rollable Table Entity.
 * @see {@link User} The User Entity.
 * @see {@link Compendium} The Compendium which may contain Entities in a compendium pack.
 *
 * @typeParam D  - The type of the `Entity`s `_data` field. It should extend Entity.Data
 * @typeParam PD - The type of `Entity`s `data` field after `prepareData` has been called. It should extend `D`.
 *
 * @example
 * ```typescript
 * let actorData = {name: "John Doe", type: "character", img: "icons/svg/mystery- man.svg"}
 * let actor = new Actor(actorData)
 * ```
 */
declare abstract class Entity<D extends Entity.Data = Entity.Data, PD extends D = D> {
  /**
   * @param data       - The data Object with which to create the Entity
   * @param options    - Additional options which modify the created Entity behavior
   * @param compendium - A reference to the Compendium pack from which this Entity was drawn.
   */
  constructor(data?: DeepPartial<D>, options?: Entity.CreateOptions);

  /**
   * The original source data for the Entity provided upon initialization.
   * This reflects the database state of the Entity before any transformations are applied.
   * @defaultValue `{}`
   */
  _data: D;

  /**
   * The effective data for the Entity.
   * This data object may have transformations applied to it.
   * @defaultValue `this._data`
   */
  data: PD;

  /**
   * The options object that was used to configure the Entity upon initialization.
   * @defaultValue `{}`
   */
  options: Entity.CreateOptions;

  /**
   * A collection of Application instances which should be re- rendered whenever this Entity experiences an update to
   * its data. The keys of this object are the application ids and the values are Application instances. Each
   * Application in this object will have its render method called by {@link Entity#render}.
   * @see Entity#render
   * @defaultValue `{}`
   */
  apps: Application[];

  /**
   * The Entity may optionally belong to a parent Compendium pack. If so this attribute will contain a reference
   * to that Compendium object. Otherwise null.
   * @defaultValue `null`
   */
  compendium: Compendium | null;

  /**
   * Safely Initialize data structure for the Entity.
   * Errors that occur here should be captured and logged, but should not break construction of the Entity instance.
   */
  protected _initialize(): void;

  /**
   * Configure the attributes of this Entity class
   * @param baseEntity - The parent class which directly inherits from the Entity interface.
   * @param collection - The Collection instance to which Entities of this type belong.
   * @param embeddedEntities - The names of any Embedded Entities within the Entity data structure.
   *
   * @remarks This method is abstract on Entity.
   */
  static get config(): Entity.Config;

  /**
   * A Universally Unique Identifier (uuid) for this Entity instance
   */
  get uuid(): string;

  /**
   * Return a string which represents a dynamic link to this Entity.
   */
  get link(): string;

  /**
   * Prepare data for the Entity whenever the instance is first created or later updated.
   * This method can be used to derive any internal attributes which are computed in a formulaic manner.
   * For example, in a d20 system - computing an ability modifier based on the value of that ability score.
   */
  prepareData(): PD | void;

  /**
   * Prepare Embedded Entities which exist within this parent Entity.
   * For example, in the case of an Actor, this method is responsible for preparing the Owned Items the Actor contains.
   * @remarks
   * This is abstract on Entity and needs to be implemented, when the Entity subclass includes embedded Entities.
   */
  prepareEmbeddedEntities(): void;

  /**
   * Obtain a reference to the Array of source data within the data object for a certain Embedded Entity name
   * @param embeddedName - The name of the Embedded Entity type
   */
  getEmbeddedCollection(embeddedName: string): any[]; // TODO maybe add general Entity data and return this here

  /**
   * Render all of the Application instances which are connected to this Entity by calling their respective
   * {@link Application#render} methods.
   * @param force   - Force rendering
   *                  (default: `false`)
   * @param context - Optional context
   *                  (default: `{}`)
   */
  render(force?: boolean, context?: Entity.RenderOptions): void;

  /**
   * Return a reference to the EntityCollection instance which stores Entity instances of this type. This property is
   * available as both a static and instance method and should be overridden by subclass Entity implementations.
   * @remarks This method is abstract on Entity.
   */
  static get collection(): EntityCollection;

  get collection(): EntityCollection;

  /**
   * The class name of the base Entity type, for example "Actor". This is useful in cases where there is an inheritance
   * chain. Many places throughout the framework rely upon the canonical entity name which may not always be equal
   * to the class name. This property is available as both a static and instance method.
   *
   * @example
   * ```typescript
   * class Actor2ndGen extends Actor<Actor2ndGenData, Item2ndGen> {...}
   * Actor2ndGen.entity // "Actor"
   * ```
   */
  static get entity(): string;

  get entity(): string;

  /**
   * A convenience accessor for the _id attribute of the Entity data object.
   */
  get id(): string;

  get _id(): string;

  /**
   * A convenience accessor for the name attribute of the Entity data object
   */
  get name(): string;

  /**
   * A property which gets or creates a singleton instance of the sheet class used to render and edit data for this
   * particular entity type.
   *
   * @example <caption>A subclass of the Actor entity</caption>
   * ```typescript
   * if (game.actors === undefined) throw "Too early to use entity collections";
   * let actor = game.actors.get(actorId);
   * if (actor === undefined) return;
   * actor.sheet // ActorSheet
   * ```
   */
  get sheet(): BaseEntitySheet<BaseEntitySheet.Options, BaseEntitySheet.Data<this>, this> | null;

  /**
   * Obtain a reference to the BaseEntitySheet implementation which should be used to render the Entity instance
   * configuration sheet.
   */
  protected get _sheetClass(): ConstructorOf<FormApplication> | null;

  /**
   * Return a reference to the Folder which this Entity belongs to, if any.
   *
   * @example <caption>Entities may belong to Folders</caption>
   * ```typescript
   * if (game.folders === undefined) throw "Too early to use entity collections";
   * let folder = game.folders.entities[0]
   * let actor = await Actor.create({name: "New Actor", folder: folder.id})
   * console.log(actor?.data.folder) // folder.id;
   * console.log(actor?.folder) // folder;
   * ```
   */
  get folder(): Folder | null | undefined;

  /**
   * Return the permission level that the current game User has over this Entity.
   * See the CONST.ENTITY_PERMISSIONS object for an enumeration of these levels.
   *
   * @example
   * ```typescript
   * if (game.user === null) throw "Too early to use game.user";
   * game.user.id // "dkasjkkj23kjf"
   * entity.data.permission // {default: 1, "dkasjkkj23kjf": 2};
   * entity.permission // 2
   * ```
   */
  get permission(): Const.EntityPermission;

  /**
   * A boolean indicator for whether or not the current game User has ownership rights for this Entity.
   * This property has a setter which allows for ownership rights to be temporarily overridden on a per- instance basis.
   */
  get owner(): boolean;

  /**
   * A boolean indicator for whether or not the current game User has at least limited visibility for this Entity.
   */
  get visible(): boolean;

  /**
   * A boolean indicator for whether the current game user has ONLY limited visibility for this Entity.
   * Note that a GM user's perspective of an Entity is never limited.
   */
  get limited(): boolean;

  /**
   * Return an array of User entities who have a certain permission level or greater to the Entity.
   * @param permission - The permission level or level name to test
   * @param exact      - Tests for an exact permission level match, by default this method tests for
   *        an equal or greater permission level
   * @returns An array of User entities who match the permission level
   */
  getUsers(permission: string | number, exact?: boolean): User[];

  /**
   * Test whether a provided User a specific permission level (or greater) over the Entity instance
   * @param user       - The user to test for permission
   * @param permission - The permission level or level name to test
   * @param exact      - Tests for an exact permission level match, by default this method tests for an equal or greater permission level.
   *
   * @example <caption>Test whether a specific user has a certain permission</caption>
   * ```typescript
   * // These two are equivalent
   * entity.hasPerm(game.user, "OWNER")
   * entity.owner
   * // These two are also equivalent
   * entity.hasPerm(game.user, "LIMITED", true)
   * entity.limited
   * ```
   */
  hasPerm(user: User, permission: string | number, exact?: boolean): boolean;

  /**
   * Test whether a given User has permission to perform some action on this Entity
   * @param user   - The User requesting creation
   * @param action - The attempted action
   * @param target - The targeted Entity
   */
  static can(user: User, action: string, target: Entity): boolean;

  /**
   * Test whether a given User has permission to perform some action on this Entity
   * @param user   - The User to test
   * @param action - The name of the action
   * @remarks
   * args is untyped because of a mismatch between most entities and User that is likely to be fixed in Foundry 0.8.x
   *
   */
  can(...args: any): boolean;
  // TODO: This is intentionally untyped. This is a known issue that will likely be fixed in 0.8.x

  /**
   * Test for whether this Entity can be owned by any non-gamemaster player.
   */
  get hasPlayerOwner(): boolean;

  /**
   * Activate the Socket event listeners used to receive responses from events which modify database documents
   * @param socket - The active game socket
   */
  static activateSocketListeners(socket: SocketIOClient.Socket): void;

  /**
   * Create one or multiple new entities using provided input data.
   * Data may be provided as a single object to create one Entity, or as an Array of Objects.
   * Entities may be temporary (unsaved to the database) by passing the temporary option as true.
   *
   * @param data    - A Data object or array of Data
   * @param options - Additional options which customize the creation workflow
   *
   * @example
   * ```typescript
   * const data = {name: "New Entity", type: "character", img: "path/to/profile.jpg"};
   * const created: Actor | null = await Actor.create(data); // Returns one Entity, saved to the database
   * const temp: Actor | null = await Actor.create(data, {temporary: true}); // Not saved to the database
   * ```
   *
   * @example
   * ```typescript
   * const data = [{name: "Tim", type: "npc"}, {name: "Tom", type: "npc"}];
   * const created: Actor[] | Actor | null = await Actor.create(data); // Returns an Array of Entities, saved to the database
   * const created: Actor[] | Actor | null = await Actor.create(data, {temporary: true}); // Not saved to the database
   * ```
   */
  static create<T extends Entity, U>(
    this: ConstructorOf<T>,
    data: Expanded<U> extends DeepPartial<T['_data']> ? U : DeepPartial<T['_data']>,
    options?: Entity.CreateOptions
  ): Promise<T | null>;
  static create<T extends Entity, U>(
    this: ConstructorOf<T>,
    data: Expanded<U> extends DeepPartial<T['_data']> ? ReadonlyArray<U> : ReadonlyArray<DeepPartial<T['_data']>>,
    options?: Entity.CreateOptions
  ): Promise<T | T[] | null>;

  /**
   * Handle a SocketResponse from the server when one or multiple Entities are created
   * @param request - The initial request
   * @param result  - An Array of created Entity data
   * @param userId  - The id of the requesting User
   */
  protected static _handleCreate<T extends Entity>(this: ConstructorOf<T>, { request, result, userId }: any): T[];

  /**
   * Entity- specific actions that should occur when the Entity is first created
   */
  protected _onCreate(data: PD, options: any, userId: string): void;

  /**
   * Update one or multiple existing entities using provided input data.
   * Data may be provided as a single object to update one Entity, or as an Array of Objects.
   *
   * @param data    - A Data object or array of Data. Each element must contain the _id of an existing Entity.
   * @param options - Additional options which customize the update workflow
   *
   * @example
   * ```typescript
   * const data = {_id: "12ekjf43kj2312ds", name: "New Name"}}
   * const updated = await Actor.update(data) // Updated entity saved to the database
   * ```
   *
   * @example
   * ```typescript
   * const data = [{_id: "12ekjf43kj2312ds", name: "New Name 1"}, {_id: "kj549dk48k34jk34", name: "New Name 2"}]}
   * const updated = await Actor.update(data); // Returns an Array of Entities, updated in the database
   * ```
   */
  static update<T extends Entity, U>(
    this: ConstructorOf<T>,
    data: Expanded<U> extends DeepPartial<T['_data']> ? U & { _id: string } : DeepPartial<T['_data']> & { _id: string },
    options?: Entity.UpdateOptions
  ): Promise<T | []>;
  static update<T extends Entity, U>(
    this: ConstructorOf<T>,
    data: Expanded<U> extends DeepPartial<T['_data']>
      ? ReadonlyArray<U & { _id: string }>
      : ReadonlyArray<DeepPartial<T['_data']> & { _id: string }>,
    options?: Entity.UpdateOptions
  ): Promise<T | T[]>;

  /**
   * Handle a SocketResponse from the server when one or multiple Entities are updated
   * @param request - The initial request
   * @param result  - An Array of updated Entity data
   * @param userId  - The id of the requesting User
   */
  protected static _handleUpdate<T extends Entity>(this: ConstructorOf<T>, { request, result, userId }: any): T[];

  /**
   * Entity-specific actions that should occur when the Entity is updated
   */
  protected _onUpdate(data: DeepPartial<D>, options: Entity.UpdateOptions, userId: string): void;

  /**
   * Update the current Entity using provided input data.
   * Data must be provided as a single object which updates the Entity data.
   * @see Entity.update
   *
   * @param data    - A Data object which updates the Entity
   * @param options - Additional options which customize the update workflow
   */
  update<U>(data: Expanded<U> extends DeepPartial<D> ? U : never, options?: Entity.UpdateOptions): Promise<this>;
  update(data: DeepPartial<D>, options?: Entity.UpdateOptions): Promise<this>;

  /**
   * Delete one or multiple existing entities using provided ids.
   * The target ids may be a single string or an Array of strings.
   *
   * @param data    - A single id or Array of ids
   * @param options - Additional options which customize the deletion workflow
   *
   *
   * @example
   * ```typescript
   * const id = "12ekjf43kj2312ds"
   * const deleted = await Entity.delete(id) // A single deleted entity from the database
   * ```
   *
   * @example
   * ```typescript
   * const ids = ["12ekjf43kj2312ds", "kj549dk48k34jk34"]
   * const deleted = await Entity.delete(ids) // Returns an Array of deleted Entities
   * ```
   */
  static delete<T extends Entity>(
    this: ConstructorOf<T>,
    data: string,
    options?: Entity.DeleteOptions
  ): Promise<T | null>;
  static delete<T extends Entity>(
    this: ConstructorOf<T>,
    data: ReadonlyArray<string>,
    options?: Entity.DeleteOptions
  ): Promise<T | T[] | null>;

  /**
   * Handle a SocketResponse from the server when one or multiple Entities are deleted
   * @param request - The initial request
   * @param result  - An Array of deleted Entity ids
   * @param userId  - The id of the requesting User
   */
  protected static _handleDelete<T extends Entity>(this: ConstructorOf<T>, { request, result, userId }: any): T[];

  /**
   * Entity- specific actions that should occur when the Entity is deleted
   */
  protected _onDelete(options: Entity.DeleteOptions, userId: string): void;

  /**
   * Delete the current Entity.
   * @see Entity.delete
   *
   * @param options - Options which customize the deletion workflow
   */
  delete(options?: Entity.DeleteOptions): Promise<this>;

  /**
   * Get an Embedded Entity by it's id from a named collection in the parent Entity.
   *
   * @param embeddedName - The name of the Embedded Entity type to retrieve
   * @param id           - The numeric ID of the child to retrieve
   * @param strict       - Throw an Error if the requested id does not exist, otherwise return null. Default false.
   */
  getEmbeddedEntity(embeddedName: string, id: string, { strict }?: { strict?: boolean }): any;

  /**
   * Create one or multiple EmbeddedEntities within this parent Entity.
   * Data may be provided as a single Object to create one EmbeddedEntity or as an Array of Objects to create many.
   * Entities may be temporary (unsaved to the database) by passing the temporary option as true.
   *
   * @param embeddedName - The name of the Embedded Entity class to create
   * @param data         - A Data object or an Array of Data objects to create
   * @param options      - Additional creation options which modify the request
   *
   * @example
   * ```typescript
   * if (game.actors === undefined) throw "Too early to use an enitity collection";
   * const actor = game.actors.get("dfv934kj23lk6h9k");
   * if (actor === null) return;
   * const data = {name: "Magic Sword", type: "weapon", img: "path/to/icon.png"};
   * const created = await actor.createEmbeddedEntity("OwnedItem", data); // Returns one EmbeddedEntity, saved to the Actor
   * const temp = await actor.createEmbeddedEntity("OwnedItem", data, {temporary: true}); // Not saved to the Actor
   * ```
   *
   * @example
   * ```typescript
   * if (game.actors === undefined) throw "Too early to use an enitity collection";
   * const actor = game.actors.get("dfv934kj23lk6h9k");
   * if (actor === null) return;
   * const data = [{name: "Mace of Crushing", type: "weapon"}, {name: "Shield of Defense", type: "armor"}];
   * const created = await actor.createEmbeddedEntity("OwnedItem", data); // Returns an Array of EmbeddedEntities, saved to the Actor
   * const temp = await actor.createEmbeddedEntity("OwnedItem", data, {temporary: true}); // Not saved to the Actor
   * ```
   */
  createEmbeddedEntity(embeddedName: string, data: any, options?: Entity.CreateOptions): Promise<any>;

  /**
   * Handle a SocketResponse from the server when one or multiple Embedded Entities are created
   * @param request - The initial request
   * @param result  - An Array of created Entity data
   * @param userId  - The id of the requesting User
   */
  protected static _handleCreateEmbeddedEntity({ request, result, userId }: any): any[];

  /**
   * Handle Embedded Entity creation within this Entity with specific callback steps.
   * This function is triggered once per EmbeddedEntity which is updated.
   * It therefore may run multiple times per creation workflow.
   * Any steps defined here should run on a per- EmbeddedEntity basis.
   * Steps that should run once for the whole batch should go in _onModifyEmbeddedEntity()
   */
  protected _onCreateEmbeddedEntity(embeddedName: string, child: any, options: any, userId: string): void;

  /**
   * Update one or multiple existing entities using provided input data.
   * Data may be provided as a single object to update one Entity, or as an Array of Objects.
   *
   * @param embeddedName - The name of the Embedded Entity class to create
   * @param data         - A Data object or array of Data. Each element must contain the _id of an existing Entity.
   * @param options      - Additional options which customize the update workflow
   *
   * @example
   * ```typescript
   * if (game.actors === undefined) throw "too early to use an enitity collection";
   * const actor = game.actors.get("dfv934kj23lk6h9k");
   * if (actor === undefined) return;
   * const item = actor.data.items.find(i => i.name === "magic sword");
   * if (item === undefined) return;
   * const update = {_id: item._id, name: "magic sword +1"};
   * const updated = await actor.updateEmbeddedEntity("owneditem", update); // updates one embeddedentity
   * ```
   *
   * @example
   * ```typescript
   * if (game.actors === undefined) throw "Too early to use an enitity collection";
   * const actor = game.actors.get("dfv934kj23lk6h9k");
   * if (actor === undefined) return;
   * const weapons = actor.data.items.filter(i => i.type === "weapon");
   * const updates = weapons.map(i => {
   *   return {_id: i._id, name: i.name + "+1"};
   * });
   * const updated = await actor.updateEmbeddedEntity("OwnedItem", updates); // Updates multiple EmbeddedEntity objects
   * ```
   */
  updateEmbeddedEntity(embeddedName: string, data: any, options?: Entity.UpdateOptions): Promise<any>;
  updateEmbeddedEntity(embeddedName: string, data: any[], options?: Entity.UpdateOptions): Promise<any[]>;

  /**
   * Handle a SocketResponse from the server when one or multiple Embedded Entities are updated
   * @param request - The initial request
   * @param result  - An Array of updated Entity data
   * @param userId  - The id of the requesting User
   */
  protected static _handleUpdateEmbeddedEntity({ request, result, userId }: any): any[];

  /**
   * Handle Embedded Entity updates within this Entity with specific callback steps.
   * This function is triggered once per EmbeddedEntity which is updated.
   * It therefore may run multiple times per creation workflow.
   * Any steps defined here should run on a per- EmbeddedEntity basis.
   * Steps that should run once for the whole batch should go in _onModifyEmbeddedEntity()
   */
  protected _onUpdateEmbeddedEntity(
    embeddedName: string,
    child: any,
    updateData: any,
    options: any,
    userId: string
  ): void;

  /**
   * Delete one or multiple existing EmbeddedEntity objects using provided input data.
   * Data may be provided as a single id to delete one object or as an Array of string ids.
   *
   * @param embeddedName - The name of the Embedded Entity class to create
   * @param data         - A Data object or array of Data. Each element must contain the _id of an existing Entity.
   * @param options      - Additional options which customize the update workflow
   *
   * @example
   * ```typescript
   * if (game.actors === undefined) throw "Too early to use an enitity collection";
   * const actor = game.actors.get("dfv934kj23lk6h9k");
   * if (actor === undefined) return;
   * const item = actor.data.items.find(i => i.name === "Magic Sword");
   * if (item === undefined) return;
   * const deleted = await actor.deleteEmbeddedEntity("OwnedItem", item._id); // Deletes one EmbeddedEntity
   * ```
   *
   * @example
   * ```typescript
   * if (game.actors === undefined) throw "Too early to use an enitity collection";
   * const actor = game.actors.get("dfv934kj23lk6h9k");
   * if (actor === undefined) return;
   * const weapons = actor.data.items.filter(i => i.type === "weapon");
   * const deletions = weapons.map(i => i._id);
   * const deleted = await actor.deleteEmbeddedEntity("OwnedItem", deletions); // Deletes multiple EmbeddedEntity objects
   * ```
   */
  deleteEmbeddedEntity(embeddedName: string, data: any, options?: Entity.DeleteOptions): Promise<any | any[]>;

  /**
   * Handle a SocketResponse from the server when one or multiple Embedded Entities are deleted
   * @param request - The initial request
   * @param result  - An Array of deleted EmbeddedEntity ids
   * @param userId  - The id of the requesting User
   */
  protected static _handleDeleteEmbeddedEntity({ request, result, userId }: any): any[];

  /**
   * Handle Embedded Entity deletion within this Entity with specific callback steps.
   * This function is triggered once per EmbeddedEntity which is updated.
   * It therefore may run multiple times per creation workflow.
   * Any steps defined here should run on a per- EmbeddedEntity basis.
   * Steps that should run once for the whole batch should go in _onModifyEmbeddedEntity()
   */
  protected _onDeleteEmbeddedEntity(embeddedName: string, child: any, options: any, userId: string): void;

  /**
   * A generic helper since we take the same actions for every type of Embedded Entity update
   * Unlike the specific _onCreate, _onUpdate, and _onDelete methods this only runs once per updated batch
   */
  protected _onModifyEmbeddedEntity(
    embeddedName: string,
    changes: any[],
    options: any,
    userId: string,
    context?: any
  ): void;

  /**
   * Get the value of a "flag" for this Entity
   * See the setFlag method for more details on flags
   *
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   */
  getFlag(scope: string, key: string): unknown;

  /**
   * Assign a "flag" to this Entity.
   * Flags represent key- value type data which can be used to store flexible or arbitrary data required by either
   * the core software, game systems, or user- created modules.
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
   *
   */
  setFlag(scope: string, key: string, value: unknown): Promise<this>;

  /**
   * Remove a flag assigned to the Entity
   * @param scope - The flag scope which namespaces the key
   * @param key   - The flag key
   */
  unsetFlag(scope: string, key: string): Promise<this>;

  /**
   * Sort this Entity relative a target by providing the target, an Array of siblings and other options.
   * If the Entity has an rendered sheet, record the sort change as part of a form submission
   * See SortingHelper.performIntegerSort for more details
   */
  sortRelative({
    target,
    siblings,
    sortKey,
    sortBefore,
    updateData
  }: {
    target?: Entity | null;
    siblings?: Entity[];
    sortKey?: string;
    sortBefore?: boolean;
    updateData?: any;
  }): Promise<void>;

  /**
   * Clone an Entity, creating a new Entity using the current data as well as provided creation overrides.
   *
   * @param createData - Additional data which overrides current Entity data at the time of creation
   * @param options - Additional creation options passed to the Entity.create method
   * @returns A Promise which resolves to the created clone Entity
   */
  clone(createData?: DeepPartial<D>, options?: Entity.CreateOptions): Promise<this>;

  /**
   * Serializing an Entity should simply serialize it's inner data, not the entire instance
   */
  toJSON(): D;

  /**
   * Export entity data to a JSON file which can be saved by the client and later imported into a different session
   */
  exportToJSON(): void;

  /**
   * A helper function to handle obtaining the dropped Entity data from a dropped event. Entity drop data could have:
   * 1. A compendium pack and entry id
   * 2. A World Entity _id
   * 3. A data object explicitly provided
   *
   * @param data - The data object extracted from a DataTransfer event
   */
  static fromDropData<
    T extends Entity,
    U extends { data: DeepPartial<T['_data']> } | { pack: string } | { id: string }
  >(
    this: ConstructorOf<T>,
    data: U
  ): U extends { data: DeepPartial<T['_data']> }
    ? Promise<T>
    : U extends { id: string }
    ? Promise<T | null>
    : Promise<T | undefined | null>;

  /**
   * Import data and update this entity
   * @param json - JSON data string
   */
  importFromJSON(json: string): Promise<this>;

  /**
   * Render an import dialog for updating the data related to this Entity through an exported JSON file
   */
  importFromJSONDialog(): Promise<void>;

  /**
   * Transform the Entity data to be stored in a Compendium pack.
   * Remove any features of the data which are world- specific.
   * This function is asynchronous in case any complex operations are required prior to exporting.
   */
  toCompendium(): Promise<Omit<Duplicated<D>, '_id' | 'permission' | 'folder' | 'sort' | 'active'>>;

  /**
   * Provide a Dialog form to create a new Entity of this type.
   * Choose a name and a type from a select menu of types.
   * @param data - Initial data with which to populate the creation form
   * @param options - Initial positioning and sizing options for the dialog form
   */
  static createDialog(
    data?: { name?: string; folder?: string; type?: string },
    options?: Partial<Dialog.Options>
  ): Promise<Entity>;
}

declare namespace Entity {
  /**
   * Common {@link Entity} create options
   */
  interface CreateOptions {
    [propName: string]: any;

    compendium?: Compendium;

    /**
     * Block the dispatch of preCreate hooks for this operation.
     * @defaultValue `false`
     */
    noHook?: boolean;

    /**
     * Display the sheet for the created entity once it is created.
     * @defaultValue `false`
     */
    renderSheet?: boolean;

    /**
     * Create a temporary entity which is not saved to the world database.
     * @defaultValue `false`
     */
    temporary?: boolean;
  }

  /**
   * Common {@link Entity} delete options
   */
  interface DeleteOptions {
    [propName: string]: any;

    /**
     * Block the dispatch of preDelete hooks for this operation.
     * @defaultValue `false`
     */
    noHook?: boolean;
  }

  /**
   * Common {@link Entity} update options
   */
  interface UpdateOptions {
    [propName: string]: any;

    /**
     * Difference the provided data against the current to eliminate unnecessary
     * changes.
     * @defaultValue `true`
     */
    diff?: boolean;

    /**
     * Block the dispatch of preUpdate hooks for this operation.
     * @defaultValue `false`
     */
    noHook?: boolean;
  }

  interface Config<E extends Entity = Entity> {
    baseEntity: ConstructorOf<E>;
    collection?: EntityCollection<E>;
    embeddedEntities?: {
      [embedType: string]: string;
    };
    label?: string;
    permissions?: {
      [propName: string]: string;
    };
  }

  interface Permission {
    [userId: string]: number;
    default: number;
  }

  /**
   * Data structure common to all entities
   */
  interface Data {
    /**
     * The id assigned by the database
     */
    _id: string;

    /**
     * Flags for arbitrary data from modules &c.
     */
    flags: Record<string, unknown>;

    folder?: string;

    name?: string;

    permission?: Permission;

    type?: any;
  }

  interface RenderOptions extends Application.RenderOptions {
    data: {
      permission: unknown;
    };
  }
}
