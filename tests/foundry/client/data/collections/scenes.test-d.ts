import { expectTypeOf } from "vitest";
import type Document from "../../../../../src/foundry/common/abstract/document.d.mts";

expectTypeOf(Scenes.documentName).toEqualTypeOf<"Scene">();

const scenes = new Scenes([]);
expectTypeOf(scenes.active).toEqualTypeOf<Document.Stored<Scene> | undefined>();
expectTypeOf(scenes.current).toEqualTypeOf<Document.Stored<Scene> | undefined>();
expectTypeOf(scenes.viewed).toEqualTypeOf<Document.Stored<Scene> | undefined>();
