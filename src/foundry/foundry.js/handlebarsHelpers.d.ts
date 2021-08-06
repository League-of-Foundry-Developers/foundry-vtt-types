/**
 * A collection of Handlebars template helpers which can be used within HTML templates.
 */
declare class HandlebarsHelpers {
  /**
   * For checkboxes, if the value of the checkbox is true, add the "checked" property, otherwise add nothing.
   */
  static checked(value: unknown): string;

  /**
   * Render a pair of inputs for selecting a color.
   * @param options - Helper options
   */
  static colorPicker(options: HandlebarsHelpers.ColorPickerOptions): Handlebars.SafeString;

  /**
   * Construct an editor element for rich text editing with TinyMCE
   * @param options - Helper options
   */
  static editor(options: HandlebarsHelpers.EditorOptions): Handlebars.SafeString;

  /**
   * Render a file-picker button linked to an `<input>` field
   * @param options - Helper options
   */
  static filePicker(options: HandlebarsHelpers.FilePickerOptions): Handlebars.SafeString | string;

  /**
   * Translate a provided string key by using the loaded dictionary of localization strings.
   *
   * @example <caption>Translate a provided localization string, optionally including formatting parameters</caption>
   * ```handlebars
   * <label>{{localize "ACTOR.Create"}}</label> <!-- "Create Actor" -->
   * <label>{{localize "CHAT.InvalidCommand", command=foo}}</label> <!-- "foo is not a valid chat message command." -->
   * ```
   */
  static localize(value: string, options: HandlebarsHelpers.LocalizeOptions): string;

  /**
   * A string formatting helper to display a number with a certain fixed number of decimals and an explicit sign.
   */
  static numberFormat(value: string, options: HandlebarsHelpers.NumberFormatOptions): string;

  /**
   * A helper to create a set of radio checkbox input elements in a named set.
   * The provided keys are the possible radio values while the provided values are human readable labels.
   *
   * @param name     - The radio checkbox field name
   * @param choices  - A mapping of radio checkbox values to human readable labels
   * @param options  - Options which customize the radio boxes creation
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

  /**
   * Render a pair of inputs for selecting a color.
   * @param options - Helper options
   */
  static rangePicker(options: HandlebarsHelpers.RangePickerOptions): Handlebars.SafeString;

  /**
   * A helper to assign an `<option>` within a `<select>` block as selected based on its value
   * Escape the string as handlebars would, then escape any regexp characters in it
   */
  static select(selected: string, options: HandlebarsHelpers.SelectOptions): string;

  /**
   * A helper to create a set of `<option>` elements in a `<select>` block based on a provided dictionary.
   * The provided keys are the option values while the provided values are human readable labels.
   * This helper supports both single-select as well as multi-select input fields.
   *
   * @param choices - A mapping of radio checkbox values to human readable labels
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
  interface ColorPickerOptions extends Handlebars.HelperOptions {
    hash: {
      /**
       * The name of the field to create
       */
      name?: string;

      /**
       * The current color value
       */
      value?: string;

      /**
       * A default color string if a value is not provided
       */
      default?: string;
    };
  }

  interface EditorOptions extends Handlebars.HelperOptions {
    hash: {
      /**
       * The named target data element
       */
      target: string;

      /**
       * Is the current user an owner of the data?
       */
      owner?: boolean;

      /**
       * Include a button used to activate the editor later?
       */
      button?: boolean;

      /**
       * Is the text editor area currently editable?
       */
      editable?: boolean;

      /**
       * @defaultValue `true`
       */
      entities?: boolean;

      rollData?: object;

      /**
       * @defaultValue `''`
       */
      content?: string;
    };
  }

  interface FilePickerOptions extends Handlebars.HelperOptions {
    hash: {
      /**
       * The type of FilePicker instance to display
       */
      type?: FilePicker.Type;

      /**
       * The field name in the target data
       */
      target: string;
    };
  }

  interface LocalizeOptions extends Handlebars.HelperOptions {
    hash: Record<string, unknown>;
  }

  interface NumberFormatOptions extends Handlebars.HelperOptions {
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

  interface RadioBoxesOptions extends Handlebars.HelperOptions {
    hash: {
      /**
       * Which key is currently checked?
       * @defaultValue `null`
       */
      checked?: string;

      /**
       * Pass each label through string localization?
       * @defaultValue `false`
       */
      localize?: boolean;
    };
  }

  interface RangePickerOptions extends Handlebars.HelperOptions {
    /**
     * The name of the field to create
     * @defaultValue `'range'`
     */
    name?: string;

    /**
     * The current range value
     */
    value?: number;

    /**
     * The minimum allowed value
     */
    min?: number;

    /**
     * The maximum allowed value
     */
    max?: number;

    /**
     * The allowed step size
     */
    step?: number;
  }

  type SelectOptions = Handlebars.HelperOptions;

  interface SelectOptionsOptions extends Handlebars.HelperOptions {
    hash: {
      /**
       * Which key or array of keys that are currently selected?
       */
      selected?: string | string[];

      /**
       * Pass each label through string localization?
       * @defaultValue `false`
       */
      localize?: boolean;

      blank?: string;

      nameAttr?: string;

      labelAttr?: string;

      inverted?: boolean;
    };
  }
}
