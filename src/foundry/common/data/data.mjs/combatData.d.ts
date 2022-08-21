import {
  ConfiguredDocumentClass,
  ConfiguredFlags,
  FieldReturnType,
  PropertiesToSource
} from "../../../../types/helperTypes";
import EmbeddedCollection from "../../abstract/embedded-collection.mjs";
import { DocumentData } from "../../abstract/module.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";
import { CombatantDataConstructorData } from "./combatantData";

interface CombatDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  scene: fields.ForeignDocumentField<{ type: typeof documents.BaseScene }>;
  combatants: fields.EmbeddedCollectionField<typeof documents.BaseCombatant>;
  active: fields.BooleanField;
  round: FieldReturnType<fields.NonnegativeIntegerField, { default: 0; required: true }>;
  turn: FieldReturnType<
    fields.NonnegativeIntegerField,
    {
      default: 0;
      required: true;
      nullable: true;
      validate: (n: unknown) => boolean;
    }
  >;
  sort: fields.IntegerSortField;
  flags: fields.ObjectField;
}

interface CombatDataProperties {
  /**
   * The _id which uniquely identifies this Combat document
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The _id of a Scene within which this Combat occurs
   * @defaultValue `null`
   */
  scene: string | null;

  /**
   * A Collection of Combatant embedded Documents
   * @defaultValue `new EmbeddedCollection(CombatantData, [], BaseCombatant.implementation)`
   */
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
  turn: number | null;

  /**
   * The current sort order of this Combat relative to others in the same Scene
   * @defaultValue `0`
   */
  sort: number;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"Combat">;
}

interface CombatDataConstructorData {
  /**
   * The _id which uniquely identifies this Combat document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The _id of a Scene within which this Combat occurs
   * @defaultValue `null`
   */
  scene?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseScene>> | string | null | undefined;

  /**
   * A Collection of Combatant embedded Documents
   * @defaultValue `new EmbeddedCollection(CombatantData, [], BaseCombatant.implementation)`
   */
  combatants?: CombatantDataConstructorData[] | null | undefined;

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
  flags?: ConfiguredFlags<"Combat"> | null | undefined;
}

type CombatDataSource = PropertiesToSource<CombatDataProperties>;

/**
 * The data schema for an Combat document.
 * @see BaseCombat
 */
export class CombatData extends DocumentData<
  CombatDataSchema,
  CombatDataProperties,
  CombatDataSource,
  CombatDataConstructorData,
  documents.BaseCombat
> {
  static override defineSchema(): CombatDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CombatData extends CombatDataProperties {}
