// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names, such as SettingConfig vs. ClientSetting.SettingConfig

import type CombatConfiguration from "./combat-config.d.mts";
import type CalendarData from "./calendar.d.mts";

type CombatConfigurationData = CombatConfiguration.Data;
type CalendarConfig = CalendarData.CreateData;
type CalendarConfigYears = CalendarData.ConfigYears.CreateData;
type CalendarConfigLeapYear = CalendarData.ConfigLeapYear.CreateData;
type CalendarConfigMonths = CalendarData.ConfigMonths.CreateData;
type CalendarConfigMonth = CalendarData.ConfigMonth.CreateData;
type CalendarConfigDays = CalendarData.ConfigDays.CreateData;
type CalendarConfigDay = CalendarData.ConfigDay.CreateData;
type CalendarConfigSeasons = CalendarData.ConfigSeasons.CreateData;
type CalendarConfigSeason = CalendarData.ConfigSeason.CreateData;
type TimeComponents = CalendarData.TimeComponents;
type TimeFormatter = CalendarData.TimeFormatter;
