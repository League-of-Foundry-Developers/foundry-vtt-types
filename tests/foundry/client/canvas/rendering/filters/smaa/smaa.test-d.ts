import { expectTypeOf } from "vitest";
import SMAAFilter = foundry.canvas.rendering.filters.SMAAFilter;

expectTypeOf(SMAAFilter.PRESETS).toExtend<Record<keyof SMAAFilter.Presets, SMAAFilter.PRESETS>>();

const smaaFilter = new SMAAFilter();
new SMAAFilter({});
new SMAAFilter({
  threshold: 0.07,
  cornerRounding: 32,
  disableCornerDetection: true,
  disableDiagDetection: false,
  localContrastAdaptionFactor: 7,
  maxSearchSteps: 12,
  maxSearchStepsDiag: 6,
});
// effectively testing runtime, as core never passes anything
new SMAAFilter({
  threshold: undefined,
  cornerRounding: undefined,
  disableCornerDetection: undefined,
  disableDiagDetection: undefined,
  localContrastAdaptionFactor: undefined,
  maxSearchSteps: undefined,
  maxSearchStepsDiag: undefined,
});

declare const someManager: PIXI.FilterSystem;
declare const someRT: PIXI.RenderTexture;
declare const someState: PIXI.FilterState;

expectTypeOf(smaaFilter.apply(someManager, someRT, someRT, PIXI.CLEAR_MODES.BLIT, someState)).toBeVoid();
