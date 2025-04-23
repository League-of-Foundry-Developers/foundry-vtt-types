// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

import type { SchemaField } from "../data/fields.d.mts";

export { default as BasePackage } from "./base-package.mjs";
export { default as BaseWorld } from "./base-world.mjs";
export { default as BaseSystem } from "./base-system.mjs";
export { default as BaseModule } from "./base-module.mjs";
export { PackageCompatibility, RelatedPackage } from "./base-package.mjs";

declare global {
  type PackageAuthorData = SchemaField.InnerAssignmentType<foundry.packages.BasePackage.PackageAuthorSchema>;

  type PackageCompendiumData = SchemaField.InnerAssignmentType<foundry.packages.BasePackage.PackageCompendiumSchema>;

  type PackageLanguageData = SchemaField.InnerAssignmentType<foundry.packages.BasePackage.PackageLanguageSchema>;

  type RelatedPackage = SchemaField.InnerAssignmentType<foundry.packages.BasePackage.RelatedPackageSchema>;

  /*
   * The data structure of a package manifest. This data structure is extended by BasePackage subclasses to add additional
   * type-specific fields.
   */
  interface PackageManifestData extends SchemaField.InnerAssignmentType<foundry.packages.BasePackage.Schema> {}
}
