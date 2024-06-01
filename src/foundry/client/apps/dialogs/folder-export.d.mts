export {};

declare global {
  /**
   * A Dialog subclass which allows the user to configure export options for a Folder
   */
  class FolderExport extends Dialog {
    override activateListeners(html: JQuery): void;

    /**
     * Handle changing the selected pack by updating the dropdown of folders available.
     * @param event   - The input change event
     */
    protected _onPackChange(event: Event): void;
  }
}
