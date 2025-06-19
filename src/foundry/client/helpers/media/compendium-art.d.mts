import type { SchemaField } from "#common/data/fields.d.mts";
import type { Identity } from "#utils";
import type { PrototypeToken } from "../../data/_module.d.mts";

/**
 * A class responsible for managing package-provided art and applying it to Documents in compendium packs.
 */
declare class CompendiumArt extends Map<string, CompendiumArt.Info> {
  /**
   * @remarks
   * @throws "You may not re-initialize the singleton {@linkcode CompendiumArt}. Use {@linkcode game.compendiumArt} instead."
   */
  constructor(iterable?: Iterable<[string, CompendiumArt.Info]> | null);

  /**
   * The key for the package manifest flag used to store the mapping information.
   * @defaultValue `"compendiumArtMappings"`
   */
  FLAG: string;

  /**
   * The key for the setting used to store the World's art preferences.
   * @defaultValue `"compendiumArtConfiguration"`
   */
  SETTING: string;

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
  protected _registerArt(): Promise<void>;

  #CompendiumArt: true;
}

declare namespace CompendiumArt {
  interface Any extends AnyCompendiumArt {}
  interface AnyConstructor extends Identity<typeof CompendiumArt> {}

  interface Info {
    /**
     * The path to the Actor's portrait image.
     */
    actor?: string | undefined;

    /**
     * The path to the token image, or an object to merge into the Actor's prototype token.
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
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
    credit: string | undefined;

    /**
     * The package's user-configured priority.
     */
    priority: number;
  }
}

export default CompendiumArt;

declare abstract class AnyCompendiumArt extends CompendiumArt {
  constructor(...args: never);
}
