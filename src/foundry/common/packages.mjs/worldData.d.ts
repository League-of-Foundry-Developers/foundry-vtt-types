import { FieldReturnType } from "../../../types/helperTypes";
import * as fields from "../data/fields.mjs";
import { PackageData, PackageDataConstructorData, PackageDataProperties, PackageDataSchema } from "./packageData";

interface WorldDataSchema extends Omit<PackageDataSchema, "system"> {
  system: fields.RequiredString;
  background: fields.StringField;
  coreVersion: fields.RequiredString;
  nextSession: fields.StringField;
  resetKeys: fields.BooleanField;
  safeMode: fields.BooleanField;
  systemVersion: FieldReturnType<fields.RequiredString, { default: () => string }>;
}

interface WorldDataProperties extends Omit<PackageDataProperties, "system"> {
  /** The game system name which this world relies upon */
  system: string;

  /** A web URL or local file path which provides a background banner image */
  background: string | undefined;

  /** The version of the core software for which this world has been migrated */
  coreVersion: string;

  /** An ISO datetime string when the next game session is scheduled to occur */
  nextSession: string | undefined;

  /** @defaultValue `false` */
  resetKeys: boolean;

  /** @defaultValue `false` */
  safeMode: boolean;

  /**
   * The version of the game system for which this world has been migrated
   * @defaultValue `"0"`
   */
  systemVersion: string;
}

interface WorldDataConstructorData extends Omit<PackageDataConstructorData, "system"> {
  /** The game system name which this world relies upon */
  system: string;

  /** A web URL or local file path which provides a background banner image */
  background?: string | null | undefined;

  /** The version of the core software for which this world has been migrated */
  coreVersion: string;

  /** An ISO datetime string when the next game session is scheduled to occur */
  nextSession?: string | null | undefined;

  /** @defaultValue `false` */
  resetKeys?: boolean | null | undefined;

  /** @defaultValue `false` */
  safeMode?: boolean | null | undefined;

  /**
   * The version of the game system for which this world has been migrated
   * @defaultValue `"0"`
   */
  systemVersion?: string | null | undefined;
}

/**
 * The data schema used to define World manifest files.
 * Extends the basic PackageData schema with some additional world-specific fields.
 */
export class WorldData extends PackageData<WorldDataSchema, WorldDataProperties, WorldDataConstructorData> {
  static override defineSchema(): WorldDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WorldData extends WorldDataProperties {}
