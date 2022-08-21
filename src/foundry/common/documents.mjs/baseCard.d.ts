import { ConfiguredDocumentClass } from "../../../types/helperTypes";
import { DocumentMetadata } from "../abstract/document.mjs";
import { Document } from "../abstract/module.mjs";
import * as data from "../data/data.mjs";
import type { CardDataConstructorData, CardDataSource } from "../data/data.mjs/cardData";
import { BaseCards } from "./baseCards";
import { BaseUser } from "./baseUser";

type CardMetadata = Merge<
  DocumentMetadata,
  {
    name: "Card";
    collection: "cards";
    label: "DOCUMENT.Card";
    labelPlural: "DOCUMENT.Cards";
    isEmbedded: true;
    types: string[];
    hasSystemData: true;
    permissions: {
      create: (user: BaseUser, doc: BaseCard, data: CardDataSource) => boolean;
      update: (user: BaseUser, doc: BaseCard, data: DeepPartial<CardDataConstructorData>) => boolean;
    };
  }
>;

/**
 * The base Card definition which defines common behavior of an embedded Card document shared by both client and server.
 */
export declare class BaseCard extends Document<
  data.CardData,
  InstanceType<ConfiguredDocumentClass<typeof BaseCards>>,
  CardMetadata
> {
  static override get schema(): typeof data.CardData;

  static override get metadata(): CardMetadata;

  /**
   * The sub-type of Card.
   */
  get type(): data.CardData["type"];

  /**
   * Is a User able to create a new embedded Card document within this parent?
   */
  protected static _canCreate(user: BaseUser, doc: BaseCard, data: CardDataSource): boolean;

  /**
   * Is a user able to update an existing Card?
   */
  protected static _canUpdate(user: BaseUser, doc: BaseCard, data: DeepPartial<CardDataConstructorData>): boolean;

  override testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    { exact }: { exact?: boolean }
  ): boolean;
}
