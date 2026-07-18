import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type ApplicationV2 from "../api/application.d.mts";

import Document = foundry.abstract.Document;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AdventureExporter: AdventureExporter.Any;
    }
  }
}

/**
 * An interface for packaging Adventure content and loading it to a compendium pack.
 */
declare class AdventureExporter<
  RenderContext extends AdventureExporter.RenderContext = AdventureExporter.RenderContext,
  Configuration extends AdventureExporter.Configuration = AdventureExporter.Configuration,
  RenderOptions extends AdventureExporter.RenderOptions = AdventureExporter.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Adventure.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "adventure-exporter",
   *   classes: ["adventure-exporter"],
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-upload"
   *   },
   *   position: {width: 560},
   *   form: {
   *     closeOnSubmit: true
   *   },
   *   actions: {
   *     clearSection: AdventureExporter.#onClearSection,
   *     collapseSection: AdventureExporter.#onCollapseSection,
   *     removeContent: AdventureExporter.#onRemoveContent
   *   },
   *   canCreate: true
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   sheet: {
   *     tabs: [
   *       {id: "summary", icon: "fa-solid fa-feather-pointed"},
   *       {id: "contents", icon: "fa-solid fa-folder-tree"}
   *     ],
   *     initial: "summary",
   *     labelPrefix: "ADVENTURE.TABS"
   *   }
   * }
   * ```
   */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * The prepared document tree which is displayed in the form.
   */
  contentTree: Record<string, AdventureExporter.AdventureContentTreeRoot>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: object,
    options?: unknown,
  ): Promise<foundry.applications.api.DocumentSheetV2.SubmitResult<Adventure.Implementation>>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Stage a document for addition to the Adventure.
   * This adds the Document locally, the change is not yet submitted to the database.
   * @param document - Some document to be added to the Adventure.
   */
  addContent(document: Folder.Implementation | Document.Any): void;

  /**
   * Remove or restore a single Document from the Adventure.
   * @param document - The Document being removed from the Adventure.
   */
  removeContent(document: Document.Any): void;
}

declare namespace AdventureExporter {
  interface Any extends AnyAdventureExporter {}
  interface AnyConstructor extends Identity<typeof AnyAdventureExporter> {}

  interface AdventureContentTreeDocumentEntry {
    id: string;
    name: string;
    document: Document.Any;
    state: "add" | "remove" | "missing" | "update";
    stateLabel: string;
  }

  interface AdventureContentTreeNode {
    /** An alias for folder.id */
    id: string;

    /** An alias for folder.name */
    name: string;

    /** The Folder at this node level */
    folder: Folder.Implementation;

    /** The modification state of the Folder */
    state: "add" | "remove" | "missing" | "update";

    children: AdventureContentTreeNode[];
    documents: AdventureContentTreeDocumentEntry[];
  }

  interface AdventureContentTreeRoot {
    /** The folder ID is null at the root level */
    id: null;

    /** The Document name contained in this tree */
    documentName: string;

    /** The Document collection name of this tree */
    collection: string;

    /** The name displayed at the root level of the tree */
    name: string;

    /** The icon displayed at the root level of the tree */
    icon: string;

    /** CSS classes which describe the display of the tree */
    cssClass: string;

    /** The number of documents which are present in the tree */
    documentCount: number;

    /** Has the section been tentatively cleared of its contents? */
    cleared: boolean;

    folder: null;
    state: "root";
    children: AdventureContentTreeNode[];
    documents: AdventureContentTreeDocumentEntry[];
  }

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Adventure.Implementation> {
    contentTree: Record<string, AdventureContentTreeRoot>;
    adventure: Adventure.Implementation;
    tabClasses: string;
    tab?: ApplicationV2.Tab | undefined;
    buttons?: ApplicationV2.FormFooterButton[] | undefined;
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Adventure.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyAdventureExporter extends AdventureExporter<
  AdventureExporter.RenderContext,
  AdventureExporter.Configuration,
  AdventureExporter.RenderOptions
> {
  constructor(...args: never);
}

export default AdventureExporter;
