import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

import DiceTerm = foundry.dice.terms.DiceTerm;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      RollResolver: RollResolver.Any;
    }
  }
}

/**
 * An application responsible for handling unfulfilled dice terms in a roll.
 */
declare class RollResolver<
  RenderContext extends RollResolver.RenderContext = RollResolver.RenderContext,
  Configuration extends RollResolver.Configuration = RollResolver.Configuration,
  RenderOptions extends RollResolver.RenderOptions = RollResolver.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  constructor(roll: Roll, options?: DeepPartial<Configuration>);

  /**
   * @defaultValue
   * ```js
   * {
   *   id: "roll-resolver-{id}",
   *   tag: "form",
   *   classes: ["roll-resolver"],
   *   window: {
   *     title: "DICE.RollResolution"
   *   },
   *   position: {width: 500},
   *   form: {
   *     submitOnChange: false,
   *     closeOnSubmit: false,
   *     handler: RollResolver._fulfillRoll
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: RollResolver.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   form: {
   *     id: "form",
   *     template: "templates/dice/roll-resolver.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * A collection of fulfillable dice terms.
   */
  get fulfillable(): Map<string, RollResolver.DiceTermFulfillmentDescriptor>;

  /**
   * The roll being resolved.
   */
  get roll(): Roll;

  /**
   * Identify any terms in this Roll that should be fulfilled externally, and prompt the user to do so.
   * @returns Returns a Promise that resolves when the first pass of fulfillment is complete.
   */
  awaitFulfillment(): Promise<void>;

  /**
   * Register a fulfilled die roll.
   * @param method        - The method used for fulfillment.
   * @param denomination  - The denomination of the fulfilled die.
   * @param result        - The rolled number.
   * @returns               Whether the result was consumed.
   */
  registerResult(method: string, denomination: string, result: number): boolean;

  override close(options?: ApplicationV2.ClosingOptions): Promise<this | void>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onSubmitForm(
    formConfig: ApplicationV2.FormConfiguration,
    event: Event | SubmitEvent,
  ): Promise<void>;

  /**
   * Handle prompting for a single extra result from a term.
   * @param term                - The term.
   * @param method              - The method used to obtain the result.
   * @returns
   */
  resolveResult(
    term: foundry.dice.terms.DiceTerm,
    method: string,
    options?: RollResolver.ResolveResultOptions,
  ): Promise<number | void>;

  /**
   * Update the Roll instance with the fulfilled results.
   * @param event     - The originating form submission event.
   * @param form      - The form element that was submitted.
   * @param formData  - Processed data for the submitted form.
   * @remarks {@linkcode RollResolver.close | RollResolver#close} passes `null` for both `event` and
   * `form` when it flushes the form on an early close.
   */
  protected static _fulfillRoll(
    this: RollResolver.Any,
    event: SubmitEvent | null,
    form: HTMLFormElement | null,
    formData: foundry.applications.ux.FormDataExtended,
  ): Promise<void>;

  /**
   * Add a new term to the resolver.
   * @param term        - The term.
   * @returns  A Promise that resolves when the term's results have been externally fulfilled.
   */
  addTerm(term: foundry.dice.terms.DiceTerm): Promise<void>;

  /**
   * Check if all rolls have been fulfilled.
   */
  protected _checkDone(): void;

  /**
   * Toggle the state of the submit button.
   * @param enabled  - Whether the button is enabled.
   */
  protected _toggleSubmission(enabled: boolean): void;

  #RollResolver: true;
}

declare namespace RollResolver {
  interface Any extends AnyRollResolver {}
  interface AnyConstructor extends Identity<typeof AnyRollResolver> {}

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    formula: string;
    groups: Record<string, Group>;
  }

  interface Configuration<RollResolver extends RollResolver.Any = RollResolver.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<RollResolver> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<RollResolver extends RollResolver.Any = RollResolver.Any> = DeepPartial<
    Configuration<RollResolver>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}

  interface Group {
    results: Result[];
    label: string;
    icon: string;
    tooltip: string;
  }

  interface Result {
    denomination: string;
    id: string;
    method: string;

    /** @remarks `undefined` when the denomination has no {@linkcode CONFIG.Dice.fulfillment} entry. */
    icon: string | undefined;

    exploded: boolean | undefined;
    rerolled: boolean | undefined;
    isNew: boolean | undefined;

    /** @remarks `""` for a result that has not been rolled yet. */
    value: number | "";

    minValue: number;

    /**
     * @remarks `undefined` when the term's faces are a complex expression that has not been
     * evaluated, as {@linkcode foundry.dice.terms.DiceTerm.faces | DiceTerm#faces} is then `undefined`.
     */
    maxValue: number | undefined;

    readonly: boolean;
    disabled: boolean;
  }

  interface DiceTermFulfillmentDescriptor {
    id: string;
    term: DiceTerm;
    method: string;
    isNew?: boolean | undefined;
  }

  interface ResolveResultOptions {
    /** @defaultValue `false` */
    reroll?: boolean | undefined;

    /** @defaultValue `false` */
    explode?: boolean | undefined;
  }
}

declare abstract class AnyRollResolver extends RollResolver<
  RollResolver.RenderContext,
  RollResolver.Configuration,
  RollResolver.RenderOptions
> {
  constructor(...args: never);
}

export default RollResolver;
