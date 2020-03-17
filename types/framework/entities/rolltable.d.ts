declare class RollTables extends Collection {}

declare class RollTable extends Entity {
	/** @override */
	static get config(): {
		baseEntity: RollTable;
		collection: RollTables;
		embeddedEntities: { TableResult: string };
	};

	/**
	 * A convenience accessor for the array of TableResult embedded documents
	 */
	get results(): any[];

	/* -------------------------------------------- */
	/*  Methods
	/* -------------------------------------------- */

	/**
	 * Draw a result from the RollTable based on the table formula or a provided Roll instance
	 * @param roll		An existing Roll instance to use for drawing from the table
	 * @param result	A roll table result or null, to draw randomly based on the roll
	 * @param rollMode	The chat roll mode to use when displaying the result
	 * @returns			A promise resolving to the selected Table Result object
	 */
	draw(
		{ roll, result }?: { roll?: Roll; result?: object },
		{ rollMode }?: { rollMode?: string }
	): Promise<any>;

	/**
	 * Display the result drawn from the table as a chat message
	 * @param result
	 * @param speaker
	 * @param rollMode
	 */
	protected _displayChatResult(
		result: object,
		speaker: object,
		rollMode: string
	): ChatMessage;

	/**
	 * Normalize the probabilities of rolling each item in the RollTable based on their assigned weights
	 */
	normalize(): Promise<RollTable>;

	/**
	 * Reset the state of the RollTable to return any drawn items to the table
	 */
	reset(): Promise<RollTable>;

	/**
	 * Evaluate a RollTable, returning a the drawn result
	 * @returns	An Array, containing the Roll and the result
	 */
	roll(): [Roll, any];

	/* -------------------------------------------- */
	/*  Table Result Management Methods             */
	/* -------------------------------------------- */

	/** @extends Entity.getEmbeddedEntity */
	getTableResult(id: string): any;
}
