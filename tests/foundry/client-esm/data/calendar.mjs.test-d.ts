// Copied implementation from Foundry's calendar.mjs
const _gregorian = {
  name: "Simplified Gregorian",
  description: "The Gregorian calendar with some simplifications regarding leap years or seasonal timing.",
  years: {
    yearZero: 1,
    firstWeekday: 1,
    leapYear: {
      leapStart: 8,
      leapInterval: 4,
    },
  },
  months: {
    values: [
      { name: "January", abbreviation: "Jan", ordinal: 1, days: 31 },
      { name: "February", abbreviation: "Feb", ordinal: 2, days: 29, leapDays: 28 },
      { name: "March", abbreviation: "Mar", ordinal: 3, days: 31 },
      { name: "April", abbreviation: "Apr", ordinal: 4, days: 30 },
      { name: "May", abbreviation: "May", ordinal: 5, days: 31 },
      { name: "June", abbreviation: "Jun", ordinal: 6, days: 30 },
      { name: "July", abbreviation: "Jul", ordinal: 7, days: 31 },
      { name: "August", abbreviation: "Aug", ordinal: 8, days: 31 },
      { name: "September", abbreviation: "Sep", ordinal: 9, days: 30 },
      { name: "October", abbreviation: "Oct", ordinal: 10, days: 31 },
      { name: "November", abbreviation: "Nov", ordinal: 11, days: 30 },
      { name: "December", abbreviation: "Dec", ordinal: 12, days: 31 },
    ],
  },
  days: {
    values: [
      { name: "Monday", abbreviation: "Mon", ordinal: 1 },
      { name: "Tuesday", abbreviation: "Tues", ordinal: 2 },
      { name: "Wednesday", abbreviation: "Wed", ordinal: 3 },
      { name: "Thursday", abbreviation: "Thu", ordinal: 4 },
      { name: "Friday", abbreviation: "Fri", ordinal: 5 },
      { name: "Saturday", abbreviation: "Sat", ordinal: 6, isRestDay: true },
      { name: "Sunday", abbreviation: "Sun", ordinal: 7, isRestDay: true },
    ],
    // 13.337 bug leaving this property out
    // daysPerYear: 365,
    hoursPerDay: 24,
    minutesPerHour: 60,
    secondsPerMinute: 60,
  },
  seasons: {
    values: [
      // 13.337 version has misnamed & missing properties
      { name: "Spring", /** ordinal: 1, */ startMonth: 3, endMonth: 5 },
      { name: "Summer", /** ordinal: 2, */ startMonth: 6, endMonth: 8 },
      { name: "Fall", /** ordinal: 3, */ startMonth: 9, endMonth: 11 },
      { name: "Winter", /** ordinal: 4, */ startMonth: 12, endMonth: 2 },
    ],
  },
} satisfies foundry.data.CalendarData.CreateData;
