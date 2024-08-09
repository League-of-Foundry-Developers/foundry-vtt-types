export {};

declare global {
  let _templateCache: Record<string, Handlebars.TemplateDelegate>;

  /**
   * Get a template from the server by fetch request and caching the retrieved result
   * @param path - The web-accessible HTML template URL
   * @param id   - An ID to register the partial with.
   * @returns A Promise which resolves to the compiled Handlebars template
   */
  function getTemplate(path: string, id?: string): Promise<Handlebars.TemplateDelegate>;

  /**
   * Load and cache a set of templates by providing an Array of paths
   * @param paths - An array of template file paths to load, or an object of Handlebars partial IDs to paths.
   *
   * @example Loading a list of templates.
   * ```js
   * await loadTemplates(["templates/apps/foo.html", "templates/apps/bar.html"]);
   * ```
   * ```hbs
   * <!-- Include a pre-loaded template as a partial -->
   * {{> "templates/apps/foo.html" }}
   * ```
   *
   * @example Loading an object of templates.
   * ```js
   * await loadTemplates({
   *   foo: "templates/apps/foo.html",
   *   bar: "templates/apps/bar.html"
   * });
   * ```
   * ```hbs
   * <!-- Include a pre-loaded template as a partial -->
   * {{> foo }}
   * ```
   */
  function loadTemplates(paths: string[] | Record<string, string>): Promise<Handlebars.TemplateDelegate[]>;

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
     *
     * @example
     * ```hbs
     * <label>My Checkbox</label>
     * <input type="checkbox" name="myCheckbox" {{checked myCheckbox}}>
     * ```
     */
    static checked(value: unknown): string;

    /**
     * For use in form inputs. If the supplied value is truthy, add the "disabled" property, otherwise add nothing.
     *
     * @example
     * ```hbs
     * <button type="submit" {{disabled myValue}}>Submit</button>
     * ```
     */
    static disabled(value: unknown): string;

    /**
     * Concatenate a number of string terms into a single string.
     * This is useful for passing arguments with variable names.
     * @param values - The values to concatenate
     *
     * @example Concatenate several string parts to create a dynamic variable
     * ```handlebars
     * {{filePicker target=(concat "faces." i ".img") type="image"}}
     * ```
     */
    static concat(...values: string[]): Handlebars.SafeString;

    /**
     * Render a pair of inputs for selecting a color.
     * @param options - Helper options
     *
     * @example
     * ```hbs
     * {{colorPicker name="myColor" value=myColor default="#000000"}}
     * ```
     */
    static colorPicker(options: HandlebarsHelpers.ColorPickerOptions): Handlebars.SafeString;

    /**
     * Construct an editor element for rich text editing with TinyMCE or ProseMirror.
     * @param options - Helper options
     *
     * @example
     * ```hbs
     * {{editor world.description target="description" button=false engine="prosemirror" collaborate=false}}
     * ```
     */
    static editor(...args: [content: string, options: HandlebarsHelpers.TextEditorOptions]): Handlebars.SafeString;

    /**
     * Render a file-picker button linked to an `<input>` field
     * @param options - Helper options
     *
     * @example
     * ```hbs
     * {{filePicker type="image" target="img"}}
     * ```
     */
    static filePicker(options: HandlebarsHelpers.FilePickerOptions): Handlebars.SafeString | string;

    /**
     * A ternary expression that allows inserting A or B depending on the value of C.
     * @param options - Helper options
     * @returns The ternary result
     *
     * @example Ternary if-then template usage
     * ```hbs
     * {{ifThen true "It is true" "It is false"}}
     * ```
     */
    static ifThen(options: HandlebarsHelpers.IfThenOptions): string;

    /**
     * Translate a provided string key by using the loaded dictionary of localization strings.
     *
     * @example Translate a provided localization string, optionally including formatting parameters
     * ```handlebars
     * <label>{{localize "ACTOR.Create"}}</label> <!-- "Create Actor" -->
     * <label>{{localize "CHAT.InvalidCommand" command=foo}}</label> <!-- "foo is not a valid chat message command." -->
     * ```
     */
    static localize(value: string, options: HandlebarsHelpers.LocalizeOptions): string;

    /**
     * A string formatting helper to display a number with a certain fixed number of decimals and an explicit sign.
     * @param value   - A numeric value to format
     * @param options - Additional options which customize the resulting format
     * @returns The formatted string to be included in a template
     *
     * @example
     * ```hbs
     * {{formatNumber 5.5}} <!-- 5.5 -->
     * {{formatNumber 5.5 decimals=2}} <!-- 5.50 -->
     * {{formatNumber 5.5 decimals=2 sign=true}} <!-- +5.50 -->
     * ```
     */
    static numberFormat(value: string, options: HandlebarsHelpers.NumberFormatOptions): string;

    /**
     * Render a form input field of type number with value appropriately rounded to step size.
     *
     * @example
     * ```hbs
     * {{numberInput value name="numberField" step=1 min=0 max=10}}
     * ```
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
     * @example The provided input data
     * ```typescript
     * let groupName = "importantChoice";
     * let choices = {a: "Choice A", b: "Choice B"};
     * let chosen = "a";
     * ```
     *
     * @example The template HTML structure
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
      options: HandlebarsHelpers.RadioBoxesOptions,
    ): Handlebars.SafeString;

    /**
     * Render a pair of inputs for selecting a value in a range.
     * @param options - Helper options
     */
    static rangePicker(options: HandlebarsHelpers.RangePickerOptions): Handlebars.SafeString;

    /**
     * A helper to assign an `<option>` within a `<select>` block as selected based on its value
     * Escape the string as handlebars would, then escape any regexp characters in it
     *
     * @example
     * ```hbs
     * <select>
     * {{#select selected}}
     *   <option value="a">Choice A</option>
     *   <option value="b">Choice B</option>
     * {{/select}}
     * </select>
     * ```
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
     * @example The provided input data
     * ```typescript
     * let choices = {a: "Choice A", b: "Choice B"};
     * let value = "a";
     * ```
     *
     * @example The template HTML structure
     * ```handlebars
     * <select name="importantChoice">
     *   {{selectOptions choices selected=value localize=true}}
     * </select>
     * ```
     *
     * @example The resulting HTML
     * ```handlebars
     * <select name="importantChoice">
     *   <option value="a" selected>Choice A</option>
     *   <option value="b">Choice B</option>
     * </select>
     * ```
     *
     * @example Using inverted choices
     * ```typescript
     * let choices = {"Choice A": "a", "Choice B": "b"};
     * let value = "a";
     * ```
     *
     * @example The template HTML structure
     * ```handlebars
     * <select name="importantChoice">
     *   {{selectOptions choices selected=value inverted=true}}
     * </select>
     * ```
     *
     * @example Using nameAttr and labelAttr with objects
     * ```typescript
     * let choices = {foo: {key: "a", label: "Choice A"}, bar: {key: "b", label: "Choice B"}};
     * let value = "b";
     * ```
     *
     * @example The template HTML structure
     * ```handlebars
     * <select name="importantChoice">
     *   {{selectOptions choices selected=value nameAttr="key" labelAttr="label"}}
     * </select>
     * ```
     *
     * @example Using nameAttr and labelAttr with arrays
     * ```typescript
     * let choices = [{key: "a", label: "Choice A"}, {key: "b", label: "Choice B"}];
     * let value = "b";
     * ```
     *
     * @example The template HTML structure
     * ```handlebars
     * <select name="importantChoice">
     *   {{selectOptions choices selected=value nameAttr="key" labelAttr="label"}}
     * </select>
     * ```
     */
    static selectOptions(
      choices: Record<string, string> | Array<string>,
      options: HandlebarsHelpers.SelectOptionsOptions,
    ): Handlebars.SafeString;
  }

  namespace HandlebarsHelpers {
    interface ColorPickerOptions extends Partial<Handlebars.HelperOptions> {
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

    interface TextEditorOptions extends Partial<Handlebars.HelperOptions> {
      hash: {
        /**
         * The named target data element
         */
        target: string;

        /**
         * Include a button used to activate the editor later?
         */
        button?: boolean;

        /**
         * A specific CSS class to add to the editor container
         */
        class?: string;

        /**
         * Is the text editor area currently editable?
         * @defaultValue `true`
         */
        editable?: boolean;

        /**
         * The engine editor to use, see {@link TextEditor.create}
         * @defaultValue `"tinymce"`
         */
        engine?: "tinymce" | "prosemirror";

        /**
         * Whether to turn on collaborative editing features for ProseMirror
         * @defaultValue `false`
         */
        collaborate?: boolean;

        /**
         * Is the current user an owner of the data?
         * @deprecated since v10
         */
        owner?: boolean;

        /**
         * Replace dynamic document links?
         * @defaultValue `true`
         * @deprecated since v10
         */
        documents?: boolean;

        /**
         * The data object providing context for inline rolls
         * @deprecated since v10
         */
        rollData?: object | (() => object);

        /**
         * The original HTML content as a string
         * @defaultValue `""`
         * @deprecated since v10
         */
        content?: string;
      };
    }

    interface FilePickerOptions extends Partial<Handlebars.HelperOptions> {
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

    interface IfThenOptions extends Partial<Handlebars.HelperOptions> {
      hash: {
        /**
         * THe test criteria
         */
        criteria: boolean;
        /**
         * The string to output if true
         */
        ifTrue: string;
        /**
         * The string to output if false
         */
        ifFalse: string;
      };
    }

    interface LocalizeOptions extends Partial<Handlebars.HelperOptions> {
      hash: Record<string, unknown>;
    }

    interface NumberFormatOptions extends Partial<Handlebars.HelperOptions> {
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

    interface NumberInputOptions extends Partial<Handlebars.HelperOptions> {
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

    interface RadioBoxesOptions extends Partial<Handlebars.HelperOptions> {
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

    interface RangePickerOptions extends Partial<Handlebars.HelperOptions> {
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

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface SelectOptions extends Handlebars.HelperOptions {}

    interface SelectOptionsOptions extends Partial<Handlebars.HelperOptions> {
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
