import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";

/**
 * The singleton collection of User documents which exist within the active World.
 * This Collection is accessible within the Game object as game.users.
 *
 * @see {@linkcode User} The User document
 */
declare class Users extends foundry.documents.abstract.WorldCollection<"User", "Users"> {
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

  /**
   * Get the designated User among the Users that satisfy the given condition.
   * Returns `null` if no Users satisfy the given condition.
   * Returns a User with the highest role among the qualifying Users.
   * Qualifying Users aren't necessary active Users unless it is part of the condition.
   * @example
   * // Get the designated User for creating Tokens that is active
   * const user = game.users.getDesignatedUser(user => user.active && user.can("TOKEN_CREATE"));
   * @param condition - The condition the Users must satisfy
   * @returns The designated User or `null`
   */
  getDesignatedUser(condition: (user: User) => boolean): User | null;

  /** @remarks This is not marked as protected because it is used in {@link Game.activateSocketListeners | `Game#activateSocketListeners`} */
  static _activateSocketListeners(socket: io.Socket): void;

  /** @deprecated Foundry made this method truly private in v13 (this warning will be removed in v14) */
  static _handleUserActivity(userId: never, activityData?: never): never;
}

declare namespace Users {
  interface Any extends AnyUsers {}
  interface AnyConstructor extends Identity<typeof AnyUsers> {}

  interface ConfiguredClass extends Document.ConfiguredCollectionClass<"User"> {}
  interface Configured extends Document.ConfiguredCollection<"User"> {}
}

declare abstract class AnyUsers extends Users {
  constructor(...args: never);
}

export default Users;
