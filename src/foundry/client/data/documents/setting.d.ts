// FOUNDRY_VERSION: 10.291

import { DocumentModificationOptions } from "../../../common/abstract/document.mjs";
import type BaseSetting from "../../../common/documents/setting.mjs";

declare global {
  /**
   * The client-side Setting document which extends the common BaseSetting model.
   * @see {@link SettingData}         The Setting data schema
   * @see {@link WorldSettings}       The world-level collection of Setting documents
   */
  class Setting extends ClientDocumentMixin(BaseSetting) {
    protected override _onCreate(data: BaseSetting.Source, options: DocumentModificationOptions, userId: string): void;

    protected override _onUpdate(
      changed: BaseSetting.UpdateData,
      options: DocumentModificationOptions,
      userId: string,
    ): void;
  }
}
