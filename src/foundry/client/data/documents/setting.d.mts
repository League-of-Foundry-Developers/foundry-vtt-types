import type {
  ConfiguredDocumentClassForName,
  ConfiguredDocumentInstanceForName,
} from "../../../../types/helperTypes.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";

declare global {
  namespace Setting {
    type ConfiguredClass = ConfiguredDocumentClassForName<"Setting">;
    type ConfiguredInstance = ConfiguredDocumentInstanceForName<"Setting">;
  }

  /**
   * The client-side Setting document which extends the common BaseSetting model.
   *
   * @see {@link WorldSettings}       The world-level collection of Setting documents
   */
  class Setting extends ClientDocumentMixin(foundry.documents.BaseSetting) {
    /**
     * The setting configuration for this setting document.
     */
    get config(): SettingsConfig | undefined;

    protected _initialize(options?: any): void;
    protected _initialize(): void;

    protected override _onCreate(
      data: foundry.documents.BaseSetting.ConstructorData,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected _onUpdate(
      changed: foundry.documents.BaseSetting.UpdateData,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    /**
     * Cast the value of the Setting into its defined type.
     * @returns The initialized type of the Setting document.
     */
    // TODO: This could probably be derived
    _castType(): any;
  }
}
