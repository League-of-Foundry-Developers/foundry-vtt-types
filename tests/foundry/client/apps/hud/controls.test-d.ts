import { assertType, expectTypeOf } from "vitest";

expectTypeOf(new SceneControls()).toEqualTypeOf<SceneControls>();
expectTypeOf(new SceneControls({ width: null })).toEqualTypeOf<SceneControls>();
expectTypeOf(SceneControls.defaultOptions.width).toEqualTypeOf<number | null>();

const controls = new SceneControls();
expectTypeOf(controls.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(SceneControls.defaultOptions).toEqualTypeOf<ApplicationOptions>();

expectTypeOf(controls.initialize()).toEqualTypeOf<void>();
expectTypeOf(controls.initialize({ control: "token" })).toEqualTypeOf<void>();
expectTypeOf(controls.initialize({ layer: "tokens" })).toEqualTypeOf<void>();
expectTypeOf(controls.initialize({ tool: "select" })).toEqualTypeOf<void>();

expectTypeOf(controls.controls).toEqualTypeOf<SceneControl[]>();
expectTypeOf(controls.controls.map((each) => each.tools)).toEqualTypeOf<SceneControlTool[][]>();

expectTypeOf(controls.control).toEqualTypeOf<SceneControl | null>();
expectTypeOf(controls.activeTool).toEqualTypeOf<string | null>();
expectTypeOf(controls.tool).toEqualTypeOf<SceneControlTool | null>();
expectTypeOf(controls.isRuler).toEqualTypeOf<boolean>();
expectTypeOf(controls.getData()).toEqualTypeOf<{
  controls: SceneControl[];
  active: boolean;
  cssClass: "" | "disabled";
}>();

assertType<SceneControlTool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  onClick: () => undefined,
});
assertType<SceneControlTool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  toggle: false,
  onClick: () => undefined,
});
assertType<SceneControlTool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  button: true,
  onClick: () => undefined,
});
assertType<SceneControlTool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  toggle: true,
  onClick: (toggle: boolean) => toggle,
});

// @ts-expect-error the onClick function isn't toggleable.
assertType<SceneControlTool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  toggle: false,
  onClick: (toggle: boolean) => toggle,
});

// @ts-expect-error the onClick function isn't toggleable.
assertType<SceneControlTool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  onClick: (toggle: boolean) => toggle,
});
