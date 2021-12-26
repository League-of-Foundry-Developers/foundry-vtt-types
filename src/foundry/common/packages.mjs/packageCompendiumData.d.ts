import { FieldReturnType, PropertiesToSource } from '../../../types/helperTypes';
import { DocumentData } from '../abstract/module.mjs';
import * as fields from '../data/fields.mjs';

interface PackageCompendiumDataSchema extends DocumentSchema {
  name: fields.RequiredString;
  label: fields.RequiredString;
  path: fields.RequiredString;
  private: FieldReturnType<fields.BooleanField, { default: false }>;
  entity: FieldReturnType<
    fields.RequiredString,
    {
      validate: (v: string) => v is foundry.CONST.COMPENDIUM_DOCUMENT_TYPES;
      validationError: 'Invalid package compendium entity type provided which must be a value in CONST.COMPENDIUM_ENTITY_TYPES';
    }
  >;
  system: fields.StringField;
}

interface PackageCompendiumDataProperties {
  /** The canonical compendium name. This should contain no spaces or special characters. */
  name: string;

  /** The human-readable compendium name. */
  label: string;

  /** The local relative path to the compendium source .db file. The filename should match the name attribute. */
  path: string;

  /** @defaultValue `false` */
  private: boolean;

  /** The specific document type that is contained within this compendium pack */
  entity: foundry.CONST.COMPENDIUM_DOCUMENT_TYPES;

  /** Denote that this compendium pack requires a specific game system to function properly. */
  system: string | undefined;
}

interface PackageCompendiumDataConstructorData {
  /** The canonical compendium name. This should contain no spaces or special characters. */
  name: string;

  /** The human-readable compendium name. */
  label: string;

  /** The local relative path to the compendium source .db file. The filename should match the name attribute. */
  path: string;

  /** @defaultValue `false` */
  private?: boolean | null | undefined;

  /** The specific document type that is contained within this compendium pack */
  entity: foundry.CONST.COMPENDIUM_DOCUMENT_TYPES;

  /** Denote that this compendium pack requires a specific game system to function properly. */
  system?: string | null | undefined;
}

/**
 * An inner data object which represents a single compendium pack definition provided by a package in the packs array.
 */
export class PackageCompendiumData extends DocumentData<
  PackageCompendiumDataSchema,
  PackageCompendiumDataProperties,
  PropertiesToSource<PackageCompendiumDataProperties>,
  PackageCompendiumDataConstructorData
> {
  /** @override */
  static defineSchema(): PackageCompendiumDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PackageCompendiumData extends PackageCompendiumDataProperties {}
