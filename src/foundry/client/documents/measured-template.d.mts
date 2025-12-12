import type { InexactPartial, MaybeArray, Merge } from "#utils";
import type { documents } from "#client/client.d.mts";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseMeasuredTemplate from "#common/documents/measured-template.mjs";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace MeasuredTemplateDocument {
  /**
   * The document's name.
   */
  type Name = "MeasuredTemplate";

  /**
   * The context used to create a `MeasuredTemplateDocument`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `MeasuredTemplateDocument`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `MeasuredTemplateDocument` document instance configured through
   * {@linkcode CONFIG.MeasuredTemplate.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `MeasuredTemplateDocument` document configured through
   * {@linkcode CONFIG.MeasuredTemplateDocument.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "MeasuredTemplate";
      collection: "templates";
      label: string;
      labelPlural: string;
      isEmbedded: true;
      permissions: Metadata.Permissions;
      schemaVersion: string;
    }>
  > {}

  namespace Metadata {
    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create(user: User.Internal.Implementation, doc: Implementation): boolean;
      delete: "OWNER";
    }
  }

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = Scene.Implementation | null;

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
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"Scene">;

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
   * An instance of `MeasuredTemplateDocument` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `MeasuredTemplateDocument` that comes from the database.
   */
  type Stored = Document.Internal.Stored<MeasuredTemplateDocument.Implementation>;

  /**
   * The data put in {@linkcode MeasuredTemplateDocument._source | MeasuredTemplateDocument#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode MeasuredTemplateDocument.create}
   * and {@linkcode MeasuredTemplateDocument | new MeasuredTemplateDocument(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * Used in the {@linkcode MeasuredTemplateDocument.create} and {@linkcode MeasuredTemplateDocument.createDocuments} signatures, and
   * {@linkcode MeasuredTemplateDocument.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode MeasuredTemplateDocument.create}, returning (a single | an array of) (temporary | stored)
   * `MeasuredTemplateDocument`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<MeasuredTemplateDocument.TemporaryIf<Temporary>>
      : MeasuredTemplateDocument.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode MeasuredTemplateDocument.name | MeasuredTemplateDocument#name}.
   *
   * This is data transformed from {@linkcode MeasuredTemplateDocument.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode MeasuredTemplateDocument.update | MeasuredTemplateDocument#update}.
   * It is a distinct type from {@linkcode MeasuredTemplateDocument.CreateData | DeepPartial<MeasuredTemplateDocument.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode MeasuredTemplateDocument.update | MeasuredTemplateDocument#update} and
   * {@linkcode MeasuredTemplateDocument.updateDocuments} signatures, and {@linkcode MeasuredTemplateDocument.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode MeasuredTemplateDocument}. This is the source of truth for how an MeasuredTemplateDocument document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode MeasuredTemplateDocument}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this BaseMeasuredTemplate embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The _id of the user who created this measured template
     * @defaultValue `game?.user?.id`
     */
    author: fields.DocumentAuthorField<typeof documents.BaseUser>;

    /**
     * The value in CONST.MEASURED_TEMPLATE_TYPES which defines the geometry type of this template
     * @defaultValue `CONST.MEASURED_TEMPLATE_TYPES.CIRCLE` (`"circle"`)
     */
    t: fields.StringField<
      {
        required: true;
        choices: CONST.MEASURED_TEMPLATE_TYPES[];
        initial: typeof CONST.MEASURED_TEMPLATE_TYPES.CIRCLE;
        validationError: "must be a value in CONST.MEASURED_TEMPLATE_TYPES";
      },
      // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
      CONST.MEASURED_TEMPLATE_TYPES | null | undefined,
      CONST.MEASURED_TEMPLATE_TYPES,
      CONST.MEASURED_TEMPLATE_TYPES
    >;

    /**
     * The x-coordinate position of the origin of the template effect
     * @defaultValue `0`
     */
    x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * The y-coordinate position of the origin of the template effect
     * @defaultValue `0`
     */
    y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * The elevation of the template
     * @defaultValue `0`
     */
    elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /**
     * The z-index of this template relative to other siblings
     * @defaultValue `0`
     */
    sort: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * The distance of the template effect
     * @defaultValue `0`
     */
    distance: fields.NumberField<{
      required: true;
      nullable: false;
      initial: 0;
      min: 0;
    }>;

    /**
     * The angle of rotation for the measured template
     * @defaultValue `0`
     */
    direction: fields.AngleField;

    /**
     * The angle of effect of the measured template, applies to cone types
     * @defaultValue `0`
     */
    angle: fields.AngleField<{ normalize: false }>;

    /**
     * The width of the measured template, applies to ray types
     * @defaultValue `0`
     */
    width: fields.NumberField<{ required: true; nullable: false; initial: 0; min: 0; step: 0.01 }>;

    /**
     * A color string used to tint the border of the template shape
     * @defaultValue `#000000`
     */
    borderColor: fields.ColorField<{ nullable: false; initial: "#000000" }>;

    /**
     * A color string used to tint the fill of the template shape
     * @defaultValue `game.user?.color.css || "#ffffff"`
     */
    fillColor: fields.ColorField<{ nullable: false; initial: () => string }>;

    /**
     * A repeatable tiling texture used to add a texture fill to the template shape
     * @defaultValue `null`
     */
    texture: fields.FilePathField<{ categories: ["IMAGE", "VIDEO"] }>;

    /**
     * Is the template currently hidden?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name>;
  }

  namespace Database2 {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `MeasuredTemplateDocument` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<MeasuredTemplateDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode MeasuredTemplateDocument.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get}.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `MeasuredTemplateDocument` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode MeasuredTemplateDocument.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<
      Temporary extends boolean | undefined = boolean | undefined,
    > extends DatabaseBackend.CreateOperation<
      MeasuredTemplateDocument.CreateInput,
      MeasuredTemplateDocument.Parent,
      Temporary
    > {}

    /**
     * The interface for passing to {@linkcode MeasuredTemplateDocument.create} or {@linkcode MeasuredTemplateDocument.createDocuments}.
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
    interface CreateDocumentsOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document
      .Database2.CreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `MeasuredTemplateDocument` documents. (see {@linkcode MeasuredTemplateDocument.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `MeasuredTemplateDocument` documents.
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
    interface BackendCreateOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document
      .Database2.BackendCreateOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode MeasuredTemplateDocument._preCreate | MeasuredTemplateDocument#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateMeasuredTemplateDocument` hook}.
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
    interface PreCreateOptions<Temporary extends boolean | undefined = boolean | undefined> extends Document.Database2
      .PreCreateOptions<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode MeasuredTemplateDocument._preCreateOperation}.
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
    interface PreCreateOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document.Database2
      .PreCreateOperation<CreateOperation<Temporary>> {}

    /**
     * @deprecated The interface passed to {@linkcode MeasuredTemplateDocument._onCreateDocuments}. It will be removed in v14 along with the
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
    interface OnCreateDocumentsOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document
      .Database2.OnCreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode MeasuredTemplateDocument._onCreate | MeasuredTemplateDocument#_onCreate} and
     * {@link Hooks.CreateDocument | the `createMeasuredTemplateDocument` hook}.
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
     * The interface passed to {@linkcode MeasuredTemplateDocument._onCreateOperation} and MeasuredTemplateDocument-related collections'
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
     * interface for `MeasuredTemplateDocument` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode MeasuredTemplateDocument.update | MeasuredTemplateDocument#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<
      MeasuredTemplateDocument.UpdateInput,
      MeasuredTemplateDocument.Parent
    > {}

    /**
     * The interface for passing to {@linkcode MeasuredTemplateDocument.update | MeasuredTemplateDocument#update}.
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
     * can contain `MeasuredTemplateDocument` documents (see {@linkcode MeasuredTemplateDocument.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode MeasuredTemplateDocument.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `MeasuredTemplateDocument` documents.
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
     * The interface passed to {@linkcode MeasuredTemplateDocument._preUpdate | MeasuredTemplateDocument#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateMeasuredTemplateDocument` hook}.
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
     * The interface passed to {@linkcode MeasuredTemplateDocument._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode MeasuredTemplateDocument._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode MeasuredTemplateDocument._onUpdate | MeasuredTemplateDocument#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateMeasuredTemplateDocument` hook}.
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
     * The interface passed to {@linkcode MeasuredTemplateDocument._onUpdateOperation} and MeasuredTemplateDocument-related collections'
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
     * interface for `MeasuredTemplateDocument` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode MeasuredTemplateDocument.delete | MeasuredTemplateDocument#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<MeasuredTemplateDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode MeasuredTemplateDocument.delete | MeasuredTemplateDocument#delete}.
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
     * can contain `MeasuredTemplateDocument` documents (see {@linkcode MeasuredTemplateDocument.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode MeasuredTemplateDocument.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `MeasuredTemplateDocument` documents.
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
     * The interface passed to {@linkcode MeasuredTemplateDocument._preDelete | MeasuredTemplateDocument#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteMeasuredTemplateDocument` hook}.
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
     * The interface passed to {@linkcode MeasuredTemplateDocument._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode MeasuredTemplateDocument._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode MeasuredTemplateDocument._onDelete | MeasuredTemplateDocument#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteMeasuredTemplateDocument` hook}.
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
     * The interface passed to {@linkcode MeasuredTemplateDocument._onDeleteOperation} and MeasuredTemplateDocument-related collections'
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
        GetDocumentsOperation: MeasuredTemplateDocument.Database2.GetDocumentsOperation;
        BackendGetOperation: MeasuredTemplateDocument.Database2.BackendGetOperation;
        GetOperation: MeasuredTemplateDocument.Database2.GetOperation;

        CreateDocumentsOperation: MeasuredTemplateDocument.Database2.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: MeasuredTemplateDocument.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: MeasuredTemplateDocument.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: MeasuredTemplateDocument.Database2.CreateOperation<Temporary>;
        PreCreateOptions: MeasuredTemplateDocument.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: MeasuredTemplateDocument.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: MeasuredTemplateDocument.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: MeasuredTemplateDocument.Database2.OnCreateOptions;
        OnCreateOperation: MeasuredTemplateDocument.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: MeasuredTemplateDocument.Database2.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: MeasuredTemplateDocument.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: MeasuredTemplateDocument.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: MeasuredTemplateDocument.Database2.BackendUpdateOperation;
        UpdateOperation: MeasuredTemplateDocument.Database2.UpdateOperation;
        PreUpdateOptions: MeasuredTemplateDocument.Database2.PreUpdateOptions;
        PreUpdateOperation: MeasuredTemplateDocument.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: MeasuredTemplateDocument.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: MeasuredTemplateDocument.Database2.OnUpdateOptions;
        OnUpdateOperation: MeasuredTemplateDocument.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: MeasuredTemplateDocument.Database2.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: MeasuredTemplateDocument.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: MeasuredTemplateDocument.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: MeasuredTemplateDocument.Database2.BackendDeleteOperation;
        DeleteOperation: MeasuredTemplateDocument.Database2.DeleteOperation;
        PreDeleteOptions: MeasuredTemplateDocument.Database2.PreDeleteOptions;
        PreDeleteOperation: MeasuredTemplateDocument.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: MeasuredTemplateDocument.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: MeasuredTemplateDocument.Database2.OnDeleteOptions;
        OnDeleteOperation: MeasuredTemplateDocument.Database2.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode MeasuredTemplateDocument.Implementation}, otherwise {@linkcode MeasuredTemplateDocument.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? MeasuredTemplateDocument.Implementation : MeasuredTemplateDocument.Stored;

  namespace Database {
    /** Options passed along in Get operations for MeasuredTemplateDocuments */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<MeasuredTemplateDocument.Parent> {}

    /** Options passed along in Create operations for MeasuredTemplateDocuments */
    interface Create<Temporary extends boolean | undefined = boolean | undefined> extends foundry.abstract.types
      .DatabaseCreateOperation<MeasuredTemplateDocument.CreateData, MeasuredTemplateDocument.Parent, Temporary> {}

    /** Options passed along in Delete operations for MeasuredTemplateDocuments */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<MeasuredTemplateDocument.Parent> {}

    /** Options passed along in Update operations for MeasuredTemplateDocuments */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<
      MeasuredTemplateDocument.UpdateData,
      MeasuredTemplateDocument.Parent
    > {}

    /** Operation for {@linkcode MeasuredTemplateDocument.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined> extends Document.Database
      .CreateDocumentsOperation<MeasuredTemplateDocument.Database.Create<Temporary>> {}

    /** Operation for {@linkcode MeasuredTemplateDocument.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database
      .UpdateDocumentsOperation<MeasuredTemplateDocument.Database.Update> {}

    /** Operation for {@linkcode MeasuredTemplateDocument.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database
      .DeleteDocumentsOperation<MeasuredTemplateDocument.Database.Delete> {}

    /** Operation for {@linkcode MeasuredTemplateDocument.create} */
    interface CreateOperation<Temporary extends boolean | undefined> extends Document.Database.CreateDocumentsOperation<
      MeasuredTemplateDocument.Database.Create<Temporary>
    > {}

    /** Operation for {@link MeasuredTemplateDocument.update | `MeasuredTemplateDocument#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode MeasuredTemplateDocument.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link MeasuredTemplateDocument._preCreate | `MeasuredTemplateDocument#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link MeasuredTemplateDocument._onCreate | `MeasuredTemplateDocument#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode MeasuredTemplateDocument._preCreateOperation} */
    interface PreCreateOperation extends Document.Database
      .PreCreateOperationStatic<MeasuredTemplateDocument.Database.Create> {}

    /** Operation for {@link MeasuredTemplateDocument._onCreateOperation | `MeasuredTemplateDocument#_onCreateOperation`} */
    interface OnCreateOperation extends MeasuredTemplateDocument.Database.Create {}

    /** Options for {@link MeasuredTemplateDocument._preUpdate | `MeasuredTemplateDocument#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link MeasuredTemplateDocument._onUpdate | `MeasuredTemplateDocument#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode MeasuredTemplateDocument._preUpdateOperation} */
    interface PreUpdateOperation extends MeasuredTemplateDocument.Database.Update {}

    /** Operation for {@link MeasuredTemplateDocument._onUpdateOperation | `MeasuredTemplateDocument._preUpdateOperation`} */
    interface OnUpdateOperation extends MeasuredTemplateDocument.Database.Update {}

    /** Options for {@link MeasuredTemplateDocument._preDelete | `MeasuredTemplateDocument#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link MeasuredTemplateDocument._onDelete | `MeasuredTemplateDocument#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link MeasuredTemplateDocument._preDeleteOperation | `MeasuredTemplateDocument#_preDeleteOperation`} */
    interface PreDeleteOperation extends MeasuredTemplateDocument.Database.Delete {}

    /** Options for {@link MeasuredTemplateDocument._onDeleteOperation | `MeasuredTemplateDocument#_onDeleteOperation`} */
    interface OnDeleteOperation extends MeasuredTemplateDocument.Database.Delete {}

    /** Context for {@linkcode MeasuredTemplateDocument._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<MeasuredTemplateDocument.Parent> {}

    /** Context for {@linkcode MeasuredTemplateDocument._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<MeasuredTemplateDocument.Parent> {}

    /** Context for {@linkcode MeasuredTemplateDocument._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<MeasuredTemplateDocument.Parent> {}

    /**
     * Options for {@link MeasuredTemplateDocument._preCreateDescendantDocuments | `MeasuredTemplateDocument#_preCreateDescendantDocuments`}
     * and {@link MeasuredTemplateDocument._onCreateDescendantDocuments | `MeasuredTemplateDocument#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<MeasuredTemplateDocument.Database.Create> {}

    /**
     * Options for {@link MeasuredTemplateDocument._preUpdateDescendantDocuments | `MeasuredTemplateDocument#_preUpdateDescendantDocuments`}
     * and {@link MeasuredTemplateDocument._onUpdateDescendantDocuments | `MeasuredTemplateDocument#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<MeasuredTemplateDocument.Database.Update> {}

    /**
     * Options for {@link MeasuredTemplateDocument._preDeleteDescendantDocuments | `MeasuredTemplateDocument#_preDeleteDescendantDocuments`}
     * and {@link MeasuredTemplateDocument._onDeleteDescendantDocuments | `MeasuredTemplateDocument#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<MeasuredTemplateDocument.Database.Delete> {}

    /**
     * Create options for {@linkcode MeasuredTemplate.createDialog}.
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

  /** The interface {@linkcode MeasuredTemplateDocument.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode MeasuredTemplateDocument.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode MeasuredTemplateDocument.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode MeasuredTemplateDocument.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode MeasuredTemplateDocument.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>, Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode MeasuredTemplateDocument.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode MeasuredTemplateDocument.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends MeasuredTemplateDocument.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<MeasuredTemplateDocument.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode MeasuredTemplateDocument.deleteDialog | MeasuredTemplateDocument#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    MeasuredTemplateDocument.Stored,
    PassedConfig
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
 * The client-side MeasuredTemplate document which extends the common BaseMeasuredTemplate document model.
 *
 * @see {@linkcode Scene}                     The Scene document type which contains MeasuredTemplate documents
 * @see {@linkcode MeasuredTemplateConfig}    The MeasuredTemplate configuration application
 */
declare class MeasuredTemplateDocument extends BaseMeasuredTemplate.Internal.CanvasDocument {
  /**
   * @param data    - Initial data from which to construct the `MeasuredTemplateDocument`
   * @param context - Construction context options
   */
  constructor(data?: MeasuredTemplateDocument.CreateData, context?: MeasuredTemplateDocument.ConstructionContext);

  /**
   * Rotation is an alias for direction
   */
  get rotation(): number;

  /**
   * Is the current User the author of this template?
   */
  get isAuthor(): boolean;

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

  // Descendant Document operations have been left out because MeasuredTemplate does not have any descendant documents.

  static override defaultName(context?: MeasuredTemplateDocument.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends MeasuredTemplateDocument.CreateDialogOptions | undefined = undefined,
  >(
    data?: MeasuredTemplateDocument.CreateDialogData,
    createOptions?: MeasuredTemplateDocument.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<MeasuredTemplateDocument.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode MeasuredTemplateDocument.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends MeasuredTemplateDocument.CreateDialogOptions | undefined = undefined,
  >(
    data: MeasuredTemplateDocument.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: MeasuredTemplateDocument.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<MeasuredTemplateDocument.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: MeasuredTemplateDocument.Database2.DeleteOneDocumentOperation,
  ): Promise<MeasuredTemplateDocument.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: MeasuredTemplateDocument.Database2.DeleteOneDocumentOperation,
  ): Promise<MeasuredTemplateDocument.DeleteDialogReturn<Options>>;

  static override fromDropData(
    data: MeasuredTemplateDocument.DropData,
  ): Promise<MeasuredTemplateDocument.Implementation | undefined>;

  static override fromImport(
    source: MeasuredTemplateDocument.Source,
    context?: Document.FromImportContext<MeasuredTemplateDocument.Parent> | null,
  ): Promise<MeasuredTemplateDocument.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default MeasuredTemplateDocument;
