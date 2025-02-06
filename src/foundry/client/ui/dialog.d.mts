import type { MaybePromise } from "fvtt-types/utils";

declare global {
  /** @deprecated {@link Dialog.Options | `Dialog.Options`} */
  type DialogOptions = Dialog.Options;

  /** @deprecated {@link Dialog.Button | `Dialog.Button`} */
  type DialogButton = Dialog.Button;

  /** @deprecated {@link Dialog.Data | `Dialog.Data`} */
  type DialogData<JQueryOrHTML extends JQuery | HTMLElement = JQuery | HTMLElement> = Dialog.Data<JQueryOrHTML>;

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
  class Dialog<Options extends Dialog.Options = Dialog.Options> extends Application<Options> {
    /**
     * @param data    - An object of dialog data which configures how the modal window is rendered
     * @param options - Dialog rendering options, see {@link Application}
     */
    constructor(data: Dialog.Data<Dialog.JQueryOrHTML<Options>>, options?: Partial<Options>);

    data: Dialog.Data<JQuery | HTMLElement>;

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
    static override get defaultOptions(): Dialog.Options;

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
    protected submit(button: Dialog.Button, event?: MouseEvent): void;

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
    static confirm<
      const Yes = true,
      const No = false,
      const RejectClose extends boolean | undefined = undefined,
      const Options extends Partial<Dialog.Options> | undefined = undefined,
    >(
      config?: Dialog.ConfirmConfig<Yes, No, RejectClose, Options>,
    ): Promise<Yes | No | Dialog.OnReject<RejectClose, false>>;

    /**
     * A helper factory method to display a basic "prompt" style Dialog with a single button
     * @param config - Dialog configuration options
     * @returns A promise which resolves when clicked, or rejects if closed
     */
    static prompt<
      const Value,
      const RejectClose extends boolean | undefined = undefined,
      const Options extends Partial<Dialog.Options> | undefined = undefined,
    >(config: Dialog.PromptConfig<Value, RejectClose, Options>): Promise<Value | Dialog.OnReject<RejectClose, true>>;

    /**
     * Wrap the Dialog with an enclosing Promise which resolves or rejects when the client makes a choice.
     * @param data - Data passed to the Dialog constructor
     * @param options - Options passed to the Dialog constructor
     * @param renderOptions - Options passed to the Dialog render call
     * @returns A promise which resolves to the dialogs result.
     */
    static wait<const Options extends Partial<Dialog.Options> | undefined = undefined>(
      data: Dialog.Data<Dialog.JQueryOrHTML<Options>>,
      options?: Options,
      renderOptions?: Options & Application._RenderOptions,
    ): Promise<unknown>;
  }

  namespace Dialog {
    /** @internal */
    type _JQueryOrHTML<IsJQuery extends boolean> = IsJQuery extends true ? JQuery : HTMLElement;

    type JQueryOrHTML<Options extends Partial<Dialog.Options> | undefined> = _JQueryOrHTML<
      Options extends {
        readonly jQuery: infer JQuery;
      }
        ? JQuery
        : true
    >;

    /**
     * @typeParam Yes - The value returned by the yes callback
     * @typeParam No  - The value returned by the no callback
     */
    interface ConfirmConfig<
      Yes,
      No,
      RejectClose extends boolean | undefined,
      Options extends Partial<Dialog.Options> | undefined,
    > {
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
      // Note(LukeAbby): This is a workaround for the lack of `const` type parameters in interfaces.
      yes?: (html: JQueryOrHTML<Options>) => Yes | true;

      /**
       * Callback function upon no
       */
      no?: (html: JQueryOrHTML<Options>) => No | false;

      /**
       * A function to call when the dialog is rendered
       */
      render?: (html: JQueryOrHTML<Options>) => void;

      /**
       * Make "yes" the default choice?
       * @defaultValue `true`
       */
      defaultYes?: boolean;

      /**
       * Reject the Promise if the Dialog is closed without making a choice.
       * @defaultValue `false`
       */
      rejectClose?: RejectClose;

      /**
       * Additional rendering options passed to the Dialog
       * @defaultValue `{}`
       */
      options?: Options;
    }

    type OnReject<RejectClose extends boolean | undefined, Default extends boolean> = RejectClose extends undefined
      ? Default extends false
        ? null
        : never
      : RejectClose extends false
        ? null
        : never;

    /**
     * @typeParam Value - The value returned by the callback function
     */
    interface PromptConfig<
      Value,
      RejectClose extends boolean | undefined,
      Options extends Partial<Dialog.Options> | undefined,
    > {
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
      callback: (html: JQueryOrHTML<Options>) => Value;

      /**
       * A function that fires after the dialog is rendered
       */
      render?: (html: JQueryOrHTML<Options>) => void;

      /**
       * Reject the promise if the dialog is closed without confirming the
       * choice, otherwise resolve as null
       * @defaultValue `true`
       */
      rejectClose?: RejectClose;

      /**
       * Additional rendering options
       * @defaultValue `{}`
       */
      options?: Options;
    }

    interface Options extends ApplicationOptions {
      /**
       * Whether to provide jQuery objects to callback functions (if true) or plain
       * HTMLElement instances (if false). This is currently true by default but in the
       * future will become false by default.
       * @defaultValue `true`
       */
      jQuery?: boolean;
    }

    interface Button<T = unknown, JQueryOrHtml = JQuery | HTMLElement> {
      /**
       * A Font Awesome icon for the button
       */
      icon?: string;

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

    interface Data<JQueryOrHTML extends JQuery | HTMLElement> {
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
      buttons: Record<string, Button<unknown, JQueryOrHTML>>;

      /**
       * The name of the default button which should be triggered on Enter keypress
       */
      default?: string;

      /**
       * A callback function invoked when the dialog is rendered
       */
      render?: (element: JQueryOrHTML) => void;

      /**
       * Common callback operations to perform when the dialog is closed
       */
      close?: (element: JQueryOrHTML) => void;
    }
  }
}
