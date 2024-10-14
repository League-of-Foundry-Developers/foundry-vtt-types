import type { ConfiguredDocumentClassForName, ConfiguredDocumentInstance } from "../../../../types/helperTypes.d.mts";
import type { InexactPartial } from "../../../../types/utils.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";
import type { ClientDocument } from "../abstract/client-document.d.mts";

declare global {
  namespace RollTable {
    type ConfiguredClass = ConfiguredDocumentClassForName<"RollTable">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

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
      results: TableResult[];

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
      messageOptions: Document.ModificationContext<Document.Any | null> & {
        rollMode: keyof CONFIG.Dice.RollModes | "roll";
      };
    }

    interface RollOptions {
      /**
       * An alternative dice Roll to use instead of the default table formula
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
   * The client-side RollTable document which extends the common BaseRollTable model.
   *
   * @see {@link RollTables}         The world-level collection of RollTable documents
   * @see {@link TableResult}        The embedded TableResult document
   * @see {@link RollTableConfig}    The RollTable configuration application
   */
  class RollTable extends ClientDocumentMixin(foundry.documents.BaseRollTable) {
    /**
     * Provide a thumbnail image path used to represent this document.
     */
    get thumbnail(): this["img"];

    /**
     * Display a result drawn from a RollTable in the Chat Log along.
     * Optionally also display the Roll which produced the result and configure aspects of the displayed messages.
     *
     * @param results - An Array of one or more TableResult Documents which were drawn and should be displayed
     * @param options - Additional options which modify message creation
     */
    toMessage(
      results: TableResult.ConfiguredInstance[],
      options?: InexactPartial<RollTable.ToMessageOptions>,
    ): Promise<ChatMessage.ConfiguredInstance | undefined>;

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
    drawMany(number: number, options?: InexactPartial<RollTable.DrawOptions>): Promise<RollTableDraw>;

    /**
     * Normalize the probabilities of rolling each item in the RollTable based on their assigned weights
     */
    normalize(): Promise<this | undefined>;

    /**
     * Reset the state of the RollTable to return any drawn items to the table
     * @remarks Actually, returns list of TableEntries updated, not the RollTable.
     * As written, it force updates all records, not just the ones already drawn.
     */
    resetResults(): Promise<TableResult.ConfiguredInstance[]>;

    /**
     * Evaluate a RollTable by rolling its formula and retrieving a drawn result.
     *
     * Note that this function only performs the roll and identifies the result, the RollTable#draw function should be
     * called to formalize the draw from the table.
     *
     * @param options - Options which modify rolling behavior
     *                  (default: `{}`)
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
    roll(options?: RollTable.RollOptions): Promise<RollTableDraw>;

    /**
     * Get an Array of valid results for a given rolled total
     * @param value - The rolled value
     * @returns An Array of results
     */
    getResultsForRoll(value: number): TableResult.ConfiguredInstance[];

    protected override _onCreateDescendantDocuments(
      parent: ClientDocument,
      collection: string,
      documents: ClientDocument[],
      data: unknown[],
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected override _onDeleteDescendantDocuments(
      parent: ClientDocument,
      collection: string,
      documents: ClientDocument[],
      ids: string,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    override toCompendium<
      FlagsOpt extends boolean = false,
      SourceOpt extends boolean = true,
      SortOpt extends boolean = true,
      FolderOpt extends boolean = false,
      OwnershipOpt extends boolean = false,
      StateOpt extends boolean = true,
      IdOpt extends boolean = false,
    >(
      pack?: CompendiumCollection<CompendiumCollection.Metadata> | null,
      options?: InexactPartial<
        ClientDocument.CompendiumExportOptions<FlagsOpt, SourceOpt, SortOpt, FolderOpt, OwnershipOpt, StateOpt, IdOpt>
      >,
    ): Omit<
      this["_source"],
      | (IdOpt extends false ? "_id" : never)
      | ClientDocument.OmitProperty<SortOpt, "sort" | "navigation" | "navOrder">
      | ClientDocument.OmitProperty<FolderOpt, "folder">
      | ClientDocument.OmitProperty<FlagsOpt, "flags">
      | ClientDocument.OmitProperty<OwnershipOpt, "ownership">
      | ClientDocument.OmitProperty<StateOpt, "active" | "fogReset" | "playing"> // does not model the results.drawn = false
    >;

    /**
     * Create a new RollTable document using all of the Documents from a specific Folder as new results.
     * @param folder  - The Folder document from which to create a roll table
     * @param options - Additional options passed to the RollTable.create method
     */
    static fromFolder(
      folder: Folder,
      options?: DocumentModificationOptions,
    ): Promise<RollTable.ConfiguredInstance | undefined>;
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
    results: ConfiguredDocumentInstance<typeof foundry.documents.BaseTableResult>[];
  }
}
