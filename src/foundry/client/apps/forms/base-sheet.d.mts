import type { EditorView } from "prosemirror-view";
import type { Editor } from "tinymce";
import type { GetDataReturnType } from "../../../../types/utils.d.mts";

export {};

declare global {
  class BaseSheet<Options extends BaseSheet.Options = BaseSheet.Options> extends DocumentSheet<
    Options,
    foundry.abstract.Document.Any
  > {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   template: "templates/sheets/base-sheet.html",
     *   classes: ["sheet", "base-sheet"],
     *   width: 450,
     *   height: "auto",
     *   resizable: true,
     *   submitOnChange: true,
     *   closeOnSubmit: false
     * });
     * ```
     */
    static override get defaultOptions(): BaseSheet.Options;

    override getData(): Promise<GetDataReturnType<BaseSheet.BaseSheetData>>;

    protected _render(
      force?: boolean | undefined,
      options?: Application.RenderOptions<Options> | undefined,
    ): Promise<void>;

    activateEditor(
      name: string,
      options?: TextEditor.Options | undefined,
      initialContent?: string | undefined,
    ): Promise<Editor | EditorView>;
  }

  namespace BaseSheet {
    interface Options extends DocumentSheetOptions<Adventure.ConfiguredInstance> {}

    interface BaseSheetData extends DocumentSheet.DocumentSheetData<Options, foundry.abstract.Document.Any> {
      hasName: boolean;
      hasImage: boolean;
      hasDescription: boolean;
      desriptionHTML?: string;
    }
  }
}
