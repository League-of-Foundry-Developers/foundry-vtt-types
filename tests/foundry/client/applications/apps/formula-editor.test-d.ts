import { expectTypeOf } from "vitest";
import type { Schema } from "prosemirror-model";
import type { EditorState, Transaction } from "prosemirror-state";

import FormulaEditor = foundry.applications.apps.FormulaEditor;

const editor = new FormulaEditor();
new FormulaEditor({ context: "default", formula: "1d20 + @prof" });

expectTypeOf(FormulaEditor.DEFAULT_OPTIONS).toEqualTypeOf<FormulaEditor.DefaultOptions>();
expectTypeOf(FormulaEditor.IDENTIFIER).toEqualTypeOf<RegExp>();
expectTypeOf(FormulaEditor.schema).toEqualTypeOf<Schema>();

declare const state: EditorState;
expectTypeOf(FormulaEditor.toFormula(state)).toBeString();

expectTypeOf(editor.context).toEqualTypeOf<CONFIG.FormulaEditor.Context>();
expectTypeOf(editor.formula).toBeString();
expectTypeOf(editor.labels).toEqualTypeOf<Record<string, string>>();
expectTypeOf(editor.options.context).toBeString();
expectTypeOf(editor.options.formula).toBeString();

// The one protected hook Foundry documents for subclasses.
class CustomFormulaEditor extends FormulaEditor {
  protected override _replaceTerms(tr: Transaction, schema: Schema): Transaction {
    return super._replaceTerms(tr, schema);
  }
}
void CustomFormulaEditor;
