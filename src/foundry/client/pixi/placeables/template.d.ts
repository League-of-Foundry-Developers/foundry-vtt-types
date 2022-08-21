import { ConfiguredDocumentClass } from "../../../../types/helperTypes";
import { DocumentModificationOptions } from "../../../common/abstract/document.mjs";

declare global {
  /**
   * A type of Placeable Object which highlights an area of the grid as covered by some area of effect.
   * @see {@link MeasuredTemplateDocument}
   * @see {@link TemplateLayer}
   */
  class MeasuredTemplate extends PlaceableObject<
    InstanceType<ConfiguredDocumentClass<typeof MeasuredTemplateDocument>>
  > {
    /**
     * The geometry shape used for testing point intersection
     * @defaultValue `undefined`
     */
    shape: PIXI.Circle | PIXI.Ellipse | PIXI.Polygon | PIXI.Rectangle | PIXI.RoundedRectangle | undefined;

    /**
     * The tiling texture used for this template, if any
     */
    texture: PIXI.Texture | undefined;

    /**
     * The template graphics
     * @defaultValue `undefined`
     */
    template: PIXI.Graphics | undefined;

    /**
     * The UI frame container which depicts Token metadata and status, displayed in the ControlsLayer.
     * @defaultValue `new ObjectHUD(this)`
     */
    hud: MeasuredTemplate.ObjectHUD;

    /**
     * Internal property used to configure the control border thickness
     * @defaultValue `3`
     * @internal
     */
    protected _borderThickness: number;

    static override embeddedName: "MeasuredTemplate";

    override get bounds(): Rectangle;

    /**
     * A convenience accessor for the border color as a numeric hex code
     */
    get borderColor(): string | number;

    /**
     * A convenience accessor for the fill color as a numeric hex code
     */
    get fillColor(): string | number;

    /**
     * A flag for whether the current User has full ownership over the MeasuredTemplate document.
     */
    get owner(): boolean;

    override draw(): Promise<this>;

    override destroy(options?: Parameters<PlaceableObject["destroy"]>[0]): void;

    /**
     * Draw the HUD container which provides an interface for managing this template
     * @internal
     */
    protected _drawHUD(): MeasuredTemplate.InitializedObjectHUD;

    /**
     * Draw the ControlIcon for the MeasuredTemplate
     * @internal
     */
    protected _drawControlIcon(): ControlIcon;

    /**
     * Draw the Text label used for the MeasuredTemplate
     * @internal
     */
    protected _drawRulerText(): PreciseText;

    override refresh(): this;

    /**
     * Get a Circular area of effect given a radius of effect
     * @internal
     */
    protected _getCircleShape(distance: number): PIXI.Circle;

    /**
     * Get a Conical area of effect given a direction, angle, and distance
     * @internal
     */
    protected _getConeShape(direction: number, angle: number, distance: number): PIXI.Polygon;

    /**
     * Get a Rectangular area of effect given a width and height
     * @internal
     */
    protected _getRectShape(direction: number, distance: number): NormalizedRectangle;

    /**
     * Get a rotated Rectangular area of effect given a width, height, and direction
     * @internal
     */
    protected _getRayShape(direction: number, distance: number, width: number): PIXI.Polygon;

    /**
     * Update the displayed ruler tooltip text
     * @internal
     */
    protected _refreshRulerText(): void;

    /**
     * Highlight the grid squares which should be shown under the area of effect
     */
    highlightGrid(): void;

    override rotate(angle: number, snap: number): Promise<this>;

    protected override _canControl(user: InstanceType<ConfiguredDocumentClass<typeof User>>, event?: any): boolean;

    protected override _canConfigure(user: InstanceType<ConfiguredDocumentClass<typeof User>>, event?: any): boolean;

    protected override _canView(user: InstanceType<ConfiguredDocumentClass<typeof User>>, event?: any): boolean;

    protected override _onUpdate(
      data: DeepPartial<InstanceType<ConfiguredDocumentClass<typeof MeasuredTemplateDocument>>["data"]["_source"]>,
      options?: DocumentModificationOptions,
      userId?: string
    ): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;
  }

  namespace MeasuredTemplate {
    interface ObjectHUD extends globalThis.ObjectHUD {
      /**
       * Template control icon
       */
      icon?: ControlIcon;

      /**
       * Ruler text tooltip
       */
      ruler?: PreciseText;
    }

    type InitializedObjectHUD = RequiredProps<ObjectHUD, "icon" | "ruler">;
  }
}
