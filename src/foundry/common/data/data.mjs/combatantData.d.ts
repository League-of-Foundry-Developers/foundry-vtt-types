import { ConfiguredDocumentClass, ConfiguredFlags, PropertiesToSource } from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";

interface CombatantDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  actorId: fields.ForeignDocumentField<{ type: typeof documents.BaseActor }>;
  tokenId: fields.ForeignDocumentField<{ type: typeof documents.BaseToken }>;
  sceneId: fields.ForeignDocumentField<{ type: typeof documents.BaseScene }>;
  name: fields.StringField;
  img: fields.ImageField;
  initiative: fields.NumericField;
  hidden: fields.BooleanField;
  defeated: fields.BooleanField;
  flags: fields.ObjectField;
}

interface CombatantDataProperties {
  /**
   * The _id which uniquely identifies this Combatant embedded document
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The _id of an Actor associated with this Combatant
   * @defaultValue `null`
   */
  actorId: string | null;

  /**
   * The _id of a Token associated with this Combatant
   * @defaultValue `null`
   */
  tokenId: string | null;

  /** @defaultValue `null` */
  sceneId: string | null;

  /** A customized name which replaces the name of the Token in the tracker */
  name: string | undefined;

  /** A customized image which replaces the Token image in the tracker */
  img: string | null | undefined;

  /** The initiative score for the Combatant which determines its turn order */
  initiative: number | null | undefined;

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
  flags: ConfiguredFlags<"Combatant">;
}

interface CombatantDataConstructorData {
  /**
   * The _id which uniquely identifies this Combatant embedded document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The _id of an Actor associated with this Combatant
   * @defaultValue `null`
   */
  actorId?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseActor>> | string | null | undefined;

  /**
   * The _id of a Token associated with this Combatant
   * @defaultValue `null`
   */
  tokenId?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseToken>> | string | null | undefined;

  /** @defaultValue `null` */
  sceneId?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseScene>> | string | null | undefined;

  /** A customized name which replaces the name of the Token in the tracker */
  name?: string | null | undefined;

  /** A customized image which replaces the Token image in the tracker */
  img?: string | null | undefined;

  /** The initiative score for the Combatant which determines its turn order */
  initiative?: number | null | undefined;

  /**
   * Is this Combatant currently hidden?
   * @defaultValue `false`
   */
  hidden?: boolean | null | undefined;

  /**
   * Has this Combatant been defeated?
   * @defaultValue `false`
   */
  defeated?: boolean | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"Combatant"> | null | undefined;
}

type CombatantDataSource = PropertiesToSource<CombatantDataProperties>;

/**
 * The data schema for a Combatant embedded document within a CombatEncounter document.
 * @see CombatantData
 */
export class CombatantData extends DocumentData<
  CombatantDataSchema,
  CombatantDataProperties,
  CombatantDataSource,
  CombatantDataConstructorData,
  documents.BaseCombatant
> {
  static override defineSchema(): CombatantDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CombatantData extends CombatantDataProperties {}
