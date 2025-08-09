// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names, such as SettingConfig vs. ClientSetting.SettingConfig

import type CombatConfiguration from "./combat-config.d.mts";

type CombatConfigurationData = CombatConfiguration.Data;
type CalendarConfig = unknown;
type CalendarConfigYears = unknown;
type CalendarConfigLeapYear = unknown;
type CalendarConfigMonths = unknown;
type CalendarConfigMonth = unknown;
type CalendarConfigDays = unknown;
type CalendarConfigDay = unknown;
type CalendarConfigSeasons = unknown;
type CalendarConfigSeason = unknown;
type TimeComponents = unknown;
type TimeFormatter = unknown;
