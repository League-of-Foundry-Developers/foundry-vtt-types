import { PropertiesToSource } from '../../../../types/helperTypes';
import { DocumentData } from '../../abstract/module.mjs';
import * as documents from '../../documents.mjs';
import * as fields from '../fields.mjs';

interface CombatantDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  actorId: fields.ForeignDocumentField<{ type: typeof documents.BaseActor }>;
  tokenId: fields.ForeignDocumentField<{ type: typeof documents.BaseToken }>;
  name: typeof fields.STRING_FIELD;
  img: typeof fields.IMAGE_FIELD;
  initiative: typeof fields.NUMERIC_FIELD;
  hidden: typeof fields.BOOLEAN_FIELD;
  defeated: typeof fields.BOOLEAN_FIELD;
  flags: typeof fields.OBJECT_FIELD;
}

interface CombatantDataProperties {
  /** The _id which uniquely identifies this Combatant embedded document */
  _id: string | null;

  actorId: string;

  /** The _id of a Token associated with this Combatant */
  tokenId: string;

  /** A customized name which replaces the name of the Token in the tracker */
  name: string | undefined;

  /** A customized image which replaces the Token image in the tracker */
  img: string | undefined;

  /** The initiative score for the Combatant which determines its turn order */
  initiative: number | undefined | null;

  /**
   * Is this Combatant currently hidden?
   * @defaultValue `false`
   */
  hidden: boolean;

  /**
   * Has this Combatant been defeated?
   * @defaultValue `false`
   */
  defeated: boolean;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: Record<string, unknown>;
}

export interface CombatantDataConstructorData {
  /** The _id which uniquely identifies this Combatant embedded document */
  _id?: string | null;

  actorId: string;

  /** The _id of a Token associated with this Combatant */
  tokenId: string;

  /** A customized name which replaces the name of the Token in the tracker */
  name?: string | null;

  /** A customized image which replaces the Token image in the tracker */
  img?: string | null;

  /** The initiative score for the Combatant which determines its turn order */
  initiative?: number | null;

  /**
   * Is this Combatant currently hidden?
   * @defaultValue `false`
   */
  hidden?: boolean | null;

  /**
   * Has this Combatant been defeated?
   * @defaultValue `false`
   */
  defeated?: boolean | null;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: Record<string, unknown> | null;
}

/**
 * The data schema for a Combatant embedded document within a CombatEncounter document.
 * @see CombatantData
 */
export declare class CombatantData extends DocumentData<
  CombatantDataSchema,
  CombatantDataProperties,
  PropertiesToSource<CombatantDataProperties>,
  CombatantDataConstructorData,
  documents.BaseCombatant
> {
  static defineSchema(): CombatantDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface CombatantData extends CombatantDataProperties {}
