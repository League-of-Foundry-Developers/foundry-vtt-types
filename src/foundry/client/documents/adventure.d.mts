import type { InexactPartial, Merge, NullishProps } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseAdventure from "#common/documents/adventure.mjs";
import type DataModel from "#common/abstract/data.mjs";

declare namespace Adventure {
  /**
   * The document's name.
   */
  type Name = "Adventure";

  /**
   * The context used to create an `Adventure`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `Adventure`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Adventure` document instance configured through `CONFIG.Adventure.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} or {@link ConfiguredAdventure | `fvtt-types/configuration/ConfiguredAdventure`} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Adventure` document configured through `CONFIG.Adventure.documentClass` in Foundry and
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
        name: "Adventure";
        collection: "adventures";
        compendiumIndexFields: ["_id", "name", "img", "sort", "folder"];
        label: string;
        labelPlural: string;
        schemaVersion: string;
      }>
    > {}

  // No need for Metadata namespace

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = null;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all instances, or never if the document doesn't have any descendants.
   */
  type Descendant = never;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all classes, or never if the document doesn't have any descendants.
   */
  type DescendantClass = never;

  /**
   * Types of `CompendiumCollection` this document might be contained in.
   * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
   *
   * Will be `never` if cannot be contained in a `CompendiumCollection`.
   */
  // Note: Takes any document in the heritage chain (i.e. itself or any parent, transitive or not) that can be contained in a compendium.
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"Adventure">;

  /**
   * An embedded document is a document contained in another.
   * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
   *
   * If this is `never` it is because there are no embeddable documents (or there's a bug!).
   */
  type Embedded = never;

  /**
   * The name of the world or embedded collection this document can find itself in.
   * For example an `Item` is always going to be inside a collection with a key of `items`.
   * This is a fixed string per document type and is primarily useful for {@link ClientDocumentMixin | `Descendant Document Events`}.
   */
  type ParentCollectionName = Metadata["collection"];

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type CollectionClass = never;

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type Collection = never;

  /**
   * An instance of `Adventure` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  interface Invalid extends Document.Internal.Invalid<Adventure.Implementation> {}

  /**
   * An instance of `Adventure` that comes from the database.
   */
  type Stored = Document.Internal.Stored<Adventure.Implementation>;

  /**
   * The data put in {@link Adventure._source | `Adventure#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Adventure.create}
   * and {@link Adventure | `new Adventure(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link Adventure.name | `Adventure#name`}.
   *
   * This is data transformed from {@linkcode Adventure.Source} and turned into more
   * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@link Adventure.update | `Adventure#update`}.
   * It is a distinct type from {@link Adventure.CreateData | `DeepPartial<Adventure.CreateData>`} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * The schema for {@linkcode Adventure}. This is the source of truth for how an Adventure document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Adventure}. For example
   * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
   * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Adventure document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The human-readable name of the Adventure
     */
    name: fields.StringField<
      {
        required: true;
        blank: false;
        textSearch: true;
      },
      // Note(LukeAbby): Field override because `blank: false` isn't fully accounted for or something.
      string,
      string,
      string
    >;

    /**
     * The file path for the primary image of the adventure
     * @defaultValue `null`
     */
    img: fields.FilePathField<{ categories: ["IMAGE"] }>;

    /**
     * A string caption displayed under the primary image banner
     * @defaultValue `""`
     */
    caption: fields.HTMLField;

    /**
     * An HTML text description for the adventure
     * @defaultValue `""`
     */
    description: fields.HTMLField<{
      textSearch: true;
    }>;

    /**
     * An array of Actor documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    actors: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseActor>>;

    /**
     * An array of Combat documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    combats: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseCombat>>;

    /**
     * An array of Item documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    items: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseItem>>;

    /**
     * An array of JournalEntry documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    journal: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseJournalEntry>>;

    /**
     * An array of Scene documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    scenes: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseScene>>;

    /**
     * An array of RollTable documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    tables: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseRollTable>>;

    /**
     * An array of Macro documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    macros: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseMacro>>;

    /**
     * An array of Cards documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    cards: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseCards>>;

    /**
     * An array of Playlist documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    playlists: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BasePlaylist>>;

    /**
     * An array of Folder documents which are included in the adventure
     * @defaultValue `new Set()`
     */
    folders: fields.SetField<fields.EmbeddedDataField<typeof foundry.documents.BaseFolder>>;

    folder: fields.ForeignDocumentField<typeof foundry.documents.BaseFolder>;

    /**
     * The sort order of this adventure relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

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
    /** Options passed along in Get operations for Adventures */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<Adventure.Parent> {}

    /** Options passed along in Create operations for Adventures */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<Adventure.CreateData, Adventure.Parent, Temporary> {}

    /** Options passed along in Delete operations for Adventures */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Adventure.Parent> {}

    /** Options passed along in Update operations for Adventures */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Adventure.UpdateData, Adventure.Parent> {}

    /** Operation for {@linkcode Adventure.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<Adventure.Database.Create<Temporary>> {}

    /** Operation for {@linkcode Adventure.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Adventure.Database.Update> {}

    /** Operation for {@linkcode Adventure.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Adventure.Database.Delete> {}

    /** Operation for {@linkcode Adventure.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<Adventure.Database.Create<Temporary>> {}

    /** Operation for {@link Adventure.update | `Adventure#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode Adventure.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link Adventure._preCreate | `Adventure#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link Adventure._onCreate | `Adventure#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode Adventure._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Adventure.Database.Create> {}

    /** Operation for {@link Adventure._onCreateOperation | `Adventure#_onCreateOperation`} */
    interface OnCreateOperation extends Adventure.Database.Create {}

    /** Options for {@link Adventure._preUpdate | `Adventure#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link Adventure._onUpdate | `Adventure#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode Adventure._preUpdateOperation} */
    interface PreUpdateOperation extends Adventure.Database.Update {}

    /** Operation for {@link Adventure._onUpdateOperation | `Adventure._preUpdateOperation`} */
    interface OnUpdateOperation extends Adventure.Database.Update {}

    /** Options for {@link Adventure._preDelete | `Adventure#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link Adventure._onDelete | `Adventure#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link Adventure._preDeleteOperation | `Adventure#_preDeleteOperation`} */
    interface PreDeleteOperation extends Adventure.Database.Delete {}

    /** Options for {@link Adventure._onDeleteOperation | `Adventure#_onDeleteOperation`} */
    interface OnDeleteOperation extends Adventure.Database.Delete {}

    /** Context for {@linkcode Adventure._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<Adventure.Parent> {}

    /** Context for {@linkcode Adventure._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<Adventure.Parent> {}

    /** Context for {@linkcode Adventure._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<Adventure.Parent> {}

    /**
     * Options for {@link Adventure._preCreateDescendantDocuments | `Adventure#_preCreateDescendantDocuments`}
     * and {@link Adventure._onCreateDescendantDocuments | `Adventure#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<Adventure.Database.Create> {}

    /**
     * Options for {@link Adventure._preUpdateDescendantDocuments | `Adventure#_preUpdateDescendantDocuments`}
     * and {@link Adventure._onUpdateDescendantDocuments | `Adventure#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<Adventure.Database.Update> {}

    /**
     * Options for {@link Adventure._preDeleteDescendantDocuments | `Adventure#_preDeleteDescendantDocuments`}
     * and {@link Adventure._onDeleteDescendantDocuments | `Adventure#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<Adventure.Database.Delete> {}
  }

  /**
   * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
   */
  interface Flags extends Document.ConfiguredFlagsForName<Name> {}

  namespace Flags {
    /**
     * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
     */
    type Scope = Document.FlagKeyOf<Flags>;

    /**
     * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
     */
    type Key<Scope extends Flags.Scope> = Document.FlagKeyOf<Document.FlagGetKey<Flags, Scope>>;

    /**
     * Gets the type of a particular flag given a `Scope` and a `Key`.
     */
    type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.GetFlag<Name, Scope, Key>;
  }

  interface DropData extends Document.Internal.DropData<Name> {}
  interface DropDataOptions extends Document.DropDataOptions {}

  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  type DocumentDataRecord = {
    [K in ContainedDocumentType]?: Document.CreateDataForName<K>[];
  };

  type DocumentResult = {
    [K in ContainedDocumentType]?: Document.ImplementationFor<K>[];
  };

  type ContainedDocumentType = Exclude<Extract<Folder.SubType, Document.Type>, "Adventure"> | "Folder";

  interface ImportData {
    toCreate: DocumentDataRecord;
    toUpdate: DocumentDataRecord;
    documentCount: number;
  }

  interface ImportResult {
    created: DocumentResult;
    updated: DocumentResult;
  }

  /** @internal */
  type _PrepareImportOptions = InexactPartial<{
    /**
     * A subset of adventure fields to import.
     * @defaultValue `[]`
     * @remarks Can't be `null` as it only has a parameter default
     */
    importFields: Array<keyof typeof foundry.documents.BaseAdventure.contentFields | "all">;
  }>;

  interface PrepareImportOptions extends _PrepareImportOptions {}

  /** @internal */
  type _ImportOptions = NullishProps<{
    /**
     * Display a warning dialog if existing documents would be overwritten
     * @defaultValue `true`
     */
    dialog: boolean;

    /**
     * An array of awaited pre-import callbacks
     */
    preImport?: ((data: Adventure.ImportData, options: Adventure.ImportOptions) => Promise<void>)[];

    /**
     * An array of awaited post-import callbacks
     */
    postImport?: ((result: Adventure.ImportResult, options: Adventure.ImportOptions) => Promise<void>)[];
  }>;

  interface ImportOptions extends _ImportOptions, PrepareImportOptions {}

  /**
   * The arguments to construct the document.
   *
   * @deprecated - Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;
}

/**
 * The client-side Adventure document which extends the common {@linkcode foundry.documents.BaseAdventure} model.
 */
declare class Adventure extends BaseAdventure.Internal.ClientDocument {
  /**
   * @param data    - Initial data from which to construct the `Adventure`
   * @param context - Construction context options
   */
  constructor(data: Adventure.CreateData, context?: Adventure.ConstructionContext);

  /**
   * @remarks If this creation is happening in a provided `pack`, and that pack is **not** system-specific,
   * strips `Actor`s, `Item`s, and `Actor` and `Item` `Folders` from `source`s
   */
  // options: not null (parameter default only, destructured in super)
  static override fromSource(
    source: Adventure.CreateData,
    context?: DataModel.FromSourceOptions,
  ): Adventure.Implementation;

  /**
   * Perform a full import workflow of this Adventure.
   * Create new and update existing documents within the World.
   * @param options - Options which configure and customize the import process
   * @returns The import result
   */
  // options: not null (destructured)
  import(options?: Adventure.ImportOptions): Promise<Adventure.ImportResult>;

  /**
   * Prepare Adventure data for import into the World.
   * @param options - Options passed in from the import dialog to configure the import behavior
   * @returns A subset of adventure fields to import.
   */
  // options: not null (destructured)
  prepareImport(options?: Adventure.PrepareImportOptions): Promise<Adventure.ImportData>;

  /**
   * Execute an Adventure import workflow, creating and updating documents in the World.
   * @remarks Despite having a parameter default, neither `data` nor any of its keys are optional, as the keys themselves have no defaults,
   * and `toCreate` and `toUpdate` get passed to `Object.entries` which throws on nullish values, and `documentCount`is used as a divisor
   */
  importContent(data: Adventure.ImportData): Promise<Adventure.ImportResult>;

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

  // Descendant Document operations have been left out because Adventure does not have any descendant documents.

  // context: not null (destructured)
  static override defaultName(context?: Adventure.DefaultNameContext): string;

  /** @remarks `context.parent` is required as creation requires one */
  static override createDialog(
    data: Adventure.CreateDialogData | undefined,
    createOptions?: Adventure.Database.CreateOptions,
    options?: Adventure.CreateDialogOptions,
  ): Promise<Adventure.Stored | null | undefined>;

  override deleteDialog(
    options?: InexactPartial<foundry.applications.api.DialogV2.ConfirmConfig>,
    operation?: Document.Database.DeleteOperationForName<"Adventure">,
  ): Promise<this | false | null | undefined>;

  // options: not null (parameter default only)
  static override fromDropData(
    data: Adventure.DropData,
    options?: Adventure.DropDataOptions,
  ): Promise<Adventure.Implementation | undefined>;

  static override fromImport(
    source: Adventure.Source,
    context?: Document.FromImportContext<Adventure.Parent> | null,
  ): Promise<Adventure.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default Adventure;
