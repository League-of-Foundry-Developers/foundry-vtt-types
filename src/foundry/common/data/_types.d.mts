/* eslint-disable @typescript-eslint/no-unused-vars */
import type { fields } from "./_module.d.mts";

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names, such as SettingConfig vs. ClientSetting.SettingConfig

// TODO: Stubs
export {};

type DataFieldValidator = fields.DataField.Validator<fields.DataField.Any, unknown>;

type DataFieldOptions = fields.DataField.Options.Any;

type DataFieldContext = fields.DataField.ConstructionContext;

type FormGroupConfig = unknown;

type FormInputConfig = unknown;

type StringFieldInputConfig = unknown;

type CodeMirrorLanguage = unknown;

type CodeMirrorInputConfig = unknown;

type LightAnimationData = unknown;

type NumberFieldOptions = fields.NumberField.Options;

type StringFieldOptions = fields.StringField.Options;

type ChoiceInputConfig = unknown;

type ArrayFieldOptions = fields.ArrayField.Options<unknown>;

type DocumentUUIDFieldOptions = fields.DocumentUUIDField.Options;

type FilePathFieldOptions = fields.FilePathField;

type DocumentFlags = Record<string, Record<string, unknown>>;

type DocumentStats = fields.DocumentStatsField.Data;

type JavaScriptFieldOptions = fields.JavaScriptField.Options;

type ElementValidationFailure = unknown;
