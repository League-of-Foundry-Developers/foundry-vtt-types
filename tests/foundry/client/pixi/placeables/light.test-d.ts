import { expectTypeOf } from "vitest";

expectTypeOf(AmbientLight.RENDER_FLAGS.redraw?.propagate).toEqualTypeOf<
  // undefined only from the optional chain, not underlying type
  Array<"redraw" | "refresh" | "refreshState" | "refreshField" | "refreshPosition" | "refreshElevation"> | undefined
>();

declare const doc: AmbientLightDocument;

expectTypeOf(AmbientLight.embeddedName).toEqualTypeOf<"AmbientLight">();

const light = new AmbientLight(doc);
expectTypeOf(
  light["_onUpdate"](
    { config: { bright: 20 } },
    { render: false, modifiedTime: 12435, diff: true, recursive: true },
    "asfasdf",
  ),
).toBeVoid();
expectTypeOf(light.source).toEqualTypeOf<LightSource>();
expectTypeOf(light.controlIcon).toEqualTypeOf<ControlIcon | undefined>();
expectTypeOf(light.global).toEqualTypeOf<boolean>();
expectTypeOf(light.radius).toEqualTypeOf<number>();
expectTypeOf(light.dimRadius).toEqualTypeOf<number>();
expectTypeOf(light.brightRadius).toEqualTypeOf<number>();
expectTypeOf(light.isVisible).toEqualTypeOf<boolean>();
expectTypeOf(light.draw()).toEqualTypeOf<Promise<AmbientLight>>();
expectTypeOf(light.refresh()).toEqualTypeOf<AmbientLight>();
expectTypeOf(light.refreshControl()).toEqualTypeOf<void>();
expectTypeOf(light.sourceId).toEqualTypeOf<string>();
