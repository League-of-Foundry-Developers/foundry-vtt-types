import type BasePackage from "./base-package.d.mts";
import * as fields from "../data/fields.mjs";
import type AdditionalTypesField from "./sub-types.mjs";

declare namespace BaseModule {
  type Schema = ReturnType<typeof BasePackage.defineSchema> & {
    coreTranslation: fields.BooleanField;
    library: fields.BooleanField;
    documentTypes: AdditionalTypesField;
  };
}

/**
 * The data schema used to define Module manifest files.
 * Extends the basic PackageData schema with some additional module-specific fields.
 */
export default class BaseModule extends BasePackage<BaseModule.Schema> {
  static defineSchema(): BaseModule.Schema;

  static type: "module";

  /**
   * The default icon used for this type of Package.
   * @defaultValue `"fa-plug"`
   */
  static icon: string;
}
