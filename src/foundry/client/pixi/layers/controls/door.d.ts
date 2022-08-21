import type { ConfiguredDocumentClassForName, ConfiguredObjectClassForName } from "../../../../../types/helperTypes";

declare global {
  /**
   * An icon representing a Door Control
   */
  class DoorControl extends PIXI.Container {
    constructor(wall: InstanceType<ConfiguredObjectClassForName<"Wall">>);

    wall: InstanceType<ConfiguredObjectClassForName<"Wall">>;

    /**
     * Draw the DoorControl icon, displaying it's icon texture and border
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
     * @see {@link SightLayer#testVisibility}
     */
    get isVisible(): boolean;

    /**
     * Handle mouse over events on a door control icon.
     * @param event - The originating interaction event
     */
    protected _onMouseOver(event: PIXI.InteractionEvent): false | void;

    /**
     * Handle mouse out events on a door control icon.
     * @param event - The originating interaction event
     */
    protected _onMouseOut(event: PIXI.InteractionEvent): false | void;

    /**
     * Handle left mouse down events on a door control icon.
     * This should only toggle between the OPEN and CLOSED states.
     * @param event - The originating interaction event
     */
    protected _onMouseDown(
      event: PIXI.InteractionEvent
    ): false | void | Promise<InstanceType<ConfiguredDocumentClassForName<"Wall">> | undefined>;

    /**
     * Handle right mouse down events on the door control icon
     * This should toggle whether the door is LOCKED or CLOSED
     * @param event - The originating interaction event
     */
    protected _onRightDown(
      event: PIXI.InteractionEvent
    ): void | Promise<InstanceType<ConfiguredDocumentClassForName<"Wall">> | undefined>;
  }
}
