import type { Identity } from "#utils";
import type TypeDataModel from "../abstract/type-data.d.mts";

import fields = foundry.data.fields;

/**
 * A TypeDataModel for {@linkcode ActiveEffect}s. A single ArrayField is defined for {@linkcode ActiveEffect.ChangeData}.
 * A system can override the changes SchemaField but must preserve definitions for type, phase, and priority.
 *
 * @remarks Schemas which omit `changes` are temporarily supported for V13 compatibility. Foundry extends them with
 * the core changes schema during setup and reports an error to prompt migration.
 */
declare class ActiveEffectTypeDataModel<
  Schema extends ActiveEffectTypeDataModel.MinimalSchema | ActiveEffectTypeDataModel.LegacySchema =
    ActiveEffectTypeDataModel.Schema,
> extends TypeDataModel<Schema, ActiveEffect.Implementation> {
  static override defineSchema(): ActiveEffectTypeDataModel.Schema;

  static #ActiveEffectTypeDataModel: true;
}

declare namespace ActiveEffectTypeDataModel {
  interface Any extends AnyActiveEffectTypeDataModel {}
  interface AnyConstructor extends Identity<typeof AnyActiveEffectTypeDataModel> {}

  /**
   * The change fields every ActiveEffect system model must preserve. A system can override the changes
   * SchemaField but must preserve definitions for type, phase, and priority.
   * @throws Via `Game#verifyActiveEffectModels` during setup if a registered model omits any of these.
   */
  interface MinimalChangeSchema extends fields.DataSchema {
    type: fields.StringField.Any;
    phase: fields.StringField.Any;
    priority: fields.NumberField.Any;
  }

  /**
   * A per-type changes element. Each of its types must itself define the minimal change fields.
   */
  interface MinimalTypedChangesField extends fields.TypedSchemaField.Any {
    types: Record<string, fields.SchemaField<MinimalChangeSchema>>;
  }

  /** The `changes` field a system model which defines one must declare. */
  interface MinimalChangesField extends fields.ArrayField.Any {
    element: fields.SchemaField<MinimalChangeSchema> | MinimalTypedChangesField;
  }

  /**
   * An ActiveEffect schema from before V14 which does not define its own changes field.
   * This compatibility path is temporary for Prototype 3.
   */
  type LegacySchema = fields.DataSchema & {
    changes?: never;
  };

  /** The minimum schema for a class which defines its own ActiveEffect changes. */
  interface MinimalSchema extends fields.DataSchema {
    changes: MinimalChangesField;
  }

  /**
   * The static shape a class which defines its own ActiveEffect changes must have.
   * Structural rather than `typeof ActiveEffectTypeDataModel` because a valid model may extend
   * {@linkcode TypeDataModel} directly.
   */
  interface RegistrableClass {
    defineSchema(): MinimalSchema;
  }

  interface ChangeSchema extends MinimalChangeSchema {
    /**
     * The attribute path in the Actor or Item data which the change modifies
     * @defaultValue `""`
     */
    key: fields.StringField<{ required: true }>;

    /**
     * The modification type of this change
     * @defaultValue `"add"`
     * @throws An Error if the type string is malformed: it must either be a sequence of dot-delimited,
     * alpha-numeric substrings or of the form `"custom.{number}"`, and be at least three characters long
     */
    type: fields.StringField<{ required: true; blank: false; initial: "add" }>;

    /**
     * The value of the change effect
     * @defaultValue `""`
     *
     * @privateRemarks Constructed with `{required: true, nullable: true, serializable: true, initial: ""}`,
     * but `AnyField` does not model options; its value types remain `unknown`.
     */
    value: fields.AnyField;

    /**
     * The application phase under which this change is applied. Each phase is its own priority group; that is,
     * application of a change in an earlier phase will occur before a change in a later phase, regardless of
     * priority. A pair of phases are preconfigured, but a package can add more phases to be called at different
     * points during data preparation or on certain events.
     * @defaultValue `"initial"`
     */
    phase: fields.StringField<{ required: true; blank: false; initial: "initial" }>;

    /**
     * The order in which this change is applied among other changes in a common phase: a null value is initialized
     * to its default priority.
     * @defaultValue `undefined`
     */
    priority: fields.NumberField;
  }

  interface Schema extends fields.DataSchema {
    changes: fields.ArrayField<fields.SchemaField<ChangeSchema>>;
  }
}

declare abstract class AnyActiveEffectTypeDataModel extends ActiveEffectTypeDataModel<any> {
  constructor(...args: never);
}

export default ActiveEffectTypeDataModel;
