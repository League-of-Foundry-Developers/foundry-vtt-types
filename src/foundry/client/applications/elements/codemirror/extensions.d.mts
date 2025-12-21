import type { Extension } from "@codemirror/state";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import { markdown } from "@codemirror/lang-markdown";
import { basicSetup } from "codemirror";

/**
 * CodeMirror language extensions
 */
export const LANGUAGES: {
  html: [typeof basicSetup, ReturnType<typeof html>];
  javascript: [
    typeof basicSetup,
    ReturnType<typeof javascript>,
    ReturnType<typeof lintGutter>,
    ReturnType<typeof linter>,
  ];
  json: [typeof basicSetup, ReturnType<typeof json>, ReturnType<typeof linter>];
  markdown: [typeof basicSetup, ReturnType<typeof markdown>];
  plain: [typeof basicSetup];
};

/**
 * CodeMirror HTML tag classes for parsed language tokens
 */
export const HIGHLIGHT_STYLE: Extension;

/**
 * Configure extensions for managing indentation via keypress.
 * @param spaces - The number of spaces added/removed per press of TAB/SHIFT-TAB
 */
export function configureIndentExtensions(spaces: number): Extension[];
