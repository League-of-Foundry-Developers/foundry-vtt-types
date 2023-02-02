export {};

declare global {
  interface DialogOptions extends ApplicationOptions {
    /**
     * Whether to provide jQuery objects to callback functions (if true) or plain
     * HTMLElement instances (if false). This is currently true by default but in the
     * future will become false by default.
     * @defaultValue `true`
     */
    jQuery?: boolean;
  }

  interface DialogButton<T = unknown, JQueryOrHtml = JQuery | HTMLElement> {
    /**
     * A Font Awesome icon for the button
     */
    icon: string;

    /**
     * The label for the button
     */
    label: string;

    /**
     * Whether the button is disabled
     */
    disabled?: boolean;

    /**
     * A callback function that fires when the button is clicked
     */
    callback?: (html: JQueryOrHtml, event?: MouseEvent) => T;
  }

  interface DialogData<JQueryOrHtml = JQuery | HTMLElement> {
    /**
     * The window title displayed in the dialog header
     */
    title: string;

    /**
     * HTML content for the dialog form
     */
    content: string;

    /**
     * The buttons which are displayed as action choices for the dialog
     */
    buttons: Record<string, DialogButton<unknown, JQueryOrHtml>>;

    /**
     * The name of the default button which should be triggered on Enter keypress
     */
    default?: string | undefined;

    /**
     * A callback function invoked when the dialog is rendered
     */
    render?: (element: JQueryOrHtml) => void;

    /**
     * Common callback operations to perform when the dialog is closed
     */
    close?: (element: JQueryOrHtml) => void;
  }

  /**
   * Create a modal dialog window displaying a title, a message, and a set of buttons which trigger callback functions.
   *
   * @example Constructing a custom dialog instance
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
  class Dialog<Options extends DialogOptions = DialogOptions> extends Application<Options> {
    /**
     * @param data    - An object of dialog data which configures how the modal window is rendered
     * @param options - Dialog rendering options, see {@link Application}
     */
    constructor(data: DialogData, options?: Partial<Options>);

    data: DialogData;

    /**
     * A bound instance of the _onKeyDown method which is used to listen to keypress events while the Dialog is active.
     */
    #onKeyDown: ((event: KeyboardEvent) => MaybePromise<void>) | undefined;

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   template: "templates/hud/dialog.html",
     *   focus: true,
     *   classes: ["dialog"],
     *   width: 400,
     *   jQuery: true
     * })
     * ```
     */
    static override get defaultOptions(): DialogOptions;

    override get title(): string;

    override getData(options?: Partial<Options>): MaybePromise<object>;

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
    protected _onKeyDown(event: KeyboardEvent & { key: "Escape" }): Promise<void>;
    protected _onKeyDown(event: KeyboardEvent): void;

    override _renderOuter(): ReturnType<Application["_renderOuter"]>;

    /**
     * Submit the Dialog by selecting one of its buttons
     * @param button - The configuration of the chosen button
     * @param event - The originating click event
     */
    protected submit(button: DialogButton, event?: MouseEvent): void;

    override close(options?: Application.CloseOptions): Promise<void>;

    /**
     * A helper factory method to create simple confirmation dialog windows which consist of simple yes/no prompts.
     * If you require more flexibility, a custom Dialog instance is preferred.
     *
     * @param config - Confirmation dialog configuration (defaultValue: `{}`)
     * @returns A promise which resolves once the user makes a choice or closes the window.
     *
     * @example Prompt the user with a yes or no question
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
      config: Dialog.ConfirmConfig<Yes, No, JQuery> & { options?: { jQuery?: true }; rejectClose: true }
    ): Promise<Yes | No>;
    static confirm<Yes = true, No = false>(
      config: Dialog.ConfirmConfig<Yes, No, JQuery> & { options?: { jQuery?: true } }
    ): Promise<Yes | No | null>;
    static confirm<Yes = true, No = false>(
      config: Dialog.ConfirmConfig<Yes, No, HTMLElement> & { options: { jQuery: false }; rejectClose: true }
    ): Promise<Yes | No>;
    static confirm<Yes = true, No = false>(
      config: Dialog.ConfirmConfig<Yes, No, HTMLElement> & { options: { jQuery: false } }
    ): Promise<Yes | No | null>;
    static confirm<Yes = true, No = false>(
      config: Dialog.ConfirmConfig<Yes, No, JQuery | HTMLElement> & { rejectClose: true }
    ): Promise<Yes | No>;
    static confirm<Yes = true, No = false>(
      config?: Dialog.ConfirmConfig<Yes, No, JQuery | HTMLElement>
    ): Promise<Yes | No | null>;

    /**
     * A helper factory method to display a basic "prompt" style Dialog with a single button
     * @param config - Dialog configuration options
     * @returns A promise which resolves when clicked, or rejects if closed
     */
    static prompt<T>(
      config: Dialog.PromptConfig<T, JQuery> & { options?: { jQuery?: true }; rejectClose: false }
    ): Promise<T | null>;
    static prompt<T>(config: Dialog.PromptConfig<T, JQuery> & { options?: { jQuery?: true } }): Promise<T>;
    static prompt<T>(
      config: Dialog.PromptConfig<T, HTMLElement> & { options: { jQuery: false }; rejectClose: false }
    ): Promise<T | null>;
    static prompt<T>(config: Dialog.PromptConfig<T, HTMLElement> & { options: { jQuery: false } }): Promise<T>;
    static prompt<T>(config: Dialog.PromptConfig<T, JQuery | HTMLElement> & { rejectClose: false }): Promise<T | null>;
    static prompt<T>(config: Dialog.PromptConfig<T, JQuery | HTMLElement>): Promise<T>;

    /**
     * Wrap the Dialog with an enclosing Promise which resolves or rejects when the client makes a choice.
     * @param data - Data passed to the Dialog constructor
     * @param options - Options passed to the Dialog constructor
     * @param renderOptions - Options passed to the Dialog render call
     * @returns A promise which resolves to the dialogs result.
     */
    static wait<Options extends DialogOptions = DialogOptions>(
      data: DialogData<JQuery>,
      options?: Partial<DialogOptions> & { jQuery?: true },
      renderOptions?: Application.RenderOptions<Options>
    ): Promise<unknown>;
    static wait<Options extends DialogOptions = DialogOptions>(
      data: DialogData<HTMLElement>,
      options?: Partial<DialogOptions> & { jQuery?: false },
      renderOptions?: Application.RenderOptions<Options>
    ): Promise<unknown>;
    static wait<Options extends DialogOptions = DialogOptions>(
      data: DialogData<JQuery | HTMLElement>,
      options?: Partial<DialogOptions>,
      renderOptions?: Application.RenderOptions<Options>
    ): Promise<unknown>;
  }

  namespace Dialog {
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
  }
}
