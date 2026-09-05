import type { SchemaField } from "#common/data/fields.d.mts";
import type { AnyMutableObject, Identity } from "#utils";
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
   * @remarks This is typed as a literal because it is a core setting key, and so needs to be passable to {@linkcode game.settings.get}.
   */
  SETTING: "compendiumArtConfiguration";

  /**
   * Whether art application is enabled. This should be switched off when performing client-side compendium migrations
   * in order to avoid persisting injected data.
   * @defaultValue `true`
   */
  enabled: boolean;

  /**
   * Apply any art configured for a Document to its source data as it is initialized from a compendium pack.
   * @param documentClass - The class of the Document being initialized.
   * @param source        - The Document's source data.
   * @param packId        - The ID of the compendium pack the Document is initialized from.
   * @returns The Document's source data.
   * @remarks Returns `source` unchanged, without calling the `applyCompendiumArt` hook, if
   * {@linkcode CompendiumArt.enabled | #enabled} is `false`, if `source` has no `_id`, or if `packId` names a pack of
   * a different Document type.
   */
  applyArt(
    documentClass: foundry.abstract.Document.AnyConstructor,
    source: AnyMutableObject,
    packId?: string,
  ): AnyMutableObject;

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
  interface AnyConstructor extends Identity<typeof AnyCompendiumArt> {}

  interface Info {
    /**
     * The path to the Document's image.
     */
    img?: string | undefined;

    /**
     * @remarks Not part of Foundry's `CompendiumArtInfo` typedef. Foundry's own words:
     * "The actor key is an alias of img, retained for backwards compatibility, and kept populated for consumers
     * which still rely on it."
     */
    actor?: string | undefined;

    /**
     * The path to the token image, or an object to merge into the Actor's prototype token.
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    token?: string | SchemaField.AssignmentData<PrototypeToken.Schema> | undefined;

    /**
     * An optional credit string for use by the game system to apply in an appropriate place.
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
