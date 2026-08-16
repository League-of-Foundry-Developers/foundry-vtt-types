import type { Identity } from "#utils";
import type { DataModel } from "../abstract/_module.d.mts";
import type TypeDataModel from "../abstract/type-data.d.mts";

import fields = foundry.data.fields;

/**
 * A TypeDataModel for {@linkcode ActiveEffect}s. A single ArrayField is defined for {@linkcode ActiveEffect.ChangeData}.
 * A system can override the changes SchemaField but must preserve definitions for type, phase, and priority.
 *
 * @remarks Schemas which omit `changes` are temporarily supported by Foundry but not typed by
 * fvtt-types as it screws with too many types and any users of ActiveEffectTypeDataModel will be
 * brand new and should avoid using a deprecated path.
 */
declare class ActiveEffectTypeDataModel<
  Schema extends ActiveEffectTypeDataModel.AnySchema = ActiveEffectTypeDataModel.Schema,
> extends TypeDataModel<Schema, ActiveEffect.Implementation> {
  constructor(...args: DataModel.ConstructorArgs<Schema>);

  static override defineSchema(): ActiveEffectTypeDataModel.Schema;

  static #ActiveEffectTypeDataModel: true;
}

declare namespace ActiveEffectTypeDataModel {
  interface Any extends AnyActiveEffectTypeDataModel {}
  interface AnyConstructor extends Identity<typeof AnyActiveEffectTypeDataModel> {}

  /**
   * @remarks A system can override the changes `ArrayField` and add fields to its element, but these three
   * fields are fixed.
   * @throws Via `Game#verifyActiveEffectModels` during setup if a registered model omits any of these.
   * @privateRemarks Pinned to the core field types because field-class inheritance does not imply value-type
   * compatibility.
   */
  interface BaseChangeSchema extends fields.DataSchema {
    /**
     * The modification type of this change
     * @defaultValue `"add"`
     * @throws An Error if the type string is malformed: it must either be a sequence of dot-delimited,
     * alpha-numeric substrings or of the form `"custom.{number}"`, and be at least three characters long
     */
    type: fields.StringField<{ required: true; blank: false; initial: "add" }>;

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

  type AnyChangesSchemaField =
    | fields.SchemaField<BaseChangeSchema>
    | fields.TypedSchemaField<{ [type: string]: BaseChangeSchema }>;

  /** The `changes` field a system model which defines one must declare. */
  interface AnyChangesField extends fields.ArrayField<AnyChangesSchemaField> {}

  /** The minimum schema for a class which defines its own ActiveEffect changes. */
  interface AnySchema extends fields.DataSchema {
    changes: AnyChangesField;
  }

  /**
   * Refines {@linkcode TypeDataModel} rather than `typeof ActiveEffectTypeDataModel` so valid
   * models may extend {@linkcode TypeDataModel} directly while constraining the `defineSchema` return.
   */
  interface RegistrableClass extends Identity<typeof _RegisterableClass> {}

  interface ChangeSchema extends BaseChangeSchema {
    /**
     * The attribute path in the Actor or Item data which the change modifies
     * @defaultValue `""`
     */
    key: fields.StringField<{ required: true }>;

    /**
     * The value of the change effect
     * @defaultValue `""`
     *
     * @privateRemarks Constructed with `{required: true, nullable: true, serializable: true, initial: ""}`,
     * but `AnyField` does not model options; its value types remain `unknown`.
     */
    value: fields.AnyField;
  }

  interface Schema extends fields.DataSchema {
    changes: fields.ArrayField<fields.SchemaField<ChangeSchema>>;
  }
}

declare abstract class AnyActiveEffectTypeDataModel extends ActiveEffectTypeDataModel<any> {
  constructor(...args: never);
}

declare class _RegisterableClass extends TypeDataModel<
  ActiveEffectTypeDataModel.AnySchema,
  ActiveEffect.Implementation
> {
  constructor(...args: never);
}

export default ActiveEffectTypeDataModel;
