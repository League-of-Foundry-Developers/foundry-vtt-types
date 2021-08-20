/**
 * A CanvasLayer for displaying UI controls which are overlayed on top of other layers.
 *
 * We track three types of events:
 * 1) Cursor movement
 * 2) Ruler measurement
 * 3) Map pings
 */
import { ConfiguredDocumentClass, ConfiguredObjectClassForName } from '../../../../../types/helperTypes';

declare global {
  class ControlsLayer extends CanvasLayer<ControlsLayer.LayerOptions> {
    constructor();

    /**
     * Cursor position indicators
     * @defaultValue `null`
     */
    cursors: PIXI.Container | null;

    /**
     * A mapping of user IDs to Cursor instances for quick access
     * @defaultValue `{}`
     */
    protected _cursors: Partial<Record<string, Cursor>>;

    /**
     * Door control icons
     * @defaultValue `null`
     */
    doors: PIXI.Container | null;

    /**
     * Status effect icons
     * @remarks Always `null`
     */
    effects: null;

    /**
     * Ruler tools, one per connected user
     * @defaultValue `null`
     */
    rulers: PIXI.Container | null;

    /**
     * A convenience mapping of user IDs to Ruler instances for quick access
     */
    protected _rulers: Partial<Record<string, Ruler>>;

    /**
     * Canvas selection rectangle
     * @defaultValue `null`
     */
    select: PIXI.Graphics | null;

    // The controls layer is always interactive
    interactiveChildren: true;

    /**
     * @remarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): undefined;

    /**
     * @override
     * @defaultValue `mergeObject(super.layerOptions, { name: "controls", zIndex: 1000 })`
     */
    static get layerOptions(): ControlsLayer.LayerOptions;

    /**
     * A convenience accessor to the Ruler for the active game user
     */
    get ruler(): ReturnType<ControlsLayer['getRulerForUser']>;

    /**
     * Get the Ruler display for a specific User ID
     */
    getRulerForUser(userId: string): Ruler | null;

    /** @override */
    draw(): this;

    /**
     * Draw the cursors container
     */
    drawCursors(): void;

    /**
     * Draw the Door controls container
     */
    drawDoors(): void;

    /**
     * Create a Door Control icon for a given Wall object
     * @param wall - The Wall for which to create a DoorControl
     * @returns The created DoorControl
     */
    createDoorControl(wall: InstanceType<ConfiguredObjectClassForName<'Wall'>>): ReturnType<DoorControl['draw']> | null;

    /**
     * Draw Ruler tools
     */
    drawRulers(): void;

    /**
     * Draw the select rectangle given an event originated within the base canvas layer
     * @param coords - The rectangle coordinates of the form `{x, y, width, height}`
     */
    drawSelect({ x, y, width, height }: { x: number; y: number; width: number; height: number }): void;

    /** @override */
    deactivate(): void;

    /**
     * Handle mousemove events on the game canvas to broadcast activity of the user's cursor position
     */
    protected _onMoveCursor(event: PIXI.InteractionEvent): void;

    /**
     * Create and draw the Cursor object for a given User
     * @param user - The User entity for whom to draw the cursor Container
     */
    drawCursor(user: InstanceType<ConfiguredDocumentClass<typeof User>>): Cursor;

    /**
     * Update the cursor when the user moves to a new position
     * @param user     - The User for whom to update the cursor
     * @param position - The new cursor position
     */
    updateCursor(user: InstanceType<ConfiguredDocumentClass<typeof User>>, position: Point | null): void;

    /**
     * Update display of an active Ruler object for a user given provided data
     */
    updateRuler(
      user: InstanceType<ConfiguredDocumentClass<typeof User>>,
      rulerData: Parameters<Ruler['update']>[0] | null
    ): void;
  }

  namespace ControlsLayer {
    interface LayerOptions extends CanvasLayer.LayerOptions {
      name: 'controls';
      zIndex: 1000;
    }
  }
}
