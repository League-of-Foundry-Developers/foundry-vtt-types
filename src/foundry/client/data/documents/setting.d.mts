import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";

declare global {
  namespace Setting {
    type ConfiguredClass = ConfiguredDocumentClassForName<"Setting">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;
  }

  /**
   * The client-side Setting document which extends the common BaseSetting model.
   *
   * @see {@link WorldSettings}       The world-level collection of Setting documents
   */
  class Setting extends ClientDocumentMixin(foundry.documents.BaseSetting) {
    /**
     * @privateRemarks This exists to let ts know that this class has a private property
     */
    static #PRIMITIVE_TYPES: any;

    /**
     * The setting configuration for this setting document.
     */
    get config(): SettingsConfig | undefined;

    // TODO: This is the same as `DataModel._initialize`
    protected _initialize(options?: any): void;

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
    protected _castType(): any;
  }
}
