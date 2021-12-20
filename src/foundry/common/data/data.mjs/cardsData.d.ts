import {
  ConfiguredData,
  ConfiguredFlags,
  ConfiguredSource,
  FieldReturnType,
  PropertiesToSource
} from '../../../../types/helperTypes.js';
import { DocumentData } from '../../abstract/module.mjs.js';
import * as documents from '../../documents.mjs';
import * as fields from '../fields.mjs';

interface CardsDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  name: typeof fields.REQUIRED_STRING;
  type: FieldReturnType<
    typeof fields.REQUIRED_STRING,
    {
      default: () => string;
      validate: (t: unknown) => boolean;
      validationError: '{name} {field} "{value}" is not a valid type';
    }
  >;
  description: typeof fields.BLANK_STRING;
  img: FieldReturnType<typeof fields.VIDEO_FIELD, { default: () => string }>;
  data: fields.SystemDataField;
  // FIXME: cards: fields.EmbeddedCollectionField<typeof documents.BaseCard>
  width: typeof fields.POSITIVE_INTEGER_FIELD;
  heigth: typeof fields.POSITIVE_INTEGER_FIELD;
  rotation: typeof fields.ANGLE_FIELD;
  displayCount: typeof fields.BOOLEAN_FIELD;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: typeof fields.INTEGER_SORT_FIELD;
  permission: typeof fields.DOCUMENT_PERMISSIONS;
  flags: typeof fields.OBJECT_FIELD;
}

interface CardsDataBaseProperties {
  /**
   * The _id which uniquely identifies this stack of Cards document
   * @defaultValue `null`
   */
  _id: string | null;

  /** The text name of this stack */
  name: string;

  /**
   * The type of this stack, in BaseCards.metadata.types
   * @defaultValue `game.system.documentTypes.Cards[0]`
   */
  type: string;

  /**
   * A text description of this stack
   * @defaultValue `""`
   */
  description: string;

  /**
   * An image or video which is used to represent the stack of cards
   * @defaultValue `CardsData.DEFAULT_ICON`
   */
  img: string | null;

  /** Game system data which is defined by the system template.json model */
  data: object;

  /** A collection of Card documents which currently belong to this stack */
  cards: unknown; // FIXME: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseCard>, CardsData>;

  /** The visible width of this stack */
  width: number | undefined;

  /** The visible height of this stack */
  height: number | undefined;

  /**
   * The angle of rotation of this stack
   * @defaultValue `360`
   */
  rotation: number;

  /** @defaultValue `false` */
  displayCount: boolean;

  /** @defaultValue `null` */
  folder: string | null;

  /**
   * The sort order of this stack relative to others in its parent collection
   * @defaultValue `0`
   */
  sort: number;

  /**
   * An object which configures user permissions to this stack
   * @defaultValue `{ default: CONST.ENTITY_PERMISSIONS.NONE }`
   */
  permission: Record<string, foundry.CONST.DOCUMENT_PERMISSION_LEVELS>;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<'Cards'>;
}

interface CardsDataConstructorData {
  /**
   * The _id which uniquely identifies this stack of Cards document
   * @defaultValue `null`
   */
  _id?: string | undefined | null;

  /** The text name of this stack */
  name: string;

  /** The type of this stack, in BaseCards.metadata.types */
  type?: CardsDataSource['type'] | undefined | null;

  /**
   * A text description of this stack
   * @defaultValue `""`
   */
  description?: string | undefined | null;

  /**
   * An image or video which is used to represent the stack of cards
   * @defaultValue `CardsData.DEFAULT_ICON`
   */
  img?: string | undefined | null;

  /** Game system data which is defined by the system template.json model */
  data?: DeepPartial<CardsDataSource['data']> | undefined | null;

  /** A collection of Card documents which currently belong to this stack */
  cards?: unknown | undefined | null; // FIXME: ConstructorParameters<ConfiguredDocumentClass<typeof documents.BaseCard>>[0][];

  /** The visible width of this stack */
  width?: number | undefined | null;

  /** The visible height of this stack */
  height?: number | undefined | null;

  /**
   * The angle of rotation of this stack
   * @defaultValue `360`
   */
  rotation?: number | undefined | null;

  /** @defaultValue `false` */
  displayCount?: boolean | undefined | null;

  /** @defaultValue `null` */
  folder?: string | undefined | null;

  /**
   * The sort order of this stack relative to others in its parent collection
   * @defaultValue `0`
   */
  sort?: number | undefined | null;

  /**
   * An object which configures user permissions to this stack
   * @defaultValue `{ default: CONST.ENTITY_PERMISSIONS.NONE }`
   */
  permission?: Record<string, foundry.CONST.DOCUMENT_PERMISSION_LEVELS> | undefined | null;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<'Cards'> | undefined | null;
}

type CardsDataBaseSource = PropertiesToSource<CardsDataBaseProperties>;
type CardsDataProperties = CardsDataBaseProperties & ConfiguredData<'Cards'>;
type CardsDataSource = CardsDataBaseSource & ConfiguredSource<'Cards'>;

type DocumentDataConstructor = Pick<typeof DocumentData, keyof typeof DocumentData>;

interface CardsDataConstructor extends DocumentDataConstructor {
  new (data: CardsDataConstructorData, document?: unknown | null): CardsData; // FIXME: documents.BaseCards

  defineSchema(): CardsDataSchema;

  /**
   * The default icon used for a cards stack that does not have a custom image set
   * @defaultValue `"icons/svg/card-hand.svg"`
   */
  DEFAULT_ICON: string;
}

/**
 * The data schema of a stack of multiple Cards.
 * Each stack can represent a Deck, a Hand, or a Pile.
 * @see BaseCards
 */
export type CardsData = DocumentData<
  CardsDataSchema,
  CardsDataProperties,
  CardsDataSource,
  CardsDataConstructorData
  // FIXME: documents.BaseCards
> &
  CardsDataProperties;

export declare const CardsData: CardsDataConstructor;
