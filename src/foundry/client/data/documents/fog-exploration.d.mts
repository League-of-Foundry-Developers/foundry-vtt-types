import type { Identity, InexactPartial, MaybePromise, IntentionalPartial, Merge, NullishProps } from "fvtt-types/utils";
import type { documents } from "../../../client-esm/client.d.mts";
import type { DatabaseGetOperation } from "../../../common/abstract/_types.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";

declare global {
  namespace FogExploration {
    /**
     * The document's name.
     */
    type Name = "FogExploration";

    /**
     * The arguments to construct the document.
     */
    type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

    /**
     * The documents embedded within `FogExploration`.
     */
    type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

    /**
     * The implementation of the `FogExploration` document instance configured through `CONFIG.FogExploration.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredFogExploration | `fvtt-types/configuration/ConfiguredFogExploration`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<Name>;

    /**
     * The implementation of the `FogExploration` document configured through `CONFIG.FogExploration.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
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
          name: "FogExploration";
          collection: "fog";
          label: string;
          labelPlural: string;
          isPrimary: true;
          permissions: Metadata.Permissions;
          schemaVersion: string;
        }>
      > {}

    namespace Metadata {
      /**
       * The permissions for whether a certain user can create, update, or delete this document.
       */
      interface Permissions {
        create: "PLAYER";
        update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
        delete(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
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
     * This is a fixed string per document type and is primarily useful for {@link ClientDocumentMixin | `Descendant Document Events`}.
     */
    type ParentCollectionName = Metadata["collection"];

    /**
     * The world collection that contains `FogExploration`s. Will be `never` if none exists.
     */
    type CollectionClass = FogExplorations.ConfiguredClass;

    /**
     * The world collection that contains `FogExploration`s. Will be `never` if none exists.
     */
    type Collection = FogExplorations.Configured;

    /**
     * An instance of `FogExploration` that comes from the database but failed validation meaning that
     * its `system` and `_source` could theoretically be anything.
     */
    interface Invalid extends Document.Invalid<FogExploration.Implementation> {}

    /**
     * An instance of `FogExploration` that comes from the database.
     */
    interface Stored extends Document.Stored<FogExploration.Implementation> {}

    /**
     * The data put in {@link FogExploration._source | `FogExploration#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     */
    interface Source extends fields.SchemaField.SourceData<Schema> {}

    /**
     * @deprecated {@link FogExploration.Source | `FogExploration.Source`}
     */
    type PersistedData = Source;

    /**
     * The data necessary to create a document. Used in places like {@link FogExploration.create | `FogExploration.create`}
     * and {@link FogExploration | `new FogExploration(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
     * {@link FogExploration.name | `FogExploration#name`}.
     *
     * This is data transformed from {@link FogExploration.Source | `FogExploration.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link FogExploration.update | `FogExploration#update`}.
     * It is a distinct type from {@link FogExploration.CreateData | `DeepPartial<FogExploration.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link FogExploration | `FogExploration`}. This is the source of truth for how an FogExploration document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link FogExploration | `FogExploration`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this FogExploration document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /**
       * The _id of the Scene document to which this fog applies
       * @defaultValue `canvas?.scene?.id`
       */
      scene: fields.ForeignDocumentField<typeof documents.BaseScene, { initial: () => string | undefined }>;

      /**
       * The _id of the User document to which this fog applies
       * @defaultValue `null`
       */
      user: fields.ForeignDocumentField<typeof documents.BaseUser, { initial: () => string }>;

      /**
       * The base64 image/jpeg of the explored fog polygon
       * @defaultValue `null`
       */
      explored: fields.FilePathField<{ categories: ["IMAGE"]; required: true; base64: true }>;

      /**
       * The object of scene positions which have been explored at a certain vision radius
       * @defaultValue `{}`
       */
      positions: fields.ObjectField;

      /**
       * The timestamp at which this fog exploration was last updated
       * @defaultValue `Date.now()`
       */
      timestamp: fields.NumberField<{ nullable: false; initial: ReturnType<typeof Date.now> }>;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<Name>;

      _stats: fields.DocumentStatsField;
    }

    namespace Database {
      /** Options passed along in Get operations for FogExplorations */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<FogExploration.Parent> {}

      /** Options passed along in Create operations for FogExplorations */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          FogExploration.CreateData,
          FogExploration.Parent,
          Temporary
        > {
        loadFog?: boolean;
      }

      /** Options passed along in Delete operations for FogExplorations */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<FogExploration.Parent> {
        loadFog?: boolean;
      }

      /** Options passed along in Update operations for FogExplorations */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<FogExploration.UpdateData, FogExploration.Parent> {
        loadFog?: boolean;
      }

      /** Operation for {@link FogExploration.createDocuments | `FogExploration.createDocuments`} */
      interface CreateDocumentsOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<FogExploration.Database.Create<Temporary>> {}

      /** Operation for {@link FogExploration.updateDocuments | `FogExploration.updateDocuments`} */
      interface UpdateDocumentsOperation
        extends Document.Database.UpdateDocumentsOperation<FogExploration.Database.Update> {}

      /** Operation for {@link FogExploration.deleteDocuments | `FogExploration.deleteDocuments`} */
      interface DeleteDocumentsOperation
        extends Document.Database.DeleteDocumentsOperation<FogExploration.Database.Delete> {}

      /** Operation for {@link FogExploration.create | `FogExploration.create`} */
      interface CreateOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<FogExploration.Database.Create<Temporary>> {}

      /** Operation for {@link FogExploration.update | `FogExploration#update`} */
      interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

      interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

      /** Options for {@link FogExploration.get | `FogExploration.get`} */
      interface GetOptions extends Document.Database.GetOptions {}

      /** Options for {@link FogExploration._preCreate | `FogExploration#_preCreate`} */
      interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

      /** Options for {@link FogExploration._onCreate | `FogExploration#_onCreate`} */
      interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

      /** Operation for {@link FogExploration._preCreateOperation | `FogExploration._preCreateOperation`} */
      interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<FogExploration.Database.Create> {}

      /** Operation for {@link FogExploration._onCreateOperation | `FogExploration#_onCreateOperation`} */
      interface OnCreateOperation extends FogExploration.Database.Create {}

      /** Options for {@link FogExploration._preUpdate | `FogExploration#_preUpdate`} */
      interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

      /** Options for {@link FogExploration._onUpdate | `FogExploration#_onUpdate`} */
      interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

      /** Operation for {@link FogExploration._preUpdateOperation | `FogExploration._preUpdateOperation`} */
      interface PreUpdateOperation extends FogExploration.Database.Update {}

      /** Operation for {@link FogExploration._onUpdateOperation | `FogExploration._preUpdateOperation`} */
      interface OnUpdateOperation extends FogExploration.Database.Update {}

      /** Options for {@link FogExploration._preDelete | `FogExploration#_preDelete`} */
      interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

      /** Options for {@link FogExploration._onDelete | `FogExploration#_onDelete`} */
      interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

      /** Options for {@link FogExploration._preDeleteOperation | `FogExploration#_preDeleteOperation`} */
      interface PreDeleteOperation extends FogExploration.Database.Delete {}

      /** Options for {@link FogExploration._onDeleteOperation | `FogExploration#_onDeleteOperation`} */
      interface OnDeleteOperation extends FogExploration.Database.Delete {}

      /** Context for {@link FogExploration._onDeleteOperation | `FogExploration._onDeleteOperation`} */
      interface OnDeleteDocumentsContext extends Document.ModificationContext<FogExploration.Parent> {}

      /** Context for {@link FogExploration._onCreateDocuments | `FogExploration._onCreateDocuments`} */
      interface OnCreateDocumentsContext extends Document.ModificationContext<FogExploration.Parent> {}

      /** Context for {@link FogExploration._onUpdateDocuments | `FogExploration._onUpdateDocuments`} */
      interface OnUpdateDocumentsContext extends Document.ModificationContext<FogExploration.Parent> {}

      /**
       * Options for {@link FogExploration._preCreateDescendantDocuments | `FogExploration#_preCreateDescendantDocuments`}
       * and {@link FogExploration._onCreateDescendantDocuments | `FogExploration#_onCreateDescendantDocuments`}
       */
      interface CreateOptions extends Document.Database.CreateOptions<FogExploration.Database.Create> {}

      /**
       * Options for {@link FogExploration._preUpdateDescendantDocuments | `FogExploration#_preUpdateDescendantDocuments`}
       * and {@link FogExploration._onUpdateDescendantDocuments | `FogExploration#_onUpdateDescendantDocuments`}
       */
      interface UpdateOptions extends Document.Database.UpdateOptions<FogExploration.Database.Update> {}

      /**
       * Options for {@link FogExploration._preDeleteDescendantDocuments | `FogExploration#_preDeleteDescendantDocuments`}
       * and {@link FogExploration._onDeleteDescendantDocuments | `FogExploration#_onDeleteDescendantDocuments`}
       */
      interface DeleteOptions extends Document.Database.DeleteOptions<FogExploration.Database.Delete> {}
    }

    /**
     * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
     */
    interface Flags extends Document.ConfiguredFlagsForName<Name> {}

    namespace Flags {
      /**
       * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
       */
      type Scope = Document.FlagKeyOf<Flags>;

      /**
       * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
       */
      type Key<Scope extends Flags.Scope> = Document.FlagKeyOf<Document.FlagGetKey<Flags, Scope>>;

      /**
       * Gets the type of a particular flag given a `Scope` and a `Key`.
       */
      type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.GetFlag<Name, Scope, Key>;
    }

    /**
     * @deprecated {@link FogExploration.Database | `FogExploration.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<FogExploration.Implementation> {}

    /**
     * @deprecated {@link FogExploration.CreateData | `FogExploration.CreateData`}
     */
    interface ConstructorData extends FogExploration.CreateData {}

    /**
     * @deprecated {@link FogExploration.implementation | `FogExploration.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link FogExploration.Implementation | `FogExploration.Implementation`}
     */
    type ConfiguredInstance = Implementation;

    /** @internal */
    type _LoadQuery = NullishProps<{
      /**
       * A certain Scene ID
       * @defaultValue `canvas.scene`
       */
      scene: string;

      /**
       * A certain User ID
       * @defaultValue `game.user`
       */
      user: string;
    }>;
    interface LoadQuery extends _LoadQuery {}

    /** @remarks {@link FogExploration.load | `#load`} takes the `query` property separately as its first argument, then merges later*/
    interface LoadOptions extends Omit<IntentionalPartial<DatabaseGetOperation>, "query"> {}
  }

  /**
   * The client-side FogExploration document which extends the common BaseFogExploration model.
   */
  class FogExploration extends ClientDocumentMixin(foundry.documents.BaseFogExploration) {
    /**
     * @param data    - Initial data from which to construct the `FogExploration`
     * @param context - Construction context options
     */
    constructor(...args: FogExploration.ConstructorArgs);

    /**
     * Obtain the fog of war exploration progress for a specific Scene and User.
     * @param query      - Parameters for which FogExploration document is retrieved
     * @param options    - Additional options passed to DatabaseBackend#get.
     *                     (default: `{}`)
     * @returns
     */
    static load(
      query?: FogExploration.LoadQuery,
      options?: InexactPartial<DatabaseGetOperation>,
    ): Promise<FogExploration.Implementation | null>;

    /**
     * Transform the explored base64 data into a PIXI.Texture object
     */
    getTexture(): PIXI.Texture | null;

    // _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes from BaseFogExploration.

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

    // Descendant Document operations have been left out because FogExploration does not have any descendant documents.

    static override defaultName(context?: Document.DefaultNameContext<string, FogExploration.Parent>): string;

    static override createDialog(
      data?: FogExploration.CreateData,
      context?: Document.CreateDialogContext<string, FogExploration.Parent>,
    ): Promise<FogExploration.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<FogExploration.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<FogExploration.Implementation | undefined>;

    static override fromImport(
      source: FogExploration.Source,
      context?: Document.FromImportContext<FogExploration.Parent>,
    ): Promise<FogExploration.Implementation>;

    static override get(
      documentId: string,
      options?: FogExploration.Database.GetOptions,
    ): FogExploration.Implementation | null;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks "You are calling `FogExploration.get` by passing an object. This means you are probably trying to load Fog of War exploration data, an operation which has been renamed to {@link FogExploration.load | `FogExploration.load`}"
     */
    static override get(
      query: FogExploration.LoadQuery,
      options: FogExploration.LoadOptions,
    ): Promise<FogExploration.Implementation | null>;

    /** @remarks Not actually overridden, typed here to narrow from {@link ClientDocument._onClickDocumentLink | `ClientDocument#_onClickDocumentLink`} */
    override _onClickDocumentLink(event: MouseEvent): MaybePromise<NonNullable<this["sheet"]>>;
  }

  namespace FogExploration {
    interface Any extends AnyFogExploration {}
    interface AnyConstructor extends Identity<typeof AnyFogExploration> {}
  }
}

declare abstract class AnyFogExploration extends FogExploration {
  constructor(...args: never);
}
