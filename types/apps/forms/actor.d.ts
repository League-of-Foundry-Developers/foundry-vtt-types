/**
 * The default Actor Sheet
 *
 * This Application is responsible for rendering an actor's attributes and allowing the actor to be edited.
 *
 * System modifications may elect to override this class to better suit their own game system by re-defining the value
 * ``CONFIG.Actor.sheetClass``.
 *
 * @param actor				The Actor instance being displayed within the sheet.
 * @param options			Additional options which modify the rendering of the Actor's sheet.
 * @param options.editable	Is the Actor editable? Default is true.
 */
declare class ActorSheet extends BaseEntitySheet {
	
	/**
	 * If this Actor Sheet represents a synthetic Token actor, reference the active Token
	 */
	token: Token;

	constructor();

	/**
	 * Define a unique and dynamic element ID for the rendered ActorSheet application
	 */
	get id(): string;

	/**
	 * The displayed window title for the sheet - the entity name by default
	 */
	get title(): string;

	/**
	 * A convenience reference to the Actor entity
	 */
	get actor(): Actor;

	/**
	 * Prepare data for rendering the Actor sheet
	 * The prepared data object contains both the actor data as well as additional sheet options
	 */
	getData(): object;

	/**
	 * Remove references to an active Token when the sheet is closed
	 * See Application.close for more detail
	 */
	close(): Promise<void>;

	/**
	 * Activate the default set of listeners for the Actor Sheet
	 * These listeners handle basic stuff like form submission or updating images
	 *
	 * @param html	The rendered template ready to have listeners attached
	 */
	activateListeners(html: JQuery): void;
}