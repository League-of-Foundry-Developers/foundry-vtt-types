// This module installs its exports onto `Date.prototype`; the augmented members carry the documentation, and
// these declarations describe the same functions as they are reachable by direct import. Each is called with
// `this` bound to the date.

/**
 * Test whether a Date instance is valid.
 * A valid date returns a number for its timestamp, and NaN otherwise.
 * NaN is never equal to itself.
 */
export function isValid(this: Date): boolean;

/**
 * Return a standard YYYY-MM-DD string for the Date instance.
 * @returns The date in YYYY-MM-DD format
 */
export function toDateInputString(this: Date): string;

/**
 * Return a standard H:M:S.Z string for the Date instance.
 * @returns The time in H:M:S format
 */
export function toTimeInputString(this: Date): string;
