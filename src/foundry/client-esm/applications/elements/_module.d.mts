// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export { default as AbstractFormInputElement } from "./form-element.mjs";
export { default as HTMLColorPickerElement } from "./color-picker.mjs";
export { default as HTMLDocumentTagsElement } from "./document-tags.mjs";
export { default as HTMLFilePickerElement } from "./file-picker.mjs";
export { default as HTMLHueSelectorSlider } from "./hue-slider.mjs";
export { default as HTMLRangePickerElement } from "./range-picker.mjs";
export { default as HTMLStringTagsElement } from "./string-tags.mjs";
export { default as HTMLProseMirrorElement } from "./prosemirror-editor.mjs";
export * from "./multi-select.mjs";

// TODO: Figure out if custom elements need to be otherwise registered for TS compatibility
