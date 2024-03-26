import { expectTypeOf } from "vitest";

const myColorManager = new CanvasColorManager();

expectTypeOf(myColorManager.colors.fogExplored).toEqualTypeOf<Color | undefined>;
