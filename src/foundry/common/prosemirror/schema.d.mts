import type { MarkSpec, NodeSpec, Schema } from "prosemirror-model";
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

export declare const nodes: {
  doc: { content: string };
  text: { content: string };
  paragraph: typeof paragraph;
  blockquote: typeof blockquote;
  secret: NodeSpec | MarkSpec;
  horizontal_rule: typeof horizontal_rule;
  heading: typeof heading;
  code_block: typeof code_block;
  image_link: NodeSpec | MarkSpec;
  image: NodeSpec | MarkSpec;
  hard_break: typeof hard_break;

  ordered_list: typeof ordered_list;
  bullet_list: typeof bullet_list;
  list_item: typeof list_item;
  list_item_text: typeof list_item_text;

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
  table: Record<string, unknown>;
  table_cell: Record<string, unknown>;
  table_header: Record<string, unknown>;
  table_row: Record<string, unknown>;

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
  link: NodeSpec | MarkSpec;
  em: typeof em;
  strong: typeof strong;
  underline: typeof underline;
  strikethrough: typeof strikethrough;
  code: typeof code;
};

export declare const schema: Schema;
