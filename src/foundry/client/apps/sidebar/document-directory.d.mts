export {};

declare global {
  interface DocumentDirectoryOptions extends ApplicationOptions {
    /**
     * A list of data property keys that will trigger a rerender of the tab if
     * they are updated on a Document that this tab is responsible for.
     */
    renderUpdateKeys?: string[];

    /**
     * The CSS selector that activates the context menu for displayed Documents.
     */
    contextMenuSelector?: string;

    /**
     * The CSS selector for the clickable area of an entry in the tab.
     */
    entryClickSelector?: string;
  }
}
