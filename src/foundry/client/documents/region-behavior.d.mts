import type { ConfiguredRegionBehavior } from "#configuration";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type BaseRegionBehavior from "#common/documents/region-behavior.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { Identity, InexactPartial, MaybeArray, Merge } from "#utils";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace RegionBehavior {
  /**
   * The document's name.
   */
  type Name = "RegionBehavior";

  /**
   * The context used to create a `RegionBehavior`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `RegionBehavior`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `RegionBehavior` document instance configured through
   * {@linkcode CONFIG.RegionBehavior.documentClass} in Foundry and {@linkcode DocumentClassConfig} or
   * {@linkcode ConfiguredRegionBehavior | fvtt-types/configuration/ConfiguredRegionBehavior} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `RegionBehavior` document configured through
   * {@linkcode CONFIG.RegionBehavior.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "RegionBehavior";
      collection: "behaviors";
      label: string;
      labelPlural: string;
      coreTypes: [
        "adjustDarknessLevel",
        "displayScrollingText",
        "executeMacro",
        "executeScript",
        "modifyMovementCost",
        "pauseGame",
        "suppressWeather",
        "teleportToken",
        "toggleBehavior",
      ];
      hasTypeData: true;
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
      update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
    }
  }

  /**
   * Allowed subtypes of `RegionBehavior`. This is configured through various methods. Modern Foundry
   * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
   * under {@linkcode CONFIG.RegionBehavior.dataModels}. This corresponds to
   * fvtt-type's {@linkcode DataModelConfig}.
   *
   * Subtypes can also be registered through a `template.json` though this is discouraged.
   * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
   * {@linkcode DataConfig}.
   */
  type SubType = foundry.Game.Model.TypeNames<"RegionBehavior">;

  /**
   * `ConfiguredSubType` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubType = Document.ConfiguredSubTypeOf<"RegionBehavior">;

  /**
   * `Known` represents the types of `RegionBehavior` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubType} for more information.
   */
  type Known = RegionBehavior.OfType<RegionBehavior.ConfiguredSubType>;

  /**
   * `OfType` returns an instance of `RegionBehavior` with the corresponding type. This works with both the
   * builtin `RegionBehavior` class or a custom subclass if that is set up in
   * {@link ConfiguredRegionBehavior | `fvtt-types/configuration/ConfiguredRegionBehavior`}.
   */
  type OfType<Type extends SubType> = Document.Internal.DiscriminateSystem<Name, _OfType, Type, ConfiguredSubType>;

  /** @internal */
  interface _OfType extends Identity<{
    [Type in SubType]: Type extends unknown
      ? ConfiguredRegionBehavior<Type> extends { document: infer Document }
        ? Document
        : // eslint-disable-next-line @typescript-eslint/no-restricted-types
          RegionBehavior<Type>
      : never;
  }> {}

  /**
   * `SystemOfType` returns the system property for a specific `RegionBehavior` subtype.
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
   * For example an `RegionBehavior` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = RegionDocument.Implementation | null;

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
   * An instance of `RegionBehavior` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `RegionBehavior` that comes from the database.
   */
  type Stored<SubType extends RegionBehavior.SubType = RegionBehavior.SubType> = Document.Internal.Stored<
    OfType<SubType>
  >;

  /**
   * The data put in {@linkcode RegionBehavior._source | RegionBehavior#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode RegionBehavior.create}
   * and {@linkcode RegionBehavior | new RegionBehavior(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData<SubType extends RegionBehavior.SubType = RegionBehavior.SubType> extends fields.SchemaField
    .CreateData<Schema> {
    type: SubType;
  }

  /**
   * Used in the {@linkcode RegionBehavior.create} and {@linkcode RegionBehavior.createDocuments} signatures, and
   * {@linkcode RegionBehavior.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode RegionBehavior.create}, returning (a single | an array of) (temporary | stored)
   * `RegionBehavior`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<RegionBehavior.TemporaryIf<Temporary>>
      : RegionBehavior.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode RegionBehavior.name | RegionBehavior#name}.
   *
   * This is data transformed from {@linkcode RegionBehavior.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode RegionBehavior.update | RegionBehavior#update}.
   * It is a distinct type from {@linkcode RegionBehavior.CreateData | DeepPartial<RegionBehavior.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode RegionBehavior.update | RegionBehavior#update} and
   * {@linkcode RegionBehavior.updateDocuments} signatures, and {@linkcode RegionBehavior.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode RegionBehavior}. This is the source of truth for how an RegionBehavior document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode RegionBehavior}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this RegionBehavior document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name used to describe the RegionBehavior
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; blank: true; textSearch: true }>;

    /**
     * An RegionBehavior subtype which configures the system data model applied
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    type: fields.DocumentTypeField<typeof BaseRegionBehavior, {}>;

    /**
     * Data for a RegionBehavior subtype, defined by a System or Module
     */
    system: fields.TypeDataField<typeof BaseRegionBehavior>;

    /**
     * Is the RegionBehavior currently disabled?
     * @defaultValue `false`
     */
    disabled: fields.BooleanField;

    /**
     * An object of optional key/value flags
     */
    flags: fields.DocumentFlagsField<Name>;

    /**
     * An object of creation and access information
     * @defaultValue see {@linkcode fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }

  namespace Database2 {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `RegionBehavior` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<RegionBehavior.Parent> {}

    /**
     * The interface for passing to {@linkcode RegionBehavior.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `RegionBehavior` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `RegionBehavior` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode RegionBehavior.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<
      Temporary extends boolean | undefined = boolean | undefined,
    > extends DatabaseBackend.CreateOperation<RegionBehavior.CreateInput, RegionBehavior.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode RegionBehavior.create} or {@linkcode RegionBehavior.createDocuments}.
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
     * can contain `RegionBehavior` documents. (see {@linkcode RegionBehavior.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `RegionBehavior` documents.
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
     * The interface passed to {@linkcode RegionBehavior._preCreate | RegionBehavior#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateRegionBehavior` hook}.
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
     * The interface passed to {@linkcode RegionBehavior._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode RegionBehavior._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode RegionBehavior._onCreate | RegionBehavior#_onCreate} and
     * {@link Hooks.CreateDocument | the `createRegionBehavior` hook}.
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
     * The interface passed to {@linkcode RegionBehavior._onCreateOperation} and `RegionBehavior`-related collections'
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
     * interface for `RegionBehavior` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode RegionBehavior.update | RegionBehavior#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<
      RegionBehavior.UpdateInput,
      RegionBehavior.Parent
    > {}

    /**
     * The interface for passing to {@linkcode RegionBehavior.update | RegionBehavior#update}.
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
     * can contain `RegionBehavior` documents (see {@linkcode RegionBehavior.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode RegionBehavior.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `RegionBehavior` documents.
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
     * The interface passed to {@linkcode RegionBehavior._preUpdate | RegionBehavior#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateRegionBehavior` hook}.
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
     * The interface passed to {@linkcode RegionBehavior._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode RegionBehavior._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode RegionBehavior._onUpdate | RegionBehavior#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateRegionBehavior` hook}.
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
     * The interface passed to {@linkcode RegionBehavior._onUpdateOperation} and `RegionBehavior`-related collections'
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
     * interface for `RegionBehavior` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode RegionBehavior.delete | RegionBehavior#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<RegionBehavior.Parent> {}

    /**
     * The interface for passing to {@linkcode RegionBehavior.delete | RegionBehavior#delete}.
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
     * can contain `RegionBehavior` documents (see {@linkcode RegionBehavior.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode RegionBehavior.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `RegionBehavior` documents.
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
     * The interface passed to {@linkcode RegionBehavior._preDelete | RegionBehavior#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteRegionBehavior` hook}.
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
     * The interface passed to {@linkcode RegionBehavior._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode RegionBehavior._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode RegionBehavior._onDelete | RegionBehavior#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteRegionBehavior` hook}.
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
     * The interface passed to {@linkcode RegionBehavior._onDeleteOperation} and `RegionBehavior`-related collections'
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
        GetDocumentsOperation: RegionBehavior.Database2.GetDocumentsOperation;
        BackendGetOperation: RegionBehavior.Database2.BackendGetOperation;
        GetOperation: RegionBehavior.Database2.GetOperation;

        CreateDocumentsOperation: RegionBehavior.Database2.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: RegionBehavior.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: RegionBehavior.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: RegionBehavior.Database2.CreateOperation<Temporary>;
        PreCreateOptions: RegionBehavior.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: RegionBehavior.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: RegionBehavior.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: RegionBehavior.Database2.OnCreateOptions;
        OnCreateOperation: RegionBehavior.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: RegionBehavior.Database2.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: RegionBehavior.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: RegionBehavior.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: RegionBehavior.Database2.BackendUpdateOperation;
        UpdateOperation: RegionBehavior.Database2.UpdateOperation;
        PreUpdateOptions: RegionBehavior.Database2.PreUpdateOptions;
        PreUpdateOperation: RegionBehavior.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: RegionBehavior.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: RegionBehavior.Database2.OnUpdateOptions;
        OnUpdateOperation: RegionBehavior.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: RegionBehavior.Database2.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: RegionBehavior.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: RegionBehavior.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: RegionBehavior.Database2.BackendDeleteOperation;
        DeleteOperation: RegionBehavior.Database2.DeleteOperation;
        PreDeleteOptions: RegionBehavior.Database2.PreDeleteOptions;
        PreDeleteOperation: RegionBehavior.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: RegionBehavior.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: RegionBehavior.Database2.OnDeleteOptions;
        OnDeleteOperation: RegionBehavior.Database2.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode RegionBehavior.Implementation}, otherwise {@linkcode RegionBehavior.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? RegionBehavior.Implementation : RegionBehavior.Stored;

  namespace Database {
    /** Options passed along in Get operations for RegionBehaviors */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<RegionBehavior.Parent> {}

    /** Options passed along in Create operations for RegionBehaviors */
    interface Create<Temporary extends boolean | undefined = boolean | undefined> extends foundry.abstract.types
      .DatabaseCreateOperation<RegionBehavior.CreateData, RegionBehavior.Parent, Temporary> {}

    /** Options passed along in Delete operations for RegionBehaviors */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<RegionBehavior.Parent> {}

    /** Options passed along in Update operations for RegionBehaviors */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<
      RegionBehavior.UpdateData,
      RegionBehavior.Parent
    > {}

    /** Operation for {@linkcode RegionBehavior.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined> extends Document.Database
      .CreateDocumentsOperation<RegionBehavior.Database.Create<Temporary>> {}

    /** Operation for {@linkcode RegionBehavior.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database
      .UpdateDocumentsOperation<RegionBehavior.Database.Update> {}

    /** Operation for {@linkcode RegionBehavior.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database
      .DeleteDocumentsOperation<RegionBehavior.Database.Delete> {}

    /** Operation for {@linkcode RegionBehavior.create} */
    interface CreateOperation<Temporary extends boolean | undefined> extends Document.Database.CreateDocumentsOperation<
      RegionBehavior.Database.Create<Temporary>
    > {}

    /** Operation for {@link RegionBehavior.update | `RegionBehavior#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode RegionBehavior.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link RegionBehavior._preCreate | `RegionBehavior#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link RegionBehavior._onCreate | `RegionBehavior#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode RegionBehavior._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<RegionBehavior.Database.Create> {}

    /** Operation for {@link RegionBehavior._onCreateOperation | `RegionBehavior#_onCreateOperation`} */
    interface OnCreateOperation extends RegionBehavior.Database.Create {}

    /** Options for {@link RegionBehavior._preUpdate | `RegionBehavior#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link RegionBehavior._onUpdate | `RegionBehavior#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode RegionBehavior._preUpdateOperation} */
    interface PreUpdateOperation extends RegionBehavior.Database.Update {}

    /** Operation for {@link RegionBehavior._onUpdateOperation | `RegionBehavior._preUpdateOperation`} */
    interface OnUpdateOperation extends RegionBehavior.Database.Update {}

    /** Options for {@link RegionBehavior._preDelete | `RegionBehavior#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link RegionBehavior._onDelete | `RegionBehavior#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link RegionBehavior._preDeleteOperation | `RegionBehavior#_preDeleteOperation`} */
    interface PreDeleteOperation extends RegionBehavior.Database.Delete {}

    /** Options for {@link RegionBehavior._onDeleteOperation | `RegionBehavior#_onDeleteOperation`} */
    interface OnDeleteOperation extends RegionBehavior.Database.Delete {}

    /** Context for {@linkcode RegionBehavior._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<RegionBehavior.Parent> {}

    /** Context for {@linkcode RegionBehavior._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<RegionBehavior.Parent> {}

    /** Context for {@linkcode RegionBehavior._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<RegionBehavior.Parent> {}

    /**
     * Options for {@link RegionBehavior._preCreateDescendantDocuments | `RegionBehavior#_preCreateDescendantDocuments`}
     * and {@link RegionBehavior._onCreateDescendantDocuments | `RegionBehavior#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<RegionBehavior.Database.Create> {}

    /**
     * Options for {@link RegionBehavior._preUpdateDescendantDocuments | `RegionBehavior#_preUpdateDescendantDocuments`}
     * and {@link RegionBehavior._onUpdateDescendantDocuments | `RegionBehavior#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<RegionBehavior.Database.Update> {}

    /**
     * Options for {@link RegionBehavior._preDeleteDescendantDocuments | `RegionBehavior#_preDeleteDescendantDocuments`}
     * and {@link RegionBehavior._onDeleteDescendantDocuments | `RegionBehavior#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<RegionBehavior.Database.Delete> {}

    /**
     * Create options for {@linkcode RegionBehavior.createDialog}.
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

  /** The interface {@linkcode RegionBehavior.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode RegionBehavior.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode RegionBehavior.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode RegionBehavior.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode RegionBehavior.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>, Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode RegionBehavior.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode RegionBehavior.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends RegionBehavior.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<RegionBehavior.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode RegionBehavior.deleteDialog | RegionBehavior#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    RegionBehavior.Stored,
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

  /**
   * @deprecated Replaced with {@linkcode RegionBehavior.ConfiguredSubType} (will be removed in v14).
   */
  type ConfiguredSubTypes = ConfiguredSubType;
}

/**
 * The client-side RegionBehavior document which extends the common BaseRegionBehavior model.
 */
declare class RegionBehavior<
  out SubType extends RegionBehavior.SubType = RegionBehavior.SubType,
> extends BaseRegionBehavior.Internal.ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `RegionBehavior`
   * @param context - Construction context options
   */
  constructor(data: RegionBehavior.CreateData<SubType>, context?: RegionBehavior.ConstructionContext);

  /** A convenience reference to the RegionDocument which contains this RegionBehavior. */
  get region(): RegionDocument.Implementation | null;

  /** A convenience reference to the Scene which contains this RegionBehavior. */
  get scene(): Scene.Implementation | null;

  /** A RegionBehavior is active if and only if it was created, hasn't been deleted yet, and isn't disabled. */
  get active(): boolean;

  /** A RegionBehavior is viewed if and only if it is active and the Scene of its Region is viewed. */
  get viewed(): boolean;

  override prepareBaseData(): void;

  /**
   * Does this RegionBehavior handle the Region events with the given name?
   * @param eventName - The Region event name
   */
  hasEvent(eventName: string): boolean;

  /**
   * Handle the Region Event.
   * @param event - The Region event
   * @internal
   */
  protected _handleRegionEvent(event: RegionDocument.RegionEvent): void;

  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends RegionBehavior.CreateDialogOptions | undefined = undefined,
  >(
    data?: RegionBehavior.CreateDialogData,
    createOptions?: RegionBehavior.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<RegionBehavior.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode RegionBehavior.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends RegionBehavior.CreateDialogOptions | undefined = undefined,
  >(
    data: RegionBehavior.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: RegionBehavior.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<RegionBehavior.CreateDialogReturn<Temporary, Options>>;

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

  // Descendant Document operations have been left out because RegionBehavior does not have any descendant documents.

  static override defaultName(context: RegionBehavior.DefaultNameContext): string;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: RegionBehavior.Database2.DeleteOneDocumentOperation,
  ): Promise<RegionBehavior.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: RegionBehavior.Database2.DeleteOneDocumentOperation,
  ): Promise<RegionBehavior.DeleteDialogReturn<Options>>;

  static override fromDropData(data: RegionBehavior.DropData): Promise<RegionBehavior.Implementation | undefined>;

  static override fromImport(
    source: RegionBehavior.Source,
    context?: Document.FromImportContext<RegionBehavior.Parent> | null,
  ): Promise<RegionBehavior.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  // Embedded document operations have been left out because RegionBehavior does not have any embedded documents.
}

export default RegionBehavior;
