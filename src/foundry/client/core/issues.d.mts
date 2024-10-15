import type Document from "../../common/abstract/document.d.mts";
import type { DataModelValidationError } from "../../common/data/validation-failure.d.mts";

declare global {
  /**
   * An object structure of document types at the top level, with a count of different sub-types for that document type.
   */
  interface ModuleSubTypeCounts extends Record<Document.Type, Record<string, number>> {}

  /**
   * A class responsible for tracking issues in the current world.
   */
  class ClientIssues {
    /**
     * Keep track of valid Documents in the world that are using module-provided sub-types.
     * @remarks the keys are module ids.
     */
    #moduleTypeMap: Map<string, ModuleSubTypeCounts>;

    /**
     * Keep track of document validation failures.
     */
    #documentValidationFailures: Record<
      Document.Type,
      Record<string, { name: string; error: DataModelValidationError }>
    >;

    /**
     * Keep track of any usability issues related to browser or technology versions.
     */
    #usabilityIssues: Record<string, ClientIssues.UsabilityIssue>;

    /** The minimum supported resolution. */
    static #MIN_RESOLUTION: { WIDTH: 1024; HEIGHT: 700 };

    /**
     * The minimum supported client versions.
     */
    static #BROWSER_TESTS: {
      /**
       * @defaultValue
       * ```typescript
       * {
       *   minimum: 24;
       *   match: RegExp;
       *   message: "ERROR.ElectronVersion";
       * }
       * ```
       */
      Electron: ClientIssues.BROWSER_TEST;
      /**
       * @defaultValue
       * ```
       * {
       *   minimum: 92;
       *   match: RegExp;
       *   message: "ERROR.BrowserVersion";
       * }
       * ```
       */
      Chromium: ClientIssues.BROWSER_TEST;
      /**
       * @defaultValue
       * ```
       * {
       *   minimum: 90;
       *   match: RegExp;
       *   message: "ERROR.BrowserVersion";
       * }
       * ```
       */
      Firefox: ClientIssues.BROWSER_TEST;
      /**
       * @defaultValue
       * ```
       * {
       *   minimum: 15.4;
       *   match: RegExp;
       *   message: "ERROR.BrowserVersion";
       * }
       * ```
       */
      Safari: ClientIssues.BROWSER_TEST;
    };

    /**
     * Add a Document to the count of module-provided sub-types.
     * @param documentName      - The Document name.
     * @param subType           - The Document's sub-type.
     */
    #countDocumentSubType(
      documentName: Document.Type,
      subType: string,
      options?: {
        /**
         * Decrement the counter rather than incrementing it.
         * @defaultValue `false`
         */
        decrement?: boolean;
      },
    ): void;

    /**
     * Detect the user's browser and display a notification if it is below the minimum required version.
     */
    #detectBrowserVersion(): void;

    /**
     * Record a reference to a resolution notification ID so that we can remove it if the problem is remedied.
     */
    #resolutionTooLowNotification: number;

    /**
     * Detect the user's resolution and display a notification if it is too small.
     */
    #detectResolution(): void;

    /**
     * Detect and display warnings for known performance issues which may occur due to the user's hardware or browser
     * configuration.
     * @internal
     */
    _detectWebGLIssues(): void;

    /**
     * Add an invalid Document to the module-provided sub-type counts.
     * @param documentName      - The Document name.
     * @param source            - The Document's source data.
     * @internal
     *
     * @remarks official documentation says "invalid", but the document can be valid, it is simply not yet validated.
     */
    _countDocumentSubType(
      documentName: Document.Type,
      source: unknown,
      options?: {
        /**
         * Decrement the counter rather than incrementing it.
         * @defaultValue `false`
         */
        decrement?: boolean;
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
      collection: WorldCollection<Document.AnyConstructor, string>,
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
    get validationFailures(): Record<Document.Type, Record<string, { name: string; error: DataModelValidationError }>>;

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
    interface BROWSER_TEST {
      /** The minimum supported version for this browser. */
      minimum: number;

      /** A regular expression to match the browser against the user agent string. */
      match: RegExp;

      /** A message to display if the user's browser version does not meet the minimum. */
      message: string;
    }

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
