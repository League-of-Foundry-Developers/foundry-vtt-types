/**
 * The :class:`Collection` of :class:`Actor` entities
 * The actors collection is accessible within the game as ``game.actors``
 */
declare class Actors extends Collection {
	/**
	 * Elements of the Actors collection are instances of the Actor class, or a subclass thereof
	 * @type {Actor}
	 */
	get object(): Actor;

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
	constructor(...args: any);
}