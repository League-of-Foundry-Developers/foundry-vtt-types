import type AttributeCapture from "./attribute-capture.d.mts";
/* eslint-disable @typescript-eslint/no-unused-vars */
// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names, such as SettingConfig vs. ClientSetting.SettingConfig

export {};

// These types are only used in code that users cannot access under `foundry`

type AllowedAttributeConfiguration = AttributeCapture.AllowedAttributeConfiguration;

type ManagedAttributesSpec = AttributeCapture.ManagedAttributesSpec;
