import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as fields from '../data/fields.mjs';
import * as documents from './module.mjs';
import { DocumentStatsSchema } from '../data/data.mjs';
import DataModel, { DataSchema } from '../abstract/data.mjs';
import { FlagsField } from '../data/flagsField';

interface BaseCombatSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this Combat document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The _id of a Scene within which this Combat occurs
   */
  scene: fields.ForeignDocumentField<typeof documents.BaseScene, {}>;

  // TODO causes combatants on Combat
  /**
   * A Collection of Combatant embedded Documents
   */
  //   combatants: fields.EmbeddedCollectionField<typeof documents.BaseCombatant, {}>;

  /**
   * Is the Combat encounter currently active?
   * (default: `false`)
   */
  active: fields.BooleanField<{}>;

  /**
   * The current round of the Combat encounter
   * (default: `0`)
   */
  round: fields.NumberField<{
    required: true;
    nullable: false;
    integer: true;
    min: 0;
    initial: 0;
    label: 'COMBAT.Round';
  }>;

  /**
   * The current turn in the Combat round
   * (default: `0`)
   */
  turn: fields.NumberField<{ required: true; integer: true; min: 0; initial: null; label: 'COMBAT.Turn' }>;

  /**
   * The current sort order of this Combat relative to others in the same Scene
   * (default: `0`)
   */
  sort: typeof documents.BaseFolder.SORT_FIELD;
  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'Combat', {}>;

  /**
   * An object of creation and access information
   */
  _stats: typeof DocumentStatsSchema;
}

type CanUpdate = (
  user: documents.BaseUser,
  doc: BaseCombat,
  data: DeepPartial<DataModel.SchemaToSource<BaseCombat['schema']>>
) => boolean;

type BaseCombatMetadata = Merge<
  DocumentMetadata,
  {
    name: 'Combat';
    collection: 'combats';
    label: 'DOCUMENT.Combat';
    labelPlural: 'DOCUMENT.Combats';
    embedded: {
      Combatant: 'combatants';
    };
    permissions: {
      update: CanUpdate;
    };
  }
>;

/**
 * The Document definition for a Combat.
 * Defines the DataSchema and common behaviors for a Combat which are shared between both client and server.
 */
declare class BaseCombat extends Document<BaseCombatSchema, null, BaseCombatMetadata> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseCombatMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseCombatSchema;

  /**
   * Is a user able to update an existing Combat?
   */
  static #canUpdate: CanUpdate;
}
export default BaseCombat;
