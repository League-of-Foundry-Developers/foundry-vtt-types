/**
 * An abstract class pattern for all primary data entities within the Foundry VTT Framework
 * An entity represents a primary data concept, for example: Actor, Item, Scene, or ChatMessage.
 * Employing this abstraction layer ensures similar behavior and workflow for all entity types.
 *
 * Documentation for this class is provided for reference, but developers should not extend this class directly,
 * instead work with or extend the Entity implementations that are referenced in this section of the API documentation.
 *
 * Entities are instantiated by providing their base data, and an optional Array of Application instances which should
 * be automatically refreshed when the Entity experiences an update.
 *
 * @param data		The data Object with which to create the Entity
 * @param options	Additional options which modify the created Entity behavior
 *
 * @example
 * let actorData = {name: "John Doe", type: "character", img: "icons/mystery-man.png"};
 * let actor = new Actor(actorData);
 */
declare class Entity {
	constructor(data: object, options: object);

	/**
	 * The parent class name of the base entity type.
	 * For subclass Entities, this will examine the inheritance chain and return the base type.
	 *
	 * @example
	 * class Actor2ndGen extends Actor {
	 *   // ...
	 * }
	 * Actor2ndGen.entity    // Actor
	 */
	static get entity(): Entity;

	/**
	 * A instance-level convenience accessor for the class-level entity property
	 */
	get entity(): Entity;

	/**
	 * A convenience accessor for the _id attribute of the Entity data object
	 */
	get id(): string;

	/**
	 * A convenience accessor for the name attribute of the Entity data object
	 */
	get name(): string;

	/**
	 * Return a reference to the Collection class which stores Entity instances of this type.
	 * This property should be overridden by child class implementations.
	 */
	static get collection(): Collection;

	/**
	 * Return a reference to the Collection class which stores Entity instances of this type.
	 * This property simply references the static class property for convenience.
	 */
	get collection(): Collection;

	/**
	 * A property which gets or creates a singleton instance of the sheet class used to render and edit data for this
	 * particular entity type.
	 *
	 * @example
	 * let actor = game.entities.actors[0];
	 * actor.sheet      // ActorSheet
	 */
	get sheet(): BaseEntitySheet;

	/**
	 * Return a reference to the Folder which this Entity belongs to, if any
	 */
	get folder(): Folder | null;

	/**
	 * Return the permission level that the current game User has over this Entity.
	 * See the CONST.ENTITY_PERMISSIONS object for an enumeration of these levels.
	 */
	get permission(): number;

	/**
	 * A boolean indicator for whether or not the current game User has ownership rights for this Entity
	 * This property has a setter which allows for ownership rights to be overridden specifically on a per-instance basis
	 */
	get owner(): boolean;

	/**
	 * A boolean indicator for whether or not the current game User has at least limited visibility for this Entity.
	 */
	get visible(): boolean;

	/**
	 * A boolean indicator for whether the current game user has ONLY limited visibility for this Entity.
	 */
	get limited(): boolean;

	/**
	 * Prepare data for the Entity whenever the instance is first created or later updated.
	 * This method can be used to derive any internal attributes which are computed in a formulaic manner.
	 * For example, in a d20 system - computing an ability modifier based on the value of that ability score.
	 *
	 * @param data	The original data before additional preparation
	 * @return		The updated data with new prepared attributes
	 */
	prepareData(data: object): object;

	/**
	 * Render all of the applications which are connected to this Entity
	 * @param args	Variable arguments which are forwarded to each Application.render() call
	 */
	render(...args: any): void;

	/**
	 * Test whether a provided User has ownership permission over the Entity instance
	 *
	 * @param user			The user to test for permission
	 * @param permission	The permission level to test
	 * @param exact			Tests for an exact permission level match, by default this method tests for an equal
	 * 						or greater permission level.
	 * @return				Whether or not the user has the permission for this Entity
	 */
	hasPerm(user: User, permission: number, exact: boolean): boolean;

	/**
	 * Create a new entity using provided input data
	 * The data for entity creation is typically provided from the server through the 'create<Entity>' socket
	 * Alternatively, the creation event may originate locally and the new entity can be pushed back to the server
	 *
	 * @param data					The data with which to create the entity
	 * @param options				Additional options which customize the creation workflow
	 * @param options.temporary		Create a temporary entity which is not saved to the world database.
	 * 								Default is false.
	 * @param options.displaySheet	Show the configuration sheet for the created entity once it is created.
	 *								Default is true.
	 * 
	 * @return						A Promise which resolves to contain the created Entity     
	 */
	static create(data: object, options: object): Promise<Entity>;

	/**
	 * Update the current entity using new data
	 * This new data is typically provided from the server through the 'update<Entity>' socket
	 * Alternatively, the update may originate locally, in which case it can be pushed back to the server
	 *
	 * @param data			The data with which to update the entity
	 * @param options		Additional options which customize the update workflow
	 * @param options.diff	Diff the provided data against existing entity data, only submitting the
	 * 						difference to the server. Default is true.
	 *
	 * @return				A Promise which resolves to the updated Entity
	 */
	update(data: object, options: object): Promise<Entity>;

	/**
	 * Delete the entity, removing it from its collection and deleting its data record
	 * @param options	Additional options which customize the deletion workflow
	 * @return			A Promise which resolves to the ID of the deleted Entity once handled by the server
	 */
	delete(options: object): Promise<string>;

	/**
	 * Get an Embedded Entity by it's ID from a named collection in the parent
	 * @param collection	The named collection of embedded entities
	 * @param id			The numeric ID of the child to retrieve
	 * @return				Retrieved data for the requested child, or null
	 */
	getEmbeddedEntity(collection: string, id: number): any;

	/**
	 * Get the value of a "flag" for this Entity
	 * See the setFlag method for more details on flags
	 *
	 * @param scope	The flag scope which namespaces the key
	 * @param key	The flag key
	 * @return		The flag value
	 */
	getFlag(scope: string, key: string): any;

	/**
	 * Assign a "flag" to this Entity.
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
	 * @param scope	The flag scope which namespaces the key
	 * @param key	The flag key
	 * @param value	The flag value
	 *
	 * @return		A Promise resolving to the updated Entity
	 */
	setFlag(scope: string, key: string, value: any): Promise<Entity>;

	/**
	 * Remove a flag assigned to the Entity
	 * @param scope	The flag scope which namespaces the key
	 * @param key	The flag key
	 * @return		A Promise resolving to the updated Entity
	 */
	unsetFlag(scope: string, key: string): Promise<Entity>;

	/**
	 * Sort this Entity relative a target by providing the target, an Array of siblings and other options.
	 * See SortingHelper.performIntegerSort for more details
	 */
	sortRelative({ target, siblings, sortKey, sortBefore, updateData }:
		{target: any, siblings: any[], sortKey: string, sortBefore: boolean, updateData: object}): void;

	/**
	 * Export entity data to a JSON file which can be saved by the client and later imported into a different session
	 */
	exportToJSON(): any;

	/**
	 * Import data and update this entity
	 * @param json	JSON data string
	 * @return		The updated Entity
	 */
	importFromJSON(json: string): Promise<Entity>;

	/**
	 * Render an import dialog for updating the data related to this Entity through an exported JSON file
	 */
	importFromJSONDialog(): Promise<void>;
}