declare interface Package {
  error: any
  isSupported: boolean
  isUpgrade: boolean
  manifest: any
  minimumCoreVersion: string
  name: string
}

declare interface PackageSelector {
  /**
   * The package manifest URL
   */
  manifest: string

  /**
   * The canonical package name
   */
  name: string

  /**
   * The package type, one in ['module', 'system', 'world']
   * @defaultValue `'module'`
   */
  type: string
}

/**
 * A library of package management commands which are used by various interfaces around the software.
 */
declare class SetupConfiguration {
  /**
   * A reference to the setup URL used under the current route prefix, if any
   */
  static get setupURL (): string

  /**
   * Check with the server whether a package of a certain type is able to be
   * installed or updated.
   * @param selector - (default: `{}`)
   * @param type - The package type to check
   *               (default: `'module'`)
   * @param name - The package name to check
   *               (default: `null`)
   * @param manifest - The manifest URL to check
   *                   (default: `null`)
   * @returns The return manifest
   */
  static checkPackage (selector: PackageSelector): Promise<Package>

  /**
   * Return the named scopes which can exist for packages.
   * Scopes are returned in the prioritization order that their content is
   * loaded.
   * @returns An array of string package scopes
   */
  static getPackageScopes (): string[]

  /**
   * Get an Array of available packages of a given type which may be installed
   * @param options - (default: `{}`)
   * @param type - (default: `'system'`)
   */
  static getPackages (options: { type: string }): Promise<Package[]>

  /**
   * Install a set of dependency modules which are required by an installed
   * package
   * @param pkg - The package which was installed that requested dependencies
   */
  static installDependencies (pkg: object): Promise<void>

  /**
   * Install a Package
   * @param selector - (default: `{}`)
   * @param type - The type of package being installed,
   *               in ["module", "system", "world"]
   *               (default: `'module'`)
   * @param name - The canonical package name
   *               (default: `null`)
   * @param manifest - The package manifest URL
   *                   (default: `null`)
   * @returns A Promise which resolves to the installed package manifest
   */
  static installPackage (selector: PackageSelector): Promise<object>

  /**
   * A helper method to submit a POST request to setup configuration with a
   * certain body, returning the JSON response
   * @param body - The request body to submit
   * @returns The response body
   * @internal
   */
  static post (body: object): Promise<object>

  /**
   * Uninstall a single Package by name and type.
   * @param options - (default: `{}`)
   * @param type - The type of package being installed,
   *               in ["module", "system", "world"]
   *               (default: `'module'`)
   * @param name - The canonical package name
   *               (default: `null`)
   * @returns A Promise which resolves to the uninstalled package manifest
   */
  static uninstallPackage (
    options: {
      name: string
      type: string
    }
  ): Promise<object>
}
