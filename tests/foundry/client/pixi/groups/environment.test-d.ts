import { expectTypeOf } from "vitest";

expectTypeOf(EnvironmentCanvasGroup.groupName).toEqualTypeOf<string>();

const myEnvironmentGroup = new EnvironmentCanvasGroup();

expectTypeOf(myEnvironmentGroup.layers).toEqualTypeOf<Record<string, CanvasLayer>>();
