import type { EditorView } from "prosemirror-view";
import type { Editor } from "tinymce";
import type { GetDataReturnType } from "fvtt-types/utils";

declare global {
  class BaseSheet<
    ConcreteDocument extends foundry.abstract.Document.Any = foundry.abstract.Document.Any,
    Options extends BaseSheet.Options<ConcreteDocument> = BaseSheet.Options<ConcreteDocument>,
  > extends DocumentSheet<Options, ConcreteDocument> {
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

    protected _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

    activateEditor(name: string, options?: TextEditor.Options, initialContent?: string): Promise<Editor | EditorView>;
  }

  namespace BaseSheet {
    type Any = BaseSheet<any>;

    interface Options<ConcreteDocument extends foundry.abstract.Document.Any = foundry.abstract.Document.Any>
      extends DocumentSheetOptions<ConcreteDocument> {}

    interface BaseSheetData extends DocumentSheet.DocumentSheetData<Options, foundry.abstract.Document.Any> {
      hasName: boolean;
      hasImage: boolean;
      hasDescription: boolean;
      desriptionHTML?: string;
    }
  }
}
