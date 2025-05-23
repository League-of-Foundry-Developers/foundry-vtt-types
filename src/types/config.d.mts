// This is an issue only on Windows. It's worked around in this weird way to avoid ESLint
// whining about an unused disable.

import type { InterfaceToObject, MustConform } from "#utils";
import * as configuration from "#configuration";

declare global {
  interface AssumeHookRan extends configuration.AssumeHookRan {}
  interface DocumentClassConfig extends configuration.DocumentClassConfig {}
  interface PlaceableObjectClassConfig extends configuration.PlaceableObjectClassConfig {}
  interface DataConfig extends configuration.DataConfig {}
  interface GetDataConfig extends configuration.GetDataConfig {}
  interface DataModelConfig extends configuration.DataModelConfig {}
  interface SourceConfig extends configuration.SourceConfig {}
  interface FlagConfig extends configuration.FlagConfig {}
  interface WebRTCConfig extends configuration.WebRTCConfig {}
  interface ModuleConfig extends configuration.ModuleConfig {}
  interface RequiredModules extends configuration.RequiredModules {}
  interface SettingConfig extends configuration.SettingConfig {}
}

type ValidDataModel = {
  readonly [DocumentName in foundry.abstract.Document.SystemType]?: {
    // Recommended to be a TypeDataModel subclass but DataModel is also technically valid.
    readonly [DocumentType in string]?: foundry.abstract.DataModel.AnyConstructor;
  };
};

type MustBeValid<T extends ValidDataModel> = T;

type _TestValidDataModelConfig = MustConform<DataModelConfig, ValidDataModel>;

interface ValidSettingConfig {
  readonly [K: string]: ClientSettings.Type;
}

type _TestValidSettingConfig = MustConform<InterfaceToObject<SettingConfig>, ValidSettingConfig>;
