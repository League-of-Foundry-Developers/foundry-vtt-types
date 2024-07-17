export type { default as BasePackage } from "./base-package.d.mts";
export type { default as BaseWorld } from "./base-world.d.mts";
export type { default as BaseSystem } from "./base-system.d.mts";
export type { default as BaseModule } from "./base-module.d.mts";
export type { PackageCompatibility, RelatedPackage } from "./base-package.d.mts";

declare global {
  type PackageAuthorData =
    foundry.data.fields.SchemaField.InnerAssignmentType<foundry.packages.BasePackage.PackageAuthorSchema>;

  type PackageCompendiumData =
    foundry.data.fields.SchemaField.InnerAssignmentType<foundry.packages.BasePackage.PackageCompendiumSchema>;

  type PackageLanguageData =
    foundry.data.fields.SchemaField.InnerAssignmentType<foundry.packages.BasePackage.PackageLanguageSchema>;

  type RelatedPackage =
    foundry.data.fields.SchemaField.InnerAssignmentType<foundry.packages.BasePackage.RelatedPackageSchema>;

  /*
   * The data structure of a package manifest. This data structure is extended by BasePackage subclasses to add additional
   * type-specific fields.
   */
  interface PackageManifestData
    extends foundry.data.fields.SchemaField.InnerAssignmentType<foundry.packages.BasePackage.Schema> {}
}
