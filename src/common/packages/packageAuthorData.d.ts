import { DocumentData } from '../abstract/module';
import * as fields from '../data/fields';

interface PackageAuthorDataSchema extends DocumentSchema {
  discord: typeof fields.STRING_FIELD;
  email: typeof fields.STRING_FIELD;
  name: typeof fields.REQUIRED_STRING;
  url: typeof fields.STRING_FIELD;
}

interface PackageAuthorDataProperties {
  /**
   *  A Discord username for the author
   */
  discord?: string;

  /**
   * The author email address
   */
  email?: string;

  /**
   * The author name
   */
  name: string;

  /**
   *  A website url for the author
   */
  url?: string;
}

/**
 * An inner data object which represents a single package author in the authors array.
 */
export declare class PackageAuthorData extends DocumentData<
  PackageAuthorDataSchema,
  PackageAuthorDataProperties,
  null
> {
  static defineSchema(): PackageAuthorDataSchema;

  constructor();
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PackageAuthorData extends PackageAuthorDataProperties {}
