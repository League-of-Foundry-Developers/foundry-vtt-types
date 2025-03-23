import type { RequiredProps, FixedInstanceType, HandleEmptyObject } from "fvtt-types/utils";
import type { ConfiguredObjectClassOrDefault } from "../../config.d.mts";

declare global {
  /**
   * A type of Placeable Object which highlights an area of the grid as covered by some area of effect.
   * @see {@link MeasuredTemplateDocument | `MeasuredTemplateDocument`}
   * @see {@link TemplateLayer | `TemplateLayer`}
   */
  class MeasuredTemplate extends PlaceableObject<MeasuredTemplateDocument.Implementation> {
    /**
     * The geometry shape used for testing point intersection
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to {@link MeasuredTemplate._refreshShape | `MeasuredTemplate#_refreshShape`} being called
     *
     * Foundry also types this as `PIXI.Ellipse | PIXI.RoundedRectangle`, but {@link MeasuredTemplate._computeShape | `MeasuredTemplate#_computeShape`}
     * never returns either
     */
    shape: PIXI.Circle | PIXI.Polygon | PIXI.Rectangle | undefined;

    /**
     * The tiling texture used for this template, if any
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw. Set `null` if the template's document has no `texture` set
     */
    texture: PIXI.Texture | null | undefined;

    /**
     * The template graphics
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw.
     */
    template: PIXI.Graphics | undefined;

    /**
     * The measurement ruler label
     * @defaultValue `undefined`
     * @remarks Only `undefined` prior to first draw.
     */
    ruler: PreciseText;

    /**
     * Internal property used to configure the control border thickness
     * @defaultValue `3`
     */
    protected _borderThickness: number;

    static override embeddedName: "MeasuredTemplate";

    static override RENDER_FLAGS: MeasuredTemplate.RENDER_FLAGS;

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

    protected override _draw(options: HandleEmptyObject<MeasuredTemplate.DrawOptions> | undefined): Promise<void>;

    protected override _destroy(options?: PIXI.IDestroyOptions | boolean): void;

    protected _applyRenderFlags(flags: MeasuredTemplate.RenderFlags): void;

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
     */
    static getCircleShape(distance: number): PIXI.Circle | PIXI.Polygon;

    /**
     * Get a Conical area of effect given a direction, angle, and distance
     */
    static getConeShape(direction: number, angle: number, distance: number): PIXI.Polygon;

    /**
     * Get a Rectangular area of effect given a width and height
     */
    static getRectShape(direction: number, distance: number): PIXI.Rectangle;

    /**
     * Get a rotated Rectangular area of effect given a width, height, and direction
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
    protected _getGridHighlightShape(): NonNullable<this["shape"]>;

    /**
     * Get an array of points which define top-left grid spaces to highlight for square or hexagonal grids.
     */
    protected _getGridHighlightPositions(): Canvas.Point[];

    override rotate(angle: number, snap: number): Promise<this>;

    /**
     * @privateRemarks _onUpdate is overridden but with no signature changes.
     * For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    protected override _canControl(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

    protected override _canHUD(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

    protected override _canConfigure(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

    protected override _canView(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

    protected override _onClickRight(event: PIXI.FederatedEvent): void;

    /**
     * @deprecated since v12, until v14
     * @remarks "`MeasuredTemplate#borderColor` has been deprecated. Use {@link MeasuredTemplateDocument.borderColor | `MeasuredTemplate#document#borderColor`} instead."
     *
     * Returns the {@link Color.valueOf | `Color#valueOf()`} of the document's `borderColor`, not the `Color` itself
     */
    get borderColor(): number;

    /**
     * @deprecated since v12, until v14
     * @remarks "`MeasuredTemplate#fillColor` has been deprecated. Use {@link MeasuredTemplateDocument.fillColor | `MeasuredTemplate#document#fillColor`} instead."
     *
     * Returns the {@link Color.valueOf | `Color#valueOf()`} of the document's `fillColor`, not the `Color` itself
     */
    get fillColor(): number;

    /**
     * A flag for whether the current User has full ownership over the MeasuredTemplate document.
     * @deprecated since v12, until v14
     * @remarks "`MeasuredTemplate#owner` has been deprecated. Use {@link MeasuredTemplate.isOwner | `MeasuredTemplate#isOwner`} instead."
     */
    get owner(): this["isOwner"];
  }

  namespace MeasuredTemplate {
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
     * it is useful to have type to forward to `MeasuredTemplateDocument`.
     *
     * @deprecated {@link MeasuredTemplateDocument.Implementation | `MeasuredTemplateDocument.Implementation`}
     */
    type Implementation = MeasuredTemplateDocument.Implementation;

    /**
     * This type will permanently exist but is marked deprecated. The reason it exists is because
     * the confusion between `MeasuredTemplate` (the `PlaceableObject` that appears on the canvas) and
     * `MeasuredTemplateDocument` (the `Document` that represents the data for a `MeasuredTemplate`) is so common that
     * it is useful to have type to forward to `MeasuredTemplateDocument`.
     *
     * @deprecated {@link MeasuredTemplateDocument.ImplementationClass | `MeasuredTemplateDocument.ImplementationClass`}
     */
    type ImplementationClass = MeasuredTemplateDocument.ImplementationClass;

    interface RENDER_FLAGS {
      /** @defaultValue `{ propagate: ["refresh"] }` */
      redraw: RenderFlag<this>;

      /** @defaultValue `{ propagate: ["refreshState", "refreshPosition", "refreshShape", "refreshElevation"], alias: true }` */
      refresh: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshState: RenderFlag<this>;

      /** @defaultValue `{ propagate: ["refreshGrid"] }` */
      refreshPosition: RenderFlag<this>;

      /** @defaultValue `{ propagate: ["refreshTemplate", "refreshGrid", "refreshText"] }` */
      refreshShape: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshTemplate: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshGrid: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshText: RenderFlag<this>;

      /** @defaultValue `{}` */
      refreshElevation: RenderFlag<this>;
    }

    interface RenderFlags extends RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS> {}

    interface DrawOptions extends PlaceableObject.DrawOptions {}

    interface RefreshOptions extends PlaceableObject.RefreshOptions {}

    interface ControlOptions extends PlaceableObject.ControlOptions {}

    interface ReleaseOptions extends PlaceableObject.ReleaseOptions {}

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
}
