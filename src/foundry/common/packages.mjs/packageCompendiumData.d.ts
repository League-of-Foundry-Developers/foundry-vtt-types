import { FieldReturnType, PropertiesToSource } from '../../../types/helperTypes';
import { DocumentData } from '../abstract/module.mjs';
import * as fields from '../data/fields.mjs';

interface PackageCompendiumDataSchema extends DocumentSchema {
  name: typeof fields.REQUIRED_STRING;
  label: typeof fields.REQUIRED_STRING;
  path: typeof fields.REQUIRED_STRING;
  private: FieldReturnType<
    typeof fields.BOOLEAN_FIELD,
    {
      default: false;
    }
  >;
  entity: FieldReturnType<
    typeof fields.REQUIRED_STRING,
    {
      validate: (v: string) => v is foundry.CONST.CompendiumEntityType;
      validationError: 'Invalid package compendium entity type provided which must be a value in CONST.COMPENDIUM_ENTITY_TYPES';
    }
  >;
  system: typeof fields.STRING_FIELD;
}

interface PackageCompendiumDataProperties {
  /** The canonical compendium name. This should contain no spaces or special characters. */
  name: string;

  /** The human-readable compendium name. */
  label: string;

  /** The local relative path to the compendium source .db file. The filename should match the name attribute. */
  path: string;

  private: boolean;

  /** The specific document type that is contained within this compendium pack */
  entity: foundry.CONST.CompendiumEntityType;

  /** Denote that this compendium pack requires a specific game system to function properly. */
  system?: string;
}

interface PackageCompendiumDataConstructorData {
  /** The canonical compendium name. This should contain no spaces or special characters. */
  name: string;

  /** The human-readable compendium name. */
  label: string;

  /** The local relative path to the compendium source .db file. The filename should match the name attribute. */
  path: string;

  private?: boolean | null;

  /** The specific document type that is contained within this compendium pack */
  entity: foundry.CONST.CompendiumEntityType;

  /** Denote that this compendium pack requires a specific game system to function properly. */
  system?: string;
}

/**
 * An inner data object which represents a single compendium pack definition provided by a package in the packs array.
 */
export declare class PackageCompendiumData extends DocumentData<
  PackageCompendiumDataSchema,
  PackageCompendiumDataProperties,
  PropertiesToSource<PackageCompendiumDataProperties>,
  PackageCompendiumDataConstructorData
> {
  static defineSchema(): PackageCompendiumDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface PackageCompendiumData extends PackageCompendiumDataProperties {}
