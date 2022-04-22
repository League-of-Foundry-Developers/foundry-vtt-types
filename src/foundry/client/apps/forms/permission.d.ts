import type { ConfiguredDocumentClassForName } from '../../../../types/helperTypes';

declare global {
  /**
   * A generic application for configuring permissions for various Document types
   * @typeParam Options          - the type of the options object
   * @typeParam Data             - The data structure used to render the handlebars template.
   * @typeParam ConcreteDocument - the type of the Document which should be managed by this form sheet
   */
  class PermissionControl<
    Options extends DocumentSheetOptions = DocumentSheetOptions,
    Data extends object = PermissionControl.Data,
    ConcreteDocument extends foundry.abstract.Document<any, any> = Data extends DocumentSheet.Data<infer T>
      ? T
      : foundry.abstract.Document<any, any>
  > extends DocumentSheet<Options, PermissionControl.Data, ConcreteDocument> {
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

    override getData(options?: Partial<Options> | undefined): PermissionControl.Data | Promise<PermissionControl.Data>;

    protected override _updateObject(event: Event, formData: PermissionControl.FormData): Promise<unknown>;
  }

  namespace PermissionControl {
    interface Data {
      currentDefault: foundry.CONST.DOCUMENT_PERMISSION_LEVELS | '-1';
      instructions: string;
      defaultLevels: Record<foundry.CONST.DOCUMENT_PERMISSION_LEVELS, string> & { '-1'?: string };
      playerLevels: Record<foundry.CONST.DOCUMENT_PERMISSION_LEVELS | '-1', string> & { '-2'?: string };
      isFolder: boolean;
      users: {
        user: InstanceType<ConfiguredDocumentClassForName<'User'>>;
        level: foundry.CONST.DOCUMENT_PERMISSION_LEVELS | '-1';
      }[];
    }

    interface FormData {
      [userId: string]: FormData.InputPermissionLevel;
      default: FormData.InputPermissionLevel;
    }

    namespace FormData {
      type InputPermissionLevel = foundry.CONST.DOCUMENT_PERMISSION_LEVELS | -1 | -2;
    }
  }
}
