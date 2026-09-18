import type DataModel from "#common/abstract/data.d.mts";
import type * as fields from "#common/data/fields.mjs";
import type { AnyObject, Identity, InexactPartial, IntentionalPartial } from "#utils";

declare namespace CalendarData {
  interface Any extends AnyCalendarData {}
  interface AnyConstructor extends Identity<typeof AnyCalendarData> {}

  interface Schema extends fields.DataSchema {
    /** The name of the calendar being used. */
    name: fields.StringField<{ required: true; blank: false }>;

    /** A text description of the calendar configuration. */
    description: fields.StringField;

    /** Configuration of years. */
    years: fields.SchemaField<ConfigYears.Schema>;

    /** Configuration of months. */
    months: fields.SchemaField<ConfigMonths.Schema, { required: true; nullable: true; initial: null }>;

    /** Configuration of days. */
    days: fields.SchemaField<ConfigDays.Schema>;

    /** Configuration of seasons. */
    seasons: fields.SchemaField<ConfigSeasons.Schema, { required: true; nullable: true; initial: null }>;
  }

  /**
   * The data put in {@linkcode CalendarData._source}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode WallDocument.create}
   * and {@link WallDocument | `new WallDocument(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   * @remarks Equivalent to how Foundry uses CalendarConfig, this is the type of `CONFIG.calendar`
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@linkcode DataModel} has been initialized, for example
   * {@link CalendarData.name | `CalenderData#name`}.
   *
   * This is data transformed from {@linkcode CalendarData.Source} and turned into more
   * convenient runtime data structures. For example a source value of `undefined` will be replaced
   * by the `initial` value of the field instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /** A definition of a year within a calendar. */
  namespace ConfigYears {
    interface Schema extends fields.DataSchema {
      /**
       * The year which is presented as 0 when formatting a time into a string representation.
       * @defaultValue `0`
       */
      yearZero: fields.NumberField<{ required: true; nullable: false; integer: true; initial: 0 }>;

      /** The index of days.values that is the first weekday at time=0 */
      firstWeekday: fields.NumberField<{ required: true; nullable: false; min: 0; integer: true }>;

      /** A definition of how leap years work within a calendar. */
      leapYear: fields.SchemaField<ConfigLeapYear.Schema, { required: true; nullable: true; initial: null }>;
    }

    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  }

  /** A definition of how leap years work within a calendar. */
  namespace ConfigLeapYear {
    interface Schema extends fields.DataSchema {
      /** The year number of the first leap year. On or after yearZero. */
      leapStart: fields.NumberField<{ required: true; nullable: false; integer: true }>;

      /** The number of years between leap years. */
      leapInterval: fields.NumberField<{ required: true; nullable: false; min: 2; integer: true }>;
    }

    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  }

  /** Month related configuration for a calendar. */
  namespace ConfigMonths {
    interface Schema extends fields.DataSchema {
      /** An array of months in the calendar year. */
      values: fields.ArrayField<fields.SchemaField<ConfigMonth.Schema>>;
    }

    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    interface CreateData extends fields.SchemaField.CreateData<Schema> {}
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
    }

    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  }

  /** Day related configuration for a calendar. */
  namespace ConfigDays {
    interface Schema extends fields.DataSchema {
      /** The configuration of the days of the week. */
      values: fields.ArrayField<fields.SchemaField<ConfigDay.Schema>, { required: true; nullable: false }>;

      /** The number of days in a year. */
      daysPerYear: fields.NumberField<{ required: true; nullable: false; positive: true }>;

      /** The number of hours in a day. */
      hoursPerDay: fields.NumberField<{ required: true; nullable: false; positive: true }>;

      /** The number of minutes in an hour. */
      minutesPerHour: fields.NumberField<{ required: true; nullable: false; positive: true }>;

      /** The number of seconds in a minute. */
      secondsPerMinute: fields.NumberField<{ required: true; nullable: false; positive: true }>;
    }

    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {
      /**
       * @remarks Not part of the schema. {@linkcode CalendarData._initialize | CalendarData#_initialize} sums the
       * `leapDays` (falling back to `days`, then `0`) of every configured month, or reuses `daysPerYear` when the
       * calendar has no months.
       */
      daysPerLeapYear: number;
    }

    interface CreateData extends fields.SchemaField.CreateData<Schema> {}
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
    }

    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  }

  /** Season related configuration for a calendar. */
  namespace ConfigSeasons {
    interface Schema extends fields.DataSchema {
      /** An array of seasons in the calendar year. */
      values: fields.ArrayField<fields.SchemaField<ConfigSeason.Schema>>;
    }

    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  }

  /** A definition of a season within a calendar year. */
  namespace ConfigSeason {
    interface Schema extends fields.DataSchema {
      /** The full name of the season. */
      name: fields.StringField<{ required: true; blank: false }>;

      /** The abbreviated name of the season. */
      abbreviation: fields.StringField;

      /** The ordinal month in which the season starts. */
      monthStart: fields.NumberField<{ required: true; nullable: true; min: 0; integer: true }>;

      /** The day of the month on which the season starts. */
      dayStart: fields.NumberField<{ required: true; nullable: true; min: 0; integer: true }>;

      /** The ordinal month in which the season ends. */
      monthEnd: fields.NumberField<{ required: true; nullable: true; min: 0; integer: true }>;

      /** The day of the month on which the season ends. */
      dayEnd: fields.NumberField<{ required: true; nullable: true; min: 0; integer: true }>;
    }

    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  }

  /**
   * A decomposition of the integer world time in seconds into component parts.
   * Each component expresses the number of that temporal unit since the time=0 epoch.
   */
  interface TimeComponents {
    /** The number of years completed since zero. */
    year: number;

    /** The number of days completed within the year. */
    day: number;

    /**
     * The number of hours completed within the year.
     * @remarks This should say "completed within the _day_"
     */
    hour: number;

    /** The number of minutes completed within the hour. */
    minute: number;

    /** The number of seconds completed within the minute. */
    second: number;

    /** The month, an index of the months.values array. */
    month: number;

    /** The day of the month, starting from zero. */
    dayOfMonth: number;

    /** The weekday, an index of the days.values array. */
    dayOfWeek: number;

    /** The season, an index of the seasons.values array. */
    season: number;

    /** Is it a leap year? */
    leapYear: boolean;
  }

  interface PartialTimeComponents extends IntentionalPartial<TimeComponents> {}

  /** @returns The returned string format */
  type TimeFormatter = (
    /** The configured calendar */
    calendar: CalendarData<TimeComponents>,

    /** Time components to format */
    components: TimeComponents,

    /** Additional formatting options */
    options: AnyObject,
  ) => string;

  type FormatterName = keyof typeof CONFIG.time.formatters;
  type Formatter = FormatterName | TimeFormatter;
  type FormatterOptions<Formatter extends CalendarData.Formatter> = Parameters<
    Formatter extends FormatterName ? (typeof CONFIG.time.formatters)[Formatter] : Formatter
  >[1];

  /**
   * {@linkcode CalendarData.TimeComponents} units usable in {@linkcode CalendarData.formatDuration}, sorted
   * descendingly by order of magnitude.
   */
  type DurationFormatUnit = "year" | "month" | "day" | "hour" | "minute" | "second";

  interface ComponentsToUnitOptions {
    /**
     * The Math function to use in rounding a remainder
     * @defaultValue `"ceil"`
     */
    roundFn?: "ceil" | "floor" | "round" | "trunc" | undefined;
  }

  /** The year, the seconds remaining within it, and whether that year is a leap year. */
  interface DecomposedYears {
    year: number;

    second: number;

    leapYear: boolean;
  }

  interface _FormatDurationOptions extends Intl.DurationFormatOptions {
    /**
     * @remarks A pre-built formatter. When omitted one is constructed from `game.i18n.lang` and the remaining
     * options, whose `style` defaults to `"long"`.
     */
    formatter?: Intl.DurationFormat | undefined;

    maxTerms?: number | undefined;
  }

  interface FormatDurationOptions extends _FormatDurationOptions {}

  interface FormatAgoOptions extends _FormatDurationOptions {
    /**
     * @deprecated "The short option in CalendarData.formatAgo is deprecated. Use the Intl.DurationFormat style
     * option instead." (since v14, until v16)
     */
    short?: boolean | undefined;
  }
}

/**
 * Game Time Calendar configuration data model.
 */
declare class CalendarData<
  Components extends CalendarData.TimeComponents = CalendarData.TimeComponents,
> extends DataModel<CalendarData.Schema> {
  /**
   * {@linkcode CalendarData.TimeComponents} units usable in {@linkcode CalendarData.formatDuration}, sorted
   * descendingly by order of magnitude
   * @defaultValue `new Set(["year", "month", "day", "hour", "minute", "second"])`
   * @internal
   */
  static _DURATION_FORMAT_UNITS: Set<CalendarData.DurationFormatUnit>;

  /** @remarks Adds the derived `daysPerLeapYear`, which is not part of the schema. */
  days: CalendarData.ConfigDays.InitializedData;

  protected override _initialize(options?: DataModel.InitializeOptions): void;

  /**
   * Convert a set of {@linkcode CalendarData.TimeComponents} into seconds.
   * @param components - An amount of time expressed as components
   * @returns The cumulative time in seconds
   */
  componentsToTime(components: InexactPartial<Components>): number;

  /**
   * Convert a partial set {@linkcode CalendarData.TimeComponents} into an integer of a provided unit.
   * @param components - An amount of time expressed as components
   * @param unit       - The unit to convert into
   * @param options    - Additional options
   * @returns The cumulative time in the requested units
   * @remarks
   * @throws If `unit` is `"month"`, which {@linkcode CalendarData._DURATION_FORMAT_UNITS} lists but the conversion
   * does not handle.
   */
  componentsToUnit(
    components: InexactPartial<Components>,
    unit: CalendarData.DurationFormatUnit,
    options?: CalendarData.ComponentsToUnitOptions,
  ): number;

  /**
   * Modify some start time by adding a number of seconds or components to it. The delta components may be negative.
   * @param startTime - The initial time
   * @param deltaTime - Differential components to add
   * @returns The resulting time
   */
  add(startTime: number | Components, deltaTime: number | Components): Components;

  /**
   * Compute the difference between some new time and some other time.
   * @param endTime   - A time to difference relative to the start time.
   * @param startTime - The starting time. If not provided the current world time is used.
   * @returns The time difference expressed as components
   */
  difference(endTime: number | Components, startTime?: number | Components): Components;

  /**
   * Format a time using one of several supported display formats.
   * @param time      - The time components to format, by default the current world time.
   * @param formatter - The formatter function applied to the time. If a string is provided, it must be a function configured in {@linkcode CONFIG.time.formatters}. (default: `"timestamp"`)
   * @param options   - Options passed to the formatter function (default: `{}`)
   * @returns The formatted date and time string
   * @remarks Throws an error if `formatter` is a string and the formatter by that name is not found
   */
  format<Formatter extends CalendarData.Formatter>(
    time?: number | Components,
    formatter?: Formatter,
    options?: CalendarData.FormatterOptions<Formatter>,
  ): string;

  /**
   * Test whether a year is a leap year.
   * @param year - The year to test
   * @returns Is it a leap year?
   */
  isLeapYear(year: number): boolean;

  /**
   * Count the number of leap years which have occurred up to a certain year.
   * @param year - The year to count up to
   * @returns The number of leap years
   */
  countLeapYears(year: number): number;

  /**
   * Expand a world time integer into an object containing the relevant time components.
   * @param time - A time in seconds (default: `0`)
   * @returns The time expressed as components
   */
  timeToComponents(time?: number): Components;

  /**
   * Decompose a world time into the number of completed years and the remaining seconds within the current year.
   * Also returns whether the remaining seconds fall within a leap year.
   * This method is factored out so calendars which require advanced leap year handling can override this logic.
   */
  protected _decomposeTimeYears(time: number): CalendarData.DecomposedYears;

  /** Format time components as a YYYY-MM-DD HH:MM:SS timestamp. */
  static formatTimestamp(
    calendar: CalendarData<CalendarData.TimeComponents>,
    components: CalendarData.TimeComponents,
    _options?: AnyObject,
  ): string;

  /**
   * Format time components as "\{years\}, \{days\}, \{hours\}, \{minutes\}, \{seconds\}". The empty string is returned
   * if the components are unabled to be formatted.
   * @remarks Returns the infinity sign when a component is not finite, or when the formatter reports a
   * {@linkcode RangeError}.
   */
  static formatDuration(
    calendar: CalendarData<CalendarData.TimeComponents>,
    components: CalendarData.TimeComponents,
    options?: CalendarData.FormatDurationOptions,
  ): string;

  /** Format time components as "\{years\}, \{days\}, \{hours\}, \{minutes\}, \{seconds\} ago". */
  static formatAgo(
    calendar: CalendarData<CalendarData.TimeComponents>,
    components: CalendarData.TimeComponents,
    options?: CalendarData.FormatAgoOptions,
  ): string;

  /**
   * Allow the active world calendar instance to respond to changes in the world time.
   * This method is called and awaited before "updateWorldTime" hooks are dispatched.
   * @param worldTime - The new world time, game.time.worldTime
   * @param deltaTime - The relative change in the world time
   * @param options   - Options passed through the world time update operation
   * @param userId    - The user who triggered the time change
   */
  onUpdateWorldTime(
    worldTime: number,
    deltaTime: number,
    options: AnyObject | undefined,
    userId: string,
  ): Promise<void>;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<CalendarData.Schema>;

  static override get schema(): fields.SchemaField<CalendarData.Schema>;

  static override validateJoint(data: CalendarData.Source): void;

  // TODO: figure out if this should be generic
  static override fromSource(source: CalendarData.CreateData, context?: DataModel.FromSourceOptions): CalendarData.Any;

  // TODO: figure out if this should be generic
  static override fromJSON(json: string): CalendarData.Any;
}

export const SIMPLIFIED_GREGORIAN_CALENDAR_CONFIG: CalendarData.CreateData;

export default CalendarData;

declare abstract class AnyCalendarData extends CalendarData<CalendarData.TimeComponents> {
  constructor(...args: never);
}
