import type { InexactPartial, IntentionalPartial, MaybeArray, Merge } from "#utils";
import type { documents } from "#client/client.d.mts";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { ShapeData } from "#common/data/data.mjs";
import type BaseDrawing from "#common/documents/drawing.mjs";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace DrawingDocument {
  /**
   * The document's name.
   */
  type Name = "Drawing";

  /**
   * The context used to create a `DrawingDocument`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `DrawingDocument`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `DrawingDocument` document instance configured through
   * {@linkcode CONFIG.Drawing.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `DrawingDocument` document configured through
   * {@linkcode CONFIG.Drawing.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
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
        name: "Drawing";
        collection: "drawings";
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
      create(user: User.Internal.Implementation, doc: Implementation, data: CreateData): boolean;
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
   * An instance of `DrawingDocument` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `DrawingDocument` that comes from the database.
   */
  type Stored = Document.Internal.Stored<DrawingDocument.Implementation>;

  /**
   * The data put in {@linkcode DrawingDocument._source | DrawingDocument#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode DrawingDocument.create}
   * and {@linkcode DrawingDocument | new DrawingDocument(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * Used in the {@linkcode DrawingDocument.create} and {@linkcode DrawingDocument.createDocuments} signatures, and
   * {@linkcode DrawingDocument.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode DrawingDocument.create}, returning (a single | an array of) (temporary | stored)
   * `DrawingDocument`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<DrawingDocument.TemporaryIf<Temporary>>
      : DrawingDocument.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode DrawingDocument.name | DrawingDocument#name}.
   *
   * This is data transformed from {@linkcode DrawingDocument.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode DrawingDocument.update | DrawingDocument#update}.
   * It is a distinct type from {@linkcode DrawingDocument.CreateData | DeepPartial<DrawingDocument.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode DrawingDocument.update | DrawingDocument#update} and
   * {@linkcode DrawingDocument.updateDocuments} signatures, and {@linkcode DrawingDocument.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode DrawingDocument}. This is the source of truth for how an DrawingDocument document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode DrawingDocument}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this BaseDrawing embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The _id of the user who created the drawing
     * @defaultValue `game.user?.id`
     */
    author: fields.DocumentAuthorField<typeof documents.BaseUser>;

    /**
     * The geometric shape of the drawing
     * @defaultValue see {@linkcode ShapeData.Schema}
     */
    shape: fields.EmbeddedDataField<typeof ShapeData>;

    /**
     * The x-coordinate position of the top-left corner of the drawn shape
     * @defaultValue `0`
     */
    x: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /**
     * The y-coordinate position of the top-left corner of the drawn shape
     * @defaultValue `0`
     */
    y: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /**
     * The elevation of the drawing
     * @defaultValue `0`
     */
    elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /**
     * The z-index of this drawing relative to other siblings
     * @defaultValue `0`
     */
    sort: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * The angle of rotation for the drawing figure
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * An amount of bezier smoothing applied, between 0 and 1
     * @defaultValue `0`
     */
    bezierFactor: fields.AlphaField<{
      initial: 0;
      label: "DRAWING.SmoothingFactor";
      max: 0.5;
      hint: "DRAWING.SmoothingFactorHint";
    }>;

    /**
     * The fill type of the drawing shape, a value from CONST.DRAWING_FILL_TYPES
     * @defaultValue `CONST.DRAWING_FILL_TYPES.NONE`
     */
    fillType: fields.NumberField<
      {
        required: true;
        nullable: false;
        initial: typeof CONST.DRAWING_FILL_TYPES.NONE;
        choices: Record<CONST.DRAWING_FILL_TYPES, string>;
        label: "DRAWING.FillTypes";
        validationError: "must be a value in CONST.DRAWING_FILL_TYPES";
      },
      // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
      CONST.DRAWING_FILL_TYPES | null | undefined,
      CONST.DRAWING_FILL_TYPES,
      CONST.DRAWING_FILL_TYPES
    >;

    /**
     * An optional color string with which to fill the drawing geometry
     * @defaultValue `game.user?.color.css || "#ffffff"`
     */
    fillColor: fields.ColorField<{ nullable: false; initial: () => string; label: "DRAWING.FillColor" }>;

    /**
     * The opacity of the fill applied to the drawing geometry
     * @defaultValue `0.5`
     */
    fillAlpha: fields.AlphaField<{ initial: 0.5; label: "DRAWING.FillOpacity" }>;

    /**
     * The width in pixels of the boundary lines of the drawing geometry
     * @defaultValue `8`
     */
    strokeWidth: fields.NumberField<{
      nullable: false;
      integer: true;
      initial: 8;
      min: 0;
      label: "DRAWING.LineWidth";
    }>;

    /**
     * The color of the boundary lines of the drawing geometry
     * @defaultValue `game.user?.color.css || "#ffffff"`
     */
    strokeColor: fields.ColorField<{ nullable: false; initial: () => string; label: "DRAWING.StrokeColor" }>;

    /**
     * The opacity of the boundary lines of the drawing geometry
     * @defaultValue `1`
     */
    strokeAlpha: fields.AlphaField<{ initial: 1; label: "DRAWING.LineOpacity" }>;

    /**
     * The path to a tiling image texture used to fill the drawing geometry
     * @defaultValue `null`
     */
    texture: fields.FilePathField<{ categories: ["IMAGE"]; label: "DRAWING.FillTexture" }>;

    /**
     * Optional text which is displayed overtop of the drawing
     * @defaultValue `undefined`
     */
    text: fields.StringField<{ label: "DRAWING.TextLabel" }>;

    /**
     * The font family used to display text within this drawing, defaults to CONFIG.defaultFontFamily
     * @defaultValue `globalThis.CONFIG?.defaultFontFamily || "Signika"`
     */
    fontFamily: fields.StringField<{ blank: false; label: "DRAWING.FontFamily"; initial: () => string }>;

    /**
     * The font size used to display text within this drawing
     * @defaultValue `48`
     */
    fontSize: fields.NumberField<{
      nullable: false;
      integer: true;
      min: 8;
      max: 256;
      initial: 48;
      label: "DRAWING.FontSize";
      validationError: "must be an integer between 8 and 256";
    }>;

    /**
     * The color of text displayed within this drawing
     * @defaultValue `#FFFFFF`
     */
    textColor: fields.ColorField<{ nullable: false; initial: "#FFFFFF"; label: "DRAWING.TextColor" }>;

    /**
     * The opacity of text displayed within this drawing
     * @defaultValue `1`
     */
    textAlpha: fields.AlphaField<{ label: "DRAWING.TextOpacity" }>;

    /**
     * Is the drawing currently hidden?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField;

    /**
     * Is the drawing currently locked?
     * @defaultValue `false`
     */
    locked: fields.BooleanField;

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
     * `DrawingDocument` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<DrawingDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode DrawingDocument.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `DrawingDocument` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `DrawingDocument` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode DrawingDocument.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends DatabaseBackend.CreateOperation<DrawingDocument.CreateInput, DrawingDocument.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode DrawingDocument.create} or {@linkcode DrawingDocument.createDocuments}.
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
     * can contain `DrawingDocument` documents. (see {@linkcode DrawingDocument.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `DrawingDocument` documents.
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
     * The interface passed to {@linkcode DrawingDocument._preCreate | DrawingDocument#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateDrawingDocument` hook}.
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
     * The interface passed to {@linkcode DrawingDocument._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode DrawingDocument._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode DrawingDocument._onCreate | DrawingDocument#_onCreate} and
     * {@link Hooks.CreateDocument | the `createDrawingDocument` hook}.
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
     * The interface passed to {@linkcode DrawingDocument._onCreateOperation} and `DrawingDocument`-related collections'
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
     * interface for `DrawingDocument` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode DrawingDocument.update | DrawingDocument#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation
      extends DatabaseBackend.UpdateOperation<DrawingDocument.UpdateInput, DrawingDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode DrawingDocument.update | DrawingDocument#update}.
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
     * can contain `DrawingDocument` documents (see {@linkcode DrawingDocument.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode DrawingDocument.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `DrawingDocument` documents.
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
     * The interface passed to {@linkcode DrawingDocument._preUpdate | DrawingDocument#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateDrawingDocument` hook}.
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
     * The interface passed to {@linkcode DrawingDocument._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode DrawingDocument._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode DrawingDocument._onUpdate | DrawingDocument#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateDrawingDocument` hook}.
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
     * The interface passed to {@linkcode DrawingDocument._onUpdateOperation} and `DrawingDocument`-related collections'
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
     * interface for `DrawingDocument` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode DrawingDocument.delete | DrawingDocument#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<DrawingDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode DrawingDocument.delete | DrawingDocument#delete}.
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
     * can contain `DrawingDocument` documents (see {@linkcode DrawingDocument.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode DrawingDocument.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `DrawingDocument` documents.
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
     * The interface passed to {@linkcode DrawingDocument._preDelete | DrawingDocument#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteDrawingDocument` hook}.
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
     * The interface passed to {@linkcode DrawingDocument._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode DrawingDocument._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode DrawingDocument._onDelete | DrawingDocument#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteDrawingDocument` hook}.
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
     * The interface passed to {@linkcode DrawingDocument._onDeleteOperation} and `DrawingDocument`-related collections'
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
        GetDocumentsOperation: DrawingDocument.Database2.GetDocumentsOperation;
        BackendGetOperation: DrawingDocument.Database2.BackendGetOperation;
        GetOperation: DrawingDocument.Database2.GetOperation;

        CreateDocumentsOperation: DrawingDocument.Database2.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: DrawingDocument.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: DrawingDocument.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: DrawingDocument.Database2.CreateOperation<Temporary>;
        PreCreateOptions: DrawingDocument.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: DrawingDocument.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: DrawingDocument.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: DrawingDocument.Database2.OnCreateOptions;
        OnCreateOperation: DrawingDocument.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: DrawingDocument.Database2.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: DrawingDocument.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: DrawingDocument.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: DrawingDocument.Database2.BackendUpdateOperation;
        UpdateOperation: DrawingDocument.Database2.UpdateOperation;
        PreUpdateOptions: DrawingDocument.Database2.PreUpdateOptions;
        PreUpdateOperation: DrawingDocument.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: DrawingDocument.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: DrawingDocument.Database2.OnUpdateOptions;
        OnUpdateOperation: DrawingDocument.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: DrawingDocument.Database2.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: DrawingDocument.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: DrawingDocument.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: DrawingDocument.Database2.BackendDeleteOperation;
        DeleteOperation: DrawingDocument.Database2.DeleteOperation;
        PreDeleteOptions: DrawingDocument.Database2.PreDeleteOptions;
        PreDeleteOperation: DrawingDocument.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: DrawingDocument.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: DrawingDocument.Database2.OnDeleteOptions;
        OnDeleteOperation: DrawingDocument.Database2.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode DrawingDocument.Implementation}, otherwise {@linkcode DrawingDocument.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? DrawingDocument.Implementation : DrawingDocument.Stored;

  namespace Database {
    /** Options passed along in Get operations for DrawingDocuments */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<DrawingDocument.Parent> {}

    /** Options passed along in Create operations for DrawingDocuments */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<
        DrawingDocument.CreateData,
        DrawingDocument.Parent,
        Temporary
      > {}

    /** Options passed along in Delete operations for DrawingDocuments */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<DrawingDocument.Parent> {}

    /** Options passed along in Update operations for DrawingDocuments */
    interface Update
      extends foundry.abstract.types.DatabaseUpdateOperation<DrawingDocument.UpdateData, DrawingDocument.Parent> {}

    /** Operation for {@linkcode DrawingDocument.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<DrawingDocument.Database.Create<Temporary>> {}

    /** Operation for {@linkcode DrawingDocument.updateDocuments} */
    interface UpdateDocumentsOperation
      extends Document.Database.UpdateDocumentsOperation<DrawingDocument.Database.Update> {}

    /** Operation for {@linkcode DrawingDocument.deleteDocuments} */
    interface DeleteDocumentsOperation
      extends Document.Database.DeleteDocumentsOperation<DrawingDocument.Database.Delete> {}

    /** Operation for {@linkcode DrawingDocument.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<DrawingDocument.Database.Create<Temporary>> {}

    /** Operation for {@link DrawingDocument.update | `DrawingDocument#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode DrawingDocument.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link DrawingDocument._preCreate | `DrawingDocument#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link DrawingDocument._onCreate | `DrawingDocument#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode DrawingDocument._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<DrawingDocument.Database.Create> {}

    /** Operation for {@link DrawingDocument._onCreateOperation | `DrawingDocument#_onCreateOperation`} */
    interface OnCreateOperation extends DrawingDocument.Database.Create {}

    /** Options for {@link DrawingDocument._preUpdate | `DrawingDocument#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link DrawingDocument._onUpdate | `DrawingDocument#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode DrawingDocument._preUpdateOperation} */
    interface PreUpdateOperation extends DrawingDocument.Database.Update {}

    /** Operation for {@link DrawingDocument._onUpdateOperation | `DrawingDocument._preUpdateOperation`} */
    interface OnUpdateOperation extends DrawingDocument.Database.Update {}

    /** Options for {@link DrawingDocument._preDelete | `DrawingDocument#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link DrawingDocument._onDelete | `DrawingDocument#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link DrawingDocument._preDeleteOperation | `DrawingDocument#_preDeleteOperation`} */
    interface PreDeleteOperation extends DrawingDocument.Database.Delete {}

    /** Options for {@link DrawingDocument._onDeleteOperation | `DrawingDocument#_onDeleteOperation`} */
    interface OnDeleteOperation extends DrawingDocument.Database.Delete {}

    /** Context for {@linkcode DrawingDocument._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<DrawingDocument.Parent> {}

    /** Context for {@linkcode DrawingDocument._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<DrawingDocument.Parent> {}

    /** Context for {@linkcode DrawingDocument._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<DrawingDocument.Parent> {}

    /**
     * Options for {@link DrawingDocument._preCreateDescendantDocuments | `DrawingDocument#_preCreateDescendantDocuments`}
     * and {@link DrawingDocument._onCreateDescendantDocuments | `DrawingDocument#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<DrawingDocument.Database.Create> {}

    /**
     * Options for {@link DrawingDocument._preUpdateDescendantDocuments | `DrawingDocument#_preUpdateDescendantDocuments`}
     * and {@link DrawingDocument._onUpdateDescendantDocuments | `DrawingDocument#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<DrawingDocument.Database.Update> {}

    /**
     * Options for {@link DrawingDocument._preDeleteDescendantDocuments | `DrawingDocument#_preDeleteDescendantDocuments`}
     * and {@link DrawingDocument._onDeleteDescendantDocuments | `DrawingDocument#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<DrawingDocument.Database.Delete> {}

    /**
     * Create options for {@linkcode DrawingDocument.createDialog}.
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

  /** The interface {@linkcode DrawingDocument.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode DrawingDocument.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode DrawingDocument.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode DrawingDocument.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode DrawingDocument.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>,
      Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode DrawingDocument.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode DrawingDocument.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends DrawingDocument.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<DrawingDocument.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode DrawingDocument.deleteDialog | DrawingDocument#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    DrawingDocument.Stored,
    PassedConfig
  >;

  /* ***********************************************
   *            DRAWING-SPECIFIC TYPES             *
   *************************************************/

  interface ValidateVisibleContentData
    extends IntentionalPartial<Pick<BaseDrawing.InitializedData, "shape">>,
      Pick<
        BaseDrawing.InitializedData,
        "text" | "textAlpha" | "fillType" | "fillAlpha" | "strokeWidth" | "strokeAlpha"
      > {}

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
 * The client-side Drawing document which extends the common BaseDrawing model.
 *
 * @see {@linkcode Scene}               The Scene document type which contains Drawing embedded documents
 * @see {@linkcode DrawingConfig}       The Drawing configuration application
 */
declare class DrawingDocument extends BaseDrawing.Internal.CanvasDocument {
  /**
   * @param data    - Initial data from which to construct the `DrawingDocument`
   * @param context - Construction context options
   */
  // Note(LukeAbby): Required because while `DrawingDocument` has no directly required schema
  // properties the `validateJoint` method will fail.
  constructor(data: DrawingDocument.CreateData, context?: DrawingDocument.ConstructionContext);

  /**
   * Fields included in the drawing defaults setting
   * @defaultValue `["strokeWidth", "strokeColor", "strokeAlpha", "bezierFactor", "fillType", "fillColor", "fillAlpha", "texture", "text", "fontFamily", "fontSize", "textColor", "textAlpha"]`
   */
  static defaultDrawingFields: (keyof DrawingDocument.InitializedData)[];

  /**
   * Is the current User the author of this drawing?
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

  // Descendant Document operations have been left out because Drawing does not have any descendant documents.

  static override defaultName(context?: DrawingDocument.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends DrawingDocument.CreateDialogOptions | undefined = undefined,
  >(
    data?: DrawingDocument.CreateDialogData,
    createOptions?: DrawingDocument.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<DrawingDocument.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode DrawingDocument.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends DrawingDocument.CreateDialogOptions | undefined = undefined,
  >(
    data: DrawingDocument.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: DrawingDocument.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<DrawingDocument.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: DrawingDocument.Database2.DeleteOneDocumentOperation,
  ): Promise<DrawingDocument.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: DrawingDocument.Database2.DeleteOneDocumentOperation,
  ): Promise<DrawingDocument.DeleteDialogReturn<Options>>;

  static override fromDropData(data: DrawingDocument.DropData): Promise<DrawingDocument.Implementation | undefined>;

  static override fromImport(
    source: DrawingDocument.Source,
    context?: Document.FromImportContext<DrawingDocument.Parent> | null,
  ): Promise<DrawingDocument.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default DrawingDocument;
