import {
  ConfiguredDocumentClass,
  ConfiguredFlags,
  ConstructorDataType,
  FieldReturnType,
  PropertiesToSource
} from '../../../../types/helperTypes';
import EmbeddedCollection from '../../abstract/embedded-collection.mjs';
import { DocumentData } from '../../abstract/module.mjs';
import * as documents from '../../documents.mjs';
import * as fields from '../fields.mjs';
import { CombatantData } from './combatantData';

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
  round: number;

  /**
   * The current turn in the Combat round
   * @defaultValue `0`
   */
  turn: number;

  /**
   * The current sort order of this Combat relative to others in the same Scene
   * @defaultValue `0`
   */
  sort: number;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<'Combat'>;
}

interface CombatDataConstructorData {
  /** The _id which uniquely identifies this Combat document */
  _id?: string | null | undefined;

  /** The _id of a Scene within which this Combat occurs */
  scene?: string | null | undefined;

  /** A Collection of Combatant embedded Documents */
  combatants?: ConstructorDataType<CombatantData>[] | null | undefined;

  /**
   * Is the Combat encounter currently active?
   * @defaultValue `false`
   */
  active?: boolean | null | undefined;

  /**
   * The current round of the Combat encounter
   * @defaultValue `0`
   */
  round?: number | null | undefined;

  /**
   * The current turn in the Combat round
   * @defaultValue `0`
   */
  turn?: number | null | undefined;

  /**
   * The current sort order of this Combat relative to others in the same Scene
   * @defaultValue `0`
   */
  sort?: number | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<'Combat'> | null | undefined;
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
