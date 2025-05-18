import type { ConfiguredDocumentClass } from "../../../../types/documentConfiguration.d.mts";
import type { AnyObject, FixedInstanceType, InexactPartial, Merge, NullishProps } from "fvtt-types/utils";
import type Document from "#common/abstract/document.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { BaseActor } from "#common/documents/_module.d.mts";

import fields = foundry.data.fields;

declare global {
  namespace User {
    /**
     * The document's name.
     */
    type Name = "User";

    /**
     * The arguments to construct the document.
     */
    type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

    /**
     * The documents embedded within `User`.
     */
    type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

    /**
     * The implementation of the `User` document instance configured through `CONFIG.User.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredUser | `fvtt-types/configuration/ConfiguredUser`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<Name>;

    /**
     * The implementation of the `User` document configured through `CONFIG.User.documentClass` in Foundry and
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
     * The world collection that contains `User`s. Will be `never` if none exists.
     */
    type CollectionClass = Users.ConfiguredClass;

    /**
     * The world collection that contains `User`s. Will be `never` if none exists.
     */
    type Collection = Users.Configured;

    /**
     * An instance of `User` that comes from the database but failed validation meaining that
     * its `system` and `_source` could theoretically be anything.
     */
    interface Invalid extends Document.Invalid<User.Implementation> {}

    /**
     * An instance of `User` that comes from the database.
     */
    interface Stored extends Document.Stored<User.Implementation> {}

    /**
     * The data put in {@link User._source | `User#_source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     */
    interface Source extends fields.SchemaField.SourceData<Schema> {}

    /**
     * @deprecated {@link User.Source | `User.Source`}
     */
    type PersistedData = Source;

    /**
     * The data necessary to create a document. Used in places like {@link User.create | `User.create`}
     * and {@link User | `new User(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link User.name | `User#name`}.
     *
     * This is data transformed from {@link User.Source | `User.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link User.update | `User#update`}.
     * It is a distinct type from {@link User.CreateData | `DeepPartial<User.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link User | `User`}. This is the source of truth for how an User document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link User | `User`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
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
      name: fields.StringField<{ required: true; blank: false; textSearch: true }, string>;

      /**
       * The user's role, see CONST.USER_ROLES.
       * @defaultValue `CONST.USER_ROLES.PLAYER`
       */
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
       * @defaultValue `""`
       */
      passwordSalt: fields.StringField;

      /**
       * The user's avatar image.
       * @defaultValue `null`
       */
      avatar: fields.FilePathField<{ categories: "IMAGE"[] }>;

      /**
       * A linked Actor document that is this user's impersonated character.
       * @defaultValue `null`
       */
      character: fields.ForeignDocumentField<typeof BaseActor>;

      /**
       * A color to represent this user.
       * @defaultValue a randomly chosen color string
       */
      color: fields.ColorField<{ required: true; nullable: false; initial: () => string }>;

      /**
       *
       */
      pronouns: fields.StringField<{ required: true }>;

      /**
       * A mapping of hotbar slot number to Macro id for the user.
       * @defaultValue `{}`
       */
      hotbar: fields.ObjectField<
        {
          required: true;
          validate: (bar: AnyObject) => boolean;
          validationError: "must be a mapping of slots to macro identifiers";
        },
        Record<number, string>,
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
        InexactPartial<Permissions> | null | undefined,
        InexactPartial<Permissions>,
        InexactPartial<Permissions>
      >;

      /**
       * An object of optional key/value flags.
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
      /** Options passed along in Get operations for Users */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<User.Parent> {}

      /** Options passed along in Create operations for Users */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<User.CreateData, User.Parent, Temporary> {}

      /** Options passed along in Delete operations for Users */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<User.Parent> {}

      /** Options passed along in Update operations for Users */
      interface Update extends foundry.abstract.types.DatabaseUpdateOperation<User.UpdateData, User.Parent> {}

      /** Operation for {@link User.createDocuments | `User.createDocuments`} */
      interface CreateDocumentsOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<User.Database.Create<Temporary>> {}

      /** Operation for {@link User.updateDocuments | `User.updateDocuments`} */
      interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<User.Database.Update> {}

      /** Operation for {@link User.deleteDocuments | `User.deleteDocuments`} */
      interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<User.Database.Delete> {}

      /** Operation for {@link User.create | `User.create`} */
      interface CreateOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<User.Database.Create<Temporary>> {}

      /** Operation for {@link User.update | `User#update`} */
      interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

      interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

      /** Options for {@link User.get | `User.get`} */
      interface GetOptions extends Document.Database.GetOptions {}

      /** Options for {@link User._preCreate | `User#_preCreate`} */
      interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

      /** Options for {@link User._onCreate | `User#_onCreate`} */
      interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

      /** Operation for {@link User._preCreateOperation | `User._preCreateOperation`} */
      interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<User.Database.Create> {}

      /** Operation for {@link User._onCreateOperation | `User#_onCreateOperation`} */
      interface OnCreateOperation extends User.Database.Create {}

      /** Options for {@link User._preUpdate | `User#_preUpdate`} */
      interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

      /** Options for {@link User._onUpdate | `User#_onUpdate`} */
      interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

      /** Operation for {@link User._preUpdateOperation | `User._preUpdateOperation`} */
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

      /** Context for {@link User._onDeleteOperation | `User._onDeleteOperation`} */
      interface OnDeleteDocumentsContext extends Document.ModificationContext<User.Parent> {}

      /** Context for {@link User._onCreateDocuments | `User._onCreateDocuments`} */
      interface OnCreateDocumentsContext extends Document.ModificationContext<User.Parent> {}

      /** Context for {@link User._onUpdateDocuments | `User._onUpdateDocuments`} */
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
         * @remarks Overriden with `"arrow"` if the position of the ping is outside the viewport
         *
         * Overridden with `CONFIG.Canvas.pings.types.PULL` (`"chevron"` by default) if photosensitive mode is enabled and the ping is within the viewport
         */
        style: Ping.ConfiguredStyles;
      }>;

    /** @privateRemarks Only consumed by {@link ControlsLayer#handlePing} */
    interface PingData extends _PingData {
      /**
       * The ID of the scene that was pinged.
       */
      scene: string;
    }

    interface ActivityData {
      /** The ID of the scene that the user is viewing. */
      sceneId: string | null;

      /** The position of the user's cursor. */
      cursor: { x: number; y: number } | null;

      /** The state of the user's ruler, if they are currently using one. */
      ruler: Ruler.MeasurementData | null;

      /** The IDs of the tokens the user has targeted in the currently viewed */
      targets: string[];

      /** Whether the user has an open WS connection to the server or not. */
      active: boolean;

      /** Is the user emitting a ping at the cursor coordinates? */
      ping: PingData;

      /** The state of the user's AV settings. */
      av: AVSettings.Data;
    }

    interface HasRoleOptions {
      /**
       * Require the role match to be exact
       * @defaultValue `false`
       */
      exact?: boolean | undefined;
    }

    type UUID = `User.${string}` | `${string}.User.${string}`;

    /**
     * @deprecated {@link User.Database | `User.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<User.Implementation> {}

    /**
     * @deprecated {@link User.CreateData | `User.CreateData`}
     */
    interface ConstructorData extends User.CreateData {}

    /**
     * @deprecated {@link User.implementation | `User.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link User.Implementation | `User.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side User document which extends the common BaseUser model.
   * Each User document contains UserData which defines its data schema.
   *
   * @see {@link Users | `Users`}             The world-level collection of User documents
   * @see {@link UserConfig | `UserConfig`}     The User configuration application
   */
  class User extends ClientDocumentMixin(foundry.documents.BaseUser) {
    /**
     * @param data    - Initial data from which to construct the `User`
     * @param context - Construction context options
     */
    constructor(...args: User.ConstructorArgs);

    /**
     * Track whether the user is currently active in the game
     * @defaultValue `false`
     */
    active: boolean;

    /**
     * Track references to the current set of Tokens which are targeted by the User
     */
    targets: UserTargets;

    /**
     * Track the ID of the Scene that is currently being viewed by the User
     * @defaultValue `null`
     */
    viewedScene: string | null;

    /**
     * A flag for whether the current User is a Trusted Player
     */
    get isTrusted(): boolean;

    /**
     * A flag for whether this User is the connected client
     */
    get isSelf(): boolean;

    override prepareDerivedData(): void;

    /**
     * Assign a Macro to a numbered hotbar slot between 1 and 50
     * @param macro    - The Macro document to assign
     * @param slot     - A specific numbered hotbar slot to fill
     * @param fromSlot - An optional origin slot from which the Macro is being shifted
     * @returns A Promise which resolves once the User update is complete
     */
    assignHotbarMacro(
      macro: Macro.Implementation | null,
      slot: string | number,
      { fromSlot }?: InexactPartial<{ fromSlot: number }>,
    ): Promise<this>;

    /**
     * Assign a specific boolean permission to this user.
     * Modifies the user permissions to grant or restrict access to a feature.
     *
     * @param permission - The permission name from USER_PERMISSIONS
     * @param allowed    - Whether to allow or restrict the permission
     */
    assignPermission(permission: keyof typeof CONST.USER_PERMISSIONS, allowed: boolean): Promise<this>;

    /**
     * Submit User activity data to the server for broadcast to other players.
     * This type of data is transient, persisting only for the duration of the session and not saved to any database.
     * Activity data uses a volatile event to prevent unnecessary buffering if the client temporarily loses connection.
     * @param activityData - An object of User activity data to submit to the server for broadcast.
     *                       (default: `{}`)
     */
    broadcastActivity(
      activityData?: InexactPartial<User.ActivityData>,
      options?: InexactPartial<{
        /**
         * If undefined, volatile is inferred from the activity data
         */
        volatile: boolean;
      }>,
    ): void;

    /**
     * Get an Array of Macro Documents on this User's Hotbar by page
     * @param page - The hotbar page number
     *               (default: `1`)
     */
    getHotbarMacros(page?: number): Array<{ slot: number; macro: Macro.Implementation | null }>;

    /**
     * Update the set of Token targets for the user given an array of provided Token ids.
     * @param targetIds - An array of Token ids which represents the new target set
     *                    (default: `[]`)
     */
    updateTokenTargets(targetIds?: string[]): void;

    /**
     * @privateRemarks _onUpdate and _onDelete are overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

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

    static override defaultName(context?: Document.DefaultNameContext<string, User.Parent>): string;

    static override createDialog(
      data?: Document.CreateDialogData<User.CreateData>,
      context?: Document.CreateDialogContext<string, User.Parent>,
    ): Promise<User.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<User.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<User.Implementation | undefined>;

    static override fromImport(
      source: User.Source,
      context?: Document.FromImportContext<User.Parent>,
    ): Promise<User.Implementation>;

    // Embedded document operations have been left out because User does not have any embedded documents.
  }
}
