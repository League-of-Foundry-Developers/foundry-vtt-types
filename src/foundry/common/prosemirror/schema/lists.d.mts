import type { RequiredProps } from "#utils";
import type { NodeSpec } from "prosemirror-model";

export declare const ol: RequiredProps<NodeSpec, "content" | "managed" | "group" | "attrs" | "parseDOM" | "toDOM">;

export declare const ul: RequiredProps<NodeSpec, "content" | "group" | "parseDOM" | "toDOM">;

/**
 * ProseMirror enforces a stricter subset of HTML where block and inline content cannot be mixed. For example, the
 * following is valid HTML:
 * <ul>
 *   <li>
 *     The first list item.
 *     <ul>
 *       <li>An embedded list.</li>
 *     </ul>
 *   </li>
 * </ul>
 *
 * But, since the contents of the <li> would mix inline content (the text), with block content (the inner <ul>), the
 * schema is defined to only allow block content, and would transform the items to look like this:
 * <ul>
 *   <li>
 *     <p>The first list item.</p>
 *     <ul>
 *       <li><p>An embedded list.</p></li>
 *     </ul>
 *   </li>
 * </ul>
 *
 * We can address this by hooking into the DOM parsing and 'tagging' the extra paragraph elements inserted this way so
 * that when the contents are serialized again, they can be removed. This is left as a TODO for now.
 */
export declare const li: RequiredProps<NodeSpec, "content" | "defining" | "parseDOM" | "toDOM">;

export declare const liText: RequiredProps<NodeSpec, "content" | "defining" | "parseDOM" | "toDOM">;
