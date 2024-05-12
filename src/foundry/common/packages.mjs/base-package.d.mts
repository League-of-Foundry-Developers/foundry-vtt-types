import DataModel from "../abstract/data.mjs";
import * as fields from "../data/fields.mjs";

// TODO: Figure out the specifics
/**
 * A custom SchemaField for defining package compatibility versions.
 * @property {string} minimum     The Package will not function before this version
 * @property {string} verified    Verified compatible up to this version
 * @property {string} maximum     The Package will not function after this version
 */
export class PackageCompatibility extends fields.SchemaField {}

/**
 * A custom SchemaField for defining package relationships.
 * @property {RelatedPackage[]} systems     Systems that this Package supports
 * @property {RelatedPackage[]} requires    Packages that are required for base functionality
 * @property {RelatedPackage[]} recommends  Packages that are recommended for optimal functionality
 */
export class PackageRelationships extends fields.SchemaField {}

/**
 * A custom SchemaField for defining a related Package.
 * It may be required to be a specific type of package, by passing the packageType option to the constructor.
 */
export class RelatedPackage extends fields.SchemaField {}

/**
 * A custom SchemaField for defining the folder structure of the included compendium packs.
 */
export class PackageCompendiumFolder extends fields.SchemaField {}

/**
 * A special ObjectField which captures a mapping of USER_ROLES to DOCUMENT_OWNERSHIP_LEVELS.
 */
export class CompendiumOwnershipField extends fields.ObjectField {}

/**
 * A special SetField which provides additional validation and initialization behavior specific to compendium packs.
 */
export class PackageCompendiumPacks extends fields.SetField {}

// TODO: Implement Schema
/**
 * The data schema used to define a Package manifest.
 * Specific types of packages extend this schema with additional fields.
 */
export default class BasePackage extends DataModel<fields.SchemaField.Any, null> {}
