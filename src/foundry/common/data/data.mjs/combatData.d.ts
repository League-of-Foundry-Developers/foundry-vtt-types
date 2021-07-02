import { ConfiguredDocumentClass, FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import EmbeddedCollection from '../../abstract/embedded-collection.mjs';
import { DocumentData } from '../../abstract/module.mjs';
import * as documents from '../../documents.mjs';
import * as fields from '../fields.mjs';

interface CombatDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  scene: fields.ForeignDocumentField<{ type: typeof documents.BaseScene }>;
  combatants: fields.EmbeddedCollectionField<typeof documents.BaseCombatant>;
  active: typeof fields.BOOLEAN_FIELD;
  round: FieldReturnType<typeof fields.NONNEGATIVE_INTEGER_FIELD, { default: 0; required: true }>;
  turn: FieldReturnType<typeof fields.NONNEGATIVE_INTEGER_FIELD, { default: 0; required: true }>;
  sort: typeof fields.INTEGER_SORT_FIELD;
  flags: typeof fields.OBJECT_FIELD;
}

interface CombatDataProperties {
  /** The _id which uniquely identifies this Combat document */
  _id: string | null;

  /** The _id of a Scene within which this Combat occurs */
  scene: string | null;

  /** A Collection of Combatant embedded Documents */
  combatants: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseCombatant>, CombatData>;

  /**
   * Is the Combat encounter currently active?
   * @defaultValue `false`
   */
  active: boolean;

  /**
   * The current round of the Combat encounter
   * @defaultValue `0`
   */
  round: number | undefined;

  /**
   * The current turn in the Combat round
   * @defaultValue `0`
   */
  turn: number | undefined;

  /**
   * The current sort order of this Combat relative to others in the same Scene
   * @defaultValue `0`
   */
  sort: number;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: Record<string, unknown>;
}

interface CombatDataConstructorData {
  /** The _id which uniquely identifies this Combat document */
  _id?: string | null;

  /** The _id of a Scene within which this Combat occurs */
  scene?: string | null;

  /** A Collection of Combatant embedded Documents */
  combatants?: Parameters<foundry.data.CombatantData['_initializeSource']>[0][] | null;

  /**
   * Is the Combat encounter currently active?
   * @defaultValue `false`
   */
  active?: boolean | null;

  /**
   * The current round of the Combat encounter
   * @defaultValue `0`
   */
  round?: number | null;

  /**
   * The current turn in the Combat round
   * @defaultValue `0`
   */
  turn?: number | null;

  /**
   * The current sort order of this Combat relative to others in the same Scene
   * @defaultValue `0`
   */
  sort?: number | null;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: Record<string, unknown> | null;
}

/**
 * The data schema for an Combat document.
 * @see BaseCombat
 */
export declare class CombatData extends DocumentData<
  CombatDataSchema,
  CombatDataProperties,
  PropertiesToSource<CombatDataProperties>,
  CombatDataConstructorData,
  documents.BaseCombat
> {
  static defineSchema(): CombatDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface CombatData extends CombatDataProperties {}
