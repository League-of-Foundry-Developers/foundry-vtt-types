import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import Compendium = foundry.applications.sidebar.apps.Compendium;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import ContextMenu = foundry.applications.ux.ContextMenu;

declare class TestCompendium extends Compendium<Actor.ImplementationClass> {}
declare const compendium: TestCompendium;

expectTypeOf(compendium.isPopout).toEqualTypeOf<boolean>();
expectTypeOf(compendium.title).toEqualTypeOf<string>();

expectTypeOf(Compendium.DEFAULT_OPTIONS).toEqualTypeOf<DocumentDirectory.DefaultOptions>();
expectTypeOf(Compendium.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare class _TestCompendiumSubclass extends Compendium<Actor.ImplementationClass> {
  protected override _canRender(options: DeepPartial<Compendium.RenderOptions>): false | void;
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
  protected override _getFolderContextOptions(): ContextMenu.Entry<HTMLElement>[];
  protected override _canDragDrop(selector: string): boolean;
  protected override _entryAlreadyExists(entry: foundry.abstract.Document.Any): boolean;
  protected override _onClickEntry(
    event: PointerEvent,
    target: HTMLElement,
    options?: DocumentDirectory.HandlerOptions,
  ): Promise<foundry.applications.api.ApplicationV2.Any | foundry.appv1.api.Application.Any | void>;
}
