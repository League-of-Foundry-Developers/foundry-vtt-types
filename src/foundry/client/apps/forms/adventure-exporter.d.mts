import type { EditorView } from "prosemirror-view";
import type { Editor } from "tinymce";
import type { GetDataReturnType } from "../../../../types/utils.d.mts";

export {};

declare global {
  /**
   * An interface for packaging Adventure content and loading it to a compendium pack.
   */
  class AdventureExporter<Options extends AdventureExporter.Options = AdventureExporter.Options> extends DocumentSheet<
    Options,
    Adventure.ConfiguredInstance
  > {
    constructor(object?: Adventure.ConfiguredInstance & { pack: string }, options?: Partial<Options>);

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   template: "templates/adventure/exporter.html",
     *   id: "adventure-exporter",
     *   classes: ["sheet", "adventure", "adventure-exporter"],
     *   width: 560,
     *   height: "auto",
     *   tabs: [{navSelector: ".tabs", contentSelector: "form", initial: "summary"}],
     *   dragDrop: [{ dropSelector: "form" }],
     *   scrollY: [".tab.contents"],
     *   submitOnClose: false,
     *   closeOnSubmit: true
     * });
     * ```
     */
    static override get defaultOptions(): AdventureExporter.Options;

    /**
     * An alias for the Adventure document
     */
    adventure: this["object"];

    contentTree: Record<string, AdventureExporter.AdventureContentTreeRoot>;

    override get isEditable(): boolean;

    override getData(options?: Partial<Options>): Promise<GetDataReturnType<AdventureExporter.AdventureExporterData>>;

    override activateEditor(
      name: string,
      options?: TextEditor.Options,
      initialContent?: string,
    ): Promise<Editor | EditorView>;

    protected override _getHeaderButtons(): Application.HeaderButton[];

    override close(options?: FormApplication.CloseOptions): Promise<void>;

    override activateListeners(html: JQuery<HTMLElement>): void;

    protected override _updateObject(event: Event, adventureData: object): Promise<unknown>;

    protected override _onDrop(event: DragEvent): void;

    /**
     * Stage a document for addition to the Adventure.
     * This adds the document locally, the change is not yet submitted to the database.
     * @param document - Some document to be added to the Adventure.
     */
    addContent(document: ClientDocument): void;

    /**
     * Remove a single Document from the Adventure.
     * @param document - The Document being removed from the Adventure.
     */
    removeContent(document: ClientDocument): void;
  }

  namespace AdventureExporter {
    type Any = AdventureExporter<any>;

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Options extends DocumentSheetOptions<Adventure.ConfiguredInstance> {}

    interface AdventureContentTreeNode {
      /** An alias for folder.id */
      id: string | null;

      /** An alias for folder.name */
      name: string;

      /** The Folder at this node level */
      folder: Folder;

      /** The modification state of the Folder */
      state: string;

      /** An array of child nodes */
      children: AdventureContentTreeNode[];

      /** An array of documents */
      documents: { id: string; name: string; document: ClientDocument; state: string }[];
    }

    interface AdventureContentTreeRoot extends AdventureContentTreeNode {
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

      /** The icon which represents the current collapsed state of the tree */
      collapseIcon: string;

      /** CSS classes which describe the display of the tree */
      cssClass: string;

      /** The number of documents which are present in the tree */
      documentCount: number;
    }

    interface AdventureExporterData {
      adventure: Adventure.ConfiguredInstance;

      contentTree: AdventureExporter["contentTree"];
    }
  }
}
