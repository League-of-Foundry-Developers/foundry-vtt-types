import type {
  ConfiguredData,
  ConfiguredFlags,
  ConfiguredSource,
  FieldReturnType,
  PropertiesToSource
} from '../../../../types/helperTypes.js';
import type DocumentData from '../../abstract/data.mjs.js';
import * as fields from '../fields.mjs';
import type { CardFaceData, CardFaceDataConstructorData } from './cardFaceData.js';

interface CardDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  name: typeof fields.REQUIRED_STRING;
  description: typeof fields.BLANK_STRING;
  type: FieldReturnType<
    typeof fields.REQUIRED_STRING,
    {
      default: () => string;
      validate: (t: unknown) => boolean;
      validationError: '{name} {field} "{value}" is not a valid type';
    }
  >;
  data: fields.SystemDataField;
  suit: typeof fields.BLANK_STRING;
  value: typeof fields.NUMERIC_FIELD;
  back: {
    type: typeof CardFaceData;
    required: true;
    default: Record<string, never>;
  };
  faces: {
    type: Array<typeof CardFaceData>;
    required: true;
    default: [];
  };
  face: {
    type: typeof Number;
    required: true;
    default: null;
    nullable: true;
    validate: (f: unknown) => boolean;
    validationError: '{name} {field} "{value}" must have a non-negative integer value or null';
  };
  drawn: typeof fields.BOOLEAN_FIELD;
  origin: typeof fields.DOCUMENT_ID;
  width: typeof fields.POSITIVE_INTEGER_FIELD;
  height: typeof fields.POSITIVE_INTEGER_FIELD;
  rotation: typeof fields.ANGLE_FIELD;
  sort: typeof fields.INTEGER_SORT_FIELD;
  flags: typeof fields.OBJECT_FIELD;
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

  /** Game system data which is defined by the system template.json model */
  data: object;

  /** @defaultValue `""` */
  suit: string;

  /**  */
  value: number | undefined | null;

  /** @defaultValue `{}` */
  back: CardFaceData | Record<string, never>;

  /**
   * An array of faces which can be displayed for the card
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
  flags: ConfiguredFlags<'Card'>;
}

interface CardDataConstructorData {
  /**
   * The _id which uniquely identifies this Card document
   * @defaultValue `null`
   */
  _id?: string | undefined | null;

  /** The text name of this card */
  name: string;

  /**
   * A text description of this card which applies to all faces
   * @defaultValue `""`
   */
  description?: string | undefined | null;

  /**
   * A category of card (for example, a suit) to which this card belongs
   * @defaultValue `game.system.documentTypes.Card[0]`
   */
  type?: string | undefined | null;

  /** Game system data which is defined by the system template.json model */
  data?: DeepPartial<CardDataSource['data']> | undefined | null;

  /** @defaultValue `""` */
  suit?: string | undefined | null;

  /**  */
  value?: number | undefined | null;

  /**  */
  back?: CardFaceDataConstructorData | undefined | null;

  /**
   * An array of faces which can be displayed for the card
   * @defaultValue `[]`
   */
  faces?: CardFaceDataConstructorData[] | undefined | null;

  /**
   * The index of the currently displayed face
   * @defaultValue `null`
   */
  face: number | null;

  /**
   * Whether this card is currently drawn from its source deck
   * @defaultValue `false`
   */
  drawn?: boolean | undefined | null;

  /**
   * The document ID of the origin deck to which this card belongs
   * @defaultValue `null`
   */
  origin?: string | undefined | null;

  /** The visible width of this card */
  width?: number | undefined | null;

  /** The visible height of this card */
  height?: number | undefined | null;

  /**
   * The angle of rotation of this card
   * @defaultValue `360`
   */
  rotation?: number | undefined | null;

  /**
   * The sort order of this card relative to others in the same stack
   * @defaultValue `0`
   */
  sort?: number | undefined | null;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<'Card'> | undefined | null;
}

type CardDataBaseSource = PropertiesToSource<CardDataBaseProperties>;
type CardDataProperties = CardDataBaseProperties & ConfiguredData<'Card'>;
type CardDataSource = CardDataBaseSource & ConfiguredSource<'Card'>;

type DocumentDataConstructor = Pick<typeof DocumentData, keyof typeof DocumentData>;

interface CardDataConstructor extends DocumentDataConstructor {
  new (data: CardDataConstructorData, document?: unknown | null): CardData; // FIXME: documents.BaseCard;

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
  CardDataConstructorData
  // FIXME: documents.BaseCard
> &
  CardDataProperties & {
    _initializeSource(data: CardDataConstructorData): CardDataSource;

    _initialize(): void;
  };

export declare const CardData: CardDataConstructor;
