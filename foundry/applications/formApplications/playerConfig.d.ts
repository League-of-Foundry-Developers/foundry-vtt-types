/**
 * The Player Configuration application provides a form used to allow the current client to
 * edit preferences and configurations about their own User entity.
 */
declare class PlayerConfig extends FormApplication<PlayerConfig.Data, User> {
  /**
   * @param user    - The User entity being configured.
   * @param options - Additional rendering options which modify the behavior of the form.
   */
  constructor(user: User, options: PlayerConfig.Options);

  user: User;

  /**
   * Assign the default options which are supported by the entity edit sheet
   */
  static get defaultOptions(): PlayerConfig.Options;

  get title(): string;

  /**
   * Provide data to the form
   * @returns The data provided to the template when rendering the form
   */
  getData(): PlayerConfig.Data;

  /**
   * Activate the default set of listeners for the Entity sheet
   * These listeners handle basic stuff like form submission or updating images
   *
   * @param html - The rendered template ready to have listeners attached
   */
  activateListeners(html: JQuery): void;

  /**
   * Handle changing the user avatar image by opening a FilePicker
   */
  protected _onEditAvatar(event: Event): ReturnType<FilePicker['browse']>;

  /**
   * This method is called upon form submission after form data is validated
   * @param event    - The initial triggering submission event
   * @param formData - The object of validated form data with which to update the object
   */
  protected _updateObject(event: Event, formData: User.Data): ReturnType<User['update']>;
}

declare namespace PlayerConfig {
  interface Data {
    user: PlayerConfig['user'];
    actors: Actor[];
    options: PlayerConfig['options'];
  }

  interface Options extends FormApplication.Options {
    /**
     * @defaultValue `'player-config'`
     */
    id: string;

    /**
     * @defaultValue `'templates/user/player-config.html'`
     */
    template: string;

    /**
     * @defaultValue `400`
     */
    width: number;

    /**
     * @defaultValue `'auto'`
     */
    height: 'auto' | number;
  }
}
