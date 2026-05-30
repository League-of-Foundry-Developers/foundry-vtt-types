import type { BasePackage } from "#common/packages/_module.d.mts";

import World = foundry.packages.World;

declare namespace BaseWorld {
  export import Source = World.Source;
  export import CreateData = World.CreateData;
  export import InitializedData = World.InitializedData;
  export import UpdateData = World.UpdateData;
  export import Schema = World.Schema;
  export import ManifestData = World.ManifestData;
  export import TestAvailabilityOptions = World.TestAvailabilityOptions;
}

/**
 * The data schema used to define World manifest files.
 * Extends the basic PackageData schema with some additional world-specific fields.
 */
declare class BaseWorld extends BasePackage<BaseWorld.Schema> {
  // fake type override
  static override type: "world";

  // fake type override
  static override get collection(): `${typeof BaseWorld.type}s`;

  // fake type override
  override get type(): typeof BaseWorld.type;

  static override defineSchema(): BaseWorld.Schema;

  /**
   * The default icon used for this type of Package.
   * @defaultValue `"fa-globe-asia"`
   */
  static icon: string;

  /**
   * @remarks
   * Migrations:
   * - Enforces `compatibility` being an object
   * - `compatibility.maximum === "1.0.0"` to `undefined`
   * - If `coreVersion` but no `compatibility.verified`, sets both `compatibility.verified` and `.minimum` to `coreVersion`
   * - Sets `background` to `null` if it's a `string` that doesn't end in a {@linkcode CONST.FILE_CATEGORIES.IMAGE} extension.
   */
  static override migrateData(data: object): object;

  static override testAvailability(
    data: BaseWorld.ManifestData | BaseWorld,
    options: BaseWorld.TestAvailabilityOptions,
  ): CONST.PACKAGE_AVAILABILITY_CODES;
}

export default BaseWorld;
