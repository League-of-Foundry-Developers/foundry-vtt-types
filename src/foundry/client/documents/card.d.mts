import type { ConfiguredCard } from "#configuration";
import type { AnyObject, DeepPartial, Identity, InexactPartial, MaybeArray, Merge } from "#utils";
import type { documents } from "#client/client.d.mts";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseCard from "#common/documents/card.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace Card {
  /**
   * The document's name.
   */
  type Name = "Card";

  /**
   * The context used to create a `Card`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `Card`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Card` document instance configured through
   * {@linkcode CONFIG.Card.documentClass} in Foundry and {@linkcode DocumentClassConfig} or
   * {@linkcode ConfiguredCard | fvtt-types/configuration/ConfiguredCard} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Card` document configured through
   * {@linkcode CONFIG.Card.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
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
        name: "Card";
        collection: "cards";
        hasTypeData: true;
        indexed: true;
        label: string;
        labelPlural: string;
        permissions: Metadata.Permissions;
        compendiumIndexFields: ["name", "type", "suit", "sort"];
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
      update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
      delete: "OWNER";
    }
  }

  /**
   * Allowed subtypes of `Card`. This is configured through various methods. Modern Foundry
   * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
   * under {@linkcode CONFIG.Card.dataModels}. This corresponds to
   * fvtt-type's {@linkcode DataModelConfig}.
   *
   * Subtypes can also be registered through a `template.json` though this is discouraged.
   * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
   * {@linkcode DataConfig}.
   */
  type SubType = foundry.Game.Model.TypeNames<"Card">;

  /**
   * `ConfiguredSubType` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubType = Document.ConfiguredSubTypeOf<"Card">;

  /**
   * `Known` represents the types of `Card` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubType} for more information.
   */
  type Known = Card.OfType<Card.ConfiguredSubType>;

  /**
   * `OfType` returns an instance of `Card` with the corresponding type. This works with both the
   * builtin `Card` class or a custom subclass if that is set up in
   * {@link ConfiguredCard | `fvtt-types/configuration/ConfiguredCard`}.
   */
  type OfType<Type extends SubType> = Document.Internal.DiscriminateSystem<Name, _OfType, Type, ConfiguredSubType>;

  /** @internal */
  interface _OfType
    extends Identity<{
      [Type in SubType]: Type extends unknown
        ? ConfiguredCard<Type> extends { document: infer Document }
          ? Document
          : // eslint-disable-next-line @typescript-eslint/no-restricted-types
            Card<Type>
        : never;
    }> {}

  /**
   * `SystemOfType` returns the system property for a specific `Card` subtype.
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
  type Parent = Cards.Implementation | null;

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
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"Cards">;

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
   * An instance of `Card` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `Card` that comes from the database.
   */
  type Stored<SubType extends Card.SubType = Card.SubType> = Document.Internal.Stored<OfType<SubType>>;

  /**
   * The data put in {@linkcode Card._source | Card#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Card.create}
   * and {@linkcode Card | new Card(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData<SubType extends Card.SubType = Card.SubType> extends fields.SchemaField.CreateData<Schema> {
    type?: SubType | null | undefined;
  }

  /**
   * Used in the {@linkcode Card.create} and {@linkcode Card.createDocuments} signatures, and
   * {@linkcode Card.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode Card.create}, returning (a single | an array of) (temporary | stored)
   * `Card`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput> ? Array<Card.TemporaryIf<Temporary>> : Card.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode Card.name | Card#name}.
   *
   * This is data transformed from {@linkcode Card.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode Card.update | Card#update}.
   * It is a distinct type from {@linkcode Card.CreateData | DeepPartial<Card.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode Card.update | Card#update} and
   * {@linkcode Card.updateDocuments} signatures, and {@linkcode Card.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode Card}. This is the source of truth for how an Card document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Card}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Card document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** The text name of this card */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * A text description of this card which applies to all faces
     * @defaultValue `""`
     */
    description: fields.HTMLField;

    /**
     * A category of card (for example, a suit) to which this card belongs
     * @defaultValue `"base"`
     */
    type: fields.DocumentTypeField<typeof BaseCard, { initial: typeof CONST.BASE_DOCUMENT_TYPE }>;

    /**
     * Data for a Card subtype, defined by a System or Module
     * @defaultValue `{}`
     */
    system: fields.TypeDataField<typeof BaseCard>;

    /**
     * An optional suit designation which is used by default sorting
     * @defaultValue `undefined`
     */
    suit: fields.StringField<{ required: true }>;

    /**
     * An optional numeric value of the card which is used by default sorting
     * @defaultValue `null`
     */
    value: fields.NumberField<{ required: true }>;

    /**
     * An object of face data which describes the back of this card
     */
    back: fields.SchemaField<{
      /**
       * A name for this card face
       * @defaultValue `undefined`
       */
      name: fields.StringField;

      /**
       * Displayed text that belongs to this face
       * @defaultValue `""`
       */
      text: fields.HTMLField;

      /**
       * A displayed image or video file which depicts the face
       * @defaultValue `null`
       */
      img: fields.FilePathField<{ categories: ["IMAGE", "VIDEO"] }>;
    }>;

    /**
     * An array of face data which represent displayable faces of this card
     * @defaultValue `[]`
     */
    faces: fields.ArrayField<fields.SchemaField<Card.FaceSchema>>;

    /**
     * The index of the currently displayed face, or null if the card is face-down
     * @defaultValue `null`
     */
    face: fields.NumberField<{ required: true; initial: null; integer: true; min: 0 }>;

    /**
     * Whether this card is currently drawn from its source deck
     * @defaultValue `false`
     */
    drawn: fields.BooleanField;

    /**
     * The document ID of the origin deck to which this card belongs
     * @defaultValue `null`
     */
    origin: fields.ForeignDocumentField<typeof documents.BaseCards>;

    /**
     * The visible width of this card
     * @defaultValue `null`
     */
    width: fields.NumberField<{ integer: true; positive: true }>;

    /**
     * The visible height of this card
     * @defaultValue `null`
     */
    height: fields.NumberField<{ integer: true; positive: true }>;

    /**
     * The angle of rotation of this card
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * The sort order of this card relative to others in the same stack
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name>;

    _stats: fields.DocumentStatsField;
  }

  interface FaceSchema extends DataSchema {
    /**
     * A name for this card face
     * @defaultValue `undefined`
     */
    name: fields.StringField;

    /**
     * Displayed text that belongs to this face
     * @defaultValue `""`
     */
    text: fields.HTMLField;

    /**
     * A displayed image or video file which depicts the face
     * @defaultValue `BaseCard.DEFAULT_ICON`
     */
    img: fields.FilePathField<{
      categories: ["IMAGE", "VIDEO"];
      initial: () => typeof BaseCard.DEFAULT_ICON;
    }>;
  }

  interface FaceData extends fields.SchemaField.InitializedData<FaceSchema> {}

  namespace Database2 {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `Card` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<Card.Parent> {}

    /**
     * The interface for passing to {@linkcode Card.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `Card` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `Card` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Card.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends DatabaseBackend.CreateOperation<Card.CreateInput, Card.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode Card.create} or {@linkcode Card.createDocuments}.
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
     * can contain `Card` documents. (see {@linkcode Card.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `Card` documents.
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
     * The interface passed to {@linkcode Card._preCreate | Card#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateCard` hook}.
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
     * The interface passed to {@linkcode Card._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode Card._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Card._onCreate | Card#_onCreate} and
     * {@link Hooks.CreateDocument | the `createCard` hook}.
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
     * The interface passed to {@linkcode Card._onCreateOperation} and `Card`-related collections'
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
     * interface for `Card` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Card.update | Card#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<Card.UpdateInput, Card.Parent> {}

    /**
     * The interface for passing to {@linkcode Card.update | Card#update}.
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
     * can contain `Card` documents (see {@linkcode Card.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Card.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `Card` documents.
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
     * The interface passed to {@linkcode Card._preUpdate | Card#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateCard` hook}.
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
     * The interface passed to {@linkcode Card._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode Card._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Card._onUpdate | Card#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateCard` hook}.
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
     * The interface passed to {@linkcode Card._onUpdateOperation} and `Card`-related collections'
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
     * interface for `Card` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Card.delete | Card#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<Card.Parent> {}

    /**
     * The interface for passing to {@linkcode Card.delete | Card#delete}.
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
     * can contain `Card` documents (see {@linkcode Card.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Card.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `Card` documents.
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
     * The interface passed to {@linkcode Card._preDelete | Card#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteCard` hook}.
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
     * The interface passed to {@linkcode Card._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode Card._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Card._onDelete | Card#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteCard` hook}.
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
     * The interface passed to {@linkcode Card._onDeleteOperation} and `Card`-related collections'
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
        GetDocumentsOperation: Card.Database2.GetDocumentsOperation;
        BackendGetOperation: Card.Database2.BackendGetOperation;
        GetOperation: Card.Database2.GetOperation;

        CreateDocumentsOperation: Card.Database2.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: Card.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: Card.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: Card.Database2.CreateOperation<Temporary>;
        PreCreateOptions: Card.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: Card.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: Card.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: Card.Database2.OnCreateOptions;
        OnCreateOperation: Card.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: Card.Database2.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: Card.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: Card.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: Card.Database2.BackendUpdateOperation;
        UpdateOperation: Card.Database2.UpdateOperation;
        PreUpdateOptions: Card.Database2.PreUpdateOptions;
        PreUpdateOperation: Card.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: Card.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: Card.Database2.OnUpdateOptions;
        OnUpdateOperation: Card.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: Card.Database2.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: Card.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: Card.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: Card.Database2.BackendDeleteOperation;
        DeleteOperation: Card.Database2.DeleteOperation;
        PreDeleteOptions: Card.Database2.PreDeleteOptions;
        PreDeleteOperation: Card.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: Card.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: Card.Database2.OnDeleteOptions;
        OnDeleteOperation: Card.Database2.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode Card.Implementation}, otherwise {@linkcode Card.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? Card.Implementation : Card.Stored;

  namespace Database {
    /** Options passed along in Get operations for Card Documents */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<Card.Parent> {}

    /** Options passed along in Create operations for Card Documents */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<Card.CreateData, Card.Parent, Temporary> {}

    /** Options passed along in Delete operations for Card Documents */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Card.Parent> {}

    /** Options passed along in Update operations for Card Documents */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Card.UpdateData, Card.Parent> {}

    /** Operation for {@linkcode Card.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<Card.Database.Create<Temporary>> {}

    /** Operation for {@linkcode Card.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Card.Database.Update> {}

    /** Operation for {@linkcode Card.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Card.Database.Delete> {}

    /** Operation for {@linkcode Card.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<Card.Database.Create<Temporary>> {}

    /** Operation for {@link Card.update | `Card#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode Card.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link Card._preCreate | `Card#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link Card._onCreate | `Card#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode Card._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Card.Database.Create> {}

    /** Operation for {@link Card._onCreateOperation | `Card#_onCreateOperation`} */
    interface OnCreateOperation extends Card.Database.Create {}

    /** Options for {@link Card._preUpdate | `Card#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link Card._onUpdate | `Card#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode Card._preUpdateOperation} */
    interface PreUpdateOperation extends Card.Database.Update {}

    /** Operation for {@link Card._onUpdateOperation | `Card._preUpdateOperation`} */
    interface OnUpdateOperation extends Card.Database.Update {}

    /** Options for {@link Card._preDelete | `Card#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link Card._onDelete | `Card#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link Card._preDeleteOperation | `Card#_preDeleteOperation`} */
    interface PreDeleteOperation extends Card.Database.Delete {}

    /** Options for {@link Card._onDeleteOperation | `Card#_onDeleteOperation`} */
    interface OnDeleteOperation extends Card.Database.Delete {}

    /** Context for {@linkcode Card._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<Card.Parent> {}

    /** Context for {@linkcode Card._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<Card.Parent> {}

    /** Context for {@linkcode Card._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<Card.Parent> {}

    /**
     * Options for {@link Card._preCreateDescendantDocuments | `Card#_preCreateDescendantDocuments`}
     * and {@link Card._onCreateDescendantDocuments | `Card#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<Card.Database.Create> {}

    /**
     * Options for {@link Card._preUpdateDescendantDocuments | `Card#_preUpdateDescendantDocuments`}
     * and {@link Card._onUpdateDescendantDocuments | `Card#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<Card.Database.Update> {}

    /**
     * Options for {@link Card._preDeleteDescendantDocuments | `Card#_preDeleteDescendantDocuments`}
     * and {@link Card._onDeleteDescendantDocuments | `Card#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<Card.Database.Delete> {}

    /**
     * Create options for {@linkcode Card.createDialog}.
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

  /** The interface {@linkcode Card.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode Card.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode Card.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode Card.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode Card.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>,
      Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode Card.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode Card.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends Card.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<Card.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode Card.deleteDialog | Card#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    Card.Stored,
    PassedConfig
  >;

  /**
   * @remarks {@link Card.pass | `Card#pass`} calls {@link Cards.pass | `this.parent.pass`} with `action: "pass"` provided by default.
   */
  interface PassOptions extends Cards.PassOptions {
    /**
     * @deprecated While passing `action` is technically valid, it's unclear why this would ever be done.
     * If you need to do this call `this.parent.pass` directly.
     */
    action?: never;
  }

  /**
   * @remarks {@link Card.play | `Card#play`} calls {@link Cards.pass | `this.parent.pass`} with `action: "play"` provided by default.
   */
  interface PlayOptions extends Cards.PassOptions {
    /**
     * @deprecated While passing `action` is technically valid, it's unclear why this would ever be done.
     * If you need to do this call `this.parent.pass` directly.
     */
    action?: never;
  }

  /**
   * @remarks {@link Card.discard | `Card#discard`} calls {@link Cards.pass | `this.parent.pass`} with `action: "discard"` provided by default.
   */
  interface DiscardOptions extends Cards.PassOptions {
    /**
     * @deprecated While passing `action` is technically valid, it's unclear why this would ever be done.
     * If you need to do this call `this.parent.pass` directly.
     */
    action?: never;
  }

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

  /**
   * @deprecated Replaced with {@linkcode Card.ConfiguredSubType} (will be removed in v14).
   */
  type ConfiguredSubTypes = ConfiguredSubType;
}

/**
 * The client-side Card document which extends the common BaseCard document model.
 *
 * @see {@linkcode Cards}                    The Cards document type which contains Card embedded documents
 */
declare class Card<out SubType extends Card.SubType = Card.SubType> extends BaseCard.Internal.ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `Card`
   * @param context - Construction context options
   */
  constructor(data: Card.CreateData<SubType>, context?: Card.ConstructionContext);

  /**
   * The current card face
   */
  get currentFace(): Card.FaceData | null;

  /**
   * The image of the currently displayed card face or back
   * @remarks Falls back to {@linkcode Card.DEFAULT_ICON}
   */
  get img(): string;

  /**
   * A reference to the source Cards document which defines this Card.
   */
  get source(): Cards.Implementation | null;

  /**
   * A convenience property for whether or not the Card is within its source Cards stack. Cards in decks are always
   * considered home.
   */
  get isHome(): boolean;

  /**
   * Whether or not to display the face of this card?
   */
  get showFace(): boolean;

  /**
   * Does this Card have a next face available to flip to?
   */
  get hasNextFace(): boolean;

  /**
   * Does this Card have a previous face available to flip to?
   */
  get hasPreviousFace(): boolean;

  /** @remarks Provides fallback value for `back.img`, and overrides `name` with the face/back's name if appropriate */
  override prepareDerivedData(): void;

  /**
   * Flip this card to some other face. A specific face may be requested, otherwise:
   * If the card currently displays a face the card is flipped to the back.
   * If the card currently displays the back it is flipped to the first face.
   * @param face - A specific face to flip the card to
   * @returns A reference to this card after the flip operation is complete
   */
  flip(face?: number | null): Promise<Card.Implementation | undefined>;

  /**
   * Pass this Card to some other Cards document.
   * @param to      - A new Cards document this card should be passed to
   * @param options - Options which modify the pass operation (default: `{}`)
   * @returns A reference to this card after the it has been passed to another parent document
   */
  pass(to: Cards.Implementation, options?: Card.PassOptions): Promise<Card.Implementation | undefined>;

  /**
   * Play a specific card to some other Cards document.
   * @see {@link Card.pass | `Card#pass`}
   * @remarks This method is currently a more semantic alias for {@link Card.pass | `Card#pass`}.
   */
  play(to: Cards.Implementation, options?: Card.PlayOptions): Promise<Card.Implementation | undefined>;

  /**
   * Discard a specific card to some other Cards document.
   * @see {@link Card.pass | `Card#pass`}
   * @remarks This method is currently a more semantic alias for {@link Card.pass | `Card#pass`}.
   */
  discard(to: Cards.Implementation, options?: Card.DiscardOptions): Promise<Card.Implementation | undefined>;

  /**
   * Recall this Card to its original Cards parent.
   * @param options - Options which modify the recall operation (default: `{}`)
   * @returns A reference to the recalled card belonging to its original parent
   * @remarks Core's implementation doesn't use `options` at all
   */
  recall(options?: AnyObject): Promise<Card.Implementation | undefined>;

  /**
   * Create a chat message which displays this Card.
   * @param messageData - Additional data which becomes part of the created ChatMessageData (default: `{}`)
   * @param options     - Options which modify the message creation operation (default: `{}`)
   * @returns The created chat message
   */
  toMessage<Temporary extends boolean | undefined = undefined>(
    messageData?: DeepPartial<foundry.documents.BaseChatMessage.CreateData>,
    options?: ChatMessage.Database.CreateOperation<Temporary>,
  ): Promise<ChatMessage.TemporaryIf<Temporary> | undefined>;

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

  // Descendant Document operations have been left out because Card does not have any descendant documents.

  static override defaultName(context?: Card.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends Card.CreateDialogOptions | undefined = undefined,
  >(
    data?: Card.CreateDialogData,
    createOptions?: Card.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<Card.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode Card.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends Card.CreateDialogOptions | undefined = undefined,
  >(
    data: Card.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: Card.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<Card.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: Card.Database2.DeleteOneDocumentOperation,
  ): Promise<Card.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: Card.Database2.DeleteOneDocumentOperation,
  ): Promise<Card.DeleteDialogReturn<Options>>;

  static override fromDropData(data: Card.DropData): Promise<Card.Implementation | undefined>;

  static override fromImport(
    source: Card.Source,
    context?: Document.FromImportContext<Card.Parent> | null,
  ): Promise<Card.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default Card;
