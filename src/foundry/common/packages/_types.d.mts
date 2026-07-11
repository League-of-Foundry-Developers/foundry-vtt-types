import type { PackageCompendiumFolder, PackageRelationships } from "#common/packages/base-package.d.mts";

/* eslint-disable @typescript-eslint/no-unused-vars */

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names, such as SettingConfig vs. ClientSetting.SettingConfig

export {};

type PackageAuthorData = foundry.packages.BasePackage.AuthorData;

type CompendiumArtFlag = foundry.packages.BasePackage.Flags.CompendiumArtFlag;

type PackageFlagsData = foundry.packages.BasePackage.Flags.Core;

type PackageMediaData = foundry.packages.BasePackage.MediaData;

type PackageCompendiumData = foundry.packages.BasePackage.CompendiumData;

type PackFolderData = PackageCompendiumFolder.Data;

type PackageLanguageData = foundry.packages.BasePackage.LanguageData;

type RelatedPackageData = foundry.packages.RelatedPackage.Data;

type PackageCompatibilityData = foundry.packages.PackageCompatibility.Data;

type PackageRelationshipsData = PackageRelationships.Data;

type PackageManifestData = foundry.packages.BasePackage.ManifestData;

type ServerSanitizationFields = foundry.packages.AdditionalTypesField.ServerSanitizationFields;

type DocumentTypesConfiguration = foundry.packages.AdditionalTypesField.DocumentTypesConfiguration;

type SystemManifestData = foundry.packages.System.ManifestData;

type ModuleManifestData = foundry.packages.Module.ManifestData;

type WorldManifestData = foundry.packages.World.ManifestData;
