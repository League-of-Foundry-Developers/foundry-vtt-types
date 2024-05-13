import type { BasePackage } from "./base-package.mts";

export { default as BasePackage } from "./base-package.mts";
export { default as BaseWorld } from "./base-world.mts";
export { default as BaseSystem } from "./base-system.mts";
export { default as BaseModule } from "./base-module.mts";
export { PackageCompatibility, RelatedPackage } from "./base-package.mts";

declare global {
  type PackageAuthorData = foundry.data.fields.SchemaField.InnerAssignmentType<BasePackage.PackageAuthorSchema>;

  type PackageCompendiuMData = foundry.data.fields.SchemaField.InnerAssignmentType<BasePackage.PackageCompendiumSchema>;

  type PackageLanguageData = foundry.data.fields.SchemaField.InnerAssignmentType<BasePackage.PackageLanguageSchema>;

  type RelatedPackage = foundry.data.fields.SchemaField.InnerAssignmentType<BasePackage.RelatedPackageSchema>;
  /*
   * The data structure of a package manifest. This data structure is extended by BasePackage subclasses to add additional
   * type-specific fields.
   */
  interface PackageManifestData extends foundry.data.fields.SchemaField.InnerAssignmentType<BasePackage.Schema> {}
}
