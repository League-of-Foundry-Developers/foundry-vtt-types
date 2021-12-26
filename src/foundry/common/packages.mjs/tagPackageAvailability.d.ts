/**
 * Checks a package against its availability code to see if it requires a compability warning, and if so, updates the pkg
 * @param pkg - The package
 * @remarks This doesn't actually update the package, it just sets the `unavailable` and `incompatible` properties if needed.
 */
export declare function tagPackageAvailability(pkg: {
  availability: foundry.CONST.PACKAGE_AVAILABILITY_CODES;
  type: foundry.CONST.PACKAGE_TYPES;
}): void;
