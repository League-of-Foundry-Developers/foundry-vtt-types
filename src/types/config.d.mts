// This is an issue only on Windows. It's worked around in this weird way to avoid ESLint
// whining about an unused disable.
/* eslint import-x/no-unresolved: [2, { ignore: ["fvtt-types/configuration"] }] */

import type { InterfaceToObject, MustConform } from "fvtt-types/utils";

// eslint-disable-next-line import-x/extensions
import * as configuration from "fvtt-types/configuration";

declare global {
  export import AssumeHookRan = configuration.AssumeHookRan;
  export import DocumentClassConfig = configuration.DocumentClassConfig;
  export import PlaceableObjectClassConfig = configuration.PlaceableObjectClassConfig;
  export import DataConfig = configuration.DataConfig;
  export import GetDataConfig = configuration.GetDataConfig;
  export import DataModelConfig = configuration.DataModelConfig;
  export import SourceConfig = configuration.SourceConfig;
  export import FlagConfig = configuration.FlagConfig;
  export import WebRTCConfig = configuration.WebRTCConfig;
  export import ModuleConfig = configuration.ModuleConfig;
  export import RequiredModules = configuration.RequiredModules;
  export import SettingConfig = configuration.SettingConfig;
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
