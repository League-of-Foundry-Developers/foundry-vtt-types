/**
 * A CanvasLayer for displaying UI controls which are overlayed on top of other layers.
 *
 * We track three types of events:
 * 1) Cursor movement
 * 2) Ruler measurement
 * 3) Map pings
 */
declare class ControlsLayer extends CanvasLayer {
  /**
   * @override
   * @defaultValue `mergeObject(super.layerOptions, { zIndex: 400 })`
   */
  static get layerOptions(): CanvasLayer.LayerOptions;

  constructor();

  /**
   * Cursor position indicators
   */
  cursors: PIXI.Container | null;

  /**
   * Door control icons
   */
  doors: PIXI.Container | null;

  /**
   * Status effect icons
   * @remarks Always `null`
   */
  effects: null; // This seems to be unused. - Bolts

  // The controls layer is always interactive
  interactiveChildren: true;

  /**
   * Ruler tools, one per connected user
   */
  rulers: PIXI.Container | null;

  /**
   * Canvas selection rectangle
   */
  select: PIXI.Graphics | null;

  /**
   * A mapping of user IDs to Cursor instances for quick access
   */
  protected _cursors: Partial<Record<string, Cursor>>;

  /**
   * A convenience mapping of user IDs to Ruler instances for quick access
   */
  protected _rulers: Partial<Record<string, Ruler>>;

  /**
   * A convenience accessor to the Ruler for the active game user
   */
  get ruler(): ReturnType<ControlsLayer['getRulerForUser']>;

  /**
   * Create a Door Control icon for a given Wall object
   * @param wall - The Wall for which to create a DoorControl
   * @returns The created DoorControl
   */
  createDoorControl(wall: Wall): Promise<DoorControl> | null;

  /** @override */
  deactivate(): void;

  /** @override */
  draw(): this;

  /**
   * Create and draw the Cursor object for a given User
   * @param user - The User entity for whom to draw the cursor Container
   */
  drawCursor(user: User): Cursor;

  /**
   * Draw the cursors container
   */
  drawCursors(): void;

  /**
   * Draw the Door controls container
   */
  drawDoors(): void;

  /**
   * Draw Ruler tools
   */
  drawRulers(): void;

  /**
   * Draw the select rectangle given an event originated within the base canvas layer
   * @param coords - The rectangle coordinates of the form `{x, y, width, height}`
   */
  drawSelect({ x, y, width, height }: { x: number; y: number; width: number; height: number }): void;

  /**
   * Get the Ruler display for a specific User ID
   */
  getRulerForUser(userId: string): Ruler | null;

  /**
   * Update the cursor when the user moves to a new position
   */
  updateCursor(user: User, position: Point | null): void;

  /**
   * Update display of an active Ruler object for a user given provided data
   */
  updateRuler(
    user: User,
    rulerData: {
      class: 'Ruler';
      waypoints: Ruler['waypoints'];
      destination: Ruler['destination'];
      _state: Ruler['_state'];
    }
  ): void;

  /**
   * Handle mousemove events on the game canvas to broadcast activity of the user's cursor position
   */
  protected _onMoveCursor(event: PIXI.InteractionEvent): void;
}
