import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

expectTypeOf(Scenes.documentName).toEqualTypeOf<"Scene">();

const scenes = new Scenes([]);
expectTypeOf(scenes.active).toEqualTypeOf<Scene.Stored | undefined>();
expectTypeOf(scenes.current).toEqualTypeOf<Scene.Stored | undefined>();
expectTypeOf(scenes.viewed).toEqualTypeOf<Scene.Stored | undefined>();
