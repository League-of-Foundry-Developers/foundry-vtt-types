import type { ConfiguredCombatant } from "#configuration";
import type { Identity, MaybeArray, Merge } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type { DatabaseBackend, Document } from "#common/abstract/_module.d.mts";
import type { BaseActor, BaseCombatant, BaseScene, BaseToken } from "#client/documents/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type ClientDatabaseBackend from "#client/data/client-backend.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type ClientDocumentMixin from "#client/documents/abstract/client-document.d.mts";

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
  interface Metadata extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Combatant";
      collection: "combatants";
      label: "DOCUMENT.Combatant";
      labelPlural: "DOCUMENT.Combatants";
      isEmbedded: true;
      hasTypeData: true;
      schemaVersion: "13.341";
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
   * {@linkcode ConfiguredCombatant | fvtt-types/configuration/ConfiguredCombatant}.
   */
  type OfType<Type extends SubType> = Document.Internal.DiscriminateSystem<Name, _OfType, Type, ConfiguredSubType>;

  /** @internal */
  interface _OfType extends Identity<{
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
  interface CreateData<SubType extends Combatant.SubType = Combatant.SubType> extends fields.SchemaField
    .CreateData<Schema> {
    type?: SubType | null | undefined;
  }

  /**
   * Used in the {@linkcode Combatant.create} and {@linkcode Combatant.createDocuments} signatures, and
   * {@linkcode Combatant.Database.CreateOperation} and its derivative interfaces.
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
   * {@linkcode Combatant.updateDocuments} signatures, and {@linkcode Combatant.Database.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode Combatant}. This is the source of truth for how a `Combatant` document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Combatant}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */

  interface Schema extends fields.DataSchema {
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
    actorId: fields.ForeignDocumentField<typeof BaseActor, { label: "COMBAT.CombatantActor"; idOnly: true }>;

    /**
     * The _id of a Token associated with this Combatant
     * @defaultValue `null`
     */
    tokenId: fields.ForeignDocumentField<typeof BaseToken, { label: "COMBAT.CombatantToken"; idOnly: true }>;

    /**
     * @defaultValue `null`
     */
    sceneId: fields.ForeignDocumentField<typeof BaseScene, { label: "COMBAT.CombatantScene"; idOnly: true }>;

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

  namespace Database {
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
     * @see {@linkcode Document.Database.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `Combatant` documents.
     * @see {@linkcode Document.Database.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database.BackendGetOperation<GetOperation> {}

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
    interface CreateOperation<
      Temporary extends boolean | undefined = boolean | undefined,
    > extends DatabaseBackend.CreateOperation<Combatant.CreateInput, Combatant.Parent, Temporary> {
      /**
       * @remarks If passed, sets the parent {@linkcode Combat}'s current {@linkcode Combat.turn | turn} to this value as part of
       * this operation.
       */
      combatTurn?: number;

      /**
       * If set `false`, skips calling {@linkcode Combat._manageTurnEvents | Combat#_manageTurnEvents} in `Combat##onModifyCombatants`
       * (which gets passed this operation via {@linkcode Combat._onCreateDescendantDocuments | Combat#_onCreateDescendantDocuments}))
       */
      turnEvents?: boolean;
    }

    /**
     * The interface for passing to {@linkcode Combatant.create} or {@linkcode Combatant.createDocuments}.
     * @see {@linkcode Document.Database.CreateDocumentsOperation}
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
      .Database.CreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `Combatant` documents. (see {@linkcode Combatant.Parent})
     * @see {@linkcode Document.Database.CreateEmbeddedOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface CreateEmbeddedOperation extends Document.Database.CreateEmbeddedOperation<CreateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `Combatant` documents.
     * @see {@linkcode Document.Database.BackendCreateOperation}
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
      .Database.BackendCreateOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode Combatant._preCreate | Combatant#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateCombatant` hook}.
     * @see {@linkcode Document.Database.PreCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOptions<Temporary extends boolean | undefined = boolean | undefined> extends Document.Database
      .PreCreateOptions<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode Combatant._preCreateOperation}.
     * @see {@linkcode Document.Database.PreCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreCreateOperation<Temporary extends boolean | undefined = boolean | undefined> extends Document.Database
      .PreCreateOperation<CreateOperation<Temporary>> {}

    /**
     * @deprecated The interface passed to {@linkcode Combatant._onCreateDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database.OnCreateDocumentsOperation}
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
      .Database.OnCreateDocumentsOperation<CreateOperation<Temporary>> {}

    /**
     * The interface passed to {@linkcode Combatant._onCreate | Combatant#_onCreate} and
     * {@link Hooks.CreateDocument | the `createCombatant` hook}.
     * @see {@linkcode Document.Database.OnCreateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOptions extends Document.Database.OnCreateOptions<CreateOperation> {}

    /**
     * The interface passed to {@linkcode Combatant._onCreateOperation} and `Combatant`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database.OnCreateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode CreateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.CreateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnCreateOperation extends Document.Database.OnCreateOperation<CreateOperation> {}

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
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<Combatant.UpdateInput, Combatant.Parent> {
      /**
       * @remarks If passed, sets the parent {@linkcode Combat}'s current {@linkcode Combat.turn | turn} to this value as part of
       * this operation.
       */
      combatTurn?: number;

      /**
       * If set `false`, skips calling {@linkcode Combat._manageTurnEvents | Combat#_manageTurnEvents} in `Combat##onModifyCombatants`
       * (which gets passed this operation via {@linkcode Combat._onUpdateDescendantDocuments | Combat#_onUpdateDescendantDocuments})
       * and {@linkcode Combat._onUpdate | Combat#_onUpdate}.
       */
      turnEvents?: boolean;
    }

    /**
     * The interface for passing to {@linkcode Combatant.update | Combatant#update}.
     * @see {@linkcode Document.Database.UpdateOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateOneDocumentOperation extends Document.Database.UpdateOneDocumentOperation<UpdateOperation> {}

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
     * @see {@linkcode Document.Database.UpdateManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface UpdateManyDocumentsOperation extends Document.Database.UpdateManyDocumentsOperation<UpdateOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `Combatant` documents.
     * @see {@linkcode Document.Database.BackendUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendUpdateOperation extends Document.Database.BackendUpdateOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode Combatant._preUpdate | Combatant#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateCombatant` hook}.
     * @see {@linkcode Document.Database.PreUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode Combatant._preUpdateOperation}.
     * @see {@linkcode Document.Database.PreUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreUpdateOperation extends Document.Database.PreUpdateOperation<UpdateOperation> {}

    /**
     * @deprecated The interface passed to {@linkcode Combatant._onUpdateDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database.OnUpdateDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateDocumentsOperation extends Document.Database.OnUpdateDocumentsOperation<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode Combatant._onUpdate | Combatant#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateCombatant` hook}.
     * @see {@linkcode Document.Database.OnUpdateOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOptions extends Document.Database.OnUpdateOptions<UpdateOperation> {}

    /**
     * The interface passed to {@linkcode Combatant._onUpdateOperation} and `Combatant`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database.OnUpdateOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode UpdateOperation} for this Document or the
     * root {@linkcode DatabaseBackend.UpdateOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnUpdateOperation extends Document.Database.OnUpdateOperation<UpdateOperation> {}

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
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<Combatant.Parent> {
      /**
       * @remarks If passed, sets the parent {@linkcode Combat}'s current {@linkcode Combat.turn | turn} to this value as part of
       * this operation.
       */
      combatTurn?: number;

      /**
       * If set `false`, skips calling {@linkcode Combat._manageTurnEvents | Combat#_manageTurnEvents} in `Combat##onModifyCombatants`
       * (which gets passed this operation via {@linkcode Combat._onDeleteDescendantDocuments | Combat#_onDeleteDescendantDocuments}).
       */
      turnEvents?: boolean;
    }

    /**
     * The interface for passing to {@linkcode Combatant.delete | Combatant#delete}.
     * @see {@linkcode Document.Database.DeleteOneDocumentOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteOneDocumentOperation extends Document.Database.DeleteOneDocumentOperation<DeleteOperation> {}

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
     * @see {@linkcode Document.Database.DeleteManyDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface DeleteManyDocumentsOperation extends Document.Database.DeleteManyDocumentsOperation<DeleteOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `Combatant` documents.
     * @see {@linkcode Document.Database.BackendDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface BackendDeleteOperation extends Document.Database.BackendDeleteOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode Combatant._preDelete | Combatant#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteCombatant` hook}.
     * @see {@linkcode Document.Database.PreDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOptions extends Document.Database.PreDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode Combatant._preDeleteOperation}.
     * @see {@linkcode Document.Database.PreDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface PreDeleteOperation extends Document.Database.PreDeleteOperation<DeleteOperation> {}

    /**
     * @deprecated The interface passed to {@linkcode Combatant._onDeleteDocuments}. It will be removed in v14 along with the
     * method it is for.
     * @see {@linkcode Document.Database.OnDeleteDocumentsOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteDocumentsOperation extends Document.Database.OnDeleteDocumentsOperation<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode Combatant._onDelete | Combatant#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteCombatant` hook}.
     * @see {@linkcode Document.Database.OnDeleteOptions}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOptions extends Document.Database.OnDeleteOptions<DeleteOperation> {}

    /**
     * The interface passed to {@linkcode Combatant._onDeleteOperation} and `Combatant`-related collections'
     * `#_onModifyContents` methods.
     * @see {@linkcode Document.Database.OnDeleteOperation}
     *
     * ---
     *
     * **Declaration Merging Warning**
     *
     * It is very likely incorrect to merge into this interface instead of the base {@linkcode DeleteOperation} for this Document or the
     * root {@linkcode DatabaseBackend.DeleteOperation} for all documents, for reasons outlined in the latter's remarks. If you have a valid
     * use case for doing so, please let us know.
     */
    interface OnDeleteOperation extends Document.Database.OnDeleteOperation<DeleteOperation> {}

    namespace Internal {
      interface OperationNameMap<Temporary extends boolean | undefined = boolean | undefined> {
        GetDocumentsOperation: Combatant.Database.GetDocumentsOperation;
        BackendGetOperation: Combatant.Database.BackendGetOperation;
        GetOperation: Combatant.Database.GetOperation;

        CreateDocumentsOperation: Combatant.Database.CreateDocumentsOperation<Temporary>;
        CreateEmbeddedOperation: Combatant.Database.CreateEmbeddedOperation;
        BackendCreateOperation: Combatant.Database.BackendCreateOperation<Temporary>;
        CreateOperation: Combatant.Database.CreateOperation<Temporary>;
        PreCreateOptions: Combatant.Database.PreCreateOptions<Temporary>;
        PreCreateOperation: Combatant.Database.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: Combatant.Database.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: Combatant.Database.OnCreateOptions;
        OnCreateOperation: Combatant.Database.OnCreateOperation;

        UpdateOneDocumentOperation: Combatant.Database.UpdateOneDocumentOperation;
        UpdateEmbeddedOperation: Combatant.Database.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: Combatant.Database.UpdateManyDocumentsOperation;
        BackendUpdateOperation: Combatant.Database.BackendUpdateOperation;
        UpdateOperation: Combatant.Database.UpdateOperation;
        PreUpdateOptions: Combatant.Database.PreUpdateOptions;
        PreUpdateOperation: Combatant.Database.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: Combatant.Database.OnUpdateDocumentsOperation;
        OnUpdateOptions: Combatant.Database.OnUpdateOptions;
        OnUpdateOperation: Combatant.Database.OnUpdateOperation;

        DeleteOneDocumentOperation: Combatant.Database.DeleteOneDocumentOperation;
        DeleteEmbeddedOperation: Combatant.Database.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: Combatant.Database.DeleteManyDocumentsOperation;
        BackendDeleteOperation: Combatant.Database.BackendDeleteOperation;
        DeleteOperation: Combatant.Database.DeleteOperation;
        PreDeleteOptions: Combatant.Database.PreDeleteOptions;
        PreDeleteOperation: Combatant.Database.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: Combatant.Database.OnDeleteDocumentsOperation;
        OnDeleteOptions: Combatant.Database.OnDeleteOptions;
        OnDeleteOperation: Combatant.Database.OnDeleteOperation;
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

    /** @deprecated Use {@linkcode OnDeleteDocumentsOperation} instead. This type will be removed in v14 */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    type OnDeleteDocumentsContext = OnDeleteDocumentsOperation;

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
   * options, instead of being purely a {@linkcode Database.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database.CreateDocumentsOperation<Temporary>, Document._PartialDialogV1OptionsForCreateDialog {}

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
   * @remarks This is only ever typed by Foundry as `object | null`, but based on usage (especially
   * {@linkcode Actor.modifyTokenAttribute | Actor#modifyTokenAttribute}) it has been narrowed.
   */
  type Resource = number | null;

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended. This type will be removed in v14.
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
  constructor(data: Combatant.CreateData<SubType> | undefined, context: Combatant.ConstructionContext);

  /**
   * The token video source image (if any)
   * @defaultValue `null`
   * @internal
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
   */
  override get permission(): CONST.DOCUMENT_OWNERSHIP_LEVELS;

  override get visible(): boolean;

  /** A reference to the Actor document which this Combatant represents, if any */
  get actor(): Actor.Implementation | null;

  /** A reference to the Token document which this Combatant represents, if any */
  get token(): TokenDocument.Implementation | null;

  /** An array of non-Gamemaster Users who have ownership of this Combatant. */
  get players(): User.Stored[];

  /**
   * Has this combatant been marked as defeated?
   */
  get isDefeated(): boolean;

  /**
   * Get a Roll object which represents the initiative roll for this Combatant.
   * @param formula -  An explicit Roll formula to use for the combatant.
   * @returns The unevaluated Roll instance to use for the combatant.
   */
  getInitiativeRoll(formula?: string): Roll.Implementation;

  /**
   * Roll initiative for this particular combatant.
   * @param formula - A dice formula which overrides the default for this Combatant.
   * @returns The updated Combatant.
   */
  rollInitiative(formula?: string): Promise<this | undefined>;

  /**
   * @remarks Initializes `_videoSrc`, applies `img` and `name` fallbacks, and calls
   * {@linkcode Combatant.updateResource | Combatant#updateResource}.
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

  // For type simplicity the following real override(s) are commented out.
  // These methods historically have been the source of a large amount of computation from tsc.

  // protected static override _preCreateOperation(
  //   documents: Combatant.Implementation[],
  //   operation: Combatant.Database.PreCreateOperation,
  //   user: User.Stored,
  // ): Promise<boolean | void>;

  // protected static override _preUpdateOperation(
  //   documents: Combatant.Stored[],
  //   operation: Combatant.Database.PreUpdateOperation,
  //   user: User.Stored,
  // ): Promise<boolean | void>;

  // protected static override _preDeleteOperation(
  //   documents: Combatant.Stored[],
  //   operation: Combatant.Database.PreDeleteOperation,
  //   user: User.Stored,
  // ): Promise<boolean | void>;

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

  // `context` must contain a `parent`, so is required.
  static override defaultName(context: Combatant.DefaultNameContext): string;

  // `createOptions` must contain a  `parent`, so is required.
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends Combatant.CreateDialogOptions | undefined = undefined,
  >(
    data: Combatant.CreateDialogData | undefined,
    createOptions: Combatant.Database.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<Combatant.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode Combatant.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends Combatant.CreateDialogOptions | undefined = undefined,
  >(
    data: Combatant.CreateDialogData | undefined,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: Combatant.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<Combatant.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: Combatant.Database.DeleteOneDocumentOperation,
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
    operation?: Combatant.Database.DeleteOneDocumentOperation,
  ): Promise<Combatant.DeleteDialogReturn<Options>>;

  static override fromDropData(data: Combatant.DropData): Promise<Combatant.Implementation | undefined>;

  static override fromImport(
    source: Combatant.Source,
    context?: Document.FromImportContext<Combatant.Parent>,
  ): Promise<Combatant.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default Combatant;
