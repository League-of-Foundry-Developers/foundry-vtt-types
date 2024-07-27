import type { CompendiumArtDescriptor, CompendiumArtInfo, CompendiumArtMapping } from "./_types.d.mts";

/**
 * A class responsible for managing package-provided art and applying it to Documents in compendium packs.
 */
declare class CompendiumArt extends Map<string, CompendiumArtInfo> {
  /**
   * The key for the package manifest flag used to store the mapping information.
   * @defaultValue `"compendiumArtMappings"`
   */
  readonly FLAG: string;

  /**
   * The key for the setting used to store the World's art preferences.
   * @defaultValue `"compendiumArtConfiguration"`
   */
  readonly SETTING: string;

  /**
   * Whether art application is enabled. This should be switched off when performing client-side compendium migrations
   * in order to avoid persisting injected data.
   * @defaultValue `true`
   */
  enabled: boolean;

  /**
   * Retrieve all active packages that provide art mappings in priority order.
   */
  getPackages(): CompendiumArtDescriptor[];

  /**
   * Collate Document art mappings from active packages.
   * @internal
   */
  _registerArt(): Promise<void>;

  /**
   * Parse a provided art mapping and store it for reference later, and update compendium indices to use the provided
   * art.
   * @param packageId - The ID of the package providing the mapping.
   * @param mapping   - The art mapping information provided by the package.
   * @param credit    - An optional credit string for use by the game system to apply in an appropriate place.
   */
  #parseArtMapping(packageId: string, mapping: CompendiumArtMapping, credit?: string): Promise<void>;
}

export default CompendiumArt;
