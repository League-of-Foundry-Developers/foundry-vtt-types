import type { InexactPartial } from "../../../../types/utils.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";

declare global {
  namespace Macro {
    type ConfiguredClass = Document.ConfiguredClassForName<"Macro">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"Macro">;

    interface DatabaseOperations extends DocumentDatabaseOperations<Macro> {}

    interface Scope {
      /** An Actor who is the protagonist of the executed action. */
      actor: Actor;

      /**  A Token which is the protagonist of the executed action. */
      token: Token;

      /** An optional event passed to the executed macro. */
      event: Event | RegionEvent;

      /**
       * @remarks Additional arguments passed as part of the scope
       */
      [arg: string]: unknown;
    }
  }

  /**
   * The client-side Macro document which extends the common BaseMacro model.
   *
   * @see {@link Macros}            The world-level collection of Macro documents
   * @see {@link MacroConfig}       The Macro configuration application
   *
   * @param data - Initial data provided to construct the Macro document
   */
  class Macro extends ClientDocumentMixin(foundry.documents.BaseMacro) {
    /**
     * Is the current User the author of this macro?
     */
    get isAuthor(): boolean;

    /**
     * Test whether the current user is capable of executing a Macro script
     */
    get canExecute(): boolean;

    /**
     * Provide a thumbnail image path used to represent this document.
     */
    get thumbnail(): string | null;

    /**
     * Test whether the given User is capable of executing this Macro.
     * @param user - The User to test.
     * @returns Can this User execute this Macro?
     */
    canUserExecute(user: User): boolean;

    /**
     * Execute the Macro command.
     * @param scope - Macro execution scope which is passed to script macros
     * @returns A promising containing a created {@link ChatMessage} (or `undefined`) if a chat
     *          macro or the return value if a script macro. A void return is possible if the user
     *          is not permitted to execute macros or a script macro execution fails.
     */
    execute(scope?: InexactPartial<Macro.Scope>): Promise<ChatMessage | void> | Promise<unknown> | void;

    #executeScript();

    _onClickDocumentLink(event: MouseEvent): ReturnType<this["execute"]>;
  }
}
