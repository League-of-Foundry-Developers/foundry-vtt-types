import type Document from "../../../common/abstract/document.d.mts";
import type BaseSetting from "../../../common/documents/setting.d.mts";

declare global {
  namespace Setting {
    type Metadata = Document.MetadataFor<Setting>;

    type ConfiguredClass = Document.ConfiguredClassForName<"Setting">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"Setting">;

    interface DatabaseOperations extends Document.Database.Operations<Setting> {}

    // Helpful aliases
    type ConstructorData = BaseSetting.ConstructorData;
    type UpdateData = BaseSetting.UpdateData;
    type Schema = BaseSetting.Schema;
    type Source = BaseSetting.Source;
  }

  /**
   * The client-side Setting document which extends the common BaseSetting model.
   *
   * @see {@link WorldSettings}       The world-level collection of Setting documents
   */
  class Setting extends ClientDocumentMixin(foundry.documents.BaseSetting) {
    static override metadata: Setting.Metadata;

    static get implementation(): Setting.ConfiguredClass;

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

    /**
     * @privateRemarks _onCreate and _preUpdate are overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /**
     * Cast the value of the Setting into its defined type.
     * @returns The initialized type of the Setting document.
     */
    // TODO: This could probably be derived
    protected _castType(): any;
  }
}
