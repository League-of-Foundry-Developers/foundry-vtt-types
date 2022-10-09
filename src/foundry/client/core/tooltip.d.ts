export {};

declare global {
  /**
   * A singleton Tooltip Manager class responsible for rendering and positioning a dynamic tooltip element which is
   * accessible as `game.tooltip`.
   *
   * @see {@link Game.tooltip}
   *
   * @example API Usage
   * ```typescript
   * game.tooltips.activate(htmlElement, {text: "Some tooltip text", direction: "UP"});
   * game.tooltips.deactivate();
   * ```
   *
   * @example HTML Usage
   * ```html
   * <span data-tooltip="Some Tooltip" data-tooltip-direction="LEFT">I have a tooltip</span>
   * <ol data-tooltip-direction="RIGHT">
   *   <li data-tooltip="The First One">One</li>
   *   <li data-tooltip="The Second One">Two</li>
   *   <li data-tooltip="The Third One">Three</li>
   * </ol>
   * ```
   */
  class TooltipManager {
    /**
     * A cached reference to the global tooltip element
     */
    tooltip: HTMLElement;

    /**
     * A reference to the HTML element which is currently tool-tipped, if any.
     */
    element: HTMLElement | null;

    /**
     * An amount of margin which is used to offset tooltips from their anchored element.
     * @defaultValue `5`
     */
    static TOOLTIP_MARGIN_PX: number;

    /**
     * The number of milliseconds delay which activates a tooltip on a "long hover".
     * @defaultValue `500`
     */
    static TOOLTIP_ACTIVATION_MS: number;

    /**
     * The directions in which a tooltip can extend, relative to its tool-tipped element.
     */
    static TOOLTIP_DIRECTIONS: {
      UP: "UP";
      DOWN: "DOWN";
      LEFT: "LEFT";
      RIGHT: "RIGHT";
      CENTER: "CENTER";
    };

    /**
     * Activate interactivity by listening for hover events on HTML elements which have a data-tooltip defined.
     */
    activateEventListeners(): void;

    /**
     * Activate the tooltip for a hovered HTML element which defines a tooltip localization key.
     * @param element - The HTML element being hovered.
     * @param options - Additional options which can override tooltip behavior. (default: `{}`)
     */
    activate(
      element: HTMLElement,
      options?: {
        /**
         * Explicit tooltip text to display. If this is not provided the tooltip text is
         * acquired from the elements data-tooltip attribute. This text will be
         * automatically localized
         */
        text?: string;
        /**
         * An explicit tooltip expansion direction. If this is not provided the direction is acquired
         * from the data-tooltip-direction attribute of the element or one of its parents.
         */
        direction?: TooltipManager.TOOLTIP_DIRECTIONS;
        /** An optional CSS class to apply to the activated tooltip. */
        cssClass?: string;
      }
    ): void;

    /**
     * Deactivate the tooltip from a previously hovered HTML element.
     */
    deactivate(): void;

    /**
     * Clear any pending activation workflow.
     * @internal
     */
    clearPending(): void;

    /**
     * If an explicit tooltip expansion direction was not specified, figure out a valid direction based on the bounds
     * of the target element and the screen.
     * @internal
     */
    protected _determineDirection(): ValueOf<Pick<typeof TooltipManager.TOOLTIP_DIRECTIONS, "UP" | "DOWN">>;

    /**
     * Set tooltip position relative to an HTML element using an explicitly provided data-tooltip-direction.
     * @param direction - The tooltip expansion direction specified by the element or a parent element.
     * @internal
     */
    protected _setAnchor(direction: TooltipManager.TOOLTIP_DIRECTIONS): void;

    /**
     * Apply inline styling rules to the tooltip for positioning and text alignment.
     * @param position - An object of positioning data, supporting top, right, bottom, left, and textAlign
     * @internal
     */
    protected _setStyle(position?: {
      top?: null | number;
      right?: null | number;
      bottom?: null;
      left?: null;
      textAlign?: string;
    }): void;
  }

  namespace TooltipManager {
    /**
     * The directions in which a tooltip can extend, relative to its tool-tipped element.
     */
    type TOOLTIP_DIRECTIONS = ValueOf<typeof TooltipManager["TOOLTIP_DIRECTIONS"]>;
  }
}
