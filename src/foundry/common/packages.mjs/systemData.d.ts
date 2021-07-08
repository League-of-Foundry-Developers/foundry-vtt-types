import * as fields from '../data/fields.mjs';
import { PackageData, PackageDataConstructorData, PackageDataProperties, PackageDataSchema } from './packageData';

interface SystemDataSchema extends PackageDataSchema {
  initiative: typeof fields.STRING_FIELD;
  gridDistance: typeof fields.NUMERIC_FIELD;
  gridUnits: typeof fields.STRING_FIELD;
  primaryTokenAttribute: typeof fields.STRING_FIELD;
  secondaryTokenAttribute: typeof fields.STRING_FIELD;
}

interface SystemDataProperties extends PackageDataProperties {
  initiative?: string;

  /** A default distance measurement to use for Scenes in this system */
  gridDistance?: number | null;

  /** A default unit of measure to use for distance measurement in this system */
  gridUnits?: string;

  /** An Actor data attribute path to use for Token primary resource bars */
  primaryTokenAttribute?: string;

  /** An Actor data attribute path to use for Token secondary resource bars */
  secondaryTokenAttribute?: string;
}

interface SystemDataConstructorData extends PackageDataConstructorData {
  initiative?: string | null;

  /** A default distance measurement to use for Scenes in this system */
  gridDistance?: number | null;

  /** A default unit of measure to use for distance measurement in this system */
  gridUnits?: string | null;

  /** An Actor data attribute path to use for Token primary resource bars */
  primaryTokenAttribute?: string | null;

  /** An Actor data attribute path to use for Token secondary resource bars */
  secondaryTokenAttribute?: string | null;
}

/**
 * The data schema used to define System manifest files.
 * Extends the basic PackageData schema with some additional system-specific fields.
 */
export declare class SystemData extends PackageData<SystemDataSchema, SystemDataProperties, SystemDataConstructorData> {
  static defineSchema(): SystemDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface SystemData extends SystemDataProperties {}
