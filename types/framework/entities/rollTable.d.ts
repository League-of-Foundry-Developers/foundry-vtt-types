/**
 * The EntityCollection of RollTable entities
 * @extends {EntityCollection}
 */
declare class RollTables extends EntityCollection<RollTable> {

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /** @override */
  get entity(): string

  /** @override */
  static get instance(): RollTables

  /** @override */
  get directory(): RollTableDirectory

  /**
   * Register world settings related to RollTable entities
   */
  static registerSettings(): void
}

declare class RollTable<D extends RollTable.Data = RollTable.Data> extends Entity<D> {
  /** @override */
  static get config (): Entity.Config

  /** @override */
  prepareEmbeddedEntities (): void

  /**
   * A convenience accessor for the array of TableResult embedded documents
   * @type {Array.<Object>}
   */
  get results (): any[]

  /* -------------------------------------------- */
  /*  Methods                                     */
  /* -------------------------------------------- */

  /**
   * Display a result drawn from a RollTable in the Chat Log along.
   * Optionally also display the Roll which produced the result and configure aspects of the displayed messages.
   *
   * @param {object[]} results      An Array of one or more table results which were drawn and should be displayed
   * @param {Roll} [roll]           An optional Roll instance which produced the drawn results
   * @param {Object} [messageData]  Additional data which customizes the created messages
   * @param {Object} [messageOptions] Additional options which customize the created messages
   */
  toMessage (results: any[], { roll, messageData, messageOptions }?: {
    roll?: Roll | null
    messageData?: any
    messageOptions?: any
  }): ChatMessage

  /**
   * Draw a result from the RollTable based on the table formula or a provided Roll instance
   * @param {Roll|null} [roll]        An existing Roll instance to use for drawing from the table
   * @param {boolean} [recursive]     Allow drawing recursively from inner RollTable results
   * @param {object[]} [results]      One or more table results which have been drawn
   *
   * @param {boolean} [displayChat]   Whether to automatically display the results in chat
   * @param {string|null} [rollMode]  The chat roll mode to use when displaying the result
   *
   * @return {Promise<{roll: Roll, results: object[]}>}   A Promise which resolves to an object containing the
   *                                                      executed roll and the produced results
   */
  draw ({ roll, recursive, results, displayChat, rollMode }?: {
    roll?: Roll | null
    recursive?: boolean
    results?: any[]
    displayChat?: boolean
    rollMode?: string | null
  }): Promise<{
    roll: Roll
    results: any[]
  }>

  /**
   * Draw multiple results from a RollTable, constructing a final synthetic Roll as a dice pool of inner rolls.
   * @param {number} number           The number of results to draw
   * @param {Roll} [roll]             An optional pre-configured Roll instance which defines the dice roll to use
   * @param {boolean} [recursive]     Allow drawing recursively from inner RollTable results
   * @param {boolean} [displayChat]   Automatically display the drawn results in chat? Default is true
   * @param {string} [rollMode]       Customize the roll mode used to display the drawn results
   * @return {Promise<{roll: Roll, results: object[]}>}
   */
  drawMany (number: number, { roll, recursive, displayChat, rollMode }?: {
    roll?: Roll | null
    recursive?: boolean
    displayChat?: boolean
    rollMode?: string | null
  }): Promise<{
    roll: Roll
    results: any[]
  }>

  /**
   * Normalize the probabilities of rolling each item in the RollTable based on their assigned weights
   */
  normalize (): Promise<RollTable<D>>

  /**
   * Reset the state of the RollTable to return any drawn items to the table
   * @return {Promise}
   */
  reset (): Promise<RollTable<D>>

  /**
   * Evaluate a RollTable by rolling its formula and retrieving a drawn result.
   *
   * Note that this function only performs the roll and identifies the result, the RollTable#draw function should be
   * called to formalize the draw from the table.
   *
   * @param {Roll} [roll]             An alternative dice Roll to use instead of the default formula for the table
   * @param {boolean} recursive       If a RollTable entity is drawn as a result, recursively roll it
   * @param {number} _depth           An internal flag used to track recursion depth
   * @return {{roll: Roll, results: object[]}}   An object containing the executed roll and the produced results
   *
   * @example
   * // Draw results using the default table formula
   * const defaultResults = table.roll();
   *
   * // Draw results using a custom roll formula
   * const roll = new Roll("1d20 + @abilities.wis.mod", actor.getRollData());
   * const customResults = table.roll({roll});
   */
  roll ({ roll, recursive, _depth }?: {
    roll: Roll
    recursive?: boolean
    _depth?: number
  }): {
    roll: Roll
    results: any[]
  }

  /**
   * Get an Array of valid results for a given rolled total
   * @param {number} value    The rolled value
   * @return {object[]}       An Array of results
   * @private
   */
  _getResultsForRoll (value: number): any[]

  /**
   * Get a string representation for the result which (if possible) will be a dynamic link or otherwise plain text
   * @param {object} result   The result object
   * @return {string}         The text to display
   * @private
   */
  _getResultChatText (result: any): string

  /* -------------------------------------------- */
  /*  Table Result Management Methods             */
  /* -------------------------------------------- */

  /** @extends {Entity.getEmbeddedEntity} */
  getTableResult (id: string): any // TODO EmbeddedTableResult

  /** @override */
  _onCreateEmbeddedEntity (embeddedName: string, child: any, options: any, userId: string): void

  /** @override */
  _onDeleteEmbeddedEntity (embeddedName: string, child: any, options: any, userId: string): void

  /* -------------------------------------------- */
  /*  Importing and Exporting                     */
  /* -------------------------------------------- */

  /** @override */
  toCompendium (): Promise<any>

  /**
   * Create a new RollTable entity using all of the Entities from a specific Folder as new results.
   * @param {Folder} folder       The Folder entity from which to create a roll table
   * @param {object} options      Additional options passed to the RollTable.create method
   * @return {Promise<RollTable>}
   */
  static fromFolder (folder: Folder, options: Entity.CreateOptions): Promise<RollTable>
}

declare namespace RollTable {
  interface Data extends Entity.Data {
    description: string
    displayRoll: boolean
    formula: string
    img: string
    permission: {
      default: number
      [user: string]: number
    }
    replacement: boolean
    results: Result[]
    sort: number
  }

  interface Result {
    drawn: boolean
    flags: any
    img: string
    range: [number, number]
    resultId: string
    text: string
    type: number
    weight: number
    _id: string
  }
}
