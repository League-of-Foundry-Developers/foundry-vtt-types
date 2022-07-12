import { DocumentModificationOptions } from '../../../common/abstract/document.mjs';
declare global {
  /**
   * The client-side Setting document which extends the common BaseSetting model.
   * Each Setting document contains SettingData which defines its data schema.

   * @see {@link data.SettingData}              The Setting data schema
   * @see {@link documents.WorldSettings}       The world-level collection of Setting documents
   */
  class Setting extends ClientDocumentMixin(foundry.documents.BaseSetting) {
    protected override _onCreate(
      data: foundry.documents.BaseSetting['_source'],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected _onUpdate(
      changed: DeepPartial<foundry.documents.BaseSetting['_source']>,
      options: DocumentModificationOptions,
      userId: string
    ): void;
  }
}

export {};
