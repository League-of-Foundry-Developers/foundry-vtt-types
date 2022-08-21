import { PropertiesToSource } from "../../../types/helperTypes";
import { DocumentData } from "../abstract/module.mjs";
import * as fields from "../data/fields.mjs";

export interface ReleaseDataSchema extends DocumentSchema {
  generation: typeof fields.REQUIRED_NUMBER;
  channel: typeof fields.REQUIRED_STRING;
  suffix: typeof fields.STRING_FIELD;
  build: typeof fields.REQUIRED_NUMBER;
  time: typeof fields.TIMESTAMP_FIELD;
  node_version: typeof fields.POSITIVE_INTEGER_FIELD;
  notes: typeof fields.BLANK_STRING;
  download: typeof fields.BLANK_STRING;
}

export interface ReleaseDataProperties {
  /** The major generation of the Release */
  generation: number;

  /** The channel the Release belongs to, such as "stable" */
  channel: string;

  /** An optional appended string display for the Release */
  suffix: string | undefined;

  /** The internal build number for the Release */
  build: number;

  /** When the Release was released */
  time: number | undefined;

  /** The minimum required Node.js major version */
  node_version: number | undefined;

  /** Release notes for the update version */
  notes: string;

  /** A temporary download URL where this version may be obtained */
  download: string;
}

export interface ReleaseDataConstructorData {
  /** The major generation of the Release */
  generation?: number | undefined | null;

  /** The channel the Release belongs to, such as "stable" */
  channel: string;

  /** An optional appended string display for the Release */
  suffix?: string | undefined | null;

  /** The internal build number for the Release */
  build?: number | undefined | null;

  /** When the Release was released */
  time?: number | undefined | null;

  /** The minimum required Node.js major version */
  node_version?: number | undefined | null;

  /** Release notes for the update version */
  notes?: string | undefined | null;

  /** A temporary download URL where this version may be obtained */
  download?: string | undefined | null;
}

type ReleaseDataSource = PropertiesToSource<ReleaseDataProperties>;

/** A data object which represents the details of this Release of Foundry VTT */
export declare class ReleaseData<
  Schema extends ReleaseDataSchema = ReleaseDataSchema,
  Properties extends ReleaseDataProperties = ReleaseDataProperties,
  ConstructorData extends ReleaseDataConstructorData = ReleaseDataConstructorData
> extends DocumentData<Schema, Properties, ReleaseDataSource, ConstructorData> {
  static defineSchema(): ReleaseDataSchema;

  /** A formatted string for shortened display, such as "Version 9" */
  get shortDisplay(): string;

  /** A formatted string for general display, such as "V9 Prototype 1" */
  get display(): string;

  /** A formatted string for Version compatibility checking, such as "9.150" */
  get version(): string;

  /**
   * Is this ReleaseData object newer than some other version?
   * @param other - Some other version to compare against
   * @returns Is this ReleaseData a newer version?
   */
  isNewer(other: string | ReleaseData): boolean;

  /**
   * Is this ReleaseData object a newer generation than some other version?
   * @param other - Some other version to compare against
   * @returns Is this ReleaseData a newer generation?
   */
  isGenerationalChange(other: string | ReleaseData): boolean;
}
