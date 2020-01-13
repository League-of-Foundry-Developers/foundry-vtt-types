/**
 * A class pattern for collections of Entity objects within the Foundry VTT Framework
 *
 * @param data	An Array of Entity data from which to create instances
 * @param apps	An Array of Application instances which the Collection modifies
 */
declare class Collection {
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
	importFromCollection(collection: string, entryId: string, updateData: object): Promise<Entity>;

	/**
	 * Activate socket listeners related to this particular Entity type
	 * @param socket	The open game socket
	 */
	static socketListeners(socket: SocketIO.Socket): void;
}