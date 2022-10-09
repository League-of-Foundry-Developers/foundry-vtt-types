import "./content-link-plugin.mjs";
import "./dirty-plugin.mjs";
import "./dropdown.mjs";
import "./extensions.mjs";
import "./image-plugin.mjs";
import "./input-rules.mjs";
import "./keymaps.mjs";
import "./menu.mjs";
import "./plugin.mjs";
import * as ProseMirrorObject from "./prosemirror.mjs";
import "./schema.mjs";
import "./string-serializer.mjs";
import "./util.mjs";

declare global {
  let ProseMirror: typeof ProseMirrorObject;
}
