import { DOMParser as BaseDOMParser, Node, ParseOptions, Schema } from "prosemirror-model";
import type { InstanceType } from "../../../utils/index.d.mts";

export default DOMParser;

declare class DOMParser extends BaseDOMParser {
  override parse(dom: InstanceType<typeof window.Node>, options?: ParseOptions | undefined): Node;

  static override fromSchema(schema: Schema): BaseDOMParser;
}
