/**
 * A class pattern for collections of Entity objects within the Foundry VTT Framework
 *
 * @param data	An Array of Entity data from which to create instances
 * @param apps	An Array of Application instances which the Collection modifies
 */
declare class Collection {
	/**
	 * An Array of all the Entity instances of this type which are contained within the collection
	 */
	entities: Entity[];

	/**
	 * A reference to the original source data provided by the server
	 */
	protected _source: any;

	/**
	 * An Array of application references which will be automatically updated when the collection content changes
	 */
	apps: Application[];

	constructor(data: any[], apps: any[]);

	/**
	 * The Collection name
	 */
	get name(): string;

	/**
	 * Return a reference to the singleton instance of this Collection
	 * By default, a Collection is located in `game[Collection.name]`, for example `game.actors`
	 */
	static get instance(): Collection;

	/**
	 * Return a reference to the SidebarDirectory application for this Collection
	 */
	static get directory(): any;

	/**
	 * Return a reference to the Entity subclass which should be used when creating elements of this Collection
	 *
	 * This should always be an explicit reference to the class which is used in this game to represent the entity,
	 * and not the base implementation of that entity type.
	 * For example :class:`Actor5e` not :class:`Actor`
	 */
	get object(): Entity;

	/**
	 * Return the base Entity name which this collection manages.
	 *
	 * This should always be the primitive name of the entity type, not the name of a specific subclass implementation
	 * For example "Actor", not "Actor5e"
	 */
	get entity(): string;

	/**
	 * Add a new Entity to the Collection, asserting that they are of the correct type
	 *
	 * @param entity	The entity instance to add to the collection
	 */
	insert(entity: Entity): void;

	/**
	 * Remove an Entity from the Collection by its ID.
	 *
	 * @param id {String}   The entity ID which should be removed
	 */
	remove(id: string): void;

	/**
	 * Get an element from the collection by ID
	 *
	 * @param id	The entity ID to retrieve from the collection
	 * @return		The retrieved Entity, if the ID was found, otherwise null;
	 */
	get(id: string): Entity;

	/**
	 * Retrieve the index of an entity within the collection by its ID
	 *
	 * @param id	The entity ID to retrieve from the collection
	 * @return		The index of the Entity within the collection, if found, otherwise -1;
	 */
	index(id: string): number;

	/**
	 * Re-render any currently visible applications associated with this Collection
	 */
	render(...args: any): void;

	/**
	 * Import an Entity from a compendium collection, adding it to the current World
	 * @param collection	The name of the pack from which to import
	 * @param entryId		The ID of the compendium entry to import
	 * @param updateData	Data used to update the imported Entity before it is created in the World
	 * @return				A Promise containing the imported Entity
	 */
	importFromCollection(collection: string, entryId: string, updateData: any): Promise<Entity>;

	/* -------------------------------------------- */
	/*  Socket Listeners and Handlers               */
	/* -------------------------------------------- */

	/**
	 * Activate socket listeners related to this particular Entity type
	 * @param socket	The open game socket
	 */
	static socketListeners(socket: SocketIO.Socket): void;

	/**
	 * Handle Entity creation workflow using the server response from the create<Entity> socket
	 *
	 * @param created	The created Entity data
	 * @param options	Additional options which describe the creation request
	 * @param userId	The ID of the triggering User
	 *
	 * @return			The created Entity instance
	 */
	protected _createEntity({ created, options, userId }: { created: any, options: any, userId: string }): Entity;

	/**
	 * Handle Entity update workflow using the server response from the update<Entity> socket
	 *
	 * @param updated	The updated Entity data
	 * @param options	Additional options which describe the update request
	 * @param userId	The ID of the triggering User
	 *
	 * @return			The updated Entity instance
	 */
	protected _updateEntity({ updated, options, userId }: { updated: any, options: any, userId: string }): Entity;

	/**
	 * Handle Entity deletion workflow using the server response from the delete<Entity> socket
	 * @private
	 *
	 * @param deleted	The ID of the deleted Entity
	 * @param options	Additional options which describe the deletion request
	 * @param userId	The ID of the triggering User
	 *
	 * @return			The deleted Entity instance
	 */
	protected _deleteEntity({ deleted, options, userId }: { delete: any, options: any, userId: string }): Entity;
}