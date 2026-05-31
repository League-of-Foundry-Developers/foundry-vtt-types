// Several imports are just used for links in this file
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { MarkSpec, NodeSpec, Schema } from "prosemirror-model";
// splitListItem is set as the handler for the `list_item` node on the schema but isn't used in an externally visible way
// import type { splitListItem } from "prosemirror-schema-list";
import type {
  paragraph,
  blockquote,
  hr as horizontal_rule,
  heading,
  pre as code_block,
  br as hard_break,
  icon,
} from "./schema/core.d.mts";
import type { ol as ordered_list, ul as bullet_list, li as list_item } from "./schema/lists.d.mts";
import type { builtInTableNodes } from "./schema/tables.d.mts";
import type {
  dl,
  dl_group,
  dt,
  dd,
  fieldset,
  legend,
  picture,
  audio,
  video,
  track,
  source,
  object,
  figure,
  figcaption,
  small,
  ruby,
  rp,
  rt,
  iframe,
} from "./schema/other.d.mts";
import type DisclosureWidget from "./schema/disclosure.d.mts";
import type { selection } from "./schema/inserts.d.mts";
import type {
  superscript,
  subscript,
  span,
  font,
  size,
  color,
  cite,
  em,
  strong,
  underline,
  strikethrough,
  code,
} from "./schema/marks.d.mts";
import type ImageNode from "./schema/image-node.d.mts";
import type LinkMark from "./schema/link-mark.d.mts";
import type ImageLinkNode from "./schema/image-link-node.d.mts";
import type SecretNode from "./schema/secret-node.d.mts";
// AttributeCapture#attributeCapture is used as a bound handler for all nodes and marks
// import type AttributeCapture from "./schema/attribute-capture.d.mts";
import type { Identity } from "#utils";

export declare const nodes: Nodes;

interface Nodes extends Identity<typeof builtInTableNodes> {
  // Core Nodes.
  doc: Doc;
  text: Text;
  paragraph: typeof paragraph;
  blockquote: typeof blockquote;

  /** @remarks See{@linkcode SecretNode.make} */
  secret: NodeSpec;
  horizontal_rule: typeof horizontal_rule;
  heading: typeof heading;
  code_block: typeof code_block;

  /** @remarks See {@linkcode ImageLinkNode.make} */
  image_link: NodeSpec;

  /** @remarks See {@linkcode ImageNode.make} */
  image: NodeSpec;
  icon: typeof icon;
  hard_break: typeof hard_break;

  // Lists.
  ordered_list: typeof ordered_list;
  bullet_list: typeof bullet_list;
  list_item: typeof list_item;

  // Disclosure.
  details: DisclosureWidget.Nodes["details"];
  summary: DisclosureWidget.Nodes["summary"];

  // Inserts.
  selection: typeof selection;

  // Misc.
  dl: typeof dl;
  dl_group: typeof dl_group;
  dt: typeof dt;
  dd: typeof dd;
  fieldset: typeof fieldset;
  legend: typeof legend;
  picture: typeof picture;
  audio: typeof audio;
  video: typeof video;
  track: typeof track;
  source: typeof source;
  object: typeof object;
  figure: typeof figure;
  figcaption: typeof figcaption;
  small: typeof small;
  ruby: typeof ruby;
  rp: typeof rp;
  rt: typeof rt;
  iframe: typeof iframe;

  // Auto-generated specifications for HTML preservation.
  header: NodeSpec;
  main: NodeSpec;
  section: NodeSpec;
  article: NodeSpec;
  aside: NodeSpec;
  nav: NodeSpec;
  footer: NodeSpec;
  div: NodeSpec;
  address: NodeSpec;
}

interface Doc {
  /** @defaultValue `"block+"` */
  content: string;
}

interface Text {
  /** @defaultValue `"inline"` */
  group: string;
}

export declare const marks: Marks;

interface Marks {
  superscript: typeof superscript;
  subscript: typeof subscript;
  span: typeof span;
  font: typeof font;
  size: typeof size;
  color: typeof color;
  cite: typeof cite;

  /** @remarks See {@linkcode LinkMark.make} */
  link: NodeSpec;
  em: typeof em;
  strong: typeof strong;
  underline: typeof underline;
  strikethrough: typeof strikethrough;
  code: typeof code;

  // Auto-generated specifications for HTML preservation.
  abbr: MarkSpec;
  mark: MarkSpec;
  q: MarkSpec;
  time: MarkSpec;
  ins: MarkSpec;
}

export declare const schema: Schema<keyof typeof nodes, keyof typeof marks>;
