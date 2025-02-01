import { expectTypeOf } from "vitest";

expectTypeOf(UnboundTransform.IDENTITY).toEqualTypeOf<UnboundTransform>();

// Some further testing in tests/foundry/client/pixi/groups/overlay.test-d.ts,
// as OverlayCanvasGroup is the only class extending UnboundContainer in core
