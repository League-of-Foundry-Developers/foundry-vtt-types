import { expectTypeOf } from "vitest";

expectTypeOf(Scenes.documentName).toEqualTypeOf<"Scene">();

const scenes = new Scenes([]);
expectTypeOf(scenes.active).toEqualTypeOf<Scene.Stored | undefined>();
expectTypeOf(scenes.current).toEqualTypeOf<Scene.Stored | undefined>();
expectTypeOf(scenes.viewed).toEqualTypeOf<Scene.Stored | undefined>();
