import type { DeepPartial, EmptyObject, InexactPartial, MaybePromise, NullishCoalesce } from "fvtt-types/utils";
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
declare class DialogV2<
  RenderContext extends object = EmptyObject,
  Configuration extends DialogV2.Configuration = DialogV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DeepPartial<ApplicationV2.Configuration>;

  protected override _initializeApplicationOptions(options: DeepPartial<DialogV2.Configuration>): Configuration;

  protected override _renderHTML(
    _context: RenderContext,
    _options: DeepPartial<RenderOptions>,
  ): Promise<HTMLFormElement>;

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

  protected override _onFirstRender(_context: RenderContext, _options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _replaceHTML(
    result: HTMLFormElement,
    content: HTMLElement,
    _options: DeepPartial<RenderOptions>,
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
  static confirm<Options extends DialogV2.ConfirmConfig<unknown, unknown>>(
    config?: Options,
  ): Promise<DialogV2.ConfirmReturn<Options>>;

  /**
   * A utility helper to generate a dialog with a single confirmation button.
   * @returns  - Resolves to the identifier of the button used to submit the dialog,
   *             or the value returned by that button's callback. If the dialog was
   *             dismissed, and rejectClose is false, the Promise resolves to null.
   */
  static prompt<Options extends DialogV2.PromptConfig<unknown>>(
    config?: Options,
  ): Promise<DialogV2.PromptReturn<Options>>;

  /**
   * Spawn a dialog and wait for it to be dismissed or submitted.
   * @returns Resolves to the identifier of the button used to submit the
   *          dialog, or the value returned by that button's callback. If the
   *          dialog was dismissed, and rejectClose is false, the Promise
   *          resolves to null.
   */
  static wait<Options extends DialogV2.WaitOptions>(config?: Options): Promise<DialogV2.WaitReturn<Options>>;

  /**
   * Present an asynchronous Dialog query to a specific User for response.
   * @param user   - A User instance or a User id
   * @param type   - The type of Dialog to present
   * @param config - Dialog configuration forwarded on to the Dialog.prompt, Dialog.confirm, or
   *                 Dialog.wait function depending on the query type. Callback options are not supported.
   * @returns The query response or null if no response was provided
   *
   * @see {@link DialogV2.prompt}
   * @see {@link DialogV2.confirm}
   * @see {@link DialogV2.wait}
   */
  static query<T extends DialogV2.Type, Options extends DialogV2.QueryConfig<T>>(
    user: User.ConfiguredInstance | string,
    type: T,
    config?: Options,
  ): Promise<DialogV2.QueryReturn<T, Options>>;

  /**
   * The dialog query handler.
   */
  static _handleQuery<T extends DialogV2.Type, Options extends DialogV2.QueryConfig<T>>(config: {
    type: T;
    config: Options;
  }): Promise<DialogV2.QueryReturn<T, Options>>;
}

declare namespace DialogV2 {
  export interface Button<CallbackReturn = string> {
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
    callback?: ButtonCallback<CallbackReturn>;
  }

  export type ButtonCallback<T> = (
    event: PointerEvent | SubmitEvent,
    button: HTMLButtonElement,
    dialog: HTMLDialogElement,
  ) => MaybePromise<T>;

  type NoCallbackButton = Omit<Button, "callback">;

  export interface Configuration extends ApplicationV2.Configuration {
    /**
     * Modal dialogs prevent interaction with the rest of the UI until they are dismissed or submitted.
     */
    modal?: boolean;

    /**
     * Button configuration.
     */
    buttons: Button<unknown>[];

    /**
     * The dialog content: a HTML string or a <div> element.
     * If string, the content is cleaned with {@link foundry.utils.cleanHTML}.
     * Otherwise, the content is not cleaned.
     * @defaultValue `''`
     */
    content: string | HTMLDivElement;

    /**
     * A function to invoke when the dialog is submitted.
     * This will not be called if the dialog is dismissed.
     */
    submit?: SubmitCallback | null | undefined;
  }

  export type RenderCallback = (event: Event, dialog: HTMLDialogElement) => void;

  export type CloseCallback = (event: Event, dialog: DialogV2) => void;

  // This is nominally receiving the results of the button callbacks,
  // but that just further complicates the conditional types
  export type SubmitCallback = (result: unknown) => Promise<void>;

  export interface WaitOptions extends DeepPartial<Configuration> {
    /**
     * A synchronous function to invoke whenever the dialog is rendered.
     */
    render?: RenderCallback | null | undefined;

    /**
     * A synchronous function to invoke when the dialog is closed under any circumstances.
     */
    close?: CloseCallback | null | undefined;

    /**
     * Throw a Promise rejection if the dialog is dismissed.
     * @defaultValue `false`
     * @remarks `null` equivalent to `false`
     */
    rejectClose?: boolean | null | undefined;

    /**
     * The user that the dialog should be shown to.
     */
    user?: User.ConfiguredInstance;
  }

  interface ConfirmConfig<YesReturn, NoReturn> extends WaitOptions {
    /** Options to overwrite the default yes button configuration. */
    yes?: InexactPartial<Button<YesReturn>> | null | undefined;

    /** Options to overwrite the default no button configuration. */
    no?: InexactPartial<Button<NoReturn>> | null | undefined;
  }

  interface PromptConfig<OKReturn> extends WaitOptions {
    /** Options to overwrite the default confirmation button configuration. */
    ok?: InexactPartial<Button<OKReturn>> | null | undefined;
  }

  type Type = "prompt" | "confirm" | "wait";

  /**
   * @remarks Query gets passed through a socket which means it can't take a callback function on its buttons
   */
  type QueryConfig<T extends Type> = Omit<
    | (T extends "wait" ? WaitOptions : never)
    | (T extends "prompt" ? PromptConfig<never> : never)
    | (T extends "confirm" ? ConfirmConfig<never, never> : never),
    "buttons"
  > & {
    /**
     * Button configuration.
     */
    buttons?: NoCallbackButton[];
  };

  type WaitReturn<Options extends WaitOptions> = Internal.ButtonReturnType<Options> | Internal.DismissType<Options>;

  type ConfirmReturn<Options extends ConfirmConfig<unknown, unknown>> =
    | Internal.ConfirmReturnType<Options>
    | WaitReturn<Options>;

  type PromptReturn<Options extends PromptConfig<unknown>> = Internal.PromptReturnType<Options> | WaitReturn<Options>;

  type QueryReturn<T extends Type, Options extends QueryConfig<T>> =
    | (T extends "confirm" ? boolean : string)
    | DialogV2.Internal.DismissType<Options>;

  namespace Internal {
    type DismissType<Options extends { rejectClose?: boolean | null | undefined }> = Options["rejectClose"] extends true
      ? never
      : null;

    type ButtonReturnType<Options extends { buttons?: Button<unknown>[] }> =
      // Two cases - one for where all buttons have a defined callback, the other where they don't
      Options["buttons"] extends ReadonlyArray<{ callback: ButtonCallback<infer Callback> }>
        ? Callback extends undefined
          ? string
          : Callback
        : Options["buttons"] extends ReadonlyArray<Button<infer Callback>>
          ? Callback | string
          : never;

    type ConfirmReturnType<Options extends ConfirmConfig<unknown, unknown>> =
      | (Options extends { yes: { readonly callback: ButtonCallback<infer YesReturn> } }
          ? NullishCoalesce<YesReturn, true>
          : true)
      | (Options extends { no: { readonly callback: ButtonCallback<infer NoReturn> } }
          ? NullishCoalesce<NoReturn, false>
          : false);

    type PromptReturnType<Options extends PromptConfig<unknown>> = Options extends {
      ok: {
        readonly callback: ButtonCallback<infer OKReturn>;
      };
    }
      ? NullishCoalesce<OKReturn, string>
      : string;
  }
}

export default DialogV2;
