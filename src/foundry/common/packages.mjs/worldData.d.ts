import { FieldReturnType } from '../../../types/helperTypes';
import * as fields from '../data/fields.mjs';
import { PackageData, PackageDataConstructorData, PackageDataProperties, PackageDataSchema } from './packageData';

interface WorldDataSchema extends Omit<PackageDataSchema, 'system'> {
  system: typeof fields.REQUIRED_STRING;
  background: typeof fields.STRING_FIELD;
  coreVersion: typeof fields.REQUIRED_STRING;
  nextSession: typeof fields.STRING_FIELD;
  resetKeys: typeof fields.BOOLEAN_FIELD;
  safeMode: typeof fields.BOOLEAN_FIELD;
  systemVersion: FieldReturnType<typeof fields.REQUIRED_STRING, { default: () => string }>;
}

interface WorldDataProperties extends Omit<PackageDataProperties, 'system'> {
  /** The game system name which this world relies upon */
  system: string;

  /** A web URL or local file path which provides a background banner image */
  background?: string;

  /** The version of the core software for which this world has been migrated */
  coreVersion: string;

  /** An ISO datetime string when the next game session is scheduled to occur */
  nextSession?: string;

  resetKeys: boolean;

  safeMode: boolean;

  /** The version of the game system for which this world has been migrated */
  systemVersion: string;
}

interface WorldDataConstructorData extends Omit<PackageDataConstructorData, 'system'> {
  /** The game system name which this world relies upon */
  system: string;

  /** A web URL or local file path which provides a background banner image */
  background?: string | null;

  /** The version of the core software for which this world has been migrated */
  coreVersion: string;

  /** An ISO datetime string when the next game session is scheduled to occur */
  nextSession?: string | null;

  resetKeys?: boolean | null;

  safeMode?: boolean | null;

  /** The version of the game system for which this world has been migrated */
  systemVersion?: string | null;
}

/**
 * The data schema used to define World manifest files.
 * Extends the basic PackageData schema with some additional world-specific fields.
 */
export declare class WorldData extends PackageData<WorldDataSchema, WorldDataProperties, WorldDataConstructorData> {
  static defineSchema(): WorldDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface WorldData extends WorldDataProperties {}
