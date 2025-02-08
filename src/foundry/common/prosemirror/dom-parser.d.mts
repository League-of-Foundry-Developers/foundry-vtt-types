import { DOMParser as BaseDOMParser, Node, ParseOptions, Schema } from "prosemirror-model";
import type { FixedInstanceType } from "fvtt-types/utils";

export default DOMParser;

declare class DOMParser extends BaseDOMParser {
  override parse(dom: FixedInstanceType<typeof window.Node>, options?: ParseOptions): Node;

  static override fromSchema(schema: Schema): BaseDOMParser;
}
