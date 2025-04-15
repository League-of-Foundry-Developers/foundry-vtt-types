import type BasePackage from "./base-package.d.mts";
import type { AnyMutableObject, InexactPartial } from "fvtt-types/utils";
import type { ReleaseData } from "../config.d.mts";

declare namespace BaseWorld {
  export import Source = Module.Source;
  export import PersistedData = Module.Source;
  export import CreateData = Module.CreateData;
  export import InitializedData = Module.InitializedData;
  export import UpdateData = Module.UpdateData;
  export import Schema = Module.Schema;
}

/**
 * The data schema used to define World manifest files.
 * Extends the basic PackageData schema with some additional world-specific fields.
 */
declare class BaseWorld extends BasePackage<BaseWorld.Schema> {
  // TODO(LukeAbby): This override is unsound. Revisit.
  // static defineSchema(): BaseWorld.Schema;

  static type: "world";

  /**
   * The default icon used for this type of Package.
   * @defaultValue `"fa-globe-asia"`
   */
  static icon: string;

  static migrateData(data: AnyMutableObject): AnyMutableObject;

  static testAvailability(
    data: InexactPartial<PackageManifestData>,
    options: InexactPartial<{
      /**
       * A specific software release for which to test availability.
       * Tests against the current release by default.
       */
      release: ReleaseData;
      /**
       * A specific collection of modules to test availability
       * against. Tests against the currently installed modules by
       * default.
       */
      modules: Collection<Module>;
      /**
       * A specific collection of modules to test availability
       * against. Tests against the currently installed modules by
       * default.
       */
      systems: Collection<System>;
      /**
       * Ignore the world's own core software compatibility and
       * instead defer entirely to the system's core software
       * compatibility, if the world's availability is less than
       * this.
       */
      systemAvailabilityThreshold: foundry.CONST.PACKAGE_AVAILABILITY_CODES;
    }>,
  ): foundry.CONST.PACKAGE_AVAILABILITY_CODES;
}

export default BaseWorld;
