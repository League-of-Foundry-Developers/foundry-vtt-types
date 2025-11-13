import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";
/** @privateRemarks `AllHooks` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AllHooks } from "#client/hooks.d.mts";

/**
 * The singleton collection of User documents which exist within the active World.
 * This Collection is accessible within the Game object as {@linkcode foundry.Game.users | game.users}.
 *
 * ### Hook Events
 * - {@linkcode AllHooks.userConnected}
 *
 * @see {@linkcode foundry.documents.User} The User document
 */
declare class Users extends foundry.documents.abstract.WorldCollection<"User", "Users"> {
  constructor(data?: User.CreateData[]);

  /**
   * The User document of the currently connected user
   * @defaultValue `null`
   */
  current: User.Stored | null;

  protected override _initialize(): void;

  static override documentName: "User";

  /** @privateRemarks Fake type override */
  static override get instance(): Users.Implementation;

  /**
   * Get the users with player roles
   */
  get players(): User.Stored[];

  /**
   * Get one User who is an active Gamemaster (non-assistant if possible), or null if no active GM is available.
   * This can be useful for workflows which occur on all clients, but where only one user should take action.
   */
  get activeGM(): User.Stored | null;

  /**
   * Get the designated User among the Users that satisfy the given condition.
   * Returns `null` if no Users satisfy the given condition.
   * Returns a User with the highest role among the qualifying Users.
   * Qualifying Users aren't necessary active Users unless it is part of the condition.
   * @example
   * // Get the designated User for creating Tokens that is active
   * ```ts
   * const user = game.users.getDesignatedUser(user => user.active && user.can("TOKEN_CREATE"));
   * ```
   * @param condition - The condition the Users must satisfy
   * @returns The designated User or `null`
   */
  getDesignatedUser(condition: (user: User.Stored) => boolean): User.Stored | null;

  static _activateSocketListeners(socket: io.Socket): void;

  /** @deprecated Foundry made this method truly private in v13. This warning will be removed in v14. */
  static _handleUserActivity(userId: never, activityData?: never): never;

  static #Users: true;
}

declare namespace Users {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Users.Implementation} instead. This will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Users.ImplementationClass} instead. This will be removed in v15.
   */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyUsers {}
    interface AnyConstructor extends Identity<typeof AnyUsers> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"User"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"User"> {}

  /** @deprecated Replaced by {@linkcode Users.ImplementationClass}. Will be removed in v15. */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Replaced by {@linkcode Users.Implementation}. Will be removed in v15. */
  type Configured = Implementation;
}

declare abstract class AnyUsers extends Users {
  constructor(...args: never);
}

export default Users;
