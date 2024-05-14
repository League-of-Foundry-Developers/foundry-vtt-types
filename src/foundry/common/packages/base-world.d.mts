import type BasePackage from "./base-package.d.mts";
import * as fields from "../data/fields.mjs";
import type { InexactPartial } from "../../../types/utils.d.mts";
import type { ReleaseData } from "../config.mjs/releaseData.d.mts";
import type { CONST } from "../module.d.mts";

declare namespace BaseWorld {
  type Schema = ReturnType<typeof BasePackage.defineSchema> & {
    system: fields.StringField;
    background: fields.StringField;
    joinTheme: fields.StringField;
    coreVersion: fields.StringField;
    systemVersion: fields.StringField;
    lastPlayed: fields.StringField;
    playtime: fields.NumberField;
    nextSession: fields.StringField;
    resetKeys: fields.BooleanField;
    safeMode: fields.BooleanField;
    version: fields.StringField;
  };
}

/**
 * The data schema used to define World manifest files.
 * Extends the basic PackageData schema with some additional world-specific fields.
 */
export default class BaseWorld extends BasePackage<BaseWorld.Schema> {
  static defineSchema(): BaseWorld.Schema;

  static type: "world";

  /**
   * The default icon used for this type of Package.
   * @defaultValue `"fa-globe-asia"`
   */
  static icon: string;

  static migrateData(data: object): object;

  static testAvailability(
    data: Partial<PackageManifestData>,
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
      systemAvailabilityThreshold: CONST.PACKAGE_AVAILABILITY_CODES;
    }>,
  ): CONST.PACKAGE_AVAILABILITY_CODES;
}
