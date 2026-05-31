import type { BasePackage } from "#common/packages/_module.d.mts";
import type { DataModel } from "#common/abstract/_module.d.mts";
import type { fields } from "#client/data/_module.d.mts";

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

  /* DataModel overrides */

  static override _schema: fields.SchemaField<BaseModule.Schema>;

  static override get schema(): fields.SchemaField<BaseModule.Schema>;

  static override validateJoint(data: BaseModule.Source): void;

  static override fromSource(source: BaseModule.ManifestData, context?: DataModel.FromSourceOptions): BaseModule;

  static override fromJSON(json: string): BaseModule;
}

export default BaseModule;
