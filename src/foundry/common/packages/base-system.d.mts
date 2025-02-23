import type BasePackage from "./base-package.d.mts";

declare namespace BaseSystem {
  export import Source = Module.Source;
  export import PersistedData = Module.PersistedData;
  export import CreateData = Module.CreateData;
  export import InitializedData = Module.InitializedData;
  export import UpdateData = Module.UpdateData;
  export import Schema = Module.Schema;
}

/**
 * The data schema used to define System manifest files.
 * Extends the basic PackageData schema with some additional system-specific fields.
 */
declare class BaseSystem extends BasePackage<BaseSystem.Schema> {
  static defineSchema(): BaseSystem.Schema;

  static type: "system";

  /**
   * The default icon used for this type of Package.
   * @defaultValue `"fa-dice"`
   */
  static icon: string;

  /**
   * Does the system template request strict type checking of data compared to template.json inferred types.
   */
  strictDataCleaning: boolean;
}

export default BaseSystem;
