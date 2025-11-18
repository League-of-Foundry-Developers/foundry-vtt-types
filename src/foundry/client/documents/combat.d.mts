import type { ConfiguredCombat } from "#configuration";
import type { Identity, InexactPartial, MaybeArray, Merge, NullishProps } from "#utils";
import type { documents } from "#client/client.d.mts";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseCombat from "#common/documents/combat.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace Combat {
  /**
   * The document's name.
   */
  type Name = "Combat";

  /**
   * The context used to create a `Combat`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `Combat`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Combat` document instance configured through
   * {@linkcode CONFIG.Combat.documentClass} in Foundry and {@linkcode DocumentClassConfig} or
   * {@linkcode ConfiguredCombat | fvtt-types/configuration/ConfiguredCombat} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Combat` document configured through
   * {@linkcode CONFIG.Combat.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
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
        name: "Combat";
        collection: "combats";
        label: string;
        labelPlural: string;
        embedded: Metadata.Embedded;
        hasTypeData: true;
        permissions: Metadata.Permissions;
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    /**
     * The embedded metadata
     */
    interface Embedded {
      Combatant: "combatants";
      CombatantGroup: "groups";
    }

    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
    }
  }

  /**
   * Allowed subtypes of `Combat`. This is configured through various methods. Modern Foundry
   * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
   * under {@linkcode CONFIG.Combat.dataModels}. This corresponds to
   * fvtt-type's {@linkcode DataModelConfig}.
   *
   * Subtypes can also be registered through a `template.json` though this is discouraged.
   * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
   * {@linkcode DataConfig}.
   */
  type SubType = foundry.Game.Model.TypeNames<"Combat">;

  /**
   * `ConfiguredSubType` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubType = Document.ConfiguredSubTypeOf<"Combat">;

  /**
   * `Known` represents the types of `Combat` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubType} for more information.
   */
  type Known = Combat.OfType<Combat.ConfiguredSubType>;

  /**
   * `OfType` returns an instance of `Combat` with the corresponding type. This works with both the
   * builtin `Combat` class or a custom subclass if that is set up in
   * {@link ConfiguredCombat | `fvtt-types/configuration/ConfiguredCombat`}.
   */
  type OfType<Type extends SubType> = Document.Internal.DiscriminateSystem<Name, _OfType, Type, ConfiguredSubType>;

  /** @internal */
  interface _OfType
    extends Identity<{
      [Type in SubType]: Type extends unknown
        ? ConfiguredCombat<Type> extends { document: infer Document }
          ? Document
          : // eslint-disable-next-line @typescript-eslint/no-restricted-types
            Combat<Type>
        : never;
    }> {}

  /**
   * `SystemOfType` returns the system property for a specific `Combat` subtype.
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
  type Parent = null;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all instances, or never if the document doesn't have any descendants.
   */
  type DescendantName = "Combatant";

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendantName = "Combatant";

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendant = Combatant.Stored;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such classes, or never if the document doesn't have any descendants.
   */
  type DirectDescendantClass = Combatant.ImplementationClass;

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
  type Pack = never;

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
      Combat.Implementation,
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
   * This is a fixed string per document type and is primarily useful for the descendant Document operation methods, e.g
   * {@linkcode ClientDocumentMixin.AnyMixed._preCreateDescendantDocuments | ClientDocument._preCreateDescendantDocuments}.
   */
  type ParentCollectionName = Metadata["collection"];

  /**
   * The world collection that contains `Combat`s. Will be `never` if none exists.
   */
  type CollectionClass = foundry.documents.collections.CombatEncounters.ImplementationClass;

  /**
   * The world collection that contains `Combat`s. Will be `never` if none exists.
   */
  type Collection = foundry.documents.collections.CombatEncounters.Implementation;

  /**
   * An instance of `Combat` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `Combat` that comes from the database.
   */
  type Stored<SubType extends Combat.SubType = Combat.SubType> = Document.Internal.Stored<OfType<SubType>>;

  /**
   * The data put in {@linkcode Combat._source | Combat#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Combat.create}
   * and {@linkcode Combat | new Combat(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData<SubType extends Combat.SubType = Combat.SubType> extends fields.SchemaField.CreateData<Schema> {
    type?: SubType | null | undefined;
  }

  /**
   * Used in the {@linkcode Combat.create} and {@linkcode Combat.createDocuments} signatures, and
   * {@linkcode Combat.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode Combat.create}, returning (a single | an array of) (temporary | stored)
   * `Combat`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput> ? Array<Combat.TemporaryIf<Temporary>> : Combat.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode Combat.name | Combat#name}.
   *
   * This is data transformed from {@linkcode Combat.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode Combat.update | Combat#update}.
   * It is a distinct type from {@linkcode Combat.CreateData | DeepPartial<Combat.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode Combat.update | Combat#update} and
   * {@linkcode Combat.updateDocuments} signatures, and {@linkcode Combat.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode Combat}. This is the source of truth for how an Combat document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Combat}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Combat document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    type: fields.DocumentTypeField<typeof BaseCombat, { initial: typeof CONST.BASE_DOCUMENT_TYPE }>;

    system: fields.TypeDataField<typeof BaseCombat>;

    /**
     * The _id of a Scene within which this Combat occurs
     * @defaultValue `null`
     */
    scene: fields.ForeignDocumentField<typeof documents.BaseScene>;

    /**
     * A Collection of Documents that represent a grouping of individual Combatants
     * @defaultValue `[]`
     */
    groups: fields.EmbeddedCollectionField<typeof documents.BaseCombatantGroup, Combat.Implementation>;

    /**
     * A Collection of Combatant embedded Documents
     * @defaultValue `[]`
     */
    combatants: fields.EmbeddedCollectionField<typeof documents.BaseCombatant, Combat.Implementation>;

    /**
     * Is the Combat encounter currently active?
     * @defaultValue `false`
     */
    active: fields.BooleanField;

    /**
     * The current round of the Combat encounter
     * @defaultValue `0`
     */
    round: fields.NumberField<{
      required: true;
      nullable: false;
      integer: true;
      min: 0;
      initial: 0;
    }>;

    /**
     * The current turn in the Combat round
     * @defaultValue `null`
     */
    turn: fields.NumberField<{ required: true; integer: true; min: 0; initial: null }>;

    /**
     * The current sort order of this Combat relative to others in the same Scene
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

  namespace Database2 {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `Combat` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<Combat.Parent> {}

    /**
     * The interface for passing to {@linkcode Combat.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `Combat` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `Combat` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Combat.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends DatabaseBackend.CreateOperation<Combat.CreateInput, Combat.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode Combat.create} or {@linkcode Combat.createDocuments}.
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
     * @deprecated `Combat` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `Combat` documents. (see {@linkcode Combat.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `Combat` documents.
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
     * The interface passed to {@linkcode Combat._preCreate | Combat#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateCombat` hook}.
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
     * The interface passed to {@linkcode Combat._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode Combat._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Combat._onCreate | Combat#_onCreate} and
     * {@link Hooks.CreateDocument | the `createCombat` hook}.
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
     * The interface passed to {@linkcode Combat._onCreateOperation} and `Combat`-related collections'
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
     * interface for `Combat` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Combat.update | Combat#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<Combat.UpdateInput, Combat.Parent> {}

    /**
     * The interface for passing to {@linkcode Combat.update | Combat#update}.
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
     * @deprecated `Combat` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.updateEmbeddedDocuments | #updateEmbeddedDocuments} method of any Documents that
     * can contain `Combat` documents (see {@linkcode Combat.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Combat.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `Combat` documents.
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
     * The interface passed to {@linkcode Combat._preUpdate | Combat#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateCombat` hook}.
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
     * The interface passed to {@linkcode Combat._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode Combat._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Combat._onUpdate | Combat#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateCombat` hook}.
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
     * The interface passed to {@linkcode Combat._onUpdateOperation} and `Combat`-related collections'
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
     * interface for `Combat` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Combat.delete | Combat#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<Combat.Parent> {}

    /**
     * The interface for passing to {@linkcode Combat.delete | Combat#delete}.
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
     * @deprecated `Combat` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.deleteEmbeddedDocuments | #deleteEmbeddedDocuments} method of any Documents that
     * can contain `Combat` documents (see {@linkcode Combat.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Combat.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `Combat` documents.
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
     * The interface passed to {@linkcode Combat._preDelete | Combat#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteCombat` hook}.
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
     * The interface passed to {@linkcode Combat._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode Combat._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Combat._onDelete | Combat#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteCombat` hook}.
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
     * The interface passed to {@linkcode Combat._onDeleteOperation} and `Combat`-related collections'
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
        GetDocumentsOperation: Combat.Database2.GetDocumentsOperation;
        BackendGetOperation: Combat.Database2.BackendGetOperation;
        GetOperation: Combat.Database2.GetOperation;

        CreateDocumentsOperation: Combat.Database2.CreateDocumentsOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        CreateEmbeddedOperation: Combat.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: Combat.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: Combat.Database2.CreateOperation<Temporary>;
        PreCreateOptions: Combat.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: Combat.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: Combat.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: Combat.Database2.OnCreateOptions;
        OnCreateOperation: Combat.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: Combat.Database2.UpdateOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        UpdateEmbeddedOperation: Combat.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: Combat.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: Combat.Database2.BackendUpdateOperation;
        UpdateOperation: Combat.Database2.UpdateOperation;
        PreUpdateOptions: Combat.Database2.PreUpdateOptions;
        PreUpdateOperation: Combat.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: Combat.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: Combat.Database2.OnUpdateOptions;
        OnUpdateOperation: Combat.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: Combat.Database2.DeleteOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        DeleteEmbeddedOperation: Combat.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: Combat.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: Combat.Database2.BackendDeleteOperation;
        DeleteOperation: Combat.Database2.DeleteOperation;
        PreDeleteOptions: Combat.Database2.PreDeleteOptions;
        PreDeleteOperation: Combat.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: Combat.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: Combat.Database2.OnDeleteOptions;
        OnDeleteOperation: Combat.Database2.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode Combat.Implementation}, otherwise {@linkcode Combat.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? Combat.Implementation : Combat.Stored;

  namespace Database {
    /** Options passed along in Get operations for Combats */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<Combat.Parent> {}

    /** Options passed along in Create operations for Combats */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<Combat.CreateData, Combat.Parent, Temporary> {}

    /** Options passed along in Delete operations for Combats */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Combat.Parent> {}

    /** Options passed along in Update operations for Combats */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Combat.UpdateData, Combat.Parent> {
      direction: -1 | 1;
      worldTime: { delta: number };
      turnEvents: boolean;
    }

    /** Operation for {@linkcode Combat.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<Combat.Database.Create<Temporary>> {}

    /** Operation for {@linkcode Combat.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Combat.Database.Update> {}

    /** Operation for {@linkcode Combat.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Combat.Database.Delete> {}

    /** Operation for {@linkcode Combat.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<Combat.Database.Create<Temporary>> {}

    /** Operation for {@link Combat.update | `Combat#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode Combat.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link Combat._preCreate | `Combat#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link Combat._onCreate | `Combat#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode Combat._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Combat.Database.Create> {}

    /** Operation for {@link Combat._onCreateOperation | `Combat#_onCreateOperation`} */
    interface OnCreateOperation extends Combat.Database.Create {}

    /** Options for {@link Combat._preUpdate | `Combat#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link Combat._onUpdate | `Combat#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode Combat._preUpdateOperation} */
    interface PreUpdateOperation extends Combat.Database.Update {}

    /** Operation for {@link Combat._onUpdateOperation | `Combat._preUpdateOperation`} */
    interface OnUpdateOperation extends Combat.Database.Update {}

    /** Options for {@link Combat._preDelete | `Combat#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link Combat._onDelete | `Combat#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link Combat._preDeleteOperation | `Combat#_preDeleteOperation`} */
    interface PreDeleteOperation extends Combat.Database.Delete {}

    /** Options for {@link Combat._onDeleteOperation | `Combat#_onDeleteOperation`} */
    interface OnDeleteOperation extends Combat.Database.Delete {}

    /** Context for {@linkcode Combat._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<Combat.Parent> {}

    /** Context for {@linkcode Combat._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<Combat.Parent> {}

    /** Context for {@linkcode Combat._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<Combat.Parent> {}

    /**
     * Options for {@link Combat._preCreateDescendantDocuments | `Combat#_preCreateDescendantDocuments`}
     * and {@link Combat._onCreateDescendantDocuments | `Combat#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<Combat.Database.Create> {}

    /**
     * Options for {@link Combat._preUpdateDescendantDocuments | `Combat#_preUpdateDescendantDocuments`}
     * and {@link Combat._onUpdateDescendantDocuments | `Combat#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<Combat.Database.Update> {}

    /**
     * Options for {@link Combat._preDeleteDescendantDocuments | `Combat#_preDeleteDescendantDocuments`}
     * and {@link Combat._onDeleteDescendantDocuments | `Combat#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<Combat.Database.Delete> {}

    /**
     * Create options for {@linkcode Combat.createDialog}.
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

  /** The interface {@linkcode Combat.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode Combat.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode Combat.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode Combat.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode Combat.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>,
      Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode Combat.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode Combat.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends Combat.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<Combat.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode Combat.deleteDialog | Combat#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    Combat.Stored,
    PassedConfig
  >;

  type PreCreateDescendantDocumentsArgs = Document.Internal.PreCreateDescendantDocumentsArgs<
    Combat.Stored,
    Combat.DirectDescendantName,
    Combat.Metadata.Embedded
  >;

  type OnCreateDescendantDocumentsArgs = Document.Internal.OnCreateDescendantDocumentsArgs<
    Combat.Stored,
    Combat.DirectDescendantName,
    Combat.Metadata.Embedded
  >;

  type PreUpdateDescendantDocumentsArgs = Document.Internal.PreUpdateDescendantDocumentsArgs<
    Combat.Stored,
    Combat.DirectDescendantName,
    Combat.Metadata.Embedded
  >;

  type OnUpdateDescendantDocumentsArgs = Document.Internal.OnUpdateDescendantDocumentsArgs<
    Combat.Stored,
    Combat.DirectDescendantName,
    Combat.Metadata.Embedded
  >;

  type PreDeleteDescendantDocumentsArgs = Document.Internal.PreDeleteDescendantDocumentsArgs<
    Combat.Stored,
    Combat.DirectDescendantName,
    Combat.Metadata.Embedded
  >;

  type OnDeleteDescendantDocumentsArgs = Document.Internal.OnDeleteDescendantDocumentsArgs<
    Combat.Stored,
    Combat.DirectDescendantName,
    Combat.Metadata.Embedded
  >;

  /* ***********************************************
   *             COMBAT-SPECIFIC TYPES             *
   *************************************************/

  /** @internal */
  type _InitiativeOptions = NullishProps<{
    /**
     * A non-default initiative formula to roll. Otherwise the system default is used.
     * @defaultValue `null`
     */
    formula: string;

    /**
     * Update the Combat turn after adding new initiative scores to keep the turn on the same Combatant.
     * @defaultValue `true`
     */
    updateTurn: boolean;
  }> &
    InexactPartial<{
      /**
       * Additional options with which to customize created Chat Messages
       * @defaultValue `{}`
       * @remarks Can't be `null` as it only has a parameter default
       */
      messageOptions: ChatMessage.CreateData;
    }>;

  interface InitiativeOptions extends _InitiativeOptions {}

  interface HistoryData {
    round: number | null;
    turn: number | null;
    tokenId: string | null;
    combatantId: string | null;
  }

  interface TurnEventContext {
    round: number;
    turn: number;
    skipped: boolean;
  }

  interface RoundEventContext extends Omit<TurnEventContext, "turn"> {}

  type CONFIG_SETTING = "combatTrackerConfig";

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

  /**
   * @deprecated Replaced with {@linkcode Combat.ConfiguredSubType} (will be removed in v14).
   */
  type ConfiguredSubTypes = ConfiguredSubType;
}

/**
 * The client-side Combat document which extends the common BaseCombat model.
 *
 * @see {@linkcode Combats}                       The world-level collection of Combat documents
 * @see {@linkcode Combatant}                     The Combatant embedded document which exists within a Combat document
 * @see {@linkcode CombatConfig}                  The Combat configuration application
 */
declare class Combat<out SubType extends Combat.SubType = Combat.SubType> extends BaseCombat.Internal
  .ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `Combat`
   * @param context - Construction context options
   */
  // Note(LukeAbby): Optional as there are currently no required properties on `CreateData`.
  constructor(data?: Combat.CreateData<SubType>, context?: Combat.ConstructionContext);

  /** Track the sorted turn order of this combat encounter */
  turns: Combatant.Implementation[];

  /** Record the current round, turn, and tokenId to understand changes in the encounter state */
  current: Combat.HistoryData;

  /**
   * Track the previous round, turn, and tokenId to understand changes in the encounter state
   * @remarks Only `undefined` prior to first {@link Combat._onUpdate | `Combat#_onUpdate`} or {@link Combat.setupTurns | `Combat#setupTurns`} (which is called in
   * {@link Combat.prepareDerivedData | `Combat#prepareDerivedData`}) call
   */
  previous: Combat.HistoryData | undefined;

  /**
   * The configuration setting used to record Combat preferences
   * @defaultValue `"combatTrackerConfig"`
   * @privateRemarks Right now it doesn't make sense to make this not a literal, as `type CONFIG_SETTING` is static, so changing this would
   * just make {@link Combat.settings | `Combat#settings`} and {@linkcode CombatEncounters.settings} incorrect
   */
  // TODO: Make the setting name configurable?
  static CONFIG_SETTING: "combatTrackerConfig";

  /** Get the Combatant who has the current turn. */
  get combatant(): Combatant.Implementation | undefined | null;

  /**
   * Get the Combatant who has the next turn.
   */
  get nextCombatant(): Combatant.Implementation | undefined;

  /** Return the object of settings which modify the Combat Tracker behavior */
  // Type is copied here to avoid recursion issue
  // TODO: Make the setting name configurable?
  get settings(): foundry.helpers.ClientSettings.SettingInitializedType<"core", Combat.CONFIG_SETTING>;

  /** Has this combat encounter been started? */
  get started(): boolean;

  /** @remarks Foundry's implementation in {@linkcode Combat} always returns `true` */
  override get visible(): boolean;

  /** Is this combat active in the current scene? */
  get isActive(): boolean;

  /**
   * Is this Combat currently being viewed?
   */
  get isView(): boolean;

  /**
   * Set the current Combat encounter as active within the Scene.
   * Deactivate all other Combat encounters within the viewed Scene and set this one as active
   * @param options - Additional context to customize the update workflow
   */
  activate(options?: Combat.Database.UpdateOperation): Promise<Combat.Implementation[]>;

  /** @remarks Calls {@link Combat.setupTurns | `Combat#setupTurns`} if there is at least one Combatant and `this.turns` is empty */
  override prepareDerivedData(): void;

  /**
   * Get a Combatant using its Token id
   * @param token - A Token ID or a TokenDocument instance
   * @returns An array of Combatants which represent the Token.
   */
  getCombatantsByToken(token: string | TokenDocument.Implementation): Combatant.Implementation[];

  /**
   * Get a Combatant that represents the given Actor or Actor ID.
   * @param actorOrId - An Actor ID or an Actor instance.
   */
  getCombatantsByActor(actorOrId: string | Actor.Implementation): Combatant.Implementation[];

  /**
   * Calculate the time delta between two turns.
   * @param fromRound - The from-round
   * @param fromTurn  - The from-turn
   * @param toRound   - The to-round
   * @param toTurn    - The to-turn
   */
  getTimeDelta(fromRound: number, fromTurn: number | null, toRound: number, toTurn: number | null): number;

  /** Begin the combat encounter, advancing to round 1 and turn 1 */
  startCombat(): Promise<this>;

  /** Advance the combat to the next round */
  nextRound(): Promise<this>;

  /** Rewind the combat to the previous round */
  previousRound(): Promise<this>;

  /** Advance the combat to the next turn */
  nextTurn(): Promise<this>;

  /** Rewind the combat to the previous turn */
  previousTurn(): Promise<this>;

  /** Display a dialog querying the GM whether they wish to end the combat encounter and empty the tracker */
  endCombat(): Promise<this>;

  /** Toggle whether this combat is linked to the scene or globally available. */
  toggleSceneLink(): Promise<this>;

  /** Reset all combatant initiative scores, setting the turn back to zero */
  resetAll(): Promise<this | undefined>;

  /**
   * Roll initiative for one or multiple Combatants within the Combat document
   * @param ids     - A Combatant id or Array of ids for which to roll
   * @param options - Additional options which modify how initiative rolls are created or presented. (default: `{}`)
   * @returns A promise which resolves to the updated Combat document once updates are complete.
   */
  rollInitiative(ids: MaybeArray<string>, options?: Combat.InitiativeOptions): Promise<this>;

  /**
   * Roll initiative for all combatants which have not already rolled
   * @param options - Additional options forwarded to the Combat.rollInitiative method (default: `{}`)
   */
  rollAll(options?: Combat.InitiativeOptions): Promise<this>;

  /**
   * Roll initiative for all non-player actors who have not already rolled
   * @param options - Additional options forwarded to the Combat.rollInitiative method (default: `{}`)
   */
  rollNPC(options?: Combat.InitiativeOptions): Promise<this>;

  /**
   * Assign initiative for a single Combatant within the Combat encounter.
   * Update the Combat turn order to maintain the same combatant as the current turn.
   * @param id    - The combatant ID for which to set initiative
   * @param value - A specific initiative value to set
   */
  setInitiative(id: string, value: number): Promise<void>;

  /** Return the Array of combatants sorted into initiative order, breaking ties alphabetically by name. */
  setupTurns(): Combatant.Implementation[];

  /**
   * Debounce changes to the composition of the Combat encounter to de-duplicate multiple concurrent Combatant changes.
   * If this is the currently viewed encounter, re-render the CombatTracker application.
   */
  debounceSetup: () => void;

  /**
   * Update active effect durations for all actors present in this Combat encounter.
   */
  updateCombatantActors(): void;

  /**
   * Loads the registered Combat Theme (if any) and plays the requested type of sound.
   * If multiple exist for that type, one is chosen at random.
   * @param announcement - The announcement that should be played: "startEncounter", "nextUp", or "yourTurn".
   */
  protected _playCombatSound(announcement: CONST.COMBAT_ANNOUNCEMENTS): void;

  /**
   * Define how the array of Combatants is sorted in the displayed list of the tracker.
   * This method can be overridden by a system or module which needs to display combatants in an alternative order.
   * The default sorting rules sort in descending order of initiative using combatant IDs for tiebreakers.
   * @param  a - Some combatant
   * @param  b - Some other combatant
   */
  protected _sortCombatants(a: Combatant.Implementation, b: Combatant.Implementation): number;

  /**
   * Refresh the Token HUD under certain circumstances.
   * @param documents - A list of Combatant documents that were added or removed.
   */
  protected _refreshTokenHUD(documents: Combatant.Implementation[]): void;

  /**
   * Clear the movement history of all Tokens within this Combat.
   * or
   * Clear the movement history of the Combatants' Tokens.
   * @param combatants - The combatants whose movement history is cleared
   */
  clearMovementHistories(combatants?: Iterable<Combatant.Implementation>): Promise<void>;

  // _onCreate, _onUpdate, and _onDelete  are all overridden but with no signature changes from BaseCombat.

  protected override _onCreateDescendantDocuments(...args: Combat.OnCreateDescendantDocumentsArgs): void;

  protected override _onUpdateDescendantDocuments(...args: Combat.OnUpdateDescendantDocumentsArgs): void;

  protected override _onDeleteDescendantDocuments(...args: Combat.OnDeleteDescendantDocumentsArgs): void;

  /**
   * This workflow occurs after a Combatant is added to the Combat.
   * This can be overridden to implement system-specific combat tracking behaviors.
   * The default implementation of this function does nothing.
   * This method only executes for one designated GM user. If no GM users are present this method will not be called.
   * @param combatant - The Combatant that entered the Combat
   */
  protected _onEnter(combatant: Combatant.Implementation): Promise<void>;

  /**
   * This workflow occurs after a Combatant is removed from the Combat.
   * This can be overridden to implement system-specific combat tracking behaviors.
   * The default implementation of this function does nothing.
   * This method only executes for one designated GM user. If no GM users are present this method will not be called.
   * @param combatant - The Combatant that exited the Combat
   */
  protected _onExit(combatant: Combatant.Implementation): Promise<void>;

  /**
   * Called after {@link Combat#_onExit} and takes care of clearing the movement history of the
   * Combatant's Token.
   * This function is not called for Combatants that don't have a Token.
   * The default implementation clears the movement history always.
   * @param combatant - The Combatant that exited the Combat
   */
  protected _clearMovementHistoryOnExit(combatant: Combatant.Implementation): Promise<void>;

  /**
   * Get the current history state of the Combat encounter.
   * @param combatant - The new active combatant (default: `this.combatant`)
   */
  protected _getCurrentState(combatant?: Combatant.Implementation): Combat.HistoryData;

  /**
   * Update display of Token combat turn markers.
   */
  protected _updateTurnMarkers(): void;

  /**
   * Manage the execution of Combat lifecycle events.
   * This method orchestrates the execution of four events in the following order, as applicable:
   * 1. End Turn
   * 2. End Round
   * 3. Begin Round
   * 4. Begin Turn
   * Each lifecycle event is an async method, and each is awaited before proceeding.
   */
  protected _manageTurnEvents(): Promise<void>;

  /**
   * A workflow that occurs at the end of each Combat Turn.
   * This workflow occurs after the Combat document update.
   * This can be overridden to implement system-specific combat tracking behaviors.
   * The default implementation of this function does nothing.
   * This method only executes for one designated GM user. If no GM users are present this method will not be called.
   * @param combatant - The Combatant whose turn just ended
   * @param context   - The context of the turn tat just ended
   */
  protected _onEndTurn(combatant: Combatant.Implementation, context: Combat.TurnEventContext): Promise<void>;

  /**
   * A workflow that occurs at the end of each Combat Round.
   * This workflow occurs after the Combat document update.
   * This can be overridden to implement system-specific combat tracking behaviors.
   * The default implementation of this function does nothing.
   * This method only executes for one designated GM user. If no GM users are present this method will not be called.
   * @param context - The context of the round that just ended
   */
  protected _onEndRound(context: Combat.RoundEventContext): Promise<void>;

  /**
   * A workflow that occurs at the start of each Combat Round.
   * This workflow occurs after the Combat document update.
   * This can be overridden to implement system-specific combat tracking behaviors.
   * The default implementation of this function does nothing.
   * This method only executes for one designated GM user. If no GM users are present this method will not be called.
   * @param context - The context of the round that just started
   */
  protected _onStartRound(context: Combat.RoundEventContext): Promise<void>;

  /**
   * A workflow that occurs at the start of each Combat Turn.
   * This workflow occurs after the Combat document update.
   * This can be overridden to implement system-specific combat tracking behaviors.
   * The default implementation of this function does nothing.
   * This method only executes for one designated GM user. If no GM users are present this method will not be called.
   * @param combatant - The Combatant whose turn just started
   * @param context   - The context of the turn that just started
   */
  protected _onStartTurn(combatant: Combatant.Implementation, context: Combat.TurnEventContext): Promise<void>;

  /**
   * Called after {@link Combat#_onStartTurn} and takes care of clearing the movement history of the
   * Combatant's Token.
   * This function is not called for Combatants that don't have a Token.
   * The default implementation clears the movement history always.
   * @param combatant - The Combatant whose turn just started
   * @param context   - The context of the turn that just started
   */
  protected _clearMovementHistoryOnStartTurn(
    combatant: Combatant.Implementation,
    context: Combat.TurnEventContext,
  ): Promise<void>;

  /**
   * When Tokens are deleted, handle actions to update/delete Combatants of these Tokens.
   * @param tokens    - An array of Tokens which have been deleted
   * @param operation - The operation that deleted the Tokens
   * @param user      - The User that deleted the Tokens
   */
  protected static _onDeleteTokens(
    tokens: TokenDocument.Implementation[],
    operation: Combat.Database.DeleteOperation,
    user: User.Implementation,
  ): void;

  /**
   * @deprecated Since v12, no stated end
   * @remarks Foundry provides no deprecation warning; use {@link Combat.getCombatantsByActor | `Combat#getCombatantsByActor`} instead.
   */
  getCombatantByActor(actor: string | Actor.Implementation): Combatant.Implementation | null;

  /**
   * @deprecated Since v12, no stated end
   * @remarks Foundry provides no deprecation warning; use {@link Combat.getCombatantsByActor | `Combat#getCombatantsByActor`} instead.
   */
  getCombatantByToken(token: string | Token.Implementation): Combatant.Implementation | null;

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

  protected override _preCreateDescendantDocuments(...args: Combat.PreCreateDescendantDocumentsArgs): void;

  protected override _preUpdateDescendantDocuments(...args: Combat.PreUpdateDescendantDocumentsArgs): void;

  protected override _preDeleteDescendantDocuments(...args: Combat.PreDeleteDescendantDocumentsArgs): void;

  static override defaultName(context?: Combat.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends Combat.CreateDialogOptions | undefined = undefined,
  >(
    data?: Combat.CreateDialogData,
    createOptions?: Combat.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<Combat.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode Combat.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends Combat.CreateDialogOptions | undefined = undefined,
  >(
    data: Combat.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: Combat.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<Combat.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: Combat.Database2.DeleteOneDocumentOperation,
  ): Promise<Combat.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: Combat.Database2.DeleteOneDocumentOperation,
  ): Promise<Combat.DeleteDialogReturn<Options>>;

  static override fromDropData(data: Combat.DropData): Promise<Combat.Implementation | undefined>;

  static override fromImport(
    source: Combat.Source,
    context?: Document.FromImportContext<Combat.Parent> | null,
  ): Promise<Combat.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  #Combat: true;
}

export default Combat;
