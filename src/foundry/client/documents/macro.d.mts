import type { ConfiguredMacro } from "#configuration";
import type { Identity, MaybeArray, Merge, NullishProps } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type { DatabaseBackend, Document } from "#common/abstract/_module.d.mts";
import type { BaseFolder, BaseMacro, BaseUser } from "#client/documents/_module.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

/** @privateRemarks `ExecuteMacroRegionBehaviourType` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ExecuteMacroRegionBehaviorType } from "#client/data/region-behaviors/_module.d.mts";

declare namespace Macro {
  /**
   * The document's name.
   */
  type Name = "Macro";

  /**
   * The context used to create a `Macro`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `Macro`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Macro` document instance configured through
   * {@linkcode CONFIG.Macro.documentClass} in Foundry and {@linkcode DocumentClassConfig} or
   * {@linkcode ConfiguredMacro | fvtt-types/configuration/ConfiguredMacro} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Macro` document configured through
   * {@linkcode CONFIG.Macro.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Macro";
      collection: "macros";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "sort", "folder"];
      label: "DOCUMENT.Macro";
      labelPlural: "DOCUMENT.Macros";
      coreTypes: ["script", "chat"]; // This isn't `CONST.MACRO_TYPES[]` due to the semantics of `Merge`.
      permissions: Metadata.Permissions;
      schemaVersion: "13.341";
    }>
  > {}

  namespace Metadata {
    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create(user: User.Internal.Implementation, doc: Implementation): boolean;
      update(user: User.Internal.Implementation, doc: Implementation): boolean;
      delete: "OWNER";
    }
  }

  /**
   * The subtypes of `Macro` that Foundry provides. `Macro` does not have `system` and therefore
   * there is no way for a user to configure custom subtypes. Nevertheless Foundry has a number of
   * built in subtypes usable for `Macro`.
   *
   * `Macro` has two subtypes `"chat"` and `"script"`. A `Macro` with type `"chat"` will create a
   * `ChatMessage` whereas a `"script"` allows executing arbitrary JavaScript code
   */
  type SubType = foundry.Game.Model.TypeNames<Name>;

  /**
   * @deprecated `Macro` does not have `system` and therefore there is no way for a user to
   * configure custom subtypes.
   *
   * This type exists only to be informative.
   */
  type ConfiguredSubType = never;

  /**
   * @deprecated `Macro` does not have `system` and therefore there is no way for a user to
   * configure custom subtypes. This means `Known` as a concept does not apply to it.
   *
   * This type exists only to be informative.
   */
  type Known = never;

  /**
   * `OfType` returns an instance of `Macro` with the corresponding type. This works with both the
   * builtin `Macro` class or a custom subclass if that is set up in
   * {@linkcode ConfiguredMacro | fvtt-types/configuration/ConfiguredMacro}.
   *
   * Note that `Macro` does not have a `system` property and therefore there is no way for a user
   * to configure custom subtypes. See {@linkcode Macro.SubType} for more information.
   */
  // Note(LukeAbby): The lack of a `system` is why `Document.Internal.DiscriminateSystem` isn't applied.
  type OfType<Type extends SubType> = _OfType[Type];

  /** @internal */
  interface _OfType extends Identity<{
    [Type in SubType]: Type extends unknown
      ? ConfiguredMacro<Type> extends { document: infer Document }
        ? Document
        : // eslint-disable-next-line @typescript-eslint/no-restricted-types
          Macro<Type>
      : never;
  }> {}

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = null;

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
   * The world collection that contains `Macro`s. Will be `never` if none exists.
   */
  type CollectionClass = foundry.documents.collections.Macros.ImplementationClass;

  /**
   * The world collection that contains `Folder`s. Will be `never` if none exists.
   */
  type Collection = foundry.documents.collections.Macros.Implementation;

  /**
   * An instance of `Macro` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<OfType<SubType>>;

  /**
   * An instance of `Macro` that comes from the database.
   */
  type Stored<SubType extends Macro.SubType = Macro.SubType> = Document.Internal.Stored<OfType<SubType>>;

  /**
   * The data put in {@linkcode Macro._source | Macro#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Macro.create}
   * and {@linkcode Macro | new Macro(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData<SubType extends Macro.SubType = Macro.SubType> extends fields.SchemaField.CreateData<Schema> {
    type?: SubType | null | undefined;
  }

  /**
   * Used in the {@linkcode Macro.create} and {@linkcode Macro.createDocuments} signatures, and
   * {@linkcode Macro.Database.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode Macro.create}, returning (a single | an array of) (temporary | stored)
   * `Macro`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput> ? Array<Macro.TemporaryIf<Temporary>> : Macro.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode Macro.name | Macro#name}.
   *
   * This is data transformed from {@linkcode Macro.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode Macro.update | Macro#update}.
   * It is a distinct type from {@linkcode Macro.CreateData | DeepPartial<Macro.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode Macro.update | Macro#update} and
   * {@linkcode Macro.updateDocuments} signatures, and {@linkcode Macro.Database.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode Macro}. This is the source of truth for how an Macro document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Macro}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends fields.DataSchema {
    /**
     * The _id which uniquely identifies this Macro document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this Macro
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * A Macro subtype from CONST.MACRO_TYPES
     * @defaultValue `CONST.MACRO_TYPES.CHAT`
     */
    type: fields.DocumentTypeField<typeof BaseMacro, { initial: typeof CONST.MACRO_TYPES.CHAT }>;

    /**
     * The _id of a User document which created this Macro *
     * @defaultValue `game.user?.id`
     */
    author: fields.DocumentAuthorField<typeof BaseUser>;

    /**
     * An image file path which provides the thumbnail artwork for this Macro
     * @defaultValue `BaseMacro.DEFAULT_ICON`
     */
    img: fields.FilePathField<{
      categories: ["IMAGE"];
      initial: () => typeof BaseMacro.DEFAULT_ICON;
    }>;

    /**
     * The scope of this Macro application from CONST.MACRO_SCOPES
     * @defaultValue `"global"`
     * @privateRemarks This field (and `CONST.MACRO_SCOPES`) is entirely vestigial, it's never checked anywhere,
     * and its `<select>` in MacroConfig has been unconditionally disabled since at least 11.315
     */
    scope: fields.StringField<{
      required: true;
      choices: CONST.MACRO_SCOPES[];
      initial: (typeof CONST.MACRO_SCOPES)[0];
      validationError: "must be a value in CONST.MACRO_SCOPES";
    }>;

    /**
     * The string content of the macro command
     * @defaultValue `""`
     */
    command: fields.StringField<{
      required: true;
      blank: true;
    }>;

    /**
     * The _id of a Folder which contains this Macro
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<typeof BaseFolder>;

    /**
     * The numeric sort value which orders this Macro relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures ownership of this Macro
     * @defaultValue see {@linkcode fields.DocumentOwnershipField}
     */
    ownership: fields.DocumentOwnershipField;

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

  namespace Database {
    /* ***********************************************
     *                GET OPERATIONS                 *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.GetOperation | GetOperation} interface for
     * `Macro` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<Macro.Parent> {}

    /**
     * The interface for passing to {@linkcode Macro.get}.
     * @see {@linkcode Document.Database.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `Macro` documents.
     * @see {@linkcode Document.Database.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `Macro` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Macro.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<
      Temporary extends boolean | undefined = boolean | undefined,
    > extends DatabaseBackend.CreateOperation<Macro.CreateInput, Macro.Parent, Temporary> {
      /**
       * @remarks If provided, {@linkcode Macro._onCreate | Macro#_onCreate} calls
       * {@linkcode User.assignHotbarMacro | User#assignHotbarMacro} with this value. It's limited by private method validation to the range
       * `[1,50]` inclusive.
       */
      hotbarSlot?: number;
    }

    /**
     * The interface for passing to {@linkcode Macro.create} or {@linkcode Macro.createDocuments}.
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
     * @deprecated `Macro` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `Macro` documents. (see {@linkcode Macro.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `Macro` documents.
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
     * The interface passed to {@linkcode Macro._preCreate | Macro#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateMacro` hook}.
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
     * The interface passed to {@linkcode Macro._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode Macro._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Macro._onCreate | Macro#_onCreate} and
     * {@link Hooks.CreateDocument | the `createMacro` hook}.
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
     * The interface passed to {@linkcode Macro._onCreateOperation} and `Macro`-related collections'
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
     * interface for `Macro` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Macro.update | Macro#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<Macro.UpdateInput, Macro.Parent> {}

    /**
     * The interface for passing to {@linkcode Macro.update | Macro#update}.
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
     * @deprecated `Macro` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.updateEmbeddedDocuments | #updateEmbeddedDocuments} method of any Documents that
     * can contain `Macro` documents (see {@linkcode Macro.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Macro.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `Macro` documents.
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
     * The interface passed to {@linkcode Macro._preUpdate | Macro#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateMacro` hook}.
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
     * The interface passed to {@linkcode Macro._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode Macro._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Macro._onUpdate | Macro#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateMacro` hook}.
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
     * The interface passed to {@linkcode Macro._onUpdateOperation} and `Macro`-related collections'
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
     * interface for `Macro` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode Macro.delete | Macro#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<Macro.Parent> {}

    /**
     * The interface for passing to {@linkcode Macro.delete | Macro#delete}.
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
     * @deprecated `Macro` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.deleteEmbeddedDocuments | #deleteEmbeddedDocuments} method of any Documents that
     * can contain `Macro` documents (see {@linkcode Macro.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode Macro.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `Macro` documents.
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
     * The interface passed to {@linkcode Macro._preDelete | Macro#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteMacro` hook}.
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
     * The interface passed to {@linkcode Macro._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode Macro._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode Macro._onDelete | Macro#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteMacro` hook}.
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
     * The interface passed to {@linkcode Macro._onDeleteOperation} and `Macro`-related collections'
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
        GetDocumentsOperation: Macro.Database.GetDocumentsOperation;
        BackendGetOperation: Macro.Database.BackendGetOperation;
        GetOperation: Macro.Database.GetOperation;

        CreateDocumentsOperation: Macro.Database.CreateDocumentsOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        CreateEmbeddedOperation: Macro.Database.CreateEmbeddedOperation;
        BackendCreateOperation: Macro.Database.BackendCreateOperation<Temporary>;
        CreateOperation: Macro.Database.CreateOperation<Temporary>;
        PreCreateOptions: Macro.Database.PreCreateOptions<Temporary>;
        PreCreateOperation: Macro.Database.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: Macro.Database.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: Macro.Database.OnCreateOptions;
        OnCreateOperation: Macro.Database.OnCreateOperation;

        UpdateOneDocumentOperation: Macro.Database.UpdateOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        UpdateEmbeddedOperation: Macro.Database.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: Macro.Database.UpdateManyDocumentsOperation;
        BackendUpdateOperation: Macro.Database.BackendUpdateOperation;
        UpdateOperation: Macro.Database.UpdateOperation;
        PreUpdateOptions: Macro.Database.PreUpdateOptions;
        PreUpdateOperation: Macro.Database.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: Macro.Database.OnUpdateDocumentsOperation;
        OnUpdateOptions: Macro.Database.OnUpdateOptions;
        OnUpdateOperation: Macro.Database.OnUpdateOperation;

        DeleteOneDocumentOperation: Macro.Database.DeleteOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        DeleteEmbeddedOperation: Macro.Database.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: Macro.Database.DeleteManyDocumentsOperation;
        BackendDeleteOperation: Macro.Database.BackendDeleteOperation;
        DeleteOperation: Macro.Database.DeleteOperation;
        PreDeleteOptions: Macro.Database.PreDeleteOptions;
        PreDeleteOperation: Macro.Database.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: Macro.Database.OnDeleteDocumentsOperation;
        OnDeleteOptions: Macro.Database.OnDeleteOptions;
        OnDeleteOperation: Macro.Database.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode Macro.Implementation}, otherwise {@linkcode Macro.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? Macro.Implementation : Macro.Stored;

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

  /** The interface {@linkcode Macro.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode Macro.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode Macro.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode Macro.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode Macro.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database.CreateDocumentsOperation<Temporary>, Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode Macro.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode Macro.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends Macro.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<Macro.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode Macro.deleteDialog | Macro#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    Macro.Stored,
    PassedConfig
  >;

  /* ***********************************************
   *              MACRO-SPECIFIC TYPES             *
   *************************************************/

  /** @internal */
  type _ScriptScope = NullishProps<{
    /** An Actor who is the protagonist of the executed action. */
    actor: Actor.Implementation;

    /** A Token which is the protagonist of the executed action. */
    token: Token.Implementation;

    /** The speaker data */
    speaker: ChatMessage.SpeakerData;

    /**
     * @remarks Sometimes provided by core:
     * - When called in {@linkcode ExecuteMacroRegionBehaviorType._handleRegionEvent | ExecuteMacroRegionBehaviorType#_handleRegionEvent},
     * will be a {@linkcode Scene.Implementation} (possibly `null` if somehow called on a `RegionBehavior` whose `RegionDocument` doesn't
     * have a parent `Scene`)
     */
    scene?: unknown;

    /**
     * @remarks Sometimes provided by core:
     * - When called in {@linkcode ExecuteMacroRegionBehaviorType._handleRegionEvent | ExecuteMacroRegionBehaviorType#_handleRegionEvent},
     * will be a {@linkcode RegionDocument.Implementation} (possibly `null` if somehow called on a `RegionBehavior` without a parent
     * `RegionDocument`)
     */
    region?: unknown;

    /**
     * @remarks Sometimes provided by core:
     * - When called in {@linkcode ExecuteMacroRegionBehaviorType._handleRegionEvent | ExecuteMacroRegionBehaviorType#_handleRegionEvent},
     * will be a {@linkcode RegionBehavior.Implementation} (possibly `null` if somehow called on a `RegionBehaviorType` without a parent
     * `RegionBehavior`)
     */
    behavior?: unknown;

    /**
     * @remarks Sometimes provided by core:
     * - When called in {@linkcode Macro._onClickDocumentLink | Macro#_onClickDocumentLink},
     * will be a {@linkcode MouseEvent}
     * - When called in {@linkcode ExecuteMacroRegionBehaviorType._handleRegionEvent | ExecuteMacroRegionBehaviorType#_handleRegionEvent},
     * will be a {@linkcode RegionDocument.RegionEvent}
     */
    event?: unknown;

    /**
     * @remarks Additional arguments passed as part of the scope. Numeric keys are disallowed (`##executeScript` throws).
     */
    [arg: string | symbol]: unknown;
  }>;

  interface ScriptScope extends _ScriptScope {}

  interface ChatScope extends Pick<ScriptScope, "speaker"> {}

  interface UnknownScope extends ScriptScope, ChatScope {}

  type ExecuteScope<SubType extends Macro.SubType> = SubType extends "chat" | "script"
    ? UnknownScope
    : (SubType extends "script" ? ScriptScope : never) | (SubType extends "chat" ? ScriptScope : never);

  // Note: If extra types ever get added this will need to be updated to account for them, even if
  // just to return `undefined`.
  type ExecuteReturn<SubType extends Macro.SubType> =
    | (SubType extends "chat" ? Promise<ChatMessage.Implementation | undefined | void> : never)
    // Note(LukeAbby): As of 13.346 this `| void` is only possible if there's a syntax error in the function.
    | (SubType extends "script" ? Promise<unknown> | void : never);

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended. This type will be removed in v14.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

  /**
   * @deprecated Replaced with {@linkcode Macro.ConfiguredSubType} (will be removed in v14).
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConfiguredSubTypes = ConfiguredSubType;
}

/**
 * The client-side Macro document which extends the common BaseMacro model.
 *
 * @see {@linkcode Macros}            The world-level collection of Macro documents
 * @see {@linkcode MacroConfig}       The Macro configuration application
 *
 * @param data - Initial data provided to construct the Macro document
 */
declare class Macro<out SubType extends Macro.SubType = Macro.SubType> extends BaseMacro.Internal
  .ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `Macro`
   * @param context - Construction context options
   */
  constructor(data: Macro.CreateData<SubType>, context?: Macro.ConstructionContext);

  /**
   * Is the current User the author of this macro?
   */
  get isAuthor(): boolean;

  /**
   * Test whether the current user is capable of executing a Macro script
   */
  get canExecute(): boolean;

  /**
   * Provide a thumbnail image path used to represent this document.
   */
  get thumbnail(): string | null;

  /**
   * Test whether the given User is capable of executing this Macro.
   * @param user - The User to test.
   * @returns Can this User execute this Macro?
   * @privateRemarks Only does role checks, so temporary `User`s are allowed.
   */
  canUserExecute(user: User.Implementation): boolean;

  /**
   * Execute the Macro command.
   * @param scope - Macro execution scope which is passed to script macros
   * @returns A promise containing a created {@linkcode ChatMessage} (or `undefined`) if a chat
   *          macro or the return value if a script macro. A void return is possible if the user
   *          is not permitted to execute macros or a script macro execution fails.
   * @remarks Forwards to either `#executeChat` or `#executeScript`
   */
  execute(scope?: Macro.ExecuteScope<SubType>): Macro.ExecuteReturn<SubType>;

  /** @remarks Returns {@linkcode Macro.execute | this.execute}`({event})` */
  override _onClickDocumentLink(event: MouseEvent): Macro.ExecuteReturn<SubType>;

  // _onCreate is overridden but with no signature changes from its definition in BaseMacro.

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

  // Descendant Document operations have been left out because Macro does not have any descendant documents.

  static override defaultName(context?: Macro.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends Macro.CreateDialogOptions | undefined = undefined,
  >(
    data?: Macro.CreateDialogData,
    createOptions?: Macro.Database.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<Macro.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @remarks @see {@linkcode Macro.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends Macro.CreateDialogOptions | undefined = undefined,
  >(
    data: Macro.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: Macro.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<Macro.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: Macro.Database.DeleteOneDocumentOperation,
  ): Promise<Macro.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @remarks @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: Macro.Database.DeleteOneDocumentOperation,
  ): Promise<Macro.DeleteDialogReturn<Options>>;

  static override fromDropData(data: Macro.DropData): Promise<Macro.Implementation | undefined>;

  static override fromImport(
    source: Macro.Source,
    context?: Document.FromImportContext<Macro.Parent> | null,
  ): Promise<Macro.Implementation>;

  #Macro: true;
}

export default Macro;
