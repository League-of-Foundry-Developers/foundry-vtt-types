import { PropertiesToSource } from '../../../../types/helperTypes.js';
import { DocumentData } from '../../abstract/module.mjs';
import { documents } from '../../module.mjs';

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
   */
  attribute: string | null;
}

export interface TokenBarDataConstructorData {
  /**
   * The attribute path within the Token's Actor data which should be displayed
   */
  attribute?: string | null;
}

/**
 * An embedded data structure for the contents of a Token attribute bar.
 * @see TokenData
 */
export declare class TokenBarData extends DocumentData<
  TokenBarDataSchema,
  TokenBarDataProperties,
  PropertiesToSource<TokenBarDataProperties>,
  TokenBarDataConstructorData,
  documents.BaseToken
> {
  static defineSchema(): TokenBarDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TokenBarData extends TokenBarDataProperties {}
