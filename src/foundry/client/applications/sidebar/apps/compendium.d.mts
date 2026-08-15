import type { AnyObject, DeepPartial, FixedInstanceType, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ContextMenu from "../../ux/context-menu.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";

import Document = foundry.abstract.Document;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      Compendium: Compendium.Any;
    }
  }
}

/**
 * An Application that displays the indexed contents of a Compendium pack.
 */
declare class Compendium<
  DocumentClass extends Document.AnyConstructor = Document.AnyConstructor,
  RenderContext extends Compendium.RenderContext = Compendium.RenderContext,
  Configuration extends Compendium.Configuration = Compendium.Configuration,
  RenderOptions extends Compendium.RenderOptions = Compendium.RenderOptions,
> extends DocumentDirectory<DocumentClass, RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: Compendium.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected static override _entryPartial: string;

  /**
   * The Document collection that this directory represents.
   *
   * @privateRemarks Fake override to narrow the base's
   * {@linkcode foundry.documents.abstract.DirectoryCollectionMixin.AnyMixed} to a pack. This class reads
   * `collection`, `locked`, `visible`, `index`, `title` and `getDocument`, none of which the mixin declares.
   */
  override get collection(): foundry.documents.collections.CompendiumCollection.Any;

  /** @remarks Always `false`. A compendium renders as its own window rather than as a tab in the sidebar. */
  override get isPopout(): boolean;

  /** @remarks The localized pack title. */
  override get title(): string;

  /**
   * @remarks Derives `uniqueId` from the pack's collection name, so each pack gets its own application instance.
   */
  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  protected override _canCreateEntry(): boolean;

  protected override _canCreateFolder(): boolean;

  /** @remarks Refuses to render a pack the user cannot see, warning them when the render was forced. */
  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  /** @remarks Defaults the window icon to an open or closed padlock, depending on whether the pack is locked. */
  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /** @remarks Drops the inherited "Configure Ownership" and "Export Folder" entries. */
  protected override _getFolderContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /** @remarks Appends a "Copy ID" button when the pack has a collection name. */
  protected override _getFrameButtons(options: DeepPartial<RenderOptions>): ApplicationV2.HeaderControlsEntry[];

  protected override _prepareHeaderContext(
    context: ApplicationV2.RenderContext,
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Promise<void>;

  /** @remarks Applies the configured interface color scheme, unless the application is already classed `themed`. */
  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * @remarks For an `Adventure` pack this opens the adventure's sheet built from index data rather than deferring
   * to {@linkcode DocumentDirectory._onClickEntry}, fetching the full document first when that sheet is an AppV1
   * {@linkcode foundry.appv1.sheets.AdventureImporter | AdventureImporter}.
   */
  protected override _onClickEntry(
    event: PointerEvent,
    target: HTMLElement,
    options?: DocumentDirectory.SkipDeprecationOptions,
  ): Promise<void>;

  /**
   * @remarks For an `Adventure` pack this creates no entry: it builds an unsaved {@linkcode Adventure} and renders
   * `CONFIG.Adventure.exporterClass` for it, so the returned promise resolves to that exporter application rather
   * than to a document.
   *
   * @privateRemarks Declared at the inherited width. The exporter is an {@linkcode ApplicationV2}, not a
   * {@linkcode Document}, so it is not assignable here, and widening the base for one subclass's branch would give
   * every other directory a return type it never produces.
   */
  protected override _onCreateEntry(
    event: PointerEvent,
    target: HTMLElement,
  ): Promise<FixedInstanceType<DocumentClass> | null>;

  /** @remarks Ignores `selector`: any drop is permitted for a user who owns the pack, and refused otherwise. */
  protected override _canDragDrop(selector: string): boolean;

  /** @remarks Tested against the pack index rather than against instantiated documents. */
  protected override _entryAlreadyExists(entry: FixedInstanceType<DocumentClass>): boolean;

  /** @remarks The drag data carries the entry's compendium UUID rather than its ID. */
  protected override _getEntryDragData(entryId: string): AnyObject;

  static #Compendium: true;
}

declare namespace Compendium {
  interface Any extends AnyCompendium {}
  interface AnyConstructor extends Identity<typeof AnyCompendium> {}

  /**
   * @privateRemarks Empty because Compendium adds nothing to the shared render context. Its `collection` and
   * `title` additions are made by `_prepareHeaderContext` and so reach only the header part, the same way the
   * base's `searchMode` and `sortMode` do.
   */
  interface RenderContext extends DocumentDirectory.RenderContext {}

  interface Configuration<
    Compendium extends Compendium.Any = Compendium.Any,
  > extends DocumentDirectory.Configuration<Compendium> {
    /**
     * The Document collection that this directory represents.
     *
     * @remarks A pack collection name is accepted here and resolved to the pack itself during
     * `_initializeApplicationOptions`.
     */
    collection: foundry.documents.collections.CompendiumCollection.Any | string;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<Compendium extends Compendium.Any = Compendium.Any> = DeepPartial<Configuration<Compendium>> &
    object;

  interface RenderOptions extends DocumentDirectory.RenderOptions {}
}

declare abstract class AnyCompendium extends Compendium<
  Document.AnyConstructor,
  Compendium.RenderContext,
  Compendium.Configuration,
  Compendium.RenderOptions
> {
  constructor(...args: never);
}

export default Compendium;
