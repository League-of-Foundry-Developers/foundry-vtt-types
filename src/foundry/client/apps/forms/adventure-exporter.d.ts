import type { EditorView } from "prosemirror-view";
import type { Editor } from "tinymce";
import type { ConfiguredDocumentClassForName, ConstructorDataType } from "../../../../types/helperTypes.js";
import type { DocumentId } from "../../../common/data/fields.mjs.js";
import type { AdventureData } from "../../../common/data/module.mjs.js";

// FIXME: The use of `foundry.abstract.Document<any, any>` here is temporary.
// Once the `ClientDocument` type has been added, those references should be
// changed to just use `ClientDocument` instead.
/**
 * An interface for packaging Adventure content and loading it to a compendium pack.
 */
declare global {
  class AdventureExporter<
    Options extends DocumentSheetOptions<Adventure> = DocumentSheetOptions<Adventure>
  > extends DocumentSheet<Options, InstanceType<ConfiguredDocumentClassForName<"Adventure">>> {
    /**
     * An alias for the Adventure document
     */
    adventure: Adventure;

    /**
     * The prepared document tree which is displayed in the form.
     */
    contentTree: Map<string, AdventureContentTreeRoot>;

    /**
     * A mapping which allows convenient access to content tree nodes by their folder ID
     */
    #treeNodes: Map<string, AdventureContentTreeNode>;

    /**
     * Track data for content which has been added to the adventure.
     */
    #addedContent: Map<string, Set<foundry.abstract.Document<any, any>>>;

    /**
     * Track the IDs of content which has been removed from the adventure.
     */
    #removedContent: Map<string, Set<foundry.abstract.Document<any, any>>>;

    /**
     * Track which settings of the content are collapsed.
     */
    #collapsedSections: Set<string>;

    override get isEditable(): boolean;

    activateEditor(
      name: string,
      options?: TextEditor.Options | undefined,
      initialContent?: string | undefined
    ): Promise<Editor | EditorView>;

    protected _getHeaderButtons(): Application.HeaderButton[];
    /**
     * Organize content in the adventure into a tree structure which is displayed in the UI.
     * @returns {Object<AdventureContentTreeRoot>}
     */
    #organizeContentTree(): AdventureContentTreeRoot;
    /**
     * Populate one node of the content tree with folders and documents
     * @param node - The node being populated
     * @param remainingFolders - Folders which have yet to be populated to a node
     * @param remainingDocuments - Documents which have yet to be populated to a node
     * @returns Folders and Documents which still have yet to be populated
     */
    #populateNode(
      node: AdventureContentTreeNode,
      remainingFolders: Folder[],
      remainingDocuments: foundry.abstract.Document<any, any>[]
    ): Array<Folder[] | foundry.abstract.Document<any, any>[]>;

    /**
     * Flag the current state of the document which is displayed
     * @param document - The document being modified
     * @returns The document state
     */
    #getDocumentState(document: foundry.abstract.Document<any, any>): ModificationState;

    close(options?: FormApplication.CloseOptions | undefined): Promise<void>;

    activateListeners(html: JQuery<HTMLElement>): void;

    protected override _updateObject(event: Event, formData: AdventureData): Promise<unknown>;

    /**
     * Save editing progress so that re-renders of the form do not wipe out un-saved changes.
     */
    #saveProgress(): void;

    /**
     * Handle pointer events on a control button
     * @param event - The originating pointer event
     */
    #onClickControl(event: JQuery.ClickEvent);

    /**
     * Clear all content from a particular document-type section.
     * @param button - The clicked control button
     */
    #onClearSection(button: HTMLAnchorElement): void;

    /**
     * Toggle the collapsed or expanded state of a document-type section
     * @param button - The clicked control button
     */
    #onCollapseSection(button: HTMLAnchorElement): void;

    /**
     * Remove a single piece of content.
     * @param button - The clicked control button
     */
    #onRemoveContent(button: HTMLAnchorElement): void;

    /**
     * Get the Document instance from the clicked content tag.
     * @param documentName - The document type
     * @param documentId - The document ID
     * @returns The Document instance, or null
     */
    #getDocument(documentName: string, documentId: DocumentId): foundry.abstract.Document<any, any> | null;

    protected _onDrop(event: DragEvent): void;

    /**
     * Stage a document for addition to the Adventure.
     * This adds the document locally, the change is not yet submitted to the database.
     * @param document - Some document to be added to the Adventure.
     */
    addContent(document: Folder | foundry.abstract.Document<any, any>): void;

    /**
     * Remove a single Document from the Adventure.
     * @param document - The Document being removed from the Adventure.
     */
    removeContent(document: foundry.abstract.Document<any, any>): void;

    /**
     * Remove a single document from the content tree
     * @param node - The node to remove
     */
    #removeNode(node: AdventureContentTreeNode): void;

    /**
     * Restore a removed node back to the content tree
     * @param node - The node to restore
     */
    #restoreNode(node: AdventureContentTreeNode): void;

    /**
     * Remove a single document from the content tree
     * @param document - The document to remove
     */
    #removeDocument(document: foundry.abstract.Document<any, any>): void;

    /**
     * Add an entire folder tree including contained documents and subfolder to the Adventure.
     * @param folder The folder to add
     */
    #addFolder(folder: Folder): void;
  }

  type ModificationState = "remove" | "add" | "missing" | "update";

  type AdventureContentTreeNode = {
    /** An alias for folder.id */
    id: string;
    /** An alias for folder.name */
    name: string;
    /** The Folder at this node level */
    folder: Folder;
    /** The modification state of the Folder */
    state: ModificationState;
    /** An array of child nodes */
    children: AdventureContentTreeNode[];
    /** An array of documents */
    documents: { id: string; name: string; document: foundry.abstract.Document<any, any> };
  };

  type AdventureContentTreeRoot = AdventureContentTreeNode & {
    /** The folder ID is null at the root level */
    id: null;
    /** The Document name contained in this tree */
    documentName: string;
    /** The Document collection name of this tree */
    collection: string;
    /** The icon displayed at the root level of the tree */
    icon: string;
    /** The icon which represents the current collapsed state of the tree */
    collapseIcon: string;
    /** CSS classes which describe the display of the tree */
    cssClass: string;
    /** The number of documents which are present in the tree */
    documentCount: number;
  };
}
