import { describe, expectTypeOf, test } from "vitest";

declare const level: Level.Implementation;

describe("Level Tests", () => {
  test("client-doc non-overrides", () => {
    expectTypeOf(level.index).toEqualTypeOf<number | undefined>();
    expectTypeOf(level.isView).toBeBoolean();
    expectTypeOf(level.isVisible).toBeBoolean();
    expectTypeOf(level.edges).toEqualTypeOf<foundry.canvas.geometry.edges.CanvasEdges>();
    expectTypeOf(level.prepareBaseData()).toBeVoid();

    expectTypeOf(level.clampElevation(50)).toBeNumber();
    expectTypeOf(level.clampElevation(50, 5)).toBeNumber();
  });

  test("schema props", () => {
    expectTypeOf(level.name).toBeString();

    expectTypeOf(level.elevation.bottom).toEqualTypeOf<number | null>();
    expectTypeOf(level.elevation.top).toEqualTypeOf<number | null>();

    expectTypeOf(level.background.color).toEqualTypeOf<Color>();
    expectTypeOf(level.background.src).toEqualTypeOf<string | null>();
    expectTypeOf(level.background.tint).toEqualTypeOf<Color>();
    expectTypeOf(level.background.alphaThreshold).toBeNumber();

    expectTypeOf(level.foreground.src).toEqualTypeOf<string | null>();
    expectTypeOf(level.foreground.tint).toEqualTypeOf<Color>();
    expectTypeOf(level.foreground.alphaThreshold).toBeNumber();

    expectTypeOf(level.fog.src).toEqualTypeOf<string | null>();

    expectTypeOf(level.textures.anchorX).toBeNumber();
    expectTypeOf(level.textures.anchorY).toBeNumber();
    expectTypeOf(level.textures.offsetX).toBeNumber();
    expectTypeOf(level.textures.offsetY).toBeNumber();
    expectTypeOf(level.textures.fit).toEqualTypeOf<CONST.TEXTURE_DATA_FIT_MODES>();
    expectTypeOf(level.textures.scaleX).toBeNumber();
    expectTypeOf(level.textures.scaleY).toBeNumber();
    expectTypeOf(level.textures.rotation).toBeNumber();

    expectTypeOf(level.visibility.levels).toEqualTypeOf<Set<string>>();

    expectTypeOf(level.sort).toBeNumber();

    expectTypeOf(level.flags.core?.sheetClass).toEqualTypeOf<string | undefined>();
  });
});
