declare class RollTable extends Entity<RollTable.Data> {
  /** @override */
  static get config(): Entity.Config<RollTable>;

  /** @override */
  prepareEmbeddedEntities(): void;

  /**
   * A convenience accessor for the array of TableResult embedded documents
   */
  get results(): any[]; // TODO: type when TableResult is typed

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /**
   * Display a result drawn from a RollTable in the Chat Log along.
   * Optionally also display the Roll which produced the result and configure aspects of the displayed messages.
   *
   * @param results        - An Array of one or more table results which were drawn and should be displayed
   * @param roll           - An optional Roll instance which produced the drawn results
   * @param messageData    - Additional data which customizes the created messages
   * @param messageOptions - Additional options which customize the created messages
   */
  toMessage(
    results: any[],
    {
      roll,
      messageData,
      messageOptions
    }?: {
      roll?: Roll | null;
      messageData?: any;
      messageOptions?: any;
    }
  ): ChatMessage;

  /**
   * Draw a result from the RollTable based on the table formula or a provided Roll instance
   * @param roll        - An existing Roll instance to use for drawing from the table
   * @param recursive   - Allow drawing recursively from inner RollTable results
   * @param results     - One or more table results which have been drawn
   * @param displayChat - Whether to automatically display the results in chat
   * @param rollMode    - The chat roll mode to use when displaying the result
   *
   * @returns A Promise which resolves to an object containing the executed roll and the produced results
   */
  draw({
    roll,
    recursive,
    results,
    displayChat,
    rollMode
  }?: {
    roll?: Roll | null;
    recursive?: boolean;
    results?: any[];
    displayChat?: boolean;
    rollMode?: string | null;
  }): Promise<{
    roll: Roll;
    results: any[];
  }>;

  /**
   * Draw multiple results from a RollTable, constructing a final synthetic Roll as a dice pool of inner rolls.
   * @param number      - The number of results to draw
   * @param roll        - An optional pre-configured Roll instance which defines the dice roll to use
   * @param recursive   - Allow drawing recursively from inner RollTable results
   * @param displayChat - Automatically display the drawn results in chat? Default is true
   * @param rollMode    - Customize the roll mode used to display the drawn results
   */
  drawMany(
    number: number,
    {
      roll,
      recursive,
      displayChat,
      rollMode
    }?: {
      roll?: Roll | null;
      recursive?: boolean;
      displayChat?: boolean;
      rollMode?: string | null;
    }
  ): Promise<{
    roll: Roll;
    results: any[];
  }>;

  /**
   * Normalize the probabilities of rolling each item in the RollTable based on their assigned weights
   */
  normalize(): Promise<RollTable>;

  /**
   * Reset the state of the RollTable to return any drawn items to the table
   * @returns
   */
  reset(): Promise<RollTable>;

  /**
   * Evaluate a RollTable by rolling its formula and retrieving a drawn result.
   *
   * Note that this function only performs the roll and identifies the result, the RollTable#draw function should be
   * called to formalize the draw from the table.
   *
   * @param roll      - An alternative dice Roll to use instead of the default formula for the table
   * @param recursive - If a RollTable entity is drawn as a result, recursively roll it
   * @param _depth    - An internal flag used to track recursion depth
   * @returns An object containing the executed roll and the produced results
   *
   * @example
   * ```typescript
   * // Draw results using the default table formula
   * const defaultResults = table.roll();
   *
   * // Draw results using a custom roll formula
   * const roll = new Roll("1d20 + @abilities.wis.mod", actor.getRollData());
   * const customResults = table.roll({roll});
   * ```
   */
  roll({
    roll,
    recursive,
    _depth
  }?: {
    roll?: Roll;
    recursive?: boolean;
    _depth?: number;
  }): {
    roll: Roll;
    results: any[];
  };

  /**
   * Get an Array of valid results for a given rolled total
   * @param value - The rolled value
   * @returns An Array of results
   */
  protected _getResultsForRoll(value: number): any[];

  /**
   * Get a string representation for the result which (if possible) will be a dynamic link or otherwise plain text
   * @param result - The result object
   * @returns The text to display
   */
  protected _getResultChatText(result: any): string;

  /* -------------------------------------------- */
  /*  Table Result Management Methods             */
  /* -------------------------------------------- */

  getTableResult(id: string): any; // TODO EmbeddedTableResult

  /** @override */
  protected _onCreateEmbeddedEntity(embeddedName: string, child: any, options: any, userId: string): void;

  /** @override */
  protected _onDeleteEmbeddedEntity(embeddedName: string, child: any, options: any, userId: string): void;

  /* -------------------------------------------- */
  /*  Importing and Exporting                     */
  /* -------------------------------------------- */

  /** @override */
  toCompendium(): Promise<any>;

  /**
   * Create a new RollTable entity using all of the Entities from a specific Folder as new results.
   * @param folder  - The Folder entity from which to create a roll table
   * @param options - Additional options passed to the RollTable.create method
   * @returns
   */
  static fromFolder(folder: Folder, options: Entity.CreateOptions): Promise<RollTable>;
}

declare namespace RollTable {
  interface Data extends Entity.Data {
    description: string;
    displayRoll: boolean;
    formula: string;
    img: string;
    name: string;
    permission: Entity.Permission;
    replacement: boolean;
    results: Result[];
    sort: number;
  }

  interface Result {
    drawn: boolean;
    flags: any;
    img: string;
    range: [number, number];
    resultId: string;
    text: string;
    type: number;
    weight: number;
    _id: string;
  }
}
