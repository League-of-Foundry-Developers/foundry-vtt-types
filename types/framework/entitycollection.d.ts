/**
 * An iterable container of Entity objects within the Foundry Virtual Tabletop framework.
 * Each Entity type has it's own subclass of EntityCollection, which defines the abstract interface.
 * @abstract
 * @interface
 *
 * @param data      An Array of Entity data from which to create instances
 */
declare class EntityCollection<T extends Entity> extends Collection<T> {
	constructor(data: Array<T>);

	/**
	 * The source data is, itself, a mapping of IDs to data objects
	 */
	_source: Array<T>;

	/**
	 * An Array of application references which will be automatically updated when the collection content changes
	 */
	apps: Array<Application>;

	/**
	 * An array of all the Entities in the EntityCollection.
	 * @alias {Collection#entries}
	 */
	get entities(): Array<T>;

	/**
	 * Render any Applications associated with this EntityCollection
	 * @return A reference to the rendered EntityCollection
	 * @see Application.render
	 */
	render(force?: boolean, options?: RenderOptions): this;

	/**
	 * The EntityCollection name
	 */
	get name(): string;

	/**
	 * Return a reference to the SidebarDirectory application for this EntityCollection, or null if it has not yet been created.
	 */
	get directory(): SidebarDirectory | null;

	/**
	 * Return a reference to the base Entity name which is contained within this EntityCollection.
	 * @abstract
	 */
	get entity(): never;

	/**
	 * Return a reference to the singleton instance of this EntityCollection, or null if it has not yet been created.
	 */
	static get instance(): EntityCollection<Entity> | null;

	/**
	 * Return a reference to the Entity subclass which should be used when creating elements of this EntityCollection.
	 * This should always be an explicit reference to the class which is used in this game to represent the entity,
	 * and not the base implementation of that entity type.
	 */
	get object(): () => EntityCollection<T>;

	/**
	 * Add a new Entity to the EntityCollection, asserting that they are of the correct type.
	 * @param entity The entity instance to add to the collection
	 */
	insert(entity: T): void;

	/**
	 * Remove an Entity from the EntityCollection by its ID.
	 * @param id The entity ID which should be removed
	 */
	remove(id: string): void;

	/**
	 * Import an Entity from a compendium collection, adding it to the current World.
	 * @param collection     The name of the pack from which to import
	 * @param entryId        The ID of the compendium entry to import
	 * @param [updateData]   Optional additional data used to modify the imported Entity before it is created
	 * @param [options]      Optional arguments passed to the Entity.create method
	 * @return A Promise containing the imported Entity
	 */
	importFromCollection(
		collection: string,
		entryId: string,
		updateData: {},
		options: {}
	): Promise<Entity>;

	/**
	 * Apply data transformations when importing an Entity from a Compendium pack
	 * @param data The original Compendium entry data
	 * @return The processed data ready for Entity creation
	 */
	fromCompendium(data: object): object;
}
