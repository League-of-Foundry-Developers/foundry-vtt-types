import "./click-handler.d.mts";
import "./content-link-plugin.d.mts";
import "./dirty-plugin.d.mts";
import "./dom-parser.d.mts";
import "./dropdown.d.mts";
import "./extensions.d.mts";
import "./highlight-matches-plugin.d.mts";
import "./image-plugin.d.mts";
import "./input-rules.d.mts";
import "./keymaps.d.mts";
import "./menu.d.mts";
import "./paste-transformer.d.mts";
import "./plugin.d.mts";
import type * as ProseMirrorObject from "./prosemirror.d.mts";
import "./schema/index.d.mts";
import "./schema.d.mts";
import "./string-serializer.d.mts";
import "./util.d.mts";

declare global {
  let ProseMirror: typeof ProseMirrorObject;
}
