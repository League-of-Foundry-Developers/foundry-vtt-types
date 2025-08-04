import { expectTypeOf } from "vitest";
import type { AnyObject, InexactPartial, IntentionalPartial } from "#utils";

import BaseEffectSource = foundry.canvas.sources.BaseEffectSource;
import PlaceableObject = foundry.canvas.placeables.PlaceableObject;
import EnvironmentCanvasGroup = foundry.canvas.groups.EnvironmentCanvasGroup;

class MyEffectSource<
  SourceData extends BaseEffectSource.SourceData = BaseEffectSource.SourceData,
> extends BaseEffectSource<SourceData, PIXI.Polygon> {
  static override sourceType = "sight";

  static override effectsCollection = "someCollection";

  // testing that initialize knows the keys of `data`
  override initialize(data?: InexactPartial<SourceData>, options?: BaseEffectSource.InitializeOptions) {
    if (data) {
      // @ts-expect-error foo is not a key of BaseEffectSource.SourceData
      if (data.foo) return this;
      if (data.disabled && data.x && data.y && data.elevation) return this;
    }
    if (options?.reset) return this;
    return this;
  }

  protected override _initialize(data: IntentionalPartial<SourceData>) {
    data.disabled = false;
  }

  protected override _createShapes() {
    this.shape = new PIXI.Polygon();
  }

  protected override _configure(changes: AnyObject) {
    if (typeof changes["x"] === "number" && changes["x"] > 500) {
      console.warn("too far");
    }
  }
}

expectTypeOf(MyEffectSource.sourceType).toBeString();
expectTypeOf(MyEffectSource.effectsCollection).toBeString();
expectTypeOf(MyEffectSource.defaultData).toEqualTypeOf<BaseEffectSource.SourceData>();

declare const object: foundry.canvas.placeables.Token.Implementation;
new MyEffectSource();
new MyEffectSource({ object: undefined, sourceId: undefined });
const mySource = new MyEffectSource({ object, sourceId: object.sourceId });

expectTypeOf(mySource.object).toEqualTypeOf<PlaceableObject.Any | EnvironmentCanvasGroup.Implementation | null>();
expectTypeOf(mySource.sourceId).toEqualTypeOf<string | undefined>();
expectTypeOf(mySource.data).toEqualTypeOf<BaseEffectSource.SourceData>();
expectTypeOf(mySource.shape).toEqualTypeOf<PIXI.Polygon | number[] | undefined>();

expectTypeOf(mySource["_flags"]).toEqualTypeOf<BaseEffectSource.Flags>();

expectTypeOf(mySource.x).toBeNumber();
expectTypeOf(mySource.y).toBeNumber();
expectTypeOf(mySource.elevation).toBeNumber();
expectTypeOf(mySource.effectsCollection).toEqualTypeOf<Collection<MyEffectSource>>();
expectTypeOf(mySource.updateId).toBeNumber();
expectTypeOf(mySource.active).toBeBoolean();
expectTypeOf(mySource.attached).toBeBoolean();
expectTypeOf(mySource.suppression).toEqualTypeOf<Record<string, boolean>>();

expectTypeOf(mySource.initialize()).toEqualTypeOf<MyEffectSource>();
expectTypeOf(mySource.initialize({}, { reset: false })).toEqualTypeOf<MyEffectSource>();
expectTypeOf(
  mySource.initialize(
    {
      x: undefined,
      y: undefined,
      disabled: undefined,
      elevation: undefined,
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
    disabled: false,
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
  // because _configure is passed flattened data, and subclasses have data properties that are objects,
  // it takes AnyObject for now until we have a Flatten type
  mySource["_configure"]({
    foo: 1243464563452n,
  }),
);

expectTypeOf(mySource.refresh()).toBeVoid();
expectTypeOf(mySource["_refresh"]()).toBeVoid();

expectTypeOf(mySource.destroy()).toBeVoid();
expectTypeOf(mySource["_destroy"]()).toBeVoid();

expectTypeOf(mySource.add()).toBeVoid();
expectTypeOf(mySource.remove()).toBeVoid();
