// TODO
declare global {
  /**
   * The client-side Setting document which extends the common BaseSetting abstraction.
   * Each Setting document contains SettingData which defines its data schema.
   *
   * @see {@link data.SettingData}              The Setting data schema
   * @see {@link documents.WorldSettings}       The world-level collection of Setting documents
   *
   * @param data - Initial data provided to construct the Setting document
   */
  class Setting extends ClientDocumentMixin(foundry.documents.BaseSetting) {}
}

export {};
