import type { Schema } from "prosemirror-model";
// splitListItem is set as the handler for the `list_item` node on the schema
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { splitListItem } from "prosemirror-schema-list";
import type {
  paragraph,
  blockquote,
  hr as horizontal_rule,
  heading,
  pre as code_block,
  br as hard_break,
} from "./schema/core.d.mts";
import type {
  ol as ordered_list,
  ul as bullet_list,
  li as list_item,
  liText as list_item_text,
} from "./schema/lists.d.mts";
import type {
  builtInTableNodes,
  tableComplex as table_complex,
  colgroup,
  col,
  thead,
  tbody,
  tfoot,
  caption,
  captionBlock as caption_block,
  tableRowComplex as table_row_complex,
  tableCellComplex as table_cell_complex,
  tableCellComplexBlock as table_cell_complex_block,
  tableHeaderComplex as table_header_complex,
  tableHeaderComplexBlock as table_header_complex_block,
} from "./schema/tables.d.mts";
import type {
  details,
  summary,
  summaryBlock as summary_block,
  dl,
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
import type {
  superscript,
  subscript,
  span,
  font,
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type AttributeCapture from "./schema/attribute-capture.d.mts";

export declare const nodes: {
  // Core Nodes.
  doc: { content: string };
  text: { group: string };
  paragraph: typeof paragraph;
  blockquote: typeof blockquote;
  secret: ReturnType<typeof SecretNode.make>;
  horizontal_rule: typeof horizontal_rule;
  heading: typeof heading;
  code_block: typeof code_block;
  image_link: ReturnType<typeof ImageLinkNode.make>;
  image: ReturnType<typeof ImageNode.make>;
  hard_break: typeof hard_break;

  // Lists.
  ordered_list: typeof ordered_list;
  bullet_list: typeof bullet_list;
  list_item: typeof list_item;
  list_item_text: typeof list_item_text;

  // Tables
  table_complex: typeof table_complex;
  tbody: typeof tbody;
  thead: typeof thead;
  tfoot: typeof tfoot;
  caption: typeof caption;
  caption_block: typeof caption_block;
  colgroup: typeof colgroup;
  col: typeof col;
  table_row_complex: typeof table_row_complex;
  table_cell_complex: typeof table_cell_complex;
  table_header_complex: typeof table_header_complex;
  table_cell_complex_block: typeof table_cell_complex_block;
  table_header_complex_block: typeof table_header_complex_block;
  // ...(typeof builtInTableNodes):
  table: (typeof builtInTableNodes)["table"];
  table_cell: (typeof builtInTableNodes)["table_cell"];
  table_header: (typeof builtInTableNodes)["table_header"];
  table_row: (typeof builtInTableNodes)["table_row"];

  // Misc.
  details: typeof details;
  summary: typeof summary;
  summary_block: typeof summary_block;
  dl: typeof dl;
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
};

export declare const marks: {
  superscript: typeof superscript;
  subscript: typeof subscript;
  span: typeof span;
  font: typeof font;
  link: ReturnType<typeof LinkMark.make>;
  em: typeof em;
  strong: typeof strong;
  underline: typeof underline;
  strikethrough: typeof strikethrough;
  code: typeof code;
};

export declare const schema: Schema<keyof typeof nodes, keyof typeof marks>;
