import "./content-link-plugin.mts";
import "./dirty-plugin.mts";
import "./dropdown.mts";
import "./extensions.mts";
import "./image-plugin.mts";
import "./input-rules.mts";
import "./keymaps.mts";
import "./menu.mts";
import "./plugin.mts";
import type * as ProseMirrorObject from "./prosemirror.mts";
import "./schema.mts";
import "./string-serializer.mts";
import "./util.mts";

declare global {
  let ProseMirror: typeof ProseMirrorObject;
}
