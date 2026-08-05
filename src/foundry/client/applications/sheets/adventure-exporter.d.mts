import type { DeepPartial, Identity, IntentionalPartial } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type { ClientDocumentMixin } from "#client/documents/abstract/_module.d.mts";

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
  /** @throws If the Adventure does not belong to a Compendium pack. */
  constructor(options: DocumentSheetV2.InputOptions<Configuration>);

  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * The prepared document tree which is displayed in the form.
   */
  contentTree: Record<string, AdventureExporter.ContentTreeRoot>;

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
    submitData: DocumentSheetV2.SubmitData<Adventure.Implementation>,
    options?: DocumentSheetV2.ProcessSubmitOptions<Adventure.Implementation>,
  ): Promise<DocumentSheetV2.SubmitResult<Adventure.Implementation>>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Stage a document for addition to the Adventure.
   * This adds the Document locally, the change is not yet submitted to the database.
   * @param document - Some document to be added to the Adventure.
   */
  addContent(document: ClientDocumentMixin.AnyMixed): void;

  /**
   * Remove or restore a single Document from the Adventure.
   * @param document - The Document being removed from the Adventure.
   */
  removeContent(document: ClientDocumentMixin.AnyMixed): void;

  #AdventureExporter: true;
}

declare namespace AdventureExporter {
  interface Any extends AnyAdventureExporter {}
  interface AnyConstructor extends Identity<typeof AnyAdventureExporter> {}

  interface RenderContext
    extends
      HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<Adventure.Implementation>,
      IntentionalPartial<PreparePartContext> {
    /** @remarks The same value as {@linkcode AdventureExporter.contentTree | #contentTree}. */
    contentTree: Record<string, ContentTreeRoot>;

    /** @remarks The same value as {@linkcode DocumentSheetV2.RenderContext.document | context.document}. */
    adventure: Adventure.Implementation;

    tabClasses: string;
  }

  /** @remarks Added by {@linkcode AdventureExporter._preparePartContext | #_preparePartContext} */
  interface PreparePartContext {
    /** @remarks Added for the `footer` part. */
    buttons: ApplicationV2.FormFooterButton[];

    /** @remarks Only added when the part being rendered is also a tab of the `sheet` group. */
    tab: ApplicationV2.Tab;
  }

  /** One node of the content tree, corresponding to a single Folder. */
  interface ContentTreeNode {
    /** An alias for folder.id */
    id: string | null;

    /** An alias for folder.name */
    name: string;

    /** The Folder at this node level */
    folder: Folder.Implementation | null;

    /** The modification state of the Folder */
    state: DocumentState;

    /** An array of child nodes */
    children: ContentTreeNode[];

    /** An array of documents */
    documents: ContentTreeDocument[];
  }

  /** An entry of {@linkcode ContentTreeNode.documents}. */
  interface ContentTreeDocument {
    id: string;

    name: string;

    document: ClientDocumentMixin.AnyMixed;

    state: DocumentState;

    /** @remarks The unlocalized `"ADVENTURE.Document{State}"` label for {@linkcode ContentTreeDocument.state | state}. */
    stateLabel: string;
  }

  /** The modification state of a Document within the content tree. */
  type DocumentState = "add" | "remove" | "missing" | "update" | "root";

  /** The root node of one document type's content tree. */
  interface ContentTreeRoot extends ContentTreeNode {
    /** The folder ID is null at the root level */
    id: null;

    /** The Document name contained in this tree */
    documentName: string;

    /** The Document collection name of this tree */
    collection: string;

    /** The icon displayed at the root level of the tree */
    icon: string;

    /** Has the section been tentatively cleared of its contents? */
    cleared: boolean;

    /** CSS classes which describe the display of the tree */
    cssClass: string;

    /** The number of documents which are present in the tree */
    documentCount: number;
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
