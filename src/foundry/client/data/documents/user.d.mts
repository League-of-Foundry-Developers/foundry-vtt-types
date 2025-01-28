import type { ConfiguredDocumentClass } from "../../../../types/documentConfiguration.d.mts";
import type { AnyObject, FixedInstanceType, InexactPartial } from "../../../../utils/index.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type { BaseActor } from "../../../common/documents/_module.d.mts";

declare global {
  namespace User {
    /**
     * The implementation of the User document instance configured through `CONFIG.User.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredUser | `configuration/ConfiguredUser`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"User">;

    /**
     * The implementation of the User document configured through `CONFIG.User.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"User">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"User"> {}

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = null;

    /**
     * An instance of `User` that comes from the database.
     */
    interface Stored extends Document.Stored<User.Implementation> {}

    /**
     * The data put in {@link Document._source | `Document._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link User._source | `User._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

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
      flags: fields.ObjectField.FlagsField<"User">;

      /**
       * An object of creation and access information
       * @defaultValue see {@link fields.DocumentStatsField}
       */
      _stats: fields.DocumentStatsField;
    }

    namespace DatabaseOperation {
      /** Options passed along in Get operations for Users */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<User.Parent> {}
      /** Options passed along in Create operations for Users */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<User.CreateData, User.Parent, Temporary> {}
      /** Options passed along in Delete operations for Users */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<User.Parent> {}
      /** Options passed along in Update operations for Users */
      interface Update extends foundry.abstract.types.DatabaseUpdateOperation<User.UpdateData, User.Parent> {}

      /** Options for {@link User.createDocuments} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link User._preCreateOperation} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link User#_preCreate} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link User#_onCreate} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link User.updateDocuments} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link User._preUpdateOperation} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link User#_preUpdate} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link User#_onUpdate} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link User.deleteDocuments} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link User._preDeleteOperation} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link User#_preDelete} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link User#_onDelete} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    // Note(LukeAbby): This namespace exists to break cycles because of extensive usage of `User` in
    // the `Document` class itself.
    namespace Internal {
      type ImplementationClass = ConfiguredDocumentClass["User"];
      type Implementation = FixedInstanceType<ConfiguredDocumentClass["User"]>;
    }

    interface PingData {
      /**
       * Pulls all connected clients' views to the pinged co-ordinates.
       */
      pull?: false | undefined;

      /**
       * The ping style, see CONFIG.Canvas.pings.
       */
      style: string;

      /**
       * The ID of the scene that was pinged.
       */
      scene: string;

      /**
       * The zoom level at which the ping was made.
       */
      zoom: number;
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
      av: AVSettingsData;
    }

    /**
     * @deprecated - {@link User.DatabaseOperation}
     */
    interface DatabaseOperations extends Document.Database.Operations<User> {}

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
   * @see {@link Users}             The world-level collection of User documents
   * @see {@link UserConfig}     The User configuration application
   */
  class User extends ClientDocumentMixin(foundry.documents.BaseUser) {
    static override metadata: User.Metadata;

    static get implementation(): User.ImplementationClass;

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
  }
}
