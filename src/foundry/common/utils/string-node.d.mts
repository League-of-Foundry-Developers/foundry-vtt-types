import type { EmptyObject, Identity, InexactPartial } from "#utils";

/**
 * A class that behaves like a lightweight DOM node, allowing children to be appended. Serializes to an HTML string.
 */
declare class StringNode<
  Tag extends string | undefined = undefined,
  Attrs extends Record<string, string> = EmptyObject,
> {
  /**
   * @param tag    - The tag name. If none is provided, this node's children will not be wrapped in an outer tag.
   * @param attrs  - The tag attributes. (default: `{}`)
   * @param inline - Whether the node appears inline or as a block. (default: `true`)
   */
  constructor(tag?: Tag, attrs?: Attrs, inline?: boolean);

  /**
   * The tag name.
   * @privateRemarks Not defined in the class body, but during construction, with `writable: false`
   */
  readonly tag: Tag;

  /**
   * The tag attributes.
   * @privateRemarks Not defined in the class body, but during construction, with `writable: false`
   */
  readonly attrs: Attrs;

  /**
   * Whether the node appears inline or as a block.
   */
  get inline(): boolean;

  /**
   * Append a child to this string node.
   * @param child - The child node or string.
   * @throws If attempting to append a child to a void element.
   */
  appendChild(child: StringNode.Any | string): void;

  /**
   * Serialize the StringNode structure into a single string.
   * @param spaces - The number of spaces to use for indentation (maximum 10). If this value is a string,
   * that string is used as indentation instead (or the first 10 characters if it is longer).   *
   */
  toString(spaces?: string | number, internal?: StringNode.ToStringInternalOptions): string;

  /**
   * Convert an HTML string to a StringNode.
   * @param html - The HTML string.
   * @throws If unable to perform conversion.
   */
  static fromString(html: string): StringNode.Any;

  #StringNode: true;
}

declare namespace StringNode {
  interface Any extends AnyStringNode {}
  interface AnyConstructor extends Identity<typeof AnyStringNode> {}

  /** @internal */
  interface _ToStringInternalOptions {
    /** @defaultValue `0` */
    _depth: number;

    /** @defaultValue `false` */
    _inlineParent: boolean;
  }

  interface ToStringInternalOptions extends InexactPartial<_ToStringInternalOptions> {}
}

export { StringNode as default };

declare abstract class AnyStringNode extends StringNode<string | undefined, Record<string, string>> {
  constructor(...args: never);
}
