import { DocumentMetadata } from '../abstract/document.mjs';
import { DataModel, Document } from '../abstract/module.mjs';
import * as documents from './module.mjs';
import * as fields from '../data/fields.mjs';
import type { ConfiguredDocumentClass } from '../../../types/helperTypes.js';
import { FlagsField } from '../data/flagsField';

type BaseCombatantSchema = {
  /**
   * The _id which uniquely identifies this Combatant embedded document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The _id of an Actor associated with this Combatant
   */
  actorId: fields.ForeignDocumentField<typeof documents.BaseActor, { label: 'COMBAT.CombatantActor'; idOnly: true }>;

  /**
   * The _id of a Token associated with this Combatant
   */
  tokenId: fields.ForeignDocumentField<typeof documents.BaseToken, { label: 'COMBAT.CombatantToken'; idOnly: true }>;

  sceneId: fields.ForeignDocumentField<typeof documents.BaseScene, { label: 'COMBAT.CombatantScene'; idOnly: true }>;

  /**
   * A customized name which replaces the name of the Token in the tracker
   */
  name: fields.StringField<{ label: 'COMBAT.CombatantName' }>;

  /**
   * A customized image which replaces the Token image in the tracker
   */
  img: fields.FilePathField<{ categories: ['IMAGE']; label: 'COMBAT.CombatantImage' }>;

  /**
   * The initiative score for the Combatant which determines its turn order
   */
  initiative: fields.NumberField<{ label: 'COMBAT.CombatantInitiative' }>;

  /**
   * Is this Combatant currently hidden?
   * (default: `false`)
   */
  hidden: fields.BooleanField<{ label: 'COMBAT.CombatantHidden' }>;

  /**
   * Has this Combatant been defeated?
   * (default: `false`)
   */
  defeated: fields.BooleanField<{ label: 'COMBAT.CombatantDefeated' }>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'Combatant', {}>;
};

type BaseCombatantMetadata = Merge<
  DocumentMetadata,
  {
    name: 'Combatant';
    collection: 'combatants';
    label: 'DOCUMENT.Combatant';
    labelPlural: 'DOCUMENT.Combatants';
    isEmbedded: true;
    permissions: {
      create: CanCreate;
      update: CanUpdate;
    };
  }
>;

type CanUpdate = (
  user: documents.BaseUser,
  doc: BaseCombatant,
  data: DeepPartial<DataModel.SchemaToSource<BaseCombatant['schema']>>
) => boolean;

type CanCreate = (
  user: documents.BaseUser,
  doc: BaseCombatant,
  data: DeepPartial<DataModel.SchemaToSource<BaseCombatant['schema']>>
) => boolean;

/**
 * The base Combatant model definition which defines common behavior of an Combatant document between both client and server.
 */
declare class BaseCombatant extends Document<
  BaseCombatantSchema,
  InstanceType<ConfiguredDocumentClass<typeof documents.BaseCombat>>,
  BaseCombatantMetadata
> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseCombatantMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseCombatantSchema;

  /**
   * Is a user able to update an existing Combatant?
   */
  static #canUpdate: CanUpdate;

  /**
   * Is a user able to create this Combatant?
   */
  static #canCreate: CanCreate;
}

export default BaseCombatant;
