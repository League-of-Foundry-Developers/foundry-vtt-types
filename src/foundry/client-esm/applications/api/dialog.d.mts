import type {
  AnyArray,
  AnyConstructor,
  AnyFunction,
  AnyObject,
  Coalesce,
  DeepPartial,
  EmptyObject,
  GetKey,
  InexactPartial,
  IntentionalPartial,
  MaybePromise,
  NullishCoalesce,
  SimpleMerge,
} from "fvtt-types/utils";
import type ApplicationV2 from "./application.d.mts";

type DeepInexactPartial<T> = T extends object
  ? T extends AnyArray | AnyFunction | AnyConstructor
    ? T
    : {
        [K in keyof T]?: DeepInexactPartial<T[K]> | undefined;
      }
  : T;

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
  // TODO(LukeAbby): The `any` is unideal but it's to to stymy a circularity when it's `DialogV2`.
  Configuration extends DialogV2.Configuration = DialogV2.Configuration<any>,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DeepPartial<ApplicationV2.Configuration> & object;

  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  /**
   * @remarks Note: fvtt-types assumes that the default form contains no values. Specifically this
   * is important for `DialogV2.input` where it assumes that given no `content` it can return `{}`.
   * In theory you could override `_renderHTML` to add a custom `form`.
   *
   * This could make `DialogV2.input` incorrectly typed but it is assumed that such a use case would
   * be better served with a custom `ApplicationV2` subclass. Therefore this use case isn't
   * accounted for. However if it would be important to you, please let us know.
   */
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

  protected override _onFirstRender(
    _context: DeepPartial<RenderContext>,
    _options: DeepPartial<RenderOptions>,
  ): Promise<void>;

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
   *
   * @remarks The callbacks within `config.buttons` are called with an instance of the current class.
   * While many users likely will not notice, if this ends up effecting you then you will need to
   * make an override to provide the current class. For example:
   * ```typescript
   * class YourDialog extends DialogV2 {
   *   static confirm<const Config extends DialogV2.ConfirmConfig<YourDialog> | undefined = undefined>(
   *     config?: Config,
   *   ): Promise<DialogV2.ConfirmReturn<Config>> {
   *     return super.confirm(config);
   *   };
   * }
   * ```
   */
  static confirm<const Config extends DialogV2.ConfirmConfig | undefined = undefined>(
    config?: Config,
  ): Promise<DialogV2.ConfirmReturn<Config>>;

  /**
   * A utility helper to generate a dialog with a single confirmation button.
   * @returns  - Resolves to the identifier of the button used to submit the dialog,
   *             or the value returned by that button's callback. If the dialog was
   *             dismissed, and rejectClose is false, the Promise resolves to null.
   *
   * @remarks The callbacks within `config.buttons` are called with an instance of the current class.
   * While many users likely will not notice, if this ends up effecting you then you will need to
   * make an override to provide the current class. For example:
   * ```typescript
   * class YourDialog extends DialogV2 {
   *   static prompt<const Config extends DialogV2.PromptConfig | undefined = undefined>(
   *     config?: Config,
   *   ): Promise<DialogV2.PromptReturn<Config>> {
   *     return super.prompt(config);
   *   };
   * }
   * ```
   */
  static prompt<const Config extends DialogV2.PromptConfig | undefined = undefined>(
    config?: Config,
  ): Promise<DialogV2.PromptReturn<Config>>;

  /**
   * A utility helper to generate a dialog for user input.
   * @param config - Options to overwrite the default confirmation button configuration.
   * @returns Resolves to the data of the form if the ok button was pressed,
   *          or the value returned by that button's callback. If additional
   *          buttons were provided, the Promise resolves to the identifier of
   *          the one that was pressed, or the value returned by its callback.
   *          If the dialog was dismissed, and rejectClose is false, the Promise
   *          resolves to null.
   *
   * @remarks `input` by default returns form data derived from `config.content`. Unfortunately this
   * means that short of writing an HTML parser to support automatically deriving this, the caller
   * must hint at the return type. Specifically a call should look something like this:
   * ```typescript
   * DialogV2.input({
   *   content: `<form>
   *     <label><input type="radio" name="choice" value="one" checked> Option 1</label>
   *     <label><input type="radio" name="choice" value="two"> Option 2</label>
   *     <label><input type="radio" name="choice" value="three"> Options 3</label>
   *   </form>` as DialogV2.Content<{ choice: "one" | "two" | "three" }>;
   * });
   * ```
   * The added `as DialogV2.Content` allows fvtt-types to extract out the shape of the form content.
   * This gives you the correct return type instead of `AnyObject`.
   *
   * Additionally, the callbacks within `config.buttons` are called with an instance of the current class.
   * While many users likely will not notice, if this ends up effecting you then you will need to
   * make an override to provide the current class. For example:
   * ```typescript
   * class YourDialog extends DialogV2 {
   *   static input<const Config extends DialogV2.InputConfig<YourDialog> | undefined = undefined>(
   *     config?: Config,
   *   ): Promise<DialogV2.InputReturn<Config>> {
   *     return super.input(config);
   *   };
   * }
   * ```
   */
  static input<const Config extends DialogV2.InputConfig | undefined = undefined>(
    config?: Config,
  ): Promise<DialogV2.InputReturn<Config>>;

  /**
   * Spawn a dialog and wait for it to be dismissed or submitted.
   * @returns Resolves to the identifier of the button used to submit the
   *          dialog, or the value returned by that button's callback. If the
   *          dialog was dismissed, and rejectClose is false, the Promise
   *          resolves to null.
   *
   * @remarks The callbacks within `config.buttons` are called with an instance of the current class.
   * While many users likely will not notice, if this ends up effecting you then you will need to
   * make an override to provide the current class. For example:
   * ```typescript
   * class YourDialog extends DialogV2 {
   *   static wait<const Config extends DialogV2.WaitOptions<YourDialog>>(
   *     config: Config,
   *   ): Promise<DialogV2.WaitReturn<Config>> {
   *     return super.wait(config);
   *   };
   * }
   * ```
   */
  static wait<const Config extends DialogV2.WaitOptions>(config: Config): Promise<DialogV2.WaitReturn<Config>>;

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
   *
   * @remarks The callbacks within `config.buttons` are called with an instance of the current class.
   * While many users likely will not notice, if this ends up effecting you then you will need to
   * make an override to provide the current class. For example:
   * ```typescript
   * class YourDialog extends DialogV2 {
   *   static query<T extends DialogV2.Type, const Options extends DialogV2.QueryConfig<T>>(
   *     user: User.Implementation | string,
   *     type: T,
   *     config: Options,
   *   ): Promise<DialogV2.QueryReturn<T, Options>> {
   *     return super.query(user, type, config);
   *   };
   * }
   * ```
   */
  static query<T extends DialogV2.Type, const Options extends DialogV2.QueryConfig<T>>(
    user: User.Implementation | string,
    type: T,
    config: Options,
  ): Promise<DialogV2.QueryReturn<T, Options>>;

  /**
   * The dialog query handler.
   */
  static _handleQuery<T extends DialogV2.Type, const Options extends DialogV2.QueryConfig<T>>(config: {
    type: T;
    config: Options;
  }): Promise<DialogV2.QueryReturn<T, Options>>;
}

declare namespace DialogV2 {
  interface Button<Dialog extends DialogV2 = DialogV2> {
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
    callback?: ButtonCallback<Dialog>;
  }

  type ButtonCallback<Dialog extends DialogV2 = DialogV2> = (
    event: PointerEvent | SubmitEvent,
    button: HTMLButtonElement,
    dialog: Dialog,
  ) => MaybePromise<unknown>;

  interface Configuration<Dialog extends DialogV2 = DialogV2> extends ApplicationV2.Configuration {
    /**
     * Modal dialogs prevent interaction with the rest of the UI until they are dismissed or submitted.
     */
    modal?: boolean | null | undefined;

    /**
     * Button configuration.
     * @remarks Must have at least one button or else `DialogV2#_initializeApplicationOptions` will
     * throw.
     */
    buttons: Button<Dialog>[];

    /**
     * The dialog content: a HTML string or a <div> element.
     * If string, the content is cleaned with {@link foundry.utils.cleanHTML}.
     * Otherwise, the content is not cleaned.
     * @defaultValue `''`
     */
    content: string | HTMLDivElement | Content<AnyObject>;

    /**
     * A function to invoke when the dialog is submitted.
     * This will not be called if the dialog is dismissed.
     */
    // TODO(LukeAbby): This will probably never be sufficiently typed.
    submit?: SubmitCallback<unknown, Dialog> | null | undefined;
  }

  type Content<Data extends AnyObject, BaseType extends string | HTMLDivElement = string | HTMLDivElement> = BaseType &
    Internal.FormContent<Data>;

  type RenderCallback = (event: Event, dialog: HTMLDialogElement) => void;

  type CloseCallback = (event: Event, dialog: DialogV2) => void;

  type SubmitCallback<Result, Dialog extends DialogV2 = DialogV2> = (result: Result, dialog: Dialog) => Promise<void>;

  interface WaitOptions<Dialog extends DialogV2 = DialogV2> extends DeepInexactPartial<Configuration<Dialog>> {
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

    // TODO(LukeAbby): Once ApplicationV2's required options infrastructure is set up this shouldn't
    // be necessary.
    buttons: Button<Dialog>[];
  }

  // Note(LukeAbby): `IntentionalPartial` is used for all the buttons because `mergeObject` is
  // called. For example `{ action: undefined }` would be a logical bug.
  interface ConfirmConfig<Dialog extends DialogV2 = DialogV2> extends InexactPartial<WaitOptions<Dialog>, "buttons"> {
    /** Options to overwrite the default yes button configuration. */
    yes?: IntentionalPartial<Button<Dialog>> | null | undefined;

    /** Options to overwrite the default no button configuration. */
    no?: IntentionalPartial<Button<Dialog>> | null | undefined;
  }

  interface PromptConfig<Dialog extends DialogV2 = DialogV2> extends InexactPartial<WaitOptions<Dialog>, "buttons"> {
    /** Options to overwrite the default confirmation button configuration. */
    ok?: IntentionalPartial<Button<Dialog>> | null | undefined;
  }

  type FormContent<FormData extends object> = (string | HTMLDivElement) & { " __fvtt_types_form_data": FormData };

  /** @typeParam FD - The form data */
  interface InputConfig<Dialog extends DialogV2 = DialogV2> extends PromptConfig<Dialog> {}

  type Type = "prompt" | "confirm" | "wait" | "input";

  /**
   * @remarks Query gets passed through a socket which means it can't take a callback function on its buttons
   */
  type QueryConfig<T extends Type, Dialog extends DialogV2 = DialogV2> =
    | (T extends "wait" ? Internal.QueryWaitOptions<Dialog> : never)
    | (T extends "prompt" ? Internal.QueryPromptConfig<Dialog> : never)
    | (T extends "confirm" ? Internal.QueryConfirmConfig<Dialog> : never)
    | (T extends "input" ? Internal.QueryInputConfig<Dialog> : never);

  // Note(LukeAbby): The usage of `<never>` is because `WaitOptions` is contravariant over `Dialog`.
  // This applies in many different places but is only noted here.
  type WaitReturn<Options extends WaitOptions<never>> = Internal.WaitReturn<Options>;

  interface ConfirmYesButton {
    action: "yes";
    label: "Yes";
    icon: "fa-solid fa-check";
    callback: () => true;
  }

  interface ConfirmNoButton {
    action: "no";
    label: "No";
    icon: "fa-solid fa-xmark";
    default: true;
    callback: () => false;
  }

  type ConfirmReturn<Options extends ConfirmConfig<never> | undefined> =
    Options extends ConfirmConfig<never>
      ? WaitReturn<{
          buttons: [
            Internal.MergePartial<ConfirmYesButton, Options["yes"]>,
            Internal.MergePartial<ConfirmNoButton, Options["no"]>,
            ...Coalesce<Options["buttons"], []>,
          ];
        }>
      : WaitReturn<{ buttons: [ConfirmYesButton, ConfirmNoButton] }>;

  interface PromptOkButton {
    action: "ok";
    label: "Confirm";
    icon: "fa-solid fa-check";
    default: true;
  }

  type PromptReturn<Config extends PromptConfig<never> | undefined> =
    Config extends PromptConfig<never>
      ? Internal.WaitReturn<
          SimpleMerge<
            Config,
            {
              buttons: [
                // eslint-disable-next-line @typescript-eslint/no-empty-object-type
                Internal.MergePartial<PromptOkButton, GetKey<Config, "ok", {}>>,
                ...Coalesce<GetKey<Config, "buttons", undefined>, []>,
              ];
            }
          >
        >
      : WaitReturn<{ buttons: [PromptOkButton] }>;

  type InputReturn<Config extends PromptConfig<never> | undefined> =
    Config extends PromptConfig<never>
      ? PromptReturn<
          {
            // eslint-disable-next-line @typescript-eslint/no-empty-object-type
            ok: SimpleMerge<{ callback: () => Internal.ContentFormData<Config> }, GetKey<Config, "ok", {}>>;
          } & Omit<Config, "ok">
        >
      : PromptReturn<{ ok: { callback: () => EmptyObject } }>;

  type QueryReturn<T extends Type, Options extends QueryConfig<T, never>> =
    | (T extends "prompt" ? PromptReturn<Options> : never)
    | (T extends "confirm" ? ConfirmReturn<Options> : never)
    // Note(LukeAbby): `Internal.WaitReturn` is used to get around the fact that TypeScript can't be
    // sure that `buttons` is required in `QueryConfig<T, never>` if `T = "wait"`. TypeScript is
    // technically correct as this does subvert the soundness as if `T = "wait" | OtherType` then
    // invalid options would be possible.
    | (T extends "wait" ? Internal.WaitReturn<Options> : never)
    | (T extends "input" ? InputReturn<Options> : never);

  namespace Internal {
    type WaitReturn<Options> = Internal.ButtonReturnType<Options> | Internal.DismissType<Options>;

    type DismissType<Options> = Options extends {
      readonly rejectClose: true;
    }
      ? never
      : null;

    type ButtonReturnType<Options> =
      GetKey<Options, "buttons", undefined> extends ReadonlyArray<infer B extends Button<never>>
        ? B extends unknown
          ? OneButtonReturnType<B["callback"], B["action"]>
          : never
        : undefined;

    type OneButtonReturnType<Callback, Action> = Callback extends () => infer Return ? Return : Action;

    type ConfirmReturnType<Options extends ConfirmConfig<never> | undefined> =
      | (Options extends { readonly yes: { readonly callback: ButtonCallback<infer YesReturn> } }
          ? NullishCoalesce<YesReturn, true>
          : true)
      | (Options extends { readonly no: { readonly callback: ButtonCallback<infer NoReturn> } }
          ? NullishCoalesce<NoReturn, false>
          : false);

    type ContentFormData<Config extends PromptConfig<never> | undefined> = GetFormContent<
      GetKey<Config, "content", undefined>
    >;

    // Note(LukeAbby): The constraint should be `string | HTMLDivElement | Content<AnyObject> | undefined`
    // but currently it's actually `DeepInexactPartial<HTMLDivElement>` which, needless to say, is incorrect.
    // However this will require an `ApplicationV2` refactor to fix.
    type GetFormContent<C> = C extends Content<infer Content> ? Content : C extends undefined ? EmptyObject : AnyObject;

    interface NoCallbackButton extends Button<never> {
      /**
       * @deprecated A callback is not allowed in `query` as the data must all be serializable.
       */
      callback?: never;
    }

    interface QueryWaitOptions<Dialog extends DialogV2> extends WaitOptions<Dialog> {
      buttons: NoCallbackButton[];
    }

    interface QueryPromptConfig<Dialog extends DialogV2> extends PromptConfig<Dialog> {
      buttons?: NoCallbackButton[];
    }

    interface QueryConfirmConfig<Dialog extends DialogV2> extends ConfirmConfig<Dialog> {
      buttons?: NoCallbackButton[];
    }

    interface QueryInputConfig<Dialog extends DialogV2> extends InputConfig<Dialog> {
      buttons?: NoCallbackButton[];
    }

    // Merges `T` and `U` while assuming `U` is essentially `Partial<T>`.
    // This is useful in `ConfirmReturn` as it allows modelling the _valid_ uses of `mergeObject` in
    // `DialogV2.confirm`.
    // May need to be polished later.
    type MergePartial<T, U> = {
      [K in keyof T]: U extends { readonly [_ in K]: infer V } ? V : T[K];
    } & Omit<U, keyof T>;

    class FormContent<Content extends AnyObject> {
      #content: Content;
    }
  }
}

export default DialogV2;
