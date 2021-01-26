/* -------------------------------------------- */
/*  Handlebars Template Helpers                 */
/* -------------------------------------------- */

/**
 * A collection of Handlebars template helpers which can be used within HTML templates.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
declare class HandlebarsHelpers {
  /**
   * For checkboxes, if the value of the checkbox is true, add the "checked" property, otherwise add nothing.
   */
  static checked(value: any): string;

  /* -------------------------------------------- */

  /**
   * Construct an editor element for rich text editing with TinyMCE
   */
  static editor(options: HandlebarsHelpers.EditorOptions): Handlebars.SafeString;

  /* -------------------------------------------- */

  /**
   * Render a file-picker button linked to an <input> field
   */
  static filePicker(options: object): Handlebars.SafeString | string;

  /* -------------------------------------------- */

  /**
   * Translate a provided string key by using the loaded dictionary of localization strings.
   *
   * @example <caption>Translate a provided localization string, optionally including formatting parameters</caption>
   * ```handlebars
   * <label>{{localize "ACTOR.Create"}}</label> <!-- "Create Actor" -->
   * <label>{{localize "CHAT.InvalidCommand", command=foo}}</label> <!-- "foo is not a valid chat message command." -->
   * ```
   */
  static localize(value: string, options: Record<string, any>): string;

  /* -------------------------------------------- */

  /**
   * A string formatting helper to display a number with a certain fixed number of decimals and an explicit sign.
   */
  static numberFormat(value: any, options: HandlebarsHelpers.NumberFormatOptions): string;

  /* -------------------------------------------- */

  /**
   * A helper to create a set of radio checkbox input elements in a named set.
   * The provided keys are the possible radio values while the provided values are human readable labels.
   *
   * @param name     - The radio checkbox field name
   * @param choices  - A mapping of radio checkbox values to human readable labels
   * @param checked  - Which key is currently checked?
   * @param localize - Pass each label through string localization?
   *
   * @example <caption>The provided input data</caption>
   * ```typescript
   * let groupName = "importantChoice";
   * let choices = {a: "Choice A", b: "Choice B"};
   * let chosen = "a";
   * ```
   *
   * @example <caption>The template HTML structure</caption>
   * ```handlebars
   * <div class="form-group">
   *   <label>Radio Group Label</label>
   *   <div class="form-fields">
   *     {{radioBoxes groupName choices checked=chosen localize=true}}
   *   </div>
   * </div>
   * ```
   */
  static radioBoxes(
    name: string,
    choices: Record<string, string>,
    options: HandlebarsHelpers.RadioBoxesOptions
  ): Handlebars.SafeString;

  /* -------------------------------------------- */

  /**
   * A helper to assign an <option> within a <select> block as selected based on its value
   * Escape the string as handlebars would, then escape any regexp characters in it
   */
  static select(selected: string, { fn }: { fn: Handlebars.TemplateDelegate }): Handlebars.SafeString;

  /* -------------------------------------------- */

  /**
   * A helper to create a set of <option> elements in a <select> block based on a provided dictionary.
   * The provided keys are the option values while the provided values are human readable labels.
   * This helper supports both single-select as well as multi-select input fields.
   *
   * @param choices  - A mapping of radio checkbox values to human readable labels
   * @param selected - Which key or array of keys that are currently selected?
   * @param localize - Pass each label through string localization?
   *
   * @example <caption>The provided input data</caption>
   * ```typescript
   * let choices = {a: "Choice A", b: "Choice B"};
   * let value = "a";
   * ```
   *
   * @example <caption>The template HTML structure</caption>
   * ```handlebars
   * <select name="importantChoice">
   *   {{selectOptions choices selected=value localize=true}}
   * </select>
   * ```
   */
  static selectOptions(
    choices: Record<string, string>,
    options: HandlebarsHelpers.SelectOptionsOptions
  ): Handlebars.SafeString;
}

declare namespace HandlebarsHelpers {
  interface EditorOptions {
    hash: {
      button?: boolean;

      /**
       * @defaultValue `''`
       */
      content?: string;

      editable?: boolean;

      owner?: boolean;

      target: string;
    };
  }

  interface NumberFormatOptions {
    hash: {
      /**
       * @defaultValue `0`
       */
      decimals?: number;

      /**
       * @defaultValue `false`
       */
      sign?: boolean;
    };
  }

  interface RadioBoxesOptions {
    hash: {
      /**
       * @defaultValue `null`
       */
      checked?: string;

      /**
       * @defaultValue `false`
       */
      localize?: boolean;
    };
  }

  interface SelectOptionsOptions {
    hash: {
      /**
       * @defaultValue `null`
       */
      blank?: string;

      /**
       * @defaultValue `false`
       */
      localize?: boolean;

      /**
       * @defaultValue `null`
       */
      selected?: string | string[];
    };
  }
}
