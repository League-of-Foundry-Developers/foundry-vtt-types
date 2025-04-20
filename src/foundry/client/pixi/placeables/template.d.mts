import type { RequiredProps, FixedInstanceType } from "fvtt-types/utils";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";

declare global {
  namespace MeasuredTemplate {
    // eslint-disable-next-line no-restricted-syntax
    type ObjectClass = ConfiguredObjectClassOrDefault<typeof MeasuredTemplate>;
    type Object = FixedInstanceType<ObjectClass>;

    /**
     * @deprecated {@link MeasuredTemplate.ObjectClass | `MeasuredTemplate.ObjectClass`}
     */
    type ConfiguredClass = ObjectClass;

    /**
     * @deprecated {@link MeasuredTemplate.Object | `MeasuredTemplate.Object`}
     */
    type ConfiguredInstance = Object;

    /**
     * This type will permanently exist but is marked deprecated. The reason it exists is because
     * the confusion between `MeasuredTemplate` (the `PlaceableObject` that appears on the canvas) and
     * `MeasuredTemplateDocument` (the `Document` that represents the data for a `MeasuredTemplate`) is so common that
     * it is useful to have a type to forward to `MeasuredTemplateDocument`.
     *
     * @deprecated {@link MeasuredTemplateDocument.Implementation | `MeasuredTemplateDocument.Implementation`}
     */
    type Implementation = MeasuredTemplateDocument.Implementation;

    /**
     * This type will permanently exist but is marked deprecated. The reason it exists is because
     * the confusion between `MeasuredTemplate` (the `PlaceableObject` that appears on the canvas) and
     * `MeasuredTemplateDocument` (the `Document` that represents the data for a `MeasuredTemplate`) is so common that
     * it is useful to have a type to forward to `MeasuredTemplateDocument`.
     *
     * @deprecated {@link MeasuredTemplateDocument.ImplementationClass | `MeasuredTemplateDocument.ImplementationClass`}
     */
    type ImplementationClass = MeasuredTemplateDocument.ImplementationClass;

    interface RENDER_FLAGS {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<this>;

      /** @defaultValue `{ propagate: ["refreshState", "refreshShape"], alias: true }` */
      refresh: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshState: RenderFlag<this>;

      /** @defaultValue `{ propagate: ["refreshPosition", "refreshGrid", "refreshText", "refreshTemplate"] }` */
      refreshShape: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshTemplate: RenderFlag<this>;

      /** @defaultValue `{ propagate: ["refreshGrid"] }` */
      refreshPosition: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshGrid: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshText: RenderFlag<this>;
    }

    interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

    // TODO: Fix globalThis.ObjectHUD #2962
    interface ObjectHUD {
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

  /**
   * A type of Placeable Object which highlights an area of the grid as covered by some area of effect.
   * @see {@link MeasuredTemplateDocument | `MeasuredTemplateDocument`}
   * @see {@link TemplateLayer | `TemplateLayer`}
   */
  class MeasuredTemplate extends PlaceableObject<MeasuredTemplateDocument.Implementation> {
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
     * The template control icon
     */
    controlIcon: ControlIcon | undefined;

    /**
     * The measurement ruler label
     */
    ruler: PreciseText;

    /**
     * Internal property used to configure the control border thickness
     * @defaultValue `3`
     */
    protected _borderThickness: number;

    static override embeddedName: "MeasuredTemplate";

    static override RENDER_FLAGS: MeasuredTemplate.RENDER_FLAGS;

    override get bounds(): PIXI.Rectangle;

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

    /**
     * Is this MeasuredTemplate currently visible on the Canvas?
     */
    get isVisible(): boolean;

    /**
     * A unique identifier which is used to uniquely identify related objects like a template effect or grid highlight.
     */
    get highlightId(): string;

    protected override _draw(): Promise<void>;

    protected override _destroy(options?: PIXI.IDestroyOptions | boolean): void;

    protected _applyRenderFlags(flags: MeasuredTemplate.RenderFlags): void;

    protected override _getTargetAlpha(): number;

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
     * @internal
     */
    static getCircleShape(distance: number): PIXI.Circle;

    /**
     * Get a Conical area of effect given a direction, angle, and distance
     * @internal
     */
    static getConeShape(direction: number, angle: number, distance: number): PIXI.Polygon;

    /**
     * Get a Rectangular area of effect given a width and height
     * @internal
     */
    static getRectShape(direction: number, distance: number): PIXI.Rectangle;

    /**
     * Get a rotated Rectangular area of effect given a width, height, and direction
     * @internal
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

    protected override _canControl(user: User.Implementation, event?: PIXI.FederatedEvent): boolean;

    protected override _canConfigure(user: User.Implementation, event?: PIXI.FederatedEvent): boolean;

    protected override _canView(user: User.Implementation, event?: PIXI.FederatedEvent): boolean;

    /**
     * @privateRemarks _onUpdate is overridden but with no signature changes.
     * For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    protected override _canHUD(user: User.Implementation, event?: PIXI.FederatedEvent): boolean;

    protected override _onClickRight(event: PIXI.FederatedEvent): void;
  }
}
