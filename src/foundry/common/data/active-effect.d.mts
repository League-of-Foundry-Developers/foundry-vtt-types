import type { Identity } from "#utils";
import type TypeDataModel from "../abstract/type-data.d.mts";

import fields = foundry.data.fields;

/**
 * A TypeDataModel for {@linkcode ActiveEffect}s. A single ArrayField is defined for {@linkcode ActiveEffect.ChangeData}.
 * A system can override the changes SchemaField but must preserve definitions for type, phase, and priority.
 */
declare class ActiveEffectTypeDataModel<
  Schema extends fields.DataSchema = ActiveEffectTypeDataModel.Schema,
> extends TypeDataModel<Schema, ActiveEffect.Implementation> {
  static override defineSchema(): ActiveEffectTypeDataModel.Schema;

  static #ActiveEffectTypeDataModel: true;
}

declare namespace ActiveEffectTypeDataModel {
  interface Any extends AnyActiveEffectTypeDataModel {}
  interface AnyConstructor extends Identity<typeof AnyActiveEffectTypeDataModel> {}

  interface ChangeSchema extends fields.DataSchema {
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
     * but {@linkcode fields.AnyField | AnyField} takes no `Options` type parameter — its `Assignment`,
     * `Initialized`, and `Persisted` types are all fixed at `unknown`, so none of those options can be
     * reflected here. If `AnyField` ever threads `Options`, this field should pass them.
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

declare abstract class AnyActiveEffectTypeDataModel extends ActiveEffectTypeDataModel<ActiveEffectTypeDataModel.Schema> {
  constructor(...args: never);
}

export default ActiveEffectTypeDataModel;
