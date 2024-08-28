import type BasePackage from "./base-package.d.mts";
import type * as fields from "../data/fields.d.mts";
import type AdditionalTypesField from "./sub-types.d.mts";

declare namespace BaseSystem {
  interface Schema extends ReturnType<typeof BasePackage.defineSchema> {
    /**
     * The current package version
     * @remarks Actually defined in BasePackage but defined here to avoid conflict with BaseWorld
     */
    version: fields.StringField<{ required: true; blank: false; initial: "0" }>;

    /**
     * Additional document subtypes provided by this system.
     */
    documentTypes: AdditionalTypesField;

    /**
     * A web URL or local file path which provides a default background banner for worlds which are created using this system
     */
    background: fields.StringField<{ required: false; blank: false }>;

    /**
     * A default initiative formula used for this system
     */
    initiative: fields.StringField;

    /**
     * The default grid settings to use for Scenes in this system
     */
    grid: fields.SchemaField<{
      /** A default grid type to use for Scenes in this system */
      type: fields.NumberField;

      /** A default distance measurement to use for Scenes in this system */
      distance: fields.NumberField;

      /** A default unit of measure to use for distance measurement in this system */
      units: fields.StringField;

      /** The default rule used by this system for diagonal measurement on square grids */
      diagonals: fields.NumberField;
    }>;

    /**
     * An Actor data attribute path to use for Token primary resource bars
     */
    primaryTokenAttribute: fields.StringField;

    /**
     * An Actor data attribute path to use for Token secondary resource bars
     */
    secondaryTokenAttribute: fields.StringField;

    /**
     * A default distance measurement to use for Scenes in this system
     * @deprecated since v12
     */
    gridDistance: fields.NumberField;

    /**
     * A default unit of measure to use for distance measurement in this system
     * @deprecated since v12
     */
    gridUnits: fields.NumberField;
  }
}

/**
 * The data schema used to define System manifest files.
 * Extends the basic PackageData schema with some additional system-specific fields.
 */
declare class BaseSystem extends BasePackage<BaseSystem.Schema> {
  static defineSchema(): BaseSystem.Schema;

  static type: "system";

  /**
   * The default icon used for this type of Package.
   * @defaultValue `"fa-dice"`
   */
  static icon: string;

  /**
   * Does the system template request strict type checking of data compared to template.json inferred types.
   */
  strictDataCleaning: boolean;
}

export default BaseSystem;
