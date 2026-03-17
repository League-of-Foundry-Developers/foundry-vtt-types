import { expectTypeOf } from "vitest";

import PrimaryCanvasGroupAmbienceFilter = foundry.canvas.rendering.filters.PrimaryCanvasGroupAmbienceFilter;

expectTypeOf(PrimaryCanvasGroupAmbienceFilter.fragmentShader).toEqualTypeOf<string>();

expectTypeOf(PrimaryCanvasGroupAmbienceFilter.create()).toEqualTypeOf<PrimaryCanvasGroupAmbienceFilter>();
