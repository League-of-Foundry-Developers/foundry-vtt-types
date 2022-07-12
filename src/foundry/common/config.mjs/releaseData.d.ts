import DataModel, { DataSchema } from '../abstract/data.mjs';
import * as fields from '../data/fields.mjs';
import { SOFTWARE_UPDATE_CHANNELS } from '../constants.mjs';

interface ReleaseDataSchema extends DataSchema {
  /**
   * The major generation of the Release
   */

  generation: fields.NumberField<{ required: true; nullable: false; integer: true; min: 1 }>;

  /**
   * The channel the Release belongs to, such as "stable"
   */
  channel: fields.StringField<{ choices: typeof SOFTWARE_UPDATE_CHANNELS; blank: false }>;

  /**
   * An optional appended string display for the Release
   */
  suffix: fields.StringField<{}>;

  /**
   * The internal build number for the Release
   */
  build: fields.NumberField<{ required: true; nullable: false; integer: true }>;

  /**
   * When the Release was released
   */
  time: fields.NumberField<{ nullable: false; initial: typeof Date.now }>;

  /**
   * The minimum required Node.js major version
   */
  node_version: fields.NumberField<{ required: true; nullable: false; integer: true; min: 10 }>;

  /**
   * Release notes for the update version
   */
  notes: fields.StringField<{}>;

  /**
   * A temporary download URL where this version may be obtained
   */
  download: fields.StringField<{}>;
}

/**
 * A data object which represents the details of this Release of Foundry VTT
 */
declare class ReleaseData extends DataModel<null, ReleaseDataSchema> {
  static override defineSchema(): ReleaseDataSchema;

  /* ----------------------------------------- */

  /**
   * A formatted string for shortened display, such as "Version 9"
   */
  get shortDisplay(): string;

  /**
   * A formatted string for general display, such as "V9 Prototype 1"
   */
  get display(): string;

  /**
   * A formatted string for Version compatibility checking, such as "9.150"
   */
  get version(): string;

  /* ----------------------------------------- */

  /**
   * Is this ReleaseData object newer than some other version?
   * @param other - Some other version to compare against
   * @returns Is this ReleaseData a newer version?
   */
  isNewer(other: string | ReleaseData): boolean;

  /* ----------------------------------------- */

  /**
   * Is this ReleaseData object a newer generation than some other version?
   * @param other - Some other version to compare against
   * @returns Is this ReleaseData a newer generation?
   */
  isGenerationalChange(other: string | ReleaseData): boolean;
}

// Module Exports
export { ReleaseData };
