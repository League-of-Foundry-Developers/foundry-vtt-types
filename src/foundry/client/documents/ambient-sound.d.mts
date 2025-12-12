import type { InexactPartial, MaybeArray, Merge } from "#utils";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseAmbientSound from "#common/documents/ambient-sound.mjs";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace AmbientSoundDocument {
  /**
   * The document's name.
   */
  type Name = "AmbientSound";

  /**
   * The context used to create a `AmbientSoundDocument`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `AmbientSoundDocument`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `AmbientSoundDocument` document instance configured through
   * {@linkcode CONFIG.AmbientSound.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `AmbientSoundDocument` document configured through
   * {@linkcode CONFIG.AmbientSound.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "AmbientSound";
      collection: "sounds";
      label: string;
      labelPlural: string;
      isEmbedded: true;
      schemaVersion: string;
    }>
  > {}

  // No need for Metadata namespace

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
   * An instance of `AmbientSoundDocument` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `AmbientSoundDocument` that comes from the database.
   */
  type Stored = Document.Internal.Stored<AmbientSoundDocument.Implementation>;

  /**
   * The data put in {@linkcode AmbientSoundDocument._source | AmbientSoundDocument#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode AmbientSoundDocument.create}
   * and {@linkcode AmbientSoundDocument | new AmbientSoundDocument(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * Used in the {@linkcode AmbientSoundDocument.create} and {@linkcode AmbientSoundDocument.createDocuments} signatures, and
   * {@linkcode AmbientSoundDocument.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode AmbientSoundDocument.create}, returning (a single | an array of) (temporary | stored)
   * `AmbientSoundDocument`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<AmbientSoundDocument.TemporaryIf<Temporary>>
      : AmbientSoundDocument.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode AmbientSoundDocument.name | AmbientSoundDocument#name}.
   *
   * This is data transformed from {@linkcode AmbientSoundDocument.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode AmbientSoundDocument.update | AmbientSoundDocument#update}.
   * It is a distinct type from {@linkcode AmbientSoundDocument.CreateData | DeepPartial<AmbientSoundDocument.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode AmbientSoundDocument.update | AmbientSoundDocument#update} and
   * {@linkcode AmbientSoundDocument.updateDocuments} signatures, and {@linkcode AmbientSoundDocument.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode AmbientSoundDocument}. This is the source of truth for how an AmbientSoundDocument document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode AmbientSoundDocument}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this AmbientSound document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The x-coordinate position of the origin of the sound.
     * @defaultValue `0`
     */
    x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * The y-coordinate position of the origin of the sound.
     * @defaultValue `0`
     */
    y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * The elevation of the sound.
     * @defaultValue `0`
     */
    elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /**
     * The radius of the emitted sound.
     * @defaultValue `0`
     */
    radius: fields.NumberField<{
      required: true;
      nullable: false;
      initial: 0;
      min: 0;
      step: 0.01;
    }>;

    /**
     * The audio file path that is played by this sound
     * @defaultValue `null`
     */
    path: fields.FilePathField<{ categories: ["AUDIO"] }>;

    /**
     * Does this sound loop?
     * @defaultValue `false`
     */
    repeat: fields.BooleanField;

    /**
     * The audio volume of the sound, from 0 to 1
     * @defaultValue `0.5`
     */
    volume: fields.AlphaField<{ initial: 0.5; step: 0.01 }>;

    /**
     * Whether or not this sound source is constrained by Walls.
     * @defaultValue `true`
     */
    walls: fields.BooleanField<{ initial: true }>;

    /**
     * Whether to adjust the volume of the sound heard by the listener based on how
     * close the listener is to the center of the sound source.
     * @defaultValue `true`
     */
    easing: fields.BooleanField<{ initial: true }>;

    /**
     * Is the sound source currently hidden?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField;

    /**
     * A darkness range (min and max) for which the source should be active
     * @defaultValue see properties
     */
    darkness: fields.SchemaField<{
      /** @defaultValue `0` */
      min: fields.AlphaField<{ initial: 0 }>;

      /** @defaultValue `1` */
      max: fields.AlphaField<{ initial: 1 }>;
    }>;

    /**
     * Special effects to apply to the sound
     * @defaultValue see properties
     */
    effects: fields.SchemaField<{
      /**
       * An effect configuration to apply to the sound when not muffled by walls (either clear of, or fully constrained by, walls)
       * @defaultValue see properties of {@link EffectsConfigSchema | `AmbientSoundDocument.EffectsConfigSchema`}
       */
      base: fields.SchemaField<EffectsConfigSchema>;

      /**
       * An effect configuration to apply to the sound when muffled by walls
       * @defaultValue see properties of {@link EffectsConfigSchema | `AmbientSoundDocument.EffectsConfigSchema`}
       */
      muffled: fields.SchemaField<EffectsConfigSchema>;
    }>;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name>;
  }

  interface EffectsConfigSchema extends DataSchema {
    /**
     * @defaultValue `undefined`
     * @remarks This isn't enforced by the model, but in practice should only have values in `keyof CONFIG["soundEffects"]`
     */
    type: fields.StringField;

    /** @defaultValue `5` */
    intensity: fields.NumberField<{ required: true; integer: true; initial: 5; min: 1; max: 10 }>;
  }

  namespace Database2 {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `AmbientSoundDocument` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<AmbientSoundDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode AmbientSoundDocument.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `AmbientSoundDocument` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `AmbientSoundDocument` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode AmbientSoundDocument.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<
      Temporary extends boolean | undefined = boolean | undefined,
    > extends DatabaseBackend.CreateOperation<
      AmbientSoundDocument.CreateInput,
      AmbientSoundDocument.Parent,
      Temporary
    > {}

    /**
     * The interface for passing to {@linkcode AmbientSoundDocument.create} or {@linkcode AmbientSoundDocument.createDocuments}.
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
     * can contain `AmbientSoundDocument` documents. (see {@linkcode AmbientSoundDocument.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `AmbientSoundDocument` documents.
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
     * The interface passed to {@linkcode AmbientSoundDocument._preCreate | AmbientSoundDocument#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateAmbientSoundDocument` hook}.
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
     * The interface passed to {@linkcode AmbientSoundDocument._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode AmbientSoundDocument._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode AmbientSoundDocument._onCreate | AmbientSoundDocument#_onCreate} and
     * {@link Hooks.CreateDocument | the `createAmbientSoundDocument` hook}.
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
     * The interface passed to {@linkcode AmbientSoundDocument._onCreateOperation} and `AmbientSoundDocument`-related collections'
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
     * interface for `AmbientSoundDocument` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode AmbientSoundDocument.update | AmbientSoundDocument#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<
      AmbientSoundDocument.UpdateInput,
      AmbientSoundDocument.Parent
    > {}

    /**
     * The interface for passing to {@linkcode AmbientSoundDocument.update | AmbientSoundDocument#update}.
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
     * can contain `AmbientSoundDocument` documents (see {@linkcode AmbientSoundDocument.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode AmbientSoundDocument.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `AmbientSoundDocument` documents.
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
     * The interface passed to {@linkcode AmbientSoundDocument._preUpdate | AmbientSoundDocument#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateAmbientSoundDocument` hook}.
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
     * The interface passed to {@linkcode AmbientSoundDocument._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode AmbientSoundDocument._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode AmbientSoundDocument._onUpdate | AmbientSoundDocument#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateAmbientSoundDocument` hook}.
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
     * The interface passed to {@linkcode AmbientSoundDocument._onUpdateOperation} and `AmbientSoundDocument`-related collections'
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
     * interface for `AmbientSoundDocument` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode AmbientSoundDocument.delete | AmbientSoundDocument#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<AmbientSoundDocument.Parent> {}

    /**
     * The interface for passing to {@linkcode AmbientSoundDocument.delete | AmbientSoundDocument#delete}.
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
     * can contain `AmbientSoundDocument` documents (see {@linkcode AmbientSoundDocument.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode AmbientSoundDocument.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `AmbientSoundDocument` documents.
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
     * The interface passed to {@linkcode AmbientSoundDocument._preDelete | AmbientSoundDocument#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteAmbientSoundDocument` hook}.
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
     * The interface passed to {@linkcode AmbientSoundDocument._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode AmbientSoundDocument._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode AmbientSoundDocument._onDelete | AmbientSoundDocument#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteAmbientSoundDocument` hook}.
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
     * The interface passed to {@linkcode AmbientSoundDocument._onDeleteOperation} and `AmbientSoundDocument`-related collections'
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
        GetDocumentsOperation: AmbientSoundDocument.Database2.GetDocumentsOperation;
        BackendGetOperation: AmbientSoundDocument.Database2.BackendGetOperation;
        GetOperation: AmbientSoundDocument.Database2.GetOperation;

        CreateDocumentsOperation: AmbientSoundDocument.Database2.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: AmbientSoundDocument.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: AmbientSoundDocument.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: AmbientSoundDocument.Database2.CreateOperation<Temporary>;
        PreCreateOptions: AmbientSoundDocument.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: AmbientSoundDocument.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: AmbientSoundDocument.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: AmbientSoundDocument.Database2.OnCreateOptions;
        OnCreateOperation: AmbientSoundDocument.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: AmbientSoundDocument.Database2.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: AmbientSoundDocument.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: AmbientSoundDocument.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: AmbientSoundDocument.Database2.BackendUpdateOperation;
        UpdateOperation: AmbientSoundDocument.Database2.UpdateOperation;
        PreUpdateOptions: AmbientSoundDocument.Database2.PreUpdateOptions;
        PreUpdateOperation: AmbientSoundDocument.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: AmbientSoundDocument.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: AmbientSoundDocument.Database2.OnUpdateOptions;
        OnUpdateOperation: AmbientSoundDocument.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: AmbientSoundDocument.Database2.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: AmbientSoundDocument.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: AmbientSoundDocument.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: AmbientSoundDocument.Database2.BackendDeleteOperation;
        DeleteOperation: AmbientSoundDocument.Database2.DeleteOperation;
        PreDeleteOptions: AmbientSoundDocument.Database2.PreDeleteOptions;
        PreDeleteOperation: AmbientSoundDocument.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: AmbientSoundDocument.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: AmbientSoundDocument.Database2.OnDeleteOptions;
        OnDeleteOperation: AmbientSoundDocument.Database2.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode AmbientSoundDocument.Implementation}, otherwise {@linkcode AmbientSoundDocument.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? AmbientSoundDocument.Implementation : AmbientSoundDocument.Stored;

  namespace Database {
    /** Options passed along in Get operations for AmbientSoundDocuments */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<AmbientSoundDocument.Parent> {}

    /** Options passed along in Create operations for AmbientSoundDocuments */
    interface Create<Temporary extends boolean | undefined = boolean | undefined> extends foundry.abstract.types
      .DatabaseCreateOperation<AmbientSoundDocument.CreateData, AmbientSoundDocument.Parent, Temporary> {}

    /** Options passed along in Delete operations for AmbientSoundDocuments */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<AmbientSoundDocument.Parent> {}

    /** Options passed along in Update operations for AmbientSoundDocuments */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<
      AmbientSoundDocument.UpdateData,
      AmbientSoundDocument.Parent
    > {}

    /** Operation for {@linkcode AmbientSoundDocument.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined> extends Document.Database
      .CreateDocumentsOperation<AmbientSoundDocument.Database.Create<Temporary>> {}

    /** Operation for {@linkcode AmbientSoundDocument.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database
      .UpdateDocumentsOperation<AmbientSoundDocument.Database.Update> {}

    /** Operation for {@linkcode AmbientSoundDocument.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database
      .DeleteDocumentsOperation<AmbientSoundDocument.Database.Delete> {}

    /** Operation for {@linkcode AmbientSoundDocument.create} */
    interface CreateOperation<Temporary extends boolean | undefined> extends Document.Database.CreateDocumentsOperation<
      AmbientSoundDocument.Database.Create<Temporary>
    > {}

    /** Operation for {@link AmbientSoundDocument.update | `AmbientSoundDocument#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode AmbientSoundDocument.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link AmbientSoundDocument._preCreate | `AmbientSoundDocument#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link AmbientSoundDocument._onCreate | `AmbientSoundDocument#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode AmbientSoundDocument._preCreateOperation} */
    interface PreCreateOperation extends Document.Database
      .PreCreateOperationStatic<AmbientSoundDocument.Database.Create> {}

    /** Operation for {@link AmbientSoundDocument._onCreateOperation | `AmbientSoundDocument#_onCreateOperation`} */
    interface OnCreateOperation extends AmbientSoundDocument.Database.Create {}

    /** Options for {@link AmbientSoundDocument._preUpdate | `AmbientSoundDocument#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link AmbientSoundDocument._onUpdate | `AmbientSoundDocument#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode AmbientSoundDocument._preUpdateOperation} */
    interface PreUpdateOperation extends AmbientSoundDocument.Database.Update {}

    /** Operation for {@link AmbientSoundDocument._onUpdateOperation | `AmbientSoundDocument._preUpdateOperation`} */
    interface OnUpdateOperation extends AmbientSoundDocument.Database.Update {}

    /** Options for {@link AmbientSoundDocument._preDelete | `AmbientSoundDocument#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link AmbientSoundDocument._onDelete | `AmbientSoundDocument#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link AmbientSoundDocument._preDeleteOperation | `AmbientSoundDocument#_preDeleteOperation`} */
    interface PreDeleteOperation extends AmbientSoundDocument.Database.Delete {}

    /** Options for {@link AmbientSoundDocument._onDeleteOperation | `AmbientSoundDocument#_onDeleteOperation`} */
    interface OnDeleteOperation extends AmbientSoundDocument.Database.Delete {}

    /** Context for {@linkcode AmbientSoundDocument._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<AmbientSoundDocument.Parent> {}

    /** Context for {@linkcode AmbientSoundDocument._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<AmbientSoundDocument.Parent> {}

    /** Context for {@linkcode AmbientSoundDocument._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<AmbientSoundDocument.Parent> {}

    /**
     * Options for {@link AmbientSoundDocument._preCreateDescendantDocuments | `AmbientSoundDocument#_preCreateDescendantDocuments`}
     * and {@link AmbientSoundDocument._onCreateDescendantDocuments | `AmbientSoundDocument#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<AmbientSoundDocument.Database.Create> {}

    /**
     * Options for {@link AmbientSoundDocument._preUpdateDescendantDocuments | `AmbientSoundDocument#_preUpdateDescendantDocuments`}
     * and {@link AmbientSoundDocument._onUpdateDescendantDocuments | `AmbientSoundDocument#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<AmbientSoundDocument.Database.Update> {}

    /**
     * Options for {@link AmbientSoundDocument._preDeleteDescendantDocuments | `AmbientSoundDocument#_preDeleteDescendantDocuments`}
     * and {@link AmbientSoundDocument._onDeleteDescendantDocuments | `AmbientSoundDocument#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<AmbientSoundDocument.Database.Delete> {}

    /**
     * Create options for {@linkcode AmbientSoundDocument.createDialog}.
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

  /** The interface {@linkcode AmbientSoundDocument.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode AmbientSoundDocument.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode AmbientSoundDocument.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode AmbientSoundDocument.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode AmbientSoundDocument.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>, Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode AmbientSoundDocument.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode AmbientSoundDocument.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends AmbientSoundDocument.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<AmbientSoundDocument.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode AmbientSoundDocument.deleteDialog | AmbientSoundDocument#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    AmbientSoundDocument.Stored,
    PassedConfig
  >;

  /* ***********************************************
   *        AMBIENT-SOUND-SPECIFIC TYPES           *
   *************************************************/

  interface Effect {
    type: keyof CONFIG["soundEffects"];

    /**
     * @defaultValue `5`
     * @remarks Can't be `null` as {@link BiquadFilterNode} and {@link ConvolverNode} constructors both only have parameter defaults
     */
    intensity?: number | undefined;
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
 * The client-side AmbientSound document which extends the common BaseAmbientSound document model.
 *
 * @see {@linkcode Scene}                   The Scene document type which contains AmbientSound documents
 * @see {@linkcode AmbientSoundConfig}      The AmbientSound configuration application
 */
declare class AmbientSoundDocument extends BaseAmbientSound.Internal.CanvasDocument {
  /**
   * @param data    - Initial data from which to construct the `AmbientSoundDocument`
   * @param context - Construction context options
   */
  constructor(
    // Note(LukeAbby): Optional as there are currently no required properties on `CreateData`.
    data?: AmbientSoundDocument.CreateData,
    context?: AmbientSoundDocument.ConstructionContext,
  );

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

  // Descendant Document operations have been left out because Wall does not have any descendant documents.

  static override defaultName(context?: AmbientSoundDocument.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends AmbientSoundDocument.CreateDialogOptions | undefined = undefined,
  >(
    data?: AmbientSoundDocument.CreateDialogData,
    createOptions?: AmbientSoundDocument.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<AmbientSoundDocument.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode AmbientSoundDocument.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends AmbientSoundDocument.CreateDialogOptions | undefined = undefined,
  >(
    data: AmbientSoundDocument.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: AmbientSoundDocument.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<AmbientSoundDocument.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: AmbientSoundDocument.Database2.DeleteOneDocumentOperation,
  ): Promise<AmbientSoundDocument.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: AmbientSoundDocument.Database2.DeleteOneDocumentOperation,
  ): Promise<AmbientSoundDocument.DeleteDialogReturn<Options>>;

  static override fromDropData(
    data: AmbientSoundDocument.DropData,
  ): Promise<AmbientSoundDocument.Implementation | undefined>;

  static override fromImport(
    source: AmbientSoundDocument.Source,
    context?: Document.FromImportContext<AmbientSoundDocument.Parent> | null,
  ): Promise<AmbientSoundDocument.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default AmbientSoundDocument;
