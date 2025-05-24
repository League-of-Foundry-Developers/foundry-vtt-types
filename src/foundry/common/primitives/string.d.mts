import type { Titlecase } from "#utils";

declare global {
  interface String {
    /**
     * Capitalize a string, transforming it's first character to a capital letter
     */
    capitalize<S extends string>(this: S): Capitalize<S>;

    /**
     * Compare this string (x) with the other string (y) by comparing each character's Unicode code point value.
     * This is the same comparison function that used by Array#sort if the compare function argument is omitted.
     * The result is host/locale-independent.
     * @param other - The other string to compare this string to.
     * @returns A negative Number if x \< y, a positive Number if x \> y, or a zero otherwise.
     */
    compare<S extends string>(this: S, other: string): number;

    /**
     * Convert a string to Title Case where the first letter of each word is capitalized
     */
    titleCase<S extends string>(this: S): Titlecase<S>;

    /**
     * Strip any <script> tags which were included within a provided string
     */
    stripScripts(): string;

    /**
     * Transform any string into a url-viable slug string
     * @param options - Optional arguments which customize how the slugify operation is performed
     * @returns The slugified input string
     */
    slugify(options?: String.SlugifyOptions): string;
  }

  namespace String {
    interface SlugifyOptions {
      /**
       * The replacement character to separate terms
       * @defaultValue `"-"`
       */
      replacement?: string | undefined;

      /**
       * Replace all non-alphanumeric characters, or allow them?
       * @defaultValue `false`
       */
      strict?: boolean | undefined;

      /**
       * Lowercase the string.
       * @defaultValue `true`
       */
      lowercase?: boolean | undefined;
    }
  }
}
