interface DialogOptions extends ApplicationOptions {
  /**
   * Whether to provide jQuery objects to callback functions (if true) or plain
   * HTMLElement instances (if false). This is currently true by default but in the
   * future will become false by default.
   * @defaultValue `true`
   */
  jQuery: boolean;
}

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
 * @typeParam Options - the type of the options object
 */
declare class Dialog<Options extends DialogOptions = DialogOptions> extends Application<Options> {
  /**
   * @param data    - An object of dialog data which configures how the modal window is rendered
   * @param options - Dialog rendering options, see {@link Application}
   */
  constructor(data: Dialog.Data, options?: Partial<Options>);

  data: Dialog.Data;

  /**
   * @defaultValue
   * ```typescript
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   template: "templates/hud/dialog.html",
   *   classes: ["dialog"],
   *   width: 400,
   *   jQuery: true
   * })
   * ```
   */
  static override get defaultOptions(): DialogOptions;

  static get title(): string;

  override getData(options?: Partial<Options>): { content: string; buttons: Record<string, Dialog.Button> };

  override activateListeners(html: JQuery): void;

  /**
   * Handle a left-mouse click on one of the dialog choice buttons
   * @param event - The left-mouse click event
   */
  protected _onClickButton(event: MouseEvent): void;

  /**
   * Handle a keydown event while the dialog is active
   * @param event - The keydown event
   */
  protected _onKeyDown(event: KeyboardEvent & { key: 'Escape' }): Promise<void>;
  protected _onKeyDown(event: KeyboardEvent): void;

  /**
   * Submit the Dialog by selecting one of its buttons
   * @param button - The configuration of the chosen button
   */
  protected submit(button: Dialog.Button): void;

  override close(options?: Application.CloseOptions): Promise<void>;

  /**
   * A helper factory method to create simple confirmation dialog windows which consist of simple yes/no prompts.
   * If you require more flexibility, a custom Dialog instance is preferred.
   *
   * @param config - Confirmation dialog configuration
   *                 (defaultValue: `{}`)
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
  static confirm<Yes = true, No = false>(
    config: ConfirmConfig<Yes, No, JQuery> & { options?: { jQuery?: true }; rejectClose: true }
  ): Promise<Yes | No>;
  static confirm<Yes = true, No = false>(
    config: ConfirmConfig<Yes, No, JQuery> & { options?: { jQuery?: true } }
  ): Promise<Yes | No | null>;
  static confirm<Yes = true, No = false>(
    config: ConfirmConfig<Yes, No, HTMLElement> & { options: { jQuery: false }; rejectClose: true }
  ): Promise<Yes | No>;
  static confirm<Yes = true, No = false>(
    config: ConfirmConfig<Yes, No, HTMLElement> & { options: { jQuery: false } }
  ): Promise<Yes | No | null>;
  static confirm<Yes = true, No = false>(
    config: ConfirmConfig<Yes, No, JQuery | HTMLElement> & { rejectClose: true }
  ): Promise<Yes | No>;
  static confirm<Yes = true, No = false>(
    config?: ConfirmConfig<Yes, No, JQuery | HTMLElement>
  ): Promise<Yes | No | null>;

  /**
   * A helper factory method to display a basic "prompt" style Dialog with a single button
   * @param config - Dialog configuration options
   * @returns A promise which resolves when clicked, or rejects if closed
   */
  static prompt<T>(
    config: PromptConfig<T, JQuery> & { options?: { jQuery?: true }; rejectClose: false }
  ): Promise<T | null>;
  static prompt<T>(config: PromptConfig<T, JQuery> & { options?: { jQuery?: true } }): Promise<T>;
  static prompt<T>(
    config: PromptConfig<T, HTMLElement> & { options: { jQuery: false }; rejectClose: false }
  ): Promise<T | null>;
  static prompt<T>(config: PromptConfig<T, HTMLElement> & { options: { jQuery: false } }): Promise<T>;
  static prompt<T>(config: PromptConfig<T, JQuery | HTMLElement> & { rejectClose: false }): Promise<T | null>;
  static prompt<T>(config: PromptConfig<T, JQuery | HTMLElement>): Promise<T>;
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
    render?: (element: JQuery | HTMLElement) => void;

    /**
     * Common callback operations to perform when the dialog is closed
     */
    close?: (element: JQuery | HTMLElement) => void;

    /**
     * The buttons which are displayed as action choices for the dialog
     */
    buttons: Record<string, Button>;

    /**
     * The name of the default button which should be triggered on Enter
     */
    default?: string | undefined;
  }
}

/**
 * @typeParam Yes          - The value returned by the yes callback
 * @typeParam No           - The value returned by the no callback
 * @typeParam JQueryOrHtml - The parameter passed to the callbacks, either JQuery or HTMLElement
 */
interface ConfirmConfig<Yes, No, JQueryOrHtml> {
  /**
   * The confirmation window title
   */
  title?: string;

  /**
   * The confirmation message
   */
  content?: string;

  /**
   * Callback function upon yes
   */
  yes?: (html: JQueryOrHtml) => Yes;

  /**
   * Callback function upon no
   */
  no?: (html: JQueryOrHtml) => No;

  /**
   * A function to call when the dialog is rendered
   */
  render?: (html: JQueryOrHtml) => void;

  /**
   * Make "yes" the default choice?
   * @defaultValue `true`
   */
  defaultYes?: boolean;

  /**
   * Reject the Promise if the Dialog is closed without making a choice.
   * @defaultValue `false`
   */
  rejectClose?: boolean;

  /**
   * Additional rendering options passed to the Dialog
   * @defaultValue `{}`
   */
  options?: Partial<DialogOptions>;
}

/**
 * @typeParam Value        - The value returned by the callback function
 * @typeParam JQueryOrHtml - The parameter passed to the callbacks, either JQuery or HTMLElement
 */
interface PromptConfig<Value, JQueryOrHtml> {
  /**
   * The confirmation window title
   */
  title?: string;

  /**
   * The confirmation message
   */
  content?: string;

  /**
   * The confirmation button text
   */
  label?: string;

  /**
   * A callback function to fire when the button is clicked
   */
  callback: (html: JQueryOrHtml) => Value;

  /**
   * A function that fires after the dialog is rendered
   */
  render?: (html: JQueryOrHtml) => void;

  /**
   * Reject the promise if the dialog is closed without confirming the
   * choice, otherwise resolve as null
   * @defaultValue `true`
   */
  rejectClose?: boolean;

  /**
   * Additional rendering options
   * @defaultValue `{}`
   */
  options?: Partial<DialogOptions>;
}
