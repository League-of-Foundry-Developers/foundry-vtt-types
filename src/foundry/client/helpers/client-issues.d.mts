import type Document from "#common/abstract/document.d.mts";
import type { DataModelValidationError } from "#common/data/validation-failure.d.mts";
import type { AnyObject, Identity, InexactPartial } from "#utils";

/**
 * A class responsible for tracking issues in the current world.
 */
declare class ClientIssues {
  /**
   * Detect and display warnings for known performance issues which may occur due to the user's hardware or browser
   * configuration.
   * @internal
   */
  protected _detectWebGLIssues(): void;

  /**
   * Add an invalid Document to the module-provided sub-type counts.
   * @param cls    - The Document class.
   * @param source - The Document's source data.
   * @internal
   *
   * @remarks official documentation says "invalid", but the document can be valid, it is simply not yet validated.
   */
  protected _countDocumentSubType(
    cls: Document.AnyConstructor,
    source: AnyObject,
    options?: ClientIssues.CountDocumentSubTypesOptions,
  ): void;

  /**
   * Detect and record certain usability error messages which are likely to result in the user having a bad experience.
   * @internal
   */
  protected _detectUsabilityIssues(): void;

  /**
   * Get the Document sub-type counts for a given module.
   * @param module - The module or its ID.
   */
  getSubTypeCountsFor(module: foundry.packages.Module | string): ClientIssues.ModuleSubTypeCounts | undefined;

  /**
   * Retrieve all sub-type counts in the world.
   */
  getAllSubTypeCounts(): MapIterator<[string, ClientIssues.ModuleSubTypeCounts]>;

  /**
   * Retrieve the tracked validation failures.
   */
  get validationFailures(): ClientIssues.TrackedValidationFailures;

  /**
   * Retrieve the tracked usability issues.
   */
  get usabilityIssues(): ClientIssues.UsabilityIssues;

  /**
   * Retrieve package compatibility issues.
   */
  get packageCompatibilityIssues(): foundry.Game.Data["packageWarnings"];

  /**
   * Track all world document validation failures and failures of their embedded documents.
   * @internal
   */
  protected _detectDocumentIssues(): void;

  /**
   * Handle deletion of invalid documents.
   * @param documentName - The Document name
   * @param invalidIds   - The array of invalid IDs
   * @param context      - The context
   * @internal
   */
  protected _onDeleteInvalid<Name extends Document.Type>(
    documentName: Name,
    invalidIds: string[],
    context?: ClientIssues.OnDeleteInvalidContext<Name>,
  ): void;

  #ClientIssues: true;

  static #ClientIssuesStatic: true;
}

declare namespace ClientIssues {
  interface Any extends AnyClientIssues {}
  interface AnyConstructor extends Identity<typeof AnyClientIssues> {}

  type Severity = "error" | "warning" | "info";

  /** @internal */
  interface _CountDocumentSubTypesOptions {
    /**
     * Decrement the counter rather than incrementing it.
     * @defaultValue `false`
     */
    decrement: boolean;
  }

  interface CountDocumentSubTypesOptions extends InexactPartial<_CountDocumentSubTypesOptions> {}

  interface OnDeleteInvalidContext<Name extends Document.Type = Document.Type> {
    /** The Documents' parent, if any */
    parent?: Document.ParentForName<Name> | undefined;

    /**
     * The Documents' compendium pack, if applicable
     * @remarks Only a Document that can be in a compendium (directly or embedded) is ever deleted with a `pack`.
     */
    pack?: (Document.InCompendium<Name> extends false ? never : string) | null | undefined;
  }

  interface ValidationFailure {
    /** @remarks Omitted for Documents whose schema has no `name` field. */
    name?: string | undefined;

    /**
     * @remarks Foundry types this `Error`; it is always the {@linkcode DataModelValidationError}
     * produced by `DataModelValidationFailure#asError`.
     */
    error: DataModelValidationError;
  }

  /**
   * @remarks Keyed by Document name, then by the invalid Document's UUID.
   */
  interface TrackedValidationFailures extends Record<Document.Type, Record<string, ValidationFailure>> {}

  interface UsabilityIssues extends Record<string, UsabilityIssue> {}

  interface UsabilityIssue {
    /** The pre-localized message to display in relation to the usability issue. */
    message: string;

    /** The severity of the issue, either "error", "warning", or "info". */
    severity: Severity;

    /** Parameters to supply to the localization. */
    params?: Record<string, object> | undefined;
  }

  /**
   * An object structure of document types at the top level, with a count of different sub-types for that document type.
   */
  interface ModuleSubTypeCounts extends Record<Document.Type, Record<string, number>> {}
}

export default ClientIssues;

declare class AnyClientIssues extends ClientIssues {
  constructor(...args: never);
}
