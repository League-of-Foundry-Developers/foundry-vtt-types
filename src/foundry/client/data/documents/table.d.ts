// FOUNDRY_VERSION: 10.291

import { ConfiguredDocumentClass } from "../../../../types/helperTypes";
import { DocumentModificationOptions } from "../../../common/abstract/document.mjs";
import type BaseChatMessage from "../../../common/documents/chat-message.mjs";
import type BaseRollTable from "../../../common/documents/roll-table.mjs";
import type BaseTableResult from "../../../common/documents/table-result.mjs";

declare global {
  /**
   * The client-side RollTable document which extends the common BaseRollTable model.
   *
   * @see {@link RollTables}         The world-level collection of RollTable documents
   * @see {@link TableResult}        The embedded TableResult document
   * @see {@link RollTableConfig}    The RollTable configuration application
   */
  class RollTable extends ClientDocumentMixin(BaseRollTable) {
    /**
     * Provide a thumbnail image path used to represent this document.
     */
    get thumbnail(): string;

    /**
     * Display a result drawn from a RollTable in the Chat Log along.
     * Optionally also display the Roll which produced the result and configure aspects of the displayed messages.
     *
     * @param results   - An Array of one or more TableResult Documents which were drawn and should
     *                  be displayed.
     * @param options   - Additional options which modify message creation
     *                  (default: `{}`)
     */
    toMessage(
      results: InstanceType<ConfiguredDocumentClass<typeof BaseTableResult>>[],
      options?: Partial<RollTable.ToMessageOptions>
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof BaseChatMessage>> | undefined>;

    /**
     * Draw a result from the RollTable based on the table formula or a provided Roll instance
     * @param options   - Optional arguments which customize the draw behavior
     *                  (default: `{}`)
     * @returns A Promise which resolves to an object containing the executed roll and the
     *          produced results.
     */
    draw(options?: RollTable.DrawOptions): Promise<RollTableDraw>;

    /**
     * Draw multiple results from a RollTable, constructing a final synthetic Roll as a dice pool of inner rolls.
     * @param number    - The number of results to draw
     * @param options   - Optional arguments which customize the draw
     *                  (default: `{}`)
     * @returns The drawn results
     */
    drawMany(number: number, options?: RollTable.DrawOptions): Promise<RollTableDraw>;

    /**
     * Normalize the probabilities of rolling each item in the RollTable based on their assigned weights
     */
    normalize(): Promise<this | undefined>;

    /**
     * Reset the state of the RollTable to return any drawn items to the table
     */
    resetResults(): Promise<InstanceType<ConfiguredDocumentClass<typeof BaseTableResult>>[]>;

    /**
     * Evaluate a RollTable by rolling its formula and retrieving a drawn result.
     *
     * Note that this function only performs the roll and identifies the result, the RollTable#draw function should be
     * called to formalize the draw from the table.
     *
     * @param options   - Options which modify rolling behavior
     *                  (default: `{}`)
     * @returns The Roll and results drawn by that Roll
     *
     * @example Draw results using the default table formula
     * ```ts
     * const defaultResults = await table.roll();
     * ```
     *
     * @example Draw results using a custom roll formula
     * ```ts
     * const roll = new Roll("1d20 + \@abilities.wis.mod", actor.getRollData());
     * const customResults = await table.roll({roll});
     * ```
     */
    roll(options?: RollTable.RollOptions): Promise<RollTableDraw>;

    /**
     * Get an Array of valid results for a given rolled total
     * @param value   - The rolled value
     * @returns An Array of results
     */
    getResultsForRoll(value: number): InstanceType<ConfiguredDocumentClass<typeof TableResult>>[];

    /** @internal */
    protected override _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: foundry.abstract.Document<any, any>[],
      result: Record<string, unknown>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /** @internal */
    protected override _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: InstanceType<ConfiguredDocumentClass<typeof TableResult>>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    override toCompendium(
      pack?: CompendiumCollection<CompendiumCollection.Metadata> | null | undefined,
      options?: ClientDocumentMixin.CompendiumExportOptions | undefined
    ): Omit<RollTableData["_source"], "_id" | "folder" | "permission"> & {
      permission?: RollTableData extends { toObject(): infer U } ? U : never;
    };

    /**
     * Create a new RollTable document using all of the Documents from a specific Folder as new results.
     * @param folder    - The Folder document from which to create a roll table
     * @param options   - Additional options passed to the RollTable.create method
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
      results: TableResultData[];

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
    results: InstanceType<ConfiguredDocumentClass<typeof BaseTableResult>>[];
  }
}
