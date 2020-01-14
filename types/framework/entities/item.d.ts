/**
 * The Collection of Item entities
 * The items collection is accessible within the game as game.items
 */
declare class Items extends Collection {
	/**
	 * Elements of the Items collection are instances of the Item class, or a subclass thereof
	 */
	get object(): Item;

	/**
	 * Register an Item sheet class as a candidate which can be used to display Items of a given type
	 * See EntitySheetConfig.registerSheet for details
	 */
	static registerSheet(...args: any): void;

	/**
	 * Unregister an Item sheet class, removing it from the list of avaliable sheet Applications to use
	 * See EntitySheetConfig.unregisterSheet for details
	 */
	static unregisterSheet(...args: any): void;

	/**
	 * Return an Array of currently registered sheet classes for this Entity type
	 */
	static get registeredSheets(): any[];
}

declare class Item extends Entity {
	/* -------------------------------------------- */
	/*  Properties                                  */
	/* -------------------------------------------- */

	/**
	 * A convenience accessor for the identifier of the Item object
	 * For owned items, this points to the data.id
	 * For unowned (world) Items, this points to data._id
	 */
	get id(): string;

	/**
	 * A convenience reference to the Actor entity which owns this item, if any
	 */
	get actor(): Actor | null;

	/**
	 * A convenience reference to the image path (data.img) used to represent this Item
	 */
	get img(): string;

	/**
	 * A convenience reference to the item type (data.type) of this Item
	 */
	get type(): string;

	/**
	 * A boolean indicator for whether the current game user has ONLY limited visibility for this Entity.
	 */
	get limited(): boolean;

	/**
	 * A flag for whether the item is owned by an Actor entity
	 */
	get isOwned(): boolean;
	
	/* -------------------------------------------- */
	/*  Methods                                     */
	/* -------------------------------------------- */

	/**
	 * Override the standard permission test for Item entities as we need to apply a special check for owned items
	 * OwnedItems have permission that the player has for the parent Actor.
	 * @return	Whether or not the user has the permission for this item
	 */
	hasPerm(...args: any[]): boolean;
	
	/* -------------------------------------------- */
	/*  Socket Listeners and Handlers               */
	/* -------------------------------------------- */

	/**
	 * Extend the base Entity update logic to update owned items as well.
	 * See Entity.update for more complete API documentation
	 *
	 * @param data		The data with which to update the entity
	 * @param options	Additional options which customize the update workflow
	 * @return			A Promise which resolves to the updated Entity
	 */
	update(data: any, options: any): Promise<Item>;

	/**
	 * A convenience constructor method to create an Item instance which is owned by an Actor
	 */
	static createOwned(itemData: any, actor: Actor): Item;
}