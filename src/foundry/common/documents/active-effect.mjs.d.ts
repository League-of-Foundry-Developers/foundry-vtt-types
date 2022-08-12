import Document, { DocumentMetadata, DocumentModificationOptions } from '../abstract/document.mjs';
import * as CONST from '../constants.mjs';
import * as documents from './module.mjs';
import * as fields from '../data/fields.mjs';
import { FlagsField } from '../data/flagsField';
import DataModel, { DataSchema } from '../abstract/data.mjs';
import { ConfiguredDocumentClass } from '../../../types/helperTypes.js';

interface BaseActiveEffectSchema extends DataSchema {
  /**
   * The _id which uniquely identifies the ActiveEffect within a parent Actor or Item
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The array of EffectChangeData objects which the ActiveEffect applies
   */
  changes: fields.ArrayField<fields.SchemaField<EffectChangeData, {}>, {}>;

  /**
   * Is this ActiveEffect currently disabled?
   * (default: `false`)
   */
  disabled: fields.BooleanField<{}>;

  /**
   * An EffectDurationData object which describes the duration of the ActiveEffect
   */
  duration: fields.SchemaField<EffectDurationData, {}>;

  /**
   * An icon image path used to depict the ActiveEffect
   */
  icon: fields.FilePathField<{ categories: ['IMAGE']; label: 'EFFECT.Icon' }>;

  /**
   * A text label which describes the name of the ActiveEffect
   */
  label: fields.StringField<{ required: true; label: 'EFFECT.Label' }>;

  /**
   * A UUID reference to the document from which this ActiveEffect originated
   */
  origin: fields.StringField<{ nullable: true; blank: false; initial: null; label: 'EFFECT.Origin' }>;

  /**
   * A color string which applies a tint to the ActiveEffect icon
   * (default: `null`)
   */
  tint: fields.ColorField<{ label: 'EFFECT.IconTint' }>;

  /**
   * Does this ActiveEffect automatically transfer from an Item to an Actor?
   * (default: `false`)
   */
  transfer: fields.BooleanField<{ initial: true; label: 'EFFECT.Transfer' }>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'ActiveEffect', {}>;
}

export interface EffectDurationData extends DataSchema {
  /**
   * The world time when the active effect first started
   */
  startTime: fields.NumberField<{ initial: null; label: 'EFFECT.StartTime' }>;

  /**
   * The maximum duration of the effect, in seconds
   */
  seconds: fields.NumberField<{ integer: true; min: 0; label: 'EFFECT.DurationSecs' }>;

  // TODO causes circular issue
  //   /**
  //    * The _id of the CombatEncounter in which the effect first started
  //    */
  //   combat: fields.ForeignDocumentField<typeof documents.BaseCombat, { label: 'EFFECT.Combat' }>;

  /**
   * The maximum duration of the effect, in combat rounds
   */
  rounds: fields.NumberField<{ integer: true; min: 0 }>;

  /**
   * The maximum duration of the effect, in combat turns
   */
  turns: fields.NumberField<{ integer: true; min: 0; label: 'EFFECT.DurationTurns' }>;

  /**
   * The round of the CombatEncounter in which the effect first started
   */
  startRound: fields.NumberField<{ integer: true; min: 0 }>;

  /**
   * The turn of the CombatEncounter in which the effect first started
   */
  startTurn: fields.NumberField<{ integer: true; min: 0; label: 'EFFECT.StartTurns' }>;
}

interface EffectChangeData extends DataSchema {
  /** The attribute path in the Actor or Item data which the change modifies */
  key: fields.StringField<{ required: true; label: 'EFFECT.ChangeKey' }>;

  /** The value of the change effect */
  value: fields.StringField<{ required: true; label: 'EFFECT.ChangeValue' }>;

  /** The modification mode with which the change is applied */
  mode: fields.NumberField<{
    integer: true;
    initial: typeof CONST.ACTIVE_EFFECT_MODES.ADD;
    label: 'EFFECT.ChangeMode';
  }>;

  /** The priority level with which this change is applied */
  priority: fields.NumberField<{}>;
}

type BaseActiveEffectMetadata = Merge<
  DocumentMetadata,
  {
    name: 'ActiveEffect';
    collection: 'effects';
    label: 'DOCUMENT.ActiveEffect';
    labelPlural: 'DOCUMENT.ActiveEffects';
  }
>;

/**
 * The data schema for an ActiveEffect document.
 */
export default class BaseActiveEffect extends Document<
  BaseActiveEffectSchema,
  //   InstanceType<ConfiguredDocumentClass<typeof Actor>> | InstanceType<ConfiguredDocumentClass<typeof Item>>,
  null,
  BaseActiveEffectMetadata
> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseActiveEffectMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseActiveEffectSchema;

  /* -------------------------------------------- */
  /*  Model Methods                               */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  testUserPermission(
    user: documents.BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_PERMISSION_LEVELS | foundry.CONST.DOCUMENT_PERMISSION_LEVELS,
    { exact }?: { exact?: boolean }
  ): boolean;

  /* -------------------------------------------- */
  /*  Database Event Handlers                     */
  /* -------------------------------------------- */

  protected _preCreate(
    data: DataModel.SchemaToSourceInput<this['schema']>,
    options: DocumentModificationOptions,
    user: documents.BaseUser
  ): Promise<void>;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritDoc} */
  static migrateData(data: Record<string, unknown>): Record<string, unknown>;
}
