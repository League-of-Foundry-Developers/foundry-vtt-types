export {};

declare global {
  let _templateCache: Record<string, Handlebars.TemplateDelegate>;

  /**
   * Get a template from the server by fetch request and caching the retrieved result
   * @param path - The web-accessible HTML template URL
   * @returns A Promise which resolves to the compiled Handlebars template
   */
  function getTemplate(path: string): Promise<Handlebars.TemplateDelegate>;

  /**
   * Load and cache a set of templates by providing an Array of paths
   * @param paths - An array of template file paths to load
   */
  function loadTemplates(paths: string[]): Promise<Handlebars.TemplateDelegate[]>;

  /**
   * Get and render a template using provided data and handle the returned HTML
   * Support asynchronous file template file loading with a client-side caching layer
   *
   * Allow resolution of prototype methods and properties since this all occurs within the safety of the client.
   * @see {@link https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access}
   *
   * @param path - The file path to the target HTML template
   * @param data - A data object against which to compile the template
   *
   * @returns Returns the rendered HTML
   */
  function renderTemplate(path: string, data: object): Promise<string>;

  /**
   * A collection of Handlebars template helpers which can be used within HTML templates.
   */
  class HandlebarsHelpers {
    /**
     * For checkboxes, if the value of the checkbox is true, add the "checked" property, otherwise add nothing.
     */
    static checked(value: unknown): string;

    /**
     * For use in form inputs. If the supplied value is truthy, add the "disabled" property, otherwise add nothing.
     */
    static disabled(value: unknown): string;

    /**
     * Concatenate a number of string terms into a single string.
     * This is useful for passing arguments with variable names.
     * @param values - The values to concatenate
     *
     * @example <caption>Concatenate several string parts to create a dynamic variable</caption>
     * ```handlebars
     * {{filePicker target=(concat "faces." i ".img") type="image"}}
     * ```
     */
    static concat(...values: string[]): Handlebars.SafeString;

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
     * <label>{{localize "CHAT.InvalidCommand" command=foo}}</label> <!-- "foo is not a valid chat message command." -->
     * ```
     */
    static localize(value: string, options: HandlebarsHelpers.LocalizeOptions): string;

    /**
     * @param value   - A numeric value to format
     * @param options - Additional options which customize the resulting format
     * @returns The formatted string to be included in a template
     * A string formatting helper to display a number with a certain fixed number of decimals and an explicit sign.
     */
    static numberFormat(value: string, options: HandlebarsHelpers.NumberFormatOptions): string;

    /**
     * Render a form input field of type number with value appropriately rounded to step size.
     */
    static numberInput(value: string, options: HandlebarsHelpers.NumberInputOptions): Handlebars.SafeString;

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
     * Render a pair of inputs for selecting a value in a range.
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
     * @param options - Helper options
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
     *
     * @example <caption>The resulting HTML</caption>
     * ```handlebars
     * <select name="importantChoice">
     *   <option value="a" selected>Choice A</option>
     *   <option value="b">Choice B</option>
     * </select>
     * ```
     *
     * @example <caption>Using inverted</caption>
     * ```typescript
     * let choices = {"Choice A": "a", "Choice B": "b"};
     * let value = "a";
     * ```
     *
     * @example <caption>The template HTML structure</caption>
     * ```handlebars
     * <select name="importantChoice">
     *   {{selectOptions choices selected=value inverted=true}}
     * </select>
     * ```
     *
     * @example <caption>Using nameAttr and labelAttr with objects</caption>
     * ```typescript
     * let choices = {foo: {key: "a", label: "Choice A"}, bar: {key: "b", label: "Choice B"}};
     * let value = "b";
     * ```
     *
     * @example <caption>The template HTML structure</caption>
     * ```handlebars
     * <select name="importantChoice">
     *   {{selectOptions choices selected=value nameAttr="key" labelAttr="label"}}
     * </select>
     * ```
     *
     * @example <caption>Using nameAttr and labelAttr with arrays</caption>
     * ```typescript
     * let choices = [{key: "a", label: "Choice A"}, {key: "b", label: "Choice B"}];
     * let value = "b";
     * ```
     *
     * @example <caption>The template HTML structure</caption>
     * ```handlebars
     * <select name="importantChoice">
     *   {{selectOptions choices selected=value nameAttr="key" labelAttr="label"}}
     * </select>
     * ```
     */
    static selectOptions(
      choices: Record<string, string>,
      options: HandlebarsHelpers.SelectOptionsOptions
    ): Handlebars.SafeString;
  }

  namespace HandlebarsHelpers {
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
         * Replace dynamic document links?
         * @defaultValue `true`
         */
        documents?: boolean;

        /**
         * The data object providing context for inline rolls
         */
        rollData?: object | (() => object);

        /**
         * The original HTML content as a string
         * @defaultValue `""`
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
         * The number of decimal places to include in the resulting string
         * @defaultValue `0`
         */
        decimals?: number;

        /**
         * Whether to include an explicit "+" sign for positive numbers
         * @defaultValue `false`
         */
        sign?: boolean;
      };
    }

    interface NumberInputOptions extends Handlebars.HelperOptions {
      hash: {
        /**
         * @defaultValue `""`
         */
        name?: string;

        step?: number;

        /**
         * @defaultValue `false`
         */
        disabled?: boolean;

        /**
         * @defaultValue `""`
         */
        placeholder?: string;

        /**
         * @defaultValue `""`
         */
        class?: string;

        min?: number;

        max?: number;
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
       * @defaultValue `"range"`
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

        /**
         * Add a blank option as the first option with this label
         */
        blank?: string;

        /**
         * Look up a property in the choice object values to use as the option value
         */
        nameAttr?: string;

        /**
         * Look up a property in the choice object values to use as the option label
         */
        labelAttr?: string;

        /**
         * Use the choice object value as the option value, and the key as the label
         * instead of vice-versa
         */
        inverted?: boolean;
      };
    }
  }
}
