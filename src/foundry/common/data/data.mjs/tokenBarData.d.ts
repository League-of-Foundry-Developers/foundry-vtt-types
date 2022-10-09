import { PropertiesToSource } from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs";
import { documents } from "../../module.mjs";

interface TokenBarDataSchema extends DocumentSchema {
  attribute: DocumentField<string> & {
    type: String;
    default: null;
    nullable: true;
    required: true;
  };
}

interface TokenBarDataProperties {
  /**
   * The attribute path within the Token's Actor data which should be displayed
   * @defaultValue `null`
   */
  attribute: string | null;
}

interface TokenBarDataConstructorData {
  /**
   * The attribute path within the Token's Actor data which should be displayed
   * @defaultValue `null`
   */
  attribute?: string | null | undefined;
}

type TokenBarDataSource = PropertiesToSource<TokenBarDataProperties>;

/**
 * An embedded data structure for the contents of a Token attribute bar.
 * @see TokenData
 */
export class TokenBarData extends DocumentData<
  TokenBarDataSchema,
  TokenBarDataProperties,
  TokenBarDataSource,
  TokenBarDataConstructorData,
  documents.BaseToken
> {
  static override defineSchema(): TokenBarDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TokenBarData extends TokenBarDataProperties {}
