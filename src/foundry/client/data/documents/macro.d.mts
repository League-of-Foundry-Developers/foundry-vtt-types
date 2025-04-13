import type { ConfiguredMacro } from "../../../../configuration/index.d.mts";
import type { InexactPartial, Merge } from "fvtt-types/utils";
import type { documents } from "../../../client-esm/client.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type BaseMacro from "../../../common/documents/macro.d.mts";

declare global {
  namespace Macro {
    /**
     * The document's name.
     */
    type Name = "Macro";

    /**
     * The arguments to construct the document.
     */
    interface ConstructorArgs extends Document.ConstructorParameters<CreateData, Parent> {}

    /**
     * The documents embedded within Macro.
     */
    type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

    /**
     * The implementation of the Macro document instance configured through `CONFIG.Macro.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredMacro | `fvtt-types/configuration/ConfiguredMacro`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<Name>;

    /**
     * The implementation of the Macro document configured through `CONFIG.Macro.documentClass` in Foundry and
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
          name: "Macro";
          collection: "macros";
          indexed: true;
          compendiumIndexFields: ["_id", "name", "img", "sort", "folder"];
          label: string;
          labelPlural: string;
          coreTypes: CONST.MACRO_TYPES[];
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
        update(user: User.Internal.Implementation, doc: Implementation): boolean;
      }
    }

    type SubType = Game.Model.TypeNames<Name>;
    type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<Name>;
    type Known = Macro.OfType<Macro.ConfiguredSubTypes>;
    type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredMacro<Type>, Macro<Type>>;

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = null;

    /**
     * A document's descendants are any child documents, grandchild documents, etc.
     * This is a union of all instances, or never if the document doesn't have any descendants.
     */
    type Descendants = never;

    /**
     * A document's descendants are any child documents, grandchild documents, etc.
     * This is a union of all classes, or never if the document doesn't have any descendants.
     */
    type DescendantClasses = never;

    /**
     * Types of CompendiumCollection this document might be contained in.
     * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
     */
    type Pack = CompendiumCollection.ForDocument<"Scene">;

    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type Embedded = Document.ImplementationFor<EmbeddedName>;

    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type EmbeddedName = Document.EmbeddableNamesFor<Metadata>;

    type CollectionNameOf<CollectionName extends EmbeddedName> = CollectionName extends keyof Metadata["embedded"]
      ? Metadata["embedded"][CollectionName]
      : CollectionName;

    type EmbeddedCollectionName = Document.CollectionNamesFor<Metadata>;

    /**
     * The name of the world or embedded collection this document can find itself in.
     * For example an `Item` is always going to be inside a collection with a key of `items`.
     * This is a fixed string per document type and is primarily useful for {@link ClientDocumentMixin | `Descendant Document Events`}.
     */
    type ParentCollectionName = Metadata["collection"];

    /**
     * The world collection that contains `Macro`s. Will be `never` if none exists.
     */
    type CollectionClass = Macros.ConfiguredClass;

    /**
     * The world collection that contains `Folder`s. Will be `never` if none exists.
     */
    type Collection = Macros.Configured;

    /**
     * An instance of `Macro` that comes from the database.
     */
    interface Stored<out Subtype extends SubType = SubType> extends Document.Stored<OfType<Subtype>> {}

    /**
     * The data put in {@link Macro._source | `Macro#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link Macro._source | `Macro#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link Macro.create | `Macro.create`}
     * and {@link Macro | `new Macro(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
     * {@link Macro.name | `Macro#name`}.
     *
     * This is data transformed from {@link Macro.Source | `Macro.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link Macro.update | `Macro#update`}.
     * It is a distinct type from {@link Macro.CreateData | `DeepPartial<Macro.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link Macro | `Macro`}. This is the source of truth for how an Macro document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link Macro | `Macro`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
      /**
       * The _id which uniquely identifies this Macro document
       * @defaultValue `null`
       */
      _id: fields.DocumentIdField;

      /**
       * The name of this Macro
       * @defaultValue `""`
       */
      name: fields.StringField<{
        required: true;
        blank: false;
        label: "Name";
        textSearch: true;
      }>;

      /**
       * A Macro subtype from CONST.MACRO_TYPES
       * @defaultValue `CONST.MACRO_TYPES.CHAT`
       */
      type: fields.DocumentTypeField<
        typeof BaseMacro,
        {
          initial: typeof CONST.MACRO_TYPES.CHAT;
          label: "Type";
        }
      >;

      /**
       * The _id of a User document which created this Macro *
       * @defaultValue `game?.user?.id`
       */
      author: fields.ForeignDocumentField<typeof documents.BaseUser, { initial: () => string }>;

      /**
       * An image file path which provides the thumbnail artwork for this Macro
       * @defaultValue `BaseMacro.DEFAULT_ICON`
       */
      img: fields.FilePathField<{
        categories: ["IMAGE"];
        initial: () => typeof BaseMacro.DEFAULT_ICON;
        label: "Image";
      }>;

      /**
       * The scope of this Macro application from CONST.MACRO_SCOPES
       * @defaultValue `"global"`
       */
      scope: fields.StringField<{
        required: true;
        choices: CONST.MACRO_SCOPES[];
        initial: (typeof CONST.MACRO_SCOPES)[0];
        validationError: "must be a value in CONST.MACRO_SCOPES";
        label: "Scope";
      }>;

      /**
       * The string content of the macro command
       * @defaultValue `""`
       */
      command: fields.StringField<{
        required: true;
        blank: true;
        label: "Command";
      }>;

      /**
       * The _id of a Folder which contains this Macro
       * @defaultValue `null`
       */
      folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

      /**
       * The numeric sort value which orders this Macro relative to its siblings
       * @defaultValue `0`
       */
      sort: fields.IntegerSortField;

      /**
       * An object which configures ownership of this Macro
       * @defaultValue see {@link fields.DocumentOwnershipField | `fields.DocumentOwnershipField`}
       */
      ownership: fields.DocumentOwnershipField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<Name>;

      /**
       * An object of creation and access information
       * @defaultValue see {@link fields.DocumentStatsField | `fields.DocumentStatsField`}
       */
      _stats: fields.DocumentStatsField;
    }

    namespace Database {
      /** Options passed along in Get operations for Macros */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<Macro.Parent> {}

      /** Options passed along in Create operations for Macros */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<Macro.CreateData, Macro.Parent, Temporary> {}

      /** Options passed along in Delete operations for Macros */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Macro.Parent> {}

      /** Options passed along in Update operations for Macros */
      interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Macro.UpdateData, Macro.Parent> {}

      /** Operation for {@link Macro.createDocuments | `Macro.createDocuments`} */
      interface CreateDocumentsOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<Macro.Database.Create<Temporary>> {}

      /** Operation for {@link Macro.updateDocuments | `Macro.updateDocuments`} */
      interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Macro.Database.Update> {}

      /** Operation for {@link Macro.deleteDocuments | `Macro.deleteDocuments`} */
      interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Macro.Database.Delete> {}

      /** Operation for {@link Macro.create | `Macro.create`} */
      interface CreateOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<Macro.Database.Create<Temporary>> {}

      /** Operation for {@link Macro.update | `Macro#update`} */
      interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

      interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

      /** Options for {@link Macro.get | `Macro.get`} */
      interface GetOptions extends Document.Database.GetOptions {}

      /** Options for {@link Macro._preCreate | `Macro#_preCreate`} */
      interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

      /** Options for {@link Macro._onCreate | `Macro#_onCreate`} */
      interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

      /** Operation for {@link Macro._preCreateOperation | `Macro._preCreateOperation`} */
      interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Macro.Database.Create> {}

      /** Operation for {@link Macro._onCreateOperation | `Macro#_onCreateOperation`} */
      interface OnCreateOperation extends Macro.Database.Create {}

      /** Options for {@link Macro._preUpdate | `Macro#_preUpdate`} */
      interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

      /** Options for {@link Macro._onUpdate | `Macro#_onUpdate`} */
      interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

      /** Operation for {@link Macro._preUpdateOperation | `Macro._preUpdateOperation`} */
      interface PreUpdateOperation extends Macro.Database.Update {}

      /** Operation for {@link Macro._onUpdateOperation | `Macro._preUpdateOperation`} */
      interface OnUpdateOperation extends Macro.Database.Update {}

      /** Options for {@link Macro._preDelete | `Macro#_preDelete`} */
      interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

      /** Options for {@link Macro._onDelete | `Macro#_onDelete`} */
      interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

      /** Options for {@link Macro._preDeleteOperation | `Macro#_preDeleteOperation`} */
      interface PreDeleteOperation extends Macro.Database.Delete {}

      /** Options for {@link Macro._onDeleteOperation | `Macro#_onDeleteOperation`} */
      interface OnDeleteOperation extends Macro.Database.Delete {}

      /** Context for {@link Macro._onDeleteOperation | `Macro._onDeleteOperation`} */
      interface OnDeleteDocumentsContext extends Document.ModificationContext<Macro.Parent> {}

      /** Context for {@link Macro._onCreateDocuments | `Macro._onCreateDocuments`} */
      interface OnCreateDocumentsContext extends Document.ModificationContext<Macro.Parent> {}

      /** Context for {@link Macro._onUpdateDocuments | `Macro._onUpdateDocuments`} */
      interface OnUpdateDocumentsContext extends Document.ModificationContext<Macro.Parent> {}

      /**
       * Options for {@link Macro._preCreateDescendantDocuments | `Macro#_preCreateDescendantDocuments`}
       * and {@link Macro._onCreateDescendantDocuments | `Macro#_onCreateDescendantDocuments`}
       */
      interface CreateOptions extends Document.Database.CreateOptions<Macro.Database.Create> {}

      /**
       * Options for {@link Macro._preUpdateDescendantDocuments | `Macro#_preUpdateDescendantDocuments`}
       * and {@link Macro._onUpdateDescendantDocuments | `Macro#_onUpdateDescendantDocuments`}
       */
      interface UpdateOptions extends Document.Database.UpdateOptions<Macro.Database.Update> {}

      /**
       * Options for {@link Macro._preDeleteDescendantDocuments | `Macro#_preDeleteDescendantDocuments`}
       * and {@link Macro._onDeleteDescendantDocuments | `Macro#_onDeleteDescendantDocuments`}
       */
      interface DeleteOptions extends Document.Database.DeleteOptions<Macro.Database.Delete> {}
    }

    interface Flags extends Document.ConfiguredFlagsForName<Name> {}

    namespace Flags {
      type Scope = Document.FlagKeyOf<Flags>;
      type Key<Scope extends Flags.Scope> = Document.FlagKeyOf<Document.FlagGetKey<Flags, Scope>>;
      type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.GetFlag<Name, Scope, Key>;
    }

    interface Scope {
      /** An Actor who is the protagonist of the executed action. */
      actor: Actor;

      /**  A Token which is the protagonist of the executed action. */
      token: Token;

      /** An optional event passed to the executed macro. */
      event: Event | RegionDocument.RegionEvent;

      /**
       * @remarks Additional arguments passed as part of the scope
       */
      [arg: string]: unknown;
    }

    /**
     * @deprecated {@link Macro.Database | `Macro.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<Macro> {}

    /**
     * @deprecated {@link Macro.Types | `Macro.SubType`}
     */
    type TypeNames = Macro.SubType;

    /**
     * @deprecated {@link Macro.CreateData | `Macro.CreateData`}
     */
    interface ConstructorData extends Macro.CreateData {}

    /**
     * @deprecated {@link Macro.implementation | `Macro.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link Macro.Implementation | `Macro.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Macro document which extends the common BaseMacro model.
   *
   * @see {@link Macros | `Macros`}            The world-level collection of Macro documents
   * @see {@link MacroConfig | `MacroConfig`}       The Macro configuration application
   *
   * @param data - Initial data provided to construct the Macro document
   */
  class Macro<out SubType extends Macro.SubType = Macro.SubType> extends ClientDocumentMixin(
    foundry.documents.BaseMacro,
  )<SubType> {
    /**
     * @param data    - Initial data from which to construct the `Macro`
     * @param context - Construction context options
     */
    constructor(...args: Macro.ConstructorArgs);

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
     */
    canUserExecute(user: User.Implementation): boolean;

    /**
     * Execute the Macro command.
     * @param scope - Macro execution scope which is passed to script macros
     * @returns A promising containing a created {@link ChatMessage | `ChatMessage`} (or `undefined`) if a chat
     *          macro or the return value if a script macro. A void return is possible if the user
     *          is not permitted to execute macros or a script macro execution fails.
     */
    execute(scope?: InexactPartial<Macro.Scope>): Promise<ChatMessage | void> | Promise<unknown> | void;

    #executeScript();

    _onClickDocumentLink(event: MouseEvent): ReturnType<this["execute"]>;

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

    static override defaultName(context?: Document.DefaultNameContext<Macro.SubType, Macro.Parent>): string;

    static override createDialog(
      data?: Macro.CreateData,
      context?: Document.CreateDialogContext<Macro.SubType, Macro.Parent>,
    ): Promise<Macro.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<Macro.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<Macro.Implementation | undefined>;

    static override fromImport(
      source: Macro.Source,
      context?: Document.FromImportContext<Macro.Parent>,
    ): Promise<Macro.Implementation>;
  }
}
