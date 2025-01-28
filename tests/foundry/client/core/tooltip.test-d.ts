import { expectTypeOf } from "vitest";

const tooltipManager = new TooltipManager();

declare const element: HTMLElement;
expectTypeOf(tooltipManager.tooltip).toEqualTypeOf<HTMLElement>();
expectTypeOf(tooltipManager.element).toEqualTypeOf<HTMLElement | null>();
expectTypeOf(tooltipManager.activateEventListeners()).toEqualTypeOf<void>();
expectTypeOf(tooltipManager.activate(element)).toEqualTypeOf<void>();
expectTypeOf(tooltipManager.deactivate()).toEqualTypeOf<void>();
expectTypeOf(tooltipManager.clearPending()).toEqualTypeOf<void>();
expectTypeOf(tooltipManager.lockTooltip()).toEqualTypeOf<HTMLElement>();
expectTypeOf(tooltipManager.dismissLockedTooltip(element)).toEqualTypeOf<void>();
expectTypeOf(tooltipManager.dismissLockedTooltips()).toEqualTypeOf<void>();
expectTypeOf(tooltipManager.createLockedTooltip({}, "")).toEqualTypeOf<HTMLElement>();

expectTypeOf(TooltipManager.TOOLTIP_MARGIN_PX).toEqualTypeOf<number>();
expectTypeOf(TooltipManager.TOOLTIP_ACTIVATION_MS).toEqualTypeOf<number>();
expectTypeOf(TooltipManager.TOOLTIP_DIRECTIONS).toEqualTypeOf<{
  UP: "UP";
  DOWN: "DOWN";
  LEFT: "LEFT";
  RIGHT: "RIGHT";
  CENTER: "CENTER";
}>();
expectTypeOf(TooltipManager.LOCKED_TOOLTIP_BUFFER_PX).toEqualTypeOf<number>();
