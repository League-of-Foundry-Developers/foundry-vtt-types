// FOUNDRY_VERSION: 10.291

import type BaseMacro from "../../../common/documents/macro.mjs";

declare global {
  /**
   * The client-side Macro document which extends the common BaseMacro model.
   *
   * @see {@link Macros}            The world-level collection of Macro documents
   * @see {@link MacroConfig}    The Macro configuration application
   *
   * @param data - Initial data provided to construct the Macro document
   */
  class Macro extends ClientDocumentMixin(BaseMacro) {
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
    get thumbnail(): string;

    /**
     * Execute the Macro command.
     * @param scope - Provide some additional scope configuration for the Macro
     */
    execute(scope?: Scope): void;

    /**
     * Execute the command as a chat macro.
     * Chat macros simulate the process of the command being entered into the Chat Log input textarea.
     */
    protected _executeChat(): void;

    /**
     * Execute the command as a script macro.
     * Script Macros are wrapped in an async IIFE to allow the use of asynchronous commands and await statements.
     */
    protected _executeScript({ actor, token }?: Scope): void;

    protected _onClickDocumentLink(event: unknown): void;
  }
}

interface Scope {
  /**
   * An Actor who is the protagonist of the executed action
   */
  actor?: Actor;

  /**
   * A Token which is the protagonist of the executed action
   */
  token?: Token;
}
