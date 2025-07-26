import type BasePackage from "#common/packages/base-package.d.mts";
import type AdditionalTypesField from "#common/packages/sub-types.d.mts";
import type DataModel from "#common/abstract/data.mjs";
import type ClientPackageMixin from "./client-package.d.mts";
import type { SystemNameConfig } from "#configuration";
import type { GetKey } from "#utils";

import fields = foundry.data.fields;
import Game = foundry.Game;

declare class System extends ClientPackageMixin(foundry.packages.BaseSystem) {
  constructor(data: ClientPackageMixin.SystemCreateData, options: unknown);

  // options: not null (parameter default only, destructured in super)
  protected override _configure(options?: DataModel.ConfigureOptions): void;

  id: GetKey<SystemNameConfig, "name", string>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"System#template is deprecated in favor of System#documentTypes"`
   */
  get template(): Game["model"];
}

declare namespace System {
  /**
   * The data put in {@linkcode DataModel._source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a data model. Used in places like {@linkcode System.create}
   * and {@link System | `new System(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@linkcode DataModel} has been initialized, for example
   * {@link System.name | `System#name`}.
   *
   * This is data transformed from {@linkcode System.Source} and turned into more
   * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@link System.update | `System#update`}.
   * It is a distinct type from {@link System.CreateData | `DeepPartial<System.CreateData>`} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * The schema for {@linkcode System}. This is the source of truth for how an System document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode System}. For example
   * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
   * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends BasePackage.Schema {
    /**
     * The current package version. It is recommended to stick to dot-separated numbers like "5.0.3"
     * and to not include a leading "v" to avoid string comparison. See {@linkcode foundry.utils.isNewerVersion}.
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
      type: fields.NumberField<{
        required: true;
        choices: typeof foundry.CONST.GRID_TYPES;
        initial: typeof foundry.CONST.GRID_TYPES.SQUARE;
      }>;

      /** A default distance measurement to use for Scenes in this system */
      distance: fields.NumberField<{
        required: true;
        nullable: false;
        positive: true;
        initial: 1;
      }>;

      /** A default unit of measure to use for distance measurement in this system */
      units: fields.StringField<{
        required: true;
      }>;

      /** The default rule used by this system for diagonal measurement on square grids */
      diagonals: fields.NumberField<{
        required: true;
        choices: typeof foundry.CONST.GRID_DIAGONALS;
        initial: typeof foundry.CONST.GRID_DIAGONALS.EQUIDISTANT;
      }>;
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

export default System;
