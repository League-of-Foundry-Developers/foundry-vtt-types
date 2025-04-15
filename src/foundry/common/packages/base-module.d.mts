import type BasePackage from "./base-package.d.mts";

declare namespace BaseModule {
  export import Source = Module.Source;
  export import PersistedData = Module.Source;
  export import CreateData = Module.CreateData;
  export import InitializedData = Module.InitializedData;
  export import UpdateData = Module.UpdateData;
  export import Schema = Module.Schema;
}

/**
 * The data schema used to define Module manifest files.
 * Extends the basic PackageData schema with some additional module-specific fields.
 */
declare class BaseModule extends BasePackage<BaseModule.Schema> {
  static defineSchema(): BaseModule.Schema;

  static type: "module";

  /**
   * The default icon used for this type of Package.
   * @defaultValue `"fa-plug"`
   */
  static icon: string;
}

export default BaseModule;
