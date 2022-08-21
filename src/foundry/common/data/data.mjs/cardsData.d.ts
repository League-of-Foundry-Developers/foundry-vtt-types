import {
  ConfiguredData,
  ConfiguredDocumentClass,
  ConfiguredFlags,
  ConfiguredSource,
  FieldReturnType,
  PropertiesToSource
} from "../../../../types/helperTypes";
import type EmbeddedCollection from "../../abstract/embedded-collection.mjs";
import { DocumentData } from "../../abstract/module.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";

interface CardsDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  name: fields.RequiredString;
  type: FieldReturnType<
    fields.RequiredString,
    {
      default: () => string;
      validate: (t: unknown) => boolean;
      validationError: '{name} {field} "{value}" is not a valid type';
    }
  >;
  description: fields.BlankString;
  img: FieldReturnType<fields.VideoField, { default: () => string }>;
  data: fields.SystemDataField;
  cards: fields.EmbeddedCollectionField<typeof documents.BaseCard>;
  width: fields.PositiveIntegerField;
  heigth: fields.PositiveIntegerField;
  rotation: fields.AngleField;
  displayCount: fields.BooleanField;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: fields.IntegerSortField;
  permission: fields.DocumentPermissions;
  flags: fields.ObjectField;
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

  /**
   * Game system data which is defined by the system template.json model
   * @defaultValue template from template.json for type or `{}`
   */
  data: object;

  /**
   * A collection of Card documents which currently belong to this stack
   * @defaultValue `new EmbeddedCollection(CardData, [], BaseCard.implementation)`
   */
  cards: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseCard>, CardsData>;

  /** The visible width of this stack */
  width: number | undefined;

  /** The visible height of this stack */
  height: number | undefined;

  /**
   * The angle of rotation of this stack
   * @defaultValue `360`
   */
  rotation: number;

  /**
   * Whether or not to publicly display the number of cards in this stack
   * @defaultValue `false`
   */
  displayCount: boolean;

  /**
   * The _id of a Folder which contains this document
   * @defaultValue `null`
   */
  folder: string | null;

  /**
   * The sort order of this stack relative to others in its parent collection
   * @defaultValue `0`
   */
  sort: number;

  /**
   * An object which configures user permissions to this stack
   * @defaultValue `{ default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }`
   */
  permission: Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"Cards">;
}

interface CardsDataConstructorData {
  /**
   * The _id which uniquely identifies this stack of Cards document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /** The text name of this stack */
  name: string;

  /**
   * The type of this stack, in BaseCards.metadata.types
   * @defaultValue `game.system.documentTypes.Cards[0]`
   */
  type?: CardsDataSource["type"] | null | undefined;

  /**
   * A text description of this stack
   * @defaultValue `""`
   */
  description?: string | null | undefined;

  /**
   * An image or video which is used to represent the stack of cards
   * @defaultValue `CardsData.DEFAULT_ICON`
   */
  img?: string | null | undefined;

  /**
   * Game system data which is defined by the system template.json model
   * @defaultValue template from template.json for type or `{}`
   */
  data?: DeepPartial<CardsDataSource["data"]> | null | undefined;

  /**
   * A collection of Card documents which currently belong to this stack
   * @defaultValue `new EmbeddedCollection(CardData, [], BaseCard.implementation)`
   */
  cards?: ConstructorParameters<ConfiguredDocumentClass<typeof documents.BaseCard>>[0][] | null | undefined;

  /** The visible width of this stack */
  width?: number | null | undefined;

  /** The visible height of this stack */
  height?: number | null | undefined;

  /**
   * The angle of rotation of this stack
   * @defaultValue `360`
   */
  rotation?: number | null | undefined;

  /**
   * Whether or not to publicly display the number of cards in this stack
   * @defaultValue `false`
   */
  displayCount?: boolean | null | undefined;

  /**
   * The _id of a Folder which contains this document
   * @defaultValue `null`
   */
  folder?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseFolder>> | string | null | undefined;

  /**
   * The sort order of this stack relative to others in its parent collection
   * @defaultValue `0`
   */
  sort?: number | null | undefined;

  /**
   * An object which configures user permissions to this stack
   * @defaultValue `{ default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }`
   */
  permission?: Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS> | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"Cards"> | null | undefined;
}

type CardsDataBaseSource = PropertiesToSource<CardsDataBaseProperties>;
type CardsDataProperties = CardsDataBaseProperties & ConfiguredData<"Cards">;
type CardsDataSource = CardsDataBaseSource & ConfiguredSource<"Cards">;

type DocumentDataConstructor = Pick<typeof DocumentData, keyof typeof DocumentData>;

interface CardsDataConstructor extends DocumentDataConstructor {
  new (data: CardsDataConstructorData, document?: documents.BaseCards | null | undefined): CardsData;

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
  CardsDataConstructorData,
  documents.BaseCards
> &
  CardsDataProperties;

export const CardsData: CardsDataConstructor;
