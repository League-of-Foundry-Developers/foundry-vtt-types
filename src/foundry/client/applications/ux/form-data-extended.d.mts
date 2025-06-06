import type { AnyMutableObject } from "#utils";

/**
 * An extension of the native FormData implementation.
 *
 * This class functions the same way that the default FormData does, but it is more opinionated about how
 * input fields of certain types should be evaluated and handled.
 *
 * It also adds support for certain Foundry VTT specific concepts including:
 *  Support for defined data types and type conversion
 *  Support for TinyMCE editors
 *  Support for editable HTML elements
 */
declare class FormDataExtended extends FormData {
  /**
   * @param form    - The form being processed
   * @param options - Options which configure form processing
   */
  constructor(form: HTMLFormElement, options?: FormDataExtended.Options);

  /**
   * A mapping of data types requested for each form field.
   * @defaultValue `{}`
   */
  dtypes: Record<string, string>;

  /**
   * A record of TinyMCE editors which are linked to this form.
   * @defaultValue `{}`
   */
  editors: Record<string, foundry.appv1.api.FormApplication.FormApplicationEditor>;

  /**
   * The object representation of the form data, available once processed.
   */
  get object(): AnyMutableObject;

  /**
   * Process the HTML form element to populate the FormData instance.
   * @param form    - The HTML form being processed
   * @param options - Options forwarded from the constructor
   */
  process(form: HTMLFormElement, options: FormDataExtended.Options): void;

  /**
   * Assign a value to the FormData instance which always contains JSON strings.
   * Also assign the cast value in its preferred data type to the parsed object representation of the form data.
   * @param name - The field name
   * @param value - The raw extracted value from the field
   */
  override set(name: string, value: any): void;

  /**
   * Append values to the form data, adding them to an array.
   * @param name - The field name to append to the form
   * @param value - The value to append to the form data
   */
  override append(name: string, value: any): void;
}

declare namespace FormDataExtended {
  interface Options {
    /**
     * A record of TinyMCE editor metadata objects, indexed by their update key
     * (default: `{}`)
     */
    editors?: FormDataExtended["editors"] | undefined;

    /**
     * A mapping of data types for form fields
     * (default: `{}`)
     */
    dtypes?: FormDataExtended["dtypes"] | undefined;

    /**
     * Include disabled fields?
     * (default: `false`)
     */
    disabled?: boolean | undefined;

    /**
     * Include readonly fields?
     * (default: `true`)
     */
    readonly?: boolean | undefined;
  }
}

export default FormDataExtended;
