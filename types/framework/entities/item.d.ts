
declare class Items extends Collection {
	/**
	 * Elements of the Items collection are instances of the Item class, or a subclass thereof
	 * @type {Actor}
	 */
	get object(): Actor;

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

}