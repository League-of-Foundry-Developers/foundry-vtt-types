import { expectTypeOf } from "vitest";

expectTypeOf(PrimaryCanvasGroupAmbienceFilter.fragmentShader).toEqualTypeOf<string>();

expectTypeOf(PrimaryCanvasGroupAmbienceFilter.create()).toEqualTypeOf<PrimaryCanvasGroupAmbienceFilter>();
