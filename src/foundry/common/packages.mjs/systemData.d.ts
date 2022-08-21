import * as fields from "../data/fields.mjs";
import { PackageData, PackageDataConstructorData, PackageDataProperties, PackageDataSchema } from "./packageData";

interface SystemDataSchema extends PackageDataSchema {
  background: fields.StringField;
  initiative: fields.StringField;
  gridDistance: fields.NumericField;
  gridUnits: fields.StringField;
  primaryTokenAttribute: fields.StringField;
  secondaryTokenAttribute: fields.StringField;
}

interface SystemDataProperties extends PackageDataProperties {
  background: string | undefined;

  initiative: string | undefined;

  /** A default distance measurement to use for Scenes in this system */
  gridDistance: number | null | undefined;

  /** A default unit of measure to use for distance measurement in this system */
  gridUnits: string | undefined;

  /** An Actor data attribute path to use for Token primary resource bars */
  primaryTokenAttribute: string | undefined;

  /** An Actor data attribute path to use for Token secondary resource bars */
  secondaryTokenAttribute: string | undefined;
}

interface SystemDataConstructorData extends PackageDataConstructorData {
  background?: string | null | undefined;

  initiative?: string | null | undefined;

  /** A default distance measurement to use for Scenes in this system */
  gridDistance?: number | null | undefined;

  /** A default unit of measure to use for distance measurement in this system */
  gridUnits?: string | null | undefined;

  /** An Actor data attribute path to use for Token primary resource bars */
  primaryTokenAttribute?: string | null | undefined;

  /** An Actor data attribute path to use for Token secondary resource bars */
  secondaryTokenAttribute?: string | null | undefined;
}

/**
 * The data schema used to define System manifest files.
 * Extends the basic PackageData schema with some additional system-specific fields.
 */
export class SystemData extends PackageData<SystemDataSchema, SystemDataProperties, SystemDataConstructorData> {
  static override defineSchema(): SystemDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SystemData extends SystemDataProperties {}
