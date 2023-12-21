import type { DocumentMetadata } from "../abstract/document.mts";
import type { Document } from "../abstract/module.mts";
import type * as data from "../data/data.mjs/index.mts";
import type { BaseCard } from "./baseCard.mts";

type CardsMetadata = Merge<
  DocumentMetadata,
  {
    name: "Cards";
    collection: "cards";
    label: "DOCUMENT.Cards";
    labelPlural: "DOCUMENT.CardsPlural";
    isPrimary: true;
    types: string[];
    hasSystemData: true;
    embedded: {
      Card: typeof BaseCard;
    };
  }
>;

/**
 * The base Cards definition which defines common behavior of an Cards document shared by both client and server.
 */
export declare class BaseCards extends Document<data.CardsData, null, CardsMetadata> {
  static override get schema(): typeof data.CardsData;

  static override get metadata(): CardsMetadata;

  /**
   * A reference to the Collection of Card documents contained within this Cards stack, indexed by _id.
   */
  get cards(): this["data"]["cards"];

  /**
   * The sub-type of Cards.
   */
  get type(): data.CardsData["type"];
}
