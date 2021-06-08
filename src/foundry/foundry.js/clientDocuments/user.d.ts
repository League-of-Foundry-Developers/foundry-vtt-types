import { ConfiguredDocumentClass } from '../../../types/helperTypes';
import { DocumentDataType, DocumentModificationOptions } from '../../common/abstract/document.mjs';
import { UserData } from '../../common/data/data.mjs';

declare global {
  /**
   * The client-side User document which extends the common BaseUser abstraction.
   * Each User document contains UserData which defines its data schema.
   *
   * @see {@link data.UserData}               The User data schema
   * @see {@link documents.Users}             The world-level collection of User documents
   * @see {@link applications.UserConfig}     The User configuration application
   *
   * @param data - Initial data provided to construct the User document
   */
  class User extends ClientDocumentMixin(foundry.documents.BaseUser) {
    /**
     * Track whether the user is currently active in the game
     */
    active: boolean;

    /**
     * Track references to the current set of Tokens which are targeted by the User
     */
    targets: UserTargets;

    /**
     * Track the ID of the Scene that is currently being viewed by the User
     */
    viewedScene: string | null;

    /**
     * Return the User avatar icon or the controlled actor's image
     */
    get avatar(): string;

    /**
     * Return the Actor instance of the user's impersonated character (or undefined)
     */
    get character(): ConfiguredDocumentClass<typeof Actor> | undefined;

    /**
     * A convenience shortcut for the permissions object of the current User
     */
    get permissions(): UserData['permissions'];

    /**
     * A flag for whether the current User is a Trusted Player
     */
    get isTrusted(): boolean;

    /**
     * A flag for whether this User is the connected client
     */
    get isSelf(): boolean;

    /**
     * Assign a Macro to a numbered hotbar slot between 1 and 50
     * @param macro    - The Macro entity to assign
     * @param slot     - A specific numbered hotbar slot to fill
     * @param fromSlot - An optional origin slot from which the Macro is being shifted
     * @returns A Promise which resolves once the User update is complete
     */
    assignHotbarMacro(macro: Macro | null, slot: string | number, { fromSlot }?: { fromSlot: number }): Promise<this>;

    /**
     * Assign a specific boolean permission to this user.
     * Modifies the user permissions to grant or restrict access to a feature.
     *
     * @param permission - The permission name from USER_PERMISSIONS
     * @param allowed    - Whether to allow or restrict the permission
     */
    assignPermission(permission: keyof typeof CONST.USER_PERMISSIONS, allowed: boolean): Promise<this>;

    /* -------------------------------------------- */

    /**
     * Submit User activity data to the server for broadcast to other players.
     * This type of data is transient, persisting only for the duration of the session and not saved to any database.
     *
     * @param cursor  - The coordinates of the user's cursor
     * @param focus   - Is the user pulling focus to the cursor coordinates?
     * @param ping    - Is the user emitting a ping at the cursor coordinates?
     * @param ruler   - Serialized Ruler coordinate data in JSON format
     * @param sceneId - The id of the Scene currently being viewed by the User
     * @param targets - An id of Token ids which are targeted by the User
     */
    broadcastActivity({
      cursor,
      focus,
      ping,
      ruler,
      sceneId,
      targets
    }: {
      cursor?: boolean;
      focus?: boolean;
      ping?: boolean;
      ruler?: string;
      sceneId?: string;
      targets?: string[];
    }): void;

    /**
     * Get an Array of Macro Entities on this User's Hotbar by page
     * @param page - The hotbar page number
     *               (default: `1`)
     */
    getHotbarMacros(page?: number): Array<{ slot: number; macro: Macro | null }>;

    /* -------------------------------------------- */

    /**
     * Update the set of Token targets for the user given an array of provided Token ids.
     * @param targetIds - An array of Token ids which represents the new target set
     */
    updateTokenTargets(targetIds?: string[]): void;

    /* -------------------------------------------- */
    /*  Event Handlers                              */
    /* -------------------------------------------- */

    /** @override  */
    _onUpdate(
      data: DeepPartial<DocumentDataType<foundry.documents.BaseUser>>,
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /* -------------------------------------------- */

    /** @override  */
    _onDelete(options: DocumentModificationOptions, userId: string): void;

    /**
     * @deprecated since 0.8.0
     */
    isRole(role: Parameters<User['hasRole']>[0]): boolean;

    /**
     * @deprecated since 0.8.0
     */
    setPermission(permission: keyof typeof CONST.USER_PERMISSIONS, allowed: boolean): Promise<this>;
  }
}

export {};
