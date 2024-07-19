import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.mjs";

/**
 * An application for configuring compendium art priorities.
 */
declare class CompendiumArtConfig extends HandlebarsApplicationMixin(ApplicationV2) {
  /* -------------------------------------------- */
  /*  Event Handlers                              */
  /* -------------------------------------------- */

  /**
   * Adjust the priority of a package.
   * @param _event          - The click event.
   * @param target          - The button that was clicked.
   */
  static #onAdjustPriority(_event: MouseEvent, target: HTMLButtonElement): Promise<void>;

  /**
   * Save the compendium art configuration.
   * @param _event          - The form submission event.
   * @param _form           - The form element that was submitted.
   * @param formData        - Processed data for the submitted form.
   */
  static #onSubmit(_event: SubmitEvent, _form: HTMLFormElement, formData: FormDataExtended): Promise<void>;
}

export default CompendiumArtConfig;
