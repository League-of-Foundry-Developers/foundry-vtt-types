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
   * @param editors - A record of TinyMCE editor metadata objects, indexed by their update key
   *                  (default: `{}`)
   * @param dtypes  - A mapping of data types for form fields
   *                  (default: `{}`)
   */
  constructor(
    form: HTMLFormElement,
    { editors, dtypes }?: { editors?: FormDataExtended["editors"]; dtypes?: FormDataExtended["dtypes"] }
  );

  /**
   * A mapping of data types requested for each form field.
   * @defaultValue `{}`
   */
  dtypes: Partial<Record<string, string>>;

  /**
   * A record of TinyMCE editors which are linked to this form.
   * @defaultValue `{}`
   */
  editors: Partial<Record<string, FormApplication.FormApplicationEditor>>;

  /**
   * The object representation of the form data, available once processed.
   */
  get object(): Record<string, string | number>;

  /**
   * Process the HTML form element to populate the FormData instance.
   * @param form - The HTML form being processed
   */
  process(form: HTMLFormElement): void;

  /**
   * Export the FormData as an object
   * @deprecated since v10, use `FormDataExtended#object` instead.
   */
  toObject(): FormDataExtended["object"];
}
