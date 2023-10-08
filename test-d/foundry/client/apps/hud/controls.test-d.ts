import { expectAssignable, expectNotAssignable, expectType } from "tsd";

expectType<SceneControls>(new SceneControls());
expectType<SceneControls>(new SceneControls({ width: null }));
expectType<number | null>(SceneControls.defaultOptions.width);

const controls = new SceneControls();
expectType<void>(controls.initialize());
expectType<void>(controls.initialize({ control: "token" }));
expectType<void>(controls.initialize({ layer: "tokens" }));
expectType<void>(controls.initialize({ tool: "select" }));

expectType<SceneControl[]>(controls.controls);
expectType<SceneControlTool[][]>(controls.controls.map((each) => each.tools));

expectAssignable<SceneControlTool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  onClick: () => undefined,
});
expectAssignable<SceneControlTool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  toggle: false,
  onClick: () => undefined,
});
expectAssignable<SceneControlTool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  button: true,
  onClick: () => undefined,
});
expectAssignable<SceneControlTool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  toggle: true,
  onClick: (toggle: boolean) => toggle,
});
expectNotAssignable<SceneControlTool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  toggle: false,
  onClick: (toggle: boolean) => toggle,
});
expectNotAssignable<SceneControlTool>({
  name: "foo",
  title: "bar",
  icon: "baz",
  onClick: (toggle: boolean) => toggle,
});
