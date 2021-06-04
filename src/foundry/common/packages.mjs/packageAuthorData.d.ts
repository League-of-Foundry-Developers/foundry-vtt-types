import { PropertiesToSource } from '../../../types/helperTypes';
import { DocumentData } from '../abstract/module.mjs';
import * as fields from '../data/fields.mjs';

interface PackageAuthorDataSchema extends DocumentSchema {
  name: typeof fields.REQUIRED_STRING;
  email: typeof fields.STRING_FIELD;
  url: typeof fields.STRING_FIELD;
  discord: typeof fields.STRING_FIELD;
}

interface PackageAuthorDataProperties {
  /**
   * The author name
   */
  name: string;

  /**
   * The author email address
   */
  email?: string;

  /**
   *  A website url for the author
   */
  url?: string;

  /**
   *  A Discord username for the author
   */
  discord?: string;
}

/**
 * An inner data object which represents a single package author in the authors array.
 */
export declare class PackageAuthorData extends DocumentData<
  PackageAuthorDataSchema,
  PackageAuthorDataProperties,
  null
> {
  constructor(data?: DeepPartial<PropertiesToSource<PackageAuthorDataProperties>>, document?: null);

  static defineSchema(): PackageAuthorDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PackageAuthorData extends PackageAuthorDataProperties {}
