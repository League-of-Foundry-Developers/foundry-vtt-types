import { expectTypeOf } from "vitest";
import { PrimaryCanvasGroupAmbienceFilter } from "#client/canvas/rendering/filters/_module.mjs";

expectTypeOf(PrimaryCanvasGroupAmbienceFilter.fragmentShader).toEqualTypeOf<string>();

expectTypeOf(PrimaryCanvasGroupAmbienceFilter.create()).toEqualTypeOf<PrimaryCanvasGroupAmbienceFilter>();
