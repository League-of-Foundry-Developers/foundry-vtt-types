// FOUNDRY_VERSION: 10.291

import type { DocumentModificationOptions } from "../../../common/abstract/document.mts";
import type BaseSetting from "../../../common/documents/setting.mts";

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
