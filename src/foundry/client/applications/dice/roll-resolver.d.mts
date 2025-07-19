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

  // Fake override.
  static override DEFAULT_OPTIONS: RollResolver.DefaultOptions;

  // a placeholder private method to help subclassing
  #rollResolver: true;

  /**
   * A collection of fulfillable dice terms.
   */
  get fulfillable(): Map<string, RollResolver.DiceTermFulfillmentDescriptor>;

  /**
   * The roll being resolved.
   */
  get roll(): Roll;
  #roll: Roll;

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
   */
  static _fulfillRoll(
    event: SubmitEvent,
    form: HTMLFormElement,
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
  _checkDone(): void;

  /**
   * Toggle the state of the submit button.
   * @param enabled  - Whether the button is enabled.
   */
  _toggleSubmission(enabled: boolean): void;
}

declare namespace RollResolver {
  interface Any extends AnyRollResolver {}
  interface AnyConstructor extends Identity<typeof AnyRollResolver> {}

  interface RenderContext {
    formula: string;
    groups: Record<string, Group>;
  }

  interface Configuration<RollResolver extends RollResolver.Any = RollResolver.Any>
    extends HandlebarsApplicationMixin.Configuration,
      ApplicationV2.Configuration<RollResolver> {}

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
    faces: number | undefined;
    id: string;
    method: string;
    icon: string;
    exploded: boolean | undefined;
    rerolled: boolean | undefined;
    isNew: boolean | undefined;
    // Note(LukeAbby): The logic here is a bit suspicious.
    value: string | number;
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
