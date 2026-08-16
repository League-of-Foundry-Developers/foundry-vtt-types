import type { DeepPartial, Identity } from "#utils";
import type { Schema } from "prosemirror-model";
import type { EditorState, Transaction } from "prosemirror-state";
import type ApplicationV2 from "../api/application.d.mts";
import type { RollParseNode, StringParseNode } from "#client/dice/_types.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      FormulaEditor: FormulaEditor.Any;
    }
  }
}

/**
 * An application that provides improved formula editing capabilities.
 */
declare class FormulaEditor<
  RenderContext extends FormulaEditor.RenderContext = FormulaEditor.RenderContext,
  Configuration extends FormulaEditor.Configuration = FormulaEditor.Configuration,
  RenderOptions extends FormulaEditor.RenderOptions = FormulaEditor.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  constructor(options?: DeepPartial<Configuration>);

  /**
   * @defaultValue
   * ```js
   * {
   *   id: "formula-editor",
   *   tag: "dialog",
   *   classes: ["dialog", "formula-editor"],
   *   window: {
   *     icon: "fa-solid fa-lambda",
   *     contentClasses: ["flexcol"],
   *     resizable: true,
   *     minimizable: false
   *   },
   *   position: {
   *     width: 400,
   *     height: 200
   *   },
   *   context: "default",
   *   formula: ""
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: FormulaEditor.DefaultOptions;

  /**
   * The regular expression to match formula data identifiers.
   * @defaultValue `/^@[\w.-]+$/`
   */
  static IDENTIFIER: RegExp;

  /**
   * Get the configured context for this formula editor.
   * @remarks Resolved from `CONFIG.formulaEditor.contexts[options.context]` in the constructor,
   * falling back to an empty object when the configured context does not exist.
   */
  get context(): CONFIG.FormulaEditor.Context;

  /**
   * The current formula value.
   */
  get formula(): string;

  /**
   * Get the labels mapping for this context.
   */
  get labels(): Record<string, string>;

  protected override _canAttach(): boolean;

  protected override _canDetach(): boolean;

  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _replaceHTML(result: HTMLElement, content: HTMLElement, options: DeepPartial<RenderOptions>): void;

  protected override _renderFrame(options: DeepPartial<RenderOptions>): Promise<HTMLElement>;

  protected override _renderHTML(context: RenderContext, options: DeepPartial<RenderOptions>): Promise<HTMLElement>;

  /**
   * Parse the given ProseMirror document state and replace data terms with human-readable labels.
   * @param tr     - The state transaction.
   * @param schema - The ProseMirror document schema.
   */
  protected _replaceTerms(tr: Transaction, schema: Schema): Transaction;

  /**
   * Collect every string term in a roll parse tree, in the order that they appear in the formula.
   * @param node  - The node to search.
   * @param terms - The terms collected so far. (default: `[]`)
   */
  protected static _collectStringTerms(node: RollParseNode, terms?: StringParseNode[]): StringParseNode[];

  /**
   * The ProseMirror schema.
   */
  static get schema(): Schema;

  /**
   * Convert a ProseMirror document back into a formula string.
   * @param state - The ProseMirror document state.
   */
  static toFormula(state: EditorState): string;

  #FormulaEditor: true;
}

declare namespace FormulaEditor {
  interface Any extends AnyFormulaEditor {}
  interface AnyConstructor extends Identity<typeof AnyFormulaEditor> {}

  /**
   * @remarks {@linkcode FormulaEditor._renderHTML | FormulaEditor#_renderHTML} builds its element without
   * consulting the render context, so no members are added beyond the base.
   */
  interface RenderContext extends ApplicationV2.RenderContext {}

  interface Configuration<
    FormulaEditor extends FormulaEditor.Any = FormulaEditor.Any,
  > extends ApplicationV2.Configuration<FormulaEditor> {
    /**
     * The formula editing context.
     * @defaultValue `"default"`
     */
    context: string;

    /**
     * The formula being edited.
     * @defaultValue `""`
     */
    formula: string;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<FormulaEditor extends FormulaEditor.Any = FormulaEditor.Any> = DeepPartial<
    Configuration<FormulaEditor>
  > &
    object;

  interface RenderOptions extends ApplicationV2.RenderOptions {}
}

declare abstract class AnyFormulaEditor extends FormulaEditor<
  FormulaEditor.RenderContext,
  FormulaEditor.Configuration,
  FormulaEditor.RenderOptions
> {
  constructor(...args: never);
}

export default FormulaEditor;
