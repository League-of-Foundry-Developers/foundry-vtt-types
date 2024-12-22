import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

expectTypeOf(Scenes.documentName).toEqualTypeOf<"Scene">();

const scenes = new Scenes([]);
expectTypeOf(scenes.active).toEqualTypeOf<Document.Stored<Scene> | undefined>();
expectTypeOf(scenes.current).toEqualTypeOf<Document.Stored<Scene> | undefined>();
expectTypeOf(scenes.viewed).toEqualTypeOf<Document.Stored<Scene> | undefined>();
