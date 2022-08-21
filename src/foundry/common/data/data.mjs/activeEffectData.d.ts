import { ConfiguredFlags, FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";
import { EffectChangeData, EffectChangeDataConstructorData } from "./effectChangeData";
import { EffectDurationData, EffectDurationDataConstructorData } from "./effectDurationData";

interface ActiveEffectDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  changes: DocumentField<EffectChangeData[]> & {
    type: [typeof EffectChangeData];
    required: true;
    default: [];
  };
  disabled: fields.BooleanField;
  duration: DocumentField<EffectDurationData> & {
    type: typeof EffectDurationData;
    required: true;
    default: Record<string, never>;
  };
  icon: fields.ImageField;
  label: fields.BlankString;
  origin: fields.StringField;
  tint: fields.ColorField;
  transfer: FieldReturnType<fields.BooleanField, { default: true }>;
  flags: fields.ObjectField;
}

interface CoreFlags {
  core?: { statusId?: string; overlay?: boolean };
}

interface ActiveEffectDataProperties {
  /**
   * The _id which uniquely identifies the ActiveEffect within a parent Actor or Item
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The array of EffectChangeData objects which the ActiveEffect applies
   * @defaultValue `[]`
   */
  changes: EffectChangeData[];

  /**
   * Is this ActiveEffect currently disabled?
   * @defaultValue `false`
   */
  disabled: boolean;

  /**
   * An EffectDurationData object which describes the duration of the ActiveEffect
   * @defaultValue `new EffectDurationData({})`
   */
  duration: EffectDurationData;

  /**
   * An icon image path used to depict the ActiveEffect
   */
  icon: string | null | undefined;

  /**
   * A text label which describes the name of the ActiveEffect
   * @defaultValue `""`
   */
  label: string;

  /**
   * A UUID reference to the document from which this ActiveEffect originated
   */
  origin: string | undefined;

  /**
   * A color string which applies a tint to the ActiveEffect icon
   */
  tint: string | null | undefined;

  /**
   * Does this ActiveEffect automatically transfer from an Item to an Actor?
   * @defaultValue `true`
   */
  transfer: boolean;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"ActiveEffect"> & CoreFlags;
}

interface ActiveEffectDataConstructorData {
  /**
   * The _id which uniquely identifies the ActiveEffect within a parent Actor or Item
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The array of EffectChangeData objects which the ActiveEffect applies
   * @defaultValue `[]`
   */
  changes?: EffectChangeDataConstructorData[] | null | undefined;

  /**
   * Is this ActiveEffect currently disabled?
   * @defaultValue `false`
   */
  disabled?: boolean | null | undefined;

  /**
   * An EffectDurationData object which describes the duration of the ActiveEffect
   * @defaultValue `new EffectDurationData({})`
   */
  duration?: EffectDurationDataConstructorData | null | undefined;

  /**
   * An icon image path used to depict the ActiveEffect
   */
  icon?: string | null | undefined;

  /**
   * A text label which describes the name of the ActiveEffect
   * @defaultValue `""`
   */
  label?: string | null | undefined;

  /**
   * A UUID reference to the document from which this ActiveEffect originated
   */
  origin?: string | null | undefined;

  /**
   * A color string which applies a tint to the ActiveEffect icon
   */
  tint?: string | null | undefined;

  /**
   * Does this ActiveEffect automatically transfer from an Item to an Actor?
   * @defaultValue `true`
   */
  transfer?: boolean | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: (ConfiguredFlags<"ActiveEffect"> & CoreFlags) | null | undefined;
}

type ActiveEffectDataSource = PropertiesToSource<ActiveEffectDataProperties>;

/**
 * The data schema for an ActiveEffect document.
 * @see BaseActiveEffect
 */
export class ActiveEffectData extends DocumentData<
  ActiveEffectDataSchema,
  ActiveEffectDataProperties,
  ActiveEffectDataSource,
  ActiveEffectDataConstructorData,
  documents.BaseActiveEffect
> {
  static override defineSchema(): ActiveEffectDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ActiveEffectData extends ActiveEffectDataProperties {}
