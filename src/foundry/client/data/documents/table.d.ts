import { ConfiguredDocumentClass } from "../../../../types/helperTypes";
import { DocumentModificationOptions } from "../../../common/abstract/document.mjs";

declare global {
  /**
   * The client-side RollTable document which extends the common BaseRollTable model.
   * Each RollTable document contains RollTableData which defines its data schema.
   *
   * @see {@link data.RollTableData}              The RollTable data schema
   * @see {@link documents.RollTables}            The world-level collection of RollTable documents
   * @see {@link applications.RollTableConfig}    The RollTable configuration application
   */
  class RollTable extends ClientDocumentMixin(foundry.documents.BaseRollTable) {
    /**
     * @param data    - Initial data provided to construct the RollTable document
     * @param context - The document context, see {@link foundry.abstract.Document}
     */
    constructor(
      data: ConstructorParameters<typeof foundry.documents.BaseRollTable>[0],
      context?: ConstructorParameters<typeof foundry.documents.BaseRollTable>[1]
    );

    /**
     * Provide a thumbnail image path used to represent this document.
     */
    get thumbnail(): this["data"]["img"];

    /**
     * Display a result drawn from a RollTable in the Chat Log along.
     * Optionally also display the Roll which produced the result and configure aspects of the displayed messages.
     *
     * @param results - An Array of one or more TableResult Documents which were drawn and should be displayed
     * @param options - Additional options which modify message creation
     */
    toMessage(
      results: InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseTableResult>>[],
      options?: Partial<RollTable.ToMessageOptions>
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseChatMessage>> | undefined>;

    /**
     * Draw a result from the RollTable based on the table formula or a provided Roll instance
     * @param options - Optional arguments which customize the draw behavior
     * @returns A Promise which resolves to an object containing the executed roll and the produced results
     */
    draw(options?: RollTable.DrawOptions): Promise<RollTableDraw>;

    /**
     * Draw multiple results from a RollTable, constructing a final synthetic Roll as a dice pool of inner rolls.
     * @param number  - The number of results to draw
     * @param options - Optional arguments which customize the draw
     * @returns The drawn results
     */
    drawMany(number: number, options?: Partial<RollTable.DrawOptions>): Promise<RollTableDraw>;

    /**
     * Normalize the probabilities of rolling each item in the RollTable based on their assigned weights
     */
    normalize(): Promise<this | undefined>;

    /**
     * Reset the state of the RollTable to return any drawn items to the table
     * @remarks Actually, returns list of TableEntries updated, not the RollTable.
     * As written, it force updates all records, not just the ones already drawn.
     */
    reset(): Promise<InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseTableResult>>[]>;

    /**
     * Evaluate a RollTable by rolling its formula and retrieving a drawn result.
     *
     * Note that this function only performs the roll and identifies the result, the RollTable#draw function should be
     * called to formalize the draw from the table.
     *
     * @param options - (default: `{}`)
     * @returns The Roll and results drawn by that Roll
     *
     * @example
     * ```typescript
     * // Draw results using the default table formula
     * const defaultResults = await table.roll();
     *
     * // Draw results using a custom roll formula
     * const roll = new Roll("1d20 + @abilities.wis.mod", actor.getRollData());
     * const customResults = await table.roll({roll});
     * ```
     */
    roll(options?: RollTable.RollOptions | undefined): Promise<RollTableDraw>;

    /**
     * Get an Array of valid results for a given rolled total
     * @param value - The rolled value
     * @returns An Array of results
     */
    getResultsForRoll(value: number): InstanceType<ConfiguredDocumentClass<typeof TableResult>>[];

    protected override _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: foundry.abstract.Document<any, any>[],
      result: Record<string, unknown>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    override _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof TableResult>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    override toCompendium(
      pack?: CompendiumCollection<CompendiumCollection.Metadata> | null | undefined,
      options?: ClientDocumentMixin.CompendiumExportOptions | undefined
    ): Omit<foundry.data.RollTableData["_source"], "_id" | "folder" | "permission"> & {
      permission?: foundry.data.RollTableData extends { toObject(): infer U } ? U : never;
    };

    /**
     * Create a new RollTable document using all of the Documents from a specific Folder as new results.
     * @param folder  - The Folder document from which to create a roll table
     * @param options - Additional options passed to the RollTable.create method
     */
    static fromFolder(
      folder: InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseFolder>>,
      options?: DocumentModificationOptions
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseRollTable>> | undefined>;
  }

  namespace RollTable {
    /**
     * Optional arguments which customize the draw
     */
    interface DrawOptions {
      /**
       * An existing Roll instance to use for drawing from the table
       */
      roll: Roll;

      /**
       * Allow drawing recursively from inner RollTable results
       * @defaultValue `true`
       */
      recursive: boolean;

      /**
       * One or more table results which have been drawn
       * @defaultValue `[]`
       */
      results: foundry.data.TableResultData[];

      /**
       * Whether to automatically display the results in chat
       * @defaultValue `true`
       */
      displayChat: boolean;

      /**
       * The chat roll mode to use when displaying the result
       */
      rollMode: keyof CONFIG.Dice.RollModes | "roll";
    }

    /**
     * Additional options which modify message creation
     */
    interface ToMessageOptions {
      /**
       * An optional Roll instance which produced the drawn results
       */
      roll: Roll | null;

      /**
       * Additional data which customizes the created messages
       * @defaultValue `{}`
       */
      messageData: ConstructorParameters<typeof foundry.documents.BaseChatMessage>[0];

      /**
       * Additional options which customize the created messages
       * @defaultValue `{}`
       */
      messageOptions: DocumentModificationContext & { rollMode: keyof CONFIG.Dice.RollModes | "roll" };
    }

    interface RollOptions {
      /**
       * An alternative dice Roll to use instead of the default formula for the table
       */
      roll?: Roll;

      /**
       * If a RollTable document is drawn as a result, recursively roll it
       * @defaultValue `true`
       */
      recursive?: boolean;

      /**
       * An internal flag used to track recursion depth
       * @defaultValue `0`
       */
      _depth?: number;
    }
  }

  /**
   * An object containing the executed Roll and the produced results
   */
  interface RollTableDraw {
    /**
     * The Dice roll which generated the draw
     */
    roll: Roll;

    /**
     * An array of drawn TableResult documents
     */
    results: InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseTableResult>>[];
  }
}
export {};
