import type { DataModel } from "../abstract/module.d.mts";
import type { SOFTWARE_UPDATE_CHANNELS } from "../constants.d.mts";
import type * as fields from "../data/fields.d.mts";

declare namespace ReleaseData {
  type Schema = {
    /**
     * The major generation of the Release
     */
    generation: fields.NumberField<{
      required: true;
      nullable: false;
      integer: true;
      min: 1;
    }>;

    /**
     * The maximum available generation of the software.
     */
    maxGeneration: fields.NumberField<{
      required: false;
      nullable: false;
      integer: true;
      min: 1;
      // initial: () => fields.SchemaField.InnerInitializedType<Schema["generation"]>;
    }>;

    /**
     * The maximum available stable generation of the software.
     */
    maxStableGeneration: fields.NumberField<{
      required: false;
      nullable: false;
      integer: true;
      min: 1;
      // initial: () => fields.SchemaField.InitializedType<Schema["generation"]>;
    }>;
    channel: fields.StringField<{ choices: typeof SOFTWARE_UPDATE_CHANNELS; blank: false }>;

    /**
     * An optional appended string display for the Release
     */
    suffix: fields.StringField;

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
    notes: fields.StringField;

    /**
     * A temporary download URL where this version may be obtained
     */
    download: fields.StringField;
  };
}

interface ReleaseData extends fields.SchemaField.InnerInitializedType<ReleaseData.Schema> {}

/** A data object which represents the details of this Release of Foundry VTT */
declare class ReleaseData extends DataModel<fields.SchemaField<ReleaseData.Schema>> {
  static defineSchema(): ReleaseData.Schema;

  /** A formatted string for shortened display, such as "Version 9" */
  get shortDisplay(): string;

  /** A formatted string for general display, such as "V9 Prototype 1" or "Version 9" */
  get display(): string;

  /** A formatted string for Version compatibility checking, such as "9.150" */
  get version(): string;

  override toString(): this["shortDisplay"];

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

export { ReleaseData };
