import type Document from "#common/abstract/document.d.mts";
import type { documents } from "#client/client.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { InexactPartial, InterfaceToObject, Merge } from "#utils";
import type BaseJournalEntry from "#common/documents/journal-entry.mjs";
import type { Note } from "#client/canvas/placeables/_module.d.mts";
import type { NotesLayer } from "#client/canvas/layers/_module.d.mts";

import fields = foundry.data.fields;

declare namespace JournalEntry {
  /**
   * The document's name.
   */
  type Name = "JournalEntry";

  /**
   * The context used to create a `JournalEntry`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `JournalEntry`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `JournalEntry` document instance configured through `CONFIG.JournalEntry.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} or {@link ConfiguredJournalEntry | `fvtt-types/configuration/ConfiguredJournalEntry`} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `JournalEntry` document configured through `CONFIG.JournalEntry.documentClass` in Foundry and
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
        name: "JournalEntry";
        collection: "journal";
        indexed: true;
        compendiumIndexFields: ["_id", "name", "sort", "folder"];
        embedded: Metadata.Embedded;
        label: string;
        labelPlural: string;
        permissions: Metadata.Permissions;
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    /**
     * The embedded metadata
     */
    interface Embedded {
      JournalEntryCategory: "categories";
      JournalEntryPage: "pages";
    }

    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create: "JOURNAL_CREATE";
      delete: "OWNER";
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
  type DirectDescendant = JournalEntryPage.Stored;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such classes, or never if the document doesn't have any descendants.
   */
  type DirectDescendantClass = JournalEntryPage.ImplementationClass;

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
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"JournalEntry">;

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
      JournalEntry.Implementation,
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
   * The world collection that contains `JournalEntry`s. Will be `never` if none exists.
   */
  type CollectionClass = foundry.documents.collections.Journal.ImplementationClass;

  /**
   * The world collection that contains `JournalEntry`s. Will be `never` if none exists.
   */
  type Collection = foundry.documents.collections.Journal.Implementation;

  /**
   * An instance of `JournalEntry` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `JournalEntry` that comes from the database.
   */
  type Stored = Document.Internal.Stored<JournalEntry.Implementation>;

  /**
   * The data put in {@link JournalEntry._source | `JournalEntry#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode JournalEntry.create}
   * and {@link JournalEntry | `new JournalEntry(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link JournalEntry.name | `JournalEntry#name`}.
   *
   * This is data transformed from {@linkcode JournalEntry.Source} and turned into more
   * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@link JournalEntry.update | `JournalEntry#update`}.
   * It is a distinct type from {@link JournalEntry.CreateData | `DeepPartial<JournalEntry.CreateData>`} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * The schema for {@linkcode JournalEntry}. This is the source of truth for how an JournalEntry document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode JournalEntry}. For example
   * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
   * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this JournalEntry document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this JournalEntry
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * The pages contained within this JournalEntry document
     * @defaultValue `[]`
     */
    pages: fields.EmbeddedCollectionField<typeof documents.BaseJournalEntryPage, JournalEntry.Implementation>;

    /**
     * The _id of a Folder which contains this JournalEntry
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

    /**
     * The categories contained within this JournalEntry.
     * @defaultValue `[]`
     */
    categories: fields.EmbeddedCollectionField<typeof documents.BaseJournalEntryCategory, JournalEntry.Implementation>;

    /**
     * The numeric sort value which orders this JournalEntry relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures ownership of this JournalEntry
     * @defaultValue see {@linkcode fields.DocumentOwnershipField}
     */
    ownership: fields.DocumentOwnershipField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name, InterfaceToObject<CoreFlags>>;

    /**
     * An object of creation and access information
     * @defaultValue see {@linkcode fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }

  namespace Database {
    /** Options passed along in Get operations for  JournalEntries */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<JournalEntry.Parent> {}

    /** Options passed along in Create operations for  JournalEntries */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<JournalEntry.CreateData, JournalEntry.Parent, Temporary> {}

    /** Options passed along in Delete operations for  JournalEntries */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<JournalEntry.Parent> {}

    /** Options passed along in Update operations for  JournalEntries */
    interface Update
      extends foundry.abstract.types.DatabaseUpdateOperation<JournalEntry.UpdateData, JournalEntry.Parent> {}

    /** Operation for {@linkcode JournalEntry.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<JournalEntry.Database.Create<Temporary>> {}

    /** Operation for {@linkcode JournalEntry.updateDocuments} */
    interface UpdateDocumentsOperation
      extends Document.Database.UpdateDocumentsOperation<JournalEntry.Database.Update> {}

    /** Operation for {@linkcode JournalEntry.deleteDocuments} */
    interface DeleteDocumentsOperation
      extends Document.Database.DeleteDocumentsOperation<JournalEntry.Database.Delete> {}

    /** Operation for {@linkcode JournalEntry.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<JournalEntry.Database.Create<Temporary>> {}

    /** Operation for {@link JournalEntry.update | `JournalEntry#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode JournalEntry.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link JournalEntry._preCreate | `JournalEntry#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link JournalEntry._onCreate | `JournalEntry#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode JournalEntry._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<JournalEntry.Database.Create> {}

    /** Operation for {@link JournalEntry._onCreateOperation | `JournalEntry#_onCreateOperation`} */
    interface OnCreateOperation extends JournalEntry.Database.Create {}

    /** Options for {@link JournalEntry._preUpdate | `JournalEntry#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link JournalEntry._onUpdate | `JournalEntry#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode JournalEntry._preUpdateOperation} */
    interface PreUpdateOperation extends JournalEntry.Database.Update {}

    /** Operation for {@link JournalEntry._onUpdateOperation | `JournalEntry._preUpdateOperation`} */
    interface OnUpdateOperation extends JournalEntry.Database.Update {}

    /** Options for {@link JournalEntry._preDelete | `JournalEntry#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link JournalEntry._onDelete | `JournalEntry#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link JournalEntry._preDeleteOperation | `JournalEntry#_preDeleteOperation`} */
    interface PreDeleteOperation extends JournalEntry.Database.Delete {}

    /** Options for {@link JournalEntry._onDeleteOperation | `JournalEntry#_onDeleteOperation`} */
    interface OnDeleteOperation extends JournalEntry.Database.Delete {}

    /** Context for {@linkcode JournalEntry._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<JournalEntry.Parent> {}

    /** Context for {@linkcode JournalEntry._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<JournalEntry.Parent> {}

    /** Context for {@linkcode JournalEntry._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<JournalEntry.Parent> {}

    /**
     * Options for {@link JournalEntry._preCreateDescendantDocuments | `JournalEntry#_preCreateDescendantDocuments`}
     * and {@link JournalEntry._onCreateDescendantDocuments | `JournalEntry#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<JournalEntry.Database.Create> {}

    /**
     * Options for {@link JournalEntry._preUpdateDescendantDocuments | `JournalEntry#_preUpdateDescendantDocuments`}
     * and {@link JournalEntry._onUpdateDescendantDocuments | `JournalEntry#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<JournalEntry.Database.Update> {}

    /**
     * Options for {@link JournalEntry._preDeleteDescendantDocuments | `JournalEntry#_preDeleteDescendantDocuments`}
     * and {@link JournalEntry._onDeleteDescendantDocuments | `JournalEntry#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<JournalEntry.Database.Delete> {}

    /**
     * Create options for {@linkcode JournalEntry.createDialog}.
     */
    interface DialogCreateOptions extends InexactPartial<Create> {}
  }

  /**
   * If `Temporary` is true then `JournalEntry.Implementation`, otherwise `JournalEntry.Stored`.
   */
  type TemporaryIf<Temporary extends boolean | undefined> = true extends Temporary
    ? JournalEntry.Implementation
    : JournalEntry.Stored;

  /**
   * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
   */
  interface Flags extends Document.Internal.ConfiguredFlagsForName<Name>, CoreFlags {}

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

  interface CoreFlags {
    core?: {
      viewMode?: foundry.applications.sheets.journal.JournalEntrySheet.VIEW_MODES;
      searchMode?: CONST.DIRECTORY_SEARCH_MODES;
    };
  }

  interface DropData extends Document.Internal.DropData<Name> {}
  interface DropDataOptions extends Document.DropDataOptions {}

  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  type PreCreateDescendantDocumentsArgs = Document.PreCreateDescendantDocumentsArgs<
    JournalEntry.Stored,
    JournalEntry.DirectDescendant,
    JournalEntry.Metadata.Embedded
  >;

  type OnCreateDescendantDocumentsArgs = Document.OnCreateDescendantDocumentsArgs<
    JournalEntry.Stored,
    JournalEntry.DirectDescendant,
    JournalEntry.Metadata.Embedded
  >;

  type PreUpdateDescendantDocumentsArgs = Document.PreUpdateDescendantDocumentsArgs<
    JournalEntry.Stored,
    JournalEntry.DirectDescendant,
    JournalEntry.Metadata.Embedded
  >;

  type OnUpdateDescendantDocumentsArgs = Document.OnUpdateDescendantDocumentsArgs<
    JournalEntry.Stored,
    JournalEntry.DirectDescendant,
    JournalEntry.Metadata.Embedded
  >;

  type PreDeleteDescendantDocumentsArgs = Document.PreDeleteDescendantDocumentsArgs<
    JournalEntry.Stored,
    JournalEntry.DirectDescendant,
    JournalEntry.Metadata.Embedded
  >;

  type OnDeleteDescendantDocumentsArgs = Document.OnDeleteDescendantDocumentsArgs<
    JournalEntry.Stored,
    JournalEntry.DirectDescendant,
    JournalEntry.Metadata.Embedded
  >;

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
 * The client-side JournalEntry document which extends the common BaseJournalEntry model.
 *
 * @see {@linkcode Journal}                  The world-level collection of JournalEntry documents
 * @see {@linkcode JournalSheet}          The JournalEntry configuration application
 */
declare class JournalEntry extends BaseJournalEntry.Internal.ClientDocument {
  /**
   * @param data    - Initial data from which to construct the `JournalEntry`
   * @param context - Construction context options
   */
  constructor(data: JournalEntry.CreateData, context?: JournalEntry.ConstructionContext);

  /**
   * A boolean indicator for whether or not the JournalEntry is visible to the current user in the directory sidebar
   */
  get visible(): boolean;

  /**
   * @remarks "Upgrade to OBSERVER ownership if the journal entry is in a LIMITED compendium,
   * as LIMITED has no special meaning for journal entries in this context."
   */
  override getUserLevel(user?: User.Implementation): foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | null;

  /**
   * Return a reference to the Note instance for this Journal Entry in the current Scene, if any.
   * If multiple notes are placed for this Journal Entry, only the first will be returned.
   */
  get sceneNote(): Note.Implementation | null;

  /**
   * Show the JournalEntry to connected players.
   * By default the entry will only be shown to players who have permission to observe it.
   * If the parameter force is passed, the entry will be shown to all players regardless of normal permission.
   *
   * @param force - Display the entry to all players regardless of normal permissions (default: `false`)
   * @returns A Promise that resolves back to the shown entry once the request is processed
   */
  show(force?: boolean | null): Promise<this>;

  /**
   * If the JournalEntry has a pinned note on the canvas, this method will animate to that note
   * The note will also be highlighted as if hovered upon by the mouse
   * @param options - Options which modify the pan operation
   * @returns A Promise which resolves once the pan animation has concluded
   */
  panToNote(options?: NotesLayer.PanToNoteOptions): Promise<void>;

  // _onUpdate and _onDelete are overridden but with no signature changes from their definition in BaseJournalEntry.

  /**
   * A sorting comparator for `JournalEntryCategory` documents
   */
  static sortCategories(a: JournalEntryCategory.Implementation, b: JournalEntryCategory.Implementation): number;

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
   * class SwadeCards extends Cards {
   *   protected override _preCreateDescendantDocuments(...args: Cards.PreCreateDescendantDocumentsArgs) {
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
  protected override _preCreateDescendantDocuments(...args: Cards.PreCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class GurpsCards extends Cards {
   *   protected override _onCreateDescendantDocuments(...args: Cards.OnCreateDescendantDocumentsArgs) {
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
  protected override _onCreateDescendantDocuments(...args: Cards.OnCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class LancerCards extends Cards {
   *   protected override _preUpdateDescendantDocuments(...args: Cards.OnUpdateDescendantDocuments) {
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
  protected override _preUpdateDescendantDocuments(...args: Cards.PreUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class Ptr2eCards extends Cards {
   *   protected override _onUpdateDescendantDocuments(...args: Cards.OnUpdateDescendantDocumentsArgs) {
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
  protected override _onUpdateDescendantDocuments(...args: Cards.OnUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class KultCards extends Cards {
   *   protected override _preDeleteDescendantDocuments(...args: Cards.PreDeleteDescendantDocumentsArgs) {
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
  protected override _preDeleteDescendantDocuments(...args: Cards.PreDeleteDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class BladesCards extends Cards {
   *   protected override _onDeleteDescendantDocuments(...args: Cards.OnUpdateDescendantDocuments) {
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
  protected override _onDeleteDescendantDocuments(...args: Cards.OnDeleteDescendantDocumentsArgs): void;

  static override defaultName(context?: JournalEntry.DefaultNameContext): string;

  static override createDialog(
    data?: JournalEntry.CreateDialogData,
    createOptions?: JournalEntry.Database.DialogCreateOptions,
    options?: JournalEntry.CreateDialogOptions,
  ): Promise<JournalEntry.Stored | null | undefined>;

  override deleteDialog(
    options?: InexactPartial<foundry.applications.api.DialogV2.ConfirmConfig>,
    operation?: Document.Database.DeleteOperationForName<"JournalEntry">,
  ): Promise<this | false | null | undefined>;

  static override fromDropData(
    data: JournalEntry.DropData,
    options?: JournalEntry.DropDataOptions,
  ): Promise<JournalEntry.Implementation | undefined>;

  static override fromImport(
    source: JournalEntry.Source,
    context?: Document.FromImportContext<JournalEntry.Parent> | null,
  ): Promise<JournalEntry.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default JournalEntry;
