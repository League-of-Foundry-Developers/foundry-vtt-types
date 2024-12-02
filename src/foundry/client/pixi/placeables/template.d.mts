import type { HandleEmptyObject } from "../../../../types/helperTypes.d.mts";
import type { NullishProps } from "../../../../types/utils.d.mts";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";

declare global {
  /**
   * A type of Placeable Object which highlights an area of the grid as covered by some area of effect.
   * @see {@link MeasuredTemplateDocument}
   * @see {@link TemplateLayer}
   */
  class MeasuredTemplate<
    ControlOptions extends MeasuredTemplate.ControlOptions = MeasuredTemplate.ControlOptions,
    DestroyOptions extends MeasuredTemplate.DestroyOptions | boolean = MeasuredTemplate.DestroyOptions | boolean,
    DrawOptions extends MeasuredTemplate.DrawOptions = MeasuredTemplate.DrawOptions,
    ReleaseOptions extends MeasuredTemplate.ReleaseOptions = MeasuredTemplate.ReleaseOptions,
  > extends PlaceableObject<
    MeasuredTemplateDocument.ConfiguredInstance,
    ControlOptions,
    DestroyOptions,
    DrawOptions,
    ReleaseOptions
  > {
    /**
     * The geometry shape used for testing point intersection
     */
    shape: PIXI.Circle | PIXI.Ellipse | PIXI.Polygon | PIXI.Rectangle | PIXI.RoundedRectangle | undefined;

    /**
     * The tiling texture used for this template, if any
     */
    texture: PIXI.Texture | undefined;

    /**
     * The template graphics
     */
    template: PIXI.Graphics | undefined;

    /**
     * The measurement ruler label
     */
    ruler: PreciseText | undefined;

    /**
     * Internal property used to configure the control border thickness
     * @defaultValue `3`
     */
    protected _borderThickness: number;

    static override embeddedName: "MeasuredTemplate";

    static override RENDER_FLAGS: {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<Partial<MeasuredTemplate.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshState", "refreshPosition", "refreshShape", "refreshElevation"], alias: true }` */
      refresh: RenderFlag<Partial<MeasuredTemplate.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshState: RenderFlag<Partial<MeasuredTemplate.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshGrid"] }` */
      refreshPosition: RenderFlag<Partial<MeasuredTemplate.RenderFlags>>;

      /** @defaultValue `{ propagate: ["refreshTemplate", "refreshGrid", "refreshText"] }` */
      refreshShape: RenderFlag<Partial<MeasuredTemplate.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshTemplate: RenderFlag<Partial<MeasuredTemplate.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshGrid: RenderFlag<Partial<MeasuredTemplate.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshText: RenderFlag<Partial<MeasuredTemplate.RenderFlags>>;

      /** @defaultValue `{}` */
      refreshElevation: RenderFlag<Partial<MeasuredTemplate.RenderFlags>>;
    };

    /**
     * A convenient reference for whether the current User is the author of the MeasuredTemplate document.
     */
    get isAuthor(): boolean;

    override get bounds(): PIXI.Rectangle;

    /**
     * Is this MeasuredTemplate currently visible on the Canvas?
     */
    get isVisible(): boolean;

    /**
     * A unique identifier which is used to uniquely identify related objects like a template effect or grid highlight.
     */
    get highlightId(): string;

    protected override _draw(options?: HandleEmptyObject<DrawOptions>): Promise<void>;

    protected override _destroy(options?: DestroyOptions): void;

    protected _applyRenderFlags(flags: NullishProps<MeasuredTemplate.RenderFlags>): void;

    /**
     * Refresh the displayed state of the MeasuredTemplate.
     * This refresh occurs when the user interaction state changes.
     */
    protected _refreshState(): void;

    /**
     * Refresh the elevation of the control icon.
     */
    protected _refreshElevation(): void;

    protected override _getTargetAlpha(): number;

    /**
     * Refresh the position of the MeasuredTemplate
     */
    protected _refreshPosition(): void;

    /**
     * Refresh the underlying geometric shape of the MeasuredTemplate.
     */
    protected _refreshShape(): void;

    /**
     * Compute the geometry for the template using its document data.
     * Subclasses can override this method to take control over how different shapes are rendered.
     */
    protected _computeShape(): PIXI.Circle | PIXI.Rectangle | PIXI.Polygon;

    /**
     * Refresh the display of the template outline and shape.
     * Subclasses may override this method to take control over how the template is visually rendered.
     */
    protected _refreshTemplate(): void;

    /**
     * Get a Circular area of effect given a radius of effect
     * @param distance - The radius of the circle in grid units
     */
    static getCircleShape(distance: number): PIXI.Circle | PIXI.Polygon;

    /**
     * Get a Conical area of effect given a direction, angle, and distance
     * @param distance  - The radius of the cone in grid units
     * @param direction - The direction of the cone in degrees
     * @param angle     - The angle of the cone in degrees
     */
    static getConeShape(direction: number, angle: number, distance: number): PIXI.Polygon | PIXI.Circle;

    /**
     * Get a Rectangular area of effect given a width and height
     * @param distance  - The length of the diagonal in grid units
     * @param direction - The direction of the diagonal in degrees
     */
    static getRectShape(direction: number, distance: number): PIXI.Rectangle;

    /**
     * Get a rotated Rectangular area of effect given a width, height, and direction
     * @param distance  - The length of the ray in grid units
     * @param direction - The direction of the ray in degrees
     * @param width     - The width of the ray in grid units
     */
    static getRayShape(direction: number, distance: number, width: number): PIXI.Polygon;

    /**
     * Update the displayed ruler tooltip text
     */
    protected _refreshRulerText(): void;

    /**
     * Highlight the grid squares which should be shown under the area of effect
     */
    highlightGrid(): void;

    /**
     * Get the shape to highlight on a Scene which uses grid-less mode.
     */
    protected _getGridHighlightShape(): PIXI.Polygon | PIXI.Circle | PIXI.Rectangle;

    /**
     * Get an array of points which define top-left grid spaces to highlight for square or hexagonal grids.
     */
    protected _getGridHighlightPositions(): Canvas.Point[];

    override rotate(angle: number, snap: number): Promise<this>;

    /**
     * @privateRemarks _onUpdate is overridden but with no signature changes.
     * For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    protected override _canControl(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    protected override _canHUD(user?: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    protected override _canConfigure(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    protected override _canView(user: User.ConfiguredInstance, event?: PIXI.FederatedEvent): boolean;

    protected override _onClickRight(event: PIXI.FederatedEvent): void;

    /**
     * A convenience accessor for the border color as a numeric hex code
     * @deprecated since v12, until v14
     * @remarks "MeasuredTemplate#borderColor has been deprecated. Use MeasuredTemplate#document#borderColor instead."
     */
    get borderColor(): string | number;

    /**
     * A convenience accessor for the fill color as a numeric hex code
     * @deprecated since v12, until v14
     * @remarks "MeasuredTemplate#fillColor has been deprecated. Use MeasuredTemplate#document#fillColor instead."
     */
    get fillColor(): string | number;

    /**
     * A flag for whether the current User has full ownership over the MeasuredTemplate document.
     * @deprecated since v12, until v14
     * @remarks "MeasuredTemplate#owner has been deprecated. Use MeasuredTemplate#isOwner instead."
     */
    get owner(): boolean;
  }

  namespace MeasuredTemplate {
    type AnyConstructor = typeof AnyMeasuredTemplate;

    type ConfiguredClass = ConfiguredObjectClassOrDefault<typeof MeasuredTemplate>;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    interface ControlOptions extends PlaceableObject.ControlOptions {}

    interface DestroyOptions extends PlaceableObject.DestroyOptions {}

    interface DrawOptions extends PlaceableObject.DrawOptions {}

    interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

    interface RenderFlags extends PlaceableObject.RenderFlags {
      refreshPosition: boolean;

      refreshShape: boolean;

      refreshTemplate: boolean;

      refreshGrid: boolean;

      refreshText: boolean;

      refreshElevation: boolean;
    }
  }
}

declare abstract class AnyMeasuredTemplate extends MeasuredTemplate {
  constructor(arg0: never, ...args: never[]);
}
