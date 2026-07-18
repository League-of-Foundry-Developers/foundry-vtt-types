import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import ContextMenu = foundry.applications.ux.ContextMenu;

declare class TestDirectory extends DocumentDirectory<Actor.ImplementationClass> {}
declare const directory: TestDirectory;

expectTypeOf(directory.documentClass).toEqualTypeOf<Actor.ImplementationClass>();
expectTypeOf(directory.documentName).toEqualTypeOf<string>();
expectTypeOf(directory.title).toEqualTypeOf<string>();
expectTypeOf(directory.collection).toEqualTypeOf<foundry.documents.abstract.DirectoryCollectionMixin.AnyMixed>();
expectTypeOf(directory.collapseAll()).toBeVoid();

expectTypeOf(DocumentDirectory.DEFAULT_OPTIONS).toEqualTypeOf<DocumentDirectory.DefaultOptions>();
expectTypeOf(DocumentDirectory.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare class _TestDirectorySubclass extends DocumentDirectory<Actor.ImplementationClass> {
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
  protected override _getFolderContextOptions(): ContextMenu.Entry<HTMLElement>[];
  protected override _onDrop(event: DragEvent): Promise<void> | undefined;
  protected override _canDragStart(selector: string): boolean;
  protected override _onDragStart(event: DragEvent): void;
  protected override _canRender(options: DeepPartial<DocumentDirectory.RenderOptions>): false | void;
}
