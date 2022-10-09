import { ConfiguredDocumentClass } from "../../../types/helperTypes";
import { DocumentMetadata } from "../abstract/document.mjs";
import { Document } from "../abstract/module.mjs";
import * as data from "../data/data.mjs";
import type { TokenDataConstructorData } from "../data/data.mjs/tokenData";
import { BaseUser } from "./baseUser";

type TokenMetadata = Merge<
  DocumentMetadata,
  {
    name: "Token";
    collection: "tokens";
    label: "DOCUMENT.Token";
    labelPlural: "DOCUMENT.Tokens";
    isEmbedded: true;
    permissions: {
      create: "TOKEN_CREATE";
      update: (user: BaseUser, doc: BaseToken, data: DeepPartial<TokenDataConstructorData>) => boolean;
    };
  }
>;

/**
 * The base Token model definition which defines common behavior of an Token document between both client and server.
 */
export declare class BaseToken extends Document<
  data.TokenData,
  InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseScene>>,
  TokenMetadata
> {
  static override get schema(): typeof data.TokenData;

  static override get metadata(): TokenMetadata;

  /**
   * A convenience reference to the name which should be displayed for the Token
   */
  get name(): string;

  /**
   * Is a user able to update an existing Token?
   */
  protected static _canUpdate(user: BaseUser, doc: BaseToken, data: DeepPartial<TokenDataConstructorData>): boolean;
}
