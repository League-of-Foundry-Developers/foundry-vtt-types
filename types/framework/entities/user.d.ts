/**
 * The collection of User entities which is accessible through `game.users`.
 * The array of User entities within this collection is accessible through `game.users.entities`.
 */
declare class Users extends EntityCollection<User> {
  /**
   * The User entity of the currently connected user
   */
  current: User | null;

  /**
   * Initialize the Map object and all its contained entities
   */
  protected _initialize(data: User.Data[]): void;

  /** @override */
  get entity(): string;

  /**
   * Get the users with player roles
   * @returns
   */
  get players(): User[];

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers               */
  /* -------------------------------------------- */

  /** @override */
  static socketListeners(socket: SocketIOClient.Socket): void;

  /**
   * Handle receipt of activity data from another User connected to the Game session
   * @param userId - The User id who generated the activity data
   * @param activityData - The object of activity data
   */
  protected static _handleUserActivity(userId: string, activityData: User.ActivityData): void;
}

/**
 * The User entity
 * Each player who connects to a Foundry Virtual Tabletop session is a User.
 * Users represent human beings (or possibly programmatic players) and are the cornerstone of identity in Foundry VTT.
 *
 * @param data - The source data for the User entity, usually retrieved from the database.
 * @param options - Initialization options which modify the construction of a User entity. See the Entity
                    class for more detail.
 */
declare class User extends Entity<User.Data> {
  /**
   * Track whether the user is currently active in the game
   */
  active: boolean;

  /**
   * Track references to the current set of Tokens which are targeted by the User
   */
  targets: Set<Token>; // TODO UserTargets class

  /**
   * Track the ID of the Scene that is currently being viewed by the User
   */
  viewedScene: string | null;

  /**
   * The first name of the User's default character
   * @remarks
   * set outside the class in PlayerList#getData
   */
  charname: string;

  /**
   * The preferred color for the user.
   * @remarks
   * set outside the class in PlayerList#getData
   */
  color: string;

  /**
   * Border color
   * @remarks
   * set outside the class in PlayerList#getData
   */
  border: string;

  /* ---------------------------------------- */
  /*  Properties                              */
  /* ---------------------------------------- */

  /** @override */
  static get config(): Entity.Config<User>;

  /**
   * Return the User avatar icon or the controlled actor's image
   */
  get avatar(): string;

  /**
   * Return the Actor instance of the user's impersonated character (or undefined)
   */
  get character(): Actor;

  /**
   * A convenience shortcut for the permissions object of the current User
   */
  get permissions(): any;

  /**
   * A flag for whether the current User is a Trusted Player
   * @returns
   */
  get isTrusted(): boolean;

  /**
   * A flag for whether the current User has Assistant GameMaster or full GameMaster role
   * @returns
   */
  get isGM(): boolean;

  /**
   * A flag for whether this User is the connected client
   * @returns
   */
  get isSelf(): boolean;

  /* ---------------------------------------- */
  /*  User Methods                            */
  /* ---------------------------------------- */

  /**
   * Test whether the User is able to perform a certain permission action. Game Master users are always allowed to
   * perform every action, regardless of permissions.
   *
   * @param permission - The action to test
   * @returns Does the user have the ability to perform this action?
   */
  can(permission: string): boolean;

  /**
   * Test whether the User has a specific permission entitled .This differs from user#can because it does not always
   * return true for Game Master users and should be used in cases where a permission could be withheld even from
   * a GM player (for example cursor display, or A/V audio).
   *
   * @param permission - The action to test
   * @returns Does the user have explicit permission to perform this action?
   */
  hasPermission(permission: string): boolean;

  /**
   * Test whether the User has at least the permission level of a certain role
   * @param role - The role name from USER_ROLES to test
   * @returns Does the user have at least this role level?
   */
  hasRole(role: string | number): boolean;

  /**
   * Test whether the User has exactly the permission level of a certain role
   * @param role - The role name from USER_ROLES to test
   * @returns Does the user have exactly this role level?
   */
  isRole(role: string | number): boolean;

  /**
   * Sets a user's permission
   * Modifies the user permissions to grant or restrict access to a feature.
   *
   * @param permission - The permission name from USER_PERMISSIONS
   * @param allowed - Whether to allow or restrict the permission
   */
  setPermission(permission: string, allowed: boolean): void;

  /**
   * Submit User activity data to the server for broadcast to other players.
   * This type of data is transient, persisting only for the duration of the session and not saved to any database.
   *
   * @param activityData - An object of User activity data to submit to the server for broadcast.
   */
  broadcastActivity(activityData: DeepPartial<User.ActivityData>): void;

  /**
   * Assign a Macro to a numbered hotbar slot between 1 and 50
   * @param macro - The Macro entity to assign
   * @param slot - The integer Hotbar slot to fill
   * @param fromSlot - An optional origin slot from which the Macro is being shifted
   * @returns A Promise which resolves once the User update is complete
   */
  assignHotbarMacro(macro: Macro | null, slot: number, { fromSlot }?: { fromSlot?: number }): Promise<User>;

  /**
   * Get an Array of Macro Entities on this User's Hotbar by page
   * @param page - The hotbar page number
   * @returns
   */
  getHotbarMacros(page?: number): Macro[];

  updateTokenTargets(targetIds?: string[]): void;

  /* -------------------------------------------- */
  /*  Socket Listeners and Handlers               */
  /* -------------------------------------------- */

  /** @override */
  protected _onCreate(data: User.Data, options: any, userId: string): void;

  /**
   * Additional updating steps for the User entity when new data is saved which trigger some related updates.
   *
   * Re-draw the active cursor and toggle visibility
   * Re-draw navigation if the active or viewed scenes have changed
   * Render the players UI if activity status or other player features have changed
   * Update the canvas if the player's impersonated character has changed
   */
  protected _onUpdate(data: DeepPartial<User.Data>, options: Entity.UpdateOptions, userId: string): void;

  /** @override */
  protected _onDelete(options: Entity.DeleteOptions, userId: string): void;
}

declare namespace User {
  interface Data extends Entity.Data {
    active: boolean;
    /**
     * A web-accessible file path to an avatar image used to represent the User.
     */
    avatar: string;
    /**
     * The _id of the Actor entity that the User has chosen as their primary character.
     */
    character: string;
    /**
     * A color string which represents the visual color associated with this particular User.
     */
    color: string;
    /**
     * User hotbar. An object with keys of the slot number and values of the Macro id
     */
    hotbar: Record<number, string>;
    name: string;
    /**
     * An access key for the Entity.
     */
    password: string;
    /**
     * An object of key-value permissions for the User which extend the default functionality of the User's role.
     */
    permissions: any;
    /**
     * The role level for the User, from CONST.USER_ROLES
     */
    role: number;
    viewedScene: string | null;
  }

  interface ActivityData {
    /** The coordinates of the user's cursor */
    cursor: any;
    /** Is the user pulling focus to the cursor coordinates? */
    focus: boolean;
    /** Is the user emitting a ping at the cursor coordinates? */
    ping: boolean;
    /** Serialized Ruler coordinate data in JSON format */
    ruler: string;
    /** The id of the Scene currently being viewed by the User */
    sceneId: string;
    /** An array of Token ids which are targeted by the User */
    targets: any[];
  }
}
