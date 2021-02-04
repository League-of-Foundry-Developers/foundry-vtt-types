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
 *
 * @extends {FormData}
 *
 * @param {HTMLFormElement} form        The form being processed
 * @param {object[]} [editors]          An array of TinyMCE editor instances which are present in this form
 * @param {{string, string}} [dtypes]   A mapping of data types for form fields
 */
declare class FormDataExtended extends FormData {
  constructor(form: HTMLFormElement, options?: { editors: object[]; dtypes: Record<string, string> });

  /* -------------------------------------------- */

  /**
   * Process the HTML form element to populate the FormData instance.
   * @param {HTMLFormElement} form      The HTML form
   */
  process(form: HTMLFormElement): void;

  /* -------------------------------------------- */

  /**
   * Export the FormData as an object
   * @return {object}
   */
  toObject(): any;
}
