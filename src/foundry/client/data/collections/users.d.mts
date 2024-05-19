import type { ConfiguredDocumentClass } from "../../../../types/helperTypes.d.mts";
import type { InexactPartial, StoredDocument } from "../../../../types/utils.d.mts";

declare global {
  /**
   * The singleton collection of User documents which exist within the active World.
   * This Collection is accessible within the Game object as game.users.
   *
   * @see {@link User} The User document
   */
  class Users extends WorldCollection<typeof foundry.documents.BaseUser, "Users"> {
    constructor(data?: User["_source"][]);

    /**
     * The User document of the currently connected user
     * @defaultValue `null`
     */
    current: StoredDocument<ConfiguredUser> | null;

    /**
     * Initialize the Map object and all its contained documents
     * @internal
     */
    protected _initialize(): void;

    static documentName: "User";

    /**
     * Get the users with player roles
     */
    get players(): ReturnType<this["filter"]>;

    /**
     * Get one User who is an active Gamemaster, or null if no active GM is available.
     * This can be useful for workflows which occur on all clients, but where only one user should take action.
     */
    get activeGM(): ConfiguredUser | null;

    /** @remarks This is not marked as protected because it is used in {@link Game#activateSocketListeners} */
    static _activateSocketListeners(socket: io.Socket): void;

    /**
     * Handle receipt of activity data from another User connected to the Game session
     * @param userId       - The User id who generated the activity data
     * @param activityData - The object of activity data
     *                       (default: `{}`)
     */
    protected static _handleUserActivity(userId: string, activityData?: InexactPartial<ActivityData> | undefined): void;
  }
}

type ConfiguredUser = InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseUser>>;
