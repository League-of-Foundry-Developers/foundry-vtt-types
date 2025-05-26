import type { AnyMutableObject } from "../../../utils/index.d.mts";
import type DataModel from "../abstract/data.d.mts";
import type BasePackage from "./base-package.d.mts";

declare namespace BaseSystem {
  export import Source = System.Source;
  export import CreateData = System.CreateData;
  export import InitializedData = System.InitializedData;
  export import UpdateData = System.UpdateData;
  export import Schema = System.Schema;
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

  /**
   * @deprecated since v12, until v14
   * @remarks "You are accessing `BaseSystem#gridDistance` which has been migrated to {@link BaseSystem.grid | `BaseSystem#grid`}`#distance`"
   */
  get gridDistance(): number;

  set gridDistance(number);

  /**
   * @deprecated since v12, until v14
   * @remarks "You are accessing `BaseSystem#gridUnits` which has been migrated to {@link BaseSystem.grid | `BaseSystem#grid`}`#units`"
   */
  get gridUnits(): number;

  set gridUnits(number);

  /** @remarks Adds `gridDistance` and `gridUnits` to super's */
  static override migratedKeys: Set<string>;

  /**
   * @remarks
   * Migrations:
   * - {@link BasePackage.migrateData | `BasePackage`}'s
   * - `gridDistance` to `grid.distance` (since v12, until v14)
   * - `gridUnits` to `grid.units` (since v12, until v14)
   */
  static override migrateData(data: AnyMutableObject, options?: BasePackage.MigrateDataOptions): AnyMutableObject;

  /**
   * @remarks
   * Shims:
   * - `gridDistance` to `grid.distance` (since v12, until v14)
   * - `gridUnits` to `grid.units` (since v12, until v14)
   */
  // options: not null (destructured)
  static override shimData(data: AnyMutableObject, options?: DataModel.ShimDataOptions): AnyMutableObject;
}

export default BaseSystem;
