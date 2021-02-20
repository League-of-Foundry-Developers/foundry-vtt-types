import * as tinyMCE from 'tinymce';

declare global {
  type Editor = tinyMCE.Editor;
  type RawEditorSettings = tinyMCE.RawEditorSettings;
}
