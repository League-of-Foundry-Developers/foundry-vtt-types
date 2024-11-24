export {};

declare global {
  /**
   * An icon representing a Door Control
   */
  class DoorControl extends PIXI.Container {
    constructor(wall: Wall.ConfiguredInstance);

    wall: Wall.ConfiguredInstance;

    /**
     * The center of the wall which contains the door.
     */
    get center(): PIXI.Point;

    /**
     * Draw the DoorControl icon, displaying its icon texture and border
     */
    draw(): Promise<this>;

    icon?: PIXI.Sprite;

    bg?: PIXI.Graphics;

    border?: PIXI.Graphics;

    /**
     * Get the icon texture to use for the Door Control icon based on the door state
     */
    protected _getTexture(): ReturnType<typeof getTexture>;

    reposition(): void;

    /**
     * Determine whether the DoorControl is visible to the calling user's perspective.
     * The control is always visible if the user is a GM and no Tokens are controlled.
     * @see {@link CanvasVisibility#testVisibility}
     */
    get isVisible(): boolean;

    /**
     * Handle mouse over events on a door control icon.
     * @param event - The originating interaction event
     */
    protected _onMouseOver(event: PIXI.FederatedEvent): false | undefined;

    /**
     * Handle mouse out events on a door control icon.
     * @param event - The originating interaction event
     */
    protected _onMouseOut(event: PIXI.FederatedEvent): false | undefined;

    /**
     * Handle left mouse down events on a door control icon.
     * This should only toggle between the OPEN and CLOSED states.
     * @param event - The originating interaction event
     */
    protected _onMouseDown(event: PIXI.FederatedEvent): false | undefined | Promise<WallDocument.ConfiguredInstance>;

    /**
     * Handle right mouse down events on the door control icon
     * This should toggle whether the door is LOCKED or CLOSED
     * @param event - The originating interaction event
     */
    protected _onRightDown(event: PIXI.FederatedEvent): undefined | Promise<WallDocument.ConfiguredInstance>;
  }
}
