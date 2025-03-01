import type DataModel from "../../common/abstract/data.d.mts";
import type * as fields from "../../common/data/fields.mjs";

declare namespace CalendarData {
  interface Schema extends foundry.data.fields.DataSchema {
    /** The name of the calendar being used. */
    name: fields.StringField<{ required: true; blank: false }>;
    /** A text description of the calendar configuration. */
    description: fields.StringField;
    /** Configuration of years. */
    years: fields.SchemaField<
      {
        /** The year which is considered year 0 in the calendar. */
        yearZero: fields.NumberField<{ required: true; nullable: false; integer: true }>;
        /** The day of the week that the first day of year zero falls on. */
        firstWeekday: fields.NumberField<{ required: true; nullable: false; min: 1; integer: true }>;
        /** A definition of how leap years work within a calendar. */
        leapYear: fields.SchemaField<
          {
            /** The year number of the first leap year. On or after yearZero. */
            leapStart: fields.NumberField<{ required: true; nullable: false; integer: true }>;
            /** The number of years between leap years. */
            leapInterval: fields.NumberField<{ required: true; nullable: false; min: 1; integer: true }>;
          },
          { required: true; nullable: true; initial: null }
        >;
      },
      { required: true; nullable: true; initial: null }
    >;
    /** Configuration of months. */
    months: fields.SchemaField<
      {
        /** An array of months in the calendar year. */
        values: fields.ArrayField<
          fields.SchemaField<{
            /** The full name of the month. */
            name: fields.StringField<{ required: true; blank: false }>;
            /** The abbreviated name of the month. */
            abbreviation: fields.StringField;
            /** The ordinal position of this month in the year. */
            ordinal: fields.NumberField<{ required: true; nullable: false; min: 1; integer: true }>;
            /** The number of days in the month. */
            days: fields.NumberField<{ required: true; nullable: false }>;
            /** The number of days in the month during a leap year. If not defined the value of days is used. */
            leapDays: fields.NumberField<{ required: false; nullable: true }>;
            /** The amount to offset day numbers for this month. */
            dayOffset: fields.NumberField<{ required: true; nullable: true; min: 0; integer: true }>;
            /** If this month is an intercalary month. */
            intercalary: fields.BooleanField<{ initial: false }>;
            /**
             * The day of the week this month should always start on.
             * If the value is null the month will start on the next weekday after the previous month.
             */
            startingWeekday: fields.NumberField<{ required: false; nullable: true }>;
          }>
        >;
      },
      { required: true; nullable: true; initial: null }
    >;
    /** Configuration of days. */
    days: fields.SchemaField<{
      /** The configuration of the days of the week. */
      values: fields.ArrayField<
        fields.SchemaField<{
          /** The full name of the weekday. */
          name: fields.StringField<{ required: true; blank: false }>;
          /** The abbreviated name of the weekday. */
          abbreviation: fields.StringField;
          /** The ordinal position of this weekday in the week. */
          ordinal: fields.NumberField<{ required: true; nullable: false; min: 1; integer: true }>;
          /** Is this weekday considered a rest day (weekend)? */
          isRestDay: fields.BooleanField<{ required: false; nullable: false; initial: false }>;
        }>,
        { required: true; nullable: false }
      >;
      /** The number of hours in a day. */
      hoursPerDay: fields.NumberField<{ required: true; nullable: false; positive: true }>;
      /** The number of minutes in an hour. */
      minutesPerHour: fields.NumberField<{ required: true; nullable: false; positive: true }>;
      /** The number of seconds in a minute. */
      secondsPerMinute: fields.NumberField<{ required: true; nullable: false; positive: true }>;
    }>;
    /** Configuration of seasons. */
    seasons: fields.SchemaField<
      {
        /** An array of seasons in the calendar year. */
        values: fields.ArrayField<
          fields.SchemaField<{
            /** The full name of the season. */
            name: fields.StringField<{ required: true; blank: false }>;
            /** The abbreviated name of the season. */
            abbreviation: fields.StringField;
            /** The ordinal month in which the season starts. */
            startMonth: fields.NumberField<{ required: true; nullable: true; min: 0; integer: true }>;
            /** The day of the month on which the season starts. */
            startDay: fields.NumberField<{ required: true; nullable: true; min: 0; integer: true }>;
            /** The ordinal month in which the season ends. */
            endMonth: fields.NumberField<{ required: true; nullable: true; min: 0; integer: true }>;
            /** The day of the month on which the season ends. */
            endDay: fields.NumberField<{ required: true; nullable: true; min: 0; integer: true }>;
          }>
        >;
      },
      { required: true; nullable: true; initial: null }
    >;
  }

  type Config = fields.SchemaField.AssignmentType<Schema>;

  /** A definition of a year within a calendar. */
  type ConfigYears = fields.SchemaField.AssignmentType<Schema["years"]["fields"]>;

  /** A definition of how leap years work within a calendar. */
  type ConfigLeapYear = NonNullable<fields.SchemaField.AssignmentType<Schema["years"]["fields"]["leapYear"]["fields"]>>;

  /** Month related configuration for a calendar. */
  type ConfigMonths = fields.SchemaField.AssignmentType<Schema["months"]["fields"]>;

  /** A definition of a month within a calendar year. */
  type ConfigMonth = NonNullable<
    fields.SchemaField.AssignmentType<Schema["months"]["fields"]["values"]["element"]["fields"]>
  >;

  /** Day related configuration for a calendar. */
  type ConfigDays = fields.SchemaField.AssignmentType<Schema["days"]["fields"]>;

  /** A definition of the days of the week within a calendar. */
  type ConfigDay = NonNullable<
    fields.SchemaField.AssignmentType<Schema["days"]["fields"]["values"]["element"]["fields"]>
  >;

  /** Season related configuration for a calendar. */
  type ConfigSeasons = fields.SchemaField.AssignmentType<Schema["seasons"]["fields"]>;

  /** A definition of a season within a calendar year. */
  type ConfigSeason = NonNullable<
    fields.SchemaField.AssignmentType<Schema["seasons"]["fields"]["values"]["element"]["fields"]>
  >;
}

/**
 * Game Time Calendar configuration data model.
 */
declare class CalendarData extends DataModel<CalendarData.Schema> {}

export const SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG: CalendarData.Config;

export default CalendarData;
