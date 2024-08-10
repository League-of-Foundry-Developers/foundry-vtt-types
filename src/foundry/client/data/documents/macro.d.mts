import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type {
  DatabaseCreateOperation,
  DatabaseDeleteOperation,
  DatabaseUpdateOperation,
} from "../../../common/abstract/_types.d.mts";

declare global {
  namespace Macro {
    type ConfiguredClass = ConfiguredDocumentClassForName<"Macro">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    export interface DatabaseOperations {
      create: DatabaseCreateOperation;
      update: DatabaseUpdateOperation;
      delete: DatabaseDeleteOperation;
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
     * Execute the Macro command.
     * @param scope - Macro execution scope which is passed to script macros
     * @remarks `type === "chat"` returns void, `type === "script"` returns the promise
     * @privateRemarks Foundry's stated return value is incorrect, #executeChat only returns `void`
     */
    execute(scope?: Scope): void | Promise<unknown>;

    _onClickDocumentLink(event: MouseEvent): ReturnType<this["execute"]>;
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

  /**
   * @remarks Additional arguments passed as part of the scope
   */
  [arg: string]: unknown;
}
