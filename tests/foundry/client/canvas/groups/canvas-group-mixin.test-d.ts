import { assertType, expectTypeOf } from "vitest";
import { CanvasGroupMixin, PrimaryCanvasGroup } from "#client/canvas/groups/_module.mjs";

class FakePrimaryGroup<
  DrawOptions extends PrimaryCanvasGroup.DrawOptions = PrimaryCanvasGroup.DrawOptions,
  TearDownOptions extends PrimaryCanvasGroup.TearDownOptions = PrimaryCanvasGroup.TearDownOptions,
> extends CanvasGroupMixin<typeof PIXI.Container, "primary">(PIXI.Container)<DrawOptions, TearDownOptions> {}

expectTypeOf(FakePrimaryGroup.groupName).toExtend<keyof CONFIG.Canvas.Groups>();
expectTypeOf(FakePrimaryGroup.tearDownChildren).toEqualTypeOf<boolean>();

const MyGroup = new FakePrimaryGroup();
assertType<PIXI.Container>(MyGroup);

expectTypeOf(MyGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"primary">>();
expectTypeOf(MyGroup.name).toEqualTypeOf<string>();
expectTypeOf(MyGroup.draw()).toEqualTypeOf<Promise<FakePrimaryGroup>>();
