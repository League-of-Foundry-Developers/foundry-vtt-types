import type { EditorView } from "prosemirror-view";
import type { Editor } from "tinymce";
import type { GetDataReturnType, Identity } from "fvtt-types/utils";

import Document = foundry.abstract.Document;

declare global {
  class BaseSheet<
    ConcreteDocument extends Document.Any = Document.Any,
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
    interface Any extends AnyBaseSheet {}
    interface AnyConstructor extends Identity<typeof AnyBaseSheet> {}

    interface Options<ConcreteDocument extends Document.Any = Document.Any>
      extends DocumentSheet.Options<ConcreteDocument> {}

    interface BaseSheetData extends DocumentSheet.DocumentSheetData<Options, Document.Any> {
      hasName: boolean;
      hasImage: boolean;
      hasDescription: boolean;
      desriptionHTML?: string;
    }
  }
}

declare abstract class AnyBaseSheet extends BaseSheet<Document.Any, BaseSheet.Options<Document.Any>> {
  constructor(arg0: never, ...args: never[]);
}
