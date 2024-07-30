import { expectTypeOf } from "vitest";

const mySource = new foundry.canvas.sources.GlobalLightSource();

expectTypeOf(mySource.active).toEqualTypeOf<boolean>();
expectTypeOf(mySource.drawMeshes().background.visible).toEqualTypeOf<boolean>();
expectTypeOf(mySource.animateTorch(5)).toEqualTypeOf<void>();

// Pulled from EnvironmentCanvasGroup##configureGlobalLight
const globalLightData = {
  z: -Infinity,
  elevation: Infinity,
  dim: 0,
  bright: 0,
  disabled: false,
};

expectTypeOf(mySource.initialize(globalLightData)).toEqualTypeOf<foundry.canvas.sources.GlobalLightSource>();
