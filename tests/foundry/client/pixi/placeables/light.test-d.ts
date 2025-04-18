import { expectTypeOf } from "vitest";
import type { LightSource } from "../../../../../src/foundry/client/pixi/placeables/light.d.mts";

declare const doc: AmbientLightDocument;

expectTypeOf(AmbientLight.embeddedName).toEqualTypeOf<"AmbientLight">();

const light = new AmbientLight(doc);
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
