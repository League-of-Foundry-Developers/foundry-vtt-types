import { assertType, expectTypeOf } from "vitest";

expectTypeOf(new SceneControls()).toEqualTypeOf<SceneControls>();
expectTypeOf(new SceneControls({ width: null })).toEqualTypeOf<SceneControls>();
expectTypeOf(SceneControls.defaultOptions.width).toEqualTypeOf<number | null>();

const controls = new SceneControls();
expectTypeOf(controls.options).toEqualTypeOf<Application.Options>();
expectTypeOf(SceneControls.defaultOptions).toEqualTypeOf<Application.Options>();

expectTypeOf(controls.initialize()).toEqualTypeOf<void>();
expectTypeOf(controls.initialize({ control: "token" })).toEqualTypeOf<void>();
expectTypeOf(controls.initialize({ layer: "tokens" })).toEqualTypeOf<void>();
expectTypeOf(controls.initialize({ tool: "select" })).toEqualTypeOf<void>();

expectTypeOf(controls.controls).toEqualTypeOf<SceneControls.Control[]>();
expectTypeOf(controls.controls.map((each) => each.tools)).toEqualTypeOf<SceneControls.Tool[][]>();

expectTypeOf(controls.control).toEqualTypeOf<SceneControls.Control | null>();
expectTypeOf(controls.activeTool).toEqualTypeOf<string | null>();
expectTypeOf(controls.tool).toEqualTypeOf<SceneControls.Tool | null>();
expectTypeOf(controls.isRuler).toEqualTypeOf<boolean>();
expectTypeOf(controls.getData()).toEqualTypeOf<{
  controls: SceneControls.Control[];
  active: boolean;
  cssClass: "" | "disabled";
}>();

assertType<SceneControls.Tool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  onClick: () => undefined,
});
assertType<SceneControls.Tool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  toggle: false,
  onClick: () => undefined,
});
assertType<SceneControls.Tool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  button: true,
  onClick: () => undefined,
});
assertType<SceneControls.Tool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  toggle: true,
  onClick: (toggle: boolean) => toggle,
});

// @ts-expect-error the onClick function isn't toggleable.
assertType<SceneControls.Tool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  toggle: false,
  onClick: (toggle: boolean) => toggle,
});

// @ts-expect-error the onClick function isn't toggleable.
assertType<SceneControls.Tool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  onClick: (toggle: boolean) => toggle,
});
