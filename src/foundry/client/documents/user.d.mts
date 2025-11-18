import type { ConfiguredDocumentClass } from "../../../types/documentConfiguration.d.mts";
import type {
  AnyObject,
  FixedInstanceType,
  InexactPartial,
  IntentionalPartial,
  MaybeArray,
  Merge,
  NullishProps,
} from "#utils";
import type { Document, DatabaseBackend } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { BaseActor, BaseUser } from "#common/documents/_module.d.mts";
import type { UserTargets } from "#client/canvas/placeables/tokens/_module.d.mts";
import type { BaseRuler, Ping } from "#client/canvas/interaction/_module.d.mts";
import type { DialogV2 } from "#client/applications/api/_module.d.mts";

/** @privateRemarks `ClientDatabaseBackend` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDatabaseBackend } from "#client/data/_module.d.mts";

/** @privateRemarks `ClientDocumentMixin` and `DocumentCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

import AVSettings = foundry.av.AVSettings;
import fields = foundry.data.fields;

declare namespace User {
  /**
   * The document's name.
   */
  type Name = "User";

  /**
   * The context used to create a `User`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `User`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `User` document instance configured through
   * {@linkcode CONFIG.User.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `User` document configured through
   * {@linkcode CONFIG.User.documentClass} in Foundry and {@linkcode DocumentClassConfig} in fvtt-types.
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
        name: "User";
        collection: "users";
        label: string;
        labelPlural: string;
        permissions: Metadata.Permissions;
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create(user: Internal.Implementation, doc: Internal.Implementation, data: UpdateData): boolean;
      update(user: Internal.Implementation, doc: Internal.Implementation, changes: UpdateData): boolean;
      delete(user: Internal.Implementation, doc: Internal.Implementation): boolean;
    }
  }

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
   * The world collection that contains `User`s. Will be `never` if none exists.
   */
  type CollectionClass = foundry.documents.collections.Users.ImplementationClass;

  /**
   * The world collection that contains `User`s. Will be `never` if none exists.
   */
  type Collection = foundry.documents.collections.Users.Implementation;

  /**
   * An instance of `User` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  type Invalid = Document.Internal.Invalid<Implementation>;

  /**
   * An instance of `User` that comes from the database.
   */
  type Stored = Document.Internal.Stored<User.Implementation>;

  /**
   * The data put in {@linkcode User._source | User#_source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@linkcode fields.SetField | SetField} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode User.create}
   * and {@linkcode User | new User(...)}.
   *
   * For example a {@linkcode fields.SetField | SetField} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * Used in the {@linkcode User.create} and {@linkcode User.createDocuments} signatures, and
   * {@linkcode User.Database2.CreateOperation} and its derivative interfaces.
   */
  type CreateInput = CreateData | Implementation;

  /**
   * The helper type for the return of {@linkcode User.create}, returning (a single | an array of) (temporary | stored)
   * `User`s.
   *
   * `| undefined` is included in the non-array branch because if a `.create` call with non-array data is cancelled by the `preCreate`
   * method or hook, `shift`ing the return of `.createDocuments` produces `undefined`
   */
  type CreateReturn<Data extends MaybeArray<CreateInput>, Temporary extends boolean | undefined> =
    Data extends Array<CreateInput> ? Array<User.TemporaryIf<Temporary>> : User.TemporaryIf<Temporary> | undefined;

  /**
   * The data after a {@linkcode Document} has been initialized, for example
   * {@linkcode User.name | User#name}.
   *
   * This is data transformed from {@linkcode User.Source} and turned into more
   * convenient runtime data structures. For example a {@linkcode fields.SetField | SetField} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@linkcode User.update | User#update}.
   * It is a distinct type from {@linkcode User.CreateData | DeepPartial<User.CreateData>} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * Used in the {@linkcode User.update | User#update} and
   * {@linkcode User.updateDocuments} signatures, and {@linkcode User.Database2.UpdateOperation}
   * and its derivative interfaces.
   */
  type UpdateInput = UpdateData | Implementation;

  /**
   * The schema for {@linkcode User}. This is the source of truth for how an User document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode User}. For example
   * a {@linkcode fields.StringField | StringField} will enforce that the value is a string. More
   * complex fields like {@linkcode fields.SetField | SetField} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this User document.
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The user's name.
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * The user's role, see CONST.USER_ROLES.
     * @defaultValue `CONST.USER_ROLES.PLAYER`
     */
    // FIXME: Overrides required to enforce the branded type
    role: fields.NumberField<
      {
        required: true;
        choices: CONST.USER_ROLES[];
        initial: typeof CONST.USER_ROLES.PLAYER;
        readonly: true;
      },
      CONST.USER_ROLES | null | undefined,
      CONST.USER_ROLES,
      CONST.USER_ROLES
    >;

    /**
     * The user's password. Available only on the Server side for security.
     * @defaultValue `""`
     */
    password: fields.StringField<{ required: true; blank: true }>;

    /**
     * The user's password salt. Available only on the Server side for security.
     * @defaultValue `undefined`
     */
    passwordSalt: fields.StringField;

    /**
     * The user's avatar image.
     * @defaultValue `null`
     * @remarks Initialized to `this.avatar || this.character?.img || CONST.DEFAULT_TOKEN` in {@link User.prepareDerivedData | `User#prepareDerivedData`}
     */
    avatar: fields.FilePathField<{ categories: ["IMAGE"] }>;

    /**
     * A linked Actor document that is this user's impersonated character.
     * @defaultValue `null`
     */
    character: fields.ForeignDocumentField<typeof BaseActor>;

    /**
     * A color to represent this user.
     * @defaultValue A CSS hex code representing an HSV color, with random hue, 0.8 saturation, and 0.8 value
     */
    color: fields.ColorField<{ required: true; nullable: false; initial: () => string }>;

    /**
     * The user's personal pronouns.
     * @defaultValue `""`
     */
    pronouns: fields.StringField<{ required: true }>;

    /**
     * A mapping of hotbar slot number to Macro id for the user.
     * @defaultValue `{}`
     */
    hotbar: fields.ObjectField<
      {
        required: true;
        validate: (bar: AnyObject) => bar is Record<number, string>;
        validationError: "must be a mapping of slots to macro identifiers";
      },
      Record<number, string> | null | undefined,
      Record<number, string>,
      Record<number, string>
    >;

    /**
     * The user's individual permission configuration, see CONST.USER_PERMISSIONS.
     * @defaultValue `{}`
     */
    permissions: fields.ObjectField<
      {
        required: true;
        validate: (perms: AnyObject) => boolean;
        validationError: "must be a mapping of permission names to booleans";
      },
      Record<string, boolean> | null | undefined,
      Record<string, boolean>,
      Record<string, boolean>
    >;

    /**
     * An object of optional key/value flags.
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
     * `User` documents. Valid for passing to
     * {@linkcode ClientDatabaseBackend._getDocuments | ClientDatabaseBackend#_getDocuments}.
     *
     * The {@linkcode GetDocumentsOperation} and {@linkcode BackendGetOperation} interfaces derive from this one.
     */
    interface GetOperation extends DatabaseBackend.GetOperation<User.Parent> {}

    /**
     * The interface for passing to {@linkcode User.get}.
     * @see {@linkcode Document.Database2.GetDocumentsOperation}
     */
    interface GetDocumentsOperation extends Document.Database2.GetDocumentsOperation<GetOperation> {}

    /**
     * The interface for passing to {@linkcode DatabaseBackend.get | DatabaseBackend#get} for `User` documents.
     * @see {@linkcode Document.Database2.BackendGetOperation}
     */
    interface BackendGetOperation extends Document.Database2.BackendGetOperation<GetOperation> {}

    /* ***********************************************
     *              CREATE OPERATIONS                *
     *************************************************/

    /**
     * A base (no property omission or optionality changes) {@linkcode DatabaseBackend.CreateOperation | DatabaseCreateOperation}
     * interface for `User` documents.
     *
     * See {@linkcode DatabaseBackend.CreateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode User.create}. The new name for that
     * interface is {@linkcode CreateDocumentsOperation}.
     */
    interface CreateOperation<Temporary extends boolean | undefined = boolean | undefined>
      extends DatabaseBackend.CreateOperation<User.CreateInput, User.Parent, Temporary> {}

    /**
     * The interface for passing to {@linkcode User.create} or {@linkcode User.createDocuments}.
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
     * @deprecated `User` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.createEmbeddedDocuments | #createEmbeddedDocuments} method of any Documents that
     * can contain `User` documents. (see {@linkcode User.Parent})
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
     * The interface for passing to {@linkcode DatabaseBackend.create | DatabaseBackend#create} for `User` documents.
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
     * The interface passed to {@linkcode User._preCreate | User#_preCreate} and
     * {@link Hooks.PreCreateDocument | the `preCreateUser` hook}.
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
     * The interface passed to {@linkcode User._preCreateOperation}.
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
     * @deprecated The interface passed to {@linkcode User._onCreateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode User._onCreate | User#_onCreate} and
     * {@link Hooks.CreateDocument | the `createUser` hook}.
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
     * The interface passed to {@linkcode User._onCreateOperation} and `User`-related collections'
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
     * interface for `User` documents.
     *
     * See {@linkcode DatabaseBackend.UpdateOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode User.update | User#update}.
     * The new name for that interface is {@linkcode UpdateOneDocumentOperation}.
     */
    interface UpdateOperation extends DatabaseBackend.UpdateOperation<User.UpdateInput, User.Parent> {}

    /**
     * The interface for passing to {@linkcode User.update | User#update}.
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
     * @deprecated `User` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.updateEmbeddedDocuments | #updateEmbeddedDocuments} method of any Documents that
     * can contain `User` documents (see {@linkcode User.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode User.updateDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.update | DatabaseBackend#update} for `User` documents.
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
     * The interface passed to {@linkcode User._preUpdate | User#_preUpdate} and
     * {@link Hooks.PreUpdateDocument | the `preUpdateUser` hook}.
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
     * The interface passed to {@linkcode User._preUpdateOperation}.
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
     * @deprecated The interface passed to {@linkcode User._onUpdateDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode User._onUpdate | User#_onUpdate} and
     * {@link Hooks.UpdateDocument | the `updateUser` hook}.
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
     * The interface passed to {@linkcode User._onUpdateOperation} and `User`-related collections'
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
     * interface for `User` documents.
     *
     * See {@linkcode DatabaseBackend.DeleteOperation} for more information on this family of interfaces.
     *
     * @remarks This interface was previously typed for passing to {@linkcode User.delete | User#delete}.
     * The new name for that interface is {@linkcode DeleteOneDocumentOperation}.
     */
    interface DeleteOperation extends DatabaseBackend.DeleteOperation<User.Parent> {}

    /**
     * The interface for passing to {@linkcode User.delete | User#delete}.
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
     * @deprecated `User` documents are never embedded. This interface exists for consistency with other documents.
     *
     * The interface for passing to the {@linkcode Document.deleteEmbeddedDocuments | #deleteEmbeddedDocuments} method of any Documents that
     * can contain `User` documents (see {@linkcode User.Parent}). This interface is just an alias
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
     * The interface for passing to {@linkcode User.deleteDocuments}.
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
     * The interface for passing to {@linkcode DatabaseBackend.delete | DatabaseBackend#delete} for `User` documents.
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
     * The interface passed to {@linkcode User._preDelete | User#_preDelete} and
     * {@link Hooks.PreDeleteDocument | the `preDeleteUser` hook}.
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
     * The interface passed to {@linkcode User._preDeleteOperation}.
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
     * @deprecated The interface passed to {@linkcode User._onDeleteDocuments}. It will be removed in v14 along with the
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
     * The interface passed to {@linkcode User._onDelete | User#_onDelete} and
     * {@link Hooks.DeleteDocument | the `deleteUser` hook}.
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
     * The interface passed to {@linkcode User._onDeleteOperation} and `User`-related collections'
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
        GetDocumentsOperation: User.Database2.GetDocumentsOperation;
        BackendGetOperation: User.Database2.BackendGetOperation;
        GetOperation: User.Database2.GetOperation;

        CreateDocumentsOperation: User.Database2.CreateDocumentsOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        CreateEmbeddedOperation: User.Database2.CreateEmbeddedOperation;
        BackendCreateOperation: User.Database2.BackendCreateOperation<Temporary>;
        CreateOperation: User.Database2.CreateOperation<Temporary>;
        PreCreateOptions: User.Database2.PreCreateOptions<Temporary>;
        PreCreateOperation: User.Database2.PreCreateOperation<Temporary>;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnCreateDocumentsOperation: User.Database2.OnCreateDocumentsOperation<Temporary>;
        OnCreateOptions: User.Database2.OnCreateOptions;
        OnCreateOperation: User.Database2.OnCreateOperation;

        UpdateOneDocumentOperation: User.Database2.UpdateOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        UpdateEmbeddedOperation: User.Database2.UpdateEmbeddedOperation;
        UpdateManyDocumentsOperation: User.Database2.UpdateManyDocumentsOperation;
        BackendUpdateOperation: User.Database2.BackendUpdateOperation;
        UpdateOperation: User.Database2.UpdateOperation;
        PreUpdateOptions: User.Database2.PreUpdateOptions;
        PreUpdateOperation: User.Database2.PreUpdateOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnUpdateDocumentsOperation: User.Database2.OnUpdateDocumentsOperation;
        OnUpdateOptions: User.Database2.OnUpdateOptions;
        OnUpdateOperation: User.Database2.OnUpdateOperation;

        DeleteOneDocumentOperation: User.Database2.DeleteOneDocumentOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        DeleteEmbeddedOperation: User.Database2.DeleteEmbeddedOperation;
        DeleteManyDocumentsOperation: User.Database2.DeleteManyDocumentsOperation;
        BackendDeleteOperation: User.Database2.BackendDeleteOperation;
        DeleteOperation: User.Database2.DeleteOperation;
        PreDeleteOptions: User.Database2.PreDeleteOptions;
        PreDeleteOperation: User.Database2.PreDeleteOperation;
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        OnDeleteDocumentsOperation: User.Database2.OnDeleteDocumentsOperation;
        OnDeleteOptions: User.Database2.OnDeleteOptions;
        OnDeleteOperation: User.Database2.OnDeleteOperation;
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
   * If `Temporary` is true then {@linkcode User.Implementation}, otherwise {@linkcode User.Stored}.
   */
  type TemporaryIf<Temporary extends boolean | undefined> =
    true extends Extract<Temporary, true> ? User.Implementation : User.Stored;

  namespace Database {
    /** Options passed along in Get operations for Users */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<User.Parent> {}

    /** Options passed along in Create operations for Users */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<User.CreateData, User.Parent, Temporary> {}

    /** Options passed along in Delete operations for Users */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<User.Parent> {}

    /** Options passed along in Update operations for Users */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<User.UpdateData, User.Parent> {}

    /** Operation for {@linkcode User.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<User.Database.Create<Temporary>> {}

    /** Operation for {@linkcode User.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<User.Database.Update> {}

    /** Operation for {@linkcode User.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<User.Database.Delete> {}

    /** Operation for {@linkcode User.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateDocumentsOperation<User.Database.Create<Temporary>> {}

    /** Operation for {@link User.update | `User#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode User.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link User._preCreate | `User#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link User._onCreate | `User#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode User._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<User.Database.Create> {}

    /** Operation for {@link User._onCreateOperation | `User#_onCreateOperation`} */
    interface OnCreateOperation extends User.Database.Create {}

    /** Options for {@link User._preUpdate | `User#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link User._onUpdate | `User#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode User._preUpdateOperation} */
    interface PreUpdateOperation extends User.Database.Update {}

    /** Operation for {@link User._onUpdateOperation | `User._preUpdateOperation`} */
    interface OnUpdateOperation extends User.Database.Update {}

    /** Options for {@link User._preDelete | `User#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link User._onDelete | `User#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link User._preDeleteOperation | `User#_preDeleteOperation`} */
    interface PreDeleteOperation extends User.Database.Delete {}

    /** Options for {@link User._onDeleteOperation | `User#_onDeleteOperation`} */
    interface OnDeleteOperation extends User.Database.Delete {}

    /** Context for {@linkcode User._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<User.Parent> {}

    /** Context for {@linkcode User._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<User.Parent> {}

    /** Context for {@linkcode User._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<User.Parent> {}

    /**
     * Options for {@link User._preCreateDescendantDocuments | `User#_preCreateDescendantDocuments`}
     * and {@link User._onCreateDescendantDocuments | `User#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<User.Database.Create> {}

    /**
     * Options for {@link User._preUpdateDescendantDocuments | `User#_preUpdateDescendantDocuments`}
     * and {@link User._onUpdateDescendantDocuments | `User#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<User.Database.Update> {}

    /**
     * Options for {@link User._preDeleteDescendantDocuments | `User#_preDeleteDescendantDocuments`}
     * and {@link User._onDeleteDescendantDocuments | `User#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<User.Database.Delete> {}

    /**
     * Create options for {@linkcode User.createDialog}.
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

  /** The interface {@linkcode User.fromDropData} receives */
  interface DropData extends Document.Internal.DropData<Name> {}

  /**
   * @deprecated Foundry prior to v13 had a completely unused `options` parameter in the {@linkcode User.fromDropData}
   * signature that has since been removed. This type will be removed in v14.
   */
  type DropDataOptions = never;

  /**
   * The interface for passing to {@linkcode User.defaultName}
   * @see {@linkcode Document.DefaultNameContext}
   */
  interface DefaultNameContext extends Document.DefaultNameContext<Name, Parent> {}

  /**
   * The interface for passing to {@linkcode User.createDialog}'s first parameter
   * @see {@linkcode Document.CreateDialogData}
   */
  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}

  /**
   * @deprecated This is for a deprecated signature, and will be removed in v15.
   * The interface for passing to {@linkcode User.createDialog}'s second parameter that still includes partial Dialog
   * options, instead of being purely a {@linkcode Database2.CreateDocumentsOperation | CreateDocumentsOperation}.
   */
  interface CreateDialogDeprecatedOptions<Temporary extends boolean | undefined = boolean | undefined>
    extends Database2.CreateDocumentsOperation<Temporary>,
      Document._PartialDialogV1OptionsForCreateDialog {}

  /**
   * The interface for passing to {@linkcode User.createDialog}'s third parameter
   * @see {@linkcode Document.CreateDialogOptions}
   */
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The return type for {@linkcode User.createDialog}.
   * @see {@linkcode Document.CreateDialogReturn}
   */
  // TODO: inline .Stored in v14 instead of taking Temporary
  type CreateDialogReturn<
    Temporary extends boolean | undefined,
    PassedConfig extends User.CreateDialogOptions | undefined,
  > = Document.CreateDialogReturn<User.TemporaryIf<Temporary>, PassedConfig>;

  /**
   * The return type for {@linkcode User.deleteDialog | User#deleteDialog}.
   * @see {@linkcode Document.DeleteDialogReturn}
   */
  type DeleteDialogReturn<PassedConfig extends DialogV2.ConfirmConfig | undefined> = Document.DeleteDialogReturn<
    User.Stored,
    PassedConfig
  >;

  /* ***********************************************
   *             USER-SPECIFIC TYPES               *
   *************************************************/

  // Note(LukeAbby): This namespace exists to break cycles because of extensive usage of `User` in
  // the `Document` class itself.
  namespace Internal {
    type ImplementationClass = ConfiguredDocumentClass["User"];
    type Implementation = FixedInstanceType<ConfiguredDocumentClass["User"]>;
  }

  /** @internal */
  type _PingData = InexactPartial<{
    /**
     * The zoom level at which the ping was made.
     * @defaultValue `1`
     * @remarks Can't be `null` because it only has a parameter default and is eventually used as a divisor in `Canvas#_constrainView`
     */
    zoom: number;
  }> &
    NullishProps<{
      /**
       * Pulls all connected clients' views to the pinged co-ordinates.
       */
      pull: boolean;

      /**
       * The ping style, see CONFIG.Canvas.pings.
       * @defaultValue `"pulse"`
       * @remarks Overridden with `"arrow"` if the position of the ping is outside the viewport
       *
       * Overridden with `CONFIG.Canvas.pings.types.PULL` (`"chevron"` by default) if photosensitive mode is enabled and the ping is within the viewport
       */
      style: Ping.ConfiguredStyles;
    }>;

  /** @privateRemarks Only consumed by {@link ControlsLayer.handlePing | `ControlsLayer#handlePing`} */
  interface PingData extends _PingData {
    /**
     * The ID of the scene that was pinged.
     */
    scene: string;
  }

  /**
   * No core {@link User.broadcastActivity | `User#broadcastActivity`} call provides all keys, most only provide one,
   * this is essentially bundling a bunch of unrelated update types into one socket handler, but the socket drops
   * explicit `undefined` keys, so `IntentionalPartial` and `| null` as appropriate it is.
   *
   * @internal
   */
  type _ActivityData = IntentionalPartial<{
    /**
     * The ID of the scene that the user is viewing.
     * @remarks Foundry types this as possibly being `null`, but no code path in core seems to be able to produce such a broadcast,
     * and it appears to be ignored if explicitly sent as `null`. Can't be explicit `undefined` as the socket drops such keys.
     */
    sceneId: string | null;

    /**
     * The position of the user's cursor.
     * @remarks Can't be explicit `undefined` as the socket drops such keys, and {@link ControlsLayer.updateCursor | `ControlsLayer#updateCursor`}
     * has an `=== null` check.
     */
    cursor: { x: number; y: number } | null;

    /**
     * The state of the user's ruler, if they are currently using one.
     * @remarks Can't be explicit `undefined` as the socket drops such keys.
     */
    ruler: BaseRuler.UpdateData | null;

    /**
     * The IDs of the tokens the user has targeted in the currently viewed
     * @remarks Can't be explicit `undefined` as the socket drops such keys, and can't be `null` as its passed to {@link User.updateTokenTargets | `User#updateTokenTargets`},
     * where it only has a parameter default.
     */
    targets: string[];

    /**
     * Whether the user has an open WS connection to the server or not.
     * @defaultValue `true`
     * @remarks Can't be nullish as, if provided, gets directly assigned to {@link User.active | `User#active`},
     * and the default is applied only on a negative `in` check.
     */
    active: boolean;

    /**
     * Is the user emitting a ping at the cursor coordinates?
     * @remarks Can't be explicit `undefined` as the socket drops such keys, and can't be `null` as its passed to {@link ControlsLayer.handlePing | `CanvasLayer#handlePing`}'s third argument,
     * where it is destructured and only has a parameter default.
     */
    ping: User.PingData;

    /**
     * The state of the user's AV settings.
     * @remarks Can't be nullish, as it's passed to {@link AVSettings._handleUserActivity | `game.webrtc.settings._handleUserActivity`}'s second argument,
     * which has no default and has `in` checks applied.
     */
    av: AVSettings.Data;
  }>;

  interface ActivityData extends _ActivityData {}

  /** @internal */
  type _BroadcastActivityOptions = NullishProps<{
    /**
     * If undefined, volatile is inferred from the activity data.
     * @remarks The update is assumed volatile if it has `av`, `targets`, or `ping` data,
     *  lacks a `sceneId`, or has `ruler` data of exactly `null`
     */
    volatile: boolean;
  }>;

  interface BroadcastActivityOptions extends _BroadcastActivityOptions {}

  /** @internal */
  type _HasRoleOptions = NullishProps<{
    /**
     * Require the role match to be exact
     * @defaultValue `false`
     */
    exact?: boolean | undefined;
  }>;

  interface HasRoleOptions extends _HasRoleOptions {}

  /** @internal */
  type _AssignHotbarMacroOptions = NullishProps<{
    /**
     * An optional origin slot from which the Macro is being shifted
     * @remarks No default value, and non-numeric values are ignored
     */
    fromSlot: number;
  }>;

  interface AssignHotbarMacroOptions extends _AssignHotbarMacroOptions {}

  /** The data {@link User.getHotbarMacros | `User#getHotbarMacros`} returns for each of the 10 entries in its returned array */
  interface GetHotbarMacrosData {
    slot: number;
    macro: Macro.Implementation | null;
  }

  type ActionPermission = keyof typeof CONST.USER_PERMISSIONS | CONST.USER_ROLE_NAMES | CONST.USER_ROLES;

  interface QueryOptions {
    /**
     * The timeout in milliseconds
     */
    timeout?: number | undefined;
  }

  type QueryName = keyof typeof CONFIG.queries;
  type QueryData<QueryName extends User.QueryName> = Parameters<(typeof CONFIG.queries)[QueryName]>[0];
  type QueryReturn<QueryName extends User.QueryName> = Awaited<ReturnType<(typeof CONFIG.queries)[QueryName]>>;

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
 * The client-side User document which extends the common BaseUser model.
 * Each User document contains UserData which defines its data schema.
 *
 * @see {@linkcode Users}          The world-level collection of User documents
 * @see {@linkcode UserConfig}     The User configuration application
 */
declare class User extends BaseUser.Internal.ClientDocument {
  /**
   * @param data    - Initial data from which to construct the `User`
   * @param context - Construction context options
   */
  constructor(data: User.CreateData, context?: User.ConstructionContext);

  /**
   * Track whether the user is currently active in the game
   * @defaultValue `false`
   */
  active: boolean;

  /**
   * Track references to the current set of Tokens which are targeted by the User
   * @defaultValue `new foundry.canvas.placeables.tokens.UserTargets(this)`
   */
  targets: UserTargets;

  /**
   * Track the ID of the Scene that is currently being viewed by the User
   * @defaultValue `null`
   */
  viewedScene: string | null;

  /**
   * Track the Token documents that this User is currently moving.
   * @remarks foundry marks as `@readonly`
   */
  movingTokens: Set<TokenDocument.Implementation>;

  /**
   * A flag for whether the current User is a Trusted Player
   */
  get isTrusted(): boolean;

  /**
   * A flag for whether this User is the connected client
   */
  get isSelf(): boolean;

  /**
   * Is this User the active GM?
   */
  get isActiveGM(): boolean;

  /**
   * A localized label for this User's role.
   */
  get roleLabel(): string;

  /**
   * The timestamp of the lats observed activity for the user.
   */
  get lastActivityTime(): number;

  set lastActivityTime(timestamp: number);

  override prepareDerivedData(): void;

  /**
   * Is this User the designated User among the Users that satisfy the given condition?
   * This function calls {@linkcode foundry.documents.collections.Users.getDesignatedUser | `foundry.documents.collections.Users#getDesignatedUser`} and compares the designated User
   * to this User.
   * @example
   * // Is the current User the designated User to create Tokens?
   * ```js
   * const isDesignated = game.user.isDesignated(user => user.active && user.can("TOKEN_CREATE"));
   * ```
   * @param condition - The condition the Users must satisfy
   * @returns Is designated User?
   */
  isDesignated(condition: (user: User.Implementation) => boolean): boolean;

  /**
   * @remarks Doesn't exist prior to data prep, set in {@link User.prepareDerivedData | `User#prepareDerivedData`}
   * @defaultValue `this.color.multiply(2)`
   */
  border?: Color;

  /**
   * Assign a Macro to a numbered hotbar slot between 1 and 50
   * @param macro    - The Macro document to assign
   * @param slot     - A specific numbered hotbar slot to fill
   * @returns A Promise which resolves once the User update is complete
   * @remarks
   * Passing `null` for `macro` requires passing a `slot` to clear.
   *
   * `slot` defaults to the first unused slot if not provided. Slots are `1`-indexed.
   * @throws If `slot` is provided and either less than `1` or more than `50`, or not provided when there's no open slots
   */
  assignHotbarMacro(
    macro: Macro.Implementation | null,
    slot?: `${number}` | number,
    options?: User.AssignHotbarMacroOptions,
  ): Promise<this | undefined>;

  /**
   * Assign a specific boolean permission to this user.
   * Modifies the user permissions to grant or restrict access to a feature.
   *
   * @param permission - The permission name from USER_PERMISSIONS
   * @param allowed    - Whether to allow or restrict the permission
   * @remarks
   * @throws If the calling user is not at least an Assistant GM
   */
  assignPermission(permission: keyof typeof CONST.USER_PERMISSIONS, allowed: boolean): Promise<this | undefined>;

  /**
   * Submit User activity data to the server for broadcast to other players.
   * This type of data is transient, persisting only for the duration of the session and not saved to any database.
   * Activity data uses a volatile event to prevent unnecessary buffering if the client temporarily loses connection.
   * @param activityData - An object of User activity data to submit to the server for broadcast. (default: `{}`)
   */
  broadcastActivity(activityData?: User.ActivityData, options?: User.BroadcastActivityOptions): void;

  /**
   * Get an Array of Macro Documents on this User's Hotbar by page
   * @param page - The hotbar page number (default: `1`)
   * @remarks Core's implementation hardcodes returning 10 results at a time (single page of the hotbar)
   */
  getHotbarMacros(page?: number): User.GetHotbarMacrosData[];

  /**
   * Update the set of Token targets for the user given an array of provided Token ids.
   * This function handles changes made elsewhere and does not broadcast to other connected clients.
   * @param targetIds - An array of Token ids which represents the new target set (default: `[]`)
   */
  protected _onUpdateTokenTargets(targetIds?: string[]): void;

  /**
   * Query this user
   * @param queryName    - The query name (must be registered in `CONFIG.queries`)
   * @param queryData    - The query data (must be JSON-serializable)
   * @param queryOptions - The query options
   * @returns The query result
   */
  query<QueryName extends User.QueryName>(
    queryName: QueryName,
    queryData: User.QueryData<QueryName>,
    { timeout }?: User.QueryOptions,
  ): Promise<User.QueryReturn<QueryName>>;

  // _onUpdate and _onDelete are overridden but with no signature changes.
  // For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.

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

  // Descendant Document operations have been left out because User does not have any descendant documents.

  static override defaultName(context?: User.DefaultNameContext): string;

  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends User.CreateDialogOptions | undefined = undefined,
  >(
    data?: User.CreateDialogData,
    createOptions?: User.Database2.CreateDocumentsOperation<Temporary>,
    options?: Options,
  ): Promise<User.CreateDialogReturn<Temporary, Options>>;

  /**
   * @deprecated "The `ClientDocument.createDialog` signature has changed. It now accepts database operation options in its second
   * parameter, and options for {@linkcode DialogV2.prompt} in its third parameter." (since v13, until v15)
   *
   * @see {@linkcode User.CreateDialogDeprecatedOptions}
   */
  static override createDialog<
    Temporary extends boolean | undefined = undefined,
    Options extends User.CreateDialogOptions | undefined = undefined,
  >(
    data: User.CreateDialogData,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    createOptions: User.CreateDialogDeprecatedOptions<Temporary>,
    options?: Options,
  ): Promise<User.CreateDialogReturn<Temporary, Options>>;

  override deleteDialog<Options extends DialogV2.ConfirmConfig | undefined = undefined>(
    options?: Options,
    operation?: User.Database2.DeleteOneDocumentOperation,
  ): Promise<User.DeleteDialogReturn<Options>>;

  /**
   * @deprecated "`options` is now an object containing entries supported by {@linkcode DialogV2.confirm | DialogV2.confirm}."
   * (since v13, until v15)
   *
   * @see {@linkcode Document.DeleteDialogDeprecatedConfig}
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  override deleteDialog<Options extends Document.DeleteDialogDeprecatedConfig | undefined = undefined>(
    options?: Options,
    operation?: User.Database2.DeleteOneDocumentOperation,
  ): Promise<User.DeleteDialogReturn<Options>>;

  static override fromDropData(data: User.DropData): Promise<User.Implementation | undefined>;

  static override fromImport(
    source: User.Source,
    context?: Document.FromImportContext<User.Parent> | null,
  ): Promise<User.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  // Embedded document operations have been left out because User does not have any embedded documents.
}

export default User;
