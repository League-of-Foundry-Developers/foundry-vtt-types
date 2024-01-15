import type { PropertiesToSource } from "../../../types/helperTypes.d.mts";
import type { DocumentData } from "../abstract/module.d.mts";
import type * as fields from "../data/fields.d.mts";

export interface PackageAuthorDataSchema extends DocumentSchema {
  name: fields.RequiredString;
  email: fields.StringField;
  url: fields.StringField;
  discord: fields.StringField;
}

export interface PackageAuthorDataProperties {
  /** The author name */
  name: string;

  /** The author email address */
  email: string | undefined;

  /** A website url for the author */
  url: string | undefined;

  /** A Discord username for the author */
  discord: string | undefined;
}

export interface PackageAuthorDataConstructorData {
  /** The author name */
  name: string;

  /** The author email address */
  email?: string | null | undefined;

  /** A website url for the author */
  url?: string | null | undefined;

  /** A Discord username for the author */
  discord?: string | null | undefined;
}

export type PackageAuthorDataSource = PropertiesToSource<PackageAuthorDataProperties>;

/**
 * An inner data object which represents a single package author in the authors array.
 */
export declare class PackageAuthorData extends DocumentData<
  PackageAuthorDataSchema,
  PackageAuthorDataProperties,
  PackageAuthorDataSource,
  PackageAuthorDataConstructorData,
  null
> {
  constructor(data?: PackageAuthorDataConstructorData, document?: null);

  static override defineSchema(): PackageAuthorDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PackageAuthorData extends PackageAuthorDataProperties {}
