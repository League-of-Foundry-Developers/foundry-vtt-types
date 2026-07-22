import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";
import type { EditorState, Transaction } from "prosemirror-state";
import type { Schema } from "prosemirror-model";

import FormulaEditor = foundry.applications.apps.FormulaEditor;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

const editor = new FormulaEditor({ context: "default", formula: "8 + @prof" });

expectTypeOf(editor).toEqualTypeOf<FormulaEditor>();
expectTypeOf(editor.context).toEqualTypeOf<CONFIG.FormulaEditor.Context>();
expectTypeOf(editor.formula).toBeString();
expectTypeOf(editor.labels).toEqualTypeOf<Record<string, string>>();

expectTypeOf(FormulaEditor.DEFAULT_OPTIONS).toEqualTypeOf<FormulaEditor.DefaultOptions>();
expectTypeOf(FormulaEditor.IDENTIFIER).toEqualTypeOf<RegExp>();
expectTypeOf(FormulaEditor.schema).toEqualTypeOf<Schema>();

declare const state: EditorState;
expectTypeOf(FormulaEditor.toFormula(state)).toBeString();

declare class _TestFormulaEditorSubclass extends FormulaEditor {
  protected override _canAttach(): false;
  protected override _canDetach(): false;
  protected override _canRender(options: DeepPartial<FormulaEditor.RenderOptions>): false | void;
  protected override _onFirstRender(
    context: DeepPartial<FormulaEditor.RenderContext>,
    options: DeepPartial<FormulaEditor.RenderOptions>,
  ): Promise<void>;
  protected override _replaceHTML(
    result: HTMLElement,
    content: HTMLElement,
    options: DeepPartial<FormulaEditor.RenderOptions>,
  ): void;
  protected override _renderFrame(options: DeepPartial<FormulaEditor.RenderOptions>): Promise<HTMLElement>;
  protected override _renderHTML(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<FormulaEditor.RenderOptions>,
  ): Promise<HTMLElement>;
  protected override _replaceTerms(tr: Transaction, schema: Schema): Transaction;
}
