import type { DocumentConstructor, DocumentType } from "../../../types/helperTypes.d.mts";
import type Document from "../../common/abstract/document.d.mts";
import type { DataModelValidationError } from "../../common/data/validation-failure.d.mts";

declare global {
  /**
   * An object structure of document types at the top level, with a count of different sub-types for that document type.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ModuleSubTypeCounts extends Record<DocumentType, Record<string, number>> {}

  /**
   * A class responsible for tracking issues in the current world.
   */
  class ClientIssues {
    // placeholder private member
    #clientIssues: true;

    /**
     * Detect and display warnings for known performance issues which may occur due to the user's hardware or browser
     * configuration.
     * @internal
     */
    _detectWebGLIssues(): void;

    /**
     * Add an invalid Document to the module-provided sub-type counts.
     * @param cls               - The Document class.
     * @param source            - The Document's source data.
     * @internal
     *
     * @remarks official documentation says "invalid", but the document can be valid, it is simply not yet validated.
     */
    _countDocumentSubType(
      cls: Document.Any,
      source: unknown,
      options?: {
        /**
         * Decrement the counter rather than incrementing it.
         * @defaultValue `false`
         */
        decrement?: boolean | undefined;
      },
    ): void;

    /**
     * Track a validation failure that occurred in a WorldCollection.
     * @param collection - The parent collection.
     * @param source     - The Document's source data.
     * @param error      - The validation error.
     * @internal
     */
    _trackValidationFailures(
      collection: WorldCollection<DocumentConstructor, string>,
      source: unknown,
      error: DataModelValidationError,
    ): void;

    /**
     * Detect and record certain usability error messages which are likely to result in the user having a bad experience.
     * @internal
     */
    _detectUsabilityIssues(): void;

    /**
     * Get the Document sub-type counts for a given module.
     * @param module - The module or its ID.
     */
    getSubTypeCountsFor(module: Module | string): ModuleSubTypeCounts | undefined;

    /**
     * Retrieve all sub-type counts in the world.
     */
    getAllSubtypeCounts(): IterableIterator<[string, ModuleSubTypeCounts]>;

    /**
     * Retrieve the tracked validation failures.
     */
    get validationFailures(): Record<DocumentType, Record<string, { name: string; error: DataModelValidationError }>>;

    /**
     * Retrieve the tracked usability issues.
     */
    get usabilityIssues(): Record<string, ClientIssues.UsabilityIssue>;

    /**
     * Retrieve package compatibility issues.
     */
    get packageCompatibilityIssues(): { error: string[]; warning: string[] };
  }

  namespace ClientIssues {
    interface UsabilityIssue {
      /** The pre-localized message to display in relation to the usability issue. */
      message: string;

      /** The severity of the issue, either "error", "warning", or "info". */
      severity: "error" | "warning" | "info";

      /** Parameters to supply to the localization. */
      params?: Record<string, object> | undefined;
    }
  }
}
