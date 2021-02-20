/**
 * An icon representing a Door Control
 */
declare class DoorControl extends PIXI.Container {
  constructor(wall: Wall);

  /**
   * Draw the DoorControl icon, displaying it's icon texture and border
   */
  draw(): Promise<this>;

  /**
   * Get the icon texture to use for the Door Control icon based on the door state
   */
  protected _getTexture(): Promise<ReturnType<typeof getTexture>>;

  reposition(): void;

  /**
   * Determine whether the DoorControl is visible to the calling user's perspective.
   * The control is always visible if the user is a GM and no Tokens are controlled.
   * @see {@link SightLayer#testVisibility}
   */
  get isVisible(): boolean;

  /* -------------------------------------------- */
  /*  Event Handlers                              */
  /* -------------------------------------------- */

  protected _onMouseOver(ev: PIXI.InteractionEvent): void;

  protected _onMouseOut(ev: JQuery.Event | PIXI.InteractionEvent): void;

  /**
   * Handle left mouse down events on the door control icon.
   * This should only toggle between the OPEN and CLOSED states.
   */
  protected _onMouseDown(event: PIXI.InteractionEvent): false | void;

  /**
   * Handle right mouse down events on the door control icon
   * This should toggle whether the door is LOCKED or CLOSED
   */
  protected _onRightDown(event: PIXI.InteractionEvent): void;
}
