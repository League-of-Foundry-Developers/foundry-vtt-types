/**
 * Checks a package against its availability code to see if it requires a compability warning, and if so, updates the pkg
 * @param pkg - The package
 * @remarks This doesn't actually update the package, it just sets the `unavailable` and `incompatible` flags if needed.
 */
export declare function tagPackageAvailability(pkg: {
  availability: foundry.CONST.PackageAvailabilityCode;
  type: foundry.CONST.PackageTypes;
}): void;
