import type BasePackage from "./base-package.d.mts";

import Module = foundry.packages.Module;

declare namespace BaseModule {
  export import Source = Module.Source;
  export import CreateData = Module.CreateData;
  export import InitializedData = Module.InitializedData;
  export import UpdateData = Module.UpdateData;
  export import Schema = Module.Schema;
  export import ManifestData = Module.ManifestData;
}

/**
 * The data schema used to define Module manifest files.
 * Extends the basic PackageData schema with some additional module-specific fields.
 */
declare class BaseModule extends BasePackage<BaseModule.Schema> {
  // fake type override
  static override type: "module";

  // fake type override
  static override get collection(): `${typeof BaseModule.type}s`;

  // fake type override
  override get type(): typeof BaseModule.type;

  // fake type override, see BasePackage#version
  override version: string;

  static override defineSchema(): BaseModule.Schema;

  /**
   * The default icon used for this type of Package.
   * @defaultValue `"fa-plug"`
   */
  static icon: string;

  // fake type override
  static override testAvailability(
    data: BaseModule.ManifestData | BaseModule,
    options: BasePackage.TestAvailabilityOptions,
  ): CONST.PACKAGE_AVAILABILITY_CODES;
}

export default BaseModule;
