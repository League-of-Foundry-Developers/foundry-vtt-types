import type {
  ConfiguredData,
  ConfiguredFlags,
  ConfiguredSource,
  FieldReturnType,
  PropertiesToSource
} from "../../../../types/helperTypes";
import type DocumentData from "../../abstract/data.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";
import type { CardFaceData, CardFaceDataConstructorData } from "./cardFaceData";

interface CardDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  name: fields.RequiredString;
  description: fields.BlankString;
  type: FieldReturnType<
    fields.RequiredString,
    {
      default: () => string;
      validate: (t: unknown) => boolean;
      validationError: '{name} {field} "{value}" is not a valid type';
    }
  >;
  data: fields.SystemDataField;
  suit: fields.BlankString;
  value: fields.NumericField;
  back: DocumentField<CardFaceData> & {
    type: typeof CardFaceData;
    required: true;
    default: Record<string, never>;
  };
  faces: DocumentField<CardFaceData[]> & {
    type: [typeof CardFaceData];
    required: true;
    default: [];
  };
  face: DocumentField<number> & {
    type: typeof Number;
    required: true;
    default: null;
    nullable: true;
    validate: (f: unknown) => boolean;
    validationError: '{name} {field} "{value}" must have a non-negative integer value or null';
  };
  drawn: fields.BooleanField;
  origin: Omit<fields.DocumentId, "nullable"> & { nullable: true };
  width: fields.PositiveIntegerField;
  height: fields.PositiveIntegerField;
  rotation: fields.AngleField;
  sort: fields.IntegerSortField;
  flags: fields.ObjectField;
}

interface CardDataBaseProperties {
  /**
   * The _id which uniquely identifies this Card document
   * @defaultValue `null`
   */
  _id: string | null;

  /** The text name of this card */
  name: string;

  /**
   * A text description of this card which applies to all faces
   * @defaultValue `""`
   */
  description: string;

  /**
   * A category of card (for example, a suit) to which this card belongs
   * @defaultValue `game.system.documentTypes.Card[0]`
   */
  type: string;

  /**
   * Game system data which is defined by the system template.json model
   * @defaultValue template from template.json for type or `{}`
   */
  data: object;

  /**
   * An optional suit designation which is used by default sorting
   * @defaultValue `""`
   */
  suit: string;

  /** An optional numeric value of the card which is used by default sorting */
  value: number | null | undefined;

  /**
   * An object of face data which describes the back of this card
   * @defaultValue `new CardFaceData({})`
   */
  back: CardFaceData;

  /**
   * An array of face data which represent displayable faces of this card
   * @defaultValue `[]`
   */
  faces: CardFaceData[];

  /**
   * The index of the currently displayed face
   * @defaultValue `null`
   */
  face: number | null;

  /**
   * Whether this card is currently drawn from its source deck
   * @defaultValue `false`
   */
  drawn: boolean;

  /**
   * The document ID of the origin deck to which this card belongs
   * @defaultValue `null`
   */
  origin: string | null;

  /** The visible width of this card */
  width: number | undefined;

  /** The visible height of this card */
  height: number | undefined;

  /**
   * The angle of rotation of this card
   * @defaultValue `360`
   */
  rotation: number;

  /**
   * The sort order of this card relative to others in the same stack
   * @defaultValue `0`
   */
  sort: number;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"Card">;
}

interface CardDataConstructorData {
  /**
   * The _id which uniquely identifies this Card document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /** The text name of this card */
  name: string;

  /**
   * A text description of this card which applies to all faces
   * @defaultValue `""`
   */
  description?: string | null | undefined;

  /**
   * A category of card (for example, a suit) to which this card belongs
   * @defaultValue `game.system.documentTypes.Card[0]`
   */
  type?: CardDataSource["type"] | null | undefined;

  /**
   * Game system data which is defined by the system template.json model
   * @defaultValue template from template.json for type or `{}`
   */
  data?: DeepPartial<CardDataSource["data"]> | null | undefined;

  /**
   * An optional suit designation which is used by default sorting
   * @defaultValue `""`
   */
  suit?: string | null | undefined;

  /** An optional numeric value of the card which is used by default sorting */
  value?: number | null | undefined;

  /**
   * An object of face data which describes the back of this card
   * @defaultValue `new CardFaceData({})`
   */
  back?: CardFaceDataConstructorData | null | undefined;

  /**
   * An array of face data which represent displayable faces of this card
   * @defaultValue `[]`
   */
  faces?: CardFaceDataConstructorData[] | null | undefined;

  /**
   * The index of the currently displayed face
   * @defaultValue `null`
   */
  face?: number | null | undefined;

  /**
   * Whether this card is currently drawn from its source deck
   * @defaultValue `false`
   */
  drawn?: boolean | null | undefined;

  /**
   * The document ID of the origin deck to which this card belongs
   * @defaultValue `null`
   */
  origin?: string | null | undefined;

  /** The visible width of this card */
  width?: number | null | undefined;

  /** The visible height of this card */
  height?: number | null | undefined;

  /**
   * The angle of rotation of this card
   * @defaultValue `360`
   */
  rotation?: number | null | undefined;

  /**
   * The sort order of this card relative to others in the same stack
   * @defaultValue `0`
   */
  sort?: number | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"Card"> | null | undefined;
}

type CardDataBaseSource = PropertiesToSource<CardDataBaseProperties>;
type CardDataProperties = CardDataBaseProperties & ConfiguredData<"Card">;
type CardDataSource = CardDataBaseSource & ConfiguredSource<"Card">;

type DocumentDataConstructor = Pick<typeof DocumentData, keyof typeof DocumentData>;

interface CardDataConstructor extends DocumentDataConstructor {
  new (data: CardDataConstructorData, document?: documents.BaseCard | null | undefined): CardData;

  defineSchema(): CardDataSchema;
}

/**
 * The data schema of a single Card document.
 * @see BaseCard
 */
export type CardData = DocumentData<
  CardDataSchema,
  CardDataProperties,
  CardDataSource,
  CardDataConstructorData,
  documents.BaseCard
> &
  CardDataProperties;

export const CardData: CardDataConstructor;
