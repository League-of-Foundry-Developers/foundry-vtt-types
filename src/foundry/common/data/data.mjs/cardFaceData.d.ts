import type { PropertiesToSource } from '../../../../types/helperTypes.js';
import type DocumentData from '../../abstract/data.mjs.js';
import * as fields from '../fields.mjs';

interface CardFaceDataSchema extends DocumentSchema {
  name: typeof fields.BLANK_STRING;
  text: typeof fields.BLANK_STRING;
  img: typeof fields.VIDEO_FIELD;
}

interface CardFaceDataProperties {
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
  img: string | undefined | null;
}

interface CardFaceDataConstructorData {
  /**
   * A name for this card face
   * @defaultValue `""`
   */
  name?: string | undefined | null;

  /**
   * Displayed text that belongs to this face
   * @defaultValue `""`
   */
  text?: string | undefined | null;

  /** A displayed image or video file which depicts the face */
  img?: string | undefined | null;
}

/**
 * The data schema of a single card face which belongs to a specific Card.
 * @see CardData
 */
export declare class CardFaceData extends DocumentData<
  CardFaceDataSchema,
  CardFaceDataProperties,
  PropertiesToSource<CardFaceDataProperties>,
  CardFaceDataConstructorData
> {
  static defineSchema(): CardFaceDataSchema;

  /**
   * The default icon used for a card face that does not have a custom image set
   * @defaultValue `"icons/svg/card-joker.svg"`
   */
  static DEFAULT_ICON: string;
}
