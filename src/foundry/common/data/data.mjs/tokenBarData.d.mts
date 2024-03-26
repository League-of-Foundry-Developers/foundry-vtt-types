import type { PropertiesToSource } from "../../../../types/helperTypes.d.mts";
import type { DocumentData } from "../../abstract/module.d.mts";
import type { documents } from "../../module.d.mts";

export interface TokenBarDataSchema extends DocumentSchema {
  attribute: DocumentField<string> & {
    type: String;
    default: null;
    nullable: true;
    required: true;
  };
}

export interface TokenBarDataProperties {
  /**
   * The attribute path within the Token's Actor data which should be displayed
   * @defaultValue `null`
   */
  attribute: string | null;
}

export interface TokenBarDataConstructorData {
  /**
   * The attribute path within the Token's Actor data which should be displayed
   * @defaultValue `null`
   */
  attribute?: string | null | undefined;
}

export type TokenBarDataSource = PropertiesToSource<TokenBarDataProperties>;

/**
 * An embedded data structure for the contents of a Token attribute bar.
 * @see TokenData
 */
export declare class TokenBarData extends DocumentData<
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
