import { expectTypeOf } from "vitest";

import TooltipManager = foundry.helpers.interaction.TooltipManager;

expectTypeOf(TooltipManager.TOOLTIP_MARGIN_PX).toEqualTypeOf<number>();
expectTypeOf(TooltipManager.TOOLTIP_ACTIVATION_MS).toEqualTypeOf<number>();
expectTypeOf(TooltipManager.TOOLTIP_DIRECTIONS).toExtend<
  Record<keyof TooltipManager.TooltipDirections, TooltipManager.TOOLTIP_DIRECTIONS>
>();
expectTypeOf(TooltipManager.LOCKED_TOOLTIP_BUFFER_PX).toEqualTypeOf<number>();
expectTypeOf(TooltipManager.implementation).toEqualTypeOf<typeof TooltipManager>();

declare const element: HTMLElement;
declare const mouseEvent: MouseEvent;
const tooltipManager = new TooltipManager();

expectTypeOf(tooltipManager.tooltip).toEqualTypeOf<HTMLElement>();
expectTypeOf(tooltipManager.element).toEqualTypeOf<HTMLElement | null>();
expectTypeOf(tooltipManager.activateEventListeners()).toEqualTypeOf<void>();

expectTypeOf(tooltipManager.activate(element)).toEqualTypeOf<void>();
expectTypeOf(tooltipManager.activate(element, {})).toEqualTypeOf<void>();
expectTypeOf(
  tooltipManager.activate(element, {
    cssClass: "some classes",
    direction: TooltipManager.TOOLTIP_DIRECTIONS.CENTER,
    html: "<some>html</some>",
    locked: false,
    text: "some text", // actually passing both text and (html or content) will throw
    content: element, // deprecated since v13 until v15
  }),
).toEqualTypeOf<void>();
expectTypeOf(
  tooltipManager.activate(element, {
    cssClass: undefined,
    direction: undefined,
    html: undefined,
    locked: undefined,
    text: undefined,
    content: undefined,
  }),
).toEqualTypeOf<void>();

expectTypeOf(tooltipManager.deactivate()).toEqualTypeOf<void>();
expectTypeOf(tooltipManager.clearPending()).toEqualTypeOf<void>();
expectTypeOf(tooltipManager.lockTooltip()).toEqualTypeOf<HTMLElement>();

expectTypeOf(tooltipManager["_onLockTooltip"](mouseEvent)).toBeVoid();
expectTypeOf(tooltipManager["_onLockedTooltipDismiss"](mouseEvent)).toBeVoid();

expectTypeOf(tooltipManager.dismissLockedTooltip(element)).toEqualTypeOf<void>();
expectTypeOf(tooltipManager.dismissLockedTooltips()).toEqualTypeOf<void>();

expectTypeOf(
  tooltipManager.createLockedTooltip(
    {
      top: "150",
      right: "700", // passing at least one of (`top` | `bottom`) and (`right` | `left`) seems desirable, though all props are individually optional
    },
    "tooltip text",
  ),
).toEqualTypeOf<HTMLElement>();

expectTypeOf(
  tooltipManager.createLockedTooltip(
    {
      top: "150",
      right: "700", // passing at least one of (`top` | `bottom`) and (`right` | `left`) seems desirable, though all props are individually optional
    },
    "tooltip text",
    {},
  ),
).toEqualTypeOf<HTMLElement>();
expectTypeOf(
  tooltipManager.createLockedTooltip(
    {
      top: "150",
      right: "700", // passing at least one of (`top` | `bottom`) and (`right` | `left`) seems desirable, though all props are individually optional
    },
    "tooltip text",
    { cssClass: "some classes" },
  ),
).toEqualTypeOf<HTMLElement>();
expectTypeOf(
  tooltipManager.createLockedTooltip(
    {
      top: undefined,
      right: undefined,
      left: undefined,
      bottom: undefined,
    },
    "tooltip text",
    { cssClass: undefined },
  ),
).toEqualTypeOf<HTMLElement>();

declare const dir: TooltipManager.TOOLTIP_DIRECTIONS;
expectTypeOf(tooltipManager["_determineDirection"]()).toEqualTypeOf<typeof dir>();
expectTypeOf(tooltipManager["_setAnchor"](dir)).toBeVoid();

expectTypeOf(tooltipManager["_setStyle"]()).toBeVoid();
expectTypeOf(tooltipManager["_setStyle"]({})).toBeVoid();
expectTypeOf(
  tooltipManager["_setStyle"]({
    bottom: "260",
    left: "400",
    textAlign: "right",
  }),
).toBeVoid();
expectTypeOf(
  // @ts-expect-error This prop is spread into an object with existing defaults, so `undefined` is not allowed
  tooltipManager["_setStyle"]({
    top: undefined,
    bottom: undefined,
    right: undefined,
    left: undefined,
    textAlign: undefined,
  }),
).toBeVoid();
