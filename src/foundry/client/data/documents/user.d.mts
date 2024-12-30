import type { InexactPartial } from "../../../../utils/index.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";
import type BaseUser from "../../../common/documents/user.d.mts";

declare global {
  namespace User {
    type Metadata = Document.MetadataFor<User>;

    type ConfiguredClass = Document.ConfiguredClassForName<"User">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"User">;

    interface DatabaseOperations extends DocumentDatabaseOperations<User> {}

    // Helpful aliases
    type ConstructorData = BaseUser.ConstructorData;
    type UpdateData = BaseUser.UpdateData;
    type Schema = BaseUser.Schema;
    type Source = BaseUser.Source;

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

    static get implementation(): User.ConfiguredClass;

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
      macro: Macro.ConfiguredInstance | null,
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
    getHotbarMacros(page?: number): Array<{ slot: number; macro: Macro.ConfiguredInstance | null }>;

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
