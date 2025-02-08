import { expectTypeOf } from "vitest";
import type { AnyMutableObject, AnyObject } from "fvtt-types/utils";
import type { CompendiumOwnershipField } from "../../../../src/foundry/common/packages/base-package.d.mts";
import type BaseFolder from "../../../../src/foundry/common/documents/folder.d.mts";

const basePackage = new foundry.packages.BasePackage({
  id: "foobar",
});

expectTypeOf(basePackage.availability).toEqualTypeOf<foundry.CONST.PACKAGE_AVAILABILITY_CODES>();
expectTypeOf(basePackage.locked).toEqualTypeOf<boolean>();
expectTypeOf(basePackage.exclusive).toEqualTypeOf<boolean>();
expectTypeOf(basePackage.owned).toEqualTypeOf<boolean>();
expectTypeOf(basePackage.tags).toEqualTypeOf<string[]>();
expectTypeOf(basePackage.type).toEqualTypeOf<foundry.CONST.PACKAGE_TYPES>();
expectTypeOf(basePackage.unavailable).toEqualTypeOf<boolean>();

declare const modules: Collection<Module>;
expectTypeOf(basePackage._testRequiredDependencies(modules)).toEqualTypeOf<Promise<boolean>>();

declare const systems: Collection<System>;
expectTypeOf(basePackage._testSupportedSystems(systems)).toEqualTypeOf<Promise<boolean>>();

expectTypeOf(foundry.packages.BasePackage.type).toEqualTypeOf<foundry.CONST.PACKAGE_TYPES>();

declare const availability: foundry.CONST.PACKAGE_AVAILABILITY_CODES;
expectTypeOf(foundry.packages.BasePackage.isIncompatibleWithCoreVersion(availability)).toEqualTypeOf<boolean>();
expectTypeOf(foundry.packages.BasePackage.collection).toEqualTypeOf<"worlds" | "systems" | "modules">();
expectTypeOf(foundry.packages.BasePackage.defineSchema()).toEqualTypeOf<foundry.packages.BasePackage.Schema>();
expectTypeOf(
  foundry.packages.BasePackage.testAvailability({}, {}),
).toEqualTypeOf<foundry.CONST.PACKAGE_AVAILABILITY_CODES>();

declare const packageCompatibility: foundry.packages.PackageCompatibility;
expectTypeOf(
  foundry.packages.BasePackage.testDependencyCompatibility(packageCompatibility, basePackage),
).toEqualTypeOf<boolean>();
expectTypeOf(foundry.packages.BasePackage.cleanData()).toEqualTypeOf<AnyObject>();
expectTypeOf(foundry.packages.BasePackage.validateId("")).toEqualTypeOf<void>();
expectTypeOf(foundry.packages.BasePackage.migratedKeys).toEqualTypeOf<Set<string>>();
expectTypeOf(foundry.packages.BasePackage.migrateData({})).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(foundry.packages.BasePackage.fromRemoteManifest("", { strict: true })).toEqualTypeOf<Promise<never>>();

const packageCompendia: foundry.data.fields.SchemaField.InnerInitializedType<{ ownership: CompendiumOwnershipField }> =
  {
    ownership: {
      ASSISTANT: "OBSERVER",
      // @ts-expect-error Foobar is not a valid value
      PLAYER: "foobar",
    },
  };

expectTypeOf(packageCompendia.ownership.ASSISTANT).toEqualTypeOf<
  keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | undefined
>;

expectTypeOf(basePackage.id).toEqualTypeOf<string>();
expectTypeOf(basePackage.changelog).toEqualTypeOf<string | undefined>();

// Checking the sets
expectTypeOf(basePackage._source.packs[0].banner).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage._source.authors[0].discord).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.languages.first()!.lang).toEqualTypeOf<string>();

// Checking packFolders
expectTypeOf(basePackage.packFolders.first()!.name).toEqualTypeOf<string>();
expectTypeOf(
  basePackage.packFolders.first()!.folders.first()!.folders.first()!.folders.first()!.name,
).toEqualTypeOf<string>();
// @ts-expect-error Folders property does not exist this deep
basePackage.packFolders.first()!.folders.first()!.folders.first()!.folders.first()!.folders;

// schema fields
type OptionalString = string | undefined;
expectTypeOf(basePackage.id).toEqualTypeOf<string>();
expectTypeOf(basePackage.title).toEqualTypeOf<string>();
expectTypeOf(basePackage.description).toEqualTypeOf<string>();

expectTypeOf(basePackage.authors.first()!.name).toEqualTypeOf<string>();
expectTypeOf(basePackage.authors.first()!.email).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.authors.first()!.url).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.authors.first()!.discord).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.authors.first()!.flags).toEqualTypeOf<AnyObject>();

expectTypeOf(basePackage.url).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.license).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.readme).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.bugs).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.changelog).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.flags).toEqualTypeOf<AnyObject>();

expectTypeOf(basePackage.media.first()!.type).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.media.first()!.url).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.media.first()!.caption).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.media.first()!.loop).toEqualTypeOf<boolean>();
expectTypeOf(basePackage.media.first()!.thumbnail).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.media.first()!.flags).toEqualTypeOf<AnyObject>();

expectTypeOf(basePackage.compatibility.minimum).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.compatibility.verified).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.compatibility.maximum).toEqualTypeOf<OptionalString>();

expectTypeOf(basePackage.scripts).toEqualTypeOf<Set<string>>();
expectTypeOf(basePackage.esmodules).toEqualTypeOf<Set<string>>();
expectTypeOf(basePackage.styles).toEqualTypeOf<Set<string>>();

expectTypeOf(basePackage.languages.first()!.lang).toEqualTypeOf<string>();
expectTypeOf(basePackage.languages.first()!.name).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.languages.first()!.path).toEqualTypeOf<string>();
expectTypeOf(basePackage.languages.first()!.system).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.languages.first()!.module).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.languages.first()!.flags).toEqualTypeOf<AnyObject>();

expectTypeOf(basePackage.packs.first()!.name).toEqualTypeOf<string>();
expectTypeOf(basePackage.packs.first()!.label).toEqualTypeOf<string>();
expectTypeOf(basePackage.packs.first()!.banner).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.packs.first()!.path).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.packs.first()!.type).toEqualTypeOf<foundry.CONST.COMPENDIUM_DOCUMENT_TYPES>();

expectTypeOf(basePackage.packFolders.first()!.name).toEqualTypeOf<string>();
expectTypeOf(basePackage.packFolders.first()!.sorting).toEqualTypeOf<
  (typeof BaseFolder.SORTING_MODES)[number] | undefined
>();
expectTypeOf(basePackage.packFolders.first()!.color).toEqualTypeOf<Color | undefined | null>();

expectTypeOf(basePackage.packFolders.first()!.packs).toEqualTypeOf<Set<string>>();

expectTypeOf(basePackage.relationships.systems.first()!.id).toEqualTypeOf<string>();
expectTypeOf(basePackage.relationships.systems.first()!.type).toEqualTypeOf<"system">();
expectTypeOf(basePackage.relationships.systems.first()!.manifest).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.relationships.systems.first()!.compatibility.minimum).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.relationships.systems.first()!.compatibility.verified).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.relationships.systems.first()!.compatibility.maximum).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.relationships.systems.first()!.reason).toEqualTypeOf<string | undefined>();

expectTypeOf(basePackage.relationships.requires.first()!.id).toEqualTypeOf<string>();
expectTypeOf(basePackage.relationships.requires.first()!.type).toEqualTypeOf<
  (typeof foundry.CONST.PACKAGE_TYPES)[number]
>();
expectTypeOf(basePackage.relationships.requires.first()!.manifest).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.relationships.requires.first()!.compatibility.minimum).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.relationships.requires.first()!.compatibility.verified).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.relationships.requires.first()!.compatibility.maximum).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.relationships.requires.first()!.reason).toEqualTypeOf<string | undefined>();

expectTypeOf(basePackage.relationships.recommends.first()!.id).toEqualTypeOf<string>();
expectTypeOf(basePackage.relationships.recommends.first()!.type).toEqualTypeOf<
  (typeof foundry.CONST.PACKAGE_TYPES)[number]
>();
expectTypeOf(basePackage.relationships.recommends.first()!.manifest).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.relationships.recommends.first()!.compatibility.minimum).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.relationships.recommends.first()!.compatibility.verified).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.relationships.recommends.first()!.compatibility.maximum).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.relationships.recommends.first()!.reason).toEqualTypeOf<string | undefined>();

expectTypeOf(basePackage.relationships.conflicts.first()!.id).toEqualTypeOf<string>();
expectTypeOf(basePackage.relationships.conflicts.first()!.type).toEqualTypeOf<
  (typeof foundry.CONST.PACKAGE_TYPES)[number]
>();
expectTypeOf(basePackage.relationships.conflicts.first()!.manifest).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.relationships.conflicts.first()!.compatibility.minimum).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.relationships.conflicts.first()!.compatibility.verified).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.relationships.conflicts.first()!.compatibility.maximum).toEqualTypeOf<string | undefined>();
expectTypeOf(basePackage.relationships.conflicts.first()!.reason).toEqualTypeOf<string | undefined>();

expectTypeOf(basePackage.relationships.flags).toEqualTypeOf<AnyObject>();

expectTypeOf(basePackage.relationships.systems.first()!.reason).toEqualTypeOf<string | undefined>();

expectTypeOf(basePackage.socket).toEqualTypeOf<boolean>();
expectTypeOf(basePackage.manifest).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.download).toEqualTypeOf<OptionalString>();
expectTypeOf(basePackage.protected).toEqualTypeOf<boolean>();
expectTypeOf(basePackage.exclusive).toEqualTypeOf<boolean>();
expectTypeOf(basePackage.persistentStorage).toEqualTypeOf<boolean>();
