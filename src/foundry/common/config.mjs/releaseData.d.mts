import type { DataModel } from "../abstract/module.d.mts";
import type { SOFTWARE_UPDATE_CHANNELS } from "../constants.d.mts";
import type * as fields from "../data/fields.d.mts";

declare namespace ReleaseData {
  type Schema = {
    generation: fields.NumberField<{
      required: true;
      nullable: false;
      integer: true;
      min: 1;
    }>;
    maxGeneration: fields.NumberField<{
      required: false;
      nullable: false;
      integer: true;
      min: 1;
      // initial: () => fields.SchemaField.InitializedType<Schema["generation"]>;
    }>;
    maxStableGeneration: fields.NumberField<{
      required: false;
      nullable: false;
      integer: true;
      min: 1;
      // initial: () => fields.SchemaField.InitializedType<Schema["generation"]>;
    }>;
    channel: fields.NumberField<{ choices: SOFTWARE_UPDATE_CHANNELS; blank: false }>;
    suffix: fields.StringField;
    build: fields.NumberField<{ required: true; nullable: false; integer: true }>;
    time: fields.NumberField<{ nullable: false; initial: typeof Date.now }>;
    node_version: fields.NumberField<{ required: true; nullable: false; integer: true; min: 10 }>;
    notes: fields.StringField;
    download: fields.StringField;
  };
}

/** A data object which represents the details of this Release of Foundry VTT */
export declare class ReleaseData extends DataModel<fields.SchemaField<ReleaseData.Schema>> {
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
