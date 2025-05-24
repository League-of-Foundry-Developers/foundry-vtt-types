import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";

declare global {
  /**
   * The singleton collection of User documents which exist within the active World.
   * This Collection is accessible within the Game object as game.users.
   *
   * @see {@linkcode User} The User document
   */
  class Users extends WorldCollection<User.ImplementationClass, "Users"> {
    constructor(data?: User.Source[]);

    /**
     * The User document of the currently connected user
     * @defaultValue `null`
     */
    current: User.Stored | null;

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
     * Get one User who is an active Gamemaster (non-assistant if possible), or null if no active GM is available.
     * This can be useful for workflows which occur on all clients, but where only one user should take action.
     */
    get activeGM(): User.Implementation | null;

    /** @remarks This is not marked as protected because it is used in {@link Game.activateSocketListeners | `Game#activateSocketListeners`} */
    static _activateSocketListeners(socket: io.Socket): void;

    /**
     * Handle receipt of activity data from another User connected to the Game session
     * @param userId       - The User id who generated the activity data
     * @param activityData - The object of activity data (default: `{}`)
     */
    // activityData: not null (parameter default only)
    protected static _handleUserActivity(userId: string, activityData?: User.ActivityData): void;
  }

  namespace Users {
    interface Any extends AnyUsers {}
    interface AnyConstructor extends Identity<typeof AnyUsers> {}

    interface ConfiguredClass extends Document.ConfiguredCollectionClass<"User"> {}
    interface Configured extends Document.ConfiguredCollection<"User"> {}
  }
}

declare abstract class AnyUsers extends Users {
  constructor(...args: never);
}
