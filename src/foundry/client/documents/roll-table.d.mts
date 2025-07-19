import type { InexactPartial, Merge } from "#utils";
import type { documents } from "#client/client.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseRollTable from "#common/documents/roll-table.mjs";
import type TextEditor from "#client/applications/ux/text-editor.mjs";

import fields = foundry.data.fields;

declare namespace RollTable {
  /**
   * The document's name.
   */
  type Name = "RollTable";

  /**
   * The context used to create a `RollTable`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `RollTable`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `RollTable` document instance configured through `CONFIG.RollTable.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} or {@link ConfiguredRollTable | `fvtt-types/configuration/ConfiguredRollTable`} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `RollTable` document configured through `CONFIG.RollTable.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata
    extends Merge<
      Document.Metadata.Default,
      Readonly<{
        name: "RollTable";
        collection: "tables";
        indexed: true;
        compendiumIndexFields: ["_id", "name", "img", "sort", "folder"];
        embedded: Metadata.Embedded;
        label: string;
        labelPlural: string;
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    /**
     * The embedded metadata
     */
    interface Embedded {
      TableResult: "results";
    }
  }

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = null;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendant = TableResult.Stored;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such classes, or never if the document doesn't have any descendants.
   */
  type DirectDescendantClass = TableResult.ImplementationClass;

  /**
   * A document's descendants are any documents that are contained within, either within its schema
   * or its descendant's schemas.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type Descendant = DirectDescendant;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all classes, or never if the document doesn't have any descendants.
   */
  type DescendantClass = DirectDescendantClass;

  /**
   * Types of `CompendiumCollection` this document might be contained in.
   * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
   *
   * Will be `never` if cannot be contained in a `CompendiumCollection`.
   */
  // Note: Takes any document in the heritage chain (i.e. itself or any parent, transitive or not) that can be contained in a compendium.
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<Name>;

  /**
   * An embedded document is a document contained in another.
   * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
   *
   * If this is `never` it is because there are no embeddable documents (or there's a bug!).
   */
  type Embedded = Document.ImplementationFor<Embedded.Name>;

  namespace Embedded {
    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type Name = keyof Metadata.Embedded;

    /**
     * Gets the collection name for an embedded document.
     */
    type CollectionNameOf<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionNameFor<
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * Gets the collection document for an embedded document.
     */
    type DocumentFor<CollectionName extends Embedded.CollectionName> = Document.Embedded.DocumentFor<
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * Gets the collection for an embedded document.
     */
    type CollectionFor<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionFor<
      RollTable.Implementation,
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * A valid name to refer to a collection embedded in this document. For example an `Actor`
     * has the key `"items"` which contains `Item` instance which would make both `"Item" | "Items"`
     * valid keys (amongst others).
     */
    type CollectionName = Document.Embedded.CollectionName<Metadata.Embedded>;
  }

  /**
   * The name of the world or embedded collection this document can find itself in.
   * For example an `Item` is always going to be inside a collection with a key of `items`.
   * This is a fixed string per document type and is primarily useful for {@link ClientDocumentMixin | `Descendant Document Events`}.
   */
  type ParentCollectionName = Metadata["collection"];

  /**
   * The world collection that contains `RollTable`s. Will be `never` if none exists.
   */
  type CollectionClass = foundry.documents.collections.RollTables.ImplementationClass;

  /**
   * The world collection that contains `RollTable`s. Will be `never` if none exists.
   */
  type Collection = foundry.documents.collections.RollTables.Implementation;

  /**
   * An instance of `RollTable` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `RollTable` that comes from the database.
   */
  type Stored = Document.Internal.Stored<RollTable.Implementation>;

  /**
   * The data put in {@link RollTable._source | `RollTable#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode RollTable.create}
   * and {@link RollTable | `new RollTable(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link RollTable.name | `RollTable#name`}.
   *
   * This is data transformed from {@linkcode RollTable.Source} and turned into more
   * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@link RollTable.update | `RollTable#update`}.
   * It is a distinct type from {@link RollTable.CreateData | `DeepPartial<RollTable.CreateData>`} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * The schema for {@linkcode RollTable}. This is the source of truth for how an RollTable document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode RollTable}. For example
   * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
   * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this RollTable document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this RollTable
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * An image file path which provides the thumbnail artwork for this RollTable
     * @defaultValue `BaseRollTable.DEFAULT_ICON`
     */
    img: fields.FilePathField<{
      categories: ["IMAGE"];
      initial: () => typeof documents.BaseRollTable.DEFAULT_ICON;
    }>;

    /**
     * The HTML text description for this RollTable document
     * @defaultValue `""`
     */
    description: fields.StringField<{ textSearch: true }>;

    /**
     * A Collection of TableResult embedded documents which belong to this RollTable
     * @defaultValue `[]`
     */
    results: fields.EmbeddedCollectionField<typeof documents.BaseTableResult, RollTable.Implementation>;

    /**
     * The Roll formula which determines the results chosen from the table
     * @defaultValue `""`
     */
    formula: fields.StringField;

    /**
     * Are results from this table drawn with replacement?
     * @defaultValue `true`
     */
    replacement: fields.BooleanField<{ initial: true }>;

    /**
     * Is the Roll result used to draw from this RollTable displayed in chat?
     * @defaultValue `true`
     */
    displayRoll: fields.BooleanField<{ initial: true }>;

    /**
     * The _id of a Folder which contains this RollTable
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

    /**
     * The numeric sort value which orders this RollTable relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures ownership of this RollTable
     * @defaultValue see {@linkcode fields.DocumentOwnershipField}
     */
    ownership: fields.DocumentOwnershipField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name>;

    /**
     * An object of creation and access information
     * @defaultValue see {@linkcode fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }

  namespace Database {
    /** Options passed along in Get operations for RollTables */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<RollTable.Parent> {}

    /** Options passed along in Create operations for RollTables */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<RollTable.CreateData, RollTable.Parent, Temporary> {}

    /** Options passed along in Delete operations for RollTables */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<RollTable.Parent> {}

    /** Options passed along in Update operations for RollTables */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<RollTable.UpdateData, RollTable.Parent> {}

    /** Operation for {@linkcode RollTable.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<RollTable.Database.Create<Temporary>> {}

    /** Operation for {@linkcode RollTable.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<RollTable.Database.Update> {}

    /** Operation for {@linkcode RollTable.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<RollTable.Database.Delete> {}

    /** Operation for {@linkcode RollTable.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<RollTable.Database.Create<Temporary>> {}

    /** Operation for {@link RollTable.update | `RollTable#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode RollTable.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link RollTable._preCreate | `RollTable#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link RollTable._onCreate | `RollTable#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode RollTable._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<RollTable.Database.Create> {}

    /** Operation for {@link RollTable._onCreateOperation | `RollTable#_onCreateOperation`} */
    interface OnCreateOperation extends RollTable.Database.Create {}

    /** Options for {@link RollTable._preUpdate | `RollTable#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link RollTable._onUpdate | `RollTable#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode RollTable._preUpdateOperation} */
    interface PreUpdateOperation extends RollTable.Database.Update {}

    /** Operation for {@link RollTable._onUpdateOperation | `RollTable._preUpdateOperation`} */
    interface OnUpdateOperation extends RollTable.Database.Update {}

    /** Options for {@link RollTable._preDelete | `RollTable#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link RollTable._onDelete | `RollTable#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link RollTable._preDeleteOperation | `RollTable#_preDeleteOperation`} */
    interface PreDeleteOperation extends RollTable.Database.Delete {}

    /** Options for {@link RollTable._onDeleteOperation | `RollTable#_onDeleteOperation`} */
    interface OnDeleteOperation extends RollTable.Database.Delete {}

    /** Context for {@linkcode RollTable._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<RollTable.Parent> {}

    /** Context for {@linkcode RollTable._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<RollTable.Parent> {}

    /** Context for {@linkcode RollTable._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<RollTable.Parent> {}

    /**
     * Options for {@link RollTable._preCreateDescendantDocuments | `RollTable#_preCreateDescendantDocuments`}
     * and {@link RollTable._onCreateDescendantDocuments | `RollTable#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<RollTable.Database.Create> {}

    /**
     * Options for {@link RollTable._preUpdateDescendantDocuments | `RollTable#_preUpdateDescendantDocuments`}
     * and {@link RollTable._onUpdateDescendantDocuments | `RollTable#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<RollTable.Database.Update> {}

    /**
     * Options for {@link RollTable._preDeleteDescendantDocuments | `RollTable#_preDeleteDescendantDocuments`}
     * and {@link RollTable._onDeleteDescendantDocuments | `RollTable#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<RollTable.Database.Delete> {}

    /**
     * Create options for {@linkcode RollTable.createDialog}.
     */
    interface DialogCreateOptions extends InexactPartial<Create> {}
  }

  /**
   * An object containing the executed Roll and the produced results
   */
  interface Draw {
    /**
     * The Dice roll which generated the draw
     */
    roll: Roll;

    /**
     * An array of drawn TableResult documents
     */
    results: Document.ToConfiguredInstance<typeof foundry.documents.BaseTableResult>[];
  }

  /**
   * If `Temporary` is true then `RollTable.Implementation`, otherwise `RollTable.Stored`.
   */
  type TemporaryIf<Temporary extends boolean | undefined> = true extends Temporary
    ? RollTable.Implementation
    : RollTable.Stored;

  /**
   * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
   */
  interface Flags extends Document.Internal.ConfiguredFlagsForName<Name> {}

  namespace Flags {
    /**
     * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
     */
    type Scope = Document.Internal.FlagKeyOf<Flags>;

    /**
     * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
     */
    type Key<Scope extends Flags.Scope> = Document.Internal.FlagKeyOf<Document.Internal.FlagGetKey<Flags, Scope>>;

    /**
     * Gets the type of a particular flag given a `Scope` and a `Key`.
     */
    type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.Internal.GetFlag<Flags, Scope, Key>;
  }

  interface DropData extends Document.Internal.DropData<Name> {}
  interface DropDataOptions extends Document.DropDataOptions {}

  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  type PreCreateDescendantDocumentsArgs = Document.PreCreateDescendantDocumentsArgs<
    RollTable.Stored,
    RollTable.DirectDescendant,
    RollTable.Metadata.Embedded
  >;

  type OnCreateDescendantDocumentsArgs = Document.OnCreateDescendantDocumentsArgs<
    RollTable.Stored,
    RollTable.DirectDescendant,
    RollTable.Metadata.Embedded
  >;

  type PreUpdateDescendantDocumentsArgs = Document.PreUpdateDescendantDocumentsArgs<
    RollTable.Stored,
    RollTable.DirectDescendant,
    RollTable.Metadata.Embedded
  >;

  type OnUpdateDescendantDocumentsArgs = Document.OnUpdateDescendantDocumentsArgs<
    RollTable.Stored,
    RollTable.DirectDescendant,
    RollTable.Metadata.Embedded
  >;

  type PreDeleteDescendantDocumentsArgs = Document.PreDeleteDescendantDocumentsArgs<
    RollTable.Stored,
    RollTable.DirectDescendant,
    RollTable.Metadata.Embedded
  >;

  type OnDeleteDescendantDocumentsArgs = Document.OnDeleteDescendantDocumentsArgs<
    RollTable.Stored,
    RollTable.DirectDescendant,
    RollTable.Metadata.Embedded
  >;

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
    results: TableResult.Implementation[];

    /**
     * Whether to automatically display the results in chat
     * @defaultValue `true`
     */
    displayChat: boolean;

    /**
     * The chat roll mode to use when displaying the result
     */
    rollMode: ChatMessage.PassableRollMode;
  }

  /**
   * Additional options which modify message creation
   */
  interface ToMessageOptions<Temporary extends boolean | undefined = undefined> {
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
    messageOptions: ChatMessage.Database.CreateOperation<Temporary>;
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

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;
}

/**
 * The client-side RollTable document which extends the common BaseRollTable model.
 *
 * @see {@linkcode RollTables}         The world-level collection of RollTable documents
 * @see {@linkcode TableResult}        The embedded TableResult document
 * @see {@linkcode RollTableConfig}    The RollTable configuration application
 */
declare class RollTable extends BaseRollTable.Internal.ClientDocument {
  /**
   * @param data    - Initial data from which to construct the `RollTable`
   * @param context - Construction context options
   */
  constructor(data: RollTable.CreateData, context?: RollTable.ConstructionContext);

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
    results: TableResult.Implementation[],
    options?: InexactPartial<RollTable.ToMessageOptions>,
  ): Promise<ChatMessage.Implementation | undefined>;

  /**
   * Draw a result from the RollTable based on the table formula or a provided Roll instance
   * @param options - Optional arguments which customize the draw behavior
   * @returns A Promise which resolves to an object containing the executed roll and the produced results
   */
  draw(options?: RollTable.DrawOptions): Promise<RollTable.Draw>;

  /**
   * Draw multiple results from a RollTable, constructing a final synthetic Roll as a dice pool of inner rolls.
   * @param number  - The number of results to draw
   * @param options - Optional arguments which customize the draw
   * @returns The drawn results
   */
  drawMany(number: number, options?: InexactPartial<RollTable.DrawOptions>): Promise<RollTable.Draw>;

  /**
   * Normalize the probabilities of rolling each item in the RollTable based on their assigned weights
   */
  normalize(): Promise<this | undefined>;

  /**
   * Reset the state of the RollTable to return any drawn items to the table
   * @remarks Actually, returns list of TableEntries updated, not the RollTable.
   * As written, it force updates all records, not just the ones already drawn.
   */
  resetResults(): Promise<TableResult.Stored[]>;

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
  roll(options?: RollTable.RollOptions): Promise<RollTable.Draw>;

  /**
   * Get an Array of valid results for a given rolled total
   * @param value - The rolled value
   * @returns An Array of results
   */
  getResultsForRoll(value: number): TableResult.Stored[];

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

  /**
   * Handle a roll from within embedded content.
   * @param event  - The originating event
   * @param action - The named action that was clicked
   */
  protected _onClickEmbedAction(event: PointerEvent, action: string): Promise<void>;

  override onEmbed(element: foundry.applications.elements.HTMLDocumentEmbedElement): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class GurpsRollTable extends RollTable {
   *   protected override _onCreateDescendantDocuments(...args: RollTable.OnCreateDescendantDocumentsArgs) {
   *     super._onCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, data, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onCreateDescendantDocuments(...args: RollTable.OnCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class BladesRollTable extends RollTable {
   *   protected override _onDeleteDescendantDocuments(...args: RollTable.OnUpdateDescendantDocuments) {
   *     super._onDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, ids, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onDeleteDescendantDocuments(...args: RollTable.OnDeleteDescendantDocumentsArgs): void;

  override toCompendium<Options extends ClientDocument.ToCompendiumOptions | undefined = undefined>(
    pack?: foundry.documents.collections.CompendiumCollection.Any | null,
    options?: Options,
  ): ClientDocument.ToCompendiumReturnType<"RollTable", Options>;

  /**
   * Create a new RollTable document using all of the Documents from a specific Folder as new results.
   * @param folder  - The Folder document from which to create a roll table
   * @param options - Additional options passed to the RollTable.create method
   */
  static fromFolder<Temporary extends boolean | undefined = undefined>(
    folder: Folder.Implementation,
    options?: RollTable.Database.CreateOperation<Temporary>,
  ): Promise<WallDocument.TemporaryIf<Temporary> | undefined>;

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  // ClientDocument overrides

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class SwadeRollTable extends RollTable {
   *   protected override _preCreateDescendantDocuments(...args: RollTable.PreCreateDescendantDocumentsArgs) {
   *     super._preCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, data, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preCreateDescendantDocuments(...args: RollTable.PreCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class LancerRollTable extends RollTable {
   *   protected override _preUpdateDescendantDocuments(...args: RollTable.OnUpdateDescendantDocuments) {
   *     super._preUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, changes, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preUpdateDescendantDocuments(...args: RollTable.PreUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class Ptr2eRollTable extends RollTable {
   *   protected override _onUpdateDescendantDocuments(...args: RollTable.OnUpdateDescendantDocumentsArgs) {
   *     super._onUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, changes, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onUpdateDescendantDocuments(...args: RollTable.OnUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class KultRollTable extends RollTable {
   *   protected override _preDeleteDescendantDocuments(...args: RollTable.PreDeleteDescendantDocumentsArgs) {
   *     super._preDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, ids, options, userId] = args;
   *     if (collection === "cards") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preDeleteDescendantDocuments(...args: RollTable.PreDeleteDescendantDocumentsArgs): void;

  static override defaultName(context?: RollTable.DefaultNameContext): string;

  static override createDialog(
    data?: RollTable.CreateDialogData,
    createOptions?: RollTable.Database.DialogCreateOptions,
    options?: RollTable.CreateDialogOptions,
  ): Promise<RollTable.Stored | null | undefined>;

  override deleteDialog(
    options?: InexactPartial<foundry.applications.api.DialogV2.ConfirmConfig>,
    operation?: Document.Database.DeleteOperationForName<"RollTable">,
  ): Promise<this | false | null | undefined>;

  static override fromDropData(
    data: RollTable.DropData,
    options?: RollTable.DropDataOptions,
  ): Promise<RollTable.Implementation | undefined>;

  static override fromImport(
    source: RollTable.Source,
    context?: Document.FromImportContext<RollTable.Parent> | null,
  ): Promise<RollTable.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default RollTable;
