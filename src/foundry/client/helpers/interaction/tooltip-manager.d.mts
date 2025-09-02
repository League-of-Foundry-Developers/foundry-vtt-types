import type { Identity, InexactPartial, IntentionalPartial, ValueOf } from "#utils";

/**
 * A singleton Tooltip Manager class responsible for rendering and positioning a dynamic tooltip element which is
 * accessible as `game.tooltip`.
 *
 * @see {@linkcode foundry.Game.tooltip | Game#tooltip}
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
declare class TooltipManager {
  /**
   * @remarks
   * @throws If `game.tooltip` is already initialized
   */
  constructor();

  /**
   * A cached reference to the global tooltip element
   * @defaultValue `document.getElementById("tooltip")`
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
  static TOOLTIP_DIRECTIONS: TooltipManager.TooltipDirections;

  /**
   * The number of pixels buffer around a locked tooltip zone before they should be dismissed.
   * @defaultValue `50`
   */
  static LOCKED_TOOLTIP_BUFFER_PX: number;

  /**
   * Activate interactivity by listening for hover events on HTML elements which have a data-tooltip defined.
   */
  activateEventListeners(): void;

  /**
   * Activate the tooltip for a hovered HTML element which defines a tooltip localization key.
   * @param element - The HTML element being hovered.
   * @param options - Additional options which can override tooltip behavior. (default: `{}`)
   * @remarks
   * @throws If both `text` and `html` (or `text` and `content`) are passed
   */
  activate(element: HTMLElement, options?: TooltipManager.ActivateOptions): void;

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
   * Lock the current tooltip.
   */
  lockTooltip(): HTMLElement;

  /**
   * Handle a request to lock the current tooltip.
   * @param event - The click event.
   */
  protected _onLockTooltip(event: MouseEvent): void;

  /**
   * Handle dismissing a locked tooltip.
   * @param event - The click event.
   */
  protected _onLockedTooltipDismiss(event: MouseEvent): void;

  /**
   * Dismiss a given locked tooltip.
   * @param element - The locked tooltip to dismiss.
   */
  dismissLockedTooltip(element: HTMLElement): void;

  /**
   * Dismiss the set of active locked tooltips.
   */
  dismissLockedTooltips(): void;

  /**
   * Create a locked tooltip at the given position.
   * @param position - A position object with coordinates for where the tooltip should be placed
   * @param text     - Explicit tooltip text or HTML to display.
   * @param options  - Additional options which can override tooltip behavior.
   * @remarks Presumably passing at least one of `top` or `bottom` and one of `left` or `right` for
   * `position` is necessary for proper operation, but this is not enforced
   */
  createLockedTooltip(
    position: TooltipManager.Position,
    text: string,
    options?: TooltipManager.CreateLockedTooltipOptions,
  ): HTMLElement;

  /**
   * If an explicit tooltip expansion direction was not specified, figure out a valid direction based on the bounds
   * of the target element and the screen.
   */
  protected _determineDirection(): TooltipManager.TOOLTIP_DIRECTIONS;

  /**
   * Set tooltip position relative to an HTML element using an explicitly provided data-tooltip-direction.
   * @param direction - The tooltip expansion direction specified by the element or a parent element.
   */
  protected _setAnchor(direction: TooltipManager.TOOLTIP_DIRECTIONS): void;

  /**
   * Apply inline styling rules to the tooltip for positioning and text alignment.
   * @param position - An object of positioning data, supporting top, right, bottom, left, and textAlign
   */
  protected _setStyle(position?: TooltipManager.SetStylePosition): void;

  /**
   * Retrieve the configured TooltipManager implementation
   */
  // TODO: Config.ux handling
  static get implementation(): typeof TooltipManager;

  #TooltipManager: true;
}

declare namespace TooltipManager {
  interface Any extends AnyTooltipManager {}
  interface AnyConstructor extends Identity<typeof AnyTooltipManager> {}

  /**
   * The directions in which a tooltip can extend, relative to its tool-tipped element.
   */
  type TOOLTIP_DIRECTIONS = ValueOf<TooltipDirections>;

  interface TooltipDirections {
    UP: "UP";
    DOWN: "DOWN";
    LEFT: "LEFT";
    RIGHT: "RIGHT";
    CENTER: "CENTER";
  }

  /** @internal */
  type _ActivateOptions = InexactPartial<{
    /**
     * Explicit tooltip text to display. If this is not provided the tooltip text is acquired from
     * the element's `data-tooltip-text` attribute if present and otherwise from its `data-tooltip`
     * attribute. The `data-tooltip` text will be automatically localized. If `data-tooltip` is not
     * a localization string, the text is rendered as HTML (cleaned). Both `options.text` and
     * `data-tooltip-text` do not support HTML. It is not recommended to use `data-tooltip` for
     * plain text and HTML as it could cause an unintentional localization. Instead use
     * `data-tooltip-text` and `data-tooltip-html`, respectively.
     */
    text: string;

    /**
     * An explicit tooltip expansion direction. If this is not provided, the direction is acquired
     * from the `data-tooltip-direction` attribute of the element or one of its parents.
     */
    direction: TOOLTIP_DIRECTIONS;

    /**
     * An optional, space-separated list of CSS classes to apply to the activated tooltip. If this
     * is not provided, the CSS classes are acquired from the `data-tooltip-class` attribute of the
     * element or one of its parents.
     */
    cssClass: string;

    /**
     * An optional boolean to lock the tooltip after creation. Defaults to false.
     * @defaultValue `false`
     */
    locked: boolean;

    /**
     * Explicit HTML to inject into the tooltip rather than using tooltip text. If passed as a string,
     * the HTML string is cleaned with {@linkcode foundry.utils.cleanHTML}. An explicit HTML string may
     * also be set with the `data-tooltip-html` attribute on the element.
     */
    html: HTMLElement | string;

    /**
     * Explicit HTML content to inject into the tooltip rather than using tooltip text.
     * @deprecated "The `content` option has been deprecated in favor of the `html` option" (since v13, until v15)
     * @remarks Ignored if `html` is passed
     */
    content: HTMLElement;
  }>;

  interface ActivateOptions extends _ActivateOptions {}

  /** @internal */
  interface _BasePosition {
    /** Explicit top position for the tooltip */
    top: string;

    /** Explicit right position for the tooltip */
    right: string;

    /** Explicit bottom position for the tooltip */
    bottom: string;

    /** Explicit left position for the tooltip */
    left: string;
  }

  interface Position extends InexactPartial<_BasePosition> {}

  /** @internal */
  type _CreateLockedTooltipOptions = InexactPartial<{
    /**
     * An optional, space-separated list of CSS classes to apply to the activated tooltip.
     */
    cssClass: string;
  }>;

  interface CreateLockedTooltipOptions extends _CreateLockedTooltipOptions {}

  /**
   * @privateRemarks This is spread into an object with existing defaults (all `null`s for the `_BasePosition` properties).
   * Distinguishing that and the `""` defaults in {@link TooltipManager.createLockedTooltip | `TooltipManager#createLockedTooltip`}
   * is not worth repeating the properties; falsey is falsey in this case.
   */
  interface SetStylePosition extends IntentionalPartial<_BasePosition> {
    /** @defaultValue `left` */
    textAlign?: string;
  }
}

export default TooltipManager;

declare abstract class AnyTooltipManager extends TooltipManager {
  constructor(...args: never);
}
