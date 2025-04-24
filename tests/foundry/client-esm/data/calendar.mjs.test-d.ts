// Copied implementation from Foundry's calendar.mjs
const _gregorian: foundry.data.CalendarData.CreateData = {
  name: "Simplified Gregorian",
  description: "The Gregorian calendar with some simplifications regarding leap years or seasonal timing.",
  years: {
    yearZero: 0,
    firstWeekday: 0,
    leapYear: {
      leapStart: 8,
      leapInterval: 4,
    },
  },
  months: {
    values: [
      { name: "CALENDAR.Gregorian.January", abbreviation: "CALENDAR.Gregorian.JanuaryAbbr", ordinal: 1, days: 31 },
      {
        name: "CALENDAR.Gregorian.February",
        abbreviation: "CALENDAR.Gregorian.FebruaryAbbr",
        ordinal: 2,
        days: 28,
        leapDays: 29,
      },
      { name: "CALENDAR.Gregorian.March", abbreviation: "CALENDAR.Gregorian.MarchAbbr", ordinal: 3, days: 31 },
      { name: "CALENDAR.Gregorian.April", abbreviation: "CALENDAR.Gregorian.AprilAbbr", ordinal: 4, days: 30 },
      { name: "CALENDAR.Gregorian.May", abbreviation: "CALENDAR.Gregorian.MayAbbr", ordinal: 5, days: 31 },
      { name: "CALENDAR.Gregorian.June", abbreviation: "CALENDAR.Gregorian.JuneAbbr", ordinal: 6, days: 30 },
      { name: "CALENDAR.Gregorian.July", abbreviation: "CALENDAR.Gregorian.JulyAbbr", ordinal: 7, days: 31 },
      { name: "CALENDAR.Gregorian.August", abbreviation: "CALENDAR.Gregorian.AugustAbbr", ordinal: 8, days: 31 },
      { name: "CALENDAR.Gregorian.September", abbreviation: "CALENDAR.Gregorian.SeptemberAbbr", ordinal: 9, days: 30 },
      { name: "CALENDAR.Gregorian.October", abbreviation: "CALENDAR.Gregorian.OctoberAbbr", ordinal: 10, days: 31 },
      { name: "CALENDAR.Gregorian.November", abbreviation: "CALENDAR.Gregorian.NovemberAbbr", ordinal: 11, days: 30 },
      { name: "CALENDAR.Gregorian.December", abbreviation: "CALENDAR.Gregorian.DecemberAbbr", ordinal: 12, days: 31 },
    ],
  },
  days: {
    values: [
      { name: "CALENDAR.Gregorian.Monday", abbreviation: "CALENDAR.Gregorian.MondayAbbr", ordinal: 1 },
      { name: "CALENDAR.Gregorian.Tuesday", abbreviation: "CALENDAR.Gregorian.TuesdayAbbr", ordinal: 2 },
      { name: "CALENDAR.Gregorian.Wednesday", abbreviation: "CALENDAR.Gregorian.WednesdayAbbr", ordinal: 3 },
      { name: "CALENDAR.Gregorian.Thursday", abbreviation: "CALENDAR.Gregorian.ThursdayAbbr", ordinal: 4 },
      { name: "CALENDAR.Gregorian.Friday", abbreviation: "CALENDAR.Gregorian.FridayAbbr", ordinal: 5 },
      {
        name: "CALENDAR.Gregorian.Saturday",
        abbreviation: "CALENDAR.Gregorian.SaturdayAbbr",
        ordinal: 6,
        isRestDay: true,
      },
      { name: "CALENDAR.Gregorian.Sunday", abbreviation: "CALENDAR.Gregorian.SundayAbbr", ordinal: 7, isRestDay: true },
    ],
    daysPerYear: 365,
    hoursPerDay: 24,
    minutesPerHour: 60,
    secondsPerMinute: 60,
  },
  seasons: {
    values: [
      { name: "CALENDAR.Gregorian.Spring", monthStart: 3, monthEnd: 5 },
      { name: "CALENDAR.Gregorian.Summer", monthStart: 6, monthEnd: 8 },
      { name: "CALENDAR.Gregorian.Fall", monthStart: 9, monthEnd: 11 },
      { name: "CALENDAR.Gregorian.Winter", monthStart: 12, monthEnd: 2 },
    ],
  },
};
