import type { Schema } from "prosemirror-model";
import type ProseMirrorPlugin from "./plugin.d.mts";
import type { EditorState, Plugin, PluginKey, PluginSpec } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import type { AnyObject } from "#utils";

/**
 * A class responsible for handling the display of automated link recommendations when a user highlights text in a
 * ProseMirror editor.
 * @privateRemarks This models an unexported runtime class whose type is exposed as
 * {@linkcode ProseMirrorHighlightMatchesPlugin.PossibleMatchesTooltip}.
 */
declare class _PossibleMatchesTooltip {
  /**
   * @param view - The editor view.
   */
  constructor(view: EditorView);

  /**
   * A reference to any existing tooltip that has been generated as part of a highlight match.
   */
  tooltip: HTMLElement | undefined;

  /**
   * Update the tooltip based on changes to the selected text.
   * @param view      - The editor view.
   * @param lastState - The previous state of the document.
   */
  update(view: EditorView, lastState: EditorState | null): Promise<void>;

  #PossibleMatchesTooltip: true;
}

/**
 * A ProseMirrorPlugin wrapper around the {@linkcode PossibleMatchesTooltip} class.
 */
declare class ProseMirrorHighlightMatchesPlugin extends ProseMirrorPlugin {
  /**
   * @param schema  - The ProseMirror schema.
   * @param options - Additional options to configure the plugin's behaviour.
   * @privateRemarks Foundry documents `ProseMirrorMenuOptions`, but at runtime only stores the object.
   */
  constructor(schema: Schema, options?: AnyObject);

  options: AnyObject;

  /** @remarks `options` is unused */
  static override build(schema: Schema, options?: AnyObject): ProseMirrorHighlightMatchesPlugin.HighlightMatchesPlugin;
}

declare namespace ProseMirrorHighlightMatchesPlugin {
  interface PossibleMatchesTooltip extends _PossibleMatchesTooltip {}

  interface HighlightMatchesPluginSpec extends PluginSpec<undefined> {
    key: PluginKey<undefined>;
    view(editorView: EditorView): PossibleMatchesTooltip;
    isHighlightMatchesPlugin: true;
  }

  interface HighlightMatchesPlugin extends Plugin<undefined> {
    readonly spec: HighlightMatchesPluginSpec;
  }
}

export default ProseMirrorHighlightMatchesPlugin;
