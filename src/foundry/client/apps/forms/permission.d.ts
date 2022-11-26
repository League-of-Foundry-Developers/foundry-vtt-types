export {};
declare global {
  /**
   * A generic application for configuring permissions for various Document types
   * @typeParam Options          - the type of the options object
   * @typeParam ConcreteDocument - the type of the Document which should be managed by this form sheet
   */
  class PermissionControl<
    Options extends DocumentSheetOptions<ConcreteDocument>,
    ConcreteDocument extends foundry.abstract.Document<any, any> = foundry.abstract.Document<any, any>
  > extends DocumentSheet<Options, ConcreteDocument> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "permission",
     *   template: "templates/apps/permission.html",
     *   width: 400
     * })
     * ```
     */
    static override get defaultOptions(): DocumentSheetOptions;

    override get title(): string;

    override getData(options?: Partial<Options> | undefined): MaybePromise<object>;

    protected override _updateObject(event: Event, formData: PermissionControl.FormData): Promise<unknown>;
  }

  namespace PermissionControl {
    interface FormData {
      [userId: string]: FormData.InputPermissionLevel;
      default: FormData.InputPermissionLevel;
    }

    namespace FormData {
      type InputPermissionLevel = foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | -1 | -2;
    }
  }
}
