import type { AnyFunction, DeepPartial, EmptyObject } from "../../../../utils/index.d.mts";
import type ApplicationV2 from "./application.d.mts";

/**
 * A lightweight Application that renders a dialog containing a form with arbitrary content, and some buttons.
 *
 * @example Prompt the user to confirm an action.
 * ```js
 * const proceed = await foundry.applications.api.DialogV2.confirm({
 *   content: "Are you sure?",
 *   rejectClose: false,
 *   modal: true
 * });
 * if ( proceed ) console.log("Proceed.");
 * else console.log("Do not proceed.");
 * ```
 *
 * @example Prompt the user for some input.
 * ```js
 * let guess;
 * try {
 *   guess = await foundry.applications.api.DialogV2.prompt({
 *     window: { title: "Guess a number between 1 and 10" },
 *     content: '<input name="guess" type="number" min="1" max="10" step="1" autofocus>',
 *     ok: {
 *       label: "Submit Guess",
 *       callback: (event, button, dialog) => button.form.elements.guess.valueAsNumber
 *     }
 *   });
 * } catch {
 *   console.log("User did not make a guess.");
 *   return;
 * }
 * const n = Math.ceil(CONFIG.Dice.randomUniform() * 10);
 * if ( n === guess ) console.log("User guessed correctly.");
 * else console.log("User guessed incorrectly.");
 * ```
 *
 * @example A custom dialog.
 * ```js
 * new foundry.applications.api.DialogV2({
 *   window: { title: "Choose an option" },
 *   content: `
 *     <label><input type="radio" name="choice" value="one" checked> Option 1</label>
 *     <label><input type="radio" name="choice" value="two"> Option 2</label>
 *     <label><input type="radio" name="choice" value="three"> Options 3</label>
 *   `,
 *   buttons: [{
 *     action: "choice",
 *     label: "Make Choice",
 *     default: true,
 *     callback: (event, button, dialog) => button.form.elements.choice.value
 *   }, {
 *     action: "all",
 *     label: "Take All"
 *   }],
 *   submit: result => {
 *     if ( result === "all" ) console.log("User picked all options.");
 *     else console.log(`User picked option: ${result}`);
 *   }
 * }).render({ force: true });
 * ```
 */
declare class DialogV2 extends ApplicationV2<EmptyObject, DialogV2.Configuration> {
  static override DEFAULT_OPTIONS: DeepPartial<ApplicationV2.Configuration>;

  protected override _initializeApplicationOptions(
    options: DeepPartial<DialogV2.Configuration>,
  ): DialogV2.Configuration;

  protected override _renderHTML(_context: unknown, _options: ApplicationV2.RenderOptions): Promise<HTMLFormElement>;

  /**
   * Render configured buttons.
   */
  protected _renderButtons(): string;

  /**
   * Handle submitting the dialog.
   * @param target - The button that was clicked or the default button.
   * @param event - The triggering event.
   */
  protected _onSubmit(target: HTMLButtonElement, event: PointerEvent | SubmitEvent): Promise<DialogV2>;

  protected override _onFirstRender(_context: EmptyObject, _options: DeepPartial<ApplicationV2.RenderOptions>): void;

  protected override _replaceHTML(
    result: HTMLFormElement,
    content: HTMLElement,
    _options: DeepPartial<ApplicationV2.RenderOptions>,
  ): void;

  /**
   * Handle keypresses within the dialog.
   * @param event - The triggering event.
   */
  protected _onKeyDown(event: KeyboardEvent): void;

  /**
   * @param event - The originating click event.
   * @param target - The button element that was clicked.
   */
  protected static _onClickButton(this: DialogV2, event: PointerEvent, target: HTMLButtonElement): void;

  /**
   * A utility helper to generate a dialog with yes and no buttons.
   * @returns Resolves to true if the yes button was pressed, or false if the no button
   *          was pressed. If additional buttons were provided, the Promise resolves to
   *          the identifier of the one that was pressed, or the value returned by its
   *          callback. If the dialog was dismissed, and rejectClose is false, the
   *          Promise resolves to null.
   */
  static confirm<Options extends Partial<DialogV2.WaitOptions>, YesReturn = true, NoReturn = false>(
    options?: Options & {
      /** Options to overwrite the default yes button configuration. */
      yes?: DialogV2.Button<YesReturn>;
      /** Options to overwrite the default no button configuration. */
      no?: DialogV2.Button<NoReturn>;
    },
  ): Promise<YesReturn | NoReturn | InferButtonReturnTypes<Options> | InferDismissType<Options>>;

  /**
   * A utility helper to generate a dialog with a single confirmation button.
   * @returns  - Resolves to the identifier of the button used to submit the dialog,
   *             or the value returned by that button's callback. If the dialog was
   *             dismissed, and rejectClose is false, the Promise resolves to null.
   */
  static prompt<Options extends Partial<DialogV2.WaitOptions>, OKReturn = string>(
    options?: Options & {
      /** Options to overwrite the default confirmation button configuration. */
      ok?: Partial<DialogV2.Button<OKReturn>>;
    },
  ): Promise<OKReturn | InferButtonReturnTypes<Options> | InferDismissType<Options>>;

  /**
   * Spawn a dialog and wait for it to be dismissed or submitted.
   * @returns Resolves to the identifier of the button used to submit the
   *          dialog, or the value returned by that button's callback. If the
   *          dialog was dismissed, and rejectClose is false, the Promise
   *          resolves to null.
   * @remarks Despite being the `wait` function this doesn't actually use that interface
   */
  static wait<Options extends Partial<DialogV2.Configuration>>(
    options?: Options & {
      /** A function to invoke whenever the dialog is rendered. */
      render?: DialogV2.RenderCallback;
      /** A function to invoke when the dialog is closed under any circumstances. */
      close?: DialogV2.CloseCallback;
      /**
       * Throw a Promise rejection if the dialog is dismissed.
       * @defaultValue `true`
       */
      rejectClose?: boolean;
    },
  ): Promise<InferButtonReturnTypes<Options> | InferDismissType<Options>>;
}

declare namespace DialogV2 {
  export interface Button<CallBackReturn> {
    /**
     * The button action identifier.
     */
    action: string;

    /**
     * The button label. Will be localized.
     */
    label: string;

    /**
     * FontAwesome icon classes.
     */
    icon?: string;

    /**
     * CSS classes to apply to the button.
     */
    class?: string;

    /**
     * Whether this button represents the default action to take if the user
     * submits the form without pressing a button, i.e. with an Enter
     * keypress.
     */
    default?: boolean;

    /**
     * A function to invoke when the button is clicked. The value returned
     * from this function will be used as the dialog's submitted value.
     * Otherwise, the button's identifier is used.
     */
    callback?: ButtonCallback<CallBackReturn>;
  }

  export type ButtonCallback<T> = (
    event: PointerEvent | SubmitEvent,
    button: HTMLButtonElement,
    dialog: HTMLDialogElement,
  ) => Promise<T>;

  export interface Configuration extends ApplicationV2.Configuration {
    /**
     * Modal dialogs prevent interaction with the rest of the UI until they
     * are dismissed or submitted.
     */
    modal?: boolean;

    /**
     * Button configuration.
     */
    buttons: Button<any>[];

    /**
     * The dialog content.
     */
    content?: string;

    /**
     * A function to invoke when the dialog is submitted. This will not be
     * called if the dialog is dismissed.
     */
    submit?: SubmitCallback;
  }

  // TODO(LukeAbby): I moved these types over from `_types.d.mts` mostly as-is. However this usage of `any` is suspicious and needs auditing.

  export type RenderCallback = (event: Event, dialog: HTMLDialogElement) => any;

  export type CloseCallback = (event: Event, dialog: DialogV2) => any;

  export type SubmitCallback = (result: any) => Promise<void>;

  export interface WaitOptions extends Configuration {
    /**
     * A synchronous function to invoke whenever the dialog is rendered.
     */
    render?: RenderCallback;

    /**
     * A synchronous function to invoke when the dialog is closed under any
     * circumstances.
     */
    close?: CloseCallback;

    /**
     * Throw a Promise rejection if the dialog is dismissed.
     * @defaultValue `true`
     */
    rejectClose?: boolean;
  }
}

type InferDismissType<Options extends Partial<DialogV2.WaitOptions>> = Options["rejectClose"] extends boolean
  ? Options["rejectClose"] extends true
    ? never
    : null
  : never;

type InferButtonReturnTypes<Options extends Partial<DialogV2.WaitOptions>> =
  Options["buttons"] extends Array<infer Button>
    ? Button extends DialogV2.Button<infer Callback>
      ? Button["callback"] extends AnyFunction
        ? Callback
        : string
      : never
    : never;

export default DialogV2;
