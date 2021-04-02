type DialogButton<T = unknown> = Dialog.Button<T>;

/**
 * Create a modal dialog window displaying a title, a message, and a set of buttons which trigger callback functions.
 *
 * @example <caption>Constructing a custom dialog instance</caption>
 * ```typescript
 * let d = new Dialog({
 *  title: "Test Dialog",
 *  content: "<p>You must choose either Option 1, or Option 2</p>",
 *  buttons: {
 *   one: {
 *    icon: '<i class="fas fa-check"></i>',
 *    label: "Option One",
 *    callback: () => console.log("Chose One")
 *   },
 *   two: {
 *    icon: '<i class="fas fa-times"></i>',
 *    label: "Option Two",
 *    callback: () => console.log("Chose Two")
 *   }
 *  },
 *  default: "two",
 *  render: html => console.log("Register interactivity in the rendered dialog"),
 *  close: html => console.log("This always is logged no matter which option is chosen")
 * });
 * d.render(true);
 * ```
 * @typeParam P - the type of the options object
 */
declare class Dialog<P extends Dialog.Options = Dialog.Options> extends Application<P> {
  /**
   * @param data    - An object of dialog data which configures how the modal window is rendered
   * @param options - Dialog rendering options, see {@link Application}
   */
  constructor(data: Dialog.Data, options?: Partial<P>);

  data: Dialog.Data;

  /* -------------------------------------------- */

  /**
   * @override
   */
  static get defaultOptions(): Dialog.Options;

  /* -------------------------------------------- */

  /**
   * @override
   */
  static get title(): string;

  /* -------------------------------------------- */

  /**
   * @override
   */
  getData(): { content: string; buttons: Record<string, Dialog.Button> };

  /* -------------------------------------------- */

  /**
   * @override
   */
  activateListeners(html: JQuery): void;

  /* -------------------------------------------- */

  /**
   * Handle a left-mouse click on one of the dialog choice buttons
   * @param event - The left-mouse click event
   */
  protected _onClickButton(event: MouseEvent): void;

  /* -------------------------------------------- */

  /**
   * Handle a keydown event while the dialog is active
   * @param event - The keydown event
   */
  protected _onKeyDown(event: KeyboardEvent & { key: 'Escape' }): Promise<void>;
  protected _onKeyDown(event: KeyboardEvent): Promise<void> | void;

  /* -------------------------------------------- */

  /**
   * Submit the Dialog by selecting one of its buttons
   * @param button - The configuration of the chosen button
   */
  protected submit(button: Dialog.Button): void;

  /* -------------------------------------------- */

  /**
   * @override
   */
  close(options?: Application.CloseOptions): Promise<void>;

  /* -------------------------------------------- */
  /*  Factory Methods                             */
  /* -------------------------------------------- */

  /**
   * A helper factory method to create simple confirmation dialog windows which consist of simple yes/no prompts.
   * If you require more flexibility, a custom Dialog instance is preferred.
   *
   * @param title       - The confirmation window title
   * @param content     - The confirmation message
   * @param yes         - Callback function upon yes
   * @param no          - Callback function upon no
   * @param render      - A function to call when the dialog is rendered
   * @param defaultYes  - Make "yes" the default choice?
   *                      (default: `true`)
   * @param rejectClose - Reject the Promise if the Dialog is closed without making a choice.
   *                      (default: `false`)
   * @param options     - Additional rendering options passed to the Dialog
   *                      (default: `{}`)
   *
   * @returns A promise which resolves once the user makes a choice or closes the window
   *
   * @example
   * ```typescript
   * let d = Dialog.confirm({
   *  title: "A Yes or No Question",
   *  content: "<p>Choose wisely.</p>",
   *  yes: () => console.log("You chose ... wisely"),
   *  no: () => console.log("You chose ... poorly"),
   *  defaultYes: false
   * });
   * ```
   */
  static confirm<Y = true, N = false, R extends boolean = false>({
    title,
    content,
    yes,
    no,
    render,
    defaultYes,
    rejectClose,
    options
  }?: {
    title: string;
    content: string;
    yes?: (html: JQuery) => Y;
    no?: (html: JQuery) => N;
    render?: (html: JQuery) => void;
    defaultYes?: boolean;
    rejectClose?: R;
    options?: Partial<Dialog.Options> & { jQuery?: true };
  }): Promise<R extends true ? Y | N : Y | N | null>;
  static confirm<Y = true, N = false, R extends boolean = false>({
    title,
    content,
    yes,
    no,
    render,
    defaultYes,
    rejectClose,
    options
  }?: {
    title: string;
    content: string;
    yes?: (html: HTMLElement) => Y;
    no?: (html: HTMLElement) => N;
    render?: (html: HTMLElement) => void;
    defaultYes?: boolean;
    rejectClose?: R;
    options: Partial<Dialog.Options> & { jQuery: false };
  }): Promise<R extends true ? Y | N : Y | N | null>;
  static confirm<Y = true, N = false, R extends boolean = false>({
    title,
    content,
    yes,
    no,
    render,
    defaultYes,
    rejectClose,
    options
  }?: {
    title: string;
    content: string;
    yes?: (html: JQuery | HTMLElement) => Y;
    no?: (html: JQuery | HTMLElement) => N;
    render?: (html: JQuery | HTMLElement) => void;
    defaultYes?: boolean;
    rejectClose?: R;
    options: Partial<Dialog.Options>;
  }): Promise<R extends true ? Y | N : Y | N | null>;
  /**
   * @deprecated You are passing an options object as a second parameter to Dialog.confirm. This should now be passed in
   *             as the options key of the first parameter.
   */
  static confirm<Y = true, N = false, R extends boolean = false>(
    {
      title,
      content,
      yes,
      no,
      render,
      defaultYes,
      rejectClose,
      options
    }: {
      title: string;
      content: string;
      yes?: (html: JQuery | HTMLElement) => Y;
      no?: (html: JQuery | HTMLElement) => N;
      render?: (html: JQuery | HTMLElement) => void;
      defaultYes?: boolean;
      rejectClose?: R;
      options?: Partial<Dialog.Options>;
    },
    old: Partial<Dialog.Options>
  ): Promise<R extends true ? Y | N : Y | N | null>;

  /* -------------------------------------------- */

  /**
   * A helper factory method to display a basic "prompt" style Dialog with a single button
   * @param title    - The confirmation window title
   * @param content  - The confirmation message
   * @param label    - The confirmation button text
   * @param callback - A callback function to fire when the button is clicked
   * @param render   - A function that fires after the dialog is rendered
   * @param options  - Additional rendering options
   * @returns A promise which resolves when clicked, or rejects if closed
   */
  static prompt<T>({
    title,
    content,
    label,
    callback,
    render,
    options
  }?: {
    title: string;
    content: string;
    label?: string;
    callback: (html: JQuery) => T;
    render?: (html: JQuery) => void;
    options?: Partial<Dialog.Options> & { jQuery?: true };
  }): Promise<T>;
  static prompt<T>({
    title,
    content,
    label,
    callback,
    render,
    options
  }?: {
    title: string;
    content: string;
    label?: string;
    callback: (html: HTMLElement) => T;
    render?: (html: HTMLElement) => void;
    options: Partial<Dialog.Options> & { jQuery: false };
  }): Promise<T>;
  static prompt<T>({
    title,
    content,
    label,
    callback,
    render,
    options
  }?: {
    title: string;
    content: string;
    label?: string;
    callback: (html: JQuery | HTMLElement) => T;
    render?: (html: JQuery | HTMLElement) => void;
    options: Partial<Dialog.Options>;
  }): Promise<T>;
}

declare namespace Dialog {
  interface Button<T = unknown> {
    /**
     * A Font Awesome icon for the button
     */
    icon?: string;

    /**
     * The label for the button
     */
    label?: string;

    /**
     * A callback function that fires when the button is clicked
     */
    callback?: (html: JQuery | HTMLElement) => T;
  }

  interface Data {
    /**
     * The window title
     */
    title: string;

    /**
     * HTML content
     */
    content: string;

    /**
     * A callback function invoked when the dialog is rendered
     */
    render?: Function;

    /**
     * Common callback operations to perform when the dialog is closed
     */
    close?: Function;

    /**
     * The buttons which are displayed as action choices for the dialog
     */
    buttons: Record<string, Button>;

    /**
     * The name of the default button which should be triggered on Enter
     */
    default: string;
  }

  interface Options extends Application.Options {
    /**
     * @defaultValue `400`
     */
    width: number;

    /**
     * @defaultValue `['dialog']`
     */
    classes: string[];

    /**
     * @defaultValue `'templates/hud/dialog.html'`
     */
    template: string;

    /**
     * Whether to provide jQuery objects to callback functions (if true) or plain
     * HTMLElement instances (if false). This is currently true by default but in the
     * future will become false by default.
     * @defaultValue `true`
     */
    jQuery: boolean;
  }
}
