import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../../src/types/utils.d.mts";

expectTypeOf(Scenes.documentName).toEqualTypeOf<"Scene">();

const scenes = new Scenes();
expectTypeOf(scenes.active).toEqualTypeOf<StoredDocument<Scene> | undefined>();
expectTypeOf(scenes.current).toEqualTypeOf<StoredDocument<Scene> | undefined>();
expectTypeOf(scenes.viewed).toEqualTypeOf<StoredDocument<Scene> | undefined>();
