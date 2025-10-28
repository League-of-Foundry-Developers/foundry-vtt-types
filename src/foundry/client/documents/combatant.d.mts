import type { ConfiguredCombatant } from "#configuration";
import type { Identity, InexactPartial, MaybeArray, Merge } from "#utils";
import type { documents } from "#client/client.d.mts";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseCombatant from "#common/documents/combatant.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import fields = foundry.data.fields;

declare namespace Combatant {
  /**
   * The document's name.
   */
  type Name = "Combatant";

  /**
   * The context used to create a `Combatant`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `Combatant`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Combatant` document instance configured through
   * {@linkcode CONFIG.Combatant.documentClass} in Foundry and {@linkcode DocumentClassConfig} or
   * {@linkcode ConfiguredCombatant | fvtt-types/configuration/ConfiguredCombatant} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Combatant` document configured through
   * {@linkcode CONFIG.Combatant.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
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
        name: "Combatant";
        collection: "combatants";
        label: string;
        labelPlural: string;
        isEmbedded: true;
        hasTypeData: true;
        schemaVersion: string;
        permissions: Metadata.Permissions;
      }>
    > {}

  namespace Metadata {
    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create: "OWNER";
      update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
      delete: "OWNER";
    }
  }

  /**
   * Allowed subtypes of `Combatant`. This is configured through various methods. Modern Foundry
   * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
   * under {@linkcode CONFIG.Combatant.dataModels}. This corresponds to
   * fvtt-type's {@linkcode DataModelConfig}.
   *
   * Subtypes can also be registered through a `template.json` though this is discouraged.
   * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
   * {@linkcode DataConfig}.
   */
  type SubType = foundry.Game.Model.TypeNames<"Combatant">;

  /**
   * `ConfiguredSubType` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubType = Document.ConfiguredSubTypeOf<"Combatant">;

  /**
   * `Known` represents the types of `Combatant` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubType} for more information.
   */
  type Known = Combatant.OfType<Combatant.ConfiguredSubType>;

  /**
   * `OfType` returns an instance of `Combatant` with the corresponding type. This works with both the
   * builtin `Combatant` class or a custom subclass if that is set up in
   * {@link ConfiguredCombatant | `fvtt-types/configuration/ConfiguredCombatant`}.
   */
  type OfType<Type extends SubType> = Document.Internal.DiscriminateSystem<Name, _OfType, Type, ConfiguredSubType>;

  /** @internal */
  interface _OfType
    extends Identity<{
      [Type in SubType]: Type extends unknown
        ? ConfiguredCombatant<Type> extends { document: infer Document }
          ? Document
          : // eslint-disable-next-line @typescript-eslint/no-restricted-types
            Combatant<Type>
        : never;
    }> {}

  /**
   * `SystemOfType` returns the system property for a specific `Combatant` subtype.
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
   *
   * `Combatant` requires a parent so `null` is not an option here.
   */
  type Parent = Combat.Implementation;

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
   * An instance of `Combatant` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `Combatant` that comes from the database.
   */
  type Stored<SubType extends Combatant.SubType = Combatant.SubType> = Document.Internal.Stored<OfType<SubType>>;

  /**
   * The data put in {@linkcode Combatant._source | Combatant#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Combatant.create}
   * and {@linkcode Combatant | new Combatant(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * Used in the {@linkcode Combatant.create} and {@linkcode Combatant.createDocuments} signatures, and
   * {@linkcode Combatant.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode Combatant.create}, returning (a single | an array of) (temporary | stored)
   * `Combatant`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput>
      ? Array<Combatant.TemporaryIf<Temporary>>
      : Combatant.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode Combatant.name | Combatant#name}.
   *
   * This is data transformed from {@linkcode Combatant.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode Combatant.update | Combatant#update}.
   * It is a distinct type from {@linkcode Combatant.CreateData | DeepPartial<Combatant.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode Combatant.update | Combatant#update} and
   * {@linkcode Combatant.updateDocuments} signatures, and {@linkcode Combatant.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode Combatant}. This is the source of truth for how an Combatant document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Combatant}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Combatant embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** @defaultValue `"base"` */
    type: fields.DocumentTypeField<typeof BaseCombatant, { initial: typeof foundry.CONST.BASE_DOCUMENT_TYPE }>;

    system: fields.TypeDataField<typeof BaseCombatant>;

    /**
     * The _id of an Actor associated with this Combatant
     * @defaultValue `null`
     */
    actorId: fields.ForeignDocumentField<typeof documents.BaseActor, { label: "COMBAT.CombatantActor"; idOnly: true }>;

    /**
     * The _id of a Token associated with this Combatant
     * @defaultValue `null`
     */
    tokenId: fields.ForeignDocumentField<typeof documents.BaseToken, { label: "COMBAT.CombatantToken"; idOnly: true }>;

    /**
     * @defaultValue `null`
     */
    sceneId: fields.ForeignDocumentField<typeof documents.BaseScene, { label: "COMBAT.CombatantScene"; idOnly: true }>;

    /**
     * A customized name which replaces the name of the Token in the tracker
     * @defaultValue `undefined`
     */
    name: fields.StringField<{ label: "COMBAT.CombatantName"; textSearch: true }>;

    /**
     * A customized image which replaces the Token image in the tracker
     * @defaultValue `null`
     */
    img: fields.FilePathField<{ categories: ["IMAGE"]; label: "COMBAT.CombatantImage" }>;

    /**
     * The initiative score for the Combatant which determines its turn order
     */
    initiative: fields.NumberField<{ required: true; label: "COMBAT.CombatantInitiative" }>;

    /**
     * Is this Combatant currently hidden?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField<{ label: "COMBAT.CombatantHidden" }>;

    /**
     * Has this Combatant been defeated?
     * @defaultValue `false`
     */
    defeated: fields.BooleanField<{ label: "COMBAT.CombatantDefeated" }>;

    /**
     * An optional group this Combatant belongs to.
     * @defaultValue `null`
     */
    group: fields.DocumentIdField<{ readonly: false }>;

    /**
     * An object of optional key/value flags
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
     * `Combatant` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<Combatant.Parent> {}

    /**
     * The interface for passing to {@linkcode Combatant.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `Combatant` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `Combatant` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Combatant.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends DatabaseBackend.CreateOperation<Combatant.CreateInput, Combatant.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode Combatant.create} or {@linkcode Combatant.createDocuments}.
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
     * can contain `Combatant` documents. (see {@linkcode Combatant.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `Combatant` documents.
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
     * The interface passed to {@linkcode Combatant._preCreate | Combatant#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateCombatant` hook}.
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
     * The interface passed to {@linkcode Combatant._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode Combatant._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Combatant._onCreate | Combatant#_onCreate} and
     * {@link Hooks.CreateDocument | the `createCombatant` hook}.
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
     * The interface passed to {@linkcode Combatant._onCreateOperation} and `Combatant`-related collections'
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
     * interface for `Combatant` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Combatant.update | Combatant#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<Combatant.UpdateInput, Combatant.Parent> {}

    /**
     * The interface for passing to {@linkcode Combatant.update | Combatant#update}.
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
     * can contain `Combatant` documents (see {@linkcode Combatant.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Combatant.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `Combatant` documents.
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
     * The interface passed to {@linkcode Combatant._preUpdate | Combatant#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateCombatant` hook}.
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
     * The interface passed to {@linkcode Combatant._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode Combatant._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Combatant._onUpdate | Combatant#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateCombatant` hook}.
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
     * The interface passed to {@linkcode Combatant._onUpdateOperation} and `Combatant`-related collections'
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
     * interface for `Combatant` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Combatant.delete | Combatant#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<Combatant.Parent> {}

    /**
     * The interface for passing to {@linkcode Combatant.delete | Combatant#delete}.
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
     * can contain `Combatant` documents (see {@linkcode Combatant.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Combatant.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `Combatant` documents.
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
     * The interface passed to {@linkcode Combatant._preDelete | Combatant#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteCombatant` hook}.
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
     * The interface passed to {@linkcode Combatant._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode Combatant._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Combatant._onDelete | Combatant#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteCombatant` hook}.
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
     * The interface passed to {@linkcode Combatant._onDeleteOperation} and `Combatant`-related collections'
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
        GetDocumentsOperation: Combatant.Database2.GetDocumentsOperation;
        BackendGetOperation: Combatant.Database2.BackendGetOperation;
        GetOperation: Combatant.Database2.GetOperation;

        CreateDocumentsOperation: Combatant.Database2.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: Combatant.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: Combatant.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: Combatant.Database2.CreateOperation<Temporary>;
        PreCreateOptions: Combatant.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: Combatant.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: Combatant.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: Combatant.Database2.OnCreateOptions;
        OnCreateOperation: Combatant.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: Combatant.Database2.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: Combatant.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: Combatant.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: Combatant.Database2.BackendUpdateOperation;
        UpdateOperation: Combatant.Database2.UpdateOperation;
        PreUpdateOptions: Combatant.Database2.PreUpdateOptions;
        PreUpdateOperation: Combatant.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: Combatant.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: Combatant.Database2.OnUpdateOptions;
        OnUpdateOperation: Combatant.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: Combatant.Database2.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: Combatant.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: Combatant.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: Combatant.Database2.BackendDeleteOperation;
        DeleteOperation: Combatant.Database2.DeleteOperation;
        PreDeleteOptions: Combatant.Database2.PreDeleteOptions;
        PreDeleteOperation: Combatant.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: Combatant.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: Combatant.Database2.OnDeleteOptions;
        OnDeleteOperation: Combatant.Database2.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode Combatant.Implementation}, otherwise {@linkcode Combatant.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? Combatant.Implementation : Combatant.Stored;

  namespace Database {
    /** Options passed along in Get operations for Combatants */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<Combatant.Parent> {}

    /** Options passed along in Create operations for Combatants */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<Combatant.CreateData, Combatant.Parent, Temporary> {
      combatTurn?: number;
      turnEvents?: boolean;
    }

    /** Options passed along in Delete operations for Combatants */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Combatant.Parent> {
      combatTurn?: number;
      turnEvents?: boolean;
    }

    /** Options passed along in Update operations for Combatants */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Combatant.UpdateData, Combatant.Parent> {
      combatTurn?: number;
      turnEvents?: boolean;
    }

    /** Operation for {@linkcode Combatant.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<Combatant.Database.Create<Temporary>> {}

    /** Operation for {@linkcode Combatant.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Combatant.Database.Update> {}

    /** Operation for {@linkcode Combatant.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Combatant.Database.Delete> {}

    /** Operation for {@linkcode Combatant.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<Combatant.Database.Create<Temporary>> {}

    /** Operation for {@link Combatant.update | `Combatant#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode Combatant.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link Combatant._preCreate | `Combatant#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link Combatant._onCreate | `Combatant#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode Combatant._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Combatant.Database.Create> {}

    /** Operation for {@link Combatant._onCreateOperation | `Combatant#_onCreateOperation`} */
    interface OnCreateOperation extends Combatant.Database.Create {}

    /** Options for {@link Combatant._preUpdate | `Combatant#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link Combatant._onUpdate | `Combatant#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode Combatant._preUpdateOperation} */
    interface PreUpdateOperation extends Combatant.Database.Update {}

    /** Operation for {@link Combatant._onUpdateOperation | `Combatant._preUpdateOperation`} */
    interface OnUpdateOperation extends Combatant.Database.Update {}

    /** Options for {@link Combatant._preDelete | `Combatant#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link Combatant._onDelete | `Combatant#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link Combatant._preDeleteOperation | `Combatant#_preDeleteOperation`} */
    interface PreDeleteOperation extends Combatant.Database.Delete {}

    /** Options for {@link Combatant._onDeleteOperation | `Combatant#_onDeleteOperation`} */
    interface OnDeleteOperation extends Combatant.Database.Delete {}

    /** Context for {@linkcode Combatant._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<Combatant.Parent> {}

    /** Context for {@linkcode Combatant._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<Combatant.Parent> {}

    /** Context for {@linkcode Combatant._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<Combatant.Parent> {}

    /**
     * Options for {@link Combatant._preCreateDescendantDocuments | `Combatant#_preCreateDescendantDocuments`}
     * and {@link Combatant._onCreateDescendantDocuments | `Combatant#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<Combatant.Database.Create> {}

    /**
     * Options for {@link Combatant._preUpdateDescendantDocuments | `Combatant#_preUpdateDescendantDocuments`}
     * and {@link Combatant._onUpdateDescendantDocuments | `Combatant#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<Combatant.Database.Update> {}

    /**
     * Options for {@link Combatant._preDeleteDescendantDocuments | `Combatant#_preDeleteDescendantDocuments`}
     * and {@link Combatant._onDeleteDescendantDocuments | `Combatant#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<Combatant.Database.Delete> {}

    /**
     * Create options for {@linkcode Combatant.createDialog}.
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

  /** The interface {@linkcode Combatant.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode Combatant.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode Combatant.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode Combatant.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode Combatant.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>,
      Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode Combatant.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode Combatant.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends Combatant.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<Combatant.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode Combatant.deleteDialog | Combatant#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    Combatant.Stored,
    PassedConfig
  >;

  /* ***********************************************
   *          COMBATANT-SPECIFIC TYPES             *
   *************************************************/

  /**
   * @remarks
   * This is typed based on what is reasonable to expect, rather than accurately, as accurately would mean `unknown` (Foundry's type is
   * `object|null`).
   *
   * Technically this is the value of an arbitrary property path in the Combatant's Actor's `system` (using `getProperty`), and while that
   * path can usually be assumed to have been set to something in the return of {@linkcode TokenDocument.getTrackedAttributes}, since that's
   * what the {@linkcode CombatTrackerConfig} provides as options, the path is stored in the {@linkcode Combat.CONFIG_SETTING} which could
   * be updated to be anything. Also, `TokenDocument.getTrackedAttributes` doesn't actually check what the type of `value` and `max` are for
   * bar type attributes, so even sticking to those choices isn't guaranteed safe.
   *
   * There's clear intent that the value *should* be numeric or null, but nothing seems to do math on it in core, and it's simply output in
   * the {@linkcode CombatEncounters} template as `{{resource}}`, so `string` has been allowed.
   *
   * @privateRemarks Adding `boolean` is something that was discussed and decided against for now, but its plausible a system may request
   * such in the future, and wouldn't make us any more wrong than currently.
   */
  type Resource = string | number | null;

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

  /**
   * @deprecated Replaced with {@linkcode Combatant.ConfiguredSubType} (will be removed in v14).
   */
  type ConfiguredSubTypes = ConfiguredSubType;
}

/**
 * The client-side Combatant document which extends the common BaseCombatant model.
 *
 * @see {@linkcode Combat}                    The Combat document which contains Combatant embedded documents
 * @see {@linkcode CombatantConfig}        The Combatant configuration application
 */
declare class Combatant<out SubType extends Combatant.SubType = Combatant.SubType> extends BaseCombatant.Internal
  .ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `Combatant`
   * @param context - Construction context options
   */
  // Note(LukeAbby): `data` is not actually required but `context.parent` is.
  constructor(data: Combatant.CreateData | undefined, context: Combatant.ConstructionContext);

  /**
   * The token video source image (if any)
   * @defaultValue `null`
   */
  _videoSrc: string | null;

  /** The current value of the special tracked resource which pertains to this Combatant */
  resource: Combatant.Resource | null;

  /**
   * A convenience alias of Combatant#parent which is more semantically intuitive
   */
  get combat(): Combat.Implementation | null;

  /** This is treated as a non-player combatant if it has no associated actor and no player users who can control it */
  get isNPC(): boolean;

  /**
   * Eschew `ClientDocument`'s redirection to `Combat#permission` in favor of special ownership determination.
   * @remarks Uses {@link BaseCombatant.getUserLevel | `BaseCombatant#getUserLevel`}, so can't return `null`
   */
  override get permission(): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  override get visible(): boolean;

  /** A reference to the Actor document which this Combatant represents, if any */
  get actor(): Actor.Implementation | null;

  /** A reference to the Token document which this Combatant represents, if any */
  get token(): TokenDocument.Implementation | null;

  /** An array of non-Gamemaster Users who have ownership of this Combatant. */
  get players(): User.Implementation[];

  /**
   * Has this combatant been marked as defeated?
   */
  get isDefeated(): boolean;

  /**
   * Get a Roll object which represents the initiative roll for this Combatant.
   * @param formula -  An explicit Roll formula to use for the combatant.
   * @returns The Roll instance to use for the combatant.
   */
  getInitiativeRoll(formula?: string): Roll.Implementation;

  /**
   * Roll initiative for this particular combatant.
   * @param formula - A dice formula which overrides the default for this Combatant.
   * @returns The updated Combatant.
   */
  rollInitiative(formula?: string): Promise<this | undefined>;

  /**
   * @remarks Initializes `_videoSrc`, applies `img` and `name` fallbacks, and calls {@link Combatant.updateResource | `Combatant#updateResource`}
   */
  override prepareDerivedData(): void;

  /**
   * Update the value of the tracked resource for this Combatant.
   */
  updateResource(): Combatant.Resource;

  /**
   * Acquire the default dice formula which should be used to roll initiative for this combatant.
   * Modules or systems could choose to override or extend this to accommodate special situations.
   * @returns  The initiative formula to use for this combatant.
   */
  protected _getInitiativeFormula(): string;

  /**
   * Prepare derived data based on group membership.
   */
  protected _prepareGroup(): void;

  /**
   * Clear the movement history of the Combatant's Token.
   */
  clearMovementHistory(): Promise<void>;

  // DatabaseLifecycle Events are overridden but with no signature changes.
  // These are already covered in BaseCombatant

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

  // Descendant Document operations have been left out because Combatant does not have any descendant documents.

  static override defaultName(context?: Combatant.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends Combatant.CreateDialogOptions | undefined = undefined,
  >(
    data?: Combatant.CreateDialogData,
    createOptions?: Combatant.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<Combatant.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode Combatant.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = boolean | undefined,
    Options extends Combatant.CreateDialogOptions | undefined = undefined,
  >(
    data: Combatant.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: Combatant.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<Combatant.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: Combatant.Database2.DeleteOneDocumentOperation,
  ): Promise<Combatant.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: Combatant.Database2.DeleteOneDocumentOperation,
  ): Promise<Combatant.DeleteDialogReturn<Options>>;

  static override fromDropData(data: Combatant.DropData): Promise<Combatant.Implementation | undefined>;

  static override fromImport(
    source: Combatant.Source,
    context?: Document.FromImportContext<Combatant.Parent> | null,
  ): Promise<Combatant.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default Combatant;
