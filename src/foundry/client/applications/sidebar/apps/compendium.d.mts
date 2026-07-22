import type { DeepPartial, FixedInstanceType, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";
import type ContextMenu from "../../ux/context-menu.d.mts";
import type CompendiumCollection from "#client/documents/collections/compendium-collection.d.mts";

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
  RenderOptions extends Compendium.RenderOptions = ApplicationV2.RenderOptions,
> extends DocumentDirectory<DocumentClass, RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "Compendium-{id}",
   *   classes: ["compendium-directory", "sidebar-popout"],
   *   window: {
   *     frame: true,
   *     positioned: true
   *   },
   *   position: {
   *     top: 70,
   *     left: 120,
   *     width: 350,
   *     height: window.innerHeight - 100
   *   },
   *   actions: {
   *     copyId: Compendium.#onCopyId
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentDirectory.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   header: {
   *     template: "templates/sidebar/apps/compendium/header.hbs"
   *   },
   *   directory: {
   *     template: "templates/sidebar/apps/compendium/directory.hbs",
   *     templates: ["templates/sidebar/directory/directory.hbs"],
   *     scrollable: [".directory-list"]
   *   },
   *   footer: DocumentDirectory.PARTS.footer
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /** @defaultValue `"templates/sidebar/apps/compendium/index-partial.hbs"` */
  protected static override _entryPartial: string;

  override get isPopout(): boolean;

  override get title(): string;

  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  protected override _canCreateEntry(): boolean;

  protected override _canCreateFolder(): boolean;

  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  protected override _getFolderContextOptions(): ContextMenu.Entry<HTMLElement>[];

  protected override _getFrameButtons(options: DeepPartial<RenderOptions>): ApplicationV2.HeaderControlsEntry[];

  protected override _prepareHeaderContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onClickEntry(
    event: PointerEvent,
    target: HTMLElement,
    options?: DocumentDirectory.HandlerOptions,
  ): Promise<ApplicationV2.Any | foundry.appv1.api.Application.Any | void>;

  protected override _onCreateEntry(event: PointerEvent, target: HTMLElement): Promise<unknown>;

  protected override _canDragDrop(selector: string): boolean;

  protected override _entryAlreadyExists(entry: Document.Any): boolean;

  protected override _getEntryDragData(
    entryId: string,
  ): Document.DropDataFor<FixedInstanceType<DocumentClass>["documentName"]>;

  static #Compendium: true;
}

declare namespace Compendium {
  interface Any extends AnyCompendium {}
  interface AnyConstructor extends Identity<typeof AnyCompendium> {}

  interface RenderContext extends DocumentDirectory.RenderContext {
    /** @remarks Added by {@linkcode Compendium._prepareHeaderContext | #_prepareHeaderContext} */
    collection?: CompendiumCollection.Any | undefined;

    /** @remarks Added by {@linkcode Compendium._prepareHeaderContext | #_prepareHeaderContext} */
    title?: string | undefined;
  }

  interface Configuration<
    Compendium extends Compendium.Any = Compendium.Any,
  > extends DocumentDirectory.Configuration<Compendium> {
    collection: CompendiumCollection.Any;
  }

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
