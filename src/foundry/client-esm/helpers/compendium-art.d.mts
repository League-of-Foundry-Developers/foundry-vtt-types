import type { SchemaField } from "../../common/data/fields.d.mts";
import type { PrototypeToken } from "../data/_module.d.mts";

/**
 * A class responsible for managing package-provided art and applying it to Documents in compendium packs.
 */
declare class CompendiumArt extends Map<string, CompendiumArt.Info> {
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
  getPackages(): CompendiumArt.Descriptor[];

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
  #parseArtMapping(packageId: string, mapping: CompendiumArt.Mapping, credit?: string): Promise<void>;
}

declare namespace CompendiumArt {
  interface Info {
    /**
     * The path to the Actor's portrait image.
     */
    actor?: string | undefined;

    /**
     * The path to the token image, or an object to merge into the Actor's prototype token.
     */
    token?: string | SchemaField.AssignmentData<PrototypeToken.Schema> | undefined;

    /**
     *An optional credit string for use by the game system to apply in an appropriate place.
     */
    credit?: string | undefined;
  }

  /**
   * A mapping of compendium pack IDs to Document IDs to art information.
   */
  type Mapping = Record<string, Record<string, Info>>;

  interface Descriptor {
    /**
     * The ID of the package providing the art.
     */
    packageId: string;

    /**
     * The title of the package providing the art.
     */
    title: string;

    /**
     * The path to the art mapping file.
     */
    mapping: string;

    /**
     * An optional credit string for use by the game system to apply in an appropriate place.
     */
    credit?: string | undefined;

    /**
     * The package's user-configured priority.
     */
    priority: number;
  }
}

export default CompendiumArt;
