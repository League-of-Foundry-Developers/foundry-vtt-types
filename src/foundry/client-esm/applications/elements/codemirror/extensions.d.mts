import type { Extension } from "@codemirror/state";

/**
 * CodeMirror language extensions
 * @remarks TODO: Stub
 */
export const LANGUAGES: Record<string, Extension[]>;

/**
 * CodeMirror HTML tag classes for parsed language tokens
 * @remarks TODO: Stub
 */
export const HIGHLIGHT_STYLE: Extension;

/**
 * Configure extensions for managing indentation via keypress.
 * @param spaces The number of spaces added/removed per press of TAB/SHIFT-TAB
 * @remarks TODO: Stub
 */
export function configureIndentExtensions(spaces: number): Extension[];
