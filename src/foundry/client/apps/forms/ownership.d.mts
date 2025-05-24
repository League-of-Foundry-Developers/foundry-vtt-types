import type { GetDataReturnType, MaybePromise } from "#utils";

declare global {
  /**
   * A generic application for configuring permissions for various Document types
   * @template Options          - the type of the options object
   * @template ConcreteDocument - the type of the Document which should be managed by this form sheet
   */
  class DocumentOwnershipConfig<
    Options extends DocumentSheet.Options<ConcreteDocument>,
    ConcreteDocument extends foundry.abstract.Document.Any = foundry.abstract.Document.Any,
  > extends DocumentSheet<ConcreteDocument, Options> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "permission",
     *   template: "templates/apps/ownership.html",
     *   width: 400
     * })
     * ```
     */
    static override get defaultOptions(): DocumentSheet.Options;

    override get title(): string;

    override getData(
      options?: Partial<Options>,
    ): MaybePromise<GetDataReturnType<DocumentOwnershipConfig.DocumentOwnershipConfigData>>;

    protected override _updateObject(event: Event, formData: DocumentOwnershipConfig.FormData): Promise<unknown>;
  }

  namespace DocumentOwnershipConfig {
    interface Any extends DocumentOwnershipConfig<any, any> {}
  }

  /**
   * @deprecated since v10.
   */
  class PermissionControl extends DocumentOwnershipConfig<any, any> {}

  namespace DocumentOwnershipConfig {
    interface FormData {
      [userId: string]: FormData.InputPermissionLevel;
      default: FormData.InputPermissionLevel;
    }

    namespace FormData {
      type InputPermissionLevel = foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | -1 | -2;
    }

    interface DocumentOwnershipConfigData {
      currentDefault: { level: number; label: string };
      instructions: string;
      defaultLevels: { level: number; label: string }[];
      playerLevels: { level: number; label: string }[];
      isFolder: boolean;
      users: {
        user: User.Implementation;
        level: number;
        isAuthor: boolean;
      }[];
    }
  }
}
