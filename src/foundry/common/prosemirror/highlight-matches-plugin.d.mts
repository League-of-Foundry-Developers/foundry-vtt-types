import { Schema } from "prosemirror-model";
import type ProseMirrorPlugin from "./plugin.d.mts";
import type { ProseMirrorMenu } from "./menu.d.mts";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import type { EmptyObject, InexactPartial } from "fvtt-types/utils";

declare namespace ProseMirrorHighlightMatchesPlugin {
  /**
   * A class responsible for handling the display of automated link recommendations when a user highlights text in a
   * ProseMirror editor.
   */
  class PossibleMatchesTooltip {
    /**
     * @param view - The editor view
     */
    constructor(view: EditorView);

    /**
     * A reference to any existing tooltip that has been generated as part of a highlight match.
     */
    tooltip: HTMLElement;

    update(view: EditorView, lastState: EditorState): Promise<void>;

    /**
     * Create a locked tooltip at the given position
     * @param position - A position object with coordinates for where the tooltip should be placed
     * @param text     - Explicit tooltip text or HTML to display.
     * @param options  - Additional options which can override tooltip behavior.
     */
    _createTooltip(
      position: InexactPartial<{
        /** Explicit top position for the tooltip */
        top?: string;

        /** Explicit right position for the tooltip */
        right?: string;

        /** Explicit bottom position for the tooltip */
        bottom?: string;

        /** Explicit left position for the tooltip */
        left?: string;
      }>,
      text: string,
      options?: {
        /** An optional, space-separated list of CSS classes to apply to the activated tooltip. */
        cssClass: string;
      },
    ): void;

    /**
     * Update the tooltip with new HTML
     * @param html - The HTML to be included in the tooltip
     */
    _updateTooltip(html: string): void;

    /**
     * Dismiss all locked tooltips and set this tooltip to undefined.
     */
    _deactivateTooltip(): void;

    /**
     * Find all Documents in the world/compendia with names that match the selection insensitive to case.
     * @param text - A string which will be matched against document names
     */
    _findMatches(text: string): string;
  }
}

/**
 * A ProseMirrorPlugin wrapper around the {@linkcode PossibleMatchesTooltip} class.
 */
declare class ProseMirrorHighlightMatchesPlugin extends ProseMirrorPlugin {
  /**
   * @param schema  - The ProseMirror schema.
   * @param options - Additional options to configure the plugin's behaviour.
   */
  constructor(schema: Schema, options: ProseMirrorMenu.ProseMirrorMenuOptions);

  static override build(schema: Schema, options?: EmptyObject): Plugin;
}

export default ProseMirrorHighlightMatchesPlugin;
