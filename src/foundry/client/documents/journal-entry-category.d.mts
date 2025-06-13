import type { Merge } from "#utils";
import type Document from "#common/abstract/document.mjs";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseJournalEntryCategory from "#common/documents/journal-entry-category.d.mts";

import fields = foundry.data.fields;

declare namespace JournalEntryCategory {
  /**
   * The document's name.
   */
  type Name = "JournalEntryCategory";

  /**
   * The arguments to construct the document.
   */
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

  /**
   * The documents embedded within `JournalEntryCategory`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `JournalEntryCategory` document instance configured through `CONFIG.JournalEntryCategory.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} or {@link ConfiguredJournalEntryCategory | `fvtt-types/configuration/ConfiguredJournalEntryCategory`} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `JournalEntryCategory` document configured through `CONFIG.Combat.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  interface Metadata
    extends Merge<
      Document.Metadata.Default,
      Readonly<{
        name: "JournalEntryCategory";
        collection: "categories";
        label: string;
        labelPlural: string;
        isEmbedded: true;
        schemaVersion: string;
      }>
    > {}

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = JournalEntry.Implementation | null;

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
  type Pack = never;

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
   * An instance of `JournalEntryCategory` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  interface Invalid extends Document.Internal.Invalid<JournalEntryCategory.Implementation> {}

  /**
   * An instance of `JournalEntryCategory` that comes from the database.
   */
  interface Stored extends Document.Internal.Stored<JournalEntryCategory.Implementation> {}

  /**
   * The data put in {@link JournalEntryCategory._source | `JournalEntryCategory#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode JournalEntryCategory.create}
   * and {@link JournalEntryCategory | `new JournalEntryCategory(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link JournalEntryCategory.name | `JournalEntryCategory#name`}.
   *
   * This is data transformed from {@linkcode JournalEntryCategory.Source} and turned into more
   * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@link JournalEntryCategory.update | `JournalEntryCategory#update`}.
   * It is a distinct type from {@link JournalEntryCategory.CreateData | `DeepPartial<JournalEntryCategory.CreateData>`} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * The schema for {@linkcode JournalEntryCategory}. This is the source of truth for how an JournalEntryCategory document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode JournalEntryCategory}. For example
   * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
   * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this JournalEntryCategory embedded document.
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this JournalEntryCategory.
     */
    name: fields.StringField<{ required: true; blank: true; textSearch: true }>;

    /**
     * The numeric sort value which orders this category relative to other categories.
     */
    sort: fields.IntegerSortField;

    /**
     * An object of optional key/value flags.
     */
    // TODO: retype this to `DocumentFlagsField`
    flags: fields.ObjectField.FlagsField<Name>;

    /**
     * An object of creation and access information.
     */
    _stats: fields.DocumentStatsField;
  }

  namespace Database {
    /** Options passed along in Get operations for JournalEntryCategories */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<JournalEntryCategory.Parent> {}

    /** Options passed along in Create operations for JournalEntryCategories */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<
        JournalEntryCategory.CreateData,
        JournalEntryCategory.Parent,
        Temporary
      > {}

    /** Options passed along in Delete operations for JournalEntryCategories */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<JournalEntryCategory.Parent> {}

    /** Options passed along in Update operation for JournalEntryCategories */
    interface Update
      extends foundry.abstract.types.DatabaseUpdateOperation<
        JournalEntryCategory.UpdateData,
        JournalEntryCategory.Parent
      > {}

    /** Operation for {@linkcode JournalEntryCategory.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<JournalEntryCategory.Database.Create<Temporary>> {}

    /** Operation for {@linkcode JournalEntryCategory.updateDocuments} */
    interface UpdateDocumentsOperation
      extends Document.Database.UpdateDocumentsOperation<JournalEntryCategory.Database.Update> {}

    /** Operation for {@linkcode JournalEntryCategory.deleteDocuments} */
    interface DeleteDocumentsOperation
      extends Document.Database.DeleteDocumentsOperation<JournalEntryCategory.Database.Delete> {}

    /** Operation for {@linkcode JournalEntryCategory.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<JournalEntryCategory.Database.Create<Temporary>> {}

    /** Operation for {@link JournalEntryCategory.update | `JournalEntryCategory#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode JournalEntryCategory.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link JournalEntryCategory._preCreate | `JournalEntryCategory#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link JournalEntryCategory._onCreate | `JournalEntryCategory#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode JournalEntryCategory._preCreateOperation} */
    interface PreCreateOperation
      extends Document.Database.PreCreateOperationStatic<JournalEntryCategory.Database.Create> {}

    /** Operation for {@link JournalEntryCategory._onCreateOperation | `JournalEntryCategory#_onCreateOperation`} */
    interface OnCreateOperation extends JournalEntryCategory.Database.Create {}

    /** Options for {@link JournalEntryCategory._preUpdate | `JournalEntryCategory#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link JournalEntryCategory._onUpdate | `JournalEntryCategory#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode JournalEntryCategory._preUpdateOperation} */
    interface PreUpdateOperation extends JournalEntryCategory.Database.Update {}

    /** Operation for {@link JournalEntryCategory._onUpdateOperation | `JournalEntryCategory._preUpdateOperation`} */
    interface OnUpdateOperation extends JournalEntryCategory.Database.Update {}

    /** Options for {@link JournalEntryCategory._preDelete | `JournalEntryCategory#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link JournalEntryCategory._onDelete | `JournalEntryCategory#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link JournalEntryCategory._preDeleteOperation | `JournalEntryCategory#_preDeleteOperation`} */
    interface PreDeleteOperation extends JournalEntryCategory.Database.Delete {}

    /** Options for {@link JournalEntryCategory._onDeleteOperation | `JournalEntryCategory#_onDeleteOperation`} */
    interface OnDeleteOperation extends JournalEntryCategory.Database.Delete {}

    /** Context for {@linkcode JournalEntryCategory._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<JournalEntryCategory.Parent> {}

    /** Context for {@linkcode JournalEntryCategory._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<JournalEntryCategory.Parent> {}

    /** Context for {@linkcode JournalEntryCategory._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<JournalEntryCategory.Parent> {}

    /**
     * Options for {@link JournalEntryCategory._preCreateDescendantDocuments | `JournalEntryCategory#_preCreateDescendantDocuments`}
     * and {@link JournalEntryCategory._onCreateDescendantDocuments | `JournalEntryCategory#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<JournalEntryCategory.Database.Create> {}

    /**
     * Options for {@link JournalEntryCategory._preUpdateDescendantDocuments | `JournalEntryCategory#_preUpdateDescendantDocuments`}
     * and {@link JournalEntryCategory._onUpdateDescendantDocuments | `JournalEntryCategory#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<JournalEntryCategory.Database.Update> {}

    /**
     * Options for {@link JournalEntryCategory._preDeleteDescendantDocuments | `JournalEntryCategory#_preDeleteDescendantDocuments`}
     * and {@link JournalEntryCategory._onDeleteDescendantDocuments | `JournalEntryCategory#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<JournalEntryCategory.Database.Delete> {}
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

  /**
   * @remarks
   * This is typed based on what is reasonable to expect, rather than accurately, as accurately would mean `unknown` (Foundry's type is `object|null`).
   *
   * Technically this is the value of an arbitrary property path in the Combatant's Actor's `system` (using `getProperty`), and while that path can usually be
   * assumed to have been set to something in the return of {@linkcode TokenDocument.getTrackedAttributes}, since that's what the {@linkcode CombatTrackerConfig}
   * provides as options, the path is stored in the {@linkcode Combat.CONFIG_SETTING} which could be updated to be anything. Also, `TokenDocument.getTrackedAttributes`
   * doesn't actually check what the type of `value` and `max` are for bar type attributes, so even sticking to those choices isn't guaranteed safe.
   *
   * There's clear intent that the value *should* be numeric or null, but nothing seems to do math on it in core, and it's simply output in the {@linkcode CombatEncounters}
   * template as `{{resource}}`, so `string` has been allowed.
   *
   * @privateRemarks Adding `boolean` is something that was discussed and decided against for now, but its plausible a system may request such in the future, and wouldn't
   * make us any more wrong than currently.
   */
  type Resource = string | number | null;
}

/**
 * The client-side JournalEntryCategory document which extends the common BaseJournalEntryCategory model.
 */
declare class JournalEntryCategory extends BaseJournalEntryCategory.Internal.ClientDocument {
  override prepareDerivedData(): void;

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

  // Descendant Document operations have been left out because JournalEntryCategory does not have any descendant documents.

  // context: not null (destructured)
  static override defaultName(context?: Document.DefaultNameContext<"JournalEntryCategory", JournalEntryCategory.Parent>): string;

  // data: not null (parameter default only), context: not null (destructured)
  static override createDialog(
    data?: Document.CreateDialogData<JournalEntryCategory.CreateData>,
    createOptions?: Document.Database.CreateOperationForName<"JournalEntryCategory">,
    options?: Document.CreateDialogOptions<"JournalEntryCategory">,
  ): Promise<JournalEntryCategory.Stored | null | undefined>;

  // options: not null (parameter default only)
  static override fromDropData(
    data: JournalEntryCategory.DropData,
    options?: JournalEntryCategory.DropDataOptions,
  ): Promise<JournalEntryCategory.Implementation | undefined>;

  static override fromImport(
    source: JournalEntryCategory.Source,
    context?: Document.FromImportContext<JournalEntryCategory.Parent> | null,
  ): Promise<JournalEntryCategory.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default JournalEntryCategory;
