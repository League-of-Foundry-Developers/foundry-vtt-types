import type DataModel from "@common/abstract/data.d.mts";
import type * as fields from "@common/data/fields.mjs";
import type { AnyObject, EmptyObject, NullishProps } from "../../../utils/index.d.mts";

declare namespace CalendarData {
  interface Schema extends fields.DataSchema {
    /** The name of the calendar being used. */
    name: fields.StringField<{ required: true; blank: false }>;
    /** A text description of the calendar configuration. */
    description: fields.StringField;
    /** Configuration of years. */
    years: fields.SchemaField<ConfigYears.Schema, { required: true; nullable: true; initial: null }>;
    /** Configuration of months. */
    months: fields.SchemaField<ConfigMonths.Schema, { required: true; nullable: true; initial: null }>;
    /** Configuration of days. */
    days: fields.SchemaField<ConfigDays.Schema>;
    /** Configuration of seasons. */
    seasons: fields.SchemaField<ConfigSeasons.Schema, { required: true; nullable: true; initial: null }>;
  }

  /**
   * The data put in {@link CalendarData._source | `CalendarData._source`}.
   *
   * Both `Source` and `PersistedData` are equivalent.
   */
  interface Source extends PersistedData {}

  /**
   * The data necessary to create a document. Used in places like {@link WallDocument.create | `WallDocument.create`}
   * and {@link WallDocument | `new WallDocument(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   * @remarks Equivalent to how Foundry uses CalendarConfig, this is the type of `CONFIG.calendar`
   * TODO: Replace with CreateData and convert to interface
   */
  type CreateData = fields.SchemaField.AssignmentType<Schema>;

  /**
   * The data put in {@link CalendarData._source | `CalendarData._source`}.
   *
   * Both `Source` and `PersistedData` are equivalent.
   */
  interface PersistedData extends fields.SchemaField.PersistedType<Schema> {}

  /**
   * The data after a {@link DataModel | `DataModel`} has been initialized, for example
   * {@link CalendarData.name | `CalenderData#name`}.
   *
   * This is data transformed from {@link CalendarData.Source | `CalendarData.Source`} and turned into more
   * convenient runtime data structures. For example a source value of `undefined` will be replaced
   * by the `initial` value of the field instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedType<Schema> {}

  /** A definition of a year within a calendar. */
  namespace ConfigYears {
    interface Schema extends fields.DataSchema {
      /** The year which is considered year 0 in the calendar. */
      yearZero: fields.NumberField<{ required: true; nullable: false; integer: true }>;
      /** The day of the week that the first day of year zero falls on. */
      firstWeekday: fields.NumberField<{ required: true; nullable: false; min: 1; integer: true }>;
      /** A definition of how leap years work within a calendar. */
      leapYear: fields.SchemaField<ConfigLeapYear.Schema, { required: true; nullable: true; initial: null }>;
    }

    interface InitializedData extends fields.SchemaField.InitializedType<Schema> {}

    // TODO: Replace with CreateData and convert to interface
    type CreateData = fields.SchemaField.AssignmentType<Schema>;
  }

  /** A definition of how leap years work within a calendar. */
  namespace ConfigLeapYear {
    interface Schema extends fields.DataSchema {
      /** The year number of the first leap year. On or after yearZero. */
      leapStart: fields.NumberField<{ required: true; nullable: false; integer: true }>;
      /** The number of years between leap years. */
      leapInterval: fields.NumberField<{ required: true; nullable: false; min: 1; integer: true }>;
    }

    interface InitializedData extends fields.SchemaField.InitializedType<Schema> {}

    // TODO: Replace with CreateData and convert to interface
    type CreateData = fields.SchemaField.AssignmentType<Schema>;
  }

  /** Month related configuration for a calendar. */
  namespace ConfigMonths {
    interface Schema extends fields.DataSchema {
      /** An array of months in the calendar year. */
      values: fields.ArrayField<fields.SchemaField<ConfigMonth.Schema>>;
    }

    interface InitializedData extends fields.SchemaField.InitializedType<Schema> {}

    // TODO: Replace with CreateData and convert to interface
    type CreateData = fields.SchemaField.AssignmentType<Schema>;
  }

  /** A definition of a month within a calendar year. */
  namespace ConfigMonth {
    interface Schema extends fields.DataSchema {
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
    }

    interface InitializedData extends fields.SchemaField.InitializedType<Schema> {}

    // TODO: Replace with CreateData and convert to interface
    type CreateData = fields.SchemaField.AssignmentType<Schema>;
  }

  /** Day related configuration for a calendar. */
  namespace ConfigDays {
    interface Schema extends fields.DataSchema {
      /** The configuration of the days of the week. */
      values: fields.ArrayField<fields.SchemaField<ConfigDay.Schema>, { required: true; nullable: false }>;
      /** The number of hours in a day. */
      hoursPerDay: fields.NumberField<{ required: true; nullable: false; positive: true }>;
      /** The number of minutes in an hour. */
      minutesPerHour: fields.NumberField<{ required: true; nullable: false; positive: true }>;
      /** The number of seconds in a minute. */
      secondsPerMinute: fields.NumberField<{ required: true; nullable: false; positive: true }>;
    }

    interface InitializedData extends fields.SchemaField.InitializedType<Schema> {}

    // TODO: Replace with CreateData and convert to interface
    type CreateData = fields.SchemaField.AssignmentType<Schema>;
  }

  /** A definition of the days of the week within a calendar. */
  namespace ConfigDay {
    interface Schema extends fields.DataSchema {
      /** The full name of the weekday. */
      name: fields.StringField<{ required: true; blank: false }>;
      /** The abbreviated name of the weekday. */
      abbreviation: fields.StringField;
      /** The ordinal position of this weekday in the week. */
      ordinal: fields.NumberField<{ required: true; nullable: false; min: 1; integer: true }>;
      /** Is this weekday considered a rest day (weekend)? */
      isRestDay: fields.BooleanField<{ required: false; nullable: false; initial: false }>;
    }

    interface InitializedData extends fields.SchemaField.InitializedType<Schema> {}

    // TODO: Replace with CreateData and convert to interface
    type CreateData = fields.SchemaField.AssignmentType<Schema>;
  }

  /** Season related configuration for a calendar. */
  namespace ConfigSeasons {
    interface Schema extends fields.DataSchema {
      /** An array of seasons in the calendar year. */
      values: fields.ArrayField<fields.SchemaField<ConfigSeason.Schema>>;
    }

    interface InitializedData extends fields.SchemaField.InitializedType<Schema> {}

    // TODO: Replace with CreateData and convert to interface
    type CreateData = fields.SchemaField.AssignmentType<Schema>;
  }

  /** A definition of a season within a calendar year. */
  namespace ConfigSeason {
    interface Schema extends fields.DataSchema {
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
    }

    interface InitializedData extends fields.SchemaField.InitializedType<Schema> {}

    // TODO: Replace with CreateData and convert to interface
    type CreateData = fields.SchemaField.AssignmentType<Schema>;
  }

  /**
   * A decomposition of the integer world time in seconds into component parts.
   * Each component expresses the number of that temporal unit since the time=0 epoch.
   */
  interface TimeComponents {
    /** The number of years completed since zero */
    year: number;

    /** The number of days completed within the year */
    day: number;

    /** The number of hours completed within the year */
    hour: number;

    /** The number of minutes completed within the hour */
    minute: number;

    /** The number of seconds completed within the minute */
    second: number;

    /** The month, an index of the months.values array */
    month: number;

    /** The day of the month, starting from zero */
    dayOfMonth: number;

    /** The weekday, an index of the days.values array */
    dayOfWeek: number;

    /** The season, an index of the seasons.values array */
    season: number;

    /** Is it a leap year? */
    leapYear: boolean;
  }

  // TODO: Reference CONFIG
  type Formatters = "formatTimestamp" | "formatAgo";

  /**
   * @returns The returned string format
   */
  type TimeFormatter<Options> = (
    /** The configured calendar */
    calendar: CalendarData,
    /** Time components to format */
    components: TimeComponents,
    /** Additional formatting options */
    options: Options,
  ) => string;

  interface FormatAgoOptions {
    short?: boolean | undefined;

    maxTerms?: number | undefined | null;
  }
}

/**
 * Game Time Calendar configuration data model.
 */
declare class CalendarData extends DataModel<CalendarData.Schema> {
  /**
   * Expand a world time integer into an object containing the relevant time components.
   * @param components - An amount of time expressed as components
   * @returns The cumulative time in seconds
   */
  componentsToTime(components: NullishProps<CalendarData.TimeComponents>): number;

  /**
   * Compute the difference between some new time and some other time.
   * @param endTime   - A time to difference relative to the start time.
   * @param startTime - The starting time. If not provided the current world time is used.
   * @returns The time difference expressed as components
   */
  difference(
    endTime: NullishProps<CalendarData.TimeComponents>,
    startTime?: NullishProps<CalendarData.TimeComponents>,
  ): CalendarData.TimeComponents;

  /**
   * Format a time using one of several supported display formats.
   * @param time      - The time components to format, by default the current world time.
   * @param formatter - The formatter function applied to the time. If a string is provided, it must be a function configured in CONFIG.time.formatters.
   * @param options   - Options passed to the formatter function
   * @returns The formatted date and time string
   */
  format<Options extends EmptyObject>(
    time: number | NullishProps<CalendarData.TimeComponents>,
    formatter?: CalendarData.Formatters | CalendarData.TimeFormatter<Options>,
    options?: Options,
  ): string;

  /**
   * Test whether a year is a leap year.
   * @param year - The year to test
   * @returns Is it a leap year?
   */
  isLeapYear(year: number): boolean;

  /**
   * Expand a world time integer into an object containing the relevant time components.
   * @param time - A time in seconds
   *               (default: `0`)
   * @returns The time expressed as components
   */
  timeToComponents(time?: number): CalendarData.TimeComponents;

  /**
   * Format time components as a YYYY-MM-DD HH:MM:SS timestamp.
   */
  static formatTimeStamp: CalendarData.TimeFormatter<AnyObject>;

  /**
   * Format time components as "\{years\}, \{days\}, \{hours\}, \{minutes\}, \{seconds\} ago".
   */
  static formatAgo: CalendarData.TimeFormatter<CalendarData.FormatAgoOptions>;
}

export const SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG: CalendarData.CreateData;

export default CalendarData;
