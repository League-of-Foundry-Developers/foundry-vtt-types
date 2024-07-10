import type BasePackage from "./base-package.d.mts";
import * as fields from "../data/fields.mjs";
import type { InexactPartial, Merge } from "../../../types/utils.d.mts";
import type { ReleaseData } from "../config.d.mts";

type BaseWorldSchema = Merge<
  ReturnType<typeof BasePackage.defineSchema>,
  {
    /**
     * The game system name which this world relies upon
     */
    system: fields.StringField<{ required: true; blank: false }>;

    /**
     * A web URL or local file path which provides a background banner image
     */
    background: fields.StringField<{ required: false; blank: false }>;

    /**
     * The theme to use for this world's join page.
     */
    joinTheme: fields.StringField<{
      required: false;
      initial: undefined;
      nullable: false;
      blank: false;
      choices: typeof foundry.CONST.WORLD_JOIN_THEMES;
    }>;

    /**
     * The version of the core software for which this world has been migrated
     */
    coreVersion: fields.StringField<{ required: true; blank: false }>;

    /**
     * The version of the game system for which this world has been migrated
     */
    systemVersion: fields.StringField<{ required: true; blank: false; initial: "0" }>;

    lastPlayed: fields.StringField;

    playtime: fields.NumberField<{ integer: true; min: 0; initial: 0 }>;

    /**
     * An ISO datetime string when the next game session is scheduled to occur
     */
    nextSession: fields.StringField<{ blank: false; nullable: true; initial: null }>;

    /**
     * Should user access keys be reset as part of the next launch?
     */
    resetKeys: fields.BooleanField<{ required: false; initial: undefined }>;

    /**
     * Should the world launch in safe mode?
     */
    safeMode: fields.BooleanField<{ required: false; initial: undefined }>;

    version: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;
  }
>;

declare namespace BaseWorld {
  interface Schema extends BaseWorldSchema {}
}

/**
 * The data schema used to define World manifest files.
 * Extends the basic PackageData schema with some additional world-specific fields.
 */
declare class BaseWorld extends BasePackage<BaseWorld.Schema> {
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
      systemAvailabilityThreshold: foundry.CONST.PACKAGE_AVAILABILITY_CODES;
    }>,
  ): foundry.CONST.PACKAGE_AVAILABILITY_CODES;
}

export default BaseWorld;
