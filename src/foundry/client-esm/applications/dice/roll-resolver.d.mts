import type { DeepPartial, InexactPartial } from "../../../../types/utils.d.mts";
import type { ApplicationConfiguration } from "../../../common/config.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.mjs";

/**
 * An application responsible for handling unfulfilled dice terms in a roll.
 */

declare class RollResolver<Configuration extends ApplicationConfiguration> extends HandlebarsApplicationMixin(
  ApplicationV2,
) {
  constructor(roll: Roll, options?: DeepPartial<Configuration>);

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
   * @param  options            - Optional configuration options
   * @param  options.reroll     - Defaults to false
   * @param  options.explode    - Defaults to false
   * @returns
   */
  resolveResult(
    term: DiceTerm,
    method: string,
    options?: InexactPartial<{ reroll: boolean; explode: boolean }>,
  ): Promise<number | void>;

  /**
   * Update the Roll instance with the fulfilled results.
   * @param event     - The originating form submission event.
   * @param form      - The form element that was submitted.
   * @param formData  - Processed data for the submitted form.
   */
  static _fulfillRoll(event: SubmitEvent, form: HTMLFormElement, formData: FormDataExtended): Promise<void>;

  /**
   * Add a new term to the resolver.
   * @param term        - The term.
   * @returns  A Promise that resolves when the term's results have been externally fulfilled.
   */
  addTerm(term: DiceTerm): Promise<void>;

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
  interface DiceTermFulfillmentDescriptor {
    id: string;
    term: DiceTerm;
    method: string;
    isNew?: boolean | undefined;
  }
}

export default RollResolver;
