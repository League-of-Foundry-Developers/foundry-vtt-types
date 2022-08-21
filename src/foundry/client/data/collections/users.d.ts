import { ConfiguredDocumentClass } from "../../../../types/helperTypes";

declare global {
  /**
   * The singleton collection of User documents which exist within the active World.
   * This Collection is accessible within the Game object as game.users.
   *
   * @see {@link User} The User document
   */
  class Users extends WorldCollection<typeof foundry.documents.BaseUser, "Users"> {
    constructor(data?: foundry.data.UserData["_source"][]);

    /**
     * The User document of the currently connected user
     * @defaultValue `null`
     */
    current: StoredDocument<InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseUser>>> | null;

    /**
     * Initialize the Map object and all its contained documents
     * @internal
     */
    protected override _initialize(): void;

    static override documentName: "User";

    /**
     * Get the users with player roles
     */
    get players(): ReturnType<this["filter"]>;

    /** @remarks This is not marked as protected because it is used in {@link Game#activateSocketListeners} */
    static _activateSocketListeners(socket: io.Socket): void;

    /**
     * Handle receipt of activity data from another User connected to the Game session
     * @param userId       - The User id who generated the activity data
     * @param activityData - The object of activity data
     *                       (default: `{}`)
     */
    protected static _handleUserActivity(userId: string, activityData?: ActivityData | undefined): void;
  }
}
