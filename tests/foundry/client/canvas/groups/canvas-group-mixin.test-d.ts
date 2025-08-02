import { assertType, describe, expectTypeOf, test } from "vitest";

import CanvasGroupMixin = foundry.canvas.groups.CanvasGroupMixin;
import PrimaryCanvasGroup = foundry.canvas.groups.PrimaryCanvasGroup;
import WeatherEffects = foundry.canvas.layers.WeatherEffects;

class FakePrimaryGroup<
  DrawOptions extends PrimaryCanvasGroup.DrawOptions = PrimaryCanvasGroup.DrawOptions,
  TearDownOptions extends PrimaryCanvasGroup.TearDownOptions = PrimaryCanvasGroup.TearDownOptions,
> extends CanvasGroupMixin<typeof PIXI.Container, "primary">(PIXI.Container)<DrawOptions, TearDownOptions> {}

describe("CanvasGroupMixin tests", () => {
  test("Statics", () => {
    expectTypeOf(FakePrimaryGroup.groupName).toExtend<keyof CONFIG.Canvas.Groups>();
    expectTypeOf(FakePrimaryGroup.groupName).toEqualTypeOf<"primary">();
    expectTypeOf(FakePrimaryGroup.tearDownChildren).toBeBoolean();
  });

  const myGroup = new FakePrimaryGroup();

  test("Miscellaneous", () => {
    assertType<PIXI.Container>(myGroup);

    expectTypeOf(myGroup.sortableChildren).toBeBoolean();
    expectTypeOf(myGroup.name).toBeString();
    expectTypeOf(myGroup.hookName).toBeString();

    expectTypeOf(myGroup.draw()).toEqualTypeOf<Promise<typeof myGroup>>();
    // There are no option keys in use in core
    expectTypeOf(myGroup.draw({})).toEqualTypeOf<Promise<typeof myGroup>>();
    // @ts-expect-error #draw always passes an options object, even if it will always be empty in core
    myGroup["_draw"]();
    expectTypeOf(myGroup["_draw"]({})).toEqualTypeOf<Promise<void>>();

    expectTypeOf(myGroup.tearDown()).toEqualTypeOf<Promise<typeof myGroup>>();
    // There are no option keys in use in core
    expectTypeOf(myGroup.tearDown({})).toEqualTypeOf<Promise<typeof myGroup>>();
    // @ts-expect-error #draw always passes an options object, even if it will always be empty in core
    myGroup["_tearDown"]();
    expectTypeOf(myGroup["_tearDown"]({})).toEqualTypeOf<Promise<void>>();
  });

  test("Layers", () => {
    expectTypeOf(myGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"primary">>();
    expectTypeOf(myGroup["_createLayers"]()).toEqualTypeOf<CanvasGroupMixin.LayersFor<"primary">>();
    expectTypeOf(myGroup.weather).toEqualTypeOf<WeatherEffects>();
  });

  test("Child Groups", () => {
    // TODO once implemented https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/3444
  });
});
