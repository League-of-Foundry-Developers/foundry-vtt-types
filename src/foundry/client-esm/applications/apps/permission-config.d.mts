import type { USER_ROLES, UserPermission } from "../../../common/constants.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.mjs";

type PermissionWithRole = UserPermission & {
  id: string;
  roles: {
    name: string;
    value: boolean;
    readonly: string;
  }[];
};

/**
 * An application for configuring the permissions which are available to each User role.
 */

declare class PermissionConfig extends HandlebarsApplicationMixin(ApplicationV2) {
  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /**
   * Prepare the permissions object used to render the configuration template
   * @param current      - The current permission configuration. An object whose keys are the permission ids and values are arrays of USER_ROLES for each permission
   * @returns            Permission data for sheet rendering
   */

  #preparePermissions(current: Record<string, USER_ROLES[]>): PermissionWithRole[];

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /**
   * Handle submission
   * @param event         - The originating form submission event
   * @param form          - The form element that was submitted
   * @param formData      - Processed data for the submitted form
   * @returns
   */
  static #onSubmit(event: SubmitEvent, form: HTMLFormElement, formData: FormDataExtended): Promise<void>;

  /**
   * Handle click actions to reset all permissions back to their initial state.
   * @param event     - The originating click event
   * @returns
   */
  static #onReset(event: PointerEvent): Promise<void>;
}

export default PermissionConfig;
