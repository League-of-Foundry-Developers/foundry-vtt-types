import type { PropertiesToSource } from "../../../../types/helperTypes.d.mts";
import type DocumentData from "../../abstract/data.d.mts";
import type * as fields from "../fields.d.mts";

export interface CardFaceDataSchema extends DocumentSchema {
  name: fields.BlankString;
  text: fields.BlankString;
  img: fields.VideoField;
}

export interface CardFaceDataProperties {
  /**
   * A name for this card face
   * @defaultValue `""`
   */
  name: string;

  /**
   * Displayed text that belongs to this face
   * @defaultValue `""`
   */
  text: string;

  /** A displayed image or video file which depicts the face */
  img: string | null | undefined;
}

export interface CardFaceDataConstructorData {
  /**
   * A name for this card face
   * @defaultValue `""`
   */
  name?: string | null | undefined;

  /**
   * Displayed text that belongs to this face
   * @defaultValue `""`
   */
  text?: string | null | undefined;

  /** A displayed image or video file which depicts the face */
  img?: string | null | undefined;
}

export type CardFaceDataSource = PropertiesToSource<CardFaceDataProperties>;

/**
 * The data schema of a single card face which belongs to a specific Card.
 * @see CardData
 */
export declare class CardFaceData extends DocumentData<
  CardFaceDataSchema,
  CardFaceDataProperties,
  CardFaceDataSource,
  CardFaceDataConstructorData
> {
  static override defineSchema(): CardFaceDataSchema;

  /**
   * The default icon used for a card face that does not have a custom image set
   * @defaultValue `"icons/svg/card-joker.svg"`
   */
  static DEFAULT_ICON: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CardFaceData extends CardFaceDataProperties {}
