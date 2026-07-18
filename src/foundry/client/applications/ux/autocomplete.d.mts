import type { DeepPartial, FixedInstanceType, Identity, InexactPartial } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";

/**
 * A widget that provides a drop-down list of autocompletion options.
 */
declare class Autocomplete {
  /**
   * @param options - (default: `{}`)
   */
  constructor(options?: Autocomplete.ConstructorOptions);

  /**
   * The auto-complete menu.
   */
  get element(): HTMLMenuElement | null;

  /**
   * Commit a choice.
   */
  commit(): void;

  /**
   * Dismiss the auto-complete menu.
   */
  dismiss(): void;

  /**
   * Move the current auto-complete selection.
   * @param increment - The number of entries to advance the selection. A negative number moves up, and a
   *                     positive number moves down.
   *                     (default: `0`)
   */
  select(increment?: number): void;

  /**
   * Activate an auto-complete menu.
   * @param target  - The element the autocomplete is being rendered for.
   * @param entries - The entries to render.
   * @param options - (default: `{}`)
   */
  activate(target: HTMLElement, entries: Autocomplete.Entry[], options?: Autocomplete.ActivateOptions): void;

  /**
   * Bind global autocomplete listeners to a given document.
   * @param document - The document.
   */
  static activateListeners(document?: Document): void;

  /**
   * Retrieve the configured Autocomplete implementation.
   */
  static get implementation(): Autocomplete.ImplementationClass;

  #Autocomplete: true;
}

declare namespace Autocomplete {
  interface Any extends AnyAutocomplete {}
  interface AnyConstructor extends Identity<typeof AnyAutocomplete> {}

  interface ImplementationClass extends Identity<typeof CONFIG.ux.Autocomplete> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  /**
   * @param identifier - The identifier of the entry that was selected.
   * @param label      - The label of the entry that was selected.
   * @param options    -
   */
  type Callback = (identifier: string, label: string, options?: CallbackOptions) => void;

  /** @internal */
  interface _CallbackOptions {
    /**
     * The matched prefix that originally triggered this autocomplete menu.
     */
    prefix?: string | undefined;
  }

  interface CallbackOptions extends InexactPartial<_CallbackOptions> {}

  interface Entry {
    /**
     * A unique identifier for the entry.
     */
    identifier: string;

    /**
     * A human-readable label for the entry.
     */
    label: string;
  }

  /** @internal */
  interface _ConstructorOptions {
    /**
     * Callback to fire when an entry is selected.
     */
    onSelect?: Callback | undefined;
  }

  interface ConstructorOptions extends InexactPartial<_ConstructorOptions> {}

  /** @internal */
  interface _ActivateOptions {
    /**
     * The matched prefix that triggered the autocomplete menu.
     */
    prefix: string;

    /**
     * Position the menu. If omitted, the menu is positioned underneath the target.
     */
    position: DeepPartial<ApplicationV2.Position>;
  }

  interface ActivateOptions extends InexactPartial<_ActivateOptions> {}
}

declare abstract class AnyAutocomplete extends Autocomplete {
  constructor(...args: never);
}

export default Autocomplete;
