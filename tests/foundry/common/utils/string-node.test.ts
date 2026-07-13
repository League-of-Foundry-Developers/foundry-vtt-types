import { describe, expect, expectTypeOf, test } from "vitest";
import type { EmptyObject } from "fvtt-types/utils";

import StringNode = foundry.utils.StringNode;

describe("StringNode Tests", () => {
  const tagName = "span";
  const attrs = { name: "foo", id: "bar", class: "fizz buzz" } as const;

  test("Construction & Generics", () => {
    const noArgs = new StringNode();
    expect(noArgs).toBeInstanceOf(StringNode);
    expectTypeOf(noArgs).toEqualTypeOf<StringNode<undefined, EmptyObject>>();
    expect(noArgs.tag).toBeUndefined();
    expect(noArgs.attrs).toEqual({});
    expect(noArgs.inline).toBe(true);

    const withArgs = new StringNode(tagName, attrs);
    expect(withArgs).toBeInstanceOf(StringNode);
    expectTypeOf(withArgs).toEqualTypeOf<StringNode<"span", typeof attrs>>();
    expect(withArgs.tag).toBe("span");
    expect(withArgs.attrs).toEqual(attrs);
    expect(withArgs.inline).toBe(true);
  });

  test("inline & appendChild", () => {
    const blockNode = new StringNode("div", {}, false);

    expectTypeOf(blockNode.inline).toBeBoolean();
    expect(blockNode.inline).toBe(true); // has no children, so not falling back to this.#inline yet

    blockNode.appendChild("a text node");

    expect(blockNode.inline).toBe(false);

    blockNode.appendChild(StringNode.fromString("<p>A paragraph</p>"));
  });

  test("toString & fromString", () => {
    const initialString = `<div id="someDiv"><i>text</i></div>`;

    const node = StringNode.fromString(initialString);
    expectTypeOf(node).toEqualTypeOf<StringNode.Any>();
    expect(node.inline).toBe(true);

    const outString = node.toString();
    expectTypeOf(outString).toBeString();
    expect(outString).toBe(initialString);
  });
});
