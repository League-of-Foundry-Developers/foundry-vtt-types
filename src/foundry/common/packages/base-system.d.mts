import type { BasePackage } from "#common/packages/_module.d.mts";
import type { DataModel } from "#common/abstract/_module.d.mts";
import type { fields } from "#client/data/_module.d.mts";

import System = foundry.packages.System;

declare namespace BaseSystem {
  export import Source = System.Source;
  export import CreateData = System.CreateData;
  export import InitializedData = System.InitializedData;
  export import UpdateData = System.UpdateData;
  export import Schema = System.Schema;
  export import ManifestData = System.ManifestData;
}

/**
 * The data schema used to define System manifest files.
 * Extends the basic PackageData schema with some additional system-specific fields.
 */
declare class BaseSystem extends BasePackage<BaseSystem.Schema> {
  // fake type override
  static override type: "system";

  // fake type override
  static override get collection(): `${typeof BaseSystem.type}s`;

  // fake type override
  override get type(): typeof BaseSystem.type;

  // fake type override, see BasePackage#version
  override version: string;

  static override defineSchema(): BaseSystem.Schema;

  /**
   * The default icon used for this type of Package.
   * @defaultValue `"fa-dice"`
   */
  static icon: string;

  /**
   * Does the system template request strict type checking of data compared to template.json inferred types.
   * @defaultValue `false`
   */
  strictDataCleaning: boolean;

  /**
   * @deprecated "You are accessing `BaseSystem#gridDistance` which has been migrated to
   * {@linkcode BaseSystem.grid | BaseSystem#grid}`.distance`" (since v12, until v14)
   */
  get gridDistance(): number;

  set gridDistance(number);

  /**
   * @deprecated "You are accessing `BaseSystem#gridUnits` which has been migrated to {@linkcode BaseSystem.grid | BaseSystem#grid}`.units`"
   * (since v12, until v14)
   */
  get gridUnits(): number;

  set gridUnits(number);

  /**
   * @remarks
   * Migrations:
   * - {@linkcode BasePackage.migrateData | super}'s
   * - `gridDistance` to `grid.distance` (since v12, until v14)
   * - `gridUnits` to `grid.units` (since v12, until v14)
   */
  static override migrateData(data: object, options?: BasePackage.MigrateDataOptions): object;

  /**
   * @remarks
   * Shims:
   * - {@linkcode BasePackage.shimData | super}'s
   * - `gridDistance` to `grid.distance` (since v12, until v14)
   * - `gridUnits` to `grid.units` (since v12, until v14)
   */
  static override shimData(data: object, options?: DataModel.ShimDataOptions): object;

  // fake type override
  static override testAvailability(
    data: BaseSystem.ManifestData | BaseSystem,
    options: BasePackage.TestAvailabilityOptions,
  ): CONST.PACKAGE_AVAILABILITY_CODES;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<BaseSystem.Schema>;

  static override get schema(): fields.SchemaField<BaseSystem.Schema>;

  static override validateJoint(data: BaseSystem.Source): void;

  static override fromSource(source: BaseSystem.ManifestData, context?: DataModel.FromSourceOptions): BaseSystem;

  static override fromJSON(json: string): BaseSystem;
}

export default BaseSystem;
