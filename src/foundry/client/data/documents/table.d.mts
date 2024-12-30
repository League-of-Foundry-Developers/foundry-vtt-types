import type { InexactPartial } from "../../../../utils/index.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";
import type BaseRollTable from "../../../common/documents/roll-table.d.mts";

declare global {
  namespace RollTable {
    type Metadata = Document.MetadataFor<RollTable>;

    type ConfiguredClass = Document.ConfiguredClassForName<"RollTable">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"RollTable">;

    interface DatabaseOperations extends DocumentDatabaseOperations<RollTable> {}

    // Helpful aliases
    type ConstructorData = BaseRollTable.ConstructorData;
    type UpdateData = BaseRollTable.UpdateData;
    type Schema = BaseRollTable.Schema;
    type Source = BaseRollTable.Source;

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
      messageOptions: Document.OnCreateOptions<"ChatMessage">;
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

    interface RollTableHTMLEmbedConfig extends TextEditor.DocumentHTMLEmbedConfig {
      /**
       * Adds a button allowing the table to be rolled directly from its embedded context.
       * Default: `false`
       */
      rollable?: boolean | undefined;
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
    static override metadata: RollTable.Metadata;

    static get implementation(): RollTable.ConfiguredClass;

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
     * Handle a roll from within embedded content.
     * @param event - The originating event.
     */
    protected _rollFromEmbeddedHTML(event: PointerEvent): Promise<void>;

    /**
     * Get an Array of valid results for a given rolled total
     * @param value - The rolled value
     * @returns An Array of results
     */
    getResultsForRoll(value: number): TableResult.ConfiguredInstance[];

    /**
     * Create embedded roll table markup.
     * @param config  - Configuration for embedding behavior.
     * @param options - The original enrichment options for cases where the Document embed content
     *                  also contains text that must be enriched.
     *
     * @example Embed the content of a Roll Table as a figure.
     * ```
     * @Embed[RollTable.kRfycm1iY3XCvP8c]
     * ```
     * becomes
     * ```html
     * <figure class="content-embed" data-content-embed data-uuid="RollTable.kRfycm1iY3XCvP8c" data-id="kRfycm1iY3XCvP8c">
     *   <table class="roll-table-embed">
     *     <thead>
     *       <tr>
     *         <th>Roll</th>
     *         <th>Result</th>
     *       </tr>
     *     </thead>
     *     <tbody>
     *       <tr>
     *         <td>1&mdash;10</td>
     *         <td>
     *           <a class="inline-roll roll" data-mode="roll" data-formula="1d6">
     *             <i class="fas fa-dice-d20"></i>
     *             1d6
     *           </a>
     *           Orcs attack!
     *         </td>
     *       </tr>
     *       <tr>
     *         <td>11&mdash;20</td>
     *         <td>No encounter</td>
     *       </tr>
     *     </tbody>
     *   </table>
     *   <figcaption>
     *     <div class="embed-caption">
     *       <p>This is the Roll Table description.</p>
     *     </div>
     *     <cite>
     *       <a class="content-link" data-link data-uuid="RollTable.kRfycm1iY3XCvP8c" data-id="kRfycm1iY3XCvP8c"
     *          data-type="RollTable" data-tooltip="Rollable Table">
     *         <i class="fas fa-th-list"></i>
     *         Rollable Table
     *     </cite>
     *   </figcaption>
     * </figure>
     * ```
     */
    protected _buildEmbedHTML(
      config: TextEditor.DocumentHTMLEmbedConfig & { rollable: boolean },
      options?: TextEditor.EnrichmentOptions,
    ): Promise<HTMLElement | null>;

    protected override _createFigureEmbed(
      content: HTMLElement | HTMLCollection,
      config: TextEditor.DocumentHTMLEmbedConfig,
      options?: TextEditor.EnrichmentOptions,
    ): Promise<HTMLElement | null>;

    protected override _onCreateDescendantDocuments(
      parent: ClientDocument,
      collection: string,
      documents: ClientDocument[],
      data: unknown[],
      options: Document.OnCreateOptions<"TableResult">,
      userId: string,
    ): void;

    protected override _onDeleteDescendantDocuments(
      parent: ClientDocument,
      collection: string,
      documents: ClientDocument[],
      ids: string,
      options: Document.OnDeleteOptions<"TableResult">,
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
      options?: Document.OnCreateOptions<"Folder">,
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
    results: Document.ToConfiguredInstance<typeof foundry.documents.BaseTableResult>[];
  }
}
