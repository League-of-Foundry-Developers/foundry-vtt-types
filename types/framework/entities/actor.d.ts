declare interface ActorData extends BaseEntityData {
	img: string,
	
}

/**
 * The :class:`Collection` of :class:`Actor` entities
 * The actors collection is accessible within the game as ``game.actors``
 */
declare class Actors extends Collection {
	data: ActorData;

	/**
	 * Elements of the Actors collection are instances of the Actor class, or a subclass thereof
	 */
	get object(): Actor;

	/**
	 * Open Socket listeners which transact Actor data
	 */
	protected static socketListeners(socket: SocketIO.Socket): void;

	/**
	 * Handle OwnedItem creation given a server-side Socket response
	 *
	 * @param parentId	The parent Actor ID
	 * @param created	The created Item data
	 * @param options	Additional options which modify the request
	 * @param userId	The ID of the requesting user
	 *
	 * @return			The created Item instance
	 */
	protected static _createOwnedItem({ parentId, created, options, userId }:
		{ parentId: string, created: any, options: any, userId: string }): Item;

	/**
	 * Handle OwnedItem updates given a server-side Socket response
	 *
	 * @param parentId	The parent Actor ID
	 * @param updated	The updated Item data
	 * @param options	Additional options which modify the request
	 * @param userId	The ID of the requesting user
	 *
	 * @return			The updated Item instance
	 */
	protected static _updateOwnedItem({ parentId, updated, options, userId }:
		{ parentId: string, updated: any, options: any, userId: string }): Item;

	/**
	 * Handle the server response to update many OwnedItems in a parent Actor
	 *
	 * @param parentId	The parent Entity ID
	 * @param data		The Array of data updates performed
	 * @param options	Additional options which were included with the update request
	 * @param userId	The ID of the triggering User
	 *
	 * @return 			The updated Actor instance
	 */
	protected static _updateManyOwnedItem({ parentId, data, options, userId }:
		{ parentId: string, data: any[], options: any, userId: string }): Item;

	/**
	 * Handle OwnedItem deletion given a server-side Socket response
	 *
	 * @param parentId	The parent Actor ID
	 * @param deleted	The deleted Item ID
	 * @param options	Additional options which modify the request
	 * @param userId	The ID of the requesting user
	 *
	 * @return			The deleted Item instance
	 */
	protected static _deleteOwnedItem({ parentId, deleted, options, userId }:
		{ parentId: string, deleted: number, options: any, userId: string }): Item;

	/* -------------------------------------------- */
	/*  Methods
	/* -------------------------------------------- */

	/**
	 * Register an Actor sheet class as a candidate which can be used to display Actors of a given type
	 * See EntitySheetConfig.registerSheet for details
	 */
	static registerSheet(...args: any): void;

	/**
	 * Unregister an Actor sheet class, removing it from the list of avaliable sheet Applications to use
	 * See EntitySheetConfig.unregisterSheet for details
	 */
	static unregisterSheet(...args: any): void;

	/**
	 * Return an Array of currently registered sheet classes for this Entity type
	 */
	static get registeredSheets(): any[];
}

/**
 * The Actor class is a type of :class:`Entity` which represents the protagonists, characters, enemies, and more that
 * inhabit the World.
 */
declare class Actor extends Entity {
	/**
	 * A reference to a placed Token which creates a synthetic Actor
	 */
	token: Token;

	/**
	 * Construct the Array of Item instances for the Actor
	 */
	items: Item[];

	constructor(...args: any[]);

	/**
	 * Prepare data for the Actor instance whenever it is first created or later updated.
	 */
	prepareData(): ActorData;

	/**
	 * A convenient reference to the file path of the Actor's profile image
	 */
	get img(): string;

	/**
	 * Get an owned item by it's ID, initialized as an Item entity class
	 * @param itemId	The ID of the owned item
	 * @return		An Item class instance for that owned item or null if the itemId does not exist
	 */
	getOwnedItem(itemId: number): Item | null;

	/**
	 * A boolean flag for whether this Actor is a player-owned character.
	 * True if any User who is not a GM has ownership rights over the Actor entity.
	 */
	get isPC(): boolean;

	/**
	 * Test whether an Actor entity is a synthetic representation of a Token (if true) or a full Entity (if false)
	 */
	get isToken(): boolean;

	/**
	 * Create a synthetic Actor using a provided Token instance
	 * 
	 * If the Token data is linked, return the true Actor entity
	 * 
	 * If the Token data is not linked, create a synthetic Actor using the Token's actorData override
	 */
	static fromToken(token: Token): Actor;

	/**
	 * Retrieve an Array of active tokens which represent this Actor in the current canvas Scene.
	 * If the canvas is not currently active, or there are no linked actors, the returned Array will be empty.
	 *
	 * @param linked	Only return tokens which are linked to the Actor. Default (false) is to return all
	 *					tokens even those which are not linked.
	 *
	 * @return			An array of tokens in the current Scene which reference this Actor.
	 */
	getActiveTokens(linked?: boolean): Token[];

	/**
	 * Get an Array of Token images which could represent this Actor
	 */
	getTokenImages(): Promise<any>;

	/* -------------------------------------------- */
	/*  Socket Listeners and Handlers
	/* -------------------------------------------- */

	/**
	 * Extend the default update method to enhance data before submission.
	 * See the parent Entity.update method for full details.
	 *
	 * @param data		data with which to update the Actor
	 * @param options	Additional options which customize the update workflow
	 * @return			A Promise which resolves to the updated Entity
	 */
	update(data: any, options: any): Promise<Actor>;

	/**
	 * Additional updating steps for the Actor entity when new data is saved which trigger some related updates.
	 * Re-render the parent collection if names, images, or permissions have changed
	 * Re-render active tokens if their linked attribute has changed
	 */
	protected _onUpdate(data: any, ...args: any[]): void;

	/* -------------------------------------------- */
	/* Owned Item Management
	/* -------------------------------------------- */

	/**
	 * Import a new owned Item from a compendium collection
	 * The imported Item is then added to the Actor as an owned item.
	 *
	 * @param collection	The name of the pack from which to import
	 * @param entryId		The ID of the compendium entry to import
	 */
	importItemFromCollection(collection: string, entryId: string): Item;

	/**
	 * Prepare an Array of Owned Items for the Actor
	 */
	protected _getItems(): Item[];

	/**
	 * Get an owned item by it's ID, initialized as an Item entity class
	 * @param itemId	The ID of the owned item
	 * @return			An Item class instance for that owned item or null if the itemId does not exist
	 */
	getOwnedItem(itemId: string): Item | null;

	/**
	 * Create a new item owned by this Actor.
	 * @param itemData				Data for the newly owned item
	 * @param options				Item creation options
	 * @param options.displaySheet	Render the Item sheet for the newly created item data
	 * @return						A Promise containing the newly created owned Item instance
	 */
	createOwnedItem(itemData: any, options?: any): Promise<Item>;

	/**
	 * Update an owned item using provided new data
	 * @param itemData	Data for the item to update
	 * @param options	Item update options
	 * @return			A Promise resolving to the updated Item object
	 */
	updateOwnedItem(itemData: any, options?: any): Promise<Item>;

	/**
	 * Update multiple owned items within the parent Actor
	 * @param data		The multi-object update to perform
	 * @param options	Owned Item update options
	 * @return			A Promise resolving to the updated Actor
	 */
	updateManyOwnedItem(data: any, options?: any): Promise<Item[]>;

	/**
	 * Delete an owned item by its ID
	 * @param itemId	The ID of the item to delete
	 * @param options	Item deletion options
	 * @return			A Promise resolving to the deleted item ID
	 */
	deleteOwnedItem(itemId: number, options?: any): Promise<number>;
}