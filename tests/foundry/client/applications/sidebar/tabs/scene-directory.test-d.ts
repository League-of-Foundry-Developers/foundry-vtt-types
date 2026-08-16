import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import ContextMenu = foundry.applications.ux.ContextMenu;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import SceneDirectory = foundry.applications.sidebar.tabs.SceneDirectory;
import Scenes = foundry.documents.collections.Scenes;

declare const directory: SceneDirectory;

expectTypeOf(directory).toExtend<DocumentDirectory.Any>();

// Widened from their literals so a subclass can occupy its own tab and render its own entry template.
expectTypeOf(SceneDirectory.tabName).toBeString();
expectTypeOf(SceneDirectory["_entryPartial"]).toBeString();

// Narrowed from the base's `DirectoryCollectionMixin.AnyMixed`.
expectTypeOf(directory.collection).toEqualTypeOf<Scenes.Implementation>();
expectTypeOf(directory.documentClass).toEqualTypeOf<Scene.ImplementationClass>();

declare const options: DeepPartial<SceneDirectory.RenderOptions>;
expectTypeOf(directory["_canRender"](options)).toEqualTypeOf<false | void>();

expectTypeOf(directory["_getEntryContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();
expectTypeOf(directory["_getFolderContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();
