import type { ConfiguredJournalEntryPage } from "#configuration";
import type { AnyObject, Identity, InexactPartial, MaybeArray, Merge, NullishProps } from "#utils";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseJournalEntryPage from "#common/documents/journal-entry-page.d.mts";
import type TextEditor from "#client/applications/ux/text-editor.mjs";
import type { Note } from "#client/canvas/placeables/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace JournalEntryPage {
  /**
   * The document's name.
   */
  type Name = "JournalEntryPage";

  /**
   * The context used to create a `JournalEntryPage`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `JournalEntryPage`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `JournalEntryPage` document instance configured through
   * {@linkcode CONFIG.JournalEntryPage.documentClass} in Foundry and {@linkcode DocumentClassConfig} or
   * {@linkcode ConfiguredJournalEntryPage | fvtt-types/configuration/ConfiguredJournalEntryPage} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `JournalEntryPage` document configured through
   * {@linkcode CONFIG.JournalEntryPage.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
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
        name: "JournalEntryPage";
        collection: "pages";
        hasTypeData: true;
        indexed: true;
        label: string;
        labelPlural: string;
        coreTypes: ["text", "image", "pdf", "video"];
        compendiumIndexFields: ["name", "type", "sort"];
        permissions: Metadata.Permissions;
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    interface Permissions {
      create: "OWNER";
      delete: "OWNER";
    }
  }

  /**
   * Allowed subtypes of `JournalEntryPage`. This is configured through various methods. Modern Foundry
   * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
   * under {@linkcode CONFIG.JournalEntryPage.dataModels}. This corresponds to
   * fvtt-type's {@linkcode DataModelConfig}.
   *
   * Subtypes can also be registered through a `template.json` though this is discouraged.
   * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
   * {@linkcode DataConfig}.
   */
  type SubType = foundry.Game.Model.TypeNames<"JournalEntryPage">;

  /**
   * `ConfiguredSubType` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubType = Document.ConfiguredSubTypeOf<"JournalEntryPage">;

  /**
   * `Known` represents the types of `JournalEntryPage` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubType} for more information.
   */
  type Known = JournalEntryPage.OfType<JournalEntryPage.ConfiguredSubType>;

  /**
   * `OfType` returns an instance of `JournalEntryPage` with the corresponding type. This works with both the
   * builtin `JournalEntryPage` class or a custom subclass if that is set up in
   * {@link ConfiguredJournalEntryPage | `fvtt-types/configuration/ConfiguredJournalEntryPage`}.
   * up.
   */
  type OfType<Type extends SubType> = Document.Internal.DiscriminateSystem<Name, _OfType, Type, ConfiguredSubType>;

  /** @internal */
  interface _OfType
    extends Identity<{
      [Type in SubType]: Type extends unknown
        ? ConfiguredJournalEntryPage<Type> extends { document: infer Document }
          ? Document
          : // eslint-disable-next-line @typescript-eslint/no-restricted-types
            JournalEntryPage<Type>
        : never;
    }> {}

  /**
   * `SystemOfType` returns the system property for a specific `JournalEntryPage` subtype.
   */
  type SystemOfType<Type extends SubType> = Document.Internal.SystemOfType<Name, _SystemMap, Type, ConfiguredSubType>;

  /**
   * @internal
   */
  interface _ModelMap extends Document.Internal.ModelMap<Name> {}

  /**
   * @internal
   */
  interface _SystemMap extends Document.Internal.SystemMap<Name> {}

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
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"JournalEntry">;

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
   * This is a fixed string per document type and is primarily useful for the descendant Document operation methods, e.g
   * {@linkcode ClientDocumentMixin.AnyMixed._preCreateDescendantDocuments | ClientDocument._preCreateDescendantDocuments}.
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
   * An instance of `JournalEntryPage` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `JournalEntryPage` that comes from the database.
   */
  type Stored<SubType extends JournalEntryPage.SubType = JournalEntryPage.SubType> = Document.Internal.Stored<
    OfType<SubType>
  >;

  /**
   * The data put in {@linkcode JournalEntryPage._source | JournalEntryPage#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode JournalEntryPage.create}
   * and {@linkcode JournalEntryPage | new JournalEntryPage(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData<SubType extends JournalEntryPage.SubType = JournalEntryPage.SubType>
    extends fields.SchemaField.CreateData<Schema> {
    type?: SubType | null | undefined;
  }

  /**
   * Used in the {@linkcode JournalEntryPage.create} and {@linkcode JournalEntryPage.createDocuments} signatures, and
   * {@linkcode JournalEntryPage.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode JournalEntryPage.create}, returning (a single | an array of) (temporary | stored)
   * `JournalEntryPage`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<JournalEntryPage.TemporaryIf<Temporary>>
      : JournalEntryPage.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode JournalEntryPage.name | JournalEntryPage#name}.
   *
   * This is data transformed from {@linkcode JournalEntryPage.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode JournalEntryPage.update | JournalEntryPage#update}.
   * It is a distinct type from {@linkcode JournalEntryPage.CreateData | DeepPartial<JournalEntryPage.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode JournalEntryPage.update | JournalEntryPage#update} and
   * {@linkcode JournalEntryPage.updateDocuments} signatures, and {@linkcode JournalEntryPage.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode JournalEntryPage}. This is the source of truth for how an JournalEntryPage document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode JournalEntryPage}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this JournalEntryPage embedded document.
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The text name of this page.
     */
    name: fields.StringField<{ required: true; blank: false; label: "JOURNALENTRYPAGE.PageTitle"; textSearch: true }>;

    /**
     * The type of this page, in {@linkcode BaseJournalEntryPage.TYPES}.
     * @defaultValue `"text"`
     */
    type: fields.DocumentTypeField<typeof BaseJournalEntryPage, { initial: "text" }>;

    /**
     * System-specific data.
     * @defaultValue `{}`
     */
    system: fields.TypeDataField<typeof BaseJournalEntryPage>;

    /**
     * Data that control's the display of this page's title.
     */
    title: fields.SchemaField<{
      /**
       * Whether to render the page's title in the overall journal view.
       * @defaultValue `true`
       */
      show: fields.BooleanField<{ initial: true }>;

      /**
       * The heading level to render this page's title at in the overall journal view.
       * @defaultValue `1`
       */
      level: fields.NumberField<{ required: true; initial: 1; min: 1; max: 6; integer: true; nullable: false }>;
    }>;

    /**
     * Data particular to image journal entry pages.
     */
    image: fields.SchemaField<{
      /**
       * A caption for the image.
       * @defaultValue `undefined`
       */
      caption: fields.StringField<{ required: false; initial: undefined }>;
    }>;

    /**
     * Data particular to text journal entry pages.
     */
    text: fields.SchemaField<{
      /**
       * The content of the JournalEntryPage in a format appropriate for its type.
       * @defaultValue `undefined`
       */
      content: fields.HTMLField<{ required: false; initial: undefined; textSearch: true }>;

      /**
       * The original markdown source, if applicable.
       * @defaultValue `undefined`
       */
      markdown: fields.StringField<{ required: false; initial: undefined }>;

      /**
       * The format of the page's content, in {@linkcode CONST.JOURNAL_ENTRY_PAGE_FORMATS}.
       * @defaultValue `CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML`
       */
      format: fields.NumberField<
        {
          label: "JOURNALENTRYPAGE.Format";
          initial: typeof CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML;
          choices: CONST.JOURNAL_ENTRY_PAGE_FORMATS[];
        },
        // FIXME: overrides required to enforce branded type
        CONST.JOURNAL_ENTRY_PAGE_FORMATS | null | undefined,
        CONST.JOURNAL_ENTRY_PAGE_FORMATS,
        CONST.JOURNAL_ENTRY_PAGE_FORMATS
      >;
    }>;

    /**
     * Data particular to video journal entry pages.
     */
    video: fields.SchemaField<{
      /**
       * Show player controls for this video?
       * @defaultValue `true`
       */
      controls: fields.BooleanField<{ initial: true }>;

      /**
       * Automatically loop the video?
       * @defaultValue `undefined`
       */
      loop: fields.BooleanField<{ required: false; initial: undefined }>;

      /**
       * Should the video play automatically?
       * @defaultValue `undefined`
       */
      autoplay: fields.BooleanField<{ required: false; initial: undefined }>;

      /**
       * The volume level of any audio that the video file contains.
       * @defaultValue `0.5`
       */
      volume: fields.AlphaField<{ required: true; step: 0.01; initial: 0.5 }>;

      /**
       * The starting point of the video, in seconds.
       * @defaultValue `undefined`
       */
      timestamp: fields.NumberField<{ required: false; min: 0; initial: undefined }>;

      /**
       * The width of the video, otherwise it will fill the available container width.
       * @defaultValue `undefined`
       */
      width: fields.NumberField<{ required: false; positive: true; integer: true; initial: undefined }>;

      /**
       * The height of the video, otherwise it will use the aspect ratio of the source video, or 16:9 if that aspect
       * ratio is not available.
       * @defaultValue `undefined`
       */
      height: fields.NumberField<{ required: false; positive: true; integer: true; initial: undefined }>;
    }>;

    /**
     * The URI of the image or other external media to be used for this page.
     * @defaultValue `null`
     */
    src: fields.StringField<{
      required: false;
      blank: false;
      nullable: true;
      initial: null;
      label: "JOURNALENTRYPAGE.Source";
    }>;

    /**
     * An optional category that this page belongs to.
     * @defaultValue `null`
     */
    category: fields.DocumentIdField<{ readonly: false }>;

    /**
     * The numeric sort value which orders this page relative to its siblings.
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures the ownership of this page.
     * @defaultValue `CONST.DOCUMENT_OWNERSHIP_LEVELS.INHERIT`
     */
    ownership: fields.DocumentOwnershipField<{
      initial: { default: typeof CONST.DOCUMENT_OWNERSHIP_LEVELS.INHERIT };
    }>;

    /**
     * An object of optional key/value flags.
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name>;

    _stats: fields.DocumentStatsField;
  }

  namespace Database2 {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `JournalEntryPage` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<JournalEntryPage.Parent> {}

    /**
     * The interface for passing to {@linkcode JournalEntryPage.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `JournalEntryPage` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `JournalEntryPage` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode JournalEntryPage.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends DatabaseBackend.CreateOperation<JournalEntryPage.CreateInput, JournalEntryPage.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode JournalEntryPage.create} or {@linkcode JournalEntryPage.createDocuments}.
     * @see {@linkcode Document.Database2.CreateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.CreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `JournalEntryPage` documents. (see {@linkcode JournalEntryPage.Parent})
     * @see {@linkcode Document.Database2.CreateEmbeddedOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface CreateEmbeddedOperation extends Document.Database2.CreateEmbeddedOperation<CreateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `JournalEntryPage` documents.
     * @see {@linkcode Document.Database2.BackendCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendCreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.BackendCreateOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode JournalEntryPage._preCreate | JournalEntryPage#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateJournalEntryPage` hook}.
     * @see {@linkcode Document.Database2.PreCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOptions<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.PreCreateOptions<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode JournalEntryPage._preCreateOperation}.
     * @see {@linkcode Document.Database2.PreCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.PreCreateOperation<CreateOperation<Temporary>> {}

    /**
     * @deprecated The interface passed to {@linkcode JournalEntryPage._onCreateDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database2.OnCreateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateDocumentsOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends Document.Database2.OnCreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode JournalEntryPage._onCreate | JournalEntryPage#_onCreate} and
     * {@link Hooks.CreateDocument | the `createJournalEntryPage` hook}.
     * @see {@linkcode Document.Database2.OnCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOptions extends Document.Database2.OnCreateOptions<CreateOperation> {}

    /**
     * The interface passed to {@linkcode JournalEntryPage._onCreateOperation} and `JournalEntryPage`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database2.OnCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOperation extends Document.Database2.OnCreateOperation<CreateOperation> {}

    /* ***********************************************
     *              UPDATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.UpdateOperation | DatabaseUpdateOperation}
     * interface for `JournalEntryPage` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode JournalEntryPage.update | JournalEntryPage#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation
      extends DatabaseBackend.UpdateOperation<JournalEntryPage.UpdateInput, JournalEntryPage.Parent> {}

    /**
     * The interface for passing to {@linkcode JournalEntryPage.update | JournalEntryPage#update}.
     * @see {@linkcode Document.Database2.UpdateOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateOneDocumentOperation extends Document.Database2.UpdateOneDocumentOperation<UpdateOperation> {}

    /**
     * The interface for passing to the {@linkcode Document.updateEmbeddedDocuments | #updateEmbeddedDocuments} method of any Documents that
     * can contain `JournalEntryPage` documents (see {@linkcode JournalEntryPage.Parent}). This interface is just an alias
     * for {@linkcode UpdateOneDocumentOperation}, as the same keys are provided by the method in both cases.
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateEmbeddedOperation extends UpdateOneDocumentOperation {}

    /**
     * The interface for passing to {@linkcode JournalEntryPage.updateDocuments}.
     * @see {@linkcode Document.Database2.UpdateManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateManyDocumentsOperation extends Document.Database2.UpdateManyDocumentsOperation<UpdateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `JournalEntryPage` documents.
     * @see {@linkcode Document.Database2.BackendUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendUpdateOperation extends Document.Database2.BackendUpdateOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode JournalEntryPage._preUpdate | JournalEntryPage#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateJournalEntryPage` hook}.
     * @see {@linkcode Document.Database2.PreUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOptions extends Document.Database2.PreUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode JournalEntryPage._preUpdateOperation}.
     * @see {@linkcode Document.Database2.PreUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOperation extends Document.Database2.PreUpdateOperation<UpdateOperation> {}

    /**
     * @deprecated The interface passed to {@linkcode JournalEntryPage._onUpdateDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database2.OnUpdateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateDocumentsOperation extends Document.Database2.OnUpdateDocumentsOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode JournalEntryPage._onUpdate | JournalEntryPage#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateJournalEntryPage` hook}.
     * @see {@linkcode Document.Database2.OnUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOptions extends Document.Database2.OnUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode JournalEntryPage._onUpdateOperation} and `JournalEntryPage`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database2.OnUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOperation extends Document.Database2.OnUpdateOperation<UpdateOperation> {}

    /* ***********************************************
     *              DELETE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.DeleteOperation | DatabaseDeleteOperation}
     * interface for `JournalEntryPage` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode JournalEntryPage.delete | JournalEntryPage#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<JournalEntryPage.Parent> {}

    /**
     * The interface for passing to {@linkcode JournalEntryPage.delete | JournalEntryPage#delete}.
     * @see {@linkcode Document.Database2.DeleteOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteOneDocumentOperation extends Document.Database2.DeleteOneDocumentOperation<DeleteOperation> {}

    /**
     * The interface for passing to the {@linkcode Document.deleteEmbeddedDocuments | #deleteEmbeddedDocuments} method of any Documents that
     * can contain `JournalEntryPage` documents (see {@linkcode JournalEntryPage.Parent}). This interface is just an alias
     * for {@linkcode DeleteOneDocumentOperation}, as the same keys are provided by the method in both cases.
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteEmbeddedOperation extends DeleteOneDocumentOperation {}

    /**
     * The interface for passing to {@linkcode JournalEntryPage.deleteDocuments}.
     * @see {@linkcode Document.Database2.DeleteManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteManyDocumentsOperation extends Document.Database2.DeleteManyDocumentsOperation<DeleteOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `JournalEntryPage` documents.
     * @see {@linkcode Document.Database2.BackendDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendDeleteOperation extends Document.Database2.BackendDeleteOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode JournalEntryPage._preDelete | JournalEntryPage#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteJournalEntryPage` hook}.
     * @see {@linkcode Document.Database2.PreDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOptions extends Document.Database2.PreDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode JournalEntryPage._preDeleteOperation}.
     * @see {@linkcode Document.Database2.PreDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOperation extends Document.Database2.PreDeleteOperation<DeleteOperation> {}

    /**
     * @deprecated The interface passed to {@linkcode JournalEntryPage._onDeleteDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database2.OnDeleteDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteDocumentsOperation extends Document.Database2.OnDeleteDocumentsOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode JournalEntryPage._onDelete | JournalEntryPage#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteJournalEntryPage` hook}.
     * @see {@linkcode Document.Database2.OnDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOptions extends Document.Database2.OnDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode JournalEntryPage._onDeleteOperation} and `JournalEntryPage`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database2.OnDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOperation extends Document.Database2.OnDeleteOperation<DeleteOperation> {}

    namespace Internal {
      interface OperationNameMap<Temporary extends boolean | undefined = boolean | undefined> {
        GetDocumentsOperation: JournalEntryPage.Database2.GetDocumentsOperation;
        BackendGetOperation: JournalEntryPage.Database2.BackendGetOperation;
        GetOperation: JournalEntryPage.Database2.GetOperation;

        CreateDocumentsOperation: JournalEntryPage.Database2.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: JournalEntryPage.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: JournalEntryPage.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: JournalEntryPage.Database2.CreateOperation<Temporary>;
        PreCreateOptions: JournalEntryPage.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: JournalEntryPage.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: JournalEntryPage.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: JournalEntryPage.Database2.OnCreateOptions;
        OnCreateOperation: JournalEntryPage.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: JournalEntryPage.Database2.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: JournalEntryPage.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: JournalEntryPage.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: JournalEntryPage.Database2.BackendUpdateOperation;
        UpdateOperation: JournalEntryPage.Database2.UpdateOperation;
        PreUpdateOptions: JournalEntryPage.Database2.PreUpdateOptions;
        PreUpdateOperation: JournalEntryPage.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: JournalEntryPage.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: JournalEntryPage.Database2.OnUpdateOptions;
        OnUpdateOperation: JournalEntryPage.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: JournalEntryPage.Database2.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: JournalEntryPage.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: JournalEntryPage.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: JournalEntryPage.Database2.BackendDeleteOperation;
        DeleteOperation: JournalEntryPage.Database2.DeleteOperation;
        PreDeleteOptions: JournalEntryPage.Database2.PreDeleteOptions;
        PreDeleteOperation: JournalEntryPage.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: JournalEntryPage.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: JournalEntryPage.Database2.OnDeleteOptions;
        OnDeleteOperation: JournalEntryPage.Database2.OnDeleteOperation;
      }
    }

    /* ***********************************************
     *             DocsV2 DEPRECATIONS               *
     *************************************************/

    /** @deprecated Use {@linkcode GetOperation} instead. This type will be removed in v14.  */
    type Get = GetOperation;

    /** @deprecated Use {@linkcode GetDocumentsOperation} instead. This type will be removed in v14.  */
    type GetOptions = GetDocumentsOperation;

    /** @deprecated Use {@linkcode CreateOperation} instead. This type will be removed in v14.  */
    type Create<Temporary extends boolean | undefined> = CreateOperation<Temporary>;

    /** @deprecated Use {@linkcode UpdateOperation} instead. This type will be removed in v14.  */
    type Update = UpdateOperation;

    /** @deprecated Use {@linkcode DeleteOperation} instead. This type will be removed in v14.  */
    type Delete = DeleteOperation;

    // CreateDocumentsOperation didn't change purpose or name

    /** @deprecated Use {@linkcode UpdateManyDocumentsOperation} instead. This type will be removed in v14 */
    type UpdateDocumentsOperation = UpdateManyDocumentsOperation;

    /** @deprecated Use {@linkcode DeleteManyDocumentsOperation} instead. This type will be removed in v14 */
    type DeleteDocumentsOperation = DeleteManyDocumentsOperation;

    // PreCreateOptions didn't change purpose or name

    // OnCreateOptions didn't change purpose or name

    // PreCreateOperation didn't change purpose or name

    // OnCreateOperation didn't change purpose or name

    // PreUpdateOptions didn't change purpose or name

    // OnUpdateOptions didn't change purpose or name

    // PreUpdateOperation didn't change purpose or name

    // OnUpdateOperation didn't change purpose or name

    // PreDeleteOptions didn't change purpose or name

    // OnDeleteOptions didn't change purpose or name

    // PreDeleteOperation didn't change purpose or name

    // OnDeleteOperation didn't change purpose or name

    /** @deprecated Use {@linkcode OnCreateDocumentsOperation} instead. This type will be removed in v14 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type OnCreateDocumentsContext = OnCreateDocumentsOperation;

    /** @deprecated Use {@linkcode OnUpdateDocumentsOperation} instead. This type will be removed in v14 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type OnUpdateDocumentsContext = OnUpdateDocumentsOperation;

    /** @deprecated Use {@linkcode OnDeleteOptions} instead. This type will be removed in v14 */
    type DeleteOptions = OnDeleteOptions;

    /** @deprecated Use {@linkcode OnCreateOptions} instead. This type will be removed in v14 */
    type CreateOptions = OnCreateOptions;

    /** @deprecated Use {@linkcode OnUpdateOptions} instead. This type will be removed in v14 */
    type UpdateOptions = OnUpdateOptions;

    /** @deprecated Use {@linkcode OnDeleteDocumentsOperation} instead. This type will be removed in v14 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type DeleteDocumentsContext = OnDeleteDocumentsOperation;

    /** @deprecated use {@linkcode CreateDocumentsOperation} instead. This type will be removed in v14. */
    type DialogCreateOptions = CreateDocumentsOperation;
  }

  /**
   * If `Temporary` is true then {@linkcode JournalEntryPage.Implementation}, otherwise {@linkcode JournalEntryPage.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? JournalEntryPage.Implementation : JournalEntryPage.Stored;

  namespace Database {
    /** Options passed along in Get operations for JournalEntryPages */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<JournalEntryPage.Parent> {}

    /** Options passed along in Create operations for JournalEntryPages */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<
        JournalEntryPage.CreateData,
        JournalEntryPage.Parent,
        Temporary
      > {
      animate?: boolean;
    }

    /** Options passed along in Delete operations for JournalEntryPages */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<JournalEntryPage.Parent> {
      animate?: boolean;
    }

    /** Options passed along in Update operations for JournalEntryPages */
    interface Update
      extends foundry.abstract.types.DatabaseUpdateOperation<JournalEntryPage.UpdateData, JournalEntryPage.Parent> {
      animate?: boolean;
    }

    /** Operation for {@linkcode JournalEntryPage.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<JournalEntryPage.Database.Create<Temporary>> {}

    /** Operation for {@linkcode JournalEntryPage.updateDocuments} */
    interface UpdateDocumentsOperation
      extends Document.Database.UpdateDocumentsOperation<JournalEntryPage.Database.Update> {}

    /** Operation for {@linkcode JournalEntryPage.deleteDocuments} */
    interface DeleteDocumentsOperation
      extends Document.Database.DeleteDocumentsOperation<JournalEntryPage.Database.Delete> {}

    /** Operation for {@linkcode JournalEntryPage.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<JournalEntryPage.Database.Create<Temporary>> {}

    /** Operation for {@link JournalEntryPage.update | `JournalEntryPage#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode JournalEntryPage.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link JournalEntryPage._preCreate | `JournalEntryPage#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link JournalEntryPage._onCreate | `JournalEntryPage#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode JournalEntryPage._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<JournalEntryPage.Database.Create> {}

    /** Operation for {@link JournalEntryPage._onCreateOperation | `JournalEntryPage#_onCreateOperation`} */
    interface OnCreateOperation extends JournalEntryPage.Database.Create {}

    /** Options for {@link JournalEntryPage._preUpdate | `JournalEntryPage#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link JournalEntryPage._onUpdate | `JournalEntryPage#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode JournalEntryPage._preUpdateOperation} */
    interface PreUpdateOperation extends JournalEntryPage.Database.Update {}

    /** Operation for {@link JournalEntryPage._onUpdateOperation | `JournalEntryPage._preUpdateOperation`} */
    interface OnUpdateOperation extends JournalEntryPage.Database.Update {}

    /** Options for {@link JournalEntryPage._preDelete | `JournalEntryPage#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link JournalEntryPage._onDelete | `JournalEntryPage#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link JournalEntryPage._preDeleteOperation | `JournalEntryPage#_preDeleteOperation`} */
    interface PreDeleteOperation extends JournalEntryPage.Database.Delete {}

    /** Options for {@link JournalEntryPage._onDeleteOperation | `JournalEntryPage#_onDeleteOperation`} */
    interface OnDeleteOperation extends JournalEntryPage.Database.Delete {}

    /** Context for {@linkcode JournalEntryPage._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<JournalEntryPage.Parent> {}

    /** Context for {@linkcode JournalEntryPage._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<JournalEntryPage.Parent> {}

    /** Context for {@linkcode JournalEntryPage._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<JournalEntryPage.Parent> {}

    /**
     * Options for {@link JournalEntryPage._preCreateDescendantDocuments | `JournalEntryPage#_preCreateDescendantDocuments`}
     * and {@link JournalEntryPage._onCreateDescendantDocuments | `JournalEntryPage#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<JournalEntryPage.Database.Create> {}

    /**
     * Options for {@link JournalEntryPage._preUpdateDescendantDocuments | `JournalEntryPage#_preUpdateDescendantDocuments`}
     * and {@link JournalEntryPage._onUpdateDescendantDocuments | `JournalEntryPage#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<JournalEntryPage.Database.Update> {}

    /**
     * Options for {@link JournalEntryPage._preDeleteDescendantDocuments | `JournalEntryPage#_preDeleteDescendantDocuments`}
     * and {@link JournalEntryPage._onDeleteDescendantDocuments | `JournalEntryPage#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<JournalEntryPage.Database.Delete> {}

    /**
     * Create options for {@linkcode JournalEntryPage.createDialog}.
     */
    interface DialogCreateOptions extends InexactPartial<Create> {}
  }

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

  /* ***********************************************
   *       CLIENT DOCUMENT TEMPLATE TYPES          *
   *************************************************/

  /** The interface {@linkcode JournalEntryPage.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode JournalEntryPage.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode JournalEntryPage.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode JournalEntryPage.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode JournalEntryPage.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>,
      Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode JournalEntryPage.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode JournalEntryPage.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends JournalEntryPage.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<JournalEntryPage.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode JournalEntryPage.deleteDialog | JournalEntryPage#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    JournalEntryPage.Stored,
    PassedConfig
  >;

  /* ***********************************************
   *      JOURNAL-ENTRY-PAGE-SPECIFIC TYPES        *
   *************************************************/

  interface JournalEntryPageHeading {
    /** The heading level, 1-6. */
    level: number;

    /** The raw heading text with any internal tags omitted. */
    text: string;

    /** The generated slug for this heading. */
    slug: string;

    /** The currently rendered element for this heading, if it exists. */
    element?: HTMLHeadingElement;

    /** Any child headings of this one. */
    children: string[];

    /** The linear ordering of the heading in the table of contents. */
    order: number;
  }

  interface CreateDocumentLinkOptions extends ClientDocument.CreateDocumentLinkOptions {
    /**
     * @remarks If the `eventData` passed with these options has an `anchor.slug`, the default is `eventData.anchor.name`,
     * otherwise uses `super`'s default of `this.name`
     */
    label?: string | null | undefined;
  }

  /**
   * Slightly editorializing the description with the addition of parentheses to make this scan
   * for both {@linkcode JournalEntryPage.buildTOC} and {@linkcode JournalEntryPage._makeHeadingNode}
   *
   * @internal
   */
  type _IncludeElement = NullishProps<{
    /**
     * Include reference(s) to the heading DOM element(s) in the returned ToC.
     * @defaultValue `true`
     */
    includeElement: boolean;
  }>;

  interface BuildTOCOptions extends _IncludeElement {}

  interface MakeHeadingNodeOptions extends _IncludeElement {}

  interface EmbedTextPageConfig extends TextEditor.EnrichmentOptions, TextEditor.DocumentHTMLEmbedConfig {}

  /** @internal */
  type _EmbedImagePageConfig = NullishProps<{
    /**
     * Alt text for the image, otherwise the caption will be used.
     * @remarks If both `alt` and `label` are omitted, the returned Element's `alt` will fall back to using `this.image.caption || this.name`
     */
    alt: string;
  }>;

  interface EmbedImagePageConfig extends _EmbedImagePageConfig, TextEditor.DocumentHTMLEmbedConfig {}

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

  /**
   * @deprecated Replaced with {@linkcode JournalEntryPage.ConfiguredSubType} (will be removed in v14).
   */
  type ConfiguredSubTypes = ConfiguredSubType;
}

/**
 * The client-side JournalEntryPage document which extends the common BaseJournalEntryPage document model.
 *
 * @see {@linkcode JournalEntry}  The JournalEntry document type which contains JournalEntryPage embedded documents.
 */
declare class JournalEntryPage<
  out SubType extends JournalEntryPage.SubType = JournalEntryPage.SubType,
> extends BaseJournalEntryPage.Internal.ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `JournalEntryPage`
   * @param context - Construction context options
   */
  constructor(data: JournalEntryPage.CreateData<SubType>, context?: JournalEntryPage.ConstructionContext);

  /**
   * The cached table of contents for this JournalEntryPage.
   */
  protected _toc: Record<string, JournalEntryPage.JournalEntryPageHeading>;

  /**
   * The table of contents for this JournalEntryPage.
   */
  get toc(): Record<string, JournalEntryPage.JournalEntryPageHeading>;

  override get permission(): CONST.DOCUMENT_OWNERSHIP_LEVELS | null;

  /**
   * Return a reference to the Note instance for this Journal Entry Page in the current Scene, if any.
   * If multiple notes are placed for this Journal Entry, only the first will be returned.
   */
  get sceneNote(): Note.Implementation | null;

  /**
   * Convert a heading into slug suitable for use as an identifier.
   * @param heading - The heading element or some text content.
   */
  static slugifyHeading(heading: HTMLHeadingElement | string): string;

  /**
   * Build a table of contents for the given HTML content.
   * @param html    - The HTML content to generate a ToC outline for.
   * @param options - Additional options to configure ToC generation.
   */
  static buildTOC(
    html: HTMLElement[],
    options?: JournalEntryPage.BuildTOCOptions,
  ): Record<string, JournalEntryPage.JournalEntryPageHeading>;

  /**
   * Flatten the tree structure into a single object with each node's slug as the key.
   * @param nodes - The root ToC nodes.
   */
  protected static _flattenTOC(
    nodes: JournalEntryPage.JournalEntryPageHeading[],
  ): Record<string, JournalEntryPage.JournalEntryPageHeading>;

  /**
   * Construct a table of contents node from a heading element.
   * @param heading - The heading element.
   * @param options - Additional options to configure the returned node.
   */
  protected static _makeHeadingNode(
    heading: HTMLHeadingElement,
    options?: JournalEntryPage.MakeHeadingNodeOptions,
  ): JournalEntryPage.JournalEntryPageHeading;

  /** @remarks Uses `eventData`, unlike {@link ClientDocument._createDocumentLink | `ClientDocument#_createDocumentLink`} */
  override _createDocumentLink(eventData: AnyObject, options?: JournalEntryPage.CreateDocumentLinkOptions): string;

  /**
   * @remarks
   * As `super`, but return the parent's sheet's `#render`:
   * - AppV1: returns that sheet
   * - AppV2: returns a Promise of that sheet
   */
  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  // _onUpdate is overridden but with no signature changes from the template in BaseJournalEntryPage

  protected override _buildEmbedHTML(
    config: TextEditor.DocumentHTMLEmbedConfig,
  ): Promise<HTMLCollection | HTMLElement | null>;

  protected override _createFigureEmbed(
    content: HTMLElement | HTMLCollection,
    config: TextEditor.DocumentHTMLEmbedConfig,
    options?: TextEditor.EnrichmentOptions,
  ): Promise<HTMLElement | null>;

  /**
   * Embed text page content.
   * @param config  - Configuration for embedding behavior. This can include enrichment options to override those passed as part of
   *                  the root enrichment process.
   * @param options - The original enrichment options to propagate to the embedded text page's enrichment.
   * @returns
   *
   * @example
   * Embed the content of the Journal Entry Page as a figure.
   * ```
   * @Embed[.yDbDF1ThSfeinh3Y classes="small right"]{Special caption}
   * ```
   * becomes
   * ```html
   * <figure class="content-embed small right" data-content-embed
   *         data-uuid="JournalEntry.ekAeXsvXvNL8rKFZ.JournalEntryPage.yDbDF1ThSfeinh3Y">
   *   <p>The contents of the page</p>
   *   <figcaption>
   *     <strong class="embed-caption">Special caption</strong>
   *     <cite>
   *       <a class="content-link" draggable="true" data-link
   *          data-uuid="JournalEntry.ekAeXsvXvNL8rKFZ.JournalEntryPage.yDbDF1ThSfeinh3Y"
   *          data-id="yDbDF1ThSfeinh3Y" data-type="JournalEntryPage" data-tooltip="Text Page">
   *         <i class="fas fa-file-lines"></i> Text Page
   *       </a>
   *     </cite>
   *   <figcaption>
   * </figure>
   * ```
   *
   * @example
   * Embed the content of the Journal Entry Page into the main content flow.
   * ```
   * @Embed[.yDbDF1ThSfeinh3Y inline]
   * ```
   * becomes
   * ```html
   * <section class="content-embed" data-content-embed
   *          data-uuid="JournalEntry.ekAeXsvXvNL8rKFZ.JournalEntryPage.yDbDF1ThSfeinh3Y">
   *   <p>The contents of the page</p>
   * </section>
   * ```
   */
  protected _embedTextPage(
    config: JournalEntryPage.EmbedTextPageConfig,
    options?: TextEditor.EnrichmentOptions,
  ): Promise<HTMLCollection>;

  /**
   * Embed image page content.
   * @param config            - Configuration for embedding behavior.
   * @param options           - The original enrichment options for cases where the Document embed content
   *                            also contains text that must be enriched.
   *
   * @example
   * Create an embedded image from a sibling journal entry page.
   * ```
   * @Embed[.QnH8yGIHy4pmFBHR classes="small right"]{Special caption}
   * ```
   * becomes
   * ```html
   * <figure class="content-embed small right" data-content-embed
   *         data-uuid="JournalEntry.xFNPjbSEDbWjILNj.JournalEntryPage.QnH8yGIHy4pmFBHR">
   *   <img src="path/to/image.webp" alt="Special caption">
   *   <figcaption>
   *     <strong class="embed-caption">Special caption</strong>
   *     <cite>
   *       <a class="content-link" draggable="true" data-link
   *          data-uuid="JournalEntry.xFNPjbSEDbWjILNj.JournalEntryPage.QnH8yGIHy4pmFBHR"
   *          data-id="QnH8yGIHy4pmFBHR" data-type="JournalEntryPage" data-tooltip="Image Page">
   *         <i class="fas fa-file-image"></i> Image Page
   *       </a>
   *     </cite>
   *   </figcaption>
   * </figure>
   * ```
   *
   * @remarks Core's implementation always returns a {@linkcode HTMLImageElement}, and does not use `options`
   */
  protected _embedImagePage(
    config?: JournalEntryPage.EmbedImagePageConfig,
    options?: TextEditor.EnrichmentOptions,
  ): Promise<HTMLElement | HTMLCollection | null>;

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

  // Descendant Document operations have been left out because JournalEntryPage does not have any descendant documents.

  static override defaultName(context?: JournalEntryPage.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends JournalEntryPage.CreateDialogOptions | undefined = undefined,
  >(
    data?: JournalEntryPage.CreateDialogData,
    createOptions?: JournalEntryPage.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<JournalEntryPage.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode JournalEntryPage.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends JournalEntryPage.CreateDialogOptions | undefined = undefined,
  >(
    data: JournalEntryPage.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: JournalEntryPage.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<JournalEntryPage.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: JournalEntryPage.Database2.DeleteOneDocumentOperation,
  ): Promise<JournalEntryPage.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: JournalEntryPage.Database2.DeleteOneDocumentOperation,
  ): Promise<JournalEntryPage.DeleteDialogReturn<Options>>;

  static override fromDropData(data: JournalEntryPage.DropData): Promise<JournalEntryPage.Implementation | undefined>;

  static override fromImport(
    source: JournalEntryPage.Source,
    context?: Document.FromImportContext<JournalEntryPage.Parent> | null,
  ): Promise<JournalEntryPage.Implementation>;

  // Embedded document operations have been left out because JournalEntryPage does not have any embedded documents.
}

export default JournalEntryPage;
