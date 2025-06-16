import { expectTypeOf } from "vitest";
import type { IntentionalPartial } from "fvtt-types/utils";

import BaseEffectSource = foundry.canvas.sources.BaseEffectSource;
import PlaceableObject = foundry.canvas.placeables.PlaceableObject;
import CanvasGroupMixin = foundry.canvas.groups.CanvasGroupMixin;

class MyEffectSource<SourceData extends BaseEffectSource.SourceData = BaseEffectSource.SourceData> extends foundry
  .canvas.sources.BaseEffectSource<SourceData, PIXI.Polygon> {
  static override sourceType = "sight";

  static override effectsCollection = "someCollection";

  protected override _initialize(data: IntentionalPartial<SourceData>): void {
    data.disabled = false;
  }

  protected override _createShapes(): void {
    this.shape = new PIXI.Polygon();
  }

  protected override _configure(changes: IntentionalPartial<SourceData>): void {
    if (typeof changes.x === "number" && changes.x > 500) {
      console.warn("too far");
    }
  }
}

expectTypeOf(MyEffectSource.sourceType).toBeString();
expectTypeOf(MyEffectSource.effectsCollection).toBeString();
expectTypeOf(MyEffectSource.defaultData).toEqualTypeOf<BaseEffectSource.SourceData>();

const mySource = new MyEffectSource();

expectTypeOf(mySource.object).toEqualTypeOf<PlaceableObject.Any | CanvasGroupMixin.AnyMixed | null>();
expectTypeOf(mySource.sourceId).toEqualTypeOf<string | undefined>();
expectTypeOf(mySource.data).toEqualTypeOf<BaseEffectSource.SourceData>();
expectTypeOf(mySource.shape).toEqualTypeOf<PIXI.Polygon | undefined>();

expectTypeOf(mySource["_flags"]).toEqualTypeOf<BaseEffectSource.Flags>();
expectTypeOf((mySource["_flags"].foo = true)).toBeBoolean();
expectTypeOf((mySource["_flags"].bar = 7)).toBeNumber();

expectTypeOf(mySource.x).toBeNumber();
expectTypeOf(mySource.y).toBeNumber();
expectTypeOf(mySource.elevation).toBeNumber();
expectTypeOf(mySource.effectsCollection).toEqualTypeOf<foundry.utils.Collection<MyEffectSource>>();
expectTypeOf(mySource.updateId).toBeNumber();
expectTypeOf(mySource.active).toBeBoolean();
expectTypeOf(mySource.attached).toBeBoolean();
expectTypeOf(mySource.suppression).toEqualTypeOf<Record<string, boolean>>();

expectTypeOf(mySource.initialize()).toEqualTypeOf<MyEffectSource>();
expectTypeOf(mySource.initialize(null, { reset: null })).toEqualTypeOf<MyEffectSource>();
expectTypeOf(mySource.initialize({}, { reset: false })).toEqualTypeOf<MyEffectSource>();
expectTypeOf(
  mySource.initialize(
    {
      x: null,
      y: null,
      disabled: null,
      elevation: null,
    },
    { reset: undefined },
  ),
).toEqualTypeOf<MyEffectSource>();
expectTypeOf(
  mySource.initialize(
    {
      x: 50,
      y: 50,
      elevation: 50,
      disabled: false,
    },
    undefined,
  ),
).toEqualTypeOf<MyEffectSource>();

// @ts-expect-error `#_initialize` takes and mutates data, not passing it anything doesn't make sense
expectTypeOf(mySource["_initialize"]()).toBeVoid();
expectTypeOf(
  // @ts-expect-error `#initialize` will have already applied the defaults from `.defaultData` before calling `#_initialize`
  mySource["_initialize"]({
    y: undefined,
  }),
).toBeVoid();
expectTypeOf(mySource["_initialize"]({})).toBeVoid();
expectTypeOf(
  mySource["_initialize"]({
    x: 50,
    y: 50,
    elevation: 50,
  }),
).toBeVoid();

// `#_configure` gets passed flattened data, but none of the core Source types have any
// nested objects in their data, so this is currently irrelevant
expectTypeOf(mySource["_configure"]({}));
expectTypeOf(
  mySource["_configure"]({
    x: 50,
    y: 50,
    elevation: 20,
    disabled: false,
  }),
);
expectTypeOf(
  // @ts-expect-error data passed to `#_configure` will have had excess keys stripped and default values applied
  mySource["_configure"]({
    y: undefined,
  }),
);

expectTypeOf(mySource.refresh()).toBeVoid();
expectTypeOf(mySource["_refresh"]()).toBeVoid();

expectTypeOf(mySource.destroy()).toBeVoid();
expectTypeOf(mySource["_destroy"]()).toBeVoid();

expectTypeOf(mySource.add()).toBeVoid();
expectTypeOf(mySource.remove()).toBeVoid();

// deprecated since v11, until v13
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(mySource.sourceType).toBeString();

// deprecated since v12, until v14
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(mySource["_createShape"]()).toBeVoid();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(mySource.disabled).toBeBoolean();
